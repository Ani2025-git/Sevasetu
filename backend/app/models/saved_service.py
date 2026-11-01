from datetime import datetime
from app.models import db

class SavedService(db.Model):
    __tablename__ = 'saved_services'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    service_id = db.Column(db.Integer, db.ForeignKey('services.id', ondelete='CASCADE'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    service = db.relationship('Service')
    user = db.relationship('User', backref=db.backref('saved_services', cascade='all, delete-orphan', lazy='dynamic'))

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'service_id': self.service_id,
            'service': self.service.to_dict() if self.service else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

