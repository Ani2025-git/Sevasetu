from datetime import datetime, timedelta, timezone
from app.models import db
from app.models.queue_update import QueueUpdate
from app.models.observation import Observation
from app.models.setting import Setting
from flask import current_app

def get_stale_threshold_minutes():
    val = Setting.get('stale_threshold_minutes')
    if val:
        try:
            return int(val)
        except ValueError:
            pass
    return current_app.config.get('DEFAULT_STALE_THRESHOLD_MINUTES', 30)

def compute_centre_queue_status(centre_id):
    """
    Computes the queue status for a given centre based on:
    1. The latest published QueueUpdate
    2. Check if the update is older than the stale threshold
    3. The number of recent approved observations
    4. Information source and reliability note
    """
    threshold_minutes = get_stale_threshold_minutes()
    latest_update = QueueUpdate.query.filter_by(centre_id=centre_id).order_by(QueueUpdate.created_at.desc()).first()
    
    # Count approved observations in the last 2 hours
    since_time = datetime.utcnow() - timedelta(hours=2)
    recent_approved_count = Observation.query.filter(
        Observation.centre_id == centre_id,
        Observation.review_status == 'APPROVED',
        Observation.submitted_at >= since_time
    ).count()

    if not latest_update:
        return {
            'status': 'UNKNOWN',
            'status_label': 'No Status Published',
            'is_stale': True,
            'stale_threshold_minutes': threshold_minutes,
            'last_updated': None,
            'source_type': 'NONE',
            'source_description': 'No queue information published yet for this centre.',
            'supporting_observations': 0,
            'recent_observations_count': recent_approved_count,
            'reliability_note': 'No recent update — please confirm operating conditions directly with the centre.',
            'display_banner': 'No Recent Update — Please confirm with the centre.'
        }

    # Check staleness
    time_diff = datetime.utcnow() - latest_update.created_at
    minutes_ago = int(time_diff.total_seconds() // 60)
    is_stale = minutes_ago >= threshold_minutes

    effective_status = latest_update.queue_status if not is_stale else 'UNKNOWN'
    
    if is_stale:
        reliability_note = f"Last published update was {minutes_ago} minutes ago (exceeds {threshold_minutes} min threshold). Independent pilot policy flags this as stale."
        display_banner = "No Recent Update — Please confirm with the centre."
    else:
        reliability_note = f"Verified from {latest_update.source_description} within the last {minutes_ago} minutes."
        display_banner = None

    return {
        'status': effective_status,
        'published_status': latest_update.queue_status,
        'is_stale': is_stale,
        'minutes_ago': minutes_ago,
        'stale_threshold_minutes': threshold_minutes,
        'last_updated': latest_update.created_at.isoformat(),
        'source_type': latest_update.source_type,
        'source_description': latest_update.source_description,
        'supporting_observations': latest_update.supporting_observations,
        'recent_observations_count': recent_approved_count,
        'author_name': latest_update.author.name if latest_update.author else 'Admin',
        'reliability_note': reliability_note,
        'display_banner': display_banner
    }

