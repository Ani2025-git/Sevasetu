import os
import sys
import importlib.util

root_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(root_dir, 'backend')
backend_app_dir = os.path.join(backend_dir, 'app')

if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Register backend/app as the 'app' package in sys.modules so all internal
# imports (from app.models import ..., from app.routes import ...) resolve correctly
pkg_spec = importlib.util.spec_from_file_location(
    'app',
    os.path.join(backend_app_dir, '__init__.py'),
    submodule_search_locations=[backend_app_dir]
)
backend_app_pkg = importlib.util.module_from_spec(pkg_spec)
sys.modules['app'] = backend_app_pkg
pkg_spec.loader.exec_module(backend_app_pkg)

# Create Flask application instance
app = backend_app_pkg.create_app()
backend_app_pkg.app = app

# Auto-seed check on startup without dropping existing users
with app.app_context():
    try:
        from app.models import db
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
