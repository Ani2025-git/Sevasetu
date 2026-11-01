from datetime import datetime
from app.models import db

class Service(db.Model):
    __tablename__ = 'services'

    id = db.Column(db.Integer, primary_key=True)
    centre_id = db.Column(db.Integer, db.ForeignKey('centres.id', ondelete='CASCADE'), nullable=False)
    name = db.Column(db.String(150), nullable=False)
    category = db.Column(db.String(80), nullable=False, default='General Certificates')
    description = db.Column(db.Text, nullable=False)
    required_documents = db.Column(db.Text, nullable=True) # Text or JSON list of documents
    official_source_url = db.Column(db.String(255), nullable=True)
    last_verified_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=True)
    is_active = db.Column(db.Boolean, default=True, nullable=False)

    def to_dict(self):
        docs = []
        if self.required_documents:
            docs = [d.strip() for d in self.required_documents.split('\n') if d.strip()]
        return {
            'id': self.id,
            'centre_id': self.centre_id,
            'centre_name': self.centre.name if self.centre else None,
            'name': self.name,
            'category': self.category,
            'description': self.description,
            'required_documents': docs,
            'raw_required_documents': self.required_documents,
            'official_source_url': self.official_source_url,
            'last_verified_at': self.last_verified_at.isoformat() if self.last_verified_at else None,
            'is_active': self.is_active
        }

