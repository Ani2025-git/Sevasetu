from datetime import datetime
import re
from app.models import db

def generate_slug(text):
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    return text.strip('-')

class SchemeCategory(db.Model):
    __tablename__ = 'scheme_categories'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    slug = db.Column(db.String(120), nullable=False, unique=True, index=True)
    description = db.Column(db.Text, nullable=True)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    schemes = db.relationship('GovernmentScheme', backref='category_rel', lazy='dynamic')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'slug': self.slug,
            'description': self.description,
            'is_active': self.is_active
        }

class SchemeDepartment(db.Model):
    __tablename__ = 'scheme_departments'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False, unique=True)
    official_website = db.Column(db.String(255), nullable=True)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    schemes = db.relationship('GovernmentScheme', backref='department_rel', lazy='dynamic')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'official_website': self.official_website,
            'description': self.description
        }

class GovernmentScheme(db.Model):
    __tablename__ = 'government_schemes'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    slug = db.Column(db.String(220), nullable=False, unique=True, index=True)
    short_description = db.Column(db.Text, nullable=False)
    full_description = db.Column(db.Text, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('scheme_categories.id'), nullable=False, index=True)
    department_id = db.Column(db.Integer, db.ForeignKey('scheme_departments.id'), nullable=True, index=True)
    beneficiary_summary = db.Column(db.String(255), nullable=True)
    application_instructions = db.Column(db.Text, nullable=True)
    official_application_url = db.Column(db.String(500), nullable=True)
    official_info_url = db.Column(db.String(500), nullable=True)
    
    # Statuses: DRAFT, PENDING_VERIFICATION, VERIFIED, PUBLISHED, ARCHIVED
    status = db.Column(db.String(30), default='DRAFT', nullable=False, index=True)
    verification_status = db.Column(db.String(30), default='DRAFT', nullable=False)
    last_verified_at = db.Column(db.DateTime, nullable=True)
    
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    updated_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    eligibility_rules = db.relationship('SchemeEligibilityRule', backref='scheme', lazy='dynamic', cascade='all, delete-orphan')
    required_documents = db.relationship('SchemeRequiredDocument', backref='scheme', lazy='dynamic', cascade='all, delete-orphan')
    official_sources = db.relationship('SchemeOfficialSource', backref='scheme', lazy='dynamic', cascade='all, delete-orphan')
    verification_history = db.relationship('SchemeVerificationHistory', backref='scheme', lazy='dynamic', cascade='all, delete-orphan', order_by='SchemeVerificationHistory.created_at.desc()')
    creator = db.relationship('User', foreign_keys=[created_by])
    updater = db.relationship('User', foreign_keys=[updated_by])

    def to_dict(self, include_details=True):
        data = {
            'id': self.id,
            'name': self.name,
            'slug': self.slug,
            'short_description': self.short_description,
            'category_id': self.category_id,
            'category_name': self.category_rel.name if self.category_rel else 'General Welfare',
            'category_slug': self.category_rel.slug if self.category_rel else 'general',
            'department_id': self.department_id,
            'department_name': self.department_rel.name if self.department_rel else 'Government of West Bengal',
            'department_website': self.department_rel.official_website if self.department_rel else None,
            'beneficiary_summary': self.beneficiary_summary or 'Eligible citizens of West Bengal',
            'status': self.status,
            'verification_status': self.verification_status,
            'last_verified_at': self.last_verified_at.isoformat() if self.last_verified_at else None,
            'official_application_url': self.official_application_url,
            'official_info_url': self.official_info_url,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }

        if include_details:
            data['full_description'] = self.full_description
            data['application_instructions'] = self.application_instructions or ''
            data['eligibility_rules'] = [r.to_dict() for r in self.eligibility_rules.all()]
            data['required_documents'] = [d.to_dict() for d in self.required_documents.all()]
            data['official_sources'] = [s.to_dict() for s in self.official_sources.all()]
            data['verification_history'] = [h.to_dict() for h in self.verification_history.limit(10).all()]
        
        return data

