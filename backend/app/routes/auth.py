from flask import Blueprint, request, jsonify
from app.models import db
from app.models.user import User
from app.middleware.auth import generate_token, jwt_required, get_current_user
from app.services.audit_service import log_audit
from app.utils.validators import validate_email, sanitize_text

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    name = sanitize_text(data.get('name') or data.get('full_name') or '')
    email = sanitize_text(data.get('email', '')).strip().lower()
    password = data.get('password', '')
    confirm_password = data.get('confirm_password', '')

    if not name or not email or not password:
        return jsonify({'success': False, 'message': 'Full name, email, and password are required.'}), 400

    if not validate_email(email):
        return jsonify({'success': False, 'message': 'Please provide a valid email address.'}), 400

    if len(password) < 6:
        return jsonify({'success': False, 'message': 'Password must be at least 6 characters long.'}), 400

    if confirm_password and password != confirm_password:
        return jsonify({'success': False, 'message': 'Passwords do not match.'}), 400

    if User.query.filter(db.func.lower(User.email) == email).first():
        return jsonify({'success': False, 'message': 'An account with this email already exists.'}), 400

    user = User(
        name=name,
        email=email,
        role='citizen',
        is_active=True
    )
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    token = generate_token(user)
    log_audit(user.id, 'CITIZEN_REGISTER', 'User', user.id, f"Citizen {user.name} registered successfully.")

    return jsonify({
        'success': True,
        'message': 'Registration successful! Welcome to Seva Setu.',
        'token': token,
        'user': user.to_dict()
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = sanitize_text(data.get('email', '')).strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({'success': False, 'message': 'Email and password are required.'}), 400

    user = User.query.filter(db.func.lower(User.email) == email).first()
    if not user or not user.check_password(password):
        return jsonify({'success': False, 'message': 'Invalid email or password. Please try again.'}), 401

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
