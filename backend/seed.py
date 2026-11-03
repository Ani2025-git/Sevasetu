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

DEMO_USERS_SPEC = [
    ('admin@sevasetu.org', 'Platform Administrator', 'admin', 'Admin@123'),
    ('observer@sevasetu.org', 'Field Observer Rahul', 'observer', 'Observer@123'),
    ('citizen@sevasetu.org', 'Sample Citizen Ananya', 'citizen', 'Citizen@123'),
    ('admin@sevaqueue.org', 'Platform Administrator', 'admin', 'Admin@123'),
    ('observer@sevaqueue.org', 'Field Observer Rahul', 'observer', 'Observer@123'),
    ('citizen@sevaqueue.org', 'Sample Citizen Ananya', 'citizen', 'Citizen@123'),
]

def ensure_demo_users():
    for email, name, role, password in DEMO_USERS_SPEC:
        user = User.query.filter(db.func.lower(User.email) == email.lower()).first()
        if not user:
            user = User(
                name=name,
                email=email,
                role=role,
                is_active=True
            )
            user.set_password(password)
            db.session.add(user)
        else:
            user.role = role
            user.is_active = True
            user.set_password(password)
    db.session.commit()
    print("Verified all demo users.")

def seed_database(drop_existing=False):
    with app.app_context():
        if drop_existing:
            db.drop_all()
            print("Dropped existing database tables.")
        db.create_all()
        print("Verified database schema for Seva Setu.")

        # Seed Settings if not present
        if Setting.query.count() == 0:
            Setting.set('stale_threshold_minutes', '30', 'Queue staleness threshold in minutes')
            Setting.set('allow_anonymous_observations', 'true', 'Enable public anonymous submissions')
            Setting.set('pilot_mode_label', 'Independent Citizen Assistance Platform', 'Platform classification label')
            Setting.set('queue_feature_status', 'COMING_SOON', 'Queue feature status')
            print("Initialized default settings.")

        # Ensure all demo users exist with guaranteed credentials
        ensure_demo_users()
        admin = User.query.filter_by(email="admin@sevasetu.org").first()

        # Seed Sample BSK Centres if empty
        if Centre.query.count() == 0:
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
        else:
            bsk_1 = Centre.query.first()

        # Seed Verified West Bengal Certificate Services if empty
        if Service.query.count() == 0 and bsk_1:
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

        # Seed Initial Audit Log if empty
        if AuditLog.query.count() == 0 and admin:
            log = AuditLog(
                user_id=admin.id,
                action='SYSTEM_INITIALIZATION',
                entity_type='System',
                entity_id=None,
                details='Database initialized for Seva Setu with verified West Bengal government certificate guides.'
            )
            db.session.add(log)
            db.session.commit()
            print("Logged system initialization.")

        # Seed Government Schemes, Categories, and Departments
        seed_schemes(admin)
        print("Database seeding completed successfully.")

