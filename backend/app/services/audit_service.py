from app.models import db
from app.models.audit_log import AuditLog

def log_audit(user_id, action, entity_type, entity_id=None, details=None):
    try:
        log = AuditLog(
            user_id=user_id,
            action=action,
            entity_type=entity_type,
            entity_id=str(entity_id) if entity_id is not None else None,
            details=details
        )
        db.session.add(log)
        db.session.commit()
        return log
    except Exception as e:
        db.session.rollback()
        print(f"Failed to write audit log: {e}")
        return None

