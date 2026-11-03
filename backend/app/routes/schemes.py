from flask import Blueprint, request, jsonify
from datetime import datetime
from app.models import db
from app.models.scheme import (
    GovernmentScheme,
    SchemeCategory,
    SchemeDepartment,
    SchemeEligibilityRule,
    SchemeRequiredDocument,
    SchemeOfficialSource
)
from app.utils.validators import sanitize_text

schemes_bp = Blueprint('schemes', __name__, url_prefix='/api/schemes')

# ----------------- PUBLIC SCHEME LISTING -----------------
@schemes_bp.route('', methods=['GET'])
def get_schemes():
    try:
        # Only return PUBLISHED schemes to the public
        query = GovernmentScheme.query.filter_by(status='PUBLISHED')

        category = request.args.get('category')
        department_id = request.args.get('department_id')
        search = request.args.get('search')
        page = max(1, int(request.args.get('page', 1)))
        per_page = min(50, max(1, int(request.args.get('per_page', 9))))

        if category and category.lower() != 'all':
            # Match by category slug or name
            cat = SchemeCategory.query.filter(
                (SchemeCategory.slug == category.lower().strip()) |
                (SchemeCategory.name.ilike(category.strip()))
            ).first()
            if cat:
                query = query.filter_by(category_id=cat.id)
            else:
                # No match for this category
                return jsonify({
                    'success': True,
                    'schemes': [],
                    'total': 0,
                    'page': page,
                    'pages': 0,
                    'per_page': per_page
                }), 200

        if department_id:
            try:
                dept_id = int(department_id)
                query = query.filter_by(department_id=dept_id)
            except ValueError:
                pass

        if search:
            search_clean = sanitize_text(search).strip()
            if search_clean:
                s_term = f"%{search_clean}%"
                query = query.filter(
                    (GovernmentScheme.name.ilike(s_term)) |
                    (GovernmentScheme.short_description.ilike(s_term)) |
                    (GovernmentScheme.full_description.ilike(s_term)) |
                    (GovernmentScheme.beneficiary_summary.ilike(s_term))
                )

        # Order by recently verified or updated
        total = query.count()
        paginated_schemes = query.order_by(
            GovernmentScheme.last_verified_at.desc().nullslast(),
            GovernmentScheme.updated_at.desc()
        ).offset((page - 1) * per_page).limit(per_page).all()

        pages = (total + per_page - 1) // per_page if total > 0 else 1

        return jsonify({
            'success': True,
            'schemes': [s.to_dict(include_details=False) for s in paginated_schemes],
            'total': total,
            'page': page,
            'pages': pages,
            'per_page': per_page
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to retrieve schemes',
            'detail': str(e)
        }), 500

# ----------------- SCHEME CATEGORIES -----------------
@schemes_bp.route('/categories', methods=['GET'])
def get_categories():
    try:
        categories = SchemeCategory.query.filter_by(is_active=True).order_by(SchemeCategory.name).all()
        result = []
        for cat in categories:
            cat_dict = cat.to_dict()
            # Count published schemes in this category
            cat_dict['scheme_count'] = GovernmentScheme.query.filter_by(
                category_id=cat.id,
                status='PUBLISHED'
            ).count()
            result.append(cat_dict)

        return jsonify({
            'success': True,
            'categories': result
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to retrieve categories',
            'detail': str(e)
        }), 500

# ----------------- SCHEME DEPARTMENTS -----------------
@schemes_bp.route('/departments', methods=['GET'])
def get_departments():
    try:
        departments = SchemeDepartment.query.order_by(SchemeDepartment.name).all()
        result = []
        for dept in departments:
            dept_dict = dept.to_dict()
            dept_dict['scheme_count'] = GovernmentScheme.query.filter_by(
                department_id=dept.id,
                status='PUBLISHED'
            ).count()
            result.append(dept_dict)

        return jsonify({
            'success': True,
            'departments': result
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to retrieve departments',
            'detail': str(e)
        }), 500

# ----------------- SCHEME DETAILS BY SLUG -----------------
@schemes_bp.route('/<slug>', methods=['GET'])
def get_scheme_by_slug(slug):
    try:
        slug_clean = slug.strip().lower()
        scheme = GovernmentScheme.query.filter_by(slug=slug_clean).first()
        if not scheme:
            return jsonify({
                'success': False,
                'message': 'Government scheme not found'
            }), 404

        # For public access, require PUBLISHED status unless an admin preview token is present
        is_preview = request.args.get('preview') == 'true'
        if scheme.status != 'PUBLISHED' and not is_preview:
            return jsonify({
                'success': False,
                'message': 'Government scheme is not yet published for public viewing.'
            }), 404

        return jsonify({
            'success': True,
            'scheme': scheme.to_dict(include_details=True)
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to retrieve scheme details',
            'detail': str(e)
        }), 500

