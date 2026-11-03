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

