from datetime import datetime
from app.models import db

class Observation(db.Model):
    __tablename__ = 'observations'

    id = db.Column(db.Integer, primary_key=True)
    observer_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    centre_id = db.Column(db.Integer, db.ForeignKey('centres.id', ondelete='CASCADE'), nullable=False)
    queue_status = db.Column(db.String(20), nullable=False) # 'LOW', 'MODERATE', 'HIGH', 'UNKNOWN'
    waiting_range = db.Column(db.String(50), nullable=True)
    notes = db.Column(db.Text, nullable=True)
    submission_source = db.Column(db.String(30), nullable=False, default='REGISTERED_OBSERVER') # 'REGISTERED_OBSERVER', 'PUBLIC_ANONYMOUS'
    review_status = db.Column(db.String(20), nullable=False, default='PENDING') # 'PENDING', 'APPROVED', 'REJECTED'
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    reviewed_by = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    reviewed_at = db.Column(db.DateTime, nullable=True)
    review_notes = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'observer_id': self.observer_id,
            'observer_name': self.observer.name if self.observer else 'Anonymous Citizen',
            'centre_id': self.centre_id,
            'centre_name': self.centre.name if self.centre else None,
            'queue_status': self.queue_status,
            'waiting_range': self.waiting_range,
            'notes': self.notes,
            'submission_source': self.submission_source,
            'review_status': self.review_status,
            'submitted_at': self.submitted_at.isoformat() if self.submitted_at else None,
            'reviewed_by': self.reviewed_by,
            'reviewer_name': self.reviewer.name if self.reviewer else None,
            'reviewed_at': self.reviewed_at.isoformat() if self.reviewed_at else None,
            'review_notes': self.review_notes
        }

