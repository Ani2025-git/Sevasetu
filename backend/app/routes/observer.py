from flask import Blueprint, request, jsonify
from datetime import datetime
from app.models import db
from app.models.observation import Observation
from app.models.centre import Centre
from app.middleware.auth import observer_required
from app.utils.validators import validate_queue_status, check_personal_info, sanitize_text
from app.services.audit_service import log_audit

observer_bp = Blueprint('observer', __name__, url_prefix='/api')

@observer_bp.route('/observations', methods=['POST'])
@observer_required
def submit_observation():
    user = request.current_user
    data = request.get_json() or {}

    centre_id = data.get('centre_id')
    queue_status = (data.get('queue_status') or '').upper()
    waiting_range = sanitize_text(data.get('waiting_range', ''))
    notes = sanitize_text(data.get('notes', ''))

    if not centre_id:
        return jsonify({'success': False, 'message': 'Centre selection is required.'}), 400

    centre = Centre.query.get(centre_id)
    if not centre or not centre.is_active:
        return jsonify({'success': False, 'message': 'Invalid or inactive centre.'}), 400

    if not validate_queue_status(queue_status):
        return jsonify({'success': False, 'message': 'Valid queue status (LOW, MODERATE, HIGH, UNKNOWN) is required.'}), 400

    has_pii, warning = check_personal_info(notes)
    if has_pii:
        return jsonify({'success': False, 'message': warning}), 400

    observation = Observation(
        observer_id=user.id,
        centre_id=centre.id,
        queue_status=queue_status,
        waiting_range=waiting_range if waiting_range else None,
        notes=notes if notes else None,
        submission_source='REGISTERED_OBSERVER',
        review_status='PENDING',
        submitted_at=datetime.utcnow()
    )
    db.session.add(observation)
    db.session.commit()

    log_audit(
        user.id,
        'SUBMIT_OBSERVATION',
        'Observation',
        observation.id,
        f"Observer {user.name} submitted {queue_status} observation for {centre.name}."
    )

    return jsonify({
        'success': True,
        'message': 'Observation submitted successfully. It is now awaiting admin review.',
        'observation': observation.to_dict()
    }), 201

@observer_bp.route('/observations/my', methods=['GET'])
@observer_required
def my_observations():
    user = request.current_user
    observations = Observation.query.filter_by(observer_id=user.id)\
        .order_by(Observation.submitted_at.desc()).all()
    
    return jsonify({
        'success': True,
        'count': len(observations),
        'observations': [obs.to_dict() for obs in observations]
    }), 200

