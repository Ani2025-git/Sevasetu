from datetime import datetime
from app.models import db

class WebsiteSettings(db.Model):
    __tablename__ = 'website_settings'

    id = db.Column(db.Integer, primary_key=True)
    is_maintenance_mode = db.Column(db.Boolean, default=False, nullable=False)
    
    # Multilingual Titles
    maintenance_title_en = db.Column(db.String(255), default="We'll Be Back Soon", nullable=False)
    maintenance_title_bn = db.Column(db.String(255), default="আমরা শীঘ্রই ফিরে আসব", nullable=False)
    maintenance_title_hi = db.Column(db.String(255), default="हम जल्द ही वापस आएंगे", nullable=False)
    
    # Multilingual Messages
    maintenance_message_en = db.Column(
        db.Text,
        default="Seva Setu is temporarily unavailable while we carry out maintenance. Please visit again soon.",
        nullable=False
    )
    maintenance_message_bn = db.Column(
        db.Text,
        default="সেবা সেতু প্ল্যাটফর্মটি সাময়িকভাবে রক্ষণাবেক্ষণের অধীনে রয়েছে। অনুগ্রহ করে শীঘ্রই আবার পরিদর্শন করুন।",
        nullable=False
    )
    maintenance_message_hi = db.Column(
        db.Text,
        default="सेवा सेतु प्लेटफॉर्म अस्थायी रूप से रखरखाव के अधीन है। कृपया जल्द ही पुनः पधारें।",
        nullable=False
    )

    estimated_reopening_at = db.Column(db.DateTime, nullable=True)
    support_contact_email = db.Column(db.String(120), default="support@sevasetu.org", nullable=True)
    
    updated_by = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    updater = db.relationship('User', foreign_keys=[updated_by], lazy='joined')

    @classmethod
    def get_settings(cls):
        """Returns the singleton website settings record or creates default if missing."""
        settings = cls.query.first()
        if not settings:
            settings = cls(
                is_maintenance_mode=False,
                maintenance_title_en="We'll Be Back Soon",
                maintenance_title_bn="আমরা শীঘ্রই ফিরে আসব",
                maintenance_title_hi="हम जल्द ही वापस आएंगे",
                maintenance_message_en="Seva Setu is temporarily unavailable while we carry out maintenance. Please visit again soon.",
                maintenance_message_bn="সেবা সেতু প্ল্যাটফর্মটি সাময়িকভাবে রক্ষণাবেক্ষণের অধীনে রয়েছে। অনুগ্রহ করে শীঘ্রই আবার পরিদর্শন করুন।",
                maintenance_message_hi="सेवा सेतु प्लेटफॉर्म अस्थायी रूप से रखरखाव के अधीन है। कृपया जल्द ही पुनः पधारें।",
                support_contact_email="support@sevasetu.org"
            )
            try:
                db.session.add(settings)
                db.session.commit()
            except Exception:
                db.session.rollback()
                settings = cls.query.first()
        return settings

    def to_dict(self):
        return {
            'id': self.id,
            'is_maintenance_mode': self.is_maintenance_mode,
            'status': 'OFFLINE' if self.is_maintenance_mode else 'ONLINE',
            'titles': {
                'en': self.maintenance_title_en or "We'll Be Back Soon",
                'bn': self.maintenance_title_bn or "আমরা শীঘ্রই ফিরে আসব",
                'hi': self.maintenance_title_hi or "हम जल्द ही वापस आएंगे",
            },
            'messages': {
                'en': self.maintenance_message_en,
                'bn': self.maintenance_message_bn,
                'hi': self.maintenance_message_hi,
            },
            'estimated_reopening_at': self.estimated_reopening_at.isoformat() if self.estimated_reopening_at else None,
            'support_contact_email': self.support_contact_email or 'support@sevasetu.org',
            'updated_by': self.updated_by,
            'updated_by_name': self.updater.name if self.updater else 'System Administrator',
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