def seed_schemes(admin=None):
    from app.models.scheme import (
        SchemeCategory, SchemeDepartment, GovernmentScheme,
        SchemeEligibilityRule, SchemeRequiredDocument, SchemeOfficialSource,
        SchemeVerificationHistory
    )
    from app.models.user import User

    if not admin:
        admin = User.query.filter_by(email="admin@sevasetu.org").first()
    admin_id = admin.id if admin else None

    # 1. Categories
    CATEGORIES_DATA = [
        ('Education', 'education', 'Scholarships, student stipends, school subsidies, and educational empowerment.'),
        ('Health', 'health', 'Universal healthcare coverage, health cards, critical illness assistance, and clinical care.'),
        ('Women & Child Welfare', 'women-child-welfare', 'Direct cash transfers, girl-child empowerment, maternal health, and nutrition.'),
        ('Agriculture', 'agriculture', 'Direct farmer income support, crop insurance, farming subsidies, and agricultural death benefits.'),
        ('Employment & Skill Development', 'employment-skill-development', 'Youth unemployment assistance, vocational training, apprenticeships, and job facilitation.'),
        ('Financial Assistance', 'financial-assistance', 'Monthly direct benefit transfers, subsistence allowances, and livelihood grants.'),
        ('Social Welfare', 'social-welfare', 'Caste and tribal development, disability allowances, and minority welfare schemes.'),
        ('Housing', 'housing', 'Rural and urban pucca housing construction subsidies and shelter assistance.'),
        ('Senior Citizens', 'senior-citizens', 'Old-age pensions, widow pensions, and elderly welfare provisions.'),
        ('Other Government Schemes', 'other-schemes', 'General citizen facilitation, emergency relief, and community welfare programs.')
    ]

    cat_map = {}
    for name, slug, desc in CATEGORIES_DATA:
        cat = SchemeCategory.query.filter_by(slug=slug).first()
        if not cat:
            cat = SchemeCategory(name=name, slug=slug, description=desc, is_active=True)
            db.session.add(cat)
            db.session.flush()
        cat_map[slug] = cat

    # 2. Departments
    DEPARTMENTS_DATA = [
        ('Department of Women & Child Development and Social Welfare', 'https://wb.gov.in', 'Nodal department for women, children, disability, and social security pensions.'),
        ('Department of Agriculture', 'https://matirkatha.net', 'Agricultural policies, farmer empowerment, and food crop security in West Bengal.'),
        ('Department of Health & Family Welfare', 'https://wbhealth.gov.in', 'Healthcare delivery, public hospitals, and the Swasthya Sathi scheme.'),
        ('Department of Higher Education', 'https://wbhed.gov.in', 'Higher secondary, college scholarships, student credit card, and university affairs.'),
        ('Department of Labour', 'https://wblabour.gov.in', 'Unemployment assistance, worker welfare, and Yuvasree employment bank.'),
        ('Department of Backward Classes Welfare', 'https://anagrasarkalyan.gov.in', 'Scheduled Caste, Scheduled Tribe, and OBC welfare and scholarship programs.'),
        ('Department of Housing', 'https://wbhousing.gov.in', 'State housing development and urban dwelling assistance programs.')
    ]

    dept_map = {}
    for name, website, desc in DEPARTMENTS_DATA:
        dept = SchemeDepartment.query.filter_by(name=name).first()
        if not dept:
            dept = SchemeDepartment(name=name, official_website=website, description=desc)
            db.session.add(dept)
            db.session.flush()
        dept_map[name] = dept

    db.session.commit()

    # 3. Seed Schemes if empty
    if GovernmentScheme.query.count() == 0:
        SCHEMES_SPEC = [
            {
                'name': 'Kanyashree Prakalpa (K1 & K2)',
                'slug': 'kanyashree-prakalpa',
                'category_slug': 'women-child-welfare',
                'dept_name': 'Department of Women & Child Development and Social Welfare',
                'beneficiary_summary': 'Unmarried female students aged 13–19 enrolled in recognized schools and colleges in West Bengal',
                'short_description': 'United Nations Public Service Award-winning conditional cash transfer providing Rs. 1,000 annually (K1) and a one-time grant of Rs. 25,000 (K2) to encourage girl-child education and prevent early marriage.',
                'full_description': 'Kanyashree Prakalpa is a flagship welfare program by the Government of West Bengal designed to elevate the status of adolescent girls by encouraging education and preventing child marriage. K1 provides an annual scholarship of Rs. 1,000 for girls aged 13 to 18 enrolled in Class VIII to XII. K2 provides a one-time lump sum grant of Rs. 25,000 upon reaching 18 years of age if the beneficiary remains unmarried and continues education or recognized vocational training.',
                'application_instructions': "Step 1: Obtain the official Kanyashree Form (Form K1 for annual scholarship or Form K2 for one-time grant) free from your school/college.\nStep 2: Fill applicant personal information, educational enrollment number, and bank account particulars.\nStep 3: Attach verified birth certificate, unmarried declaration, and copy of active bank passbook.\nStep 4: Submit the physical dossier to the Head of Institution (School Principal / Headmaster).\nStep 5: Institution verifies credentials and uploads directly to the state wbkanyashree.gov.in portal.\nStep 6: An official 20-digit Kanyashree ID is generated for tracking status online.",
                'official_application_url': 'https://wbkanyashree.gov.in',
                'official_info_url': 'https://wbkanyashree.gov.in',
                'status': 'PUBLISHED',
                'verification_status': 'VERIFIED',
                'last_verified_at': datetime.utcnow() - timedelta(days=2),
                'rules': [
                    {'rule_type': 'AGE', 'rule_description': 'Applicant must be between 13 and 18 years (K1) or 18 and 19 years (K2).', 'minimum_age': 13, 'maximum_age': 19, 'is_mandatory': True},
                    {'rule_type': 'GENDER', 'rule_description': 'Applicant must be female.', 'is_mandatory': True},
                    {'rule_type': 'RESIDENCE', 'rule_description': 'Must be a permanent resident of West Bengal.', 'residence_requirement': 'Permanent resident of West Bengal', 'is_mandatory': True},
                    {'rule_type': 'EDUCATION', 'rule_description': 'Must be enrolled in a recognized secondary/higher secondary institution or college in West Bengal.', 'is_mandatory': True},
                    {'rule_type': 'GENERAL', 'rule_description': 'Must remain unmarried until age 18.', 'is_mandatory': True}
                ],
                'documents': [
                    {'document_name': 'Birth Certificate', 'description': 'Issued by Municipal Corporation, Municipality, or Gram Panchayat', 'is_mandatory': True},
                    {'document_name': 'Proof of School/College Enrollment', 'description': 'Certificate issued by the Head of Institution', 'is_mandatory': True},
                    {'document_name': 'Declaration of Being Unmarried', 'description': 'Signed by applicant and endorsed by parents/guardian', 'is_mandatory': True},
                    {'document_name': 'Bank Passbook Copy', 'description': 'Single-operator savings account in applicant name with IFSC and Account Number', 'is_mandatory': True},
                    {'document_name': 'Passport Sized Photographs', 'description': '2 recent color photographs', 'is_mandatory': True}
                ],
                'sources': [
                    {'source_title': 'Official Kanyashree Portal', 'source_url': 'https://wbkanyashree.gov.in', 'source_department': 'Department of Women & Child Development and Social Welfare', 'source_type': 'OFFICIAL_PORTAL'}
                ]
            },
            {
                'name': 'Lakshmir Bhandar Scheme',
                'slug': 'lakshmir-bhandar',
                'category_slug': 'financial-assistance',
                'dept_name': 'Department of Women & Child Development and Social Welfare',
                'beneficiary_summary': 'Female heads of household aged 25 to 60 residing permanently in West Bengal',
                'short_description': 'Direct monthly financial support of Rs. 1,000 for General category and Rs. 1,200 for SC/ST category transferred directly to female heads of family.',
                'full_description': 'Lakshmir Bhandar is an ambitious basic income guarantee initiative launched by the Government of West Bengal to ensure women empowerment and financial self-reliance across the state. Under this scheme, eligible women receive direct benefit transfers monthly into their Aadhaar-seeded bank accounts without intermediaries.',
                'application_instructions': "Step 1: Collect the official Lakshmir Bhandar application form at your local Duare Sarkar Camp or Block Development Office (BDO) counter.\nStep 2: Fill applicant name, Swasthya Sathi card number, Aadhaar number, and bank account IFSC.\nStep 3: Attach self-attested photocopies of Swasthya Sathi card, Aadhaar card, and bank passbook.\nStep 4: Submit at Duare Sarkar or BSK counter and receive a stamped acknowledgement slip.\nStep 5: Track payment status on socialsecurity.wb.gov.in.",
                'official_application_url': 'https://socialsecurity.wb.gov.in',
                'official_info_url': 'https://wb.gov.in',
                'status': 'PUBLISHED',
                'verification_status': 'VERIFIED',
                'last_verified_at': datetime.utcnow() - timedelta(days=1),
                'rules': [
                    {'rule_type': 'AGE', 'rule_description': 'Applicant female must be aged between 25 and 60 years.', 'minimum_age': 25, 'maximum_age': 60, 'is_mandatory': True},
                    {'rule_type': 'GENDER', 'rule_description': 'Exclusively for female heads of household.', 'is_mandatory': True},
                    {'rule_type': 'RESIDENCE', 'rule_description': 'Must be a permanent resident of West Bengal.', 'residence_requirement': 'West Bengal', 'is_mandatory': True},
                    {'rule_type': 'GENERAL', 'rule_description': 'Cannot be a regular government employee or receiving government pension.', 'is_mandatory': True}
                ],
                'documents': [
                    {'document_name': 'Swasthya Sathi Card Copy', 'description': 'Photocopy of family Swasthya Sathi card', 'is_mandatory': True},
                    {'document_name': 'Aadhaar Card Copy', 'description': 'Applicant Aadhaar card copy', 'is_mandatory': True},
                    {'document_name': 'Bank Passbook Copy', 'description': 'Aadhaar-seeded bank passbook first page', 'is_mandatory': True},
                    {'document_name': 'Caste Certificate (For SC/ST only)', 'description': 'Official SC/ST certificate to claim Rs. 1,200 monthly tier', 'is_mandatory': False}
                ],
                'sources': [
                    {'source_title': 'West Bengal Social Security Portal', 'source_url': 'https://socialsecurity.wb.gov.in', 'source_department': 'Department of Women & Child Development', 'source_type': 'OFFICIAL_PORTAL'}
                ]
            },
            {
                'name': 'Swasthya Sathi (Universal Health Card)',
                'slug': 'swasthya-sathi',
                'category_slug': 'health',
                'dept_name': 'Department of Health & Family Welfare',
                'beneficiary_summary': 'All resident families in West Bengal with smart cards issued in the name of the female eldest family member',
                'short_description': 'Universal health coverage scheme providing cashless secondary and tertiary hospitalization treatment up to Rs. 5 Lakh per family per year.',
                'full_description': 'Swasthya Sathi is the universal healthcare scheme implemented by the Department of Health and Family Welfare, Govt. of West Bengal. It offers smart-card-based cashless inpatient treatment across more than 2,000 empaneled government and private hospitals in West Bengal and premier medical centers in other states.',
                'application_instructions': "Step 1: Check eligibility or existing family enrolment at swasthyasathi.gov.in.\nStep 2: Collect Form A (New Family Enrollment) or Form B (Member Addition) from Duare Sarkar or local BSK.\nStep 3: Submit application with Aadhaar cards and ration cards of all family members.\nStep 4: Biometric photo capture is conducted at notified camps.\nStep 5: The smart card is issued to the senior female head of household on the spot.",
                'official_application_url': 'https://swasthyasathi.gov.in',
                'official_info_url': 'https://swasthyasathi.gov.in',
                'status': 'PUBLISHED',
                'verification_status': 'VERIFIED',
                'last_verified_at': datetime.utcnow() - timedelta(days=3),
                'rules': [
                    {'rule_type': 'RESIDENCE', 'rule_description': 'Family must permanently reside in West Bengal.', 'residence_requirement': 'Permanent resident of West Bengal', 'is_mandatory': True},
                    {'rule_type': 'GENERAL', 'rule_description': 'Beneficiaries must not already receive central CGHS or other institutional employer medical allowances.', 'is_mandatory': True}
                ],
                'documents': [
                    {'document_name': 'Aadhaar Cards of All Family Members', 'description': 'Photocopy and original for verification', 'is_mandatory': True},
                    {'document_name': 'Digital Ration Card', 'description': 'Proof of family composition and residence', 'is_mandatory': True},
                    {'document_name': 'Mobile Number', 'description': 'Active mobile number for OTP notifications', 'is_mandatory': True}
                ],
                'sources': [
                    {'source_title': 'Official Swasthya Sathi Portal', 'source_url': 'https://swasthyasathi.gov.in', 'source_department': 'Department of Health & Family Welfare', 'source_type': 'OFFICIAL_PORTAL'}
                ]
            },
            {
                'name': 'Krishak Bandhu (Natun)',
                'slug': 'krishak-bandhu',
                'category_slug': 'agriculture',
                'dept_name': 'Department of Agriculture',
                'beneficiary_summary': 'All landowning farmers and recorded Bhagchasis (sharecroppers) in West Bengal',
                'short_description': 'Farmer empowerment scheme providing up to Rs. 10,000 per year direct agricultural grant plus Rs. 2 Lakh death benefit insurance for farm families.',
                'full_description': 'Krishak Bandhu (Natun) is the flagship agriculture security program by the Department of Agriculture, Govt. of West Bengal. It provides direct income support of Rs. 10,000 per year (for 1 acre or more, minimum Rs. 4,000 for sub-acre holdings) in two equal installments (Kharif and Rabi seasons), as well as a Rs. 2,00,000 life insurance death benefit for families of farmers aged 18 to 60.',
                'application_instructions': "Step 1: Download or obtain Krishak Bandhu Form from krishakbandhu.wb.gov.in or local Assistant Director of Agriculture (ADA) office.\nStep 2: Fill farm plot numbers (Khatian & Daag numbers) and Mouza name.\nStep 3: Attach copy of latest Record of Rights (Parcha), Aadhaar card, and bank passbook.\nStep 4: Submit at the Block ADA office or BSK counter.\nStep 5: Receive acknowledgement number to track disbursement status.",
                'official_application_url': 'https://krishakbandhu.wb.gov.in',
                'official_info_url': 'https://matirkatha.net',
                'status': 'PUBLISHED',
                'verification_status': 'VERIFIED',
                'last_verified_at': datetime.utcnow() - timedelta(days=2),
                'rules': [
                    {'rule_type': 'OCCUPATION', 'rule_description': 'Must be a recorded agricultural landowner or registered Bhagchasi (sharecropper).', 'occupation_requirement': 'Farmer / Cultivator / Sharecropper', 'is_mandatory': True},
                    {'rule_type': 'RESIDENCE', 'rule_description': 'Farm land must be located within West Bengal.', 'residence_requirement': 'West Bengal farm land', 'is_mandatory': True}
                ],
                'documents': [
                    {'document_name': 'Land Parcha (RoR)', 'description': 'Self-attested copy of latest Record of Rights', 'is_mandatory': True},
                    {'document_name': 'Aadhaar Card', 'description': 'Aadhaar copy of the farmer', 'is_mandatory': True},
                    {'document_name': 'Bank Passbook Copy', 'description': 'Bank passbook first page showing IFSC and account details', 'is_mandatory': True},
                    {'document_name': 'Voter Identity Card (EPIC)', 'description': 'Voter card for identity verification', 'is_mandatory': True}
                ],
                'sources': [
                    {'source_title': 'Official Krishak Bandhu Portal', 'source_url': 'https://krishakbandhu.wb.gov.in', 'source_department': 'Department of Agriculture', 'source_type': 'OFFICIAL_PORTAL'}
                ]
            },
            {
                'name': 'Yuvasree (Employment Bank)',
                'slug': 'yuvasree',
                'category_slug': 'employment-skill-development',
                'dept_name': 'Department of Labour',
                'beneficiary_summary': 'Unemployed youth aged 18 to 45 enrolled in the West Bengal Employment Bank',
                'short_description': 'Financial assistance of Rs. 1,500 per month for jobseekers enrolled in the state Employment Bank to enable skill training and exam preparation.',
                'full_description': 'Yuvasree is a specialized unemployment assistance initiative launched by the Labour Department, Government of West Bengal. It provides a monthly stipend of Rs. 1,500 to job-seeking youth registered in the Employment Bank to help them enhance employability through competitive exam coaching or technical certification.',
                'application_instructions': "Step 1: Register your candidate profile on employmentbankwb.gov.in.\nStep 2: Visit nearest Employment Exchange within 60 days with original certificates for document validation.\nStep 3: Eligible waiting list candidates submit Annexure I and Annexure II self-declarations annually.\nStep 4: Once sanctioned, the monthly assistance of Rs. 1,500 is credited directly into bank account.",
                'official_application_url': 'https://employmentbankwb.gov.in',
                'official_info_url': 'https://employmentbankwb.gov.in',
                'status': 'PUBLISHED',
                'verification_status': 'VERIFIED',
                'last_verified_at': datetime.utcnow() - timedelta(days=4),
                'rules': [
                    {'rule_type': 'AGE', 'rule_description': 'Age must be between 18 and 45 years.', 'minimum_age': 18, 'maximum_age': 45, 'is_mandatory': True},
                    {'rule_type': 'EDUCATION', 'rule_description': 'Minimum educational qualification: Passed Class VIII from a recognized school.', 'is_mandatory': True},
                    {'rule_type': 'OCCUPATION', 'rule_description': 'Must be unemployed and actively enrolled in the Employment Bank.', 'occupation_requirement': 'Unemployed Jobseeker', 'is_mandatory': True},
                    {'rule_type': 'RESIDENCE', 'rule_description': 'Permanent resident of West Bengal.', 'residence_requirement': 'West Bengal', 'is_mandatory': True}
                ],
                'documents': [
                    {'document_name': 'Employment Bank Enrollment Number', 'description': 'Valid registration acknowledgment from employmentbankwb.gov.in', 'is_mandatory': True},
                    {'document_name': 'Educational Qualification Proof', 'description': 'Marksheet/Admit card of Class 8 or higher', 'is_mandatory': True},
                    {'document_name': 'Age Proof Certificate', 'description': 'Madhyamik Admit Card or Birth Certificate', 'is_mandatory': True},
                    {'document_name': 'Bank Passbook Copy', 'description': 'Single bank account copy', 'is_mandatory': True}
                ],
                'sources': [
                    {'source_title': 'Employment Bank West Bengal', 'source_url': 'https://employmentbankwb.gov.in', 'source_department': 'Department of Labour', 'source_type': 'OFFICIAL_PORTAL'}
                ]
            },
            {
                'name': 'Jai Bangla Pension Scheme',
                'slug': 'jai-bangla-pension',
                'category_slug': 'senior-citizens',
                'dept_name': 'Department of Women & Child Development and Social Welfare',
                'beneficiary_summary': 'Vulnerable senior citizens (60+), widows, and persons with disabilities across West Bengal',
                'short_description': 'Consolidated social security pension providing Rs. 1,000 per month directly to senior citizens, widows, and persons with disabilities.',
                'full_description': 'Jai Bangla Pension Scheme is a unified umbrella pension program launched by the Government of West Bengal combining multiple legacy pension programs (Taposili Bandhu for SC, Jai Johar for ST, Manabik for Persons with Disabilities, and Old Age Pension) into a guaranteed monthly direct benefit transfer of Rs. 1,000 per beneficiary.',
                'application_instructions': "Step 1: Obtain the official Jai Bangla Form from the BDO office or Duare Sarkar Camp.\nStep 2: Fill personal profile, caste category (if applying under SC/ST window), and disability certificate details (if applying for Manabik).\nStep 3: Attach Aadhaar card, ration card, residential proof, and bank passbook.\nStep 4: Submit at the BDO / SDO Social Welfare section or municipal office.\nStep 5: Verified applicants receive monthly pension credited via PFMS / IFMS directly to their bank account.",
                'official_application_url': 'https://jaibangla.wb.gov.in',
                'official_info_url': 'https://wb.gov.in',
                'status': 'PUBLISHED',
                'verification_status': 'VERIFIED',
                'last_verified_at': datetime.utcnow() - timedelta(days=1),
                'rules': [
                    {'rule_type': 'AGE', 'rule_description': 'Age must be 60 years or above (not applicable for PwD window under Manabik).', 'minimum_age': 60, 'is_mandatory': True},
                    {'rule_type': 'RESIDENCE', 'rule_description': 'Must be living in West Bengal continuously for at least 10 years.', 'residence_requirement': '10 years in West Bengal', 'is_mandatory': True},
                    {'rule_type': 'GENERAL', 'rule_description': 'Must not be drawing any other government pension or EPF allowance.', 'is_mandatory': True}
                ],
                'documents': [
                    {'document_name': 'Aadhaar Card', 'description': 'Proof of identity and age', 'is_mandatory': True},
                    {'document_name': 'Voter Identity Card (EPIC)', 'description': 'Proof of state residency', 'is_mandatory': True},
                    {'document_name': 'Bank Passbook First Page', 'description': 'Active single bank account details', 'is_mandatory': True},
                    {'document_name': 'Disability Certificate (if applying for PwD window)', 'description': 'Minimum 40% benchmark disability certificate issued by medical board', 'is_mandatory': False}
                ],
                'sources': [
                    {'source_title': 'Jai Bangla Official Portal', 'source_url': 'https://jaibangla.wb.gov.in', 'source_department': 'Department of Women & Child Development', 'source_type': 'OFFICIAL_PORTAL'}
                ]
            },
            {
                'name': 'Snehaloy Housing Scheme',
                'slug': 'snehaloy-housing',
                'category_slug': 'housing',
                'dept_name': 'Department of Housing',
                'beneficiary_summary': 'Economically weaker families residing in urban and semi-urban West Bengal without permanent pucca dwelling',
                'short_description': 'Financial assistance grant of Rs. 1,20,000 for construction of permanent pucca houses for economically weaker citizens.',
                'full_description': 'Snehaloy Housing Scheme is an urban shelter initiative by the Department of Housing, Govt. of West Bengal. It provides a non-refundable capital construction grant of Rs. 1.20 Lakh in phased milestones to economically disadvantaged families living in dilapidated kucha dwellings who are not covered under rural housing schemes.',
                'application_instructions': "Step 1: Collect application form from your Municipal Corporation or Municipality Office.\nStep 2: Fill family profile, plot ownership details, and current housing condition.\nStep 3: Attach land possession proof, income certificate, Aadhaar card, and photograph of existing dwelling.\nStep 4: Field inspection is conducted by municipal civil engineers.\nStep 5: Approved funds are released directly to the beneficiary account in construction phases.",
                'official_application_url': 'https://wbhousing.gov.in',
                'official_info_url': 'https://wbhousing.gov.in',
                'status': 'PUBLISHED',
                'verification_status': 'VERIFIED',
                'last_verified_at': datetime.utcnow() - timedelta(days=5),
                'rules': [
                    {'rule_type': 'INCOME', 'rule_description': 'Family annual income must not exceed Rs. 1,20,000 per annum.', 'maximum_income': 120000, 'is_mandatory': True},
                    {'rule_type': 'RESIDENCE', 'rule_description': 'Must own land in municipal/notified town area in West Bengal.', 'residence_requirement': 'Urban West Bengal', 'is_mandatory': True},
                    {'rule_type': 'GENERAL', 'rule_description': 'Beneficiary must not own any pucca residential house anywhere in India.', 'is_mandatory': True}
                ],
                'documents': [
                    {'document_name': 'Land Deed or Parcha', 'description': 'Proof of land title in applicant or spouse name', 'is_mandatory': True},
                    {'document_name': 'Income Certificate', 'description': 'Issued by competent BDO, SDO, or Executive Officer', 'is_mandatory': True},
                    {'document_name': 'Aadhaar and Voter Card', 'description': 'Identity and address proof', 'is_mandatory': True},
                    {'document_name': 'Photograph of Kucha House', 'description': 'Photograph showing applicant in front of existing non-pucca shelter', 'is_mandatory': True}
                ],
                'sources': [
                    {'source_title': 'West Bengal Housing Department', 'source_url': 'https://wbhousing.gov.in', 'source_department': 'Department of Housing', 'source_type': 'OFFICIAL_PORTAL'}
                ]
            },
            # Demo draft scheme for testing Admin verification workflow
            {
                'name': 'Student Credit Card Scheme (Draft Guide)',
                'slug': 'student-credit-card-draft',
                'category_slug': 'education',
                'dept_name': 'Department of Higher Education',
                'beneficiary_summary': 'Students pursuing higher secondary, undergraduate, postgraduate, or competitive coaching',
                'short_description': 'DEMO DRAFT: Low-interest education loan up to Rs. 10 Lakh with state guarantee for pursuing higher education.',
                'full_description': 'DEMO DATA RECORD: The West Bengal Student Credit Card Scheme provides collateral-free education credit up to Rs. 10 Lakh at nominal 4% simple interest with repayment moratorium up to 15 years.',
                'application_instructions': "Step 1: Register on wbscc.wb.gov.in.\nStep 2: Fill personal and co-borrower financial details.\nStep 3: Upload course fee structure and submit to institution nodal officer.",
                'official_application_url': 'https://wbscc.wb.gov.in',
                'official_info_url': 'https://wbscc.wb.gov.in',
                'status': 'DRAFT',
                'verification_status': 'DRAFT',
                'last_verified_at': None,
                'rules': [
                    {'rule_type': 'AGE', 'rule_description': 'Maximum age limit is 40 years at the time of application.', 'maximum_age': 40, 'is_mandatory': True},
                    {'rule_type': 'RESIDENCE', 'rule_description': 'Applicant or parents must have resided in West Bengal for at least 10 years.', 'residence_requirement': '10 years in West Bengal', 'is_mandatory': True}
                ],
                'documents': [
                    {'document_name': 'Course Admission Fee Receipt', 'description': 'Proof of admission from recognized institution', 'is_mandatory': True},
                    {'document_name': 'Student & Co-Borrower Aadhaar / PAN', 'description': 'Identity proofs', 'is_mandatory': True}
                ],
                'sources': [
                    {'source_title': 'WBSCC Official Portal', 'source_url': 'https://wbscc.wb.gov.in', 'source_department': 'Department of Higher Education', 'source_type': 'OFFICIAL_PORTAL'}
                ]
            },
            # Demo pending verification scheme
            {
                'name': 'Gatidhara Commercial Vehicle Scheme (Under Review)',
                'slug': 'gatidhara-subsidy-review',
                'category_slug': 'employment-skill-development',
                'dept_name': 'Department of Labour',
                'beneficiary_summary': 'Unemployed youth registered with Employment Bank desiring to purchase small commercial vehicles',
                'short_description': 'DEMO REVIEW RECORD: State subsidy of 30% of project cost (up to Rs. 1 Lakh) for purchasing commercial vehicles for self-employment.',
                'full_description': 'DEMO DATA RECORD: Gatidhara is a self-employment transport initiative for registered jobseekers aged 20-45 with family income below Rs. 25,000/month.',
                'application_instructions': "Step 1: Apply through the Transport / Labour department portal.\nStep 2: Submit driving licence and Employment Bank enrollment.",
                'official_application_url': 'https://transport.wb.gov.in',
                'official_info_url': 'https://transport.wb.gov.in',
                'status': 'PENDING_VERIFICATION',
                'verification_status': 'PENDING_VERIFICATION',
                'last_verified_at': None,
                'rules': [
                    {'rule_type': 'AGE', 'rule_description': 'Age between 20 and 45 years.', 'minimum_age': 20, 'maximum_age': 45, 'is_mandatory': True},
                    {'rule_type': 'INCOME', 'rule_description': 'Family monthly income must not exceed Rs. 25,000.', 'maximum_income': 25000, 'is_mandatory': True}
                ],
                'documents': [
                    {'document_name': 'Commercial Driving Licence', 'description': 'Valid driving licence issued by RTO', 'is_mandatory': True},
                    {'document_name': 'Income Certificate', 'description': 'Certified by BDO / SDO', 'is_mandatory': True}
                ],
                'sources': [
                    {'source_title': 'Transport Department Portal', 'source_url': 'https://transport.wb.gov.in', 'source_department': 'Transport Department', 'source_type': 'OFFICIAL_PORTAL'}
                ]
            }
        ]

        for s_data in SCHEMES_SPEC:
            cat = cat_map.get(s_data['category_slug'])
            dept = dept_map.get(s_data['dept_name'])

            scheme = GovernmentScheme(
                name=s_data['name'],
                slug=s_data['slug'],
                category_id=cat.id if cat else 1,
                department_id=dept.id if dept else None,
                beneficiary_summary=s_data['beneficiary_summary'],
                short_description=s_data['short_description'],
                full_description=s_data['full_description'],
                application_instructions=s_data['application_instructions'],
                official_application_url=s_data['official_application_url'],
                official_info_url=s_data['official_info_url'],
                status=s_data['status'],
                verification_status=s_data['verification_status'],
                last_verified_at=s_data['last_verified_at'],
                created_by=admin_id,
                updated_by=admin_id
            )
            db.session.add(scheme)
            db.session.flush()

            for r_data in s_data.get('rules', []):
                rule = SchemeEligibilityRule(
                    scheme_id=scheme.id,
                    rule_type=r_data.get('rule_type', 'GENERAL'),
                    rule_description=r_data['rule_description'],
                    minimum_age=r_data.get('minimum_age'),
                    maximum_age=r_data.get('maximum_age'),
                    minimum_income=r_data.get('minimum_income'),
                    maximum_income=r_data.get('maximum_income'),
                    residence_requirement=r_data.get('residence_requirement'),
                    occupation_requirement=r_data.get('occupation_requirement'),
                    is_mandatory=r_data.get('is_mandatory', True)
                )
                db.session.add(rule)

            for d_data in s_data.get('documents', []):
                doc = SchemeRequiredDocument(
                    scheme_id=scheme.id,
                    document_name=d_data['document_name'],
                    description=d_data.get('description'),
                    is_mandatory=d_data.get('is_mandatory', True)
                )
                db.session.add(doc)

            for src_data in s_data.get('sources', []):
                src = SchemeOfficialSource(
                    scheme_id=scheme.id,
                    source_title=src_data['source_title'],
                    source_url=src_data['source_url'],
                    source_department=src_data.get('source_department'),
                    source_type=src_data.get('source_type', 'OFFICIAL_PORTAL'),
                    verified_at=s_data['last_verified_at']
                )
                db.session.add(src)

            # Verification history
            hist = SchemeVerificationHistory(
                scheme_id=scheme.id,
                admin_id=admin_id,
                previous_status='NEW',
                new_status=scheme.status,
                notes=f"Initial seeded record with status {scheme.status}."
            )
            db.session.add(hist)

        db.session.commit()
        print(f"Created {len(SCHEMES_SPEC)} government schemes with verified rules, documents, and sources.")


if __name__ == '__main__':
    import sys
    reset = '--reset' in sys.argv
    seed_database(drop_existing=reset)
