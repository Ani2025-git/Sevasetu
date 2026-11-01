from datetime import datetime
from app.models import db

class Centre(db.Model):
    __tablename__ = 'centres'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    district = db.Column(db.String(100), nullable=False)
    block = db.Column(db.String(100), nullable=False)
    opening_hours = db.Column(db.String(100), nullable=False)
    weekly_holidays = db.Column(db.String(100), nullable=False)
    official_source_url = db.Column(db.String(255), nullable=True)
    contact_details = db.Column(db.String(200), nullable=True)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    services = db.relationship('Service', backref='centre', cascade='all, delete-orphan', lazy='dynamic')
    observations = db.relationship('Observation', backref='centre', cascade='all, delete-orphan', lazy='dynamic')
    queue_updates = db.relationship('QueueUpdate', backref='centre', cascade='all, delete-orphan', lazy='dynamic')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'address': self.address,
            'district': self.district,
            'block': self.block,
            'opening_hours': self.opening_hours,
            'weekly_holidays': self.weekly_holidays,
            'official_source_url': self.official_source_url,
            'contact_details': self.contact_details,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

