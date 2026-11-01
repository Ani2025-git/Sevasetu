from datetime import datetime
from app.models import db

class Service(db.Model):
    __tablename__ = 'services'

    id = db.Column(db.Integer, primary_key=True)
    centre_id = db.Column(db.Integer, db.ForeignKey('centres.id', ondelete='CASCADE'), nullable=True) # nullable so services can exist independently
    name = db.Column(db.String(150), nullable=False)
    category = db.Column(db.String(80), nullable=False, default='Certificates & Revenue')
    description = db.Column(db.Text, nullable=False)
    department = db.Column(db.String(150), nullable=True, default='Government of West Bengal')
    eligibility = db.Column(db.Text, nullable=True)
    required_documents = db.Column(db.Text, nullable=True) # Text or JSON list of documents
    application_process = db.Column(db.Text, nullable=True) # Online procedure steps
    offline_instructions = db.Column(db.Text, nullable=True) # Where & how to apply in person (BSK / BDO office)
    online_apply_url = db.Column(db.String(255), nullable=True) # Official verified apply link
    official_source_url = db.Column(db.String(255), nullable=True) # Official department info portal
    fees = db.Column(db.String(100), nullable=True, default='Free of Cost at BSK / Official Portal')
    expected_processing_time = db.Column(db.String(100), nullable=True, default='7 - 15 Working Days (Typical)')
    verification_status = db.Column(db.String(50), nullable=False, default='OFFICIALLY_VERIFIED') # 'OFFICIALLY_VERIFIED', 'REQUIRES_VERIFICATION'
    last_verified_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=True)
    is_active = db.Column(db.Boolean, default=True, nullable=False)

    def to_dict(self):
        docs = []
        if self.required_documents:
            docs = [d.strip() for d in self.required_documents.split('\n') if d.strip()]
        return {
            'id': self.id,
            'centre_id': self.centre_id,
            'centre_name': self.centre.name if self.centre else 'All BSKs across West Bengal',
            'name': self.name,
            'category': self.category,
            'description': self.description,
            'department': self.department or 'Government of West Bengal',
            'eligibility': self.eligibility or 'Permanent resident of West Bengal with required identity documents.',
            'required_documents': docs,
            'raw_required_documents': self.required_documents or '',
            'application_process': self.application_process or '',
            'offline_instructions': self.offline_instructions or 'Visit your nearest Bangla Sahayata Kendra (BSK) or Block Development Office (BDO) with printed documents.',
            'online_apply_url': self.online_apply_url or self.official_source_url,
            'official_source_url': self.official_source_url,
            'fees': self.fees or 'Free of Cost',
            'expected_processing_time': self.expected_processing_time or '7 - 15 Working Days',
            'verification_status': self.verification_status or 'OFFICIALLY_VERIFIED',
            'last_verified_at': self.last_verified_at.isoformat() if self.last_verified_at else None,
            'is_active': self.is_active
        }
