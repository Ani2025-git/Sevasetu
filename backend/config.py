import os
from datetime import timedelta

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'sevaqueue-secret-key-2026-pilot-wb-bsk-secure')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'sevaqueue-jwt-secret-key-wb-pilot-2026')
    JWT_EXPIRATION_HOURS = int(os.getenv('JWT_EXPIRATION_HOURS', '24'))
    
    raw_db_url = os.getenv('DATABASE_URL', '').strip()
    if raw_db_url:
        # Normalize postgres:// to postgresql://
        if raw_db_url.startswith('postgres://'):
            raw_db_url = raw_db_url.replace('postgres://', 'postgresql://', 1)

        # Ensure dialect matches installed driver (psycopg v3 vs psycopg2 v2)
        try:
            import psycopg  # psycopg v3
        except ImportError:
            try:
                import psycopg2
                if raw_db_url.startswith('postgresql://'):
                    raw_db_url = raw_db_url.replace('postgresql://', 'postgresql+psycopg2://', 1)
            except ImportError:
                pass

        SQLALCHEMY_DATABASE_URI = raw_db_url
    else:
        db_path = os.path.join('/tmp', 'sevaqueue.db') if os.getenv('VERCEL') else os.path.join(BASE_DIR, 'sevaqueue.db')
        SQLALCHEMY_DATABASE_URI = f"sqlite:///{db_path}"

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True,
    }
    
    # Stale queue threshold in minutes (default 30 mins for this pilot)
    DEFAULT_STALE_THRESHOLD_MINUTES = int(os.getenv('STALE_THRESHOLD_MINUTES', '30'))
    
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', '*').split(',')

