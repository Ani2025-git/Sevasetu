from flask import Blueprint, request, jsonify
from app.models import db
from app.models.user import User
from app.middleware.auth import generate_token, jwt_required, get_current_user
from app.services.audit_service import log_audit
from app.utils.validators import validate_email

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({'success': False, 'message': 'Email and password are required.'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'success': False, 'message': 'Invalid email or password.'}), 401

    if not user.is_active:
        return jsonify({'success': False, 'message': 'This account has been deactivated.'}), 403

    token = generate_token(user)
    log_audit(user.id, 'USER_LOGIN', 'User', user.id, f"User {user.email} logged in successfully.")

    return jsonify({
        'success': True,
        'message': 'Login successful.',
        'token': token,
        'user': user.to_dict()
    }), 200

@auth_bp.route('/logout', methods=['POST'])
def logout():
    user = get_current_user()
    if user:
        log_audit(user.id, 'USER_LOGOUT', 'User', user.id, f"User {user.email} logged out.")
    return jsonify({'success': True, 'message': 'Logged out successfully.'}), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required
def me():
    return jsonify({
        'success': True,
        'user': request.current_user.to_dict()
    }), 200

