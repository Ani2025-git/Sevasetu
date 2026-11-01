from flask import Blueprint, request, jsonify
from datetime import datetime
from app.models import db
from app.models.centre import Centre
from app.models.service import Service
from app.models.observation import Observation
from app.models.queue_update import QueueUpdate
from app.models.setting import Setting
from app.services.queue_service import compute_centre_queue_status
from app.utils.validators import validate_queue_status, check_personal_info, sanitize_text

public_bp = Blueprint('public', __name__, url_prefix='/api')

@public_bp.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'application': 'SevaQueue',
        'tagline': 'Know Before You Visit',
        'timestamp': datetime.utcnow().isoformat(),
        'mode': 'independent-pilot-demonstration'
    }), 200

@public_bp.route('/centres', methods=['GET'])
def get_centres():
    query = Centre.query.filter_by(is_active=True)
    district = request.args.get('district')
    search = request.args.get('search')

    if district:
        query = query.filter(Centre.district.ilike(f"%{district.strip()}%"))
    if search:
        query = query.filter(
            (Centre.name.ilike(f"%{search.strip()}%")) |
            (Centre.district.ilike(f"%{search.strip()}%")) |
            (Centre.block.ilike(f"%{search.strip()}%"))
        )

    centres = query.all()
    results = []
    for c in centres:
        c_dict = c.to_dict()
        c_dict['queue_summary'] = compute_centre_queue_status(c.id)
        c_dict['service_count'] = c.services.filter_by(is_active=True).count()
        results.append(c_dict)

    return jsonify({'success': True, 'centres': results}), 200

@public_bp.route('/centres/<int:centre_id>', methods=['GET'])
def get_centre(centre_id):
    centre = Centre.query.get_or_404(centre_id)
    c_dict = centre.to_dict()
    c_dict['queue_summary'] = compute_centre_queue_status(centre.id)
    c_dict['service_count'] = centre.services.filter_by(is_active=True).count()
    return jsonify({'success': True, 'centre': c_dict}), 200

@public_bp.route('/centres/<int:centre_id>/services', methods=['GET'])
def get_centre_services(centre_id):
    centre = Centre.query.get_or_404(centre_id)
    category = request.args.get('category')
    search = request.args.get('search')

    query = Service.query.filter_by(centre_id=centre.id, is_active=True)
    if category and category != 'All':
        query = query.filter_by(category=category)
    if search:
        query = query.filter(
            (Service.name.ilike(f"%{search.strip()}%")) |
            (Service.description.ilike(f"%{search.strip()}%"))
        )

    services = [s.to_dict() for s in query.all()]
    return jsonify({
        'success': True,
        'centre': {'id': centre.id, 'name': centre.name},
        'services': services
    }), 200

@public_bp.route('/centres/<int:centre_id>/queue', methods=['GET'])
def get_centre_queue(centre_id):
    centre = Centre.query.get_or_404(centre_id)
    status_data = compute_centre_queue_status(centre.id)
    return jsonify({
        'success': True,
        'centre': {
            'id': centre.id,
            'name': centre.name,
            'address': centre.address,
            'district': centre.district,
            'block': centre.block,
            'opening_hours': centre.opening_hours
        },
        'queue': status_data
    }), 200

@public_bp.route('/services', methods=['GET'])
def get_all_services():
    query = Service.query.filter_by(is_active=True)
    category = request.args.get('category')
    search = request.args.get('search')
    centre_id = request.args.get('centre_id')

    if centre_id:
        query = query.filter_by(centre_id=centre_id)
    if category and category != 'All':
        query = query.filter_by(category=category)
    if search:
        query = query.filter(
            (Service.name.ilike(f"%{search.strip()}%")) |
            (Service.description.ilike(f"%{search.strip()}%"))
        )

    services = [s.to_dict() for s in query.all()]
    
    # Also fetch all distinct categories for filtering
    categories = [r[0] for r in db.session.query(Service.category).distinct().all() if r[0]]

    return jsonify({
        'success': True,
        'count': len(services),
        'categories': ['All'] + sorted(categories),
        'services': services
    }), 200

@public_bp.route('/public/observations', methods=['POST'])
def submit_anonymous_observation():
    allow_anon = Setting.get('allow_anonymous_observations', 'true').lower() == 'true'
    if not allow_anon:
        return jsonify({
            'success': False,
            'message': 'Anonymous public observations are currently disabled by the pilot policy.'
        }), 403

    data = request.get_json() or {}
    centre_id = data.get('centre_id')
    queue_status = (data.get('queue_status') or '').upper()
    notes = sanitize_text(data.get('notes', ''))
    waiting_range = sanitize_text(data.get('waiting_range', ''))

    if not centre_id:
        return jsonify({'success': False, 'message': 'Centre is required.'}), 400

    centre = Centre.query.get(centre_id)
    if not centre or not centre.is_active:
        return jsonify({'success': False, 'message': 'Invalid or inactive centre.'}), 400

    if not validate_queue_status(queue_status):
        return jsonify({'success': False, 'message': 'Valid queue status (LOW, MODERATE, HIGH, UNKNOWN) is required.'}), 400

    has_pii, warning = check_personal_info(notes)
    if has_pii:
        return jsonify({'success': False, 'message': warning}), 400

    observation = Observation(
        observer_id=None,
        centre_id=centre.id,
        queue_status=queue_status,
        waiting_range=waiting_range if waiting_range else None,
        notes=notes if notes else None,
        submission_source='PUBLIC_ANONYMOUS',
        review_status='PENDING',
        submitted_at=datetime.utcnow()
    )
    db.session.add(observation)
    db.session.commit()

    return jsonify({
        'success': True,
        'message': 'Thank you! Your observation has been submitted and queued for administrator review before affecting the published status.',
        'observation_id': observation.id
    }), 201

@public_bp.route('/public/disclaimer', methods=['GET'])
def get_disclaimer():
    return jsonify({
        'success': True,
        'title': 'Independent Demonstration Project Disclaimer',
        'content': 'SevaQueue is an independent technological demonstration project and is NOT officially affiliated with, endorsed by, or operated by the Government of West Bengal or any Bangla Sahayata Kendra (BSK). All queue information reflects reviewed community observations or sample demo metrics and does not guarantee waiting times.',
        'tagline': 'Know Before You Visit.'
    }), 200

