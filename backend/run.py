import os
import sys

# Ensure backend directory is in path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from app.models import db
from app.models.user import User

app = create_app()

# Ensure default records exist without wiping user accounts
with app.app_context():
    try:
        from app.models.centre import Centre
        from app.models.scheme import GovernmentScheme
        db.create_all()
        from seed import ensure_demo_users, seed_database, seed_schemes
        ensure_demo_users()
        if Centre.query.count() == 0:
            seed_database(drop_existing=False)
            print("Auto-seeded default records for Seva Setu deployment.")
        elif GovernmentScheme.query.count() == 0:
            seed_schemes()
            print("Auto-seeded government schemes.")
    except Exception as e:
        print(f"Startup DB check: {e}")

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    print(f"Starting SevaQueue Backend API on 0.0.0.0:{port}")
    app.run(host='0.0.0.0', port=port, debug=debug)
