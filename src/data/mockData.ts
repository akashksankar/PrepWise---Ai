import { ExamInfo, UserProfile, SubjectModule, Question, VectorDocChunk, PodcastItem, CurrentAffairItem, StudentCohortMember, MLWeaknessReport } from '../types';

export const EXAMS_DATA: ExamInfo[] = [
  {
    id: 'UPSC CSE',
    name: 'UPSC CSE',
    fullName: 'Civil Services Examination (IAS / IPS / IFS)',
    badge: 'Premier Union Service',
    conductingBody: 'Union Public Service Commission',
    nextDate: 'May 24, 2026',
    description: 'Premier national civil service examination featuring GS Paper 1, CSAT Aptitude, and Mains descriptive papers.',
    focusAreas: ['Polity & Constitution', 'Modern Indian History', 'Economy & Budget', 'Geography & Environment', 'CSAT Aptitude'],
    subjects: ['Indian Polity', 'Modern History', 'Indian Economy', 'Geography', 'CSAT Quantitative & Reasoning']
  },
  {
    id: 'Kerala PSC',
    name: 'Kerala PSC',
    fullName: 'Kerala Public Service Commission (KAS, Degree Level, LDC)',
    badge: 'State Flagship (Kerala)',
    conductingBody: 'Kerala Public Service Commission (Thiruvananthapuram)',
    nextDate: 'June 14, 2026',
    description: 'State civil services, KAS Officer, Secretariat Assistant, and Degree Level competitive exams emphasizing Kerala Renaissance, State Geography, & Malayalam.',
    focusAreas: ['Kerala Renaissance & Social Reforms', 'Kerala Geography & Rivers', 'Indian Constitution', 'Malayalam Grammar & Literature', 'Kerala Current Affairs'],
    subjects: ['Kerala Renaissance & History', 'Kerala Geography', 'General Science & Tech', 'Malayalam / English', 'General Knowledge & Current Affairs']
  },
  {
    id: 'SSC CGL / CHSL',
    name: 'SSC CGL / CHSL',
    fullName: 'Staff Selection Commission (Combined Graduate Level)',
    badge: 'Central Ministries & Departments',
    conductingBody: 'Staff Selection Commission',
    nextDate: 'July 18, 2026',
    description: 'Recruitment for Group B & C officers in Central Ministries, Income Tax, Customs, and CBI with Tier 1 and Tier 2 testing.',
    focusAreas: ['Quantitative Aptitude & Advanced Math', 'Logical Reasoning', 'General English & Vocab', 'General Awareness'],
    subjects: ['Quantitative Aptitude', 'General Intelligence & Reasoning', 'English Comprehension', 'General Awareness']
  },
  {
    id: 'Indian Railways (RRB)',
    name: 'Indian Railways (RRB)',
    fullName: 'Railway Recruitment Boards (RRB NTPC / JE)',
    badge: 'National Transport Network',
    conductingBody: 'Railway Recruitment Control Board (RRCB)',
    nextDate: 'August 08, 2026',
    description: 'Non-Technical Popular Categories (NTPC) and Junior Engineer examinations for Indian Railways operational, technical, and commercial wings.',
    focusAreas: ['General Science (Physics, Chem, Bio)', 'Mathematics', 'General Intelligence', 'Indian Railways Heritage & GK'],
    subjects: ['General Science', 'Mathematics', 'General Intelligence & Reasoning', 'Indian Railways Facts & GK']
  },
  {
    id: 'GATE & CAT',
    name: 'GATE & CAT',
    fullName: 'Graduate Aptitude Test in Engineering & Common Admission Test',
    badge: 'Higher Tech & Top B-Schools',
    conductingBody: 'IITs / IIMs Consortium',
    nextDate: 'November 29, 2026',
    description: 'Premier national postgraduate entrances for M.Tech/PSU recruitments and Top Tier-1 Management IIM admissions.',
    focusAreas: ['Engineering Mathematics / Quantitative Aptitude', 'Data Interpretation & Logical Reasoning', 'Verbal Ability & Reading Comprehension', 'Core Technical Concepts'],
    subjects: ['Quantitative Aptitude / Math', 'Data Interpretation & LR', 'Verbal Ability', 'Core Subject Engineering']
  }
];

