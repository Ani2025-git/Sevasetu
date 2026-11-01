from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from app.models import db
from app.models.user import User
from app.models.centre import Centre
from app.models.service import Service
from app.models.observation import Observation
from app.models.queue_update import QueueUpdate
from app.models.audit_log import AuditLog
from app.models.setting import Setting
from app.middleware.auth import admin_required
from app.services.audit_service import log_audit
from app.services.queue_service import compute_centre_queue_status, get_stale_threshold_minutes
from app.utils.validators import validate_queue_status, validate_email, sanitize_text

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

# ----------------- DASHBOARD -----------------
@admin_bp.route('/dashboard', methods=['GET'])
@admin_required
def dashboard_stats():
    total_centres = Centre.query.count()
    active_services = Service.query.filter_by(is_active=True).count()
    total_observations = Observation.query.count()
    pending_observations = Observation.query.filter_by(review_status='PENDING').count()
    published_updates = QueueUpdate.query.count()
    
    # 7-day observation trend
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    recent_obs = Observation.query.filter(Observation.submitted_at >= seven_days_ago).all()
    
    # Status distribution
    status_counts = {'LOW': 0, 'MODERATE': 0, 'HIGH': 0, 'UNKNOWN': 0}
    for obs in recent_obs:
        if obs.queue_status in status_counts:
            status_counts[obs.queue_status] += 1

    # Recent 5 updates
    recent_updates = QueueUpdate.query.order_by(QueueUpdate.created_at.desc()).limit(5).all()

    return jsonify({
        'success': True,
        'stats': {
            'total_centres': total_centres,
            'active_services': active_services,
            'total_observations': total_observations,
            'pending_observations': pending_observations,
            'published_updates': published_updates,
            'stale_threshold_minutes': get_stale_threshold_minutes()
        },
        'status_distribution': [
            {'name': k, 'count': v} for k, v in status_counts.items()
        ],
        'recent_updates': [u.to_dict() for u in recent_updates]
    }), 200

# ----------------- CENTRES -----------------
@admin_bp.route('/centres', methods=['POST'])
@admin_required
def create_centre():
    user = request.current_user
    data = request.get_json() or {}

    name = sanitize_text(data.get('name'))
    address = sanitize_text(data.get('address'))
    district = sanitize_text(data.get('district'))
    block = sanitize_text(data.get('block'))
    opening_hours = sanitize_text(data.get('opening_hours', '10:00 AM - 5:00 PM'))
    weekly_holidays = sanitize_text(data.get('weekly_holidays', 'Sunday & State Public Holidays'))
    official_source_url = sanitize_text(data.get('official_source_url', ''))
    contact_details = sanitize_text(data.get('contact_details', ''))

    if not name or not address or not district or not block:
        return jsonify({'success': False, 'message': 'Name, address, district, and block are required.'}), 400

    centre = Centre(
        name=name,
        address=address,
        district=district,
        block=block,
        opening_hours=opening_hours,
        weekly_holidays=weekly_holidays,
        official_source_url=official_source_url if official_source_url else None,
        contact_details=contact_details if contact_details else None,
        is_active=True
    )
    db.session.add(centre)
    db.session.commit()

    log_audit(user.id, 'CREATE_CENTRE', 'Centre', centre.id, f"Admin created centre '{centre.name}'.")

    return jsonify({
        'success': True,
        'message': 'Centre created successfully.',
        'centre': centre.to_dict()
    }), 201

@admin_bp.route('/centres/<int:centre_id>', methods=['PUT'])
@admin_required
def update_centre(centre_id):
    user = request.current_user
    centre = Centre.query.get_or_404(centre_id)
    data = request.get_json() or {}

    if 'name' in data: centre.name = sanitize_text(data['name'])
    if 'address' in data: centre.address = sanitize_text(data['address'])
    if 'district' in data: centre.district = sanitize_text(data['district'])
    if 'block' in data: centre.block = sanitize_text(data['block'])
    if 'opening_hours' in data: centre.opening_hours = sanitize_text(data['opening_hours'])
    if 'weekly_holidays' in data: centre.weekly_holidays = sanitize_text(data['weekly_holidays'])
    if 'official_source_url' in data: centre.official_source_url = sanitize_text(data['official_source_url'])
    if 'contact_details' in data: centre.contact_details = sanitize_text(data['contact_details'])
    if 'is_active' in data: centre.is_active = bool(data['is_active'])

    db.session.commit()
    log_audit(user.id, 'UPDATE_CENTRE', 'Centre', centre.id, f"Admin updated centre '{centre.name}'.")

    return jsonify({
        'success': True,
        'message': 'Centre updated successfully.',
        'centre': centre.to_dict()
    }), 200

