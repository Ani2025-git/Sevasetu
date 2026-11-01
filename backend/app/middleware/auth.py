from functools import wraps
from flask import request, jsonify, current_app
import jwt
from datetime import datetime, timedelta, timezone
from app.models.user import User

def generate_token(user):
    payload = {
        'sub': str(user.id),
        'user_id': user.id,
        'email': user.email,
        'name': user.name,
        'role': user.role,
        'exp': datetime.now(timezone.utc) + timedelta(hours=current_app.config.get('JWT_EXPIRATION_HOURS', 24)),
        'iat': datetime.now(timezone.utc)
    }
    return jwt.encode(payload, current_app.config['JWT_SECRET_KEY'], algorithm='HS256')

def decode_token(token):
    try:
        payload = jwt.decode(token, current_app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return {'error': 'Token has expired'}
    except jwt.InvalidTokenError:
        return {'error': 'Invalid token'}

def get_current_user():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    token = auth_header.split(' ', 1)[1].strip()
    payload = decode_token(token)
    if 'error' in payload:
        return None
    user_id = payload.get('user_id')
    user = User.query.get(user_id)
    if user and user.is_active:
        return user
    return None

def jwt_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user = get_current_user()
        if not user:
            return jsonify({
                'success': False,
                'message': 'Authentication required. Please log in.'
            }), 401
        request.current_user = user
        return f(*args, **kwargs)
    return decorated_function

def role_required(*allowed_roles):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            user = get_current_user()
            if not user:
                return jsonify({
                    'success': False,
                    'message': 'Authentication required. Please log in.'
                }), 401
            if user.role not in allowed_roles:
                return jsonify({
                    'success': False,
                    'message': f"Access forbidden: role '{user.role}' lacks permission."
                }), 403
            request.current_user = user
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def admin_required(f):
    return role_required('admin')(f)

def observer_required(f):
    return role_required('admin', 'observer')(f)

