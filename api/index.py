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

# Auto-seed database on serverless cold start if needed
with app.app_context():
    try:
        db.create_all()
        if not User.query.filter_by(email="admin@sevaqueue.org").first():
            from seed import seed_database
            seed_database()
            print("Auto-seeded database in serverless environment.")
    except Exception as e:
        print(f"Serverless DB setup check: {e}")

# Vercel WSGI entry point
# Exports 'app' for @vercel/python
