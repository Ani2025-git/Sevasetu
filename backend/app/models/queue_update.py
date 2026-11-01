from datetime import datetime
from app.models import db

class QueueUpdate(db.Model):
    __tablename__ = 'queue_updates'

    id = db.Column(db.Integer, primary_key=True)
    centre_id = db.Column(db.Integer, db.ForeignKey('centres.id', ondelete='CASCADE'), nullable=False)
    queue_status = db.Column(db.String(20), nullable=False) # 'LOW', 'MODERATE', 'HIGH', 'UNKNOWN'
    source_type = db.Column(db.String(50), nullable=False, default='ADMIN_DIRECT')
    source_description = db.Column(db.String(255), nullable=False)
    supporting_observations = db.Column(db.Integer, default=0, nullable=False)
    updated_by = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False, index=True)

    def to_dict(self):
        return {
            'id': self.id,
            'centre_id': self.centre_id,
            'centre_name': self.centre.name if self.centre else None,
            'queue_status': self.queue_status,
            'source_type': self.source_type,
            'source_description': self.source_description,
            'supporting_observations': self.supporting_observations,
            'updated_by': self.updated_by,
            'author_name': self.author.name if self.author else 'Admin',
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