export const SUBJECT_MODULES: SubjectModule[] = [
  // Kerala PSC Modules
  {
    id: 'kpsc-ren',
    exam: 'Kerala PSC',
    name: 'Kerala Renaissance & Social Reforms',
    iconName: 'Landmark',
    totalTopics: 14,
    completedTopics: 10,
    highYield: true,
    stateSpecific: true,
    topics: [
      { id: 'kr-1', title: 'Sree Narayana Guru & Aruvippuram Prathishta (1888)', completed: true, importance: 'High', pyqCount: 42, summary: 'Pivotal social reform defying caste restrictions. Formation of SNDP Yogam (1903).' },
      { id: 'kr-2', title: 'Ayyankali & Villuvandi Samaram (1893)', completed: true, importance: 'High', pyqCount: 38, summary: 'Walked public roads in Venganoor. Founded Sadhu Jana Paripalana Sangham (SJPS).' },
      { id: 'kr-3', title: 'Chattampi Swamikal & Pracheena Malayalam', completed: true, importance: 'High', pyqCount: 29, summary: 'Protested Brahminical monopoly of Vedic studies; Vedadhikara Niroopanam.' },
      { id: 'kr-4', title: 'Vaikom Satyagraha (1924) & Temple Entry Proclamation (1936)', completed: false, importance: 'High', pyqCount: 51, summary: 'First organized struggle against untouchability; Periyar & Gandhi participation. Chithira Thirunal Balarama Varma proclamation.' },
      { id: 'kr-5', title: 'Malayali Memorial (1891) & Ezhava Memorial (1896)', completed: true, importance: 'Medium', pyqCount: 24, summary: 'P. Barrister G.P. Pillai, Dr. Palpu petitions demanding fair civil appointments.' }
    ]
  },
  {
    id: 'kpsc-geo',
    exam: 'Kerala PSC',
    name: 'Kerala Geography & River Basins',
    iconName: 'Compass',
    totalTopics: 10,
    completedTopics: 7,
    highYield: true,
    stateSpecific: true,
    topics: [
      { id: 'kg-1', title: '44 Rivers of Kerala (41 West-flowing, 3 East-flowing)', completed: true, importance: 'High', pyqCount: 46, summary: 'Periyar (244 km - longest), Bharathapuzha (209 km), Pamba (176 km). East-flowing: Kabani, Bhavani, Pambar.' },
      { id: 'kg-2', title: 'Western Ghats, Anamudi & Mountain Passes', completed: true, importance: 'High', pyqCount: 35, summary: 'Anamudi (2695 m, highest peak in South India). Palakkad Gap (major gap), Aryankavu Pass.' },
      { id: 'kg-3', title: 'National Parks & Ramsar Wetland Sites', completed: false, importance: 'High', pyqCount: 31, summary: 'Silent Valley (Kunthipuzha), Eravikulam (Nilgiri Tahr). Vembanad, Sasthamkotta, Ashtamudi lakes.' }
    ]
  },
  {
    id: 'kpsc-mal',
    exam: 'Kerala PSC',
    name: 'Malayalam Language & Grammar',
    iconName: 'BookOpen',
    totalTopics: 12,
    completedTopics: 8,
    highYield: false,
    stateSpecific: true,
    topics: [
      { id: 'km-1', title: 'Kilippattu Tradition & Thunchath Ezhuthachan', completed: true, importance: 'High', pyqCount: 22, summary: 'Father of modern Malayalam language; Adhyatma Ramayanam Kilippattu.' },
      { id: 'km-2', title: 'Panchangas & Sandhi / Samasam Rules', completed: false, importance: 'Medium', pyqCount: 19, summary: 'Agama, Lopa, Adesha, Dwithwa Sandhis frequently asked in KPSC LDC & Degree Level.' }
    ]
  },
  // UPSC CSE Modules
  {
    id: 'upsc-pol',
    exam: 'UPSC CSE',
    name: 'Indian Polity & Governance',
    iconName: 'Scale',
    totalTopics: 22,
    completedTopics: 16,
    highYield: true,
    topics: [
      { id: 'up-1', title: 'Preamble, Fundamental Rights & DPSP (Part III & IV)', completed: true, importance: 'High', pyqCount: 68, summary: 'Articles 12-35, basic structure doctrine, Kesavananda Bharati, Article 21 expansive interpretation.' },
      { id: 'up-2', title: 'Parliamentary System, Union Executive & Ordinance Making', completed: true, importance: 'High', pyqCount: 54, summary: 'Presidential powers (Art 72, 123), Council of Ministers, Money Bills vs Financial Bills.' },
      { id: 'up-3', title: 'Federal Relations & Inter-State Council (Art 263)', completed: false, importance: 'High', pyqCount: 33, summary: 'Finance Commission (Art 280), GST Council (Art 279A), Sarkaria & Punchhi Commission recommendations.' }
    ]
  },
  {
    id: 'upsc-csat',
    exam: 'UPSC CSE',
    name: 'CSAT (Paper II) Aptitude & Reasoning',
    iconName: 'Calculator',
    totalTopics: 15,
    completedTopics: 9,
    highYield: true,
    topics: [
      { id: 'ucs-1', title: 'Number Systems, Remainders & Divisibility', completed: true, importance: 'High', pyqCount: 41, summary: 'High frequency in CSAT 2021-2025. Unit digit cycles, prime factorization, Euler theorem.' },
      { id: 'ucs-2', title: 'Permutations, Combinations & Probability', completed: false, importance: 'High', pyqCount: 39, summary: 'Combinatorics word arrangements, dice selections, conditional logic.' },
      { id: 'ucs-3', title: 'Reading Comprehension & Critical Inference', completed: true, importance: 'High', pyqCount: 50, summary: 'Assumption vs implication questions, eliminating extreme qualifiers.' }
    ]
  },
  {
    id: 'upsc-eco',
    exam: 'UPSC CSE',
    name: 'Indian Economy & Macro Trends',
    iconName: 'TrendingUp',
    totalTopics: 18,
    completedTopics: 12,
    highYield: true,
    topics: [
      { id: 'ue-1', title: 'Monetary Policy Framework & RBI Repo / LAF Tools', completed: true, importance: 'High', pyqCount: 44, summary: 'MPC targets (4% +/- 2%), SDF, MSF, open market operations, inflation indexing.' },
      { id: 'ue-2', title: 'Fiscal Deficit, FRBM Act & External Balance (CAD)', completed: false, importance: 'Medium', pyqCount: 30, summary: 'Primary deficit vs fiscal deficit, current account dynamics, forex reserves.' }
    ]
  },
  // SSC CGL / CHSL Modules
  {
    id: 'ssc-quant',
    exam: 'SSC CGL / CHSL',
    name: 'Quantitative Aptitude & Advanced Math',
    iconName: 'Sigma',
    totalTopics: 20,
    completedTopics: 14,
    highYield: true,
    topics: [
      { id: 'sq-1', title: 'Algebra & Quadratic Identities', completed: true, importance: 'High', pyqCount: 48, summary: 'x + 1/x substitutions, symmetric equations, minimum and maximum values.' },
      { id: 'sq-2', title: 'Geometry & Coordinate Theorems', completed: false, importance: 'High', pyqCount: 52, summary: 'Circle tangents, chords, cyclic quadrilaterals, similarity of triangles.' },
      { id: 'sq-3', title: 'Time, Speed, Distance & Trains', completed: true, importance: 'High', pyqCount: 36, summary: 'Relative speed, circular tracks, boat and stream problems.' }
    ]
  },
  // Indian Railways RRB Modules
  {
    id: 'rrb-sci',
    exam: 'Indian Railways (RRB)',
    name: 'General Science (Physics, Chem, Bio)',
    iconName: 'Atom',
    totalTopics: 16,
    completedTopics: 11,
    highYield: true,
    topics: [
      { id: 'rs-1', title: 'Newtonian Mechanics, Work & Energy', completed: true, importance: 'High', pyqCount: 45, summary: 'Equations of motion, kinetic vs potential energy, friction, power units.' },
      { id: 'rs-2', title: 'Electric Circuits, Ohm Law & Resistance Networks', completed: false, importance: 'High', pyqCount: 39, summary: 'Series vs parallel resistors, Joule heating, domestic wiring safety.' },
      { id: 'rs-3', title: 'Indian Railways History, Zones & Vande Bharat Tech', completed: true, importance: 'High', pyqCount: 28, summary: 'First train 1853 (Mumbai-Thane), 18 Railway Zones, Kavach anti-collision system.' }
    ]
  },
  // GATE & CAT Modules
  {
    id: 'gate-cat-math',
    exam: 'GATE & CAT',
    name: 'Aptitude, Linear Algebra & LRDI',
    iconName: 'Cpu',
    totalTopics: 18,
    completedTopics: 12,
    highYield: true,
    topics: [
      { id: 'gc-1', title: 'Matrices, Eigenvalues & Cayley-Hamilton Theorem', completed: true, importance: 'High', pyqCount: 47, summary: 'Characteristic equation, rank of matrix, orthogonal diagonalization.' },
      { id: 'gc-2', title: 'CAT LRDI: Venn Diagrams & Set Distribution', completed: false, importance: 'High', pyqCount: 34, summary: '4-set Venn puzzles, maxima-minima intersections, missing data tables.' }
    ]
  }
];