@admin_bp.route('/centres/<int:centre_id>', methods=['DELETE'])
@admin_required
def delete_centre(centre_id):
    user = request.current_user
    centre = Centre.query.get_or_404(centre_id)
    centre_name = centre.name
    
    db.session.delete(centre)
    db.session.commit()

    log_audit(user.id, 'DELETE_CENTRE', 'Centre', centre_id, f"Admin deleted centre '{centre_name}'.")

    return jsonify({'success': True, 'message': f"Centre '{centre_name}' deleted successfully."}), 200

# ----------------- SERVICES -----------------
@admin_bp.route('/services', methods=['POST'])
@admin_required
def create_service():
    user = request.current_user
    data = request.get_json() or {}

    centre_id = data.get('centre_id')
    name = sanitize_text(data.get('name'))
    category = sanitize_text(data.get('category', 'General Services'))
    description = sanitize_text(data.get('description'))
    required_documents = sanitize_text(data.get('required_documents', ''))
    official_source_url = sanitize_text(data.get('official_source_url', ''))

    if not centre_id or not name or not description:
        return jsonify({'success': False, 'message': 'Centre, name, and description are required.'}), 400

    centre = Centre.query.get(centre_id)
    if not centre:
        return jsonify({'success': False, 'message': 'Invalid centre specified.'}), 400

    service = Service(
        centre_id=centre.id,
        name=name,
        category=category,
        description=description,
        required_documents=required_documents if required_documents else None,
        official_source_url=official_source_url if official_source_url else None,
        last_verified_at=datetime.utcnow(),
        is_active=True
    )
    db.session.add(service)
    db.session.commit()

    log_audit(user.id, 'CREATE_SERVICE', 'Service', service.id, f"Admin added service '{service.name}' for {centre.name}.")

    return jsonify({
        'success': True,
        'message': 'Service added successfully.',
        'service': service.to_dict()
    }), 201

@admin_bp.route('/services/<int:service_id>', methods=['PUT'])
@admin_required
def update_service(service_id):
    user = request.current_user
    service = Service.query.get_or_404(service_id)
    data = request.get_json() or {}

    if 'name' in data: service.name = sanitize_text(data['name'])
    if 'category' in data: service.category = sanitize_text(data['category'])
    if 'description' in data: service.description = sanitize_text(data['description'])
    if 'required_documents' in data: service.required_documents = sanitize_text(data['required_documents'])
    if 'official_source_url' in data: service.official_source_url = sanitize_text(data['official_source_url'])
    if 'is_active' in data: service.is_active = bool(data['is_active'])
    
    service.last_verified_at = datetime.utcnow()
    db.session.commit()

    log_audit(user.id, 'UPDATE_SERVICE', 'Service', service.id, f"Admin updated service '{service.name}'.")

    return jsonify({
        'success': True,
        'message': 'Service updated successfully.',
        'service': service.to_dict()
    }), 200

@admin_bp.route('/services/<int:service_id>', methods=['DELETE'])
@admin_required
def delete_service(service_id):
    user = request.current_user
    service = Service.query.get_or_404(service_id)
    service_name = service.name

    db.session.delete(service)
    db.session.commit()

    log_audit(user.id, 'DELETE_SERVICE', 'Service', service_id, f"Admin deleted service '{service_name}'.")

    return jsonify({'success': True, 'message': f"Service '{service_name}' deleted successfully."}), 200

# ----------------- OBSERVATIONS REVIEW -----------------
@admin_bp.route('/observations', methods=['GET'])
@admin_required
def get_observations():
    status = request.args.get('status')
    centre_id = request.args.get('centre_id')

    query = Observation.query.order_by(Observation.submitted_at.desc())
    if status and status != 'ALL':
        query = query.filter_by(review_status=status.upper())
    if centre_id:
        query = query.filter_by(centre_id=centre_id)

    observations = [o.to_dict() for o in query.all()]
    return jsonify({'success': True, 'observations': observations}), 200

