import os
import sys

# Ensure backend directory is in python path
current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.abspath(os.path.join(current_dir, '..'))
backend_dir = os.path.join(root_dir, 'backend')

if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app import create_app
from app.models import db
from app.models.user import User

app = create_app()

# Auto-seed database on serverless cold start if needed without dropping user records
with app.app_context():
    try:
        from app.models.centre import Centre
        from app.models.scheme import GovernmentScheme
        from app.models.website_setting import WebsiteSettings
        db.create_all()
        WebsiteSettings.get_settings()
        from seed import ensure_demo_users, seed_database, seed_schemes
        ensure_demo_users()
        if Centre.query.count() == 0:
            seed_database(drop_existing=False)
            print("Auto-seeded database in serverless environment.")
        elif GovernmentScheme.query.count() == 0:
            seed_schemes()
            print("Auto-seeded government schemes in serverless environment.")
    except Exception as e:
        print(f"Serverless DB setup check: {e}")

# Vercel WSGI entry point
# Exports 'app' for @vercel/python