export const INITIAL_QUESTIONS: Question[] = [
  // Kerala PSC Questions
  {
    id: 'q-kpsc-1',
    exam: 'Kerala PSC',
    subject: 'Kerala Renaissance & History',
    topic: 'Sree Narayana Guru & Social Reform',
    questionText: 'In which year did Sree Narayana Guru consecrate the Shiva Idol at Aruvippuram, marking a historic revolt against Brahminical monopoly?',
    options: ['1885', '1888', '1893', '1903'],
    correctIndex: 1,
    explanation: 'In 1888 (on the night of Shivaratri), Sree Narayana Guru consecrated a stone idol from Neyyar river at Aruvippuram, declaring: "Without difference of caste or rancour of religion, this is a model place where all live in brotherhood."',
    difficulty: 'Medium',
    pyqYear: 'Kerala PSC KAS 2021',
    sourceDoc: 'Kerala_PSC_Renaissance_Compendium.pdf'
  },
  {
    id: 'q-kpsc-2',
    exam: 'Kerala PSC',
    subject: 'Kerala Geography',
    topic: 'Rivers of Kerala',
    questionText: 'Which of the following is an EAST-FLOWING river in Kerala?',
    options: ['Periyar', 'Bharathapuzha', 'Kabani', 'Pamba'],
    correctIndex: 2,
    explanation: 'Out of the 44 rivers in Kerala, 41 are west-flowing into the Arabian Sea/backwaters, while only 3 are east-flowing: Kabani, Bhavani, and Pambar (all flow into the Cauvery basin in neighbouring states).',
    difficulty: 'Easy',
    pyqYear: 'Degree Level Preliminary 2023',
    sourceDoc: 'Kerala_Geography_Syllabus.pdf'
  },
  {
    id: 'q-kpsc-3',
    exam: 'Kerala PSC',
    subject: 'Kerala Renaissance & History',
    topic: 'Ayyankali & SJPS',
    questionText: 'Who led the famous "Villuvandi Samaram" (Bullock Cart Protest) in 1893 to assert the right of marginalized communities to walk on public thoroughfares?',
    options: ['Pandit Karuppan', 'Ayyankali', 'Vakkom Moulavi', 'Mannathu Padmanabhan'],
    correctIndex: 1,
    explanation: 'Mahatma Ayyankali rode a decorated bullock cart ("Villuvandi") through the prohibited public roads of Venganoor in 1893, breaking caste taboos.',
    difficulty: 'Easy',
    pyqYear: 'LDC Preliminary 2022',
    sourceDoc: 'Kerala_Social_Reform_Movements.pdf'
  },
  // UPSC CSE Questions
  {
    id: 'q-upsc-1',
    exam: 'UPSC CSE',
    subject: 'Indian Polity',
    topic: 'Fundamental Rights & Judicial Review',
    questionText: 'With reference to the Constitution of India, consider the following statements:\n1. A Constitutional Amendment under Article 368 can abrogate any Fundamental Right.\n2. The Doctrine of Basic Structure was propounded in the Kesavananda Bharati case (1973).\n\nWhich of the statements given above is/are correct?',
    options: ['1 only', '2 only', 'Both 1 and 2', 'Neither 1 nor 2'],
    correctIndex: 1,
    explanation: 'Statement 1 is incorrect because Parliament cannot amend provisions forming part of the "Basic Structure" of the Constitution. Statement 2 is correct: the 13-judge bench in Kesavananda Bharati v. State of Kerala (1973) established the Basic Structure doctrine.',
    difficulty: 'Hard',
    pyqYear: 'UPSC CSE Prelims 2020',
    sourceDoc: 'Indian_Polity_M_Laxmikanth_Ch7.pdf'
  },
  {
    id: 'q-upsc-2',
    exam: 'UPSC CSE',
    subject: 'CSAT Quantitative & Reasoning',
    topic: 'Number Systems & Remainder',
    questionText: 'What is the remainder when (97^97 + 97) is divided by 98?',
    options: ['0', '96', '97', '1'],
    correctIndex: 1,
    explanation: 'By Modular Arithmetic: 97 ≡ -1 (mod 98). Therefore, 97^97 ≡ (-1)^97 ≡ -1 (mod 98). Then (-1 + 97) = 96. Hence the remainder is 96.',
    difficulty: 'Medium',
    pyqYear: 'CSAT Paper II 2023',
    sourceDoc: 'CSAT_Quantitative_Aptitude_Guide.pdf'
  },
  {
    id: 'q-upsc-3',
    exam: 'UPSC CSE',
    subject: 'Indian Economy',
    topic: 'Monetary Policy Framework',
    questionText: 'Under the Monetary Policy Framework Agreement in India, what is the inflation target assigned to the Reserve Bank of India (RBI)?',
    options: ['3% with a tolerance band of +/- 1%', '4% with a tolerance band of +/- 2%', '5% flat rate', '2% core CPI'],
    correctIndex: 1,
    explanation: 'The RBI Monetary Policy Committee (MPC) is mandated to maintain Consumer Price Index (CPI) inflation at 4% with an upper tolerance limit of 6% and lower tolerance limit of 2% (4% +/- 2%).',
    difficulty: 'Medium',
    pyqYear: 'UPSC CSE Prelims 2022',
    sourceDoc: 'RBI_Monetary_Policy_Bulletins.pdf'
  },
  // SSC CGL Questions
  {
    id: 'q-ssc-1',
    exam: 'SSC CGL / CHSL',
    subject: 'Quantitative Aptitude',
    topic: 'Algebra Identities',
    questionText: 'If x + 1/x = 3, then what is the value of x^3 + 1/x^3?',
    options: ['18', '27', '24', '21'],
    correctIndex: 0,
    explanation: 'Formula: If x + 1/x = k, then x^3 + 1/x^3 = k^3 - 3k. Here k = 3, so 3^3 - 3(3) = 27 - 9 = 18.',
    difficulty: 'Easy',
    pyqYear: 'SSC CGL Tier 1 2023',
    sourceDoc: 'SSC_Advance_Maths_Vol1.pdf'
  },
  // Indian Railways RRB Questions
  {
    id: 'q-rrb-1',
    exam: 'Indian Railways (RRB)',
    subject: 'General Science',
    topic: 'Indian Railways Tech & Safety',
    questionText: 'What is the indigenous Automatic Train Protection (ATP) system developed by Indian Railways to prevent train collisions named?',
    options: ['Rakshak', 'Kavach', 'Trinetra', 'Sudarshan'],
    correctIndex: 1,
    explanation: 'Kavach (Armor) is an indigenously developed Automatic Train Protection (ATP) system by RDSO (Research Designs and Standards Organisation) certified to Safety Integrity Level 4 (SIL-4).',
    difficulty: 'Easy',
    pyqYear: 'RRB NTPC CBT-2 2022',
    sourceDoc: 'Indian_Railways_Safety_Manual.pdf'
  },
  // GATE & CAT Questions
  {
    id: 'q-gate-1',
    exam: 'GATE & CAT',
    subject: 'Quantitative Aptitude / Math',
    topic: 'Linear Algebra & Matrices',
    questionText: 'For a 2x2 square matrix A with trace = 7 and determinant = 10, what are its eigenvalues?',
    options: ['2 and 5', '3 and 4', '1 and 10', '-2 and -5'],
    correctIndex: 0,
    explanation: 'The sum of eigenvalues equals the trace (λ1 + λ2 = 7), and the product of eigenvalues equals the determinant (λ1 * λ2 = 10). The roots of λ^2 - 7λ + 10 = 0 are λ = 2 and λ = 5.',
    difficulty: 'Medium',
    pyqYear: 'GATE Engineering Math 2023',
    sourceDoc: 'Higher_Engineering_Mathematics_Kreyszig.pdf'
  }
];

