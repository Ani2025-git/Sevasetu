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
from app.models.scheme import (
    GovernmentScheme,
    SchemeCategory,
    SchemeDepartment,
    SchemeEligibilityRule,
    SchemeRequiredDocument,
    SchemeOfficialSource,
    SchemeVerificationHistory,
    generate_slug
)
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
    category = sanitize_text(data.get('category', 'Certificates & Revenue'))
    description = sanitize_text(data.get('description'))
    department = sanitize_text(data.get('department', 'Government of West Bengal'))
    eligibility = sanitize_text(data.get('eligibility', ''))
    required_documents = sanitize_text(data.get('required_documents', ''))
    application_process = sanitize_text(data.get('application_process', ''))
    offline_instructions = sanitize_text(data.get('offline_instructions', ''))
    online_apply_url = sanitize_text(data.get('online_apply_url', ''))
    official_source_url = sanitize_text(data.get('official_source_url', ''))
    fees = sanitize_text(data.get('fees', 'Free of Cost'))
    expected_processing_time = sanitize_text(data.get('expected_processing_time', '7 - 15 Working Days'))
    verification_status = sanitize_text(data.get('verification_status', 'OFFICIALLY_VERIFIED'))

    if not name or not description:
        return jsonify({'success': False, 'message': 'Name and description are required.'}), 400

    service = Service(
        centre_id=centre_id if centre_id else None,
        name=name,
        category=category,
        description=description,
        department=department,
        eligibility=eligibility,
        required_documents=required_documents if required_documents else None,
        application_process=application_process,
        offline_instructions=offline_instructions,
        online_apply_url=online_apply_url if online_apply_url else None,
        official_source_url=official_source_url if official_source_url else None,
        fees=fees,
        expected_processing_time=expected_processing_time,
        verification_status=verification_status,
        last_verified_at=datetime.utcnow(),
        is_active=True
    )
    db.session.add(service)
    db.session.commit()

    log_audit(user.id, 'CREATE_SERVICE', 'Service', service.id, f"Admin added service '{service.name}'.")

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
    if 'department' in data: service.department = sanitize_text(data['department'])
    if 'eligibility' in data: service.eligibility = sanitize_text(data['eligibility'])
    if 'required_documents' in data: service.required_documents = sanitize_text(data['required_documents'])
    if 'application_process' in data: service.application_process = sanitize_text(data['application_process'])
    if 'offline_instructions' in data: service.offline_instructions = sanitize_text(data['offline_instructions'])
    if 'online_apply_url' in data: service.online_apply_url = sanitize_text(data['online_apply_url'])
    if 'official_source_url' in data: service.official_source_url = sanitize_text(data['official_source_url'])
    if 'fees' in data: service.fees = sanitize_text(data['fees'])
    if 'expected_processing_time' in data: service.expected_processing_time = sanitize_text(data['expected_processing_time'])
    if 'verification_status' in data: service.verification_status = sanitize_text(data['verification_status'])
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

# ----------------- GOVERNMENT SCHEMES MANAGEMENT -----------------
@admin_bp.route('/schemes', methods=['GET'])
@admin_required
def get_admin_schemes():
    try:
        query = GovernmentScheme.query
        status = request.args.get('status')
        category_id = request.args.get('category_id')
        search = request.args.get('search')
        page = max(1, int(request.args.get('page', 1)))
        per_page = min(100, max(1, int(request.args.get('per_page', 20))))

        if status and status.upper() != 'ALL':
            query = query.filter_by(status=status.upper())

        if category_id:
            try:
                query = query.filter_by(category_id=int(category_id))
            except ValueError:
                pass

        if search:
            s_clean = sanitize_text(search).strip()
            if s_clean:
                s_term = f"%{s_clean}%"
                query = query.filter(
                    (GovernmentScheme.name.ilike(s_term)) |
                    (GovernmentScheme.slug.ilike(s_term)) |
                    (GovernmentScheme.beneficiary_summary.ilike(s_term))
                )

        total = query.count()
        schemes = query.order_by(GovernmentScheme.updated_at.desc()).offset((page - 1) * per_page).limit(per_page).all()

        # Count by status for quick filter badges
        status_counts = {
            'ALL': GovernmentScheme.query.count(),
            'DRAFT': GovernmentScheme.query.filter_by(status='DRAFT').count(),
            'PENDING_VERIFICATION': GovernmentScheme.query.filter_by(status='PENDING_VERIFICATION').count(),
            'VERIFIED': GovernmentScheme.query.filter_by(status='VERIFIED').count(),
            'PUBLISHED': GovernmentScheme.query.filter_by(status='PUBLISHED').count(),
            'ARCHIVED': GovernmentScheme.query.filter_by(status='ARCHIVED').count(),
        }

        return jsonify({
            'success': True,
            'schemes': [s.to_dict(include_details=False) for s in schemes],
            'total': total,
            'page': page,
            'pages': (total + per_page - 1) // per_page if total > 0 else 1,
            'per_page': per_page,
            'status_counts': status_counts
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'message': 'Failed to load schemes', 'detail': str(e)}), 500