@admin_bp.route('/observations/<int:obs_id>/review', methods=['POST'])
@admin_required
def review_observation(obs_id):
    user = request.current_user
    obs = Observation.query.get_or_404(obs_id)
    data = request.get_json() or {}

    decision = (data.get('decision') or '').upper() # 'APPROVED' or 'REJECTED'
    review_notes = sanitize_text(data.get('review_notes', ''))

    if decision not in ('APPROVED', 'REJECTED'):
        return jsonify({'success': False, 'message': "Decision must be 'APPROVED' or 'REJECTED'."}), 400

    obs.review_status = decision
    obs.reviewed_by = user.id
    obs.reviewed_at = datetime.utcnow()
    obs.review_notes = review_notes if review_notes else None

    db.session.commit()

    log_audit(
        user.id,
        f"OBSERVATION_{decision}",
        'Observation',
        obs.id,
        f"Admin {user.name} {decision.lower()} observation #{obs.id} (Status was {obs.queue_status}). Notes: {review_notes}"
    )

    return jsonify({
        'success': True,
        'message': f"Observation marked as {decision}.",
        'observation': obs.to_dict()
    }), 200

# ----------------- QUEUE PUBLISHING -----------------
@admin_bp.route('/queue-updates', methods=['POST'])
@admin_required
def publish_queue_update():
    user = request.current_user
    data = request.get_json() or {}

    centre_id = data.get('centre_id')
    queue_status = (data.get('queue_status') or '').upper()
    source_type = sanitize_text(data.get('source_type', 'OBSERVER_VERIFIED'))
    source_description = sanitize_text(data.get('source_description', 'Reviewed Observer Reports'))
    supporting_observations = int(data.get('supporting_observations', 0))

    if not centre_id:
        return jsonify({'success': False, 'message': 'Centre is required.'}), 400

    centre = Centre.query.get(centre_id)
    if not centre:
        return jsonify({'success': False, 'message': 'Invalid centre specified.'}), 400

    if not validate_queue_status(queue_status):
        return jsonify({'success': False, 'message': 'Valid queue status (LOW, MODERATE, HIGH, UNKNOWN) is required.'}), 400

    if not source_description:
        return jsonify({'success': False, 'message': 'Information source description is mandatory.'}), 400

    update = QueueUpdate(
        centre_id=centre.id,
        queue_status=queue_status,
        source_type=source_type,
        source_description=source_description,
        supporting_observations=supporting_observations,
        updated_by=user.id,
        created_at=datetime.utcnow()
    )
    db.session.add(update)
    db.session.commit()

    log_audit(
        user.id,
        'PUBLISH_QUEUE_STATUS',
        'QueueUpdate',
        update.id,
        f"Admin published {queue_status} status for {centre.name} (Source: {source_description}, Supporting: {supporting_observations})."
    )

    return jsonify({
        'success': True,
        'message': 'Queue status published successfully.',
        'update': update.to_dict(),
        'queue_summary': compute_centre_queue_status(centre.id)
    }), 201

# ----------------- HISTORY & AUDIT LOGS -----------------
@admin_bp.route('/history', methods=['GET'])
@admin_required
def queue_history():
    centre_id = request.args.get('centre_id')
    query = QueueUpdate.query.order_by(QueueUpdate.created_at.desc())
    if centre_id:
        query = query.filter_by(centre_id=centre_id)

    updates = [u.to_dict() for u in query.limit(50).all()]
    return jsonify({'success': True, 'history': updates}), 200

@admin_bp.route('/audit-logs', methods=['GET'])
@admin_required
def audit_logs():
    logs = AuditLog.query.order_by(AuditLog.created_at.desc()).limit(100).all()
    return jsonify({'success': True, 'logs': [l.to_dict() for l in logs]}), 200

# ----------------- USER MANAGEMENT -----------------
@admin_bp.route('/users', methods=['GET'])
@admin_required
def get_users():
    users = User.query.order_by(User.created_at.desc()).all()
    return jsonify({'success': True, 'users': [u.to_dict() for u in users]}), 200