export const INITIAL_VECTOR_CHUNKS: VectorDocChunk[] = [
  {
    id: 'chk-kpsc-01',
    exam: 'Kerala PSC',
    subject: 'Kerala Renaissance',
    title: 'Aruvippuram Movement & Sree Narayana Guru Chronology',
    source: 'Kerala_PSC_Renaissance_Master_Doc.pdf',
    chunkText: 'In 1888, Sree Narayana Guru consecrated the Shiva idol at Aruvippuram in Thiruvananthapuram district on Shivaratri night. In 1903, SNDP Yogam was registered under the Indian Companies Act with Guru as permanent President and Kumaran Asan as general secretary. The motto proclaimed was: One Caste, One Religion, One God for Man. In 1916 Guru established the Advaita Ashram at Aluva with the motto "Om Sahodaryam Sarvatra".',
    dateAdded: '2026-03-01'
  },
  {
    id: 'chk-kpsc-02',
    exam: 'Kerala PSC',
    subject: 'Kerala Geography',
    title: 'River Systems, Catchments and Passes in Western Ghats',
    source: 'Kerala_Physical_Geography_Atlas.pdf',
    chunkText: 'Kerala has 44 rivers: 41 west-flowing and 3 east-flowing (Kabani, Bhavani, Pambar). Periyar is 244 km long originating from Sivagiri hills. Bharathapuzha (Nila) is 209 km long originating from Anamalai hills. Anamudi peak at 2,695 meters in Idukki district is the highest peak in the Western Ghats south of the Himalayas. The Palakkad Gap is a low mountain pass about 30 km wide separating the Nilgiri hills to the north from the Anaimalai Hills to the south.',
    dateAdded: '2026-03-01'
  },
  {
    id: 'chk-upsc-01',
    exam: 'UPSC CSE',
    subject: 'Indian Polity',
    title: 'Constitutional Basic Structure & Judicial Review Doctrine',
    source: 'UPSC_Polity_M_Laxmikanth_Synthesized.pdf',
    chunkText: 'In Kesavananda Bharati v. State of Kerala (1973), the Supreme Court ruled by a 7-6 majority that while Parliament holds extensive amending power under Article 368, it cannot alter the Basic Structure of the Constitution. Core elements include: Supremacy of Constitution, Republican and Democratic form of government, Secular character, Separation of powers, Federalism, Rule of Law, Judicial review, and harmony between Fundamental Rights and DPSPs.',
    dateAdded: '2026-03-02'
  },
  {
    id: 'chk-upsc-02',
    exam: 'UPSC CSE',
    subject: 'CSAT Aptitude',
    title: 'CSAT Number Systems: Cyclicity and Modular Arithmetic',
    source: 'UPSC_CSAT_Quantitative_Aptitude.pdf',
    chunkText: 'For finding unit digits, note the cyclicity of powers: 2, 3, 7, 8 have cyclicity 4. For remainder theorem problems of format (a +/- 1)^n mod a, utilize Binomial expansion where all terms except the last contain multiples of a. In Euler Totient formula: if a and m are coprime, then a^phi(m) ≡ 1 (mod m). This is essential for solving high-power CSAT problems.',
    dateAdded: '2026-03-02'
  },
  {
    id: 'chk-ssc-01',
    exam: 'SSC CGL / CHSL',
    subject: 'Quantitative Aptitude',
    title: 'Algebraic Shortcuts and Factorization in SSC Tier 2',
    source: 'SSC_CGL_Quant_Formula_Book.pdf',
    chunkText: 'Key formula: if a + b + c = 0, then a^3 + b^3 + c^3 = 3abc. If x + 1/x = a, then x^2 + 1/x^2 = a^2 - 2, and x^3 + 1/x^3 = a^3 - 3a. If x - 1/x = b, then x^2 + 1/x^2 = b^2 + 2, and x^3 - 1/x^3 = b^3 + 3b. For circles: alternate segment theorem states that angle between tangent and chord equals angle in the alternate segment.',
    dateAdded: '2026-03-03'
  },
  {
    id: 'chk-rrb-01',
    exam: 'Indian Railways (RRB)',
    subject: 'General Science & Tech',
    title: 'Kavach SIL-4 Architecture and Railway Electrification',
    source: 'Indian_Railways_Technical_Compendium.pdf',
    chunkText: 'Kavach is an indigenously developed ATP system by Research Designs and Standards Organisation (RDSO). It uses RFID tags installed on tracks, Loco Kavach installed in engines, and Station Kavach connected to signal interlockings. It communicates over UHF radio waves at 400 MHz to enforce automatic brake application if driver fails to slow down across red signals.',
    dateAdded: '2026-03-03'
  }
];

