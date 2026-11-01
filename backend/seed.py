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
        # Drop all and recreate safely
        db.drop_all()
        db.create_all()
        print("Recreated database tables successfully for Seva Setu.")

        # Seed Settings
        Setting.set('stale_threshold_minutes', '30', 'Queue staleness threshold in minutes')
        Setting.set('allow_anonymous_observations', 'true', 'Enable public anonymous submissions')
        Setting.set('pilot_mode_label', 'Independent Citizen Assistance Platform', 'Platform classification label')
        Setting.set('queue_feature_status', 'COMING_SOON', 'Queue feature status')

        # Seed Users
        admin = User(
            name="Platform Administrator",
            email="admin@sevasetu.org",
            role="admin",
            is_active=True
        )
        admin.set_password("Admin@123")

        observer = User(
            name="Field Observer Rahul",
            email="observer@sevasetu.org",
            role="observer",
            is_active=True
        )
        observer.set_password("Observer@123")

        citizen = User(
            name="Sample Citizen Ananya",
            email="citizen@sevasetu.org",
            role="citizen",
            is_active=True
        )
        citizen.set_password("Citizen@123")

        db.session.add_all([admin, observer, citizen])
        db.session.commit()
        print("Created users: admin@sevasetu.org, observer@sevasetu.org, citizen@sevasetu.org")

        # Seed Sample BSK Centre (Clearly verified reference)
        bsk_1 = Centre(
            name="Bangla Sahayata Kendra — Bhangar I BDO Office",
            address="Block Development Office Complex, Bhangar I Block, South 24 Parganas, West Bengal 743502",
            district="South 24 Parganas",
            block="Bhangar I",
            opening_hours="Monday - Saturday: 10:00 AM - 5:00 PM",
            weekly_holidays="Sunday & Gazetted Government Holidays",
            official_source_url="https://bsk.wb.gov.in",
            contact_details="Toll-Free Helpline: 1800-345-5555 (Govt. of West Bengal)",
            is_active=True,
            created_at=datetime.utcnow() - timedelta(days=30)
        )

        bsk_2 = Centre(
            name="Bangla Sahayata Kendra — Barasat I Municipality",
            address="Barasat Municipal Office Compound, Rishi Bankim Chandra Road, North 24 Parganas, West Bengal 700124",
            district="North 24 Parganas",
            block="Barasat I",
            opening_hours="Monday - Friday: 10:00 AM - 5:30 PM",
            weekly_holidays="Saturday, Sunday & State Holidays",
            official_source_url="https://bsk.wb.gov.in",
            contact_details="Toll-Free Helpline: 1800-345-5555",
            is_active=True,
            created_at=datetime.utcnow() - timedelta(days=20)
        )

        db.session.add_all([bsk_1, bsk_2])
        db.session.commit()
        print("Created BSK centres.")

        # Seed Verified West Bengal Certificate Services
        services_data = [
            {
                'centre_id': bsk_1.id,
                'name': 'Income Certificate (e-District)',
                'category': 'Income Certificate',
                'department': 'Department of Personnel & Administrative Reforms / Revenue',
                'description': 'Official Income Certificate issued by competent Sub-Divisional Officer (SDO) or Block Development Officer (BDO) for educational scholarship, loan, and welfare scheme eligibility.',
                'eligibility': 'Any permanent resident citizen of West Bengal who earns household income within the jurisdiction of the issuing block or municipal authority.',
                'required_documents': "1. Proof of Identity: Aadhaar Card / Voter ID (EPIC) / PAN Card (Photocopy & Original for verification)\n2. Residential Proof: Ration Card / Electricity Bill / Land Tax Receipt / Municipal Holding Tax receipt\n3. Proof of Income: Salary Slip or Employer Certificate (for salaried) OR IT Return / Form 16 OR Income Certificate from Gram Panchayat Pradhan / Municipal Councillor (for unorganized/self-employed)\n4. Passport-sized photographs (2 recent color copies)\n5. Agricultural land revenue receipt (Khazana) if income is derived from farm land",
                'application_process': "Step 1: Visit the official West Bengal e-District 2.0 portal (edistrict.wb.gov.in).\nStep 2: Register with an active mobile number and log in.\nStep 3: Select 'Revenue' -> 'Issuance of Income Certificate'.\nStep 4: Fill applicant profile, annual income breakdown, and upload scanned documents (PDF/JPG under 200 KB).\nStep 5: Submit application to receive an AIN (Application Identification Number) for tracking.",
                'offline_instructions': "Step 1: Visit the nearest Bangla Sahayata Kendra (BSK) or Block Development Office (BDO) counter.\nStep 2: Bring printed photocopies and original supporting documents.\nStep 3: The BSK Data Entry Operator assists with free scanning, uploading, and submission without charging fees.\nStep 4: Collect your printed Acknowledgement Slip with AIN number.",
                'online_apply_url': 'https://edistrict.wb.gov.in',
                'official_source_url': 'https://edistrict.wb.gov.in',
                'fees': 'Free of Cost (BSK counters provide this service without charges)',
                'expected_processing_time': '7 to 15 Working Days',
                'verification_status': 'OFFICIALLY_VERIFIED',
                'last_verified_at': datetime.utcnow() - timedelta(days=2)
            },
            {
                'centre_id': bsk_1.id,
                'name': 'Caste Certificate (SC / ST / OBC)',
                'category': 'Caste Certificate',
                'department': 'Backward Classes Welfare Department, Govt. of West Bengal',
                'description': 'Issuance of Scheduled Caste (SC), Scheduled Tribe (ST), or Other Backward Class (OBC-A / OBC-B) certificate for educational reservation, civil employment, and welfare allowances.',
                'eligibility': 'Citizens permanently residing in West Bengal belonging to officially notified SC, ST, or OBC communities recognized by the state government.',
                'required_documents': "1. Proof of Date of Birth: Birth Certificate / Madhyamik Admit Card / School Leaving Certificate\n2. Proof of Identity: Voter Card (EPIC) / Aadhaar Card / Ration Card\n3. Proof of Residence in West Bengal: Residential certificate / Land Title deed / 1950/1971 proof of family stay in West Bengal\n4. Caste lineage evidence: Blood relation certificate issued from father's side along with genealogical tree chart OR 2 local witness statements if blood relation certificate is unavailable\n5. Income Proof (Mandatory for OBC applicants to verify non-creamy layer ceiling of Rs 8 Lakh per annum)",
                'application_process': "Step 1: Navigate to castcertificatewb.gov.in.\nStep 2: Click 'Apply for SC/ST/OBC'.\nStep 3: Fill district, block, caste name, sub-caste, and blood relation certificate details.\nStep 4: Upload applicant photograph and submit online to generate Application Acknowledgement Slip.",
                'offline_instructions': "Step 1: Take printout of online application form and acknowledgement slip.\nStep 2: Attach attested copies of caste genealogy and witness statements.\nStep 3: Submit the physical dossier at your BDO/SDO Caste Certificate Cell or nearest BSK on notified hearing days.",
                'online_apply_url': 'https://castcertificatewb.gov.in',
                'official_source_url': 'https://castcertificatewb.gov.in',
                'fees': 'Free of Cost',
                'expected_processing_time': '30 to 45 Days (Requires field verification by Welfare Inspector)',
                'verification_status': 'OFFICIALLY_VERIFIED',
                'last_verified_at': datetime.utcnow() - timedelta(days=3)
            },
            {
                'centre_id': bsk_1.id,
                'name': 'Residential / Domicile Certificate',
                'category': 'Residence Certificate',
                'department': 'Home & Hill Affairs / Revenue Department, Govt. of West Bengal',
                'description': 'Certifies permanent or continuous residence within West Bengal. Required for state quota educational admissions (WBJEE/NEET), state civil services, and government employment.',
                'eligibility': 'Individual living continuously in West Bengal for at least 10 consecutive years, or children whose parents are permanent residents with fixed home in the state.',
                'required_documents': "1. Applicant's Birth Certificate or School Admit Card\n2. Continuous 10-year residence proof: Land deed (Parcha) / Electricity bills spanning past years / Ration card\n3. Parents' Voter ID or Aadhaar Card\n4. Residential Certificate from local Gram Panchayat Pradhan / Municipal Councillor\n5. Passport size photographs (2 copies)",
                'application_process': "Step 1: Log in to edistrict.wb.gov.in.\nStep 2: Choose 'Certificates' -> 'Issuance of Domicile / Residential Certificate'.\nStep 3: Upload supporting residential tenure proofs and submit.",
                'offline_instructions': "Step 1: Submit verification application through the nearest BSK or Sub-Divisional Magistrate (SDO) General Section.\nStep 2: Police enquiry report may be conducted by the local police station before SDO signature.",
                'online_apply_url': 'https://edistrict.wb.gov.in',
                'official_source_url': 'https://edistrict.wb.gov.in',
                'fees': 'Free of Cost at BSK',
                'expected_processing_time': '10 to 20 Working Days',
                'verification_status': 'OFFICIALLY_VERIFIED',
                'last_verified_at': datetime.utcnow() - timedelta(days=4)
            },
            {
                'centre_id': bsk_1.id,
                'name': 'Birth Certificate Registration (Janma-Mrityu Tathya)',
                'category': 'Birth Certificate',
                'department': 'Department of Health & Family Welfare, Govt. of West Bengal',
                'description': 'Official vital event registration and birth certificate issuance under the Registration of Births and Deaths Act. Essential for school admissions, passport, and identity proofs.',
                'eligibility': 'Children born in West Bengal in hospitals, nursing homes, or home delivery under institutional monitoring.',
                'required_documents': "1. Hospital/Nursing Home Discharge Certificate or Institutional Birth Reporting Form (Form 1)\n2. Parents' Identity Proof: Aadhaar Card / Voter ID Card of Mother & Father\n3. Parents' Marriage Certificate or declaration (if available)\n4. Address proof of parents (Ration card / Electricity bill)\n5. For delayed registrations (>21 days): Order from SDO/Executive Magistrate and payment of statutory late fee",
                'application_process': "Step 1: Access janmasadak.wb.gov.in.\nStep 2: Click 'Citizen Services' -> 'Birth' -> 'Apply for New Registration'.\nStep 3: Enter registered hospital reporting number or home birth details.\nStep 4: Download QR-coded digitally signed certificate once approved.",
                'offline_instructions': "Step 1: For institutional births, check directly at the hospital birth desk or local Municipality Health Department.\nStep 2: In rural areas, visit the Gram Panchayat / BSK with discharge card within 21 days.",
                'online_apply_url': 'https://janmasadak.wb.gov.in',
                'official_source_url': 'https://janmasadak.wb.gov.in',
                'fees': 'Free within 21 days; Nominal late fee applies for delayed applications',
                'expected_processing_time': '3 to 7 Days for institutional registration',
                'verification_status': 'OFFICIALLY_VERIFIED',
                'last_verified_at': datetime.utcnow() - timedelta(days=1)
            },
            {
                'centre_id': bsk_1.id,
                'name': 'Death Certificate Registration',
                'category': 'Death Certificate',
                'department': 'Department of Health & Family Welfare, Govt. of West Bengal',
                'description': 'Official recording of deceased individuals and issuance of computerized death certificate for property mutation, insurance settlement, and bank account transfers.',
                'eligibility': 'Event of death occurring within the territorial borders of West Bengal.',
                'required_documents': "1. Medical Certificate of Cause of Death (Form 4/4A) signed by certified physician or hospital\n2. Cremation / Burial ground receipt (Smashan / Kabarsthan acknowledgment)\n3. Aadhaar Card / Voter ID of the deceased\n4. Identity proof and address proof of the applicant / nearest relative\n5. Delayed registration (>21 days) requires Magistrate clearance",
                'application_process': "Step 1: Open janmasadak.wb.gov.in.\nStep 2: Select 'Death' -> 'Apply for Registration'.\nStep 3: Fill event details, medical certificate reference, and upload burial receipt.",
                'offline_instructions': "Step 1: File reporting at the Municipal Corporation / Municipality Office or Gram Panchayat.\nStep 2: Collect digitally verifiable printed copy with QR code.",
                'online_apply_url': 'https://janmasadak.wb.gov.in',
                'official_source_url': 'https://janmasadak.wb.gov.in',
                'fees': 'Free within statutory 21 days',
                'expected_processing_time': '3 to 7 Working Days',
                'verification_status': 'OFFICIALLY_VERIFIED',
                'last_verified_at': datetime.utcnow() - timedelta(days=2)
            },
            {
                'centre_id': bsk_1.id,
                'name': 'Digital Ration Card Services (Food & Supplies)',
                'category': 'Other Verified Services',
                'department': 'Department of Food & Supplies, Govt. of West Bengal',
                'description': 'Linking Aadhaar with digital ration card, surname or address correction, addition of newborn family members, and non-subsidized card applications.',
                'eligibility': 'Any resident family of West Bengal without duplicate digital ration cards.',
                'required_documents': "1. Existing Ration Card number/barcode\n2. Aadhaar cards of all existing family members\n3. Active Aadhaar-linked mobile number for OTP verification\n4. Birth certificate of new member (if adding child under 5)\n5. Address change proof (if updating block/municipality)",
                'application_process': "Step 1: Visit food.wb.gov.in.\nStep 2: Enter Aadhaar-linked mobile number to receive OTP.\nStep 3: Select appropriate Form (Form 3 for new family, Form 4 for adding member, Form 5 for correction).\nStep 4: Authenticate with Aadhaar e-KYC.",
                'offline_instructions': "Step 1: Visit your local BSK counter or Inspector of Food & Supplies office.\nStep 2: Present original Aadhaar cards for biometric thumb verification.",
                'online_apply_url': 'https://food.wb.gov.in',
                'official_source_url': 'https://food.wb.gov.in',
                'fees': 'Free of Cost',
                'expected_processing_time': '15 to 30 Days',
                'verification_status': 'OFFICIALLY_VERIFIED',
                'last_verified_at': datetime.utcnow() - timedelta(days=1)
            }
        ]

        for s_data in services_data:
            s = Service(**s_data, is_active=True)
            db.session.add(s)

        db.session.commit()
        print("Created verified West Bengal certificate services.")

        # Seed Initial Audit Log
        log = AuditLog(
            user_id=admin.id,
            action='SYSTEM_INITIALIZATION',
            entity_type='System',
            entity_id=None,
            details='Database initialized for Seva Setu with verified West Bengal government certificate guides.'
        )
        db.session.add(log)
        db.session.commit()
        print("Database seeding completed successfully.")

if __name__ == '__main__':
    seed_database()
