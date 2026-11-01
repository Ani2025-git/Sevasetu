import os
import sys

# Ensure backend directory is in path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from app.models import db
from app.models.user import User

app = create_app()

# Auto-seed database if it doesn't have the demo users yet
with app.app_context():
    try:
        db.create_all()
        if not User.query.filter_by(email="admin@sevaqueue.org").first():
            from seed import seed_database
            seed_database()
            print("Auto-seeded database for deployment.")
    except Exception as e:
        print(f"Startup DB check: {e}")

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    print(f"Starting SevaQueue Backend API on 0.0.0.0:{port}")
    app.run(host='0.0.0.0', port=port, debug=debug)