export const PODCAST_ITEMS: PodcastItem[] = [
  {
    id: 'pod-1',
    title: 'Daily Kerala PSC Bulletin: Renaissance Quick Fire & Thozhilveedhi GK',
    exam: 'Kerala PSC',
    category: 'State Daily Brief',
    duration: '6 min 30 sec',
    publishDate: 'Today, 7:00 AM',
    summary: 'High-frequency facts on Vaikom Satyagraha centenary, Temple Entry Proclamation milestones, and key Cabinet decisions on KAS promotions.',
    bulletPoints: [
      'Vaikom Satyagraha started on March 30, 1924; completed 100 years.',
      'Sree Narayana Guru, Mahatma Gandhi, and Periyar EV Ramasamy visited Vaikom.',
      'Rani Sethu Lakshmi Bai issued proclamation allowing walking on approach roads.',
      'KAS cadre review updates & upcoming exam schedules.'
    ],
    audioScript: 'Welcome to the PrepWise Kerala PSC Daily Express Bulletin. Today we analyze high-frequency questions for the upcoming KAS and Degree Level Preliminary examinations. First, the Vaikom Satyagraha centenary facts: remember the date, March 30, 1924. The main organizers included T.K. Madhavan, K.P. Kesava Menon, and George Joseph. Sree Narayana Guru provided his ashram at Vaikom for satyagrahis.',
    voiceName: 'Kore (Clear Indian English / Malayalam Pronunciation)'
  },
  {
    id: 'pod-2',
    title: 'UPSC Editorial Breakdown: Fiscal Federalism & 16th Finance Commission Terms',
    exam: 'UPSC CSE',
    category: 'The Hindu & PIB Analysis',
    duration: '8 min 45 sec',
    publishDate: 'Yesterday, 8:30 PM',
    summary: 'Deep-dive into Article 280, vertical vs horizontal tax devolution criteria, population census weighting shifts, and state fiscal space.',
    bulletPoints: [
      'Constitutional mandate under Article 280 of Indian Constitution.',
      'Recommendations of 15th FC: 41% vertical devolution to states.',
      'Criteria: Income distance (45%), Population 2011 (15%), Area (15%), Forest & Ecology (10%), Demographic performance (12.5%).',
      'Challenges raised by southern states regarding demographic transition dividends.'
    ],
    audioScript: 'Good day civil services aspirants. In this PrepWise editorial breakdown, we examine Fiscal Federalism under the lens of the 16th Finance Commission chaired by Dr. Arvind Panagariya. Under Article 280, the President constitutes the Finance Commission every five years. The key tension lies between equity and efficiency in horizontal tax devolution.',
    voiceName: 'Puck (Engaging Academic Tone)'
  },
  {
    id: 'pod-3',
    title: 'SSC & RRB Speed Drill: Algebra Substitutions & Newton Laws in 5 Minutes',
    exam: 'SSC CGL / CHSL',
    category: 'Rapid Fire Formulae',
    duration: '4 min 50 sec',
    publishDate: '2 days ago',
    summary: 'Master mental arithmetic shortcuts for x + 1/x forms and memory mnemonics for railway speed-distance conversions.',
    bulletPoints: [
      'Multiply by 5/18 to convert km/h to m/s; multiply by 18/5 for m/s to km/h.',
      'Relative speed in same direction: (u - v); in opposite direction: (u + v).',
      'Newton first law: inertia; second law: F = dp/dt; third law: equal and opposite reaction.'
    ],
    audioScript: 'PrepWise rapid-fire speed drill: train passing a pole covers its own length in time L over S. Train passing a platform covers length L1 plus L2. Remember to always match your units: km per hour to meters per second by multiplying with 5 over 18.',
    voiceName: 'Fenrir (Energetic Coach)'
  }
];