@admin_bp.route('/schemes/<int:id>', methods=['GET'])
@admin_required
def get_admin_scheme_details(id):
    scheme = GovernmentScheme.query.get(id)
    if not scheme:
        return jsonify({'success': False, 'message': 'Scheme not found'}), 404
    return jsonify({
        'success': True,
        'scheme': scheme.to_dict(include_details=True)
    }), 200

@admin_bp.route('/schemes', methods=['POST'])
@admin_required
def create_scheme():
    admin = request.current_user
    data = request.get_json() or {}

    name = sanitize_text(data.get('name', '')).strip()
    short_desc = sanitize_text(data.get('short_description', '')).strip()
    full_desc = sanitize_text(data.get('full_description', '')).strip()
    category_id = data.get('category_id')

    if not name or not short_desc or not full_desc or not category_id:
        return jsonify({'success': False, 'message': 'Name, short description, full description, and category are required.'}), 400

    # Ensure category exists
    cat = SchemeCategory.query.get(category_id)
    if not cat:
        return jsonify({'success': False, 'message': 'Selected category does not exist.'}), 400

    # Generate or sanitize slug
    custom_slug = sanitize_text(data.get('slug', '')).strip().lower()
    base_slug = generate_slug(custom_slug or name)
    slug = base_slug
    counter = 1
    while GovernmentScheme.query.filter_by(slug=slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1

    department_id = data.get('department_id') or None
    beneficiary_summary = sanitize_text(data.get('beneficiary_summary', '')).strip()
    app_instructions = sanitize_text(data.get('application_instructions', '')).strip()
    official_apply_url = sanitize_text(data.get('official_application_url', '')).strip() or None
    official_info_url = sanitize_text(data.get('official_info_url', '')).strip() or None

    initial_status = data.get('status', 'DRAFT').upper()
    if initial_status not in ['DRAFT', 'PENDING_VERIFICATION', 'VERIFIED', 'PUBLISHED', 'ARCHIVED']:
        initial_status = 'DRAFT'

    scheme = GovernmentScheme(
        name=name,
        slug=slug,
        short_description=short_desc,
        full_description=full_desc,
        category_id=category_id,
        department_id=department_id,
        beneficiary_summary=beneficiary_summary,
        application_instructions=app_instructions,
        official_application_url=official_apply_url,
        official_info_url=official_info_url,
        status=initial_status,
        verification_status='VERIFIED' if initial_status == 'PUBLISHED' else initial_status,
        last_verified_at=datetime.utcnow() if initial_status in ['VERIFIED', 'PUBLISHED'] else None,
        created_by=admin.id,
        updated_by=admin.id
    )
    db.session.add(scheme)
    db.session.flush()

    # Add Eligibility Rules if provided
    rules_data = data.get('eligibility_rules', [])
    for r in rules_data:
        desc = sanitize_text(r.get('rule_description', '')).strip()
        if desc:
            rule = SchemeEligibilityRule(
                scheme_id=scheme.id,
                rule_type=r.get('rule_type', 'GENERAL'),
                rule_description=desc,
                minimum_age=int(r['minimum_age']) if r.get('minimum_age') not in [None, ''] else None,
                maximum_age=int(r['maximum_age']) if r.get('maximum_age') not in [None, ''] else None,
                minimum_income=float(r['minimum_income']) if r.get('minimum_income') not in [None, ''] else None,
                maximum_income=float(r['maximum_income']) if r.get('maximum_income') not in [None, ''] else None,
                residence_requirement=sanitize_text(r.get('residence_requirement', '')).strip() or None,
                occupation_requirement=sanitize_text(r.get('occupation_requirement', '')).strip() or None,
                is_mandatory=bool(r.get('is_mandatory', True))
            )
            db.session.add(rule)

    # Add Required Documents if provided
    docs_data = data.get('required_documents', [])
    for d in docs_data:
        doc_name = sanitize_text(d.get('document_name', '')).strip()
        if doc_name:
            doc = SchemeRequiredDocument(
                scheme_id=scheme.id,
                document_name=doc_name,
                description=sanitize_text(d.get('description', '')).strip() or None,
                is_mandatory=bool(d.get('is_mandatory', True)),
                source_reference=sanitize_text(d.get('source_reference', '')).strip() or None
            )
            db.session.add(doc)

    # Add Official Sources if provided
    sources_data = data.get('official_sources', [])
    for s in sources_data:
        s_title = sanitize_text(s.get('source_title', '')).strip()
        s_url = sanitize_text(s.get('source_url', '')).strip()
        if s_title and s_url:
            source = SchemeOfficialSource(
                scheme_id=scheme.id,
                source_title=s_title,
                source_url=s_url,
                source_department=sanitize_text(s.get('source_department', '')).strip() or None,
                source_type=s.get('source_type', 'OFFICIAL_PORTAL'),
                verified_at=datetime.utcnow()
            )
            db.session.add(source)

    # Initial history record
    history = SchemeVerificationHistory(
        scheme_id=scheme.id,
        admin_id=admin.id,
        previous_status='NEW',
        new_status=scheme.status,
        notes=f"Scheme created by {admin.name} ({admin.email}) with status {scheme.status}."
    )
    db.session.add(history)
    db.session.commit()

    log_audit(admin.id, 'CREATE_SCHEME', 'GovernmentScheme', scheme.id, f"Created scheme {scheme.name} (slug: {scheme.slug})")

    return jsonify({
        'success': True,
        'message': f"Scheme '{scheme.name}' created successfully.",
        'scheme': scheme.to_dict(include_details=True)
    }), 201

@admin_bp.route('/schemes/<int:id>', methods=['PUT'])
@admin_required
def update_scheme(id):
    admin = request.current_user
    scheme = GovernmentScheme.query.get(id)
    if not scheme:
        return jsonify({'success': False, 'message': 'Scheme not found'}), 404

    data = request.get_json() or {}

    if 'name' in data:
        name = sanitize_text(data['name']).strip()
        if name:
            scheme.name = name

    if 'short_description' in data:
        scheme.short_description = sanitize_text(data['short_description']).strip()

    if 'full_description' in data:
        scheme.full_description = sanitize_text(data['full_description']).strip()

    if 'category_id' in data:
        cat = SchemeCategory.query.get(data['category_id'])
        if cat:
            scheme.category_id = cat.id

    if 'department_id' in data:
        scheme.department_id = data['department_id'] or None

    if 'beneficiary_summary' in data:
        scheme.beneficiary_summary = sanitize_text(data['beneficiary_summary']).strip()

    if 'application_instructions' in data:
        scheme.application_instructions = sanitize_text(data['application_instructions']).strip()

    if 'official_application_url' in data:
        scheme.official_application_url = sanitize_text(data['official_application_url']).strip() or None

    if 'official_info_url' in data:
        scheme.official_info_url = sanitize_text(data['official_info_url']).strip() or None

    # Update Rules if provided
    if 'eligibility_rules' in data:
        SchemeEligibilityRule.query.filter_by(scheme_id=scheme.id).delete()
        for r in data['eligibility_rules']:
            desc = sanitize_text(r.get('rule_description', '')).strip()
            if desc:
                rule = SchemeEligibilityRule(
                    scheme_id=scheme.id,
                    rule_type=r.get('rule_type', 'GENERAL'),
                    rule_description=desc,
                    minimum_age=int(r['minimum_age']) if r.get('minimum_age') not in [None, ''] else None,
                    maximum_age=int(r['maximum_age']) if r.get('maximum_age') not in [None, ''] else None,
                    minimum_income=float(r['minimum_income']) if r.get('minimum_income') not in [None, ''] else None,
                    maximum_income=float(r['maximum_income']) if r.get('maximum_income') not in [None, ''] else None,
                    residence_requirement=sanitize_text(r.get('residence_requirement', '')).strip() or None,
                    occupation_requirement=sanitize_text(r.get('occupation_requirement', '')).strip() or None,
                    is_mandatory=bool(r.get('is_mandatory', True))
                )
                db.session.add(rule)

    # Update Documents if provided
    if 'required_documents' in data:
        SchemeRequiredDocument.query.filter_by(scheme_id=scheme.id).delete()
        for d in data['required_documents']:
            doc_name = sanitize_text(d.get('document_name', '')).strip()
            if doc_name:
                doc = SchemeRequiredDocument(
                    scheme_id=scheme.id,
                    document_name=doc_name,
                    description=sanitize_text(d.get('description', '')).strip() or None,
                    is_mandatory=bool(d.get('is_mandatory', True)),
                    source_reference=sanitize_text(d.get('source_reference', '')).strip() or None
                )
                db.session.add(doc)

    # Update Sources if provided
    if 'official_sources' in data:
        SchemeOfficialSource.query.filter_by(scheme_id=scheme.id).delete()
        for s in data['official_sources']:
            s_title = sanitize_text(s.get('source_title', '')).strip()
            s_url = sanitize_text(s.get('source_url', '')).strip()
            if s_title and s_url:
                source = SchemeOfficialSource(
                    scheme_id=scheme.id,
                    source_title=s_title,
                    source_url=s_url,
                    source_department=sanitize_text(s.get('source_department', '')).strip() or None,
                    source_type=s.get('source_type', 'OFFICIAL_PORTAL'),
                    verified_at=datetime.utcnow()
                )
                db.session.add(source)

    scheme.updated_by = admin.id
    scheme.updated_at = datetime.utcnow()
    db.session.commit()

    log_audit(admin.id, 'UPDATE_SCHEME', 'GovernmentScheme', scheme.id, f"Updated scheme {scheme.name}")

    return jsonify({
        'success': True,
        'message': f"Scheme '{scheme.name}' updated successfully.",
        'scheme': scheme.to_dict(include_details=True)
    }), 200

@admin_bp.route('/schemes/<int:id>/status', methods=['PATCH'])
@admin_required
def update_scheme_status(id):
    admin = request.current_user
    scheme = GovernmentScheme.query.get(id)
    if not scheme:
        return jsonify({'success': False, 'message': 'Scheme not found'}), 404

    data = request.get_json() or {}
    new_status = data.get('status', '').upper()
    notes = sanitize_text(data.get('notes', '')).strip()

    valid_statuses = ['DRAFT', 'PENDING_VERIFICATION', 'VERIFIED', 'PUBLISHED', 'ARCHIVED']
    if new_status not in valid_statuses:
        return jsonify({'success': False, 'message': f"Invalid status. Must be one of {valid_statuses}."}), 400

    old_status = scheme.status
    scheme.status = new_status
    scheme.verification_status = 'VERIFIED' if new_status in ['VERIFIED', 'PUBLISHED'] else new_status
    if new_status in ['VERIFIED', 'PUBLISHED']:
        scheme.last_verified_at = datetime.utcnow()

    scheme.updated_by = admin.id
    scheme.updated_at = datetime.utcnow()

    history = SchemeVerificationHistory(
        scheme_id=scheme.id,
        admin_id=admin.id,
        previous_status=old_status,
        new_status=new_status,
        notes=notes or f"Status transitioned from {old_status} to {new_status} by {admin.name}."
    )
    db.session.add(history)
    db.session.commit()

    log_audit(admin.id, 'UPDATE_SCHEME_STATUS', 'GovernmentScheme', scheme.id, f"Status changed from {old_status} to {new_status}")

    return jsonify({
        'success': True,
        'message': f"Scheme status updated to {new_status}.",
        'scheme': scheme.to_dict(include_details=True)
    }), 200

@admin_bp.route('/schemes/<int:id>/submit-verification', methods=['POST'])
@admin_required
def submit_scheme_verification(id):
    admin = request.current_user
    scheme = GovernmentScheme.query.get(id)
    if not scheme:
        return jsonify({'success': False, 'message': 'Scheme not found'}), 404

    data = request.get_json() or {}
    notes = sanitize_text(data.get('notes', 'Submitted for official verification.')).strip()

    old_status = scheme.status
    scheme.status = 'PENDING_VERIFICATION'
    scheme.verification_status = 'PENDING_VERIFICATION'
    scheme.updated_by = admin.id
    scheme.updated_at = datetime.utcnow()

    history = SchemeVerificationHistory(
        scheme_id=scheme.id,
        admin_id=admin.id,
        previous_status=old_status,
        new_status='PENDING_VERIFICATION',
        notes=notes
    )
    db.session.add(history)
    db.session.commit()

    return jsonify({
        'success': True,
        'message': f"Scheme '{scheme.name}' submitted for verification.",
        'scheme': scheme.to_dict(include_details=True)
    }), 200

@admin_bp.route('/schemes/<int:id>/publish', methods=['POST'])
@admin_required
def publish_scheme(id):
    admin = request.current_user
    scheme = GovernmentScheme.query.get(id)
    if not scheme:
        return jsonify({'success': False, 'message': 'Scheme not found'}), 404

    data = request.get_json() or {}
    notes = sanitize_text(data.get('notes', 'Published to live citizen directory after verifying official government source.')).strip()

    old_status = scheme.status
    scheme.status = 'PUBLISHED'
    scheme.verification_status = 'VERIFIED'
    scheme.last_verified_at = datetime.utcnow()
    scheme.updated_by = admin.id
    scheme.updated_at = datetime.utcnow()

    history = SchemeVerificationHistory(
        scheme_id=scheme.id,
        admin_id=admin.id,
        previous_status=old_status,
        new_status='PUBLISHED',
        notes=notes
    )
    db.session.add(history)
    db.session.commit()

    log_audit(admin.id, 'PUBLISH_SCHEME', 'GovernmentScheme', scheme.id, f"Published scheme {scheme.name}")

    return jsonify({
        'success': True,
        'message': f"Scheme '{scheme.name}' is now live and published to citizens.",
        'scheme': scheme.to_dict(include_details=True)
    }), 200

@admin_bp.route('/schemes/<int:id>/archive', methods=['POST'])
@admin_required
def archive_scheme(id):
    admin = request.current_user
    scheme = GovernmentScheme.query.get(id)
    if not scheme:
        return jsonify({'success': False, 'message': 'Scheme not found'}), 404

    data = request.get_json() or {}
    notes = sanitize_text(data.get('notes', 'Archived scheme.')).strip()

    old_status = scheme.status
    scheme.status = 'ARCHIVED'
    scheme.verification_status = 'ARCHIVED'
    scheme.updated_by = admin.id
    scheme.updated_at = datetime.utcnow()

    history = SchemeVerificationHistory(
        scheme_id=scheme.id,
        admin_id=admin.id,
        previous_status=old_status,
        new_status='ARCHIVED',
        notes=notes
    )
    db.session.add(history)
    db.session.commit()

    log_audit(admin.id, 'ARCHIVE_SCHEME', 'GovernmentScheme', scheme.id, f"Archived scheme {scheme.name}")

    return jsonify({
        'success': True,
        'message': f"Scheme '{scheme.name}' has been archived and removed from citizen view.",
        'scheme': scheme.to_dict(include_details=True)
    }), 200

@admin_bp.route('/schemes/<int:id>/history', methods=['GET'])
@admin_required
def get_scheme_history(id):
    scheme = GovernmentScheme.query.get(id)
    if not scheme:
        return jsonify({'success': False, 'message': 'Scheme not found'}), 404

    history = SchemeVerificationHistory.query.filter_by(scheme_id=scheme.id).order_by(SchemeVerificationHistory.created_at.desc()).all()
    return jsonify({
        'success': True,
        'history': [h.to_dict() for h in history]
    }), 200

@admin_bp.route('/schemes/<int:id>', methods=['DELETE'])
@admin_required
def delete_scheme(id):
    admin = request.current_user
    scheme = GovernmentScheme.query.get(id)
    if not scheme:
        return jsonify({'success': False, 'message': 'Scheme not found'}), 404

    scheme_name = scheme.name
    if scheme.status == 'DRAFT':
        SchemeEligibilityRule.query.filter_by(scheme_id=scheme.id).delete()
        SchemeRequiredDocument.query.filter_by(scheme_id=scheme.id).delete()
        SchemeOfficialSource.query.filter_by(scheme_id=scheme.id).delete()
        SchemeVerificationHistory.query.filter_by(scheme_id=scheme.id).delete()
        db.session.delete(scheme)
        db.session.commit()
        log_audit(admin.id, 'DELETE_SCHEME', 'GovernmentScheme', id, f"Deleted draft scheme {scheme_name}")
        return jsonify({
            'success': True,
            'message': f"Draft scheme '{scheme_name}' has been deleted."
        }), 200
    else:
        old_status = scheme.status
        scheme.status = 'ARCHIVED'
        scheme.verification_status = 'ARCHIVED'
        scheme.updated_by = admin.id
        scheme.updated_at = datetime.utcnow()
        history = SchemeVerificationHistory(
            scheme_id=scheme.id,
            admin_id=admin.id,
            previous_status=old_status,
            new_status='ARCHIVED',
            notes="Archived via delete request for audit compliance."
        )
        db.session.add(history)
        db.session.commit()
        log_audit(admin.id, 'ARCHIVE_SCHEME', 'GovernmentScheme', scheme.id, f"Archived scheme {scheme_name}")
        return jsonify({
            'success': True,
            'message': f"Scheme '{scheme_name}' has been archived for compliance."
        }), 200




# ----------------- WEBSITE AVAILABILITY & MAINTENANCE CONTROL -----------------
@admin_bp.route('/website-settings', methods=['GET'])
@admin_required
def get_website_settings():
    from app.models.website_setting import WebsiteSettings
    settings = WebsiteSettings.get_settings()
    audit_logs = AuditLog.query.filter_by(action='WEBSITE_STATUS_CHANGE').order_by(AuditLog.created_at.desc()).limit(20).all()
    return jsonify({
        'success': True,
        'settings': settings.to_dict(),
        'audit_logs': [l.to_dict() for l in audit_logs]
    }), 200

@admin_bp.route('/website-settings', methods=['PUT'])
@admin_required
def update_website_settings():
    from app.models.website_setting import WebsiteSettings
    admin = request.current_user
    settings = WebsiteSettings.get_settings()
    data = request.get_json() or {}

    prev_status = 'OFFLINE' if settings.is_maintenance_mode else 'ONLINE'
    
    # Update fields if provided
    if 'is_maintenance_mode' in data:
        settings.is_maintenance_mode = bool(data['is_maintenance_mode'])

    if 'maintenance_title_en' in data:
        settings.maintenance_title_en = sanitize_text(data['maintenance_title_en'])
    if 'maintenance_title_bn' in data:
        settings.maintenance_title_bn = sanitize_text(data['maintenance_title_bn'])
    if 'maintenance_title_hi' in data:
        settings.maintenance_title_hi = sanitize_text(data['maintenance_title_hi'])

    if 'maintenance_message_en' in data:
        settings.maintenance_message_en = sanitize_text(data['maintenance_message_en'])
    if 'maintenance_message_bn' in data:
        settings.maintenance_message_bn = sanitize_text(data['maintenance_message_bn'])
    if 'maintenance_message_hi' in data:
        settings.maintenance_message_hi = sanitize_text(data['maintenance_message_hi'])

    if 'support_contact_email' in data:
        settings.support_contact_email = sanitize_text(data['support_contact_email'])

    if 'estimated_reopening_at' in data:
        val = data['estimated_reopening_at']
        if val:
            try:
                val_clean = val.replace('Z', '+00:00')
                settings.estimated_reopening_at = datetime.fromisoformat(val_clean)
            except Exception:
                pass
        else:
            settings.estimated_reopening_at = None

    new_status = 'OFFLINE' if settings.is_maintenance_mode else 'ONLINE'
    reason = sanitize_text(data.get('reason', '')).strip()

    settings.updated_by = admin.id
    settings.updated_at = datetime.utcnow()
    db.session.commit()

    if prev_status != new_status:
        details = f"Admin {admin.name} toggled public website status from {prev_status} to {new_status}."
        if reason:
            details += f" Reason: {reason}"
        log_audit(admin.id, 'WEBSITE_STATUS_CHANGE', 'WebsiteSettings', str(settings.id), details)
    else:
        log_audit(admin.id, 'UPDATE_WEBSITE_SETTINGS', 'WebsiteSettings', str(settings.id), f"Admin {admin.name} updated maintenance messages and schedule.")

    return jsonify({
        'success': True,
        'message': f"Website status is now {new_status}.",
        'settings': settings.to_dict()
    }), 200