class SchemeEligibilityRule(db.Model):
    __tablename__ = 'scheme_eligibility_rules'

    id = db.Column(db.Integer, primary_key=True)
    scheme_id = db.Column(db.Integer, db.ForeignKey('government_schemes.id', ondelete='CASCADE'), nullable=False, index=True)
    rule_type = db.Column(db.String(50), default='GENERAL', nullable=False) # AGE, INCOME, RESIDENCE, OCCUPATION, GENDER, CASTE, EDUCATION, GENERAL
    rule_description = db.Column(db.Text, nullable=False)
    minimum_age = db.Column(db.Integer, nullable=True)
    maximum_age = db.Column(db.Integer, nullable=True)
    minimum_income = db.Column(db.Float, nullable=True)
    maximum_income = db.Column(db.Float, nullable=True)
    residence_requirement = db.Column(db.String(200), nullable=True)
    occupation_requirement = db.Column(db.String(200), nullable=True)
    is_mandatory = db.Column(db.Boolean, default=True, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'scheme_id': self.scheme_id,
            'rule_type': self.rule_type,
            'rule_description': self.rule_description,
            'minimum_age': self.minimum_age,
            'maximum_age': self.maximum_age,
            'minimum_income': self.minimum_income,
            'maximum_income': self.maximum_income,
            'residence_requirement': self.residence_requirement,
            'occupation_requirement': self.occupation_requirement,
            'is_mandatory': self.is_mandatory
        }

class SchemeRequiredDocument(db.Model):
    __tablename__ = 'scheme_required_documents'

    id = db.Column(db.Integer, primary_key=True)
    scheme_id = db.Column(db.Integer, db.ForeignKey('government_schemes.id', ondelete='CASCADE'), nullable=False, index=True)
    document_name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    is_mandatory = db.Column(db.Boolean, default=True, nullable=False)
    source_reference = db.Column(db.String(255), nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'scheme_id': self.scheme_id,
            'document_name': self.document_name,
            'description': self.description,
            'is_mandatory': self.is_mandatory,
            'source_reference': self.source_reference
        }

class SchemeOfficialSource(db.Model):
    __tablename__ = 'scheme_official_sources'

    id = db.Column(db.Integer, primary_key=True)
    scheme_id = db.Column(db.Integer, db.ForeignKey('government_schemes.id', ondelete='CASCADE'), nullable=False, index=True)
    source_title = db.Column(db.String(200), nullable=False)
    source_url = db.Column(db.String(500), nullable=False)
    source_department = db.Column(db.String(200), nullable=True)
    source_type = db.Column(db.String(50), default='OFFICIAL_PORTAL', nullable=False) # OFFICIAL_PORTAL, GOVERNMENT_ORDER, GAZETTE, DEPARTMENT_WEBSITE
    verified_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'scheme_id': self.scheme_id,
            'source_title': self.source_title,
            'source_url': self.source_url,
            'source_department': self.source_department,
            'source_type': self.source_type,
            'verified_at': self.verified_at.isoformat() if self.verified_at else None
        }

class SchemeVerificationHistory(db.Model):
    __tablename__ = 'scheme_verification_history'

    id = db.Column(db.Integer, primary_key=True)
    scheme_id = db.Column(db.Integer, db.ForeignKey('government_schemes.id', ondelete='CASCADE'), nullable=False, index=True)
    admin_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    previous_status = db.Column(db.String(30), nullable=False)
    new_status = db.Column(db.String(30), nullable=False)
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    admin = db.relationship('User', foreign_keys=[admin_id])

    def to_dict(self):
        return {
            'id': self.id,
            'scheme_id': self.scheme_id,
            'admin_id': self.admin_id,
            'admin_name': self.admin.name if self.admin else 'System Administrator',
            'previous_status': self.previous_status,
            'new_status': self.new_status,
            'notes': self.notes or '',
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

