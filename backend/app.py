import os
import sys

backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app import create_app
from app.models import db

app = create_app()

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
    app.run(host='0.0.0.0', port=port, debug=debug)
