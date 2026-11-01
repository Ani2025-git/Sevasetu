import os
from datetime import datetime, timedelta
from app import create_app
from app.models import db
from app.models.user import User
from app.models.centre import Centre
from app.models.service import Service
from app.models.observation import Observation
from app.models.queue_update import QueueUpdate
from app.models.audit_log import AuditLog
from app.models.setting import Setting

app = create_app()

def seed_database():
    with app.app_context():
        # Drop all and recreate
        db.drop_all()
        db.create_all()
        print("Recreated database tables successfully.")

        # Seed Settings
        Setting.set('stale_threshold_minutes', '30', 'Queue staleness threshold in minutes')
        Setting.set('allow_anonymous_observations', 'true', 'Enable public anonymous submissions')
        Setting.set('pilot_mode_label', 'Independent Demonstration Project', 'Pilot classification label')

        # Seed Users
        admin = User(
            name="Platform Admin (Demo)",
            email="admin@sevaqueue.org",
            role="admin",
            is_active=True
        )
        admin.set_password("Admin@123")

        observer = User(
            name="Field Observer Rahul (Demo)",
            email="observer@sevaqueue.org",
            role="observer",
            is_active=True
        )
        observer.set_password("Observer@123")

        observer2 = User(
            name="Citizen Volunteer Ananya (Demo)",
            email="volunteer@sevaqueue.org",
            role="observer",
            is_active=True
        )
        observer2.set_password("Volunteer@123")

        db.session.add_all([admin, observer, observer2])
        db.session.commit()
        print("Created demo users: admin@sevaqueue.org, observer@sevaqueue.org")

        # Seed Pilot Centre (Clear Sample Data)
        pilot_centre = Centre(
            name="SevaQueue Pilot Centre — Sample BSK",
            address="Plot 42, Service Road, Sample Panchayat Bhavan, Sample Location, West Bengal 700135",
            district="South 24 Parganas (Sample)",
            block="Bhangar I (Sample)",
            opening_hours="Monday - Saturday: 10:00 AM - 5:00 PM",
            weekly_holidays="Sunday & Gazetted Government Holidays",
            official_source_url="https://bsk.wb.gov.in",
            contact_details="Sample Demo Line: 1800-000-DEMO (For official inquiries, visit official BSK portal)",
            is_active=True,
            created_at=datetime.utcnow() - timedelta(days=30)
        )

        centre_2 = Centre(
            name="Secondary Demonstration Centre — North BSK (Sample)",
            address="Room 102, Block Development Office Complex, Barasat, North 24 Parganas, West Bengal 700124",
            district="North 24 Parganas (Sample)",
            block="Barasat I (Sample)",
            opening_hours="Monday - Friday: 10:00 AM - 5:30 PM",
            weekly_holidays="Saturday, Sunday & State Holidays",
            official_source_url="https://bsk.wb.gov.in",
            contact_details="Sample Demo Helpdesk",
            is_active=True,
            created_at=datetime.utcnow() - timedelta(days=20)
        )

        db.session.add_all([pilot_centre, centre_2])
        db.session.commit()
        print("Created pilot centres.")

        # Seed Services for Pilot Centre
        services_data = [
            {
                'centre_id': pilot_centre.id,
                'name': 'Income Certificate Information (Sample)',
                'category': 'Certificates & Revenue',
                'description': 'Informational guidance on obtaining an official Income Certificate issued by the competent authority. Citizens must bring proof of income and residential documents.',
                'required_documents': "1. Recent Passport Sized Photograph (2 copies)\n2. Proof of Identity (Aadhaar Card / Voter ID / PAN Card)\n3. Proof of Residential Address (Electricity Bill / Ration Card / Municipal Tax Receipt)\n4. Salary Slip or Employer Certificate / IT Return / Self-declaration certified by Gram Panchayat Pradhan / Councilor\n5. Land revenue receipt (if agricultural income)",
                'official_source_url': 'https://edistrict.wb.gov.in',
                'last_verified_at': datetime.utcnow() - timedelta(days=2)
            },
            {
                'centre_id': pilot_centre.id,
                'name': 'Caste Certificate Information (SC/ST/OBC) (Sample)',
                'category': 'Certificates & Revenue',
                'description': 'Informational guidance on application procedures for Scheduled Caste, Scheduled Tribe, and Other Backward Class certificates under Backward Classes Welfare Department.',
                'required_documents': "1. Proof of Date of Birth (Birth Certificate / Madhyamik Admit Card)\n2. Proof of Identity (Voter Card / Aadhaar Card)\n3. Proof of Residence in West Bengal (Ration card / Land title)\n4. Blood relation caste certificate with genealogy chart or 2 local witness statements\n5. Income declaration for OBC Creamy Layer check",
                'official_source_url': 'https://castcertificatewb.gov.in',
                'last_verified_at': datetime.utcnow() - timedelta(days=4)
            },
            {
                'centre_id': pilot_centre.id,
                'name': 'Digital Ration Card Services Information (Sample)',
                'category': 'Food & Supplies',
                'description': 'Overview of non-subsidized / subsidized digital ration card verification, linking with Aadhaar, surname correction, and family member addition guidelines.',
                'required_documents': "1. Existing Ration Card photocopy\n2. Aadhaar cards of all family members\n3. Active mobile number linked to Aadhaar (for OTP verification)\n4. Residential certificate or LPG connection passbook",
                'official_source_url': 'https://food.wb.gov.in',
                'last_verified_at': datetime.utcnow() - timedelta(days=1)
            },
            {
                'centre_id': pilot_centre.id,
                'name': 'Scholarship Schemes Information (Aikyashree & Oasis) (Sample)',
                'category': 'Education & Welfare',
                'description': 'Guidance on application cycles, eligibility criteria, and documentation needed for Pre-Matric, Post-Matric, and Merit-cum-Means scholarships in West Bengal.',
                'required_documents': "1. Previous qualifying examination marksheet\n2. Active Bank Account passbook (single account in applicant's name with IFSC)\n3. Family Annual Income Certificate\n4. Domicile Certificate of West Bengal\n5. Institution Verification Certificate / Fee Receipt",
                'official_source_url': 'https://wbmdfcscholarship.in',
                'last_verified_at': datetime.utcnow() - timedelta(days=5)
            },
            {
                'centre_id': pilot_centre.id,
                'name': 'Swasthya Sathi Scheme Guidance (Sample)',
                'category': 'Health & Insurance',
                'description': 'Information on basic health cover up to Rs 5 lakh per family per annum, card status check, new member enrolment, and smart card replacement procedures.',
                'required_documents': "1. Existing Swasthya Sathi Card or Registration Acknowledgement Slip\n2. Aadhaar card of head of family (usually female member)\n3. Aadhaar cards and photographs of all dependent members\n4. Digital Ration Card",
                'official_source_url': 'https://swasthyasathi.gov.in',
                'last_verified_at': datetime.utcnow() - timedelta(days=3)
            },
            {
                'centre_id': pilot_centre.id,
                'name': 'Kanyashree Prakalpa Application Information (Sample)',
                'category': 'Education & Welfare',
                'description': 'Eligibility requirements and school/college coordination guidance for K1 (annual scholarship for unmarried girls 13-18) and K2 (one-time grant at 18).',
                'required_documents': "1. Institutional Enrolment Certificate\n2. Birth Certificate from Municipal Corporation / Gram Panchayat\n3. Declaration of Unmarried Status signed by Parent / Guardian\n4. Bank Account Passbook in applicant girl's sole name\n5. Disability Certificate (if applicable)",
                'official_source_url': 'https://kanyashree.wb.gov.in',
                'last_verified_at': datetime.utcnow() - timedelta(days=3)
            }
        ]

        for s_data in services_data:
            s = Service(**s_data, is_active=True)
            db.session.add(s)

        db.session.commit()
        print("Created sample services.")

        # Seed Observations (Approved & Pending)
        # Note: We put recent timestamps so pilot shows active queue status
        now = datetime.utcnow()

        obs1 = Observation(
            observer_id=observer.id,
            centre_id=pilot_centre.id,
            queue_status='MODERATE',
            waiting_range='15 - 25 minutes',
            notes='Counter 1 (Certificates) has about 8 people in queue. Token dispensing is functioning smoothly.',
            submission_source='REGISTERED_OBSERVER',
            review_status='APPROVED',
            submitted_at=now - timedelta(minutes=18),
            reviewed_by=admin.id,
            reviewed_at=now - timedelta(minutes=14),
            review_notes='Verified with field coordinator log.'
        )

        obs2 = Observation(
            observer_id=observer2.id,
            centre_id=pilot_centre.id,
            queue_status='MODERATE',
            waiting_range='20 minutes',
            notes='Moderate crowd inside waiting hall. Digital ration service counter moving at steady pace.',
            submission_source='REGISTERED_OBSERVER',
            review_status='APPROVED',
            submitted_at=now - timedelta(minutes=12),
            reviewed_by=admin.id,
            reviewed_at=now - timedelta(minutes=8),
            review_notes='Consistent with observer report.'
        )

        obs3 = Observation(
            observer_id=None,
            centre_id=pilot_centre.id,
            queue_status='MODERATE',
            waiting_range='10 - 20 mins',
            notes='Clean seating area, server connection is working fine today.',
            submission_source='PUBLIC_ANONYMOUS',
            review_status='PENDING',
            submitted_at=now - timedelta(minutes=4)
        )

        obs4 = Observation(
            observer_id=observer.id,
            centre_id=centre_2.id,
            queue_status='LOW',
            waiting_range='Under 10 minutes',
            notes='Few visitors early afternoon. All 3 service windows open.',
            submission_source='REGISTERED_OBSERVER',
            review_status='APPROVED',
            submitted_at=now - timedelta(minutes=22),
            reviewed_by=admin.id,
            reviewed_at=now - timedelta(minutes=15)
        )

        db.session.add_all([obs1, obs2, obs3, obs4])
        db.session.commit()
        print("Created sample observations.")

        # Seed Published Queue Updates
        # For pilot centre: published 10 minutes ago as MODERATE based on 2 approved observations
        update1 = QueueUpdate(
            centre_id=pilot_centre.id,
            queue_status='MODERATE',
            source_type='OBSERVER_VERIFIED',
            source_description='Reviewed Observer Reports (Field Observer & Volunteer)',
            supporting_observations=2,
            updated_by=admin.id,
            created_at=now - timedelta(minutes=10)
        )

        # For centre 2: published 15 minutes ago as LOW
        update2 = QueueUpdate(
            centre_id=centre_2.id,
            queue_status='LOW',
            source_type='OBSERVER_VERIFIED',
            source_description='On-site Volunteer Observation Check',
            supporting_observations=1,
            updated_by=admin.id,
            created_at=now - timedelta(minutes=15)
        )

        db.session.add_all([update1, update2])
        db.session.commit()
        print("Created published queue updates.")

        # Seed Initial Audit Logs
        log1 = AuditLog(
            user_id=admin.id,
            action='SYSTEM_INITIALIZATION',
            entity_type='System',
            entity_id=None,
            details='Database initialized with fictional pilot demo data for Bangla Sahayata Kendra simulation.'
        )
        log2 = AuditLog(
            user_id=admin.id,
            action='PUBLISH_QUEUE_STATUS',
            entity_type='QueueUpdate',
            entity_id=str(update1.id),
            details=f"Admin published MODERATE status for '{pilot_centre.name}' with 2 supporting observations."
        )
        db.session.add_all([log1, log2])
        db.session.commit()
        print("Database seeding completed successfully.")

if __name__ == '__main__':
    seed_database()

