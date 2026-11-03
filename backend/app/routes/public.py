from flask import Blueprint, request, jsonify
from datetime import datetime
from app.models import db
from app.models.centre import Centre
from app.models.service import Service
from app.models.saved_service import SavedService
from app.models.observation import Observation
from app.models.queue_update import QueueUpdate
from app.models.setting import Setting
from app.middleware.auth import jwt_required, get_current_user
from app.services.queue_service import compute_centre_queue_status
from app.utils.validators import validate_queue_status, check_personal_info, sanitize_text

public_bp = Blueprint('public', __name__, url_prefix='/api')

@public_bp.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'application': 'Seva Setu',
        'tagline': 'Your Government Services, Made Simple.',
        'timestamp': datetime.utcnow().isoformat(),
        'mode': 'independent-citizen-assistance-platform'
    }), 200

# ---------------- WEBSITE STATUS (MAINTENANCE CHECK) ----------------
@public_bp.route('/website-status', methods=['GET'])
def get_website_status():
    try:
        from app.models.website_setting import WebsiteSettings
        settings = WebsiteSettings.get_settings()
        return jsonify({
            'success': True,
            'is_maintenance_mode': settings.is_maintenance_mode,
            'status': 'OFFLINE' if settings.is_maintenance_mode else 'ONLINE',
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
            'updated_at': settings.updated_at.isoformat() if settings.updated_at else None
        }), 200
    except Exception as e:
        return jsonify({
            'success': True,
            'is_maintenance_mode': False,
            'status': 'ONLINE',
            'titles': {
                'en': "We'll Be Back Soon",
                'bn': "আমরা শীঘ্রই ফিরে আসব",
                'hi': "हम जल्द ही वापस आएंगे",
            },
            'messages': {
                'en': "Seva Setu is temporarily unavailable while we carry out maintenance. Please visit again soon.",
                'bn': "সেবা সেতু প্ল্যাটফর্মটি সাময়িকভাবে রক্ষণাবেক্ষণের অধীনে রয়েছে। অনুগ্রহ করে শীঘ্রই আবার পরিদর্শন করুন।",
                'hi': "सेवा सेतु प्लेटफॉर्म अस्थायी रूप से रखरखाव के अधीन है। कृपया जल्द ही पुनः पधारें।",
            },
            'estimated_reopening_at': None,
            'support_contact_email': 'support@sevasetu.org',
            'fallback': True
        }), 200

# ---------------- SERVICES ----------------
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
        s_term = f"%{search.strip()}%"
        query = query.filter(
            (Service.name.ilike(s_term)) |
            (Service.description.ilike(s_term)) |
            (Service.category.ilike(s_term)) |
            (Service.required_documents.ilike(s_term)) |
            (Service.department.ilike(s_term))
        )

    services = [s.to_dict() for s in query.all()]
    
    # All distinct categories
    categories = [r[0] for r in db.session.query(Service.category).distinct().all() if r[0]]

    return jsonify({
        'success': True,
        'count': len(services),
        'categories': ['All'] + sorted(categories),
        'services': services
    }), 200

@public_bp.route('/services/<int:service_id>', methods=['GET'])
def get_service_details(service_id):
    service = Service.query.get_or_404(service_id)
    s_dict = service.to_dict()

    # Check if saved by current logged-in user
    user = get_current_user()
    s_dict['is_saved'] = False
    if user:
        s_dict['is_saved'] = SavedService.query.filter_by(user_id=user.id, service_id=service.id).first() is not None

    return jsonify({'success': True, 'service': s_dict}), 200

# ---------------- SAVED SERVICES (FAVOURITES) ----------------
@public_bp.route('/saved-services', methods=['GET'])
@jwt_required
def get_saved_services():
    user = request.current_user
    saved = SavedService.query.filter_by(user_id=user.id).order_by(SavedService.created_at.desc()).all()
    return jsonify({
        'success': True,
        'count': len(saved),
        'saved_services': [item.to_dict() for item in saved]
    }), 200

@public_bp.route('/saved-services', methods=['POST'])
@jwt_required
def save_service():
    user = request.current_user
    data = request.get_json() or {}
    service_id = data.get('service_id')

    if not service_id:
        return jsonify({'success': False, 'message': 'service_id is required'}), 400

    service = Service.query.get(service_id)
    if not service:
        return jsonify({'success': False, 'message': 'Service not found'}), 404

    existing = SavedService.query.filter_by(user_id=user.id, service_id=service.id).first()
    if existing:
        return jsonify({'success': True, 'message': 'Service already bookmarked', 'saved': existing.to_dict()}), 200

    new_saved = SavedService(user_id=user.id, service_id=service.id)
    db.session.add(new_saved)
    db.session.commit()

    return jsonify({
        'success': True,
        'message': 'Service added to your favourites.',
        'saved': new_saved.to_dict()
    }), 201

@public_bp.route('/saved-services/<int:service_id>', methods=['DELETE'])
@jwt_required
def remove_saved_service(service_id):
    user = request.current_user
    saved = SavedService.query.filter_by(user_id=user.id, service_id=service_id).first()
    if saved:
        db.session.delete(saved)
        db.session.commit()
    return jsonify({'success': True, 'message': 'Service removed from favourites.'}), 200

# ---------------- CENTRES ----------------
@public_bp.route('/centres', methods=['GET'])
def get_centres():
    query = Centre.query.filter_by(is_active=True)
    district = request.args.get('district')
    block = request.args.get('block')
    search = request.args.get('search')

    if district and district != 'All':
        query = query.filter(Centre.district.ilike(f"%{district.strip()}%"))
    if block and block != 'All':
        query = query.filter(Centre.block.ilike(f"%{block.strip()}%"))
    if search:
        s_term = f"%{search.strip()}%"
        query = query.filter(
            (Centre.name.ilike(s_term)) |
            (Centre.district.ilike(s_term)) |
            (Centre.block.ilike(s_term)) |
            (Centre.address.ilike(s_term))
        )

    centres = query.all()
    results = []
    for c in centres:
        c_dict = c.to_dict()
        c_dict['queue_summary'] = compute_centre_queue_status(c.id)
        c_dict['service_count'] = c.services.filter_by(is_active=True).count()
        results.append(c_dict)

    # Distinct districts & blocks for filters
    districts = [r[0] for r in db.session.query(Centre.district).distinct().all() if r[0]]
    blocks = [r[0] for r in db.session.query(Centre.block).distinct().all() if r[0]]

    return jsonify({
        'success': True,
        'centres': results,
        'districts': ['All'] + sorted(districts),
        'blocks': ['All'] + sorted(blocks)
    }), 200

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
    services = [s.to_dict() for s in Service.query.filter_by(is_active=True).all()]
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

# ---------------- DISCLAIMER ----------------
@public_bp.route('/public/disclaimer', methods=['GET'])
def get_disclaimer():
    return jsonify({
        'success': True,
        'title': 'Independent Platform Notice',
        'content': 'Seva Setu is an independent citizen assistance platform designed to simplify access to government service information in West Bengal. It is NOT officially affiliated with, endorsed by, or operated by the Government of West Bengal or any Bangla Sahayata Kendra (BSK). All application links redirect safely to official state portals.',
        'tagline': 'Government Services, Made Simpler.'
    }), 200