export const CURRENT_AFFAIRS_ITEMS: CurrentAffairItem[] = [
  {
    id: 'ca-1',
    title: 'Kerala Cabinet Approves State Green Hydrogen Valley Project at Kochi',
    category: 'Kerala State',
    applicableExams: ['Kerala PSC', 'UPSC CSE'],
    date: 'March 04, 2026',
    summary: 'Kerala Government partners with central agencies to establish a Green Hydrogen Valley in Kochi to support clean maritime transport and industrial decarbonization.',
    keyPoints: [
      'Target production: 50 metric tons of green hydrogen per day by 2030.',
      'Water electrolysis powered by floating solar installations at Banasura Sagar and Idukki reservoirs.',
      'Key syllabus link: Kerala PSC Economy & Science & Tech Paper; UPSC GS-3 Renewable Energy.'
    ],
    source: 'Kerala IPRD Bulletin & The Hindu Kerala Edition',
    sourceUrl: 'https://prd.kerala.gov.in',
    vectorIndexed: true
  },
  {
    id: 'ca-2',
    title: 'Election Commission of India Rolls Out ECIS-EC 3.0 Platform for Remote Voter Tracking',
    category: 'Polity & Schemes',
    applicableExams: ['UPSC CSE', 'SSC CGL / CHSL', 'Kerala PSC'],
    date: 'March 02, 2026',
    summary: 'Article 324 mandate utilized to streamline electoral roll sanitization, demographic re-checks, and overseas citizen service workflows.',
    keyPoints: [
      'Article 324 provides superintendence, direction, and control of elections.',
      'Integrates facial anti-spoofing and decentralized audit logs for postal ballots.',
      'Key for UPSC Prelims GS-1 Polity and SSC General Awareness.'
    ],
    source: 'PIB New Delhi',
    sourceUrl: 'https://pib.gov.in',
    vectorIndexed: true
  },
  {
    id: 'ca-3',
    title: 'Indian Railways Completes 10,000 Route Kilometers of Kavach ATP Network',
    category: 'Science & Tech',
    applicableExams: ['Indian Railways (RRB)', 'SSC CGL / CHSL', 'UPSC CSE'],
    date: 'February 28, 2026',
    summary: 'Milestone reached across high-density corridors (Delhi-Mumbai and Delhi-Howrah), ensuring automatic braking against signal overshooting at up to 160 km/h.',
    keyPoints: [
      'Kavach utilizes SIL-4 (Safety Integrity Level 4) fail-safe certification.',
      'Reduces SPAD (Signal Passing At Danger) risks to negligible levels.',
      'Essential question focus for RRB NTPC & JE Technical papers.'
    ],
    source: 'Ministry of Railways Official Release',
    sourceUrl: 'https://railnet.gov.in',
    vectorIndexed: true
  },
  {
    id: 'ca-4',
    title: 'Vaikom Centenary Celebrations Conclude: Memorial Cultural Corridor Inaugurated',
    category: 'Kerala State',
    applicableExams: ['Kerala PSC'],
    date: 'February 25, 2026',
    summary: 'A new cultural pavilion commemorating the historic 1924 Satyagraha was dedicated, chronicling leaders T.K. Madhavan, K. Kelappan, and Sree Narayana Guru.',
    keyPoints: [
      'Highlights peaceful satyagraha that lasted 603 days.',
      'Led to opening of roads surrounding Vaikom Mahadeva Temple to non-caste Hindus.',
      'Direct relevance to Kerala PSC Degree Level & KAS Paper II.'
    ],
    source: 'Mathrubhumi / Malayala Manorama Archival Digest',
    sourceUrl: 'https://keralatourism.org/vaikom',
    vectorIndexed: true
  }
];

