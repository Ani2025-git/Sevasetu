from flask import Flask, jsonify
from flask_cors import CORS
from app.models import db
from config import Config

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    CORS(app, origins=app.config.get('CORS_ORIGINS'), supports_credentials=True)

    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.public import public_bp
    from app.routes.observer import observer_bp
    from app.routes.admin import admin_bp
    from app.routes.schemes import schemes_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(public_bp)
    app.register_blueprint(observer_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(schemes_bp)

    # Maintenance mode check for all public endpoints
    from flask import request
    from datetime import datetime

    @app.before_request
    def check_maintenance_mode():
        if request.method == 'OPTIONS':
            return None

        # Allow status, health, and static files
        if request.path in ('/api/website-status', '/api/health', '/health') or request.path.startswith('/static'):
            return None

        # Allow Auth routes so Admins can log in and recover
        if request.path.startswith('/api/auth'):
            return None

        # Allow Admin routes (strictly verified by admin_required decorator)
        if request.path.startswith('/api/admin'):
            return None

        # Check maintenance mode state
        try:
            from app.models.website_setting import WebsiteSettings
            settings = WebsiteSettings.get_settings()
            if settings and settings.is_maintenance_mode:
                retry_seconds = 3600
                if settings.estimated_reopening_at:
                    delta = (settings.estimated_reopening_at - datetime.utcnow()).total_seconds()
                    if delta > 0:
                        retry_seconds = int(delta)

                response = jsonify({
                    'success': False,
                    'maintenance': True,
                    'status': 'OFFLINE',
                    'title': settings.maintenance_title_en or "We'll Be Back Soon",
                    'message': settings.maintenance_message_en or "Seva Setu is temporarily unavailable while we carry out maintenance. Please visit again soon.",
                    'titles': {
                        'en': settings.maintenance_title_en or "We'll Be Back Soon",
                        'bn': settings.maintenance_title_bn or "আমরা শীঘ্রই ফিরে আসব",
                        'hi': settings.maintenance_title_hi or "हम जल्द ही वापस आएंगे",
                    },
                    'messages': {
                        'en': settings.maintenance_message_en,
                        'bn': settings.maintenance_message_bn,
                        'hi': settings.maintenance_message_hi,
                    },
                    'estimated_reopening_at': settings.estimated_reopening_at.isoformat() if settings.estimated_reopening_at else None,
                    'support_contact_email': settings.support_contact_email or 'support@sevasetu.org',
                    'retry_after': retry_seconds
                })
                response.status_code = 503
                response.headers['Retry-After'] = str(retry_seconds)
                return response
        except Exception:
            pass
        return None

    # Error handlers
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({'success': False, 'message': 'Resource not found'}), 404

    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({'success': False, 'message': 'Bad request'}), 400

    @app.errorhandler(500)
    def internal_error(e):
        error_detail = str(getattr(e, 'original_exception', e))
        return jsonify({
            'success': False,
            'message': 'An internal server error occurred',
            'detail': error_detail
        }), 500

    return app

# Default application instance for WSGI servers (e.g. gunicorn app:app)
app = create_app()