@admin_bp.route('/users', methods=['POST'])
@admin_required
def create_user():
    admin = request.current_user
    data = request.get_json() or {}

    name = sanitize_text(data.get('name'))
    email = sanitize_text(data.get('email', '')).lower()
    password = data.get('password', '')
    role = data.get('role', 'observer').lower()

    if not name or not email or not password:
        return jsonify({'success': False, 'message': 'Name, email, and password are required.'}), 400

    if not validate_email(email):
        return jsonify({'success': False, 'message': 'Invalid email address.'}), 400

    if len(password) < 6:
        return jsonify({'success': False, 'message': 'Password must be at least 6 characters.'}), 400

    if role not in ('admin', 'observer'):
        return jsonify({'success': False, 'message': "Role must be 'admin' or 'observer'."}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'success': False, 'message': 'A user with this email already exists.'}), 400

    new_user = User(name=name, email=email, role=role, is_active=True)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    log_audit(admin.id, 'CREATE_USER', 'User', new_user.id, f"Admin created {role} user '{new_user.email}'.")

    return jsonify({
        'success': True,
        'message': f"User '{new_user.name}' created successfully.",
        'user': new_user.to_dict()
    }), 201

@admin_bp.route('/users/<int:user_id>', methods=['PUT'])
@admin_required
def update_user(user_id):
    admin = request.current_user
    target_user = User.query.get_or_404(user_id)
    data = request.get_json() or {}

    if 'name' in data: target_user.name = sanitize_text(data['name'])
    if 'role' in data and data['role'] in ('admin', 'observer'):
        target_user.role = data['role']
    if 'is_active' in data:
        # Don't let admin deactivate themselves
        if target_user.id == admin.id and not data['is_active']:
            return jsonify({'success': False, 'message': 'You cannot deactivate your own account.'}), 400
        target_user.is_active = bool(data['is_active'])
    if 'password' in data and data['password']:
        if len(data['password']) < 6:
            return jsonify({'success': False, 'message': 'Password must be at least 6 characters.'}), 400
        target_user.set_password(data['password'])

    db.session.commit()
    log_audit(admin.id, 'UPDATE_USER', 'User', target_user.id, f"Admin updated user '{target_user.email}'.")

    return jsonify({
        'success': True,
        'message': f"User '{target_user.name}' updated successfully.",
        'user': target_user.to_dict()
    }), 200

# ----------------- SETTINGS -----------------
@admin_bp.route('/settings', methods=['GET'])
@admin_required
def get_settings():
    stale_threshold = Setting.get('stale_threshold_minutes', '30')
    allow_anon = Setting.get('allow_anonymous_observations', 'true')
    pilot_mode = Setting.get('pilot_mode_label', 'Independent Demonstration Project')

    return jsonify({
        'success': True,
        'settings': {
            'stale_threshold_minutes': int(stale_threshold),
            'allow_anonymous_observations': allow_anon.lower() == 'true',
            'pilot_mode_label': pilot_mode
        }
    }), 200

@admin_bp.route('/settings', methods=['PUT'])
@admin_required
def update_settings():
    admin = request.current_user
    data = request.get_json() or {}

    if 'stale_threshold_minutes' in data:
        try:
            mins = int(data['stale_threshold_minutes'])
            if mins < 5 or mins > 1440:
                return jsonify({'success': False, 'message': 'Threshold must be between 5 and 1440 minutes.'}), 400
            Setting.set('stale_threshold_minutes', str(mins), 'Queue staleness threshold in minutes')
        except ValueError:
            return jsonify({'success': False, 'message': 'Invalid threshold value.'}), 400

    if 'allow_anonymous_observations' in data:
        Setting.set('allow_anonymous_observations', 'true' if data['allow_anonymous_observations'] else 'false', 'Enable public anonymous submissions')

    log_audit(admin.id, 'UPDATE_SETTINGS', 'SystemSetting', None, "Admin updated platform settings.")

    return jsonify({
        'success': True,
        'message': 'Platform settings updated successfully.',
        'settings': {
            'stale_threshold_minutes': get_stale_threshold_minutes(),
            'allow_anonymous_observations': Setting.get('allow_anonymous_observations', 'true').lower() == 'true'
        }
    }), 200