export const STUDENT_COHORT: StudentCohortMember[] = [
  {
    id: 'std-101',
    name: 'Rahul Sharma',
    targetExam: 'UPSC CSE',
    quizzesCompleted: 18,
    accuracy: 64,
    lastActive: '12 mins ago',
    riskStatus: 'Watchlist',
    weakSubjects: ['CSAT Number Systems', 'Modern History Dates'],
    recentScore: 68
  },
  {
    id: 'std-102',
    name: 'Ananya Nair',
    targetExam: 'Kerala PSC',
    quizzesCompleted: 24,
    accuracy: 88,
    lastActive: 'Just now',
    riskStatus: 'Safe',
    weakSubjects: ['Malayalam Sandhi Grammar', 'Kerala River Tributaries'],
    recentScore: 92
  },
  {
    id: 'std-103',
    name: 'Vikram Rao',
    targetExam: 'SSC CGL / CHSL',
    quizzesCompleted: 9,
    accuracy: 48,
    lastActive: '3 hours ago',
    riskStatus: 'Critical',
    weakSubjects: ['Geometry Tangents', 'English Cloze Test'],
    recentScore: 45
  },
  {
    id: 'std-104',
    name: 'Deepa Krishnan',
    targetExam: 'Kerala PSC',
    quizzesCompleted: 15,
    accuracy: 72,
    lastActive: 'Yesterday',
    riskStatus: 'Safe',
    weakSubjects: ['General Science Chem Equations'],
    recentScore: 76
  },
  {
    id: 'std-105',
    name: 'Siddharth V.',
    targetExam: 'GATE & CAT',
    quizzesCompleted: 21,
    accuracy: 79,
    lastActive: '5 hours ago',
    riskStatus: 'Safe',
    weakSubjects: ['CAT LRDI 4-Set Venn'],
    recentScore: 82
  }
];

