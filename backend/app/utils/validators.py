import re

ALLOWED_QUEUE_STATUSES = {'LOW', 'MODERATE', 'HIGH', 'UNKNOWN'}
ALLOWED_REVIEW_STATUSES = {'PENDING', 'APPROVED', 'REJECTED'}
ALLOWED_ROLES = {'admin', 'observer', 'public'}

EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$')
PHONE_REGEX = re.compile(r'\b(?:\+91|0)?[6-9]\d{9}\b')
AADHAAR_REGEX = re.compile(r'\b\d{4}\s?\d{4}\s?\d{4}\b')

def validate_email(email):
    if not email or not isinstance(email, str):
        return False
    return bool(EMAIL_REGEX.match(email.strip()))

def validate_queue_status(status):
    if not status or not isinstance(status, str):
        return False
    return status.upper() in ALLOWED_QUEUE_STATUSES

def sanitize_text(text):
    if text is None:
        return ''
    # strip dangerous control chars
    return str(text).strip()

def check_personal_info(notes):
    """
    Checks if notes might contain sensitive personal details like phone number or Aadhaar.
    Returns (has_pii, warning_message).
    """
    if not notes:
        return False, None
    if PHONE_REGEX.search(notes):
        return True, "Notes appear to contain a phone number. For privacy, do not enter personal contact details."
    if AADHAAR_REGEX.search(notes):
        return True, "Notes appear to contain an Aadhaar or identity number. Never submit citizen identity data."
    return False, None

