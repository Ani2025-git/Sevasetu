import os
from datetime import timedelta

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'sevaqueue-secret-key-2026-pilot-wb-bsk-secure')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'sevaqueue-jwt-secret-key-wb-pilot-2026')
    JWT_EXPIRATION_HOURS = int(os.getenv('JWT_EXPIRATION_HOURS', '24'))
    
    db_path = os.path.join('/tmp', 'sevaqueue.db') if os.getenv('VERCEL') else os.path.join(BASE_DIR, 'sevaqueue.db')
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL',
        f"sqlite:///{db_path}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Stale queue threshold in minutes (default 30 mins for this pilot)
    DEFAULT_STALE_THRESHOLD_MINUTES = int(os.getenv('STALE_THRESHOLD_MINUTES', '30'))
    
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', '*').split(',')

