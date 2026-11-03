export const FALLBACK_SCHEMES = [
  {
    id: 1,
    name: 'Kanyashree Prakalpa (K1 & K2)',
    slug: 'kanyashree-prakalpa',
    category_id: 3,
    category_name: 'Women & Child Welfare',
    category_slug: 'women-child-welfare',
    department_id: 1,
    department_name: 'Department of Women & Child Development and Social Welfare',
    department_website: 'https://wb.gov.in',
    short_description: 'United Nations Public Service Award-winning conditional cash transfer providing Rs. 1,000 annually (K1) and a one-time grant of Rs. 25,000 (K2) to encourage girl-child education and prevent early marriage.',
    full_description: 'Kanyashree Prakalpa is an initiative undertaken by the Government of West Bengal to improve the life and status of adolescent girls by providing conditional cash transfers. The scheme ensures adolescent girls stay in school and delay marriage until at least age 18.\n\nTwo Tiers of Assistance:\n1. K1 (Annual Scholarship): Rs. 1,000 annually for unmarried girls aged 13-18 enrolled in classes VIII through XII in recognized educational institutions.\n2. K2 (One-Time Grant): Rs. 25,000 one-time grant for unmarried girls reaching 18 years of age and pursuing higher education or recognized vocational training.',
    beneficiary_summary: 'Unmarried female students aged 13–19 enrolled in recognized schools and colleges in West Bengal',
    verification_status: 'VERIFIED',
    status: 'PUBLISHED',
    last_verified_at: '2026-11-01T00:00:00Z',
    official_application_url: 'https://wbkanyashree.gov.in',
    official_info_url: 'https://wbkanyashree.gov.in',
    application_instructions: '1. Contact the designated Kanyashree Nodal Teacher at your school or madrasah.\n2. Collect Form K1 or Form K2.\n3. Fill in applicant and family details along with bank account IFSC details.\n4. Attach certified copies of age proof, institutional enrollment certificate, and bank passbook.\n5. Submit the completed form to the Head of Institution, who will upload it to the official portal.\n6. Track application status online using your Kanyashree ID.',
    rules: [
      {
        criteria_title: 'Age Requirement',
        criteria_description: 'Must be between 13 and 18 years old for K1 annual scholarship, or completed 18 years for K2 grant.',
        rule_type: 'AGE',
        minimum_age: 13,
        maximum_age: 19,
        is_mandatory: true
      },
      {
        criteria_title: 'West Bengal Permanent Residence',
        criteria_description: 'Applicant must be an ordinarily resident citizen of West Bengal.',
        rule_type: 'RESIDENCE',
        residence_requirement: 'West Bengal',
        is_mandatory: true
      },
      {
        criteria_title: 'Educational Enrollment',
        criteria_description: 'Enrolled in a government, government-aided, or recognized educational institution in Class VIII or above.',
        rule_type: 'OTHER',
        occupation_requirement: 'Student',
        is_mandatory: true
      },
      {
        criteria_title: 'Marital Status',
        criteria_description: 'Applicant must be unmarried at the time of application and scholarship disbursement.',
        rule_type: 'OTHER',
        is_mandatory: true
      }
    ],
    documents: [
      {
        document_name: 'Birth Certificate / Madhyamik Admit Card',
        description: 'Certified age proof issued by competent municipal authority or WBBSE',
        is_mandatory: true
      },
      {
        document_name: 'School / Institution Bonafide Certificate',
        description: 'Certificate from Head of Institution verifying regular attendance and class enrollment',
        is_mandatory: true
      },
      {
        document_name: 'Bank Passbook Front Page',
        description: 'Dedicated single account in girl student\'s name with valid IFSC and account number',
        is_mandatory: true
      },
      {
        document_name: 'Unmarried Status Declaration',
        description: 'Self-declaration signed by parent or legal guardian confirming unmarried status',
        is_mandatory: true
      },
      {
        document_name: 'Aadhaar Card Copy',
        description: 'Aadhaar number verification for DBT transfer',
        is_mandatory: false
      }
    ],
    sources: [
      {
        source_title: 'Official Kanyashree Prakalpa Portal',
        source_url: 'https://wbkanyashree.gov.in',
        source_department: 'Department of Women & Child Development and Social Welfare',
        source_type: 'OFFICIAL_PORTAL'
      }
    ]
  },
  {
    id: 2,
    name: 'Lakshmir Bhandar Scheme',
    slug: 'lakshmir-bhandar',
    category_id: 6,
    category_name: 'Financial Assistance',
    category_slug: 'financial-assistance',
    department_id: 1,
    department_name: 'Department of Women & Child Development and Social Welfare',
    department_website: 'https://wb.gov.in',
    short_description: 'Direct monthly financial support of Rs. 1,000 for General category and Rs. 1,200 for SC/ST category transferred directly to female heads of family.',
    full_description: 'Lakshmir Bhandar is a flagship social security scheme launched by the Government of West Bengal to empower women heads of household. The financial support provides recurring income to enable women to manage basic household needs and achieve financial autonomy.\n\nFinancial Entitlements:\n- SC and ST Beneficiaries: Rs. 1,200 per month via direct bank transfer (DBT).\n- General and OBC Beneficiaries: Rs. 1,000 per month via DBT.',
    beneficiary_summary: 'Female heads of household aged 25 to 60 residing permanently in West Bengal',
    verification_status: 'VERIFIED',
    status: 'PUBLISHED',
    last_verified_at: '2026-11-02T00:00:00Z',
    official_application_url: 'https://socialsecurity.wb.gov.in',
    official_info_url: 'https://wb.gov.in',
    application_instructions: '1. Collect the official Lakshmir Bhandar application form at Duare Sarkar camps or the local BDO / Municipal Office.\n2. Complete the applicant details including Swasthya Sathi card number and Aadhaar number.\n3. Attach self-attested photocopies of Swasthya Sathi card, Aadhaar card, SC/ST certificate (if applicable), and bank passbook.\n4. Submit the application along with original documents for instant verification at Duare Sarkar camp.\n5. Receive a system-generated acknowledgement slip with your unique registration number.',
    rules: [
      {
        criteria_title: 'Age Eligibility',
        criteria_description: 'Women aged between 25 and 60 years.',
        rule_type: 'AGE',
        minimum_age: 25,
        maximum_age: 60,
        is_mandatory: true
      },
      {
        criteria_title: 'Permanent Resident of West Bengal',
        criteria_description: 'Applicant must reside permanently within the state of West Bengal.',
        rule_type: 'RESIDENCE',
        residence_requirement: 'West Bengal',
        is_mandatory: true
      },
      {
        criteria_title: 'Swasthya Sathi Enrollment',
        criteria_description: 'Applicant should possess a valid Swasthya Sathi card or household registration number.',
        rule_type: 'OTHER',
        is_mandatory: true
      },
      {
        criteria_title: 'Exclusion of Regular Government Employees',
        criteria_description: 'Women who are permanent government employees or drawing regular government pensions are not eligible.',
        rule_type: 'OCCUPATION',
        occupation_requirement: 'Non-government employee',
        is_mandatory: true
      }
    ],
    documents: [
      {
        document_name: 'Swasthya Sathi Card Copy',
        description: 'Photocopy of the family smart card with applicant listed as family head or member',
        is_mandatory: true
      },
      {
        document_name: 'Aadhaar Card Copy',
        description: 'Self-attested photocopy of applicant\'s Aadhaar card',
        is_mandatory: true
      },
      {
        document_name: 'Bank Passbook / Cancelled Cheque',
        description: 'Bank passbook copy showing Account Number, IFSC, and applicant\'s name',
        is_mandatory: true
      },
      {
        document_name: 'SC / ST Certificate (if applicable)',
        description: 'Certified caste certificate issued by Sub-Divisional Officer for enhanced benefit',
        is_mandatory: false
      },
      {
        document_name: 'Passport Photograph',
        description: 'Two recent color passport-sized photographs',
        is_mandatory: true
      }
    ],
    sources: [
      {
        source_title: 'West Bengal Social Security Portal',
        source_url: 'https://socialsecurity.wb.gov.in',
        source_department: 'Department of Women & Child Development and Social Welfare',
        source_type: 'OFFICIAL_PORTAL'
      }
    ]
  },
  {
    id: 3,
    name: 'Swasthya Sathi (Universal Health Card)',
    slug: 'swasthya-sathi',
    category_id: 2,
    category_name: 'Health',
    category_slug: 'health',
    department_id: 3,
    department_name: 'Department of Health & Family Welfare',
    department_website: 'https://wbhealth.gov.in',
    short_description: 'Universal health coverage scheme providing cashless secondary and tertiary hospitalization treatment up to Rs. 5 Lakh per family per year.',
    full_description: 'Swasthya Sathi is a universal health protection scheme providing basic health cover for secondary and tertiary care up to Rs. 5 Lakh per annum per family. The scheme is 100% funded by the Government of West Bengal and issued via smart card with biometric authentication.\n\nKey Highlights:\n- Cashless hospitalization across all government hospitals and empanelled private multi-specialty hospitals.\n- Smart card issued in the name of the eldest female member of the family.\n- Covers pre-existing conditions from Day 1 with zero waiting period.',
    beneficiary_summary: 'All resident families in West Bengal with smart cards issued in the name of the female eldest family member',
    verification_status: 'VERIFIED',
    status: 'PUBLISHED',
    last_verified_at: '2026-10-31T00:00:00Z',
    official_application_url: 'https://swasthyasathi.gov.in',
    official_info_url: 'https://swasthyasathi.gov.in',
    application_instructions: '1. Download Form A (for new family registration) or Form B (for additions) from the official portal or visit Duare Sarkar.\n2. Complete household family composition details.\n3. Attach copies of Aadhaar, Ration Card, and proof of address.\n4. Submit at Duare Sarkar or BDO / Municipal Health Cell.\n5. Visit the designated biometric kiosk for photograph and fingerprint capture.\n6. Collect your chip-based Smart Card on the spot.',
    rules: [
      {
        criteria_title: 'State Residency',
        criteria_description: 'Permanent resident family of West Bengal.',
        rule_type: 'RESIDENCE',
        residence_requirement: 'West Bengal',
        is_mandatory: true
      },
      {
        criteria_title: 'Family Representation',
        criteria_description: 'Card is registered in the name of the eldest female member of the family.',
        rule_type: 'OTHER',
        is_mandatory: true
      }
    ],
    documents: [
      {
        document_name: 'Aadhaar Card of all family members',
        description: 'Photocopies of Aadhaar cards of each family member to be listed on the card',
        is_mandatory: true
      },
      {
        document_name: 'Digital Ration Card / Khadya Sathi Card',
        description: 'Household food security card confirming family unit',
        is_mandatory: true
      },
      {
        document_name: 'Residential Certificate',
        description: 'Certificate from Panchayat Pradhan, Councillor, or MLA confirming state residence',
        is_mandatory: false
      }
    ],
    sources: [
      {
        source_title: 'Official Swasthya Sathi Health Portal',
        source_url: 'https://swasthyasathi.gov.in',
        source_department: 'Department of Health & Family Welfare',
        source_type: 'OFFICIAL_PORTAL'
      }
    ]
  },
  {
    id: 4,
    name: 'Krishak Bandhu (Natun)',
    slug: 'krishak-bandhu',
    category_id: 4,
    category_name: 'Agriculture',
    category_slug: 'agriculture',
    department_id: 2,
    department_name: 'Department of Agriculture',
    department_website: 'https://matirkatha.net',
    short_description: 'Farmer empowerment scheme providing up to Rs. 10,000 per year direct agricultural grant plus Rs. 2 Lakh death benefit insurance for farm families.',
    full_description: 'Krishak Bandhu (Natun) is an agricultural welfare scheme providing assured direct financial assistance to all farmers in West Bengal to purchase agricultural inputs, fertilizer, and equipment.\n\nTwo Components:\n1. Assured Financial Grant: Rs. 10,000 per year per acre for farmers with 1 acre or more land, paid in two equal installments of Rs. 5,000 in Kharif and Rabi seasons. Minimum grant of Rs. 4,000 per year for farmers with less than 1 acre.\n2. Death Benefit: Rs. 2,00,000 one-time financial compensation to the legal heirs in the event of the untimely demise of any farmer aged 18 to 60.',
    beneficiary_summary: 'All landowning farmers and recorded Bhagchasis (sharecroppers) in West Bengal',
    verification_status: 'VERIFIED',
    status: 'PUBLISHED',
    last_verified_at: '2026-11-01T00:00:00Z',
    official_application_url: 'https://krishakbandhu.wb.gov.in',
    official_info_url: 'https://matirkatha.net',
    application_instructions: '1. Collect Krishak Bandhu application form from your local Assistant Director of Agriculture (ADA) office or Duare Sarkar.\n2. Provide land details including Khatian number, Plot number, and Mouza.\n3. Attach copy of recent RoR (Record of Rights / Porcha) and bank passbook.\n4. Submit the application to the ADA or BSK Centre for digital upload.\n5. Verified farmers receive Krishak Bandhu ID and SMS confirmation.',
    rules: [
      {
        criteria_title: 'Farmer Status',
        criteria_description: 'Must own cultivable agricultural land or be a recorded Bhagchasi (sharecropper).',
        rule_type: 'OCCUPATION',
        occupation_requirement: 'Farmer / Sharecropper',
        is_mandatory: true
      },
      {
        criteria_title: 'Age Eligibility (for Death Benefit component)',
        criteria_description: 'Death benefit applies to registered farmers aged between 18 and 60 years.',
        rule_type: 'AGE',
        minimum_age: 18,
        maximum_age: 60,
        is_mandatory: false
      },
      {
        criteria_title: 'State Residence',
        criteria_description: 'Permanent resident of West Bengal.',
        rule_type: 'RESIDENCE',
        residence_requirement: 'West Bengal',
        is_mandatory: true
      }
    ],
    documents: [
      {
        document_name: 'Land Record of Rights (Porcha / RoR)',
        description: 'Certified copy of recent Land Record of Rights showing applicant as recorded owner',
        is_mandatory: true
      },
      {
        document_name: 'Aadhaar Card Copy',
        description: 'Self-attested Aadhaar card for DBT bank linkage',
        is_mandatory: true
      },
      {
        document_name: 'Bank Passbook Front Page',
        description: 'Bank passbook showing Account Number, branch IFSC code, and farmer name',
        is_mandatory: true
      },
      {
        document_name: 'Voter Identity Card (EPIC)',
        description: 'EPIC card copy for identity verification',
        is_mandatory: true
      }
    ],
    sources: [
      {
        source_title: 'Krishak Bandhu Official Portal',
        source_url: 'https://krishakbandhu.wb.gov.in',
        source_department: 'Department of Agriculture',
        source_type: 'OFFICIAL_PORTAL'
      }
    ]
  },
  {
    id: 5,
    name: 'Yuvasree (Employment Bank)',
    slug: 'yuvasree',
    category_id: 5,
    category_name: 'Employment & Skill Development',
    category_slug: 'employment-skill-development',
    department_id: 5,
    department_name: 'Department of Labour',
    department_website: 'https://wblabour.gov.in',
    short_description: 'Financial assistance of Rs. 1,500 per month for jobseekers enrolled in the state Employment Bank to enable skill training and exam preparation.',
    full_description: 'Yuvasree (formerly known as Yuva Utsaha Prakalpa) is an employment assistance scheme by the Labour Department of West Bengal. It provides Rs. 1,500 per month directly to enrolled jobseekers to upgrade their skills and prepare for competitive examinations and job opportunities.',
    beneficiary_summary: 'Unemployed youth aged 18 to 45 enrolled in the West Bengal Employment Bank',
    verification_status: 'VERIFIED',
    status: 'PUBLISHED',
    last_verified_at: '2026-10-30T00:00:00Z',
    official_application_url: 'https://employmentbankwb.gov.in',
    official_info_url: 'https://employmentbankwb.gov.in',
    application_instructions: '1. Register as a jobseeker on the West Bengal Employment Bank official website.\n2. Visit your local Employment Exchange within 60 days with original certificates for document validation.\n3. When new Yuvasree lists are published, submit Annexure I and Annexure II self-declarations.\n4. Approved candidates receive Rs. 1,500 per month directly into their bank accounts.',
    rules: [
      {
        criteria_title: 'Age Eligibility',
        criteria_description: 'Must be between 18 and 45 years of age on the first day of May of application year.',
        rule_type: 'AGE',
        minimum_age: 18,
        maximum_age: 45,
        is_mandatory: true
      },
      {
        criteria_title: 'Employment Bank Registration',
        criteria_description: 'Must be an enrolled and validated jobseeker in the West Bengal Employment Bank.',
        rule_type: 'OTHER',
        is_mandatory: true
      },
      {
        criteria_title: 'Educational Qualification',
        criteria_description: 'Passed at least Class VIII or higher examination from a recognized institution.',
        rule_type: 'OTHER',
        is_mandatory: true
      },
      {
        criteria_title: 'Unemployment Condition',
        criteria_description: 'Must not be employed in any regular government or private sector employment.',
        rule_type: 'OCCUPATION',
        occupation_requirement: 'Unemployed Jobseeker',
        is_mandatory: true
      }
    ],
    documents: [
      {
        document_name: 'Employment Bank Enrollment Card',
        description: 'Official registration slip issued by West Bengal Employment Bank',
        is_mandatory: true
      },
      {
        document_name: 'Educational Marksheets and Certificates',
        description: 'Certificates of Class VIII, Madhyamik, or higher educational qualifications',
        is_mandatory: true
      },
      {
        document_name: 'Proof of Age',
        description: 'Birth Certificate, Madhyamik Admit Card, or Passport',
        is_mandatory: true
      },
      {
        document_name: 'Bank Passbook Copy',
        description: 'Single bank account passbook showing IFSC code',
        is_mandatory: true
      }
    ],
    sources: [
      {
        source_title: 'West Bengal Employment Bank Portal',
        source_url: 'https://employmentbankwb.gov.in',
        source_department: 'Department of Labour',
        source_type: 'OFFICIAL_PORTAL'
      }
    ]
  },
  {
    id: 6,
    name: 'Jai Bangla Pension Scheme',
    slug: 'jai-bangla-pension',
    category_id: 9,
    category_name: 'Senior Citizens',
    category_slug: 'senior-citizens',
    department_id: 1,
    department_name: 'Department of Women & Child Development and Social Welfare',
    department_website: 'https://wb.gov.in',
    short_description: 'Consolidated social security pension providing Rs. 1,000 per month directly to senior citizens, widows, and persons with disabilities.',
    full_description: 'Jai Bangla Pension Scheme consolidates several state social security pensions into a streamlined program providing Rs. 1,000 per month directly to vulnerable citizens.\n\nSub-Components:\n- Taposili Bandhu Pension for SC senior citizens.\n- Jai Johar Pension for ST senior citizens.\n- Manabik Pension Scheme for persons with 40%+ disabilities.\n- Old Age Pension and Widow Pension for senior residents and widows.',
    beneficiary_summary: 'Vulnerable senior citizens (60+), widows, and persons with disabilities across West Bengal',
    verification_status: 'VERIFIED',
    status: 'PUBLISHED',
    last_verified_at: '2026-11-02T00:00:00Z',
    official_application_url: 'https://jaibangla.wb.gov.in',
    official_info_url: 'https://wb.gov.in',
    application_instructions: '1. Collect the Jai Bangla Common Application Form from your BDO, Municipal Office, or Duare Sarkar.\n2. Complete personal information, category selection, and bank IFSC details.\n3. Attach proof of age, disability certificate (if applying under Manabik), and caste certificate (if applying under Taposili Bandhu / Jai Johar).\n4. Submit to BDO / SDO office for enquiry and approval.\n5. Monthly pension is credited directly to beneficiary bank accounts.',
    rules: [
      {
        criteria_title: 'Age Requirement for Old Age Pension',
        criteria_description: '60 years of age or above for general old age pension (No upper age limit).',
        rule_type: 'AGE',
        minimum_age: 60,
        is_mandatory: false
      },
      {
        criteria_title: 'Permanent State Resident',
        criteria_description: 'Must be an ordinarily resident citizen of West Bengal for at least 10 years.',
        rule_type: 'RESIDENCE',
        residence_requirement: 'West Bengal (10+ years)',
        is_mandatory: true
      },
      {
        criteria_title: 'Disability Threshold (for Manabik)',
        criteria_description: 'Disability percentage must be 40% or higher certified by government hospital.',
        rule_type: 'OTHER',
        is_mandatory: false
      }
    ],
    documents: [
      {
        document_name: 'Proof of Age',
        description: 'Aadhaar Card, Voter Card, or Birth Certificate showing age 60+',
        is_mandatory: true
      },
      {
        document_name: 'Caste Certificate (for Taposili Bandhu / Jai Johar)',
        description: 'Certified SC/ST certificate from Sub-Divisional Officer',
        is_mandatory: false
      },
      {
        document_name: 'Disability Certificate (for Manabik)',
        description: 'Certificate from government medical board indicating 40%+ disability',
        is_mandatory: false
      },
      {
        document_name: 'Bank Passbook Copy',
        description: 'Single bank account details for direct benefit disbursement',
        is_mandatory: true
      }
    ],
    sources: [
      {
        source_title: 'Jai Bangla Pension Portal',
        source_url: 'https://jaibangla.wb.gov.in',
        source_department: 'Department of Women & Child Development and Social Welfare',
        source_type: 'OFFICIAL_PORTAL'
      }
    ]
  },
  {
    id: 7,
    name: 'Snehaloy Housing Scheme',
    slug: 'snehaloy-housing',
    category_id: 8,
    category_name: 'Housing',
    category_slug: 'housing',
    department_id: 7,
    department_name: 'Department of Housing',
    department_website: 'https://wbhousing.gov.in',
    short_description: 'Financial assistance grant of Rs. 1,20,000 for construction of permanent pucca houses for economically weaker citizens.',
    full_description: 'Snehaloy Housing Scheme provides financial assistance to economically weaker families residing in urban and semi-urban West Bengal who do not have a permanent pucca house and were not covered under Banglar Awas Yojana. The scheme grants Rs. 1,20,000 in direct installments for house construction.',
    beneficiary_summary: 'Economically weaker families residing in urban and semi-urban West Bengal without permanent pucca dwelling',
    verification_status: 'VERIFIED',
    status: 'PUBLISHED',
    last_verified_at: '2026-10-29T00:00:00Z',
    official_application_url: 'https://wbhousing.gov.in',
    official_info_url: 'https://wbhousing.gov.in',
    application_instructions: '1. Inquire with local Municipal / BDO Housing Cell or Duare Sarkar camps.\n2. Submit Form with land possession documents or municipal allotment proof.\n3. Physical inspection of kutcha dwelling is conducted by local authorities.\n4. Approved beneficiaries receive Rs. 1,20,000 grant in direct milestone installments.',
    rules: [
      {
        criteria_title: 'Income Requirement',
        criteria_description: 'Annual family income should not exceed Rs. 1,20,000.',
        rule_type: 'INCOME',
        maximum_income: 120000,
        is_mandatory: true
      },
      {
        criteria_title: 'Housing Condition',
        criteria_description: 'Beneficiary must not own a permanent pucca house anywhere in the state.',
        rule_type: 'OTHER',
        is_mandatory: true
      },
      {
        criteria_title: 'Land Requirement',
        criteria_description: 'Must possess suitable land in beneficiary or spouse name for construction.',
        rule_type: 'OTHER',
        is_mandatory: true
      }
    ],
    documents: [
      {
        document_name: 'Income Certificate',
        description: 'Certified income certificate from BDO, SDO, or Municipal Commissioner',
        is_mandatory: true
      },
      {
        document_name: 'Land Possession Documents',
        description: 'Deed, Porcha, or official municipal allotment slip',
        is_mandatory: true
      },
      {
        document_name: 'Aadhaar Card of Applicant and Spouse',
        description: 'Self-attested photocopies of identity proofs',
        is_mandatory: true
      },
      {
        document_name: 'Bank Passbook Copy',
        description: 'Bank passbook front page for installment DBT',
        is_mandatory: true
      }
    ],
    sources: [
      {
        source_title: 'West Bengal Housing Department',
        source_url: 'https://wbhousing.gov.in',
        source_department: 'Department of Housing',
        source_type: 'OFFICIAL_PORTAL'
      }
    ]
  }
];