export const DEFAULT_STUDENT_USER: UserProfile = {
  id: 'std-101',
  name: 'Rahul Sharma',
  email: 'rahul.upsc@aspirant.prepwise.ai',
  role: 'student',
  targetExam: 'UPSC CSE',
  streakDays: 14,
  totalStudyHours: 182,
  quizzesTaken: 28,
  overallAccuracy: 66,
  mentorName: 'Dr. S. Nambiar'
};

export const MENTOR_STUDENTS = STUDENT_COHORT;

export const INITIAL_ML_REPORT: MLWeaknessReport = {
  studentId: 'std-current',
  studentName: 'Aspirant',
  overallHealthScore: 74,
  clusterGroup: 'Needs Targeted Revision',
  weakTopics: [
    {
      topic: 'CSAT Number Systems & Divisibility',
      subject: 'CSAT Aptitude',
      accuracy: 42,
      avgTimePerQuestionSec: 94,
      urgency: 'Critical',
      recommendedAction: 'Focus on modular arithmetic cycles and prime factorizations. Attempt 15 practice PYQ drill sets.'
    },
    {
      topic: 'Kerala Renaissance Chronology (1888-1936)',
      subject: 'Kerala PSC Renaissance',
      accuracy: 55,
      avgTimePerQuestionSec: 72,
      urgency: 'Moderate',
      recommendedAction: 'Review timeline flashcards for Sree Narayana Guru, Ayyankali, and Vaikom Satyagraha milestones.'
    },
    {
      topic: 'Western Ghats Passes & Catchments',
      subject: 'Kerala Geography',
      accuracy: 60,
      avgTimePerQuestionSec: 68,
      urgency: 'Moderate',
      recommendedAction: 'Map-based revision of 3 East-flowing rivers and mountain passes (Palakkad Gap, Aryankavu).'
    }
  ],
  masteryLevels: [
    { subject: 'Indian Polity & Constitution', masteryScore: 84, status: 'Mastered' },
    { subject: 'Kerala Renaissance & Reformers', masteryScore: 68, status: 'In Progress' },
    { subject: 'CSAT Aptitude & Quant', masteryScore: 52, status: 'Attention Needed' },
    { subject: 'Kerala Geography & Rivers', masteryScore: 64, status: 'In Progress' },
    { subject: 'Current Affairs & Editorials', masteryScore: 86, status: 'Mastered' }
  ],
  dailySchedule: [
    { timeSlot: '06:30 AM - 07:30 AM', activity: 'High-Yield Audio Podcast Revision', focusTopic: 'Daily Kerala PSC Bulletin & PIB Analysis', durationMinutes: 60, type: 'Podcast' },
    { timeSlot: '09:00 AM - 10:30 AM', activity: 'ML Focused Weakness Intervention', focusTopic: 'CSAT Number Systems & Cyclicity Rules', durationMinutes: 90, type: 'Study' },
    { timeSlot: '11:00 AM - 12:00 PM', activity: 'Targeted CBT Quiz Sprint', focusTopic: '15 High-Yield Questions on Weak Topics', durationMinutes: 60, type: 'Quiz' },
    { timeSlot: '03:00 PM - 04:30 PM', activity: 'State-Specific Subject Deep Dive', focusTopic: 'Kerala Renaissance Movements & Leaders', durationMinutes: 90, type: 'Study' },
    { timeSlot: '08:00 PM - 09:00 PM', activity: 'Nightly Error Log & AI Tutor Clarification', focusTopic: 'Review incorrect quiz attempts with Gemini 2.5 Flash', durationMinutes: 60, type: 'Revision' }
  ]
};
