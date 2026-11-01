from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Ensure all models are imported so SQLAlchemy metadata registers all tables
from app.models.user import User
from app.models.centre import Centre
from app.models.service import Service
from app.models.setting import Setting
from app.models.audit_log import AuditLog
from app.models.saved_service import SavedService
from app.models.observation import Observation
from app.models.queue_update import QueueUpdate

