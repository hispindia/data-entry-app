const translation_mapping = [
    // 1.1 Organization detials
    {
        id: "organization_details", 
        en: "1. Organizational details",
        sp: "1.1 Información de la organización",
        fr: "1.1 Détails de l'organisation",
        ar: "بيانات المنظمة ",    
    },
    {
        id: "membership_details",
        en: "Membership details",
        sp: "Datos de afiliación",
        fr: "Détails en tant que membre",
        ar: 'بيانات العضوية'
    },
    {
        id: "country_of_operation",
        en: "Country of Operation",
        sp: "País de operaciones",
        fr: "Pays d’exploitation",
        ar:  'دولة العمليات'
    },
    {
        id: "organisation_code",
        en: "Organisation Code",
        sp: "Código de la organización",
        fr: "Code de l’organisation",
        ar: 'رمز المنظمة'
    },
    {
        id: "ippf_region",
        en: "IPPF Region",
        sp: "Región de IPPF",
        fr: "Région de l’IPPF",
        ar: 'اقليم الاتحاد الدولي لتنظيم الاسرة'
    },
    {
        id: "organisation_name",
        en: "Organisation Name(English)",
        sp: "Nombre de la organización (inglés)",
        fr: "Nom de l'organisation(anglais)",
        ar: 'اسم المنظمة (بالانجليزية)'
    },
    {
        id: "organisation_name_original",
        en: "Organisation name (original language)",
        sp: "Nombre de la organización: (idioma original)",
        fr: "Nom de l’organisation",
        ar: 'اسم المنظمة (بلغتها الأصلية)'
    },
    {
        id: "grant_amount",
        en: "Formula-generated proposed grant amount (USD)",
        sp: "Monto de la subvención propuesta generado por fórmula (USD)",
        fr: "Montant de la subvention proposée tel qu’établi par la formule (USD)",
        ar: 'مبلغ المنحة المقترح المولد بالصيغة (بالدولار الأمريكي)'
    },
     {
        id: "grant_amount",
        en: "Formula-generated proposed grant amount (USD)",
        sp: "Monto de la subvención generado por fórmula  (USD)",
        fr: "Montant de la subvention proposée tel qu’établi par la formule  (USD)",
        ar: 'المبلغ المقترح للمنحة حسب المعادلة التمويلية (بالدولار الأمريكي)'
    },
    {
        id: "grant_amount_year2",
        en: "Formula-generated proposed grant amount (Year 2) (USD)",
        sp: "Monto de la subvención generado por fórmula (Año 2) (USD) (sólo 75% asegurado)",
        fr: "Montant de la subvention établi par la formule (Année 2) (USD)",
        ar: 'المبلغ المقرر للمنحة حسب المعادلة  (بالدولار الأمريكي)',
    },
    {
        id: "grant_amount_year3",
        en: "Provisional formula-generated grant amount (USD)",
        sp: "Monto PROVISIONAL de la subvención generado por fórmula (USD) (sólo 75% asegurado)",
        fr: "Montant de la subvention PROVISOIRE tel qu’établi par la formule (USD)",
        ar: 'المبلغ المقرر للمنحة حسب المعادلة المؤقتة (بالدولار الأمريكي)',
    },
    {
        id: "primary_contact_person",
        en: "Primary contact person",
        sp: "Persona de contacto para el plan de negocio ",
        fr: "Personne de contact principale",
        ar: "'مسؤول التواصل بشأن خطة الأعمال (الاسم والدور المكلف به)'"
    },
    {
        id: "business_plan_contact_role",
        en: "Business plan contact role",
        sp: "Rol de la persona de contacto",
        fr: "Personne de contact du plan d'activité",
        ar: 'دور جهة الاتصال في خطة العمل'
    },
    {
        id: "business_plan_contact_email",
        en: "Business plan contact email",
        sp: "Correo electrónico de contacto para el plan de negocio",
        fr: "E-mail de contact pour le plan d'affaires",
        ar: "البريد الإلكتروني للتواصل بشأن خطة الأعمال"
    },
    {
        id: "save_as_draft",
        en: "SAVE AS DRAFT",
        sp: "Guardar como borrador",
        fr: "ENREGISTRER COMME BROUILLON",
        ar:  "حفظ كمسودة"
    },
    {
        id: "next",
        en: "NEXT",
        sp: "Siguiente",
        fr: "Suivant",
        ar:  "التالي",
    },
    {
        id: "contact_information",
        en: "Contact Information",
        sp: "Información del contacto",
        fr: "Coordonnées",
        ar:  "هاتف الاتصال"
    },
    {
        id: "physical_address",
        en: "Address",
        sp: "DIRECCIÓN",
        fr: "Adresse",
        ar: "عنوان"
    },
    {
        id: "key_contacts",
        en: "Key Contacts",
        sp: "Personas de contacto principales",
        fr: "Contacts clés",
        ar: 'الوثائق الرئيسية'
    },
    {
        id: "board_members",
        en: "Board Members",
        sp: "Miembros de la Junta",
        fr: "Membres du Conseil",
        ar: "أعضاء المجلس"
    },
    {
        id: "staff_members",
        en: "Staff Members",
        sp: "Miembros del personal",
        fr: "Membres du personnel",
        ar: "أعضاء الفريق"
    },
    {
        id: "executive_director",
        en: "Executive Director / CEO (or equivalent)",
        sp: "Director/a Ejecutivo/a (o equivalente)",
        fr: "Directeur·ce exécutif·ve / CEO",
        ar: "المدير التنفيذي / الرئيس التنفيذي"
    },
    {
        id: "name",
        en: "Name",
        sp: "Nombre",
        fr: "Nom",
        ar: 'الاسم'
    },
    {
        id: "contact_email",
        en: "Contact Email",
        sp: "Correo electrónico de contacto",
        fr: "E-mail de contact",
        ar: 'بريد إلكتروني للتواصل'
    },
    {
        id: "institutional_data",
        en: "Institutional Data",
        sp: "Datos institucionales",
        fr: "Données institutionnelles",
        ar: 'البيانات المؤسسية'
    },
    {
        id: "number",
        en: "Contact phone",
        sp: "Teléfono de contacto",
        fr: "Téléphone de contact",
        ar: 'هاتف الاتصال '
    },
    {
        id: "board_chair",
        en: "Board chair / President",
        sp: "Presidente/a de la Junta",
        fr: "Président·e du conseil d’administration",
        ar: 'رئيس المجلس / الرئيس'
    },
    {
        id: "officer_of_the_board1",
        en: "Officer of the board #1 (e.g., vice president, secretary, treasurer)",
        sp: "Directivo/a de la Junta #1 (p. ej., vicepresidente/a, secretario/a, tesorero/a)",
        fr: "Membre du Conseil d’administration n° 1 (par ex., vice-président·e, secrétaire, trésorier·ère)",
        ar: 'مسؤول في المجلس 1 (على سبيل المثال، نائب الرئيس، السكرتير، أمين الصندوق)'
    },
    {
        id: "officer_of_the_board2",
        en: "Officer of the board #2 (e.g., vice president, secretary, treasurer)",
        sp: "Directivo/a de la Junta #2 (p. ej., vicepresidente/a, secretario/a, tesorero/a)",
        fr: "Membre du Conseil d’administration n° 2 (par ex., vice-président·e, secrétaire, trésorier·ère)",
        ar: 'مسؤول في المجلس 2 (على سبيل المثال، نائب الرئيس، السكرتير، أمين الصندوق)'
    },
    {
        id: "officer_of_the_board3",
        en: "Officer of the board #3 (e.g., vice president, secretary, treasurer)",
        sp: "Directivo/a de la Junta #3 (p. ej., vicepresidente/a, secretario/a, tesorero/a)",
        fr: "Membre du Conseil d’administration n° 3 (par ex., vice-président·e, secrétaire, trésorier·ère)",
        ar: 'مسؤول في المجلس 3 (على سبيل المثال، نائب الرئيس، السكرتير، أمين الصندوق)'
    },
    {
        id: "youth_board_member",
        en: "Youth board member",
        sp: "Miembro de la Junta Juvenil",
        fr: "Jeune parmi les membres du Conseil d'administration",
        ar: 'عضو شاب بالمجلس'
    },
    {
        id: "programmatic_lead",
        en: "Programmatic lead(s)",
        sp: "Líder de programas",
        fr: "Chef de file programmatique",
        ar: 'قيادة البرامج'
    },
    {
        id: "finance_lead",
        en: "Finance lead",
        sp: "Líder de Finanzas",
        fr: "Responsable financier",
        ar: 'قيادة الشؤون المالية'
    },
    {
        id: "vice_chair",
        en: "Vice-Chair / Vice - President (or equivalent)",
        sp: "Vicepresidente/a (o equivalente)",
        fr: "Vice-président·e (ou équivalent)",
        ar: 'نائب الرئيس (أو ما يعادله)'
    },
    {
        id: "secretary_equivalent",
        en: "Secretary (or equivalent)",
        sp: "Secretario/a (o equivalente)",
        fr: "Secrétaire (ou équivalent)",
        ar: 'السكرتير (أو ما يعادله)'
    },
    {
        id: "treasurer_equivalent",
        en: "Treasurer (or equivalent)",
        sp: "Trésorier·ère (o equivalente)",
        fr: "Trésorier·ère (ou équivalent)",
        ar: 'أمين الصندوق (أو ما يعادله)'
    },
    {
        id: "director_programmes",
        en: "Director of Programmes (or equivalent)",
        sp: "Director/a de Programas (o equivalente)",
        fr: "Directeur·rice des programmes (ou équivalent)",
        ar: 'مدير البرامج (أو ما يعادله)'
    },
    {
        id: "director_resource_mobilisation",
        en: "Director of Resource Mobilisation (or equivalent)",
        sp: "Director/a de Movilización de Recursos (o equivalente)",
        fr: "Directeur·rice de la mobilisation des ressources (ou équivalent)",
        ar: 'مدير تعبئة الموارد (أو ما يعادله)'
    },
    {
        id: "director_finance",
        en: "Director of Finance (or equivalent)",
        sp: "Director/a de Finanzas (o equivalente)",
        fr: "Directeur·rice des finances (ou équivalent)",
        ar: 'مدير الشؤون المالية (أو ما يعادله)'
    },
    {
        id: "director_me",
        en: "Director of M&E (or equivalent)",
        sp: "Director/a de M&E (o equivalente)",
        fr: "Directeur·rice du S&E (ou équivalent)",
        ar: 'مدير المتابعة والتقييم (أو ما يعادله)'
    },
    {
        id: "current_board_term",
        en: "Current board term",
        sp: "Período de la junta actual",
        fr: "Mandat de l'actuel conseil d'administration",
        ar: ',فترة ولاية المجلس الحالية'
    },
    {
        id: "start_year",
        en: "Start year",
        sp: "año de inicio",
        fr: "Année de début",
        ar: 'سنة البداية'
    },

    {
        id: "end_year",
        en: "End year",
        sp: "año de finalización",
        fr: "Année de fin",
        ar: 'سنة الانتهاء '
    },
     {
        id: "organisation_data",
        en: "Organisation Data",
        sp: "Datos de la organización",
        fr: "Données de l’organisation",
        ar: 'بيانات المنظمة'
    },
    {
        id: "strategic_period",
        en: "Strategic period",
        sp: "Período estratégico",
        fr: "Période stragégique",
        ar: 'الفترة الاستراتيجية'
    },  
    {
        id: "number_fixed_staff",
        en: "Total Number of Fixed Staff (paid staff on a contract)",
        sp: "Número total de personal fijo (personal pago con contrato)",
        fr: "Nombre total de salariés fixes (personnel rémunéré par contrat)",
        ar: 'إجمالي عدد الموظفين المثبَّتين (الموظفون الذين يتقاضون رواتبهم بموجب عقد)',
    },
    {
        id: "staff_size",
        en: "Staff Size",
        sp: "Tamaño del personal",
        fr: "Taille du personnel",
        ar: "حجم الموظفين"
    },
    {
        id: "number_volunteers",
        en: "Total Number of volunteers (excluding governance)",
        sp: "Número total de voluntarios (excluyendo gobernanza)",
        fr: "Nombre total de volontaires (à l'exclusion de la gouvernance)",
        ar: 'إجمالي عدد المتطوعين (بخلاف الحوكمة)'
    },
    {
        id: "type_of_organisation",
        en: "Type of organisation",
        sp: "Tipo de organización",
        fr: "Type d’organisation",
        ar: 'نوع المنظمة'
    },
    {
        id: "primary_focus",
        en: "What is your primary focus area (choose most relevant)",
        sp: "¿Cuál es su área prioritaria primaria? (Elija la más importante)",
        fr: "Quel est votre principal volet d'intervention (indiquer le plus pertinent)",
        ar: 'ما هو مجال تركيزكم الأساسي (اختر أدق وصف)'
    },
    {
        id: "focus_1",
        en: "Abortion Care ",
        sp: "Atención del aborto",
        fr: "Soins d'avortement",
        ar: 'رعاية الاجهاض'
    },
    {
        id: "focus_2",
        en: "General SRHR or FP",
        sp: "SDSR o planificación familiar general",
        fr: "SDSR générale ou PF",
        ar: 'الصحة والحقوق الجنسية والإنجابية العامة أو تنظيم الأسرة'
    },
    {
        id: "focus_3",
        en: "Advocacy & Norms shifting",
        sp: "Incidencia política y modificación de normas",
        fr: "Plaidoyer et changement de normes",
        ar: 'الدعوة وتبديل المعايير'
    },
    {
        id: "focus_4",
        en: "Humanitarian SRHR",
        sp: "SDSR humanitarios",
        fr: "SDSR humanitaire",
        ar: "الصحة والحقوق الجنسية والإنجابية الإنسانية"
    },
    {
        id: "focus_5",
        en: "Youth Care or CSE",
        sp: "Atención de personas jóvenes o EIS",
        fr: "Soins à la jeunesse ou ECS",
        ar: "رعاية الشباب أو التربية الجنسية الشاملة"
    },
    {
        id: "focus_6",
        en: "HIV Prevention or Care",
        sp: "Prevención o atención de VIH",
        fr: "Prévention ou soins du VIH",
        ar: " الرعاية أو الوقاية من فيروس نقص المناعة البشري"
    },
    {
        id: "focus_7",
        en: "LGBTQ+ Care",
        sp: "Atención de LGBTQ+",
        fr: "Soins LGBTQ+",
        ar: " رعاية مجتمع الميم (الشواذ +LGBTQ)"
    },
    {
        id: "type_1",
        en: "Not-for-Profit NGO or Chairity",
        sp: "ONG sin fines de lucro u organización benéfica ",
        fr: "ONG à but non lucratif ou œuvre de bienfaisance ",
        ar: "منظمة مجتمعية"
    },
    {
        id: "type_2",
        en: "Not-for-profit Membership organisation or Network",
        sp: "Red u organización de membresía sin fines de lucro",
        fr: "Organisation associative ou réseau associatif à but non lucratif ",
        ar: "منظمة ربحية"
    },
    {
        id: "type_3",
        en: "Parastatal ( state joint venture)",
        sp: "Paraestatal (empresa mixta estatal) ",
        fr: "Organisation parapublique (coentreprise d'État)",
        ar: " مؤسسة شبه حكومية (مشروع حكومي مشترك) "
    },
    {
        id: "type_4",
        en: "For-profit organisation",
        sp: "Organización con fines de lucro",
        fr: "à but lucratif",
        ar: "شبكة أو منظمة عضوية غير ربحية"
    },
    {
        id: "type_5",
        en: "Community-based organisation",
        sp: "Organización comunitaria",
        fr: "organisation communautaire ",
        ar: "منظمة غير حكومية أو مؤسسة خيرية غير ربحية"
    },
    
    {
        id: "other_please",
        en: "06. Other (please write below)",
        sp: "06. Otro (especificar a continuación)",
        fr: "06. Autres (veuillez préciser ci-dessous)",
        ar: "06. غير ذلك (نرجو التوضيح أدناه)"
      },
    {
        id: "secondary_focus",
        en: "What is your secondary focus area (chose most relevant)",
        sp: "¿Cuál es su área prioritaria secundaria? (Elija la más importante)",
        fr: "Quel est votre volet d'intervention secondaire (indiquer le plus pertinent)",
        ar: 'ما هو مجال تركيزكم الثانوي (اختر أدق وصف)'
    },
    {
        id: "p_1",
        en: "P1. Abortion Care",
        sp: "P1. Atención del aborto",
        fr: "P1. Soins d’avortement",
        ar: 'م1. رعاية الإجهاض'
    },
    {
        id: "p_2",
        en: "P1. General Contraception",
        sp: "P1. Anticoncepción general",
        fr: "P1. Contraception générale",
        ar: 'م1. وسائل منع الحمل العامة'
    },
    {
        id: "p_3",
        en: "P2. Incidencia y cambio de normas",
        sp: "P2. Incidencia y cambio de normas  ",
        fr: "P2. Plaidoyer et changement des normes",        
        ar: 'م2. المناصرة وتغيير المعايير'
    },
    {
        id: "p_4",
        en: "P1. Humanitarian SRHR",
        sp: "P1. SDSR humanitarios",
        fr: "P1. SDSR humanitaire",
        ar: 'م1. العمل الإنساني في الحقوق والصحة الجنسية والإنجابية'
    },
    {
        id: "p_5",
        en: "P2. Youth",
        sp: "P2. Juventud ",
        fr: "P2. Jeunesse ",
        ar: 'م2. الشباب '
    },
    {
        id: "p_6",
        en: "P1. HIV & AIDS",
        sp: "P1. VIH y SIDA",
        fr: "P1. VIH et sida",
        ar: 'م1. فيروس نقص المناعة البشري (HIV) والإيدز'
    },
    {
        id: "p_7",
        en: "P4. Marginalised Pops (incl. LGBTQ+)",
        sp: "P4. Poblaciones marginadas (incluyendo LGBTQ+)",
        fr: "P4. Populations marginalisées (y compris LGBTQ+)",
        ar: 'م4. الفئات المهمشة (بما في ذلك مجتمع الميم (الشواذ +LGBTQ))'
    },
    {
        id: "p_8",
        en: "P2. SGBV / Gender",
        sp: "P2. VSBG / Género",
        fr: "P2. VSBG / Genre",
        ar: "م2. العنف الجنسي والعنف القائم على النوع الاجتماعي / النوع الاجتماعي"
    },
     {
        id: "p_9",
        en: "P2. Communications & Campaigns",
        sp: "P2. Comunicaciones y campañas",
        fr: "P2. Communication et campagnes",
        ar: "م2. الاتصالات والحملات"
    },
    {
        id: "p_10",
        en: "P1. Fertility Care /Support",
        sp: "P1. Apoyo y atención de la fertilidad",
        fr: "P1. Soins/soutien relatifs à la fertilité",
        ar: "م1. دعم/رعاية الخصوبة"
    },
    {
        id: "p_11",
        en: "P3. Research / evidence",
        sp: "P3. Investigación / Pruebas",
        fr: "P3. Recherche / éléments de preuve",
        ar: "م3. البحوث / الأدلة"
    },
    {
        id: "p_12",
        en: "P4. Organisational Processes and Systems",
        sp: "P4. Sistemas y procesos organizativos",
        fr: "P4. Processus et systèmes de l’organisation",
        ar: "م4. الأنظمة والعمليات التنظيمية"
    },
    {
        id: "p_13",
        en: "P4. Commercial Sustainability",
        sp: "P4. Sostenibilidad comercial",
        fr: "P4. Pérennité commerciale",
        ar: 'م4. الاستدامة التجارية'

    },
    {
        id: "p_14",
        en: "P4. Social Enterprise & Marketing",
        sp: "P4. Empresa social y marketing",
        fr: "P4. Entreprise sociale et marketing",
        ar: "م4. المشاريع الاجتماعية والتسويق"

    },
    {
        id: "p_15",
        en: "Other (please fill in)",
        sp: "P5. Otro (completar)",
        fr: "P5. Autres (à préciser)",
        ar: 'م5. غير ذلك (نرجو التوضيح)'
    },
    {
        id: "p_16",
        en: "P5. Not applicable.",
        sp: "P5. No aplicable.",
        fr: "P5. Sans objet.",
        ar: 'م5. لا ينطبق.'
    },
    {
        id: "p_17",
        en: "P2. Advocacy & Norms Change",
        sp: "P2. Incidencia y cambio de normas",
        fr: "P2. Plaidoyer et changement des normes",
        ar: "م2. المناصرة وتغيير المعايير"
    },
    {
        id: "p_18",
        en: "P1. Digital Health Interventions & Selfcare",
        sp: "P1. Intervenciones de salud digital y autocuidado",
        fr: "P1. Interventions en santé numérique et soins personnels",
        ar: "م1. التدخلات الصحية الرقمية والرعاية الذاتية"
    },
    {
        id: "not_app",
        en: "Not applicable",
        sp: "No aplicable",
        fr: "Sans objet",
        ar: "لا ينطبق"
    },
    {
        id: "organisation_networks",
        en: "Does your organisation have a dedicated youth group or a youth network?",
        sp: "¿Tu organización cuenta con un grupo específico para jóvenes o una red juvenil?",
        fr: "Votre organisation dispose-t-elle d'un groupe dédié aux jeunes ou d'un réseau de jeune?",
        ar: "هل توجد في منظمتكم مجموعة شبابية مخصصة أو شبكة شبابية؟"
  },
  {
        id: "YES",
        en: "Yes",
        sp: "Sí",
        fr: "Oui",
        ar: 'نعم'
    }, 
    {
        id: "NO",
        en: "No",
        sp: "No",
        fr: "Non",
        ar: 'لا'
    },
    {
        id: "network_size",
        en: "If yes, how many youth volunteers do you have?",
        sp: "En caso afirmativo, ¿cuántos voluntarios jóvenes tiene?",
        fr: "Si oui, combien de jeunes volontaires comptez-vous ?",
        ar: 'إذا كانت الإجابة بنعم، كم عدد المتطوعين الشباب لديكم؟'
    },
    {
        id: "ma_branches",
        en: "Does your organisation have branches?",
        sp: "¿Tu organización tiene sucursales?",
        fr: "Votre organisation possède-t-elle des succursales ?",
        ar: 'هل تمتلك مؤسستكم فروعًا؟هل تمتلك مؤسستكم فروعًا؟'
    },
    {
        id: "number_of_branches",
        en: "If yes, number of branches",
        sp: "En caso afirmativo, número de sucursales",
        fr: "Si oui, nombre de succursales",
        ar: 'إذا كانت الإجابة بنعم، فاذكر عدد فروعها'
    },
     {
        id: "advocacy_priority1",
        en: "Advocacy priority 1 (choose most relevant)",
        sp: "Prioridad 1 de incidencia política (elija la más importante)",
        fr: "Priorité de plaidoyer 1 (indiquer la plus pertinente)",
        ar: 'أولوية الدعوة 1 (اختر أدق وصف)'
    },
    {
        id: "advocacy_priority2",
        en: "Advocacy priority 2 (choose most relevant)",
        sp: "Prioridad 2 de incidencia política (elija la más importante)",
        fr: "Priorité de plaidoyer 2 (indiquer la plus pertinente)",
        ar: 'أولوية الدعوة 2 (اختر أدق عبارة)'
    },
    {
        id: "select_any",
        en: "Select Any",
        sp: "Seleccionar cualquiera",
        fr: "Sélectionner n'importe lequel",
        ar: "اختر أيًّا"
        
    },
    
    {
        id: "advocacy_priority_1",
        en: "Access to contraception",
        sp: "Acceso a anticonceptivos",
        fr: "Accès à la contraception",
        ar: "الحصول على وسائل منع الحمل"
    },
    {
        id: "advocacy_priority_2",
        en: "Access to safe and legal abortion",
        sp: "Acceso al aborto legal y seguro",
        fr: "Accès à un avortement sans risque et légal",
        ar: "الوصول إلى الإجهاض الآمن والقانوني"
    },
    {
        id: "advocacy_priority_3",
        en: "Access to SRH services",
        sp: "Acceso a servicios de SSR",
        fr: "Accès à des services SSR",
        ar: "الحصول على خدمات الصحة الجنسية والإنجابية"
    },
    {
        id: "advocacy_priority_4",
        en: "Budget allocations for SRH, including contraception",
        sp: "Partidas presupuestarias para SSR, incluyendo anticoncepción",
        fr: "Dotations budgétaires pour la SSR, y compris la contraception",
        ar: "مخصصات الميزانية للصحة الجنسية والإنجابية، بما فيها وسائل منع الحمل"
    },
    {
        id: "advocacy_priority_5",
        en: "Sexuality Education for young people",
        sp: "Educación en sexualidad para jóvenes",
        fr: "Éducation à la sexualité pour les jeunes",
        ar: "التثقيف الجنسي للشباب"
    },
    {
        id: "advocacy_priority_6",
        en: "Access to services for young people",
        sp: "Acceso a servicios para jóvenes",
        fr: "Accès aux services pour les jeunes",
        ar: "الوصول إلى الخدمات المقدمة للشباب"
    },
    {
        id: "advocacy_priority_7",
        en: "Preventing sexual and gender-based violence",
        sp: "Prevención de la violencia sexual y basada en el género",
        fr: "Empêcher la violence sexuelle et la violence basée sur le genre",
        ar: "منع العنف الجنسي والعنف القائم على اختلاف النوع الاجتماعي"
    },
    {
        id: "advocacy_priority_8",
        en: "Prioritizing SRH in crisis settings",
        sp: "Priorización de SSR en situaciones de emergencia",
        fr: "Priorité donnée à la SSR dans des situations de crise",
        ar: "إعطاء الأولوية للصحة الجنسية والإنجابية في إطار الأزمات الإنسانية"
    },
    {
        id: "advocacy_priority_9",
        en: "Promoting gender equality",
        sp: "Promoción de la igualdad de género",
        fr: "Promotion de l’égalité de genre",
        ar: "تعزيز المساواة بين الجنسين"
    },
    {
        id: "advocacy_priority_10",
        en: "Promoting sexual and gender diversity",
        sp: "Promoción de la diversidad sexual y de género",
        fr: "Promotion de la diversité sexuelle et du genre",
        ar: "تعزيز التنوع الجنسي والتنوع بين الجنسين"
    },
    {
        id: "advocacy_priority_11",
        en: "Promoting sexual and reproductive rights",
        sp: "Promoción de los derechos sexuales y reproductivos",
        fr: "Promotion des droits sexuels et reproductifs",
        ar: "تعزيز الحقوق الجنسية والإنجابية"
    },
    {
        id: "advocacy_priority_12",
        en: "Support for people living with HIV",
        sp: "Apoyo a personas que viven con VIH",
        fr: "Soutien aux personnes vivant avec le VIH",
        ar: "دعم المتعايشين مع فيروس نقص المناعة البشري (HIV)"
    },
    {
        id: "advocacy_priority_13",
        en: "Diversifying SRH service delivery models (self care/ telehealth, other person centred model)",
        sp: "Diversificación de modelos de prestación de servicios de SSR (autoatención / telesalud, otros modelos centrados en la persona) ",
        fr: "Diversification des modèles de prestation de services de SSR (soins autoadministrés/ télésanté, autre modèle centré sur la personne)",
        ar: "تنويع نماذج تقديم خدمات الصحة الجنسية والإنجابية (الرعاية الذاتية/ الصحة عن بعد، النموذج الذي يركز على شخص آخر) "
    },
    {
        id: "advocacy_priority_14",
        en: "SRH Interventions included in Essential Health Care Package",
        sp: "Intervenciones de SSR incluidas en el paquete de atención sanitaria básica",
        fr: "Interventions de SSR incluses dans le paquet de soins de santé essentiels",
        ar: "تدخلات الصحة الجنسية والإنجابية المدرجة في حزمة الرعاية الصحية الأساسية"
    },
    {
        id: "advocacy_priority_15",
        en: "Universal Health Care Coverage",
        sp: "Cobertura de atención sanitaria universal",
        fr: "Couverture sanitaire universelle",
        ar: "تغطية الرعاية الصحية الشاملة"
    },
    {
        id: "commoduties_received",
        en: "In this year will your MA receive (donated) commodities from (choose all that apply):",
        sp: "Este año, su AM recibirá productos (donados) de (elija todas las opciones que correspondan):",
        fr: "Au cours de cette année, votre association recevra-t-elle des produits (reçus en dons) de (veuillez cocher toutes les cases correspondantes) :",
        ar: "في هذا العام، هل ستتلقى منظمتكم مساعدات (تبرعات) عينية من (اختر كل ما ينطبق):"
    },
    {
        id: "commudites_amount",
        en: "What is the total value of commodities in USD you plan to access in this year from:",
        sp: "¿Cuál es el valor total en USD de productos a los que planea acceder este año provenientes de:",
        fr: "Quel est le montant total en USD des produits que vous comptez obtenir auprès de :",
        ar: "ما هي القيمة الإجمالية للمواد العينية (بالدولار الأمريكي) التي تخطط للحصول عليها هذا العام من:"
    },
    {
        id: "ippf",
        en: "IPPF (see 3.4)",
        sp: "la IPPF? (Ver 3.4)",
        fr: "IPPF (voir 3.4)",
        ar:  "الاتحاد الدولي لتنظيم الاسرة (انظر 3.4)"
    },
    {
        id: "ministry_health",
        en: "Ministry of Health (upload MoU)",
        sp: "el Ministerio de Salud? (Subir memorando de entendimiento)",
        fr: "Ministère de la Santé (télécharger le protocole d’accord)",
        ar:  "وزارة الصحة ( الرجاء تحميل مذكرة التفاهم)"
    },
    {
        id: "unfpa_supplies",
        en: "UNFPA Supplies (upload IP Agreement)",
        sp: "Suministros de UNFPA (cargar acuerdo con socio implementador)",
        fr: "UNFPA Supplies (télécharger l’accord de partenaire de mise en œuvre)",
        ar: "إمدادات صندوق الأمم المتحدة للسكان (تحميل اتفاقية الشراكة التنفيذية)"
    },
    {
        id: "local_procurement",
        en: "Local Procurement",
        sp: "adquisición local",
        fr: "Approvisionnement local",
        ar: "المشتريات المحلية"
    },
    {
        id: "key_document",
        en: "Key Documents",
        sp: "Documentos principales",
        fr: "Documents clés",
        ar: 'الوثائق الرئيسية'
    },
    {
        id: "key_strategy",
        en: "Please upload you current strategy document",
        sp: "Por favor, sube tu documento de estrategia actual",
        fr: "Veuillez télécharger votre document stratégique actuel",
        ar: "يرجى تحميل وثيقة الاستراتيجية الحالية الخاصة بكم"
    },
    {
        id: "key_annual",
        en: "Please upload the latest audit report in PDF (if not alredy uploaded)",
        sp: "Por favor, sube el último informe de auditoría en formato PDF (si aún no lo has subido)",
        fr: "Veuillez télécharger le dernier rapport d'audit au format PDF (s'il n'a pas encore été téléchargé)",
        ar: "يرجى تحميل أحدث تقرير تدقيق بصيغة PDF (إن لم يكن قد تم تحميله بالفعل)"
    },
    {
        id: "key_audits",
        en: "Please upload your latest annual organisational report (if not already uploaded)",
        sp: "Por favor, sube tu último informe anual de la organización (si aún no lo has subido).",
        fr: "Veuillez télécharger votre dernier rapport annuel d'activité (s'il n'a pas encore été téléchargé).",
        ar: "يرجى تحميل أحدث تقرير سنوي لمنظمتكم (إن لم يكن قد تم تحميله بالفعل)"
    },
    {
        id: "memorandum_understanding_upload",
        en: "Please upload valid Memorandum of Understanding with your Government, if in place and available",
        sp: "Por favor, cargue un Memorando de Entendimiento válido con su Gobierno, si existe y está disponible.",
        fr: "Veuillez télécharger un protocole d’accord valide avec votre gouvernement, s’il existe et est disponible.",
        ar: "يرجى رفع مذكرة التفاهم السارية مع حكومتكم، إذا كانت موجودة ومُتاحة."
    },
    {
        id: "partner_agreement_upload",
        en: "Please upload valid Implementing Partner Agreement with UNFPA (Supplies), if in place and available",
        sp: "Por favor, cargue un Acuerdo de Socio Implementador válido con el UNFPA (Suministros), si existe y está disponible.",
        fr: "Veuillez télécharger un accord valide de partenaire d’exécution avec l’UNFPA (Fournitures), s’il existe et est disponible.",
        ar: "يرجى رفع اتفاقية الشراكة التنفيذية السارية مع صندوق الأمم المتحدة للسكان (للإمدادات)، إذا كانت موجودة ومُتاحة."
    },
    {
        id: "other1",
        en: "Other 1",
        sp: "Otro 1",
        fr: "Autre 1",
        ar: "غير ذلك 1"
    },
    {
        id: "other1(Res Report)",
        en: "Other 1 (e.g. research report, organisational plan, publications, or similar)",
        sp: "Otro 1 (p. ej., informe de investigación, plan organizativo, publicaciones o similar)",
        fr: "Autre 1 (par exemple : rapport de recherche, organigramme, publications ou autres documents similaires)",
        ar: "أخرى 1 (مثل: تقرير بحثي، أو خطة تنظيمية، أو منشورات، أو ما شابه)"
    },
    {
        id: "other2",
        en: "Other 2",
        sp: "Otro 2",
        fr: "Autre 2",
        ar: "آخر 2"
    },
    {
        id: "other2_(Res report, org Plan)",
        en: "Other 2 (e.g. research report, organisational plan, publications, or similar)",
        sp: "Autre 2 (par exemple : rapport de recherche, organigramme, publications ou autres documents similaires)",
        fr: "Otro 2 (p. ej., informe de investigación, plan organizativo, publicaciones o similar)",
        ar: "أخرى 2 (مثل: تقرير بحثي، أو خطة تنظيمية، أو منشورات، أو ما شابه)"
    },
     //Narrative Plan
    {
        id: "country_context",
        en: "Strategic Context and Results",
        sp: "Contexto nacional y teoría del cambio",
        fr: "Contexte national et théorie du changement",
        ar: 'سياق الدولة ونظرية التغيير'
    },
    {
        id: "country_context_ques",
        en: "Ques 1. Country context",
        sp: "1. Contexto nacional",
        fr: "1. Contexte du pays",
        ar: 'السؤال الاول : سياق الدولة'
    },
    // 
    {
        id: "country_context_ques_description",
        en: "Please describe your country context as relevant to SRHR. What are the main SRHR gaps and social or political factors that should be addressed in the remainder of the IPPF strategic period (e.g., unmet need, service gaps, political environment, laws, policies, social norms, national health/education programmes and innovations, opposition, etc.). Please use updated and verified statistics where possible, and mention marginalized groups as relevant (500 words max)",
        fr: "Veuillez décrire le contexte de votre pays en matière de SDSR. Quelles sont les principales lacunes en matière de SDSR et les facteurs sociaux ou politiques à prendre en compte d'ici la fin de la période stratégique de l'IPPF (par exemple, besoins non satisfaits, lacunes dans les services, environnement politique, lois, politiques, normes sociales, programmes et innovations nationaux en matière de santé et d'éducation, opposition, etc.) ? Veuillez utiliser des statistiques actualisées et vérifiées dans la mesure du possible, et mentionner les groupes marginalisés si nécessaire (500 mots maximum).",
        sp: "Describa el contexto de su país en relación con la salud y los derechos sexuales y reproductivos. ¿Cuáles son las principales brechas en salud y los factores sociales o políticos que deberían abordarse en lo que resta del período estratégico del IPPF (por ejemplo, necesidades insatisfechas, deficiencias en los servicios, entorno político, leyes, políticas, normas sociales, programas e innovaciones nacionales de salud y educación, oposición, etc.)? Utilice estadísticas actualizadas y verificadas siempre que sea posible, y mencione a los grupos marginados según corresponda (máximo 500 palabras).",
        ar: "نرجو توضيح الوضع في بلدكم فيما يتعلق بالحقوق والصحة الجنسية والإنجابية. ما هي الثغرات الرئيسية في مجال الحقوق والصحة الجنسية والإنجابية والعوامل الاجتماعية أو السياسية التي ينبغي معالجتها في الفترة الاستراتيجية المتبقية للاتحاد الدولي لتنظيم الأسرة (على سبيل المثال، الاحتياجات غير الملباة، فجوات الخدمة، البيئة السياسية، القوانين، السياسات، الأعراف الاجتماعية، الابتكارات والبرامج الصحية/التعليمية الوطنية، المعارضة، إلخ). نرجو الاستناد إلى إحصاءات حديثة ومُوثّقة، كلما أمكن، مع ذكر الفئات المهمّشة ذات الصلة (بحد أقصى 500 كلمة)"
    },
    {
        id: "smart_outcomes_planned",
        en: "SMART Outcomes Planned",
        fr: "Resultados SMART previstos",
        sp: "Résultats SMART prévus",
        ar: "النتائج المخطط تحقيقها في إطار مبادرة SMART"
    },
    {
        id: "smart_outcomes_achieved",
        en: "Achievements To Date",
        fr: "Logros hasta la fecha",
        sp: "Réalisations à ce jour",
        ar: "الإنجازات المحققة حتى الآن"
    },
    {
        id: "strategy",
        en: "Ques 2. Strategic Actions",
        sp: "2. : Acciones estratégicas",
        fr: "Ques 2. Mesures stratégiques",
        ar:'الإجراءات الاستراتيجية'
    },
    {
        id: "des_curr_high_level",
        en: "Describe the strategic action that you will take to address the challenges that you have identified in the section above (Country Context). Please describe the type of activities that will be required to bring about the desired change. (Please also consider how these relate to your long-term SMART outcomes listed below).",
        sp: "Describe las medidas estratégicas que vas a adoptar para abordar los retos que has identificado en la sección anterior (Contexto del país). Describe el tipo de actividades que serán necesarias para lograr el cambio deseado. (Ten en cuenta también cómo se relacionan estas con tus resultados SMART a largo plazo que se enumeran a continuación).",
        fr: "Décrivez les mesures stratégiques que vous comptez mettre en œuvre pour relever les défis que vous avez identifiés dans la section ci-dessus (Contexte national). Veuillez décrire le type d’activités qui seront nécessaires pour aboutir au changement souhaité. (Veuillez également indiquer en quoi celles-ci s’inscrivent dans le cadre de vos résultats SMART à long terme énumérés ci-dessous).",
        ar: 'صف الإجراءات الاستراتيجية التي ستتخذها لمواجهة التحديات التي حددتها في القسم أعلاه (السياق القطري). يرجى وصف نوع الأنشطة التي ستكون مطلوبة لإحداث التغيير المنشود. (يرجى أيضًا النظر في كيفية ارتباط هذه الأنشطة بنتائجك طويلة الأجل وفقًا لمعايير SMART المذكورة أدناه).'
    },
    {
        id: "outline_how_align_with_ippf",
        en: "Please outline how it aligns with IPPF’s strategic framework. If there are specific target groups you aim to serve, please mention them here. Please highlight any new approaches and how they differ from your past business plans or approaches.",
        sp: "Explique brevemente de qué forma se alinean con el marco estratégico de la IPPF. Si hay grupos objetivo específicos a los que quieren prestar servicios, menciónelos aquí. Destaque cualquier enfoque nuevo y explique en qué difiere de los enfoques o planes de negocios anteriores.",
        fr: "Veuillez expliquer dans ses grandes lignes comment elle s’inscrit dans le cadre stratégique de l’IPPF. S’il y a des groupes spécifiques que vous souhaitez cibler avec vos services, veuillez les indiquer ici. Veuillez mettre en évidence les éventuelles approches nouvelles que vous adoptez et en quoi elles diffèrent de vos approches ou de vos plans d’activité passés.",
        ar: "نرجو تحديد أوجه التوافق بينها وبين إطار اتحاد IPPF الاستراتيجي. وإن كان لديكم مجموعات مستهدفة محددة تهدفون إلى خدمتها، نرجو ذكرها هنا. نرجو إيضاح النُهج الجديدة وأوجه الاختلاف بينها وبين نُهج أو خطط عملكم السابقة."

    },
    {
        id: "other_actors",
        en: "Ques 3. Landscape of other actors",
        sp: "3.Panorama de otros actores",
        fr: "Ques 3.Paysage des autres acteur",
        ar: '3. المشهد المحيط بالجهات الفاعلة الأخرى'
    },
    {
        id: "other_actors_first",
        en: "Who are the other key actors in your country (and region if applicable) working to advance SRHR (e.g. civil society, social movements, government ministries, parliamentarians, private sector, etc.)?",
        sp: "¿Cuáles son los otros actores clave en su país (y región, si es pertinente) que trabajan para promover la SDSR (por ejemplo, sociedad civil, movimientos sociales, ministerios del gobierno, parlamentarios, sector privado, etc.)?",
        fr: "Qui sont les autres acteurs clés de votre pays (et de votre région, le cas échéant) qui œuvrent pour faire progresser la SDSR (par exemple, issus de la société civile, des mouvements sociaux, des ministères, des parlementaires, le secteur privé, etc.) ?",
        ar: "من هم الأطراف الفاعلون الرئيسيون الآخرون في بلدكم (والإقليم إن وُجد) الذين يعملون للنهوض بالحقوق والصحة الجنسية والإنجابية (مثل المجتمع المدني، والحركات الاجتماعية، والوزارات الحكومية، والبرلمانيون، والقطاع الخاص، وما إلى ذلك)؟"     
    },
    {
        id: "other_actors_second",
        en: "How does your organization partner with them, and how do you operationalize those partnerships? Do you have partnerships outside of the SRHR sector?",
        sp: "¿Qué alianzas tiene su organización con esos otros actores y cómo las ponen en práctica? ¿Tienen alianzas fuera del sector de la SDSR?",
        fr: "Quels partenariats votre organisation a-t-elle établis avec eux et comment les portez-vous à exécution ? Avez-vous conclu des partenariats en dehors du secteur de la SDSR ?",
        ar: "هل توجد شراكات بينهم وبين منظمتكم، وكيف تُفعّلون هذه الشراكات؟ هل لديكم شراكات في قطاعات غير قطاع الحقوق والصحة الجنسية والإنجابية؟"
    },
    {
        id: "external_risks",
        en: "Ques 4. External risks and risk mitigation ",
        sp: "4. Riesgos externos y mitigación de riesgos ",
        fr: "Ques 4. 4. Risques externes et atténuation des risques ",
        ar: '4. المخاطر الخارجية وتخفيف المخاطر '
    },
    {
        id: "external_risks_description",
        en: "Within a three-year perspective, describe critical external risks and challenges related to the delivery of your Business Plan (e.g., political, economic), and your efforts to address/mitigate them.",
        sp: "Con una perspectiva de tres años, describa los desafíos y riesgos externos críticos relacionados con la ejecución de su Plan de negocio (p. ej., políticos, económicos) y sus esfuerzos para abordarlos o mitigarlos.",
        fr: "À un horizon sur trois ans, décrivez les risques et les problèmes externes critiques liés à la réalisation de votre plan d’activité (par ex., d’ordre politique, économique), et vos efforts pour y remédier/les atténuer.",
        ar: "من منظور يمتد لثلاث سنوات، وضح المخاطر والتحديات الخارجية بالغة الأهمية التي تواجهكم في تنفيذ خطة عملكم (على سبيل المثال، السياسية والاقتصادية)، والجهود التي تبذلونها للتغلب عليها/تخفيفها."
    },
    {
        id: "other",
        en: "Other",
        sp: "Otro",
        fr: "Autre",
        ar: "غير ذلك "
    },
    // created by MN with sheet translation
    {
        id: "youth_leadership",
        en: "Ques 5. SMART Outcomes",
        sp: "5. Resultados SMART",
        fr: "5. Résultats SMART",
        ar: "5. نتائج واضحة وقابلة للقياس ويمكن تحقيقها ووثيقة الصلة ومحددة بوقت (SMART)"
    },
    {
        id: "describe_youth_leadership_para1",
        en: "SMART: Specific, Measurable, Achievable, Relevant, and Time-bound Outcomes",
        sp: "SMART: Resultados específicos, medibles, alcanzables, relevantes y con plazos determinados",
        fr: "Résultats SMART : spécifiques, mesurables, atteignables, réalistes et limités dans le temps",
        ar: "SMART: واضحة وقابلة للقياس ويمكن تحقيقها ووثيقة الصلة ومحددة بوقت"
    },
    {
        id: "start_pillar_1",
        en: "For example: IPPF Strat Pillar 1: By December 2026, rolled out at least three national Digital Health Interventions in four national regions.",
        sp: "Por ejemplo: IPPF Start Pilar 1: Para diciembre de 2026, implementar al menos tres intervenciones nacionales de salud digital en cuatro regiones nacionales.",
        fr: "Par exemple : IPPF Start Pilier 1 : D’ici décembre 2026, déployer au moins trois interventions nationales de santé numérique dans quatre régions nationales.",
        ar: "الركيزة الاستراتيجية الأولى للاتحاد الدولي لتنظيم الأسرة (IPPF): بحلول ديسمبر 2026، يتم تنفيذ ما لا يقل عن ثلاث تدخلات رقمية صحية وطنية في أربع مناطق وطنية."
    },
    {
        id: "youth_involvement",
        en: "Ques 6. Youth Leadership and Involvement",
        sp: "6. Liderazgo y participación juvenil",
        fr: "6. Leadership des jeunes et participation des jeunes ",
        ar: "6. قيادة الشباب ومشاركتهم "
    },
    // created by MN 
    {
        id: "describe_youth_Leadership",
        en: "Describe the process followed to ensure youth decided 5% of your core funding.",
        sp: "Describa el proceso seguido para garantizar que la juventud decida sobre el 5 % del financiamiento básico.",
        fr: "Décrivez la démarche que vous avez adoptée pour faire en sorte que les jeunes décident de 5 % de votre financement de base.",
        ar: "وضح الإجراءات التي تلتزمون بها لضمان حصول الشباب على 5٪ من تمويلكم الأساسي."
    },
    {
        id: "organisational_status",
        en: "Organisational status",
        sp: "Situación de la organización",
        fr: "Statut de l’organisation",
        ar: 'الوضع التنظيمي'
    },
    {
        id: "challenges_opportunities",
        en: "Challenges and opportunities",
        sp: "Desafíos y oportunidades",
        fr: "Défis et opportunités",
        ar: 'التحديات والفرص '
    },
    {
        id: "challenges",
        en: "Challenges",
        sp: "Desafíos",
        fr: "Problèmes",
        ar: 'التحديات'
    },
    {
        id: "opportunities",
        en: "Opportunities",
        sp: "Oportunidades",
        fr: "Opportunités",
        ar: "الفرص"
    },
    {
        id: "institutional",
        en: "Institutional",
        sp: "Institucionales",
        fr: "Institutionnel",
        ar: "المؤسسية"
    },
    {
        id: "institutional_challenges_description",
        en: "For example: governance, leadership, staff, systems, etc",
        sp: "Por ejemplo: gobernanza, liderazgo, personal, sistemas, etc.",
        fr: "Par exemple : gouvernance, leadership, personnel, systèmes, etc.",
        ar: 'مثل الحوكمة، والقيادة، والموظفين، والأنظمة، وما إلى ذلك.'
    },
    // created by MN 
    {
        id: "operational",
        en: "Operational",
        sp: "Operativos",
        fr: "Opérationnel",
        ar: "التشغيلية"
    },
    {
        id: "operational_challenges_description",
        en: "For example: administration, logistics, supply chain, demand, etc.",
        sp: "Por ejemplo: administración, logística, cadena de suministro, demanda, etc.",
        fr: "Par exemple : administration, logistique, chaîne d'approvisionnement, demande, etc.",
        ar: "على سبيل المثال: الإدارة، اللوجستيات، سلسلة الإمداد، الطلب، إلخ."
    },
    // created by MN 
    {
        id: "programmatic",
        en: "Programmatic",
        sp: "Programáticos",
        fr: "Programmatique",
        ar: 'البرامجية ',
    },
    // created by MN 
    {
        id: "programmatic_example",
        en: "For example: delivery capacity, M&E, quality of care, client interest",
        sp: "Por ejemplo: capacidad de prestación de servicios; monitoreo y evaluación, calidad de la atención, interés de los usuarios",
        fr: "Par exemple : capacité de prestation, suivi-évaluation, qualité des soins, intérêt du client",
        ar: "مثل القدرة على التنفيذ، والرصد والتقييم، وجودة الرعاية، واهتمام المستفيدين"
    },
    {
        id: "financial",
        en: "Financial",
        sp: "Financieros",
        fr: "Financier",
        ar: "المالية"
    },
    {
        id: "financial_challenges_description",
        en: "For example: audits, management letters, capacity, systems, etc.",
        sp: "Por ejemplo: auditorías, cartas de gestión, capacidad, sistemas, etc.",
        fr: "Par exemple : audits, lettres de gestion, capacité, systèmes, etc.",
        ar: 'مثل عمليات التدقيق، وخطابات الإدارة، والإمكانات، والأنظمة، وما إلى ذلك.'
    },
     {
        id: "sustainability_challenges",
        en: "Sustainability challenges",
        sp: "Desafíos de sostenibilidad",
        fr: "Difficultés en matière de durabilité ",
        ar: "تحديات الاستدامة "
    },
    {
        id: "sustainability_challenges_description",
        en: "For example: income diversification, social enterprise, domestic financing, etc.",
        sp: "Por ejemplo: diversificación de ingresos, empresa social, financiamiento nacional, etc.",
        fr: "Par exemple : diversification des recettes, entreprise sociale, financement national, etc.",
        ar: 'مثل تنويع الدخل، والمشاريع الاجتماعية، والتمويل المحلي، وما إلى ذلك.'
    },
    // created 
    {
        id: "technical_assistance_heading",
        en: "Choose as many as relevant with number 1 being the top priority/area of expertise and 5 being the lowest.",
        sp: "Elija todas las opciones que sean relevantes y enumere del 1 al 5 en orden decreciente, con el número 1 como principal prioridad / área de experiencia.",
        fr: "Indiquez-en le plus grand nombre possible, 1 correspondant à une priorité absolue/domaine d’expertise et 5 au niveau le plus bas.",
        ar: "اختر أكبر عدد ممكن من الخيارات ذات الصلة، بحيث يكون الرقم 1 هو الأولوية/مجال الخبرة الأعلى، والرقم 5 هو الأقل."
    },
    {
        id: "technical_assistance_dropdown_left",
        en: "Main Technical Assistance / Capacity (our organisational needs)",
        sp: "Asistencia técnica principal / Capacidad (nuestras necesidades organizativas)",
        fr: "Assistance/capacité technique principale (les besoins de notre organisation)",
        ar: 'المساعدة الفنية الرئيسية / الإمكانات (احتياجات منظمتنا)'
    },
    {
        id: "technical_assistance_dropdown_right",
        en: "Organisational Areas of Expertise / Capacity (we can share tools & train others)",
        sp: "Áreas de experiencia/capacidad organizativa (podemos compartir herramientas y capacitar a otros)",
        fr: "Domaines d’expertise/capacité de l’organisation (nous pouvons partager des outils et former d’autres personnes)",
        ar: 'الإمكانات / مجالات الخبرة التنظيمية (يمكننا مشاركة الأدوات وتدريب الآخرين)'   
    },
    // Project Description
    
    {
        id: "total_projects",
        en: "Total projects",
        sp: "Número total de proyectos",
        fr: "Nombre total de projets",
        ar: 'إجمالي عدد المشاريع'
    },
    {
        id: "project_name",
        en: "Project Name",
        sp: "Nombre del proyecto",
        fr: "Nom du projet",
        ar: 'اسم المشروع'
    },
    {
        id: "project_donor",
        en: "Project Donor:",
        sp: "Donante del proyecto:",
        fr: "Bailleur de fonds du projet :",
        ar: "الجهة المانحة للمشروع:"
    },
    {
        id: "annual_proj_income",
        en: "Annual Project Income",
        sp: "Ingreso anual del proyecto",
        fr: "Recettes annuelles du projet",
        ar: "الدخل السنوي للمشروع"
    },
    {
        id: "funding_type",
        en: "Funding Type:",
        sp: "Tipo de financiamiento:",
        fr: "Type de financement :",
        ar: "نوع التمويل:"
    },
    {
        id: "total_contract_value",
        en: "Total Project Lifetime Value",
        sp: "Valor total del contrato",
        fr: "Valeur totale du contrat",
        ar: "القيمة الإجمالية للعقد"
    },
    {
        id: "start_date",
        en: "Start Date:",
        sp: "Fecha de inicio:",
        fr: "Date de début :",
        ar: "تاريخ البدء:"
    },
    {
        id: "end_date",
        en: "End Date:",
        sp: "Fecha de finalización:",
        fr: "Date de fin :",
        ar: 'تاريخ الانتهاء:'
    },
    {
        id: "project_theme",
        en: "Project Theme",
        sp: "Tema del proyecto:",
        fr: "Thématique du projet :",
        ar: "موضوع المشروع:"
    },
    {
        id: "g_aus",
        en: "01. Government of Australia / DFAT",
        sp: "01. Gobierno de Australia / DFAT",
        fr: "01. Gouvernement de l’Australie / DFAT",
        ar: "01. حكومة أستراليا / وزارة الشؤون الخارجية والتجارة الأسترالية (DFAT)",
    },
    {
        id: "g_can",
        en: "01. Government of Canada / GAC",
        sp: "01. Gobierno de Canadá / GAC",
        fr: "01. Gouvernement du Canada / GAC",
        ar: "01. حكومة كندا / وزارة الشؤون العالمية الكندية (GAC)",
    },
    {
        id: "g_ch",
        en: "01. Government of China",
        sp: "01. Gobierno de China",
        fr: "01. Gouvernement de la Chine",
        ar: "01. حكومة الصين",
    },
    {
        id: "g_den",
        en: "01. Government of Denmark / DANIDA",
        sp: "01. Gobierno de Dinamarca / DANIDA",
        fr: "01. Gouvernement du Danemark / DANIDA",
        ar: "01. حكومة الدنمارك / الوكالة الدنماركية للتنمية الدولية (DANIDA)",
    },
    {
        id: "g_fin",
        en: "01. Government of Finland / FINNIDA",
        sp: "01. Gobierno de Finlandia / FINNIDA",
        fr: "01. Gouvernement de la Finlande / FINNIDA",
        ar: "01. حكومة فنلندا / الوكالة الفنلندية للتنمية الدولية (FINNIDA)",
    },
    {
        id: "g_fran",
        en: "01. Government of France / Agence Française de Développement",
        sp: "01. Gobierno de Francia / Agence Française de Développement",
        fr: "01. Gouvernement de la France / Agence Française de Développement",
        ar: "01. حكومة فرنسا / الوكالة الفرنسية للتنمية",
    },
    {
        id: "g_ger",
        en: "01. Government of Germany / GIZ",
        sp: "01. Gobierno de Alemania / GIZ",
        fr: "01. Gouvernement de l’Allemagne / GIZ",
        ar: "01. حكومة ألمانيا / الجمعية الألمانية للتعاون الدولي (GIZ)",
    },
    {
        id: "g_jap",
        en: "01. Government of Japan / Ministry of Foreign Affairs Japan",
        sp: "01. Gobierno de Japón / Ministerio de Asuntos Exteriores de Japón",
        fr: "01. Gouvernement du Japon / Ministère japonais des Affaires étrangères",
        ar: "01. حكومة اليابان / وزارة الخارجية اليابانية",
    },
    {
        id: "g_new",
        en: "01. Government of New Zealand / MFAT ",
        sp: "01. Gobierno de Nueva Zelanda / MFAT ",
        fr: "01. Gouvernement de la Nouvelle-Zélande / MFAT",
        ar: "01. حكومة نيوزيلندا / وزارة الخارجية والتجارة النيوزيلندية (MFAT)",
    },
    {
        id: "g_nor",
        en: "01. Government of Norway / NORAD ",
        sp: "01. Gobierno de Noruega / NORAD ",
        fr: "01. Gouvernement de la Norvège / NORAD ",
        ar: "01. حكومة النرويج / الوكالة النرويجية للتعاون الإنمائي (NORAD)",
    },
    {
        id: "g_spain",
        en: "01. Government of Spain / AECID",
        sp: "01. Gobierno de España / AECID",
        fr: "01. Gouvernement de l’Espagne / AECID",
        ar: "01. حكومة إسبانيا / الوكالة الإسبانية للتعاون الإنمائي الدولي (AECID)",
    },
    {
        id: "g_uk",
        en: "01. Government of United Kingdom / FCDO",
        sp: "01. Gobierno del Reino Unido / FCDO",
        fr: "01. Gouvernement du Royaume-Uni / FCDO",
        ar: "01. حكومة المملكة المتحدة / وزارة الخارجية وشؤون الكومنولث والتنمية (FCDO)",
    },
    {
        id: "g_eu_comm",
        en: "02. European Commission (EU/EC)",
        sp: "02. Comisión Europea",
        fr: "02. Commission européenne (UE/CE)",
        ar: "02. المفوضية الأوروبية (الاتحاد الأوروبي/الجماعة الأوروبية)",
    },
    {
        id: "gl_fund_aids",
        en: "02. Global Fund for AIDS,  Tuberculosis, and Malaria (GFATM)",
        sp: "02. Fondo Mundial de Lucha contra el SIDA, la Tuberculosis y la Malaria (GFATM)",
        fr: "02. Fonds mondial de lutte contre le sida, la tuberculose et le paludisme (Le Fonds mondial)",
        ar: "02. الصندوق العالمي لمكافحة الإيدز والسل والملاريا (GFATM)",
    },
    {
        id: "rep_health",
        en: "02. Reproductive Health Supplies Coalition (RHSC)",
        sp: "02. Reproductive Health Supplies Coalition (RHSC)",
        fr: "02. Coalition pour la fourniture de produits de santé reproductive (RHSC)",
        ar: "02. ائتلاف إمدادات الصحة الإنجابية (RHSC)",
    },
    {
        id: "unaids",
        en: "02. UNAIDS",
        sp: "02. ONUSIDA",
        fr: "02. ONUSIDA",
        ar: "02. برنامج الأمم المتحدة المشترك لفيروس نقص المناعة البشري (HIV)/الإيدز",
    },
    {
        id: "undp",
        en: "02. UNDP",
        sp: "02. PNUD",
        fr: "02. PNUD",
        ar: "02. برنامج الأمم المتحدة الإنمائي (UNDP)",
    },
    {
        id: "unesco",
        en: "02. UNESCO",
        sp: "02. UNESCO",
        fr: "02. UNESCO",
        ar: "02. اليونسكو",
    },
    {
        id: "unfpa",
        en: "02. UNFPA",
        sp: "02. UNFPA",
        fr: "02. UNFPA",
        ar: "02. صندوق الأمم المتحدة للسكان (UNFPA)",
    },
    {
        id: "unicef",
        en: "02. UNICEF",
        sp: "02. UNICEF",
        fr: "02. UNICEF",
        ar: "02. اليونيسف",
    },
    {
        id: "who",
        en: "02. World Health Organisation (WHO)",
        sp: "02. Organización Mundial de la Salud (OMS)",
        fr: "02. Organisation mondiale de la Santé (OMS)",
        ar: "02. منظمة الصحة العالمية",
    },
    {
        id: "amp_ch",
        en: "03. Amplify Change",
        sp: "03. Amplify Change",
        fr: "03. Amplify Change",
        ar: "03. إعلاء التغيير",
    },
    {
        id: "bill_melinda",
        en: "03. Bill & Melinda Gates Foundation",
        sp: "03. Bill & Melinda Gates Foundation",
        fr: "03. Bill & Melinda Gates Foundation",
        ar: "03. مؤسسة بيل وميليندا غيتس",
    },
    {
        id: "osf",
        en: "03. Open Society Foundations (OSF)",
        sp: "03. Open Society Foundations (OSF)",
        fr: "03. Open Society Foundations (OSF)",
        ar: "03. مؤسسات المجتمع المنفتح (OSF)"
    },
    {
        id: "th_william_fl_found",
        en: "03. The William and Flora Hewlett Foundation",
        sp: "03. The William and Flora Hewlett Foundation",
        fr: "03. The William and Flora Hewlett Foundation",
        ar: "03. مؤسسة ويليام وفلورا هيوليت "
    },
    {
        id: "danish_fpa",
        en: "04. Danish FPA / Sex og Samfund (Denmark)",
        sp: "04. Asociación de Planificación Familiar Danesa / Sex og Samfund (Dinamarca)",
        fr: "04. Danish FPA / Sex og Samfund (Danemark)",
        ar: "04. الجمعية الدنماركية لتنظيم الأسرة (FPA)/ جمعية Sex og Samfund (الدنمارك)"
    },
    {
        id: "usaid",
        en: "05. USAID",
        sp: "05. USAID",
        fr: "05. USAID",
        ar: "05. الوكالة الأمريكية للتنمية الدولية (USAID)"
    },
    {
        id: "center_dis_cont",
        en: "05. Center for Disease Control (CDC)",
        sp: "05. Centros para el Control y la Prevención de Enfermedades (CDC)",
        fr: "05. Centre pour le contrôle et la prévention des maladies (CDC)",
        ar: "05. مركز مكافحة الأمراض (CDC)"
    },
    {
        id: "rutgers",
        en: "04. Rutgers (Netherlands)",
        sp: "04. Rutgers (Países Bajos)",
        fr: "04. Rutgers (Pays-Bas)",
        ar: "04. منظمة Rutgers (هولندا)"
    },
    {
        id: "rfsu_sweden",
        en: "04. RFSU (Sweden)",
        sp: "04. RFSU (Suecia)",
        fr: "04. RFSU (Suède)",
        ar: "04. جمعية RFSU (السويد)"
    },
    {
        id: "planned_parenthood_fed_usa",
        en: "04. Planned Parenthood Federation of America (USA)",
        sp: "04. Federación de Planificación Familiar de los Estados Unidos (EE. UU.)",
        fr: "04. Planned Parenthood Federation of America (USA)",
        ar: "04. اتحاد أمريكا لتنظيم الأسرة (الولايات المتحدة الأمريكية)"
    },
    {
        id: "int_plan_parenth_fed",
        en: "04. International Planned Parenthood Federation (IPPF)",
        sp: "04. Federación Internacional de Planificación Familiar (IPPF)",
        fr: "04. Fédération internationale pour la planification familiale (IPPF)",
        ar: "04. الاتحاد الدولي لتنظيم الأسرة (IPPF)",
    },
    {
        id: "institutional_challenges",
        en: "Institutional Challenges",
        sp: "Desafíos institucionales",
        fr: "Difficultés institutionnelles",
        ar: "التحديات المؤسسية "
    },
    //Sidebar
    {
        id: "select_ma",
        en: "Back to Dashboard",
        sp: "Volver al Panel",
        fr: "Retour au Tableau de Bord",
        ar: "العودة إلى لوحة المعلومات",
    },
    {
        id: "annual_update",
        en: "Annual Business Plan",
        sp: "Actualizaciones anuales del plan de negocios",
        fr: "Mises à jour du plan d’activité annuel",
        ar: 'تحديث خطة الأعمال السنوية'
    },
    {
        id: "narrative_plan",
        en: "1.2 Narrative Plan",
        sp: "1.2 Plan Narrativo",
        fr: "1.2 Résumé du plan",
        ar: 'الخطة السردية '
    },
    {
        id: "project_description",
        en: "2.1 Project Description",
        sp: "2.1 Descripción del proyecto",
        fr: "2.1 Description du projet",
        ar: "1.2 وصف المشروع",
    },
    {
        id: "project_budget",
        en: "2.2 Project Expense Budget",
        sp: "2.2 Presupuesto de gastos del proyecto",
        fr: "2.2 Budget des dépenses du projet",
        ar: "2.2 ميزانية نفقات المشروع",
    },
    {
        id: "project_focusarea",
        en: "2.3 Expense Budget by Focus Area",
        sp: "2.3 Presupuesto de gastos por área de enfoque",
        fr: "2.3 Budget des dépenses par domaine d'intérêt",
        ar: "2.3 ميزانية النفقات حسب مجال التركيز",
    },
    {
        id: "project_expense",
        en: " 2.4 Budget by Expense Category",
        sp: "2.4 Proyectos - Categoría de gastos",
        fr: "2.4 Projets par catégorie de dépenses",
        ar: '4.2 المشاريع حسب فئة الانفاق'
    },
    {
        id: "total_income",
        en: "3.1 Total Income",
        sp: "3.1 Ingresos totales",
        fr: "3.1 Total des recettes",
        ar: "1.3 إجمالي الدخل",
    },
    {
        id: "income_donor",
        en: "3.2 Income by Donor",
        sp: "3.2 Ingresos por donante",
        fr: "3.2 Recettes par bailleur de fonds",
        ar: "2.3 الدخل حسب الجهة المانحة",
    },
    {
        id: "value_corefunding",
        en: "3.3 Value Add of Core Funding",
        sp: "3.3 Valor añadido del financiamiento básico",
        fr: "3.3 Valeur ajoutée des fonds de base",
        ar: "3.3 القيمة المضافة للتمويل الأساسي",
    },
    {
        id: "order_commodities",
        en: "3.4 Order Commodities from IPPF",
        sp: "3.4 Pedidos de productos a la IPPF",
        fr: "3.4 Commande de produits auprès de l’IPPF",
        ar: "4.3 طلب السلع الطبية من الاتحاد الدولي لتنظيم الأسرة (IPPF)",
    },
    {
        id: "commodities_funding",
        en: "3.5 Commodities by Source of Funding",
        sp: "3.5 Productos por fuente de financiamiento",
        fr: "3.5 Produits par source de financement",
        ar: "5.3 السلع الطبية حسب مصدر التمويل"
    },
    
    
    {
        id: "annual_report",
        en: "Annual / Semi-Annual Report Submission & Approval",
        sp: "Presentación y aprobación del informe anual/semestral",
        fr: "Soumission et Approbation du Rapport annuel/semestriel ",
        ar: 'إرسال واعتماد التقرير السنوي/نصف السنوي',
    },
    {
        id: "organization_report",
        en: "1. Organizational details",
        sp: "1. Información de la AM",
        fr: "1. Informations sur l'AM",
        ar: 'بيانات المنظمة'
    },
    {
        id: "narrative_report",
        en: "2. Narrative report",
        sp: "2. Informe narrativo",
        fr: "2. Rapport descriptif",
        ar: 'التقرير السردي'
    },
    {
        id: "add_project",
        en: "3. Add new project",
        sp: "3. Añadir nuevo proyecto",
        fr: "3. Ajouter un nouveau projet",
        ar: '3. إضافة مشروع جديد'
    },
    {
        id: "budget_vs_focusarea",
        en: "4. Budget vs actuals by focus area",
        sp: "4. Presupuesto vs. datos reales según área prioritaria",
        fr: "4. Écart entre le budget et les dépenses réelles par volet d’intervention",
        ar: '4. الميزانية مقابل القيم الفعلية حسب مجال التركيز'
    },
    {
        id: "budget_vs_expense",
        en: "5. Budget vs actuals by expense category",
        sp: "5. Presupuesto vs. datos reales por categoría de gastos",
        fr: "5. Écart entre le budget et les dépenses réelles par catégorie de dépenses",
        ar: '5. الميزانية مقابل القيم الفعلية حسب فئة الإنفاق'
    },
    {
        id: "actual_income",
        en: "6. Actual income",
        sp: "6. Ingreso real (real)",
        fr: "6. Revenus réels (Chiffres réels)",
        ar: '6. الدخل الفعلي'
    },
    {
        id: "standard_reports",
        en: "Reports and Exports",
        sp: "Generación de informes estándar desde el portal BP",
        fr: "Génération de rapports standard à partir du portail BP",
        ar: 'إنشاء التقارير القياسية من بوابة BP'
    },
    {
        id: "maintenance",
        en: "Maintenance",
        sp: "Mantenimiento",
        fr: "Maintenance",
        ar: "الصيانة"
    },
    {
        id: "log_out",
        en: "LOG OUT",
        sp: "CERRAR SESIÃ“N",
        fr: "SE DÃ‰CONNECTER",
        ar: "تسجيل الخروج"
    },
    {
        id: "member_association",
        en: "Member Association",
        sp: "AsociaciÃ³n Miembro",
        fr: "Association membre",
        ar: "الجمعية العضو"
    },
    {
        id: "home_welcome_message",
        en: "Welcome to the <strong>IPPF Business Planning and Reporting Portal</strong>. The portal is your one-stop-shop for uploading your annual business plans, submitting annual and half-year reports, or for downloading reports and relevant documents.",
        sp: "Bienvenido al <strong>Portal de PlanificaciÃ³n y Reporte de IPPF</strong>. El portal es su ventanilla Ãºnica para cargar sus planes de negocio anuales, presentar informes anuales y semestrales, o descargar informes y documentos pertinentes.",
        fr: "Bienvenue sur le <strong>Portail de planification et de rapports de l’IPPF</strong>. Ce portail est votre guichet unique pour téléverser vos plans d’activités annuels, soumettre vos rapports annuels et semestriels, ainsi que pour télécharger des rapports et autres documents pertinents.",
        ar: "مرحبًا بكم في <strong>بوابة التخطيط وإعداد التقارير التابعة لـ IPPF</strong>. تُعد البوابة منصتكم الموحدة لرفع خطط الأعمال السنوية، وتقديم التقارير السنوية ونصف السنوية، أو تنزيل التقارير والوثائق ذات الصلة."
    },

    {
        id: "timeline_title",
        en: "MA BPR Timelines: 2026",
        sp: "Cronograma MA BPR: 2026",
        fr: "Calendrier MA BPR : 2026",
        ar: "الجدول الزمني لـ MA BPR: 2026"
    },
    {
        id: "reporting",
        en: "Reporting",
        sp: "Informe",
        fr: "Rapport",
        ar: "إعداد التقارير"
    },
    {
        id: "planning",
        en: "Planning",
        sp: "PlanificaciÃ³n",
        fr: "Planification",
        ar: "التخطيط"
    },
    {
        id: "review_analysis",
        en: "Review & Analysis",
        sp: "RevisiÃ³n y AnÃ¡lisis",
        fr: "Revue et Analyse",
        ar: "المراجعة والتحليل"
    },
    {
        id: "period_apr_jun",
        en: "April - June",
        sp: "Abril - Junio",
        fr: "Avril - Juin",
        ar: "أبريل - يونيو"
    },
    {
        id: "period_jul_sep",
        en: "July - September",
        sp: "Julio - Septiembre",
        fr: "Juillet - Septembre",
        ar: "يوليو - سبتمبر"
    },
    {
        id: "period_oct_dec",
        en: "October - December",
        sp: "Octubre - Diciembre",
        fr: "Octobre - DÃ©cembre",
        ar: "أكتوبر - ديسمبر"
    },
    {
        id: "date_april_10",
        en: "April 10",
        sp: "10 de abril",
        fr: "10 avril",
        ar: "10 أبريل"
    },
    {
        id: "date_may_15",
        en: "May 15",
        sp: "15 de mayo",
        fr: "15 mai",
        ar: "15 مايو"
    },
    {
        id: "date_june_15",
        en: "June 15",
        sp: "15 de junio",
        fr: "15 juin",
        ar: "15 يونيو"
    },
    {
        id: "date_july_15",
        en: "July 15",
        sp: "15 de julio",
        fr: "15 juillet",
        ar: "15 يوليو"
    },
    {
        id: "date_august_15",
        en: "August 15",
        sp: "15 de agosto",
        fr: "15 aoÃ»t",
        ar: "15 أغسطس"
    },
    {
        id: "date_september_18",
        en: "September 18",
        sp: "18 de septiembre",
        fr: "18 septembre",
        ar: "18 سبتمبر"
    },
    {
        id: "date_october_16",
        en: "October 16",
        sp: "16 de octubre",
        fr: "16 octobre",
        ar: "16 أكتوبر"
    },
    {
        id: "date_october_30",
        en: "October 30",
        sp: "30 de octubre",
        fr: "30 octobre",
        ar: "30 أكتوبر"
    },
    {
        id: "date_nov_19_tbc",
        en: "Nov 19 (tbc)",
        sp: "19 nov. (por confirmar)",
        fr: "19 nov. (Ã  confirmer)",
        ar: "19 نوفمبر (قيد التأكيد)"
    },
    {
        id: "annual_reports_2025",
        en: "2025 Annual Reports",
        sp: "Informes anuales 2025",
        fr: "Rapports annuels 2025",
        ar: "التقارير السنوية لعام 2025"
    },
    {
        id: "portal_open",
        en: "Portal Open",
        sp: "Portal abierto",
        fr: "Portail ouvert",
        ar: "البوابة مفتوحة"
    },
    {
        id: "portal_opens",
        en: "Portal opens",
        sp: "Portal abre",
        fr: "Ouverture du portail",
        ar: "تفتح البوابة"
    },
    {
        id: "portal_closes",
        en: "Portal closes",
        sp: "Portal cierra",
        fr: "Fermeture du portail",
        ar: "تغلق البوابة"
    },
    {
        id: "aoc_ar_review",
        en: "AOC AR Review",
        sp: "RevisiÃ³n AOC AR",
        fr: "Revue AOC AR",
        ar: "مراجعة AOC AR"
    },
    {
        id: "completed",
        en: "Completed",
        sp: "Completado",
        fr: "TerminÃ©",
        ar: "مكتمل"
    },
    {
        id: "second_tranche_2026",
        en: "2nd tranche 2026",
        sp: "2.Âº tramo 2026",
        fr: "2e tranche 2026",
        ar: "الشريحة الثانية 2026"
    },
    {
        id: "funding_released",
        en: "Funding Released",
        sp: "FinanciaciÃ³n liberada",
        fr: "Financement dÃ©bloquÃ©",
        ar: "تم صرف التمويل"
    },
    {
        id: "ipfs_2027",
        en: "2027 IPFs",
        sp: "IPFs 2027",
        fr: "IPFs 2027",
        ar: "IPFs لعام 2027"
    },
    {
        id: "board_confirmation",
        en: "Board Confirmation",
        sp: "ConfirmaciÃ³n de la Junta",
        fr: "Confirmation du Conseil",
        ar: "تأكيد مجلس الإدارة"
    },
    {
        id: "bp_2027_hyr_2026",
        en: "2027 BP & 2026 HYR",
        sp: "BP 2027 y HYR 2026",
        fr: "BP 2027 et HYR 2026",
        ar: "خطة العمل 2027 وتقرير نصف السنة 2026"
    },
    {
        id: "trt_review",
        en: "TRT Review",
        sp: "RevisiÃ³n TRT",
        fr: "Revue TRT",
        ar: "مراجعة TRT"
    },
    {
        id: "third_tranche_2026",
        en: "3rd tranche 2026",
        sp: "3.er tramo 2026",
        fr: "3e tranche 2026",
        ar: "الشريحة الثالثة 2026"
    },
    {
        id: "budgets_2027",
        en: "2027 Budgets",
        sp: "Presupuestos 2027",
        fr: "Budgets 2027",
        ar: "ميزانيات 2027"
    },
    {
        id: "c_far",
        en: "C-FAR",
        sp: "C-FAR",
        fr: "C-FAR",
        ar: "C-FAR"
    },
    {
        id: "now_active",
        en: "Now Active",
        sp: "Activo Ahora",
        fr: "Actif",
        ar: "نشط الآن"
    },
    {
        id: "annual_reporting",
        en: "Annual Reporting",
        sp: "Informe Anual",
        fr: "Rapport Annuel",
        ar: "التقارير السنوية"
    },
    {
        id: "mas_commenced_2027",
        en: "MAs Commenced",
        sp: "Inicio de las evaluaciones de impacto ambiental",
        fr: "Lancement des missions d’évaluation",
        ar: "بدء تنفيذ الأنشطة الإدارية"
    },
    {
        id: "final_business_plan",
        en: "Final Business Plan Submitted",
        sp: "Presentación del plan de negocios definitivo",
        fr: "Soumission du plan d’activité définitif",
        ar: "تقديم خطة العمل النهائية"
    },
     {
        id: "mas_commenced_2026",
        en: "MAs Commenced",
        sp: "Inicio de las evaluaciones de impacto ambiental",
        fr: "Lancement des missions d’évaluation",
        ar: "بدء تنفيذ الأنشطة الإدارية"
    },
    {
        id: "annual_business_plan_2027",
        en: "Annual Business Plan 2027",
        sp: "Plan de negocios anual 2027",
        fr: "Plan d’activité annuel 2027",
        ar: "خطة العمل السنوية لعام 2027"
    },
    {
        id: "half_yearly_2026",
        en: "Half-Yearly Report 2026",
        sp: "Informe semestral 2026",
        fr: "Rapport semestriel 2026",
        ar: "التقرير نصف السنوي لعام 2026"
    },
    {
        id: "finalized_reporting",
        en: "Finalized Reporting",
        sp: "Presentación del informe definitivo",
        fr: "Soumission du rapport final",
        ar:"تقديم التقرير النهائي"
    },
    {
        id: "notice_board",
        en: "Notice Board",
        sp: "TablÃ³n de Anuncios",
        fr: "Tableau d'affichage",
        ar: "لوحة الإعلانات"
    },
    {
        id: "english_label",
        en: "English",
        sp: "InglÃ©s",
        fr: "Anglais",
        ar: "الإنجليزية"
    },
    {
        id: "spanish_label",
        en: "Spanish",
        sp: "EspaÃ±ol",
        fr: "Espagnol",
        ar: "الإسبانية"
    },
    {
        id: "french_label",
        en: "French",
        sp: "FrancÃ©s",
        fr: "FranÃ§ais",
        ar: "الفرنسية"
    },
    {
        id: "arabic_label",
        en: "Arabic",
        sp: "Ãrabe",
        fr: "Arabe",
        ar: "العربية"
    },
    {
        id: "member_association_selected",
        en: "Member Association {{orgUnitName}} selected!",
        sp: "Se ha seleccionado la AsociaciÃ³n Miembro {{orgUnitName}}.",
        fr: "L'association membre {{orgUnitName}} a Ã©tÃ© sÃ©lectionnÃ©e.",
        ar: "تم اختيار الجمعية العضو {{orgUnitName}}."
    },
    {
        id: "home_selection_info",
        en: "Changes made here will reflect all around the pages and the data will be displayed accordingly. Please select carefully!",
        sp: "Los cambios realizados aquÃ­ se reflejarÃ¡n en todas las pÃ¡ginas y los datos se mostrarÃ¡n en consecuencia. Â¡Seleccione cuidadosamente!",
        fr: "Les modifications apportÃ©es ici se reflÃ¨teront dans toutes les pages et les donnÃ©es seront affichÃ©es en consÃ©quence. Veuillez sÃ©lectionner avec soin !",
        ar: "ستنعكس التغييرات التي يتم إجراؤها هنا في جميع الصفحات وسيتم عرض البيانات وفقًا لذلك. يُرجى الاختيار بعناية."
    },
    // Homepage French encoding overrides: later duplicate ids intentionally win during resource construction.
    {
        id: "log_out",
        en: "LOG OUT",
        sp: "CERRAR SESIÃƒâ€œN",
        fr: "SE DÉCONNECTER",
        ar: "ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø®Ø±ÙˆØ¬"
    },
    {
        id: "home_welcome_message",
        en: "Welcome to the <strong>IPPF Business Planning and Reporting Portal</strong>. The portal is your one-stop-shop for uploading your annual business plans, submitting annual and half-year reports, or for downloading reports and relevant documents.",
        sp: "Bienvenido al <strong>Portal de PlanificaciÃƒÂ³n y Reporte de IPPF</strong>. El portal es su ventanilla ÃƒÂºnica para cargar sus planes de negocio anuales, presentar informes anuales y semestrales, o descargar informes y documentos pertinentes.",
        fr: "Bienvenue sur le <strong>Portail de planification et de rapport de l'IPPF</strong>. Ce portail est votre guichet unique pour téléverser vos plans d'activité annuels, soumettre vos rapports annuels et semestriels, ou télécharger des rapports et des documents pertinents.",
        ar: "Ù…Ø±Ø­Ø¨Ù‹Ø§ Ø¨ÙƒÙ… ÙÙŠ <strong>Ø¨ÙˆØ§Ø¨Ø© Ø§Ù„ØªØ®Ø·ÙŠØ· ÙˆØ¥Ø¹Ø¯Ø§Ø¯ Ø§Ù„ØªÙ‚Ø§Ø±ÙŠØ± Ø§Ù„ØªØ§Ø¨Ø¹Ø© Ù„Ù€ IPPF</strong>. ØªÙØ¹Ø¯ Ø§Ù„Ø¨ÙˆØ§Ø¨Ø© Ù…Ù†ØµØªÙƒÙ… Ø§Ù„Ù…ÙˆØ­Ø¯Ø© Ù„Ø±ÙØ¹ Ø®Ø·Ø· Ø§Ù„Ø£Ø¹Ù…Ø§Ù„ Ø§Ù„Ø³Ù†ÙˆÙŠØ©ØŒ ÙˆØªÙ‚Ø¯ÙŠÙ… Ø§Ù„ØªÙ‚Ø§Ø±ÙŠØ± Ø§Ù„Ø³Ù†ÙˆÙŠØ© ÙˆÙ†ØµÙ Ø§Ù„Ø³Ù†ÙˆÙŠØ©ØŒ Ø£Ùˆ ØªÙ†Ø²ÙŠÙ„ Ø§Ù„ØªÙ‚Ø§Ø±ÙŠØ± ÙˆØ§Ù„ÙˆØ«Ø§Ø¦Ù‚ Ø°Ø§Øª Ø§Ù„ØµÙ„Ø©."
    },
    {
        id: "period_oct_dec",
        en: "October - December",
        sp: "Octubre - Diciembre",
        fr: "Octobre - Décembre",
        ar: "Ø£ÙƒØªÙˆØ¨Ø± - Ø¯ÙŠØ³Ù…Ø¨Ø±"
    },
    {
        id: "date_august_15",
        en: "August 15",
        sp: "15 de agosto",
        fr: "15 août",
        ar: "15 Ø£ØºØ³Ø·Ø³"
    },
    {
        id: "date_nov_19_tbc",
        en: "Nov 19 (tbc)",
        sp: "19 nov. (por confirmar)",
        fr: "19 nov. (à confirmer)",
        ar: "19 Ù†ÙˆÙÙ…Ø¨Ø± (Ù‚ÙŠØ¯ Ø§Ù„ØªØ£ÙƒÙŠØ¯)"
    },
    {
        id: "completed",
        en: "Completed",
        sp: "Completado",
        fr: "Terminé",
        ar: "Ù…ÙƒØªÙ…Ù„"
    },
    {
        id: "funding_released",
        en: "Funding Released",
        sp: "FinanciaciÃƒÂ³n liberada",
        fr: "Financement débloqué",
        ar: "ØªÙ… ØµØ±Ù Ø§Ù„ØªÙ…ÙˆÙŠÙ„"
    },
    {
        id: "mas_commenced",
        en: "MAs Commenced",
        sp: "MAs Iniciadas",
        fr: "AM commencées",
        ar: "Ø§Ù„Ø¬Ù…Ø¹ÙŠØ§Øª Ø§Ù„ØªÙŠ Ø¨Ø¯Ø£Øª"
    },
    {
        id: "finalized_reporting",
        en: "Finalized Reporting",
        sp: "Informe Finalizado",
        fr: "Rapport finalisé",
        ar: "ØªÙ… Ø§Ù„Ø§Ù†ØªÙ‡Ø§Ø¡ Ù…Ù† Ø§Ù„ØªÙ‚Ø§Ø±ÙŠØ±"
    },
    {
        id: "french_label",
        en: "French",
        sp: "FrancÃƒÂ©s",
        fr: "Français",
        ar: "Ø§Ù„ÙØ±Ù†Ø³ÙŠØ©"
    },
    {
        id: "member_association_selected",
        en: "Member Association {{orgUnitName}} selected!",
        sp: "Se ha seleccionado la AsociaciÃƒÂ³n Miembro {{orgUnitName}}.",
        fr: "L'association membre {{orgUnitName}} a été sélectionnée.",
        ar: "ØªÙ… Ø§Ø®ØªÙŠØ§Ø± Ø§Ù„Ø¬Ù…Ø¹ÙŠØ© Ø§Ù„Ø¹Ø¶Ùˆ {{orgUnitName}}."
    },
    {
        id: "home_selection_info",
        en: "Changes made here will reflect all around the pages and the data will be displayed accordingly. Please select carefully!",
        sp: "Los cambios realizados aquÃƒÂ­ se reflejarÃƒÂ¡n en todas las pÃƒÂ¡ginas y los datos se mostrarÃƒÂ¡n en consecuencia. Ã‚Â¡Seleccione cuidadosamente!",
        fr: "Les modifications apportées ici se reflèteront dans toutes les pages et les données seront affichées en conséquence. Veuillez sélectionner avec soin !",
        ar: "Ø³ØªÙ†Ø¹ÙƒØ³ Ø§Ù„ØªØºÙŠÙŠØ±Ø§Øª Ø§Ù„ØªÙŠ ÙŠØªÙ… Ø¥Ø¬Ø±Ø§Ø¤Ù‡Ø§ Ù‡Ù†Ø§ ÙÙŠ Ø¬Ù…ÙŠØ¹ Ø§Ù„ØµÙØ­Ø§Øª ÙˆØ³ÙŠØªÙ… Ø¹Ø±Ø¶ Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª ÙˆÙÙ‚Ù‹Ø§ Ù„Ø°Ù„Ùƒ. ÙŠÙØ±Ø¬Ù‰ Ø§Ù„Ø§Ø®ØªÙŠØ§Ø± Ø¨Ø¹Ù†Ø§ÙŠØ©."
    },
//changes updated above
    // Final clean homepage overrides: later duplicate ids intentionally win during resource construction.
    {
        id: "log_out",
        en: "LOG OUT",
        sp: "CERRAR SESIÓN",
        fr: "SE DÉCONNECTER",
        ar: "تسجيل الخروج"
    },
    {
        id: "member_association",
        en: "Member Association",
        sp: "Asociación Miembro",
        fr: "Association membre",
        ar: "الجمعية العضو"
    },
    {
        id: "home_welcome_message",
        en: "Welcome to the <strong>IPPF Business Planning and Reporting Portal</strong>. The portal is your one-stop-shop for uploading your annual business plans, submitting annual and half-year reports, or for downloading reports and relevant documents.",
        sp: "Bienvenido al <strong>Portal de Planificación y Reporte de IPPF</strong>. El portal es su ventanilla única para cargar sus planes de negocio anuales, presentar informes anuales y semestrales, o descargar informes y documentos pertinentes.",
        fr: "Bienvenue sur le <strong>Portail de planification et de rapport de l'IPPF</strong>. Ce portail est votre guichet unique pour téléverser vos plans d'activité annuels, soumettre vos rapports annuels et semestriels, ou télécharger des rapports et des documents pertinents.",
        ar: "مرحبًا بكم في <strong>بوابة التخطيط وإعداد التقارير التابعة لـ IPPF</strong>. تُعد البوابة منصتكم الموحدة لرفع خطط الأعمال السنوية، وتقديم التقارير السنوية ونصف السنوية، أو تنزيل التقارير والوثائق ذات الصلة."
    },
    {
        id: "planning",
        en: "Planning",
        sp: "Planificación",
        fr: "Planification",
        ar: "التخطيط"
    },
    {
        id: "review_analysis",
        en: "Review & Analysis",
        sp: "Revisión y Análisis",
        fr: "Revue et Analyse",
        ar: "المراجعة والتحليل"
    },
    {
        id: "period_oct_dec",
        en: "October - December",
        sp: "Octubre - Diciembre",
        fr: "Octobre - Décembre",
        ar: "أكتوبر - ديسمبر"
    },
    {
        id: "date_august_15",
        en: "August 15",
        sp: "15 de agosto",
        fr: "15 août",
        ar: "15 أغسطس"
    },
    {
        id: "date_nov_19_tbc",
        en: "Nov 19 (tbc)",
        sp: "19 nov. (por confirmar)",
        fr: "19 nov. (à confirmer)",
        ar: "19 نوفمبر (قيد التأكيد)"
    },
    {
        id: "aoc_ar_review",
        en: "AOC AR Review",
        sp: "Revisión AOC AR",
        fr: "Revue AOC AR",
        ar: "مراجعة AOC AR"
    },
    {
        id: "completed",
        en: "Completed",
        sp: "Completado",
        fr: "Terminé",
        ar: "مكتمل"
    },
    {
        id: "second_tranche_2026",
        en: "2nd tranche 2026",
        sp: "2.º tramo 2026",
        fr: "2e tranche 2026",
        ar: "الشريحة الثانية 2026"
    },
    {
        id: "funding_released",
        en: "Funding Released",
        sp: "Financiación liberada",
        fr: "Financement débloqué",
        ar: "تم صرف التمويل"
    },
    {
        id: "board_confirmation",
        en: "Board Confirmation",
        sp: "Confirmación de la Junta",
        fr: "Confirmation du Conseil",
        ar: "تأكيد مجلس الإدارة"
    },
    {
        id: "trt_review",
        en: "TRT Review",
        sp: "Revisión TRT",
        fr: "Revue TRT",
        ar: "مراجعة TRT"
    },
    {
        id: "mas_commenced",
        en: "MAs Commenced",
        sp: "MAs Iniciadas",
        fr: "AM commencées",
        ar: "الجمعيات التي بدأت"
    },
    {
        id: "finalized_reporting",
        en: "Finalized Reporting",
        sp: "Informe Finalizado",
        fr: "Rapport finalisé",
        ar: "تم الانتهاء من التقارير"
    },
    {
        id: "notice_board",
        en: "Notice Board",
        sp: "Tablón de Anuncios",
        fr: "Tableau d'affichage",
        ar: "لوحة الإعلانات"
    },
    {
        id: "english_label",
        en: "English",
        sp: "Inglés",
        fr: "Anglais",
        ar: "الإنجليزية"
    },
    {
        id: "spanish_label",
        en: "Spanish",
        sp: "Español",
        fr: "Espagnol",
        ar: "الإسبانية"
    },
    {
        id: "french_label",
        en: "French",
        sp: "Francés",
        fr: "Français",
        ar: "الفرنسية"
    },
    {
        id: "arabic_label",
        en: "Arabic",
        sp: "Árabe",
        fr: "Arabe",
        ar: "العربية"
    },
    {
        id: "member_association_selected",
        en: "Member Association {{orgUnitName}} selected!",
        sp: "Se ha seleccionado la Asociación Miembro {{orgUnitName}}.",
        fr: "L'association membre {{orgUnitName}} a été sélectionnée.",
        ar: "تم اختيار الجمعية العضو {{orgUnitName}}."
    },
    {
        id: "home_selection_info",
        en: "Changes made here will reflect all around the pages and the data will be displayed accordingly. Please select carefully!",
        sp: "Los cambios realizados aquí se reflejarán en todas las páginas y los datos se mostrarán en consecuencia. ¡Seleccione cuidadosamente!",
        fr: "Les modifications apportées ici se reflèteront dans toutes les pages et les données seront affichées en conséquence. Veuillez sélectionner avec soin !",
        ar: "ستنعكس التغييرات التي يتم إجراؤها هنا في جميع الصفحات وسيتم عرض البيانات وفقًا لذلك. يُرجى الاختيار بعناية."
    },
    {
        id: "business_plan",
        en: "3 Year Business Plan",
        sp: "Plan de negocios de 3 años",
        fr: "Plan d'affaires sur 3 ans",
        ar: "خطة عمل لمدة 3 سنوات",
    },
     
    {
        id: "total_income_ar",
        en: "Total Income",
        sp: "Ingresos totales",
        fr: "Total des recettes",
        ar: "إجمالي الدخل",
    },
   
   

    //header
    {
        id: "region",
        en: "Region",
        sp: "Región",
        fr: "Région",
        ar: 'اقليم'
    },
    {
        id: "year_business_plan_update",
        en: "Year of Business Plan Update",
        sp: "Año de actualización del plan de negocio anual",
        fr: "Année de mise à jour du plan d’activité",
        ar: 'سنة تحديث خطة الأعمال'
    },
    {
        id: "year_business_plan_reporting",
        en: "Year of Reporting",
        sp: "Año de presentación del informe",
        fr: "Année de déclaration",
        ar: 'سنة التقرير'
    },
    {
        id: "reporting_year",
        en: "Reporting Year",
        sp: "Año de informe",
        fr: "Année de déclaration",
        ar: 'سنة التقرير'
    },
    {
        id: "reporting_periodicity",
        en: "Reporting Period",
        sp: "Período de presentación de informes",
        fr: "Période de rapport",
        ar: 'فترة التقارير'
    },

    //Organization Details

    
   
    {
        id: "business_plan_contact_email",
        en: "Business plan Contact Email",
        sp: "Correo electrónico de contacto",
        fr: "E-mail de contact ",
        ar: "بريد إلكتروني للتواصل"
    }, 
   
    {
        id: "strategic_period",
        en: "Strategic period",
        sp: "Período estratégico",
        fr: "Période stragégique",
        ar: 'الفترة الاستراتيجية'
    },        
    {
        id: "key_management",
        en: "Please upload the management letter received with the audit report",
        sp: "Por favor, cargue la carta de gestión recibida junto con el informe de auditoría.",
        fr: "Veuillez télécharger la lettre de gestion reçue avec le rapport d'audit",
        ar: 'يرجى تحميل خطاب الإدارة المستلم مع تقرير التدقيق'
    },
    {
        id: "other_upload_narrative",
        en: "If relevant, please upload any research reports conducted or published in the calendar year.",
        sp: "Si corresponde, por favor, sube cualquier informe de investigación que se haya realizado o publicado durante el año calendario.",
        fr: "Le cas échéant, veuillez mettre en ligne les rapports de recherche réalisés ou publiés au cours de l'année civile.",
        ar: "إذا كان ذلك مناسبًا، يرجى تحميل أي تقارير بحثية تم إجراؤها أو نشرها خلال السنة التقويمية."
    },
   
   
    {
        id: "country_context_year2",
        en: "Country Context - Year 2",
        sp: "1. Contexto nacional",
        fr: "Ques 1.Contexte du pays",
        ar: 'سياق الدولة - السنة الثانية '
    },
    {
        id: "country_context_year3",
        en: "Country Context - Year 3",
        sp: "1. Contexto nacional",
        fr: "Ques 1.Contexte du pays",
        ar: 'سياق الدولة - السنة الثاالثة'
    },
    {
        id: "strategy2",
        en: "Strategy - Year 2",
        sp: "2. Estrategia",
        fr: "Ques 2. Stratégie",
        ar: 'الاستراتيجية : السنة الثانية'
    },
    {
        id: "strategy3",
        en: "Strategy - Year 3",
        sp: "2. Estrategia",
        fr: "Ques 2. Stratégie",
        ar: 'الاستراتيجية : السنة الثالثة'
    },
    {
        id: "strategy_description_first",
        en: "Describe your current high-level strategy or theory of change. How does it responds  to your local needs and context described above? What are its key components and activities, and how will you operationalize it?",
        sp: "Estrategia  Describa su actual estrategia de alto nivel o teoría del cambio. ¿De qué forma da respuesta a sus necesidades locales y al contexto que se describieron antes? ¿Cuáles son sus componentes y actividades principales, y cómo los pondrán en práctica?",
        fr: "Décrivez votre stratégie de haut niveau ou votre théorie du changement actuelle. Dans quelle mesure répond-elle à vos besoins locaux et à votre contexte décrit ci-dessus ? Quels en sont ses principaux composants et ses principales activités et comment allez-vous la mettre en pratique ?",
        ar: 'وضح نظريتكم في التغيير أو إستراتيجيتكم الحالية رفيعة المستوى. كيف تلبي احتياجاتكم المحلية والسياق المذكور أعلاه؟ ما هي عناصرها وأنشطتها الرئيسية، وكيف تقومون بتفعيلها؟ '
    },
    {
        id: "strategy_description_second",
        en: "Please outline how it aligns with IPPF’s strategic framework. If there are specific  target groups you aim to serve, please mention them here. In particular, please highlight any approaches that differ from your past approaches.",
        sp: "Explique brevemente de qué forma concuerdan con el marco estratégico de IPPF. Si hay grupos objetivo específicos a los que quieren prestar servicios, menciónelos aquí. En particular, destaque enfoques que sean diferentes a los que hayan adoptado en el pasado",
        fr: "Veuillez expliquer dans ses grandes lignes comment elle s’aligne sur le cadre stratégique de l’IPPF. S’il y a des groupes spécifiques que vous souhaitez cibler avec vos services, veuillez les mentionner ici. En particulier, veuillez mettre en évidence les approches qui diffèrent de vos approches passées",
        ar:  'نرجو تحديد أوجه التوافق بينها وبين إطار اتحاد IPPF الاستراتيجي. وإن كان لديكم مجموعات مستهدفة محددة تهدفون إلى خدمتها، نرجو ذكرها هنا. وخصوصًا، نرجو إيضاح النهج التي تختلف عن نهجكم السابقة. (بحد أقصى 800 كلمة)'
    },
    {
        id: "other_actors_year2",
        en: "Landscape of other actors - Year 2",
        sp: "3.Panorama de otros actores",
        fr: "Ques 3.Paysage des autres acteur",
        ar: 'المشهد المحيط بالجهات الفاعلة الأخرى - السنة الثانية'
    },
    {
        id: "other_actors_year3",
        en: "Landscape of other actors - Year 3",
        sp: "3.Panorama de otros actores",
        fr: "Ques 3.Paysage des autres acteur",
        ar: 'المشهد المحيط بالجهات الفاعلة الأخرى - السنة الثالثة'
    },
    {
        id: "youth_involvement_description",
        en: "Describe the process put in place to ensure that 5% of the budget of your Business  Plan was decided by youth",
        sp: "Describa el proceso que se ha puesto en marcha para garantizar que el 5 % del presupuesto de su Plan de negocio lo decidan las personas jóvenes",
        fr: "Décrivez le processus mis en place pour vous assurer que 5 % du budget de votre plan d'activité a été décidé par les jeunes",
        ar:  'اشرح الإجراءات المتبعة للتأكد من أن 5٪ من ميزانية خطة أعمالكم قد قام الشباب بتحديدها. (بحد أقصى 250 كلمة)'
    },
    {
        id: "institutional_opportunities",
        en: "Institutional Opportunities",
        sp: "Oportunidades institucionales",
        fr: "Opportunités institutionnelles",
        ar: 'الفرص المؤسسية '
    },
    {
        id: "operational_challenges",
        en: "Operational Challenges",
        sp: "Desafíos operativos ",
        fr: "Difficultés opérationnelles",
        ar: 'التحديات التشغيلية '
    },
    
    {
        id: "operational_opportunities",
        en: "Operational Opportunities",
        sp: "Oportunidades operativas",
        fr: "Opportunités opérationnelles",
        ar: 'الفرص التشغيلية '
    },
    {
        id: "programmatic_challenges",
        en: "Programmatic Challenges",
        sp: "Desafíos programáticos",
        fr: "Difficultés liées aux programmes ",
        ar: 'تحديات البرامج  '
    },
    {
        id: "programmatic_opportunities",
        en: "Programmatic Opportunities",
        sp: "Oportunidades programáticas",
        fr: "Opportunités liées aux programmes ",
        ar: "فرص البرامج "
    },
    {
        id: "financial_challenges",
        en: "Financial challenges",
        sp: "Desafíos financieros",
        fr: "Difficultés financières",
        ar: "التحديات المالية "
    },
    {
        id: "financial_opportunities",
        en: "Financial opportunities",
        sp: "Oportunidades financieras",
        fr: "Opportunités financières",
        ar: "الفرص المالية "
    },
    {
        id: "sustainability_opportunities",
        en: "Sustainability opportunities",
        sp: "Oportunidades de sostenibilidad",
        fr: "Opportunités en matière de durabilité",
        ar: "فرص الاستدامة "
    },
    {
        id: "technical_Assistance",
        en: "Technical Assistance",
        sp: "Asistencia técnica",
        fr: "Assistance technique",
        ar: 'المساعدة الفنية'
    },
    {
        id: "capacity_ma",
        en: "What technical expertise does my organisation have than they are able to share with  other MAs?",
        sp: "¿Qué capacidad tiene mi organización que pueda compartir con otras AM?",
        fr: "De quelle capacité mon organisation dispose-t-elle qu'elle est en mesure de partager avec d'autres AM ?",
        ar: 'ما هي الإمكانات التي تمتلكها منظمتي وتستطيع مشاركتها مع الجمعيات الأعضاء الأخرى؟  '
    },
    {
        id: "capacity_federation",
        en: "What are your main technical support needs from the federation (please be  specific)",
        sp: "¿Cuáles son sus principales necesidades de asistencia de parte de la Federación relacionadas con la capacidad? (Sea específico)",
        fr: "Quels sont vos principaux besoins en matière de capacités pour lesquels vous souhaiteriez le soutien de la fédération (veuillez être précis) ?",
        ar: 'ما هي احتياجات الدعم الرئيسية التي تريدونها من الاتحاد (يرجى تحديدها)'
    },
    {
        id: "words_remaining",
        en: "words remaining",
        sp: "palabras restantes",
        fr: "Mots restants",
        ar: 'الكلمات المتبقية'
    },
    //Project Description
    
    {
        id:"project_description_info",
        en:'<p class="mb-4">Please list all the projects you plan to carry out in year of the business plan.</p><p class="mb-4">Most projects are likely to have restricted funding. These have a donor agreement with clear deliverables and timelines. Each donor contract should be treated as a single project.</p><p class="mb-4">Some projects are implemented with unrestricted funding. This funding can be sourced from a donor, or from income generation activities such as social enterprise, sale of services, donations, etc.</p><p class="mb-4">For each project, please enter the name and a brief description including regions/provinces where it will be implemented, the target audience/clients and its intended outcomes/results.</p><p class="mb-0"> Please fill in all cells. <span style="color: red">They are mandatory, and the business plan cannot be submitted if they are not filled in.</span></p>',
        sp:'<p class="mb-4">Enumere todos los proyectos que tiene previsto ejecutar durante el año del plan de negocio.</p><p class="mb-4">La mayoría de los proyectos probablemente contarán con financiación restringida. Estos proyectos tienen un acuerdo con el donante que establece entregables y plazos claros. Cada contrato con un donante debe considerarse como un solo proyecto.</p><p class="mb-4">Algunos proyectos se ejecutan con financiación no restringida. Esta financiación puede provenir de un donante o de actividades de generación de ingresos, como empresas sociales, prestación de servicios, donaciones, etc.</p><p class="mb-4">Para cada proyecto, introduzca el nombre y una breve descripción que incluya las regiones o provincias donde se implementará, el público objetivo o los beneficiarios y los resultados previstos.</p><p class="mb-0">Complete todas las celdas. <span style="color: red">Son obligatorias y el plan de negocio no podrá enviarse si no están completas.</span></p>',
        fr:'<p class="mb-4">Veuillez énumérer tous les projets que vous prévoyez de mettre en œuvre au cours de l’année couverte par le plan d’activité.</p><p class="mb-4">La plupart des projets sont susceptibles d’être financés par des fonds affectés. Ces projets sont régis par un accord avec un bailleur de fonds précisant clairement les livrables et les échéances. Chaque contrat avec un bailleur de fonds doit être considéré comme un seul projet.</p><p class="mb-4">Certains projets sont mis en œuvre grâce à des fonds non affectés. Ces fonds peuvent provenir d’un bailleur de fonds ou d’activités génératrices de revenus, telles qu’une entreprise sociale, la vente de services, des dons, etc.</p><p class="mb-4">Pour chaque projet, veuillez saisir son nom ainsi qu’une brève description comprenant les régions/provinces où il sera mis en œuvre, le public cible/les bénéficiaires et les résultats attendus.</p><p class="mb-0">Veuillez remplir toutes les cellules. <span style="color: red">Elles sont obligatoires et le plan d’activité ne pourra pas être soumis si elles ne sont pas remplies.</span></p>',
        ar:'<p class="mb-4">يرجى إدراج جميع المشاريع التي تخططون لتنفيذها خلال سنة خطة العمل.</p><p class="mb-4">من المرجح أن تكون معظم المشاريع ممولة من خلال تمويل مقيّد. وتخضع هذه المشاريع لاتفاقية مع الجهة المانحة تتضمن مخرجات وجداول زمنية واضحة. يجب التعامل مع كل عقد مع جهة مانحة على أنه مشروع واحد.</p><p class="mb-4">يتم تنفيذ بعض المشاريع باستخدام تمويل غير مقيّد. وقد يأتي هذا التمويل من جهة مانحة أو من أنشطة توليد الدخل مثل المشاريع الاجتماعية، أو بيع الخدمات، أو التبرعات، وغيرها.</p><p class="mb-4">لكل مشروع، يرجى إدخال اسم المشروع ووصف موجز يتضمن المناطق/المحافظات التي سيتم تنفيذه فيها، والفئة المستهدفة/المستفيدين، والنتائج أو المخرجات المتوقعة.</p><p class="mb-0">يرجى تعبئة جميع الخانات. <span style="color: red">جميع الخانات إلزامية، ولا يمكن تقديم خطة العمل إذا لم يتم استكمالها.</span></p>'
    },
    {
        id: "description_project",
        en: "Description of Project",
        sp: "Descripción del proyecto",
        fr: "Description du Projet",
        ar: 'وصف المشروع '
    },
    {
        id: "add_new_project",
        en: "Add New Project",
        sp: "Añadir nuevo proyecto",
        fr: "Ajouter un nouveau projet",
        ar: "إضافة مشروع جديد"
    },
  
   
    {
        id: "submit",
        en: "Submit",
        sp: "Enviar",
        fr: "Soumettre",
        ar: "إرسال"
    },
    //Project Budget
    
   {
    id: "project_budget_info",
    en: `<p class="mb-4">Please complete all of the budget data in USD, using the exchange rate provided by IPPF.<br>Please break down annual funds based on calendar years (Jan - Dec).</p><p class="mb-4">Please included each project's budget. The total budget of all of your projects should equal your entire organisational budget (we assume that indirect/support costs and senior management costs are incorporated within each project; if there are additional indirect/support costs not captured in the projects, please add a separate project for them called "Indirect/Support").</p><p class="mb-0">Only include projects where funding is either confirmed or has an 80%+ chance of materialising. For each project, please enter the name and brief description including donor/funding source, regions/provinces where it will be implemented, the target audience/clients and its intended outcomes/results.</p>`,
    sp: `<p class="mb-4">Por favor, complete todos los datos presupuestarios en dólares estadounidenses (USD), utilizando el tipo de cambio proporcionado por la IPPF. Desglose los fondos anuales por años calendario (enero - diciembre).</p><p class="mb-4">Incluya el presupuesto de cada proyecto. El presupuesto total de todos sus proyectos debe equivaler al presupuesto total de su organización (suponemos que los costos indirectos/de apoyo y los costos de la alta dirección están incorporados en cada proyecto; si hay costos indirectos/de apoyo adicionales que no están incluidos en los proyectos, agregue un proyecto aparte para ellos llamado «Indirectos/Apoyo»).</p><p class="mb-0">Incluya únicamente los proyectos cuya financiación esté confirmada o que tengan una probabilidad de más del 80 % de concretarse. Para cada proyecto, ingrese el nombre y una breve descripción que incluya el donante o la fuente de financiamiento, las regiones o provincias donde se implementará, el público objetivo o los clientes y los resultados previstos.</p>`,
    fr: `<p class="mb-4">Veuillez indiquer toutes les données budgétaires en dollars américains (USD), en utilisant le taux de change fourni par l'IPPF. Veuillez ventiler les fonds annuels par année civile (janvier à décembre).</p><p class="mb-4">Veuillez inclure le budget de chaque projet. Le budget total de l’ensemble de vos projets doit correspondre au budget global de votre organisation (nous partons du principe que les frais indirects/de soutien et les frais liés à la direction sont intégrés dans chaque projet ; s’il existe des frais indirects/de soutien supplémentaires non pris en compte dans les projets, veuillez leur consacrer un projet distinct intitulé « Frais indirects/de soutien »).</p><p class="mb-0">N’incluez que les projets dont le financement est soit confirmé, soit susceptible de se concrétiser à plus de 80 %. Pour chaque projet, veuillez indiquer le nom et une brève description, y compris le donateur ou la source de financement, les régions ou provinces où il sera mis en œuvre, le public cible ou les clients, ainsi que les résultats escomptés.</p>`,
    ar: `<p class="mb-4">يرجى ملء جميع بيانات الميزانية بالدولار الأمريكي، باستخدام سعر الصرف المقدم من الاتحاد الدولي لتنظيم الأسرة (IPPF). يرجى توزيع الأموال السنوية على أساس السنوات التقويمية (يناير - ديسمبر).</p><p class="mb-4">يرجى تضمين ميزانية كل مشروع. يجب أن يساوي إجمالي ميزانية جميع مشاريعكم ميزانية منظمتكم بالكامل (نفترض أن التكاليف غير المباشرة/تكاليف الدعم وتكاليف الإدارة العليا مدرجة ضمن كل مشروع؛ إذا كانت هناك تكاليف غير مباشرة/تكاليف دعم إضافية لم يتم تضمينها في المشاريع، يرجى إضافة مشروع منفصل لها باسم "التكاليف غير المباشرة/تكاليف الدعم").</p><p class="mb-0">يرجى تضمين المشاريع التي تم تأكيد تمويلها أو التي تبلغ احتمالية تحقق تمويلها 80% أو أكثر فقط. بالنسبة لكل مشروع، يرجى إدخال الاسم ووصفًا موجزًا يتضمن الجهة المانحة/مصدر التمويل، والمناطق/المحافظات التي سيتم تنفيذه فيها، والجمهور المستهدف/العملاء، والنتائج/المخرجات المرجوة.</p>`
   },
    {
        id: "project_year",
        en: "Year",
        sp: "Año",
        fr: "Année",
        ar: 'سنة'
    },
    {
        id: "Total Budget",
        en: "Total Budget",
        sp: "Presupuesto",
        fr: "Budget",
        ar: 'الميزانية'
    },
    {
        id: "basic_project_budget",
        en: "Basic Project Budget",
        sp: "Presupuesto básico del proyecto"  ,
        fr: "Budget de base du projet",
        ar: " الميزانية الأساسية للمشروع"
    },
    {
        id: "core_funding",
        en: "IPPF Core Funding Allocated",
        sp: "Financiamiento básico asignado de IPPF",
        fr: "Fonds de base alloués à l’",
        ar: 'تقدير الاحتمالية'
    },
    {
        id: "confirmed",
        en: "Confirmed",
        sp: "Confirmado",
        fr: "Confirmé",
        ar: "مؤكد"
    },
    {
        id: "likely_over_80",
        en: "Likely (Over 80%)",
        sp: "Probable (más del 80 %)",
        fr: "Probable (plus de 80 %)",
        ar: "محتمل (أكثر من 80٪)"
    },
    {
        id: "uncertain",
        en: "Uncertain",
        sp: "Incierto",
        fr: "Incertain",
        ar: "غير مؤكد"
    },
    {
        id: "difference",
        en: "Difference",
        sp: "Diferencia",
        fr: "Différence",
        ar: 'التمويل الاساسي المخصص من الاتحاد'
    },
    {
        id: "project_details",
        en: "Project Details",
        sp: "Detalles del proyecto",
        fr: "Détails du projet",
        ar: 'تفاصيل المشروع'
    },
    {
        id: "estimated_likelihood",
        en: "Estimated Likelihood",
        sp: "Probabilidad estimada",
        fr: "Probabilité estimée",
        ar: 'تقدير الاحتمالية'
    },
    {
        id: "comments",
        en: "Comments",
        sp: "Comentarios",
        fr: "Commentaires",
        ar: 'التعليقات'
    },
    {
        id: "optional",
        en: "optional",
        sp: "opcional",
        fr: "facultatifs",
        ar: 'اختياري'
    },
    //Project by focus area
    {
        id: "breakdown_focus",
        en: "2.3 Breakdown by focus area",
        sp: "2.3 Desglose por área prioritaria",
        fr: "2.3 Ventilation par volet d’intervention",
        ar: '2.3 التقسيم حسب مجال التركيز'
    },
    {
        id: "project_focusarea_info",
        en: `<p>Please fill in your total organisational expense budget by focus area. The focus areas are pre-defined. Please do this for every project you have submitted under Section 2.1.</p><p><strong>A single project can have multiple Project Focus Areas. Use any that are relevant to the project.</strong></p><p>Please use your best estimate. For multi-year projects, please consider the breakdown of cost that you submitted in previous years.</p>`,
        sp: `<p>Por favor, indica el presupuesto total de gastos de tu organización por área de enfoque.</p><p>Las áreas de enfoque están predefinidas. Hazlo para cada proyecto que hayas presentado en la Sección 2.1.</p><p><strong>Un mismo proyecto puede tener varias áreas de enfoque. Utiliza aquellas que sean relevantes para el proyecto.</strong></p><p>Por favor, utiliza tu mejor estimación. En el caso de proyectos de varios años, toma en cuenta el desglose de costos que presentaste en años anteriores.</p>`,
        fr: `<p>Veuillez indiquer le budget total de votre organisation par domaine d'intervention.</p><p>Les domaines d'intervention sont prédéfinis. Veuillez remplir cette rubrique pour chaque projet que vous avez soumis au titre de la section 2.1.</p><p><strong>Un même projet peut relever de plusieurs domaines d'intervention. Sélectionnez ceux qui sont pertinents pour votre projet.</strong></p><p>Veuillez fournir votre meilleure estimation. Pour les projets pluriannuels, veuillez vous référer à la ventilation des coûts que vous avez soumise les années précédentes.</p>`,
        ar: `<p>يرجى إدخال إجمالي ميزانية نفقات مؤسستكم حسب مجالات التركيز.</p><p>مجالات التركيز محددة مسبقًا. يرجى القيام بذلك لكل مشروع قمتم بتقديمه ضمن القسم 2.1.</p><p><strong>يمكن أن يشمل مشروع واحد عدة مجالات تركيز. استخدموا أي مجالات ذات صلة بالمشروع.</strong></p><p>يرجى استخدام أفضل تقدير لديكم. بالنسبة للمشاريع متعددة السنوات، يرجى مراعاة تفاصيل التكاليف التي قدمتموها في السنوات السابقة.</p>`
    },
    {
       
        id: "total_budget",
        en: "Total Annual Budget",
        sp: "Presupuesto Anual Total",
        fr: "Budget Annuel Total",
        ar: 'إجمالي الميزانية السنوية'
    },
    {
        id: "project_based_area",
        en: "Project budget based on focus area",
        sp: "Desglose por área prioritaria",
        fr: "Ventilation par volet d’intervention",
        ar: "التقسيم حسب مجال التركيز"
    },
    {
        id: "project_based_area_info",
        en: "Please note that the focus areas have been reduced from 22 to 11 in total.",
        sp: "Tenga en cuenta que las áreas de enfoque se han reducido de 22 a 11 en total.",
        fr: "Veuillez noter que les domaines d’intérêt ont été réduits de 22 à 11 au total.",
        ar: "يرجى ملاحظة أن مجالات التركيز قد تم تقليصها من 22 إلى 11 في المجموع."
    },
    {
        id: "project_focus_area",
        en: "Project Focus Area",
        sp: "Área prioritaria del proyecto",
        fr: "Volet d’intervention du projet",
        ar: 'مجال تركيز المشروع'
    },
    {
        id: "strategic_pillar",
        en: "Associated Strategic Pillar",
        sp: "Pilar estratégico asociado",
        fr: "Pilier stratégique associé",
        ar: 'الركيزة الاستراتيجية ذات الصلة'
    },
    {
        id: 'budget_focus_area',
        en: 'Budget by "Project Focus Area"',
        sp: 'Presupuesto por «Área prioritaria del proyecto»',
        fr: 'Budget par « Volet d’intervention du projet » ',
        ar: 'الميزانية حسب "مجال تركيز المشروع"'
    },
    {
        id: "variation_budget",
        en: "Variation from total project budget",
        sp: "Variación del presupuesto total del proyecto",
        fr: "Variation par rapport au budget total du projet",
        ar:  'الاختلاف عن إجمالي ميزانية المشروع'
    },
    {
        id: "choose",
        en: "Choose",
        sp: "elegir",
        fr: "choisir",
        ar: "يختار"
    },
    {
        id: "focus_area_1",
        en: "1. Care: Static Clinic",
        sp: "1. Atención: clínica fija",
        fr: "1. Soins : Clinique statique",
        ar: "1. الرعاية: العيادة الثابتة"
    },
    {
        id: "focus_area_2",
        en: "2. Care: Outreach, mobile clinic, Community-based, delivery",
        sp: "2. Atención: servicios de divulgación, clínica móvil, basada en la comunidad, prestación",
        fr: "2. Soins : Sensibilisation, clinique mobile, communautaire, prestation",
        ar: "2. الرعاية: التوعية، العيادة المتنقلة، المجتمعية، التوصيل"
    },
    {
        id: "focus_area_3",
        en: "3. Care: Other Services, enabled or referred (associated clinics)",
        sp: "3. Atención: otros servicios, facilitados o derivados (clínicas asociadas)",
        fr: "3. Soins : Autres services, facilités ou référés (cliniques associées)",
        ar: "3. الرعاية: خدمات أخرى، متاحة أو محالة (العيادات ذات التبعية غير المباشرة)"
    },
    {
        id: "focus_area_4",
        en: "4. Care: Social Marketing Services",
        sp: "4. Atención: servicios de marketing social",
        fr: "4. Soins : Services de marketing social",
        ar: "4. الرعاية: خدمات التسويق الاجتماعي"
    },
    {
        id: "focus_area_5",
        en: "5. Care: Digital Health Intervention and Selfcare",
        sp: "5. Atención: intervención de salud digital y autocuidado",
        fr: "5. Soins : Interventions de santé numérique et soins auto-administrés",
        ar: "5. الرعاية: التدخل الصحي الرقمي والرعاية الذاتية"
    },
    {
        id: "focus_area_6",
        en: "6. Advocacy",
        sp: "6. Incidencia política",
        fr: "6. Plaidoyer",
        ar: "6. الدعوة"
    },
    {
        id: "focus_area_7",
        en: "7. CSE",
        sp: "7. EIS",
        fr: "7. ESI",
        ar: "7. التثقيف الجنسي الشامل"
    },
    {
        id: "focus_area_8",
        en: "8. CSE Online, including social media",
        sp: "8. EIS en línea, incluidas redes sociales",
        fr: "8. ESI en ligne, y compris les réseaux sociaux",
        ar: "8. التثقيف الجنسي الشامل عبر الإنترنت، بما في ذلك وسائل التواصل الاجتماعي"
    },
    {
        id: "focus_area_9",
        en: "9. Partnerships and Movements: capacity-sharing, amplifying messages, and sub-granting",
        sp: "9. Asociaciones y movimientos: capacidades compartidas, amplificación de mensajes, y subconcesión de subvenciones",
        fr: "9. Partenariats et mouvements – Partage des capacités, amplification des messages et octroi de subventions subsidiaires",
        ar: "9. الشراكات والحركات: تبادل القدرات، تعظيم الرسائل وتقديم المنح الفرعية"
    },
    {
        id: "focus_area_10",
        en: "10. Knowledge, research, evidence, innovation, and publishing, including peer-review articles",
        sp: "10. Conocimientos, investigación, evidencia, innovación, y publicaciones, incluidos artículos sometidos a revisión de pares",
        fr: "10. Connaissances, recherche, données probantes, innovation et édition, y compris des articles soumis à une évaluation par des pairs",
        ar: "10. المعرفة، البحث، الأدلة، الابتكار، والنشر، بما في ذلك المقالات التي يراجعها الأقران"
    },
    {
        id: "focus_area_11",
        en: "11. Internal MA infrastructure, Organisational Development, Capacity Development, values, processes, and procedures",
        sp: "11. Infraestructura interna de la AM, desarrollo organizativo, ampliación de capacidad, valores, procesos, y procedimientos",
        fr: "11. Infrastructure interne de l’association membre, développement organisationnel, renforcement des capacités, valeurs, processus et procédures",
        ar: "11. البنية التحتية الداخلية للجمعية العضو، التطوير التنظيمي، تنمية القدرات، القيم، العمليات، والإجراءات"
    },
    {
        id: "strategic_pillar_1",
        en: "1. Center Care on People",
        sp: "1. Centrar la atención en las necesidades de las personas",
        fr: "1. Centrer les soins sur la personne",
        ar: "1. تركيز الرعاية على الأفراد"
    },
    {
        id: "strategic_pillar_2",
        en: "2. Move the Sexuality Agenda",
        sp: "2. Avanzar en la Agenda sobre Sexualidad",
        fr: "2. Faire évoluer la question de la sexualité",
        ar: "2. الارتقاء بالأجندة الجنسية"
    },
    {
        id: "strategic_pillar_3",
        en: "3. Solidarity for Change",
        sp: "3. Construir solidaridad para lograr el cambio",
        fr: "3. La solidarité pour le changement",
        ar: "3. التكافل من أجل التغيير"
    },
    {
        id: "strategic_pillar_4",
        en: "4. Nurture our Federation",
        sp: "4. Nutrir nuestra Federación",
        fr: "4. Consolider notre Fédération",
        ar: "4. ننمي اتحادنا"
    },

    //2.4 Breakdown by expense category
    {
        id: "breakdown_category",
        en: "2.4 Breakdown by expense category",
        sp: "2.4 Desglose según categoría",
        fr: "2.4 Breakdown by expense category",
        ar: '2.4 التقسيم حسب فئة النفقات'
    }, 
    {
    id: "project_expense_info",
    en: `<p>
        Please list your expenses by expense category per project. Please include all expenses so that your totals are the same as the total of section 2.3. Expense Budget by Focus Area.
      </p>
      <p>
        <strong>Cost categories are defined as follows:</strong>
      </p>
      <p>
        <strong>Personnel:</strong> Includes ALL costs for staff allocated to this project. For each project, this should also include a share of support staff personnel costs (e.g., accounting, HR, senior leadership). No staff costs should appear in "direct project activities" nor in "indirect/support costs." We realize this will make personnel appear higher than it appears in other reports, and that is fine.
      </p>
      <p>
        Staff costs include Salaries, Benefits, Sessional Fees, Severance/Redundancy, Retirement/Pension, Recruitment, Other personnel expenses. Includes temporary workers, interns, uniforms, insurance, taxes, and other fiscal personnel charges. If the MA employs consultants to serve as ongoing service providers (instead of employees), include their fees as well.
      </p>
      <p>
        <strong>Direct project activities:</strong> This includes any direct costs that are not captured under personnel or commodity costs. Can include equipment, professional services, travel, media and print materials, etc. This can include both recurring and capital expenditures. No personnel costs should be included here.
      </p>
      <p>
        <strong>Commodities:</strong> This includes the cost of purchasing medical supplies or contraceptives required for delivery of SRH services. The value of donated commodities should be listed both as an expense and as a source of income (below).
      </p>
      <p>
        <strong>Indirect and support costs:</strong> This includes occupancy costs, utilities, and other support functions that are not direct project costs and not captured in the above categories. This can include both recurring and capital expenditures. No personnel costs should be included here.
      </p>`,

    sp: `<p>
        Por favor, enumera tus gastos por categoría de gasto por proyecto. Incluye todos los gastos para que tus totales coincidan con el total de la sección 2.3. Presupuesto de gastos por área de enfoque.
      </p>
      <p>
        <strong>Las categorías de costos se definen de la siguiente manera:</strong>
      </p>
      <p>
        <strong>Personal:</strong> Incluye TODOS los costos del personal asignado a este proyecto. Para cada proyecto, esto también debe incluir una parte de los costos de personal de apoyo (por ejemplo, contabilidad, recursos humanos, alta dirección). Ningún costo de personal debe aparecer en «actividades directas del proyecto» ni en «costos indirectos/de apoyo». Somos conscientes de que esto hará que los gastos de personal parezcan más elevados de lo que aparecen en otros informes, y eso está bien.
      </p>
      <p>
        Los costos de personal incluyen salarios, prestaciones, honorarios por período de trabajo, indemnizaciones por despido o reducción de personal, jubilación o pensión, reclutamiento y otros gastos de personal. Incluye trabajadores temporales, pasantes, uniformes, seguros, impuestos y otros cargos fiscales relacionados con el personal. Si la MA contrata a consultores para que presten servicios de forma continua (en lugar de empleados), incluya también sus honorarios.
      </p>
      <p>
        <strong>Actividades directas del proyecto:</strong> Esto incluye cualquier costo directo que no se contemple en los costos de personal o de bienes. Puede incluir equipo, servicios profesionales, viajes, medios de comunicación y materiales impresos, etc. Esto puede abarcar tanto gastos recurrentes como de capital. No se deben incluir aquí costos de personal.
      </p>
      <p>
        <strong>Productos básicos:</strong> Esto incluye el costo de adquisición de suministros médicos o anticonceptivos necesarios para la prestación de servicios de salud sexual y reproductiva. El valor de los productos básicos donados debe registrarse tanto como gasto como fuente de ingresos (más abajo).
      </p>
      <p>
        <strong>Costos indirectos y de apoyo:</strong> Esto incluye los costos de ocupación, los servicios públicos y otras funciones de apoyo que no son costos directos del proyecto y que no se incluyen en las categorías anteriores. Esto puede incluir tanto gastos recurrentes como de capital. No se deben incluir aquí los costos de personal.
      </p>`,

    fr: `<p>
        Veuillez répertorier vos dépenses par catégorie de dépenses et par projet. Veuillez inclure toutes les dépenses afin que vos totaux correspondent au total de la section 2.3. « Budget des dépenses par domaine d'intervention ».
      </p>
      <p>
        <strong>Les catégories de coûts sont définies comme suit :</strong>
      </p>
      <p>
        <strong>Personnel :</strong> comprend TOUS les coûts liés au personnel affecté à ce projet. Pour chaque projet, cela doit également inclure une part des coûts de personnel de soutien (par exemple, comptabilité, RH, direction). Aucun coût de personnel ne doit apparaître dans les « activités directes du projet » ni dans les « coûts indirects/de soutien ». Nous sommes conscients que cela fera apparaître les coûts de personnel plus élevés que dans d’autres rapports, et cela ne pose aucun problème.
      </p>
      <p>
        Les frais de personnel comprennent les salaires, les avantages sociaux, les honoraires des intervenants ponctuels, les indemnités de licenciement/de départ, les cotisations de retraite/pension, les frais de recrutement et les autres dépenses liées au personnel. Cela inclut les travailleurs temporaires, les stagiaires, les uniformes, les assurances, les charges sociales et autres charges fiscales liées au personnel. Si l’organisme gestionnaire (MA) fait appel à des consultants pour fournir des services de manière continue (au lieu d’employés), incluez également leurs honoraires.
      </p>
      <p>
        <strong>Activités directes du projet :</strong> Cette rubrique comprend tous les coûts directs qui ne sont pas pris en compte dans les coûts de personnel ou de biens et services. Elle peut inclure le matériel, les services professionnels, les frais de déplacement, les supports médiatiques et les documents imprimés, etc. Elle peut inclure à la fois des dépenses courantes et des dépenses d’investissement. Aucun coût de personnel ne doit être inclus ici.
      </p>
      <p>
        <strong>Produits :</strong> Cette rubrique comprend le coût d’achat des fournitures médicales ou des contraceptifs nécessaires à la prestation des services de santé sexuelle et reproductive. La valeur des produits donnés doit être indiquée à la fois comme une dépense et comme une source de revenus (ci-dessous).
      </p>
      <p>
        <strong>Coûts indirects et de soutien :</strong> Cette rubrique comprend les frais liés aux locaux, aux services publics et aux autres fonctions de soutien qui ne constituent pas des coûts directs du projet et ne sont pas pris en compte dans les catégories ci-dessus. Elle peut inclure à la fois des dépenses courantes et des dépenses d’investissement. Aucun coût de personnel ne doit être inclus ici.
      </p>`,
    ar: `<p>
        يرجى سرد نفقاتك حسب فئة النفقات لكل مشروع. يرجى تضمين جميع النفقات بحيث تتطابق إجمالياتك مع إجمالي القسم 2.3. «ميزانية النفقات حسب مجال التركيز».
      </p>
      <p>
        <strong>يتم تعريف فئات التكاليف على النحو التالي:</strong>
      </p>
      <p>
        <strong>الموظفون:</strong> تشمل جميع تكاليف الموظفين المخصصين لهذا المشروع. وبالنسبة لكل مشروع، ينبغي أن يشمل ذلك أيضًا حصة من تكاليف موظفي الدعم (مثل المحاسبة، والموارد البشرية، والقيادة العليا). ولا ينبغي أن تظهر أي تكاليف للموظفين في بند «أنشطة المشروع المباشرة» ولا في بند «التكاليف غير المباشرة/تكاليف الدعم». ونحن ندرك أن هذا سيجعل تكاليف الموظفين تبدو أعلى مما تظهر في التقارير الأخرى، ولا بأس بذلك.
      </p>
      <p>
        تشمل تكاليف الموظفين الرواتب، والمزايا، وأتعاب العمل المؤقت، ومكافآت إنهاء الخدمة/التسريح، والتقاعد/المعاشات، والتوظيف، ونفقات الموظفين الأخرى. وتشمل العمال المؤقتين، والمتدربين، والزي الرسمي، والتأمين، والضرائب، والمصاريف المالية الأخرى المتعلقة بالموظفين. إذا استعانت الجهة المنفذة (MA) بمستشارين للعمل كمقدمي خدمات مستمرين (بدلاً من الموظفين)، فيجب إدراج أتعابهم أيضًا.
      </p>
      <p>
        <strong>أنشطة المشروع المباشرة:</strong> تشمل أي تكاليف مباشرة لا يتم إدراجها ضمن تكاليف الموظفين أو تكاليف السلع. ويمكن أن تشمل المعدات، والخدمات المهنية، والسفر، ووسائل الإعلام والمواد المطبوعة، وما إلى ذلك. ويمكن أن تشمل هذه التكاليف كلاً من النفقات المتكررة ونفقات رأس المال. ولا ينبغي إدراج أي تكاليف للموظفين هنا.
      </p>
      <p>
        <strong>السلع:</strong> تشمل هذه البند تكلفة شراء المستلزمات الطبية أو وسائل منع الحمل اللازمة لتقديم خدمات الصحة الجنسية والإنجابية. وينبغي إدراج قيمة السلع المتبرع بها كنفقة وكمصدر للدخل (أدناه).
      </p>
      <p>
        <strong>التكاليف غير المباشرة وتكاليف الدعم:</strong> تشمل هذه التكاليف تكاليف الإيجار والمرافق والوظائف الداعمة الأخرى التي لا تُعد تكاليف مباشرة للمشروع ولا تندرج ضمن الفئات المذكورة أعلاه. ويمكن أن تشمل هذه التكاليف النفقات المتكررة ونفقات رأس المال. ولا ينبغي إدراج أي تكاليف متعلقة بالموظفين هنا.
      </p>`
    },
    {
        id: "project_based_category",
        en: "Project budget based on expense category",
        sp: "Presupuesto del proyecto basado en la categoría de gastos",
        fr: "Budget du projet basé sur la catégorie de dépenses",
        ar: 'ميزانية المشروع على أساس فئة النفقات'
    },
    {
        id: "expense_category",
        en: "Expense Category",
        sp: "Categoría de gastos",
        fr: "Catégorie de dépenses",
        ar: 'فئة الإنفاق'
    },
    {
        id: "project_expense_category",
        en: "Project by Expense Category",
        sp: "Proyecto según la categoría de gastos",
        fr: "Projet par catégorie de dépenses",
        ar: 'المشروع حسب فئة الإنفاق'
    },
    {
        id: "personnel",
        en: "Personnel",
        sp: "Personal",
        fr: "Personnel",
        ar: 'الأفراد'
    },
    {
        id: "activities",
        en: "Direct project activities",
        sp: "Costos directos de actividades del proyecto",
        fr: "Activités directes du projet",
        ar: 'أنشطة المشروع المباشرة'
    },
    {
        id: "commodities",
        en: "Commodities",
        sp: "Productos",
        fr: "Produits",
        ar: 'السلع الطبية'
    },
    {
        id: "indirect",
        en: "Indirect/ support costs",
        sp: "Costos indirectos/de apoyo",
        fr: "Coûts indirects/de soutien",
        ar:  'تكاليف غير مباشرة/الدعم'
    },
    // 3.1 Total Income
    {
        id: 'incomeSubCategories',
        en: 'Income Sub-Categories',
        sp: 'Subcategorías de ingresos',
        fr: 'Sous-catégories de revenus',
        ar: 'فئات الدخل الفرعية'
    },
    {
        id: "income",
        en: "Income",
        sp: "Ingreso",
        fr: "Revenus",
        ar: "دخل"
    },
    {
        id: "year",
        en: "Year",
        sp: "año",
        fr: "année",
        ar: "سنة"
    },
    {
        id: "restricted",
        en: "Restricted",
        sp: "Restringidos",
        fr: "Avec restrictions",
        ar: 'المقيد'
    },
    {
        id: "unrestricted",
        en: "Unrestricted",
        sp: "No restringidos",
        fr: "Sans restrictions",
        ar: 'غير المقيد'
    },
    {
        id: "total",
        en: "Total",
        sp: "Totales",
        fr: "Total",
        ar: 'المجموع'
    },
    {
        id: "deficit",
        en: "Deficit/Surplus",
        sp: "Déficit/Superávit",
        fr: "Déficit/Excédent",
        ar: 'العجز/الفائض'
    },
    {
        id: "income_details",
        en: "Income Details",
        sp: "Detalles de ingresos",
        fr: "Détails du revenu",
        ar: 'تفاصيل الدخل'
    },
    {
        id: "income_category",
        en: "Income Category",
        sp: "Categoría de ingresos",
        fr: "Catégorie de revenu",
        ar: 'فئة الدخل'
    },
    {
        id: "sub_category",
        en: "Sub Category",
        sp: "Subcategoría",
        fr: "Sous-catégorie",
        ar: 'فئة فرعية'
    },
    {
        id: "locally-generated",
        en: "Locally generated income",
        sp: "Ingresos generados de forma local",
        fr: "Revenus générés localement",
        ar: "الدخل من مصادر محلية"
    },
    {
        id: "international-income",
        en: "International income (Non - IPPF)",
        sp: "Internacionales (no procedentes de la IPPF)",
        fr: "Internationaux (hors IPPF)",
        ar: "الدخل الدولي (من غير IPPF)"
    },
    {
        id: "ippf-income",
        en: "IPPF income",
        sp: "de la IPPF",
        fr: "de l’IPPF",
        ar: "دخل اتحاد IPPF"
    },
    {
        id: "multinational-agencies",
        en: "Multilateral Agencies and Organizations",
        sp: "ORGANIZACIONES Y AGENCIAS MULTILATERALES",
        fr: "ORGANISATIONS ET AGENCES MULTILATÉRALES",
        ar: "الوكالات والمنظمات المتعددة الأطراف"
    },
    {
        id: "foriegn-governments",
        en: "Foreign Governments",
        sp: "GOBIERNOS EXTRANJEROS",
        fr: "ÉTATS ÉTRANGERS",
        ar: "الحكومات الأجنبية"
    },
    {
        id: "interational-trusts",
        en: "International Trusts and Foundations / NGOs",
        sp: "PATRONATOS Y FUNDACIONES INTERNACIONALES / ONG",
        fr: "TRUSTS INTERNATIONAUX ET FONDATIONS/ONG",
        ar: "الاتحادات والمؤسسات الدولية / المنظمات غير الحكومية"
    },
    {
        id: "corporate-sector",
        en: "Corporate / Business Sector",
        sp: "SECTOR CORPORATIVO/COMERCIAL",
        fr: "SECTEUR COMMERCIAL/ENTREPRISES",
        ar: "قطاع الشركات / الأعمال"
    },
    {
        id: "other-international-income",
        en: "Other International Income",
        sp: "OTROS INGRESOS INTERNACIONALES",
        fr: "AUTRE REVENU INTERNATIONAL",
        ar: "دخل دولي من مصادر أخرى"
    },
    {
        id: "commodity-sales",
        en: "Commodity sales (including contraceptive, other SRH and non-SRH supplies/products)",
        sp: "VENTAS DE PRODUCTOS (incluyendo anticonceptivos, otros suministros/productos de SSR y de otro tipo)",
        fr: "Ventes de fournitures (y compris de contraceptifs, des fournitures/produits de SSR et non SSR) ",
        ar: "مبيعات السلع الطبية (بما في ذلك وسائل منع الحمل، ومستلزمات/منتجات الصحة الجنسية والإنجابية وغيرها) "
    },
    {
        id: "client-fees",
        en: "Client/Patient fees",
        sp: "PAGOS DE CLIENTES/PACIENTES",
        fr: "HONORAIRES DE CLIENTS/PATIENTS",
        ar: "رسوم المستفيدين/المرض"
    },
    {
        id: "services-rental",
        en: "Training, education, professional services and rentals",
        sp: "Capacitación, educación, servicios profesionales y alquileres ",
        fr: "Formation, éducation, services professionnels et locations ",
        ar: "التدريب والتثقيف والخدمات المهنية والتأجير "
    },
    {
        id: "local-government",
        en: "Local/national: government",
        sp: "Local/nacional: gubernamental ",
        fr: "Administration publique locale/nationale ",
        ar: "محلي/وطني: الحكومة "
    },
    {
        id: "local-nongovernment",
        en: "Local/national: non-government",
        sp: "Local/nacional: no gubernamental ",
        fr: "Organisme non public local/national ",
        ar: "محلي/وطني: غير حكومي"
    },
    {
        id: "membership-fees",
        en: "Membership fees",
        sp: "Cuotas de membresía ",
        fr: "Honoraires d’adhésion ",
        ar: "رسوم العضوية "
    },
    {
        id: "nonoperational-income",
        en: "Non-operational income",
        sp: "INGRESOS NO OPERATIVOS",
        fr: "REVENUS NON LIÉS À L’EXPLOITATION",
        ar: "الدخل غير التشغيلي"
    },
    {
        id: "other-income",
        en: "Other national income",
        sp: "OTROS INGRESOS NACIONALES",
        fr: "AUTRES REVENUS NATIONAUX",
        ar: "دخل وطني من مصادر أخرى"
    },
    {
        id: "ippf-restricted",
        en: "Other IPPF Grant",
        sp: "Otra subvención de IPPF",
        fr: "Autre subvention IPPF",
        ar: "منحة IPPF أخرىF"
    },
    {
        id: "ippf-unrestricted",
        en: "IPPF Core Grant",
        sp: "Subvención básica de IPPF",
        fr: "Subvention de base de l'IPPF",
        ar: "منحة IPPF الأساسية"
    },
    {
        id: "organisation_contributor",
        en: "Which organisation (government, trust, foundation, IPPF or other donor) was the largest contributor?",
        sp: "Quelle organisation (gouvernement, trust, fondation, IPPF ou autre donateur) a été le principal contributeur?",
        fr: "¿Qué organización (gobierno, fideicomiso, fundación, IPPF u otro donante) fue la que más contribuyó?",
        ar: "ما هي المنظمة (حكومية، أو صندوق استئماني، أو مؤسسة، أو الاتحاد الدولي لتنظيم الأسرة (IPPF)، أو جهة مانحة أخرى) التي قدمت أكبر مساهمة؟"
    },
    {
        id: "income_provided",
        en: "How much income did they provide?",
        sp: "¿Qué cantidad de ingresos proporcionó?",
        fr: "Quel est le montant de son apport ?",
        ar: 'ما مقدار الدخل الذي قدموه؟ '
    },
    //Income by Donor
    {
        id: "anticipated_income",
        en: "3.2 Anticipated income by donor",
        sp: "3.2 Ingresos previstos por donante",
        fr: "3.2 Recettes anticipées par bailleur de fonds",
        ar: "2.3 الدخل المتوقع حسب الجهة المانحة"
    },
   {
    id: "value_add_core_funding",
    en: "<p>This section is about unlocking of additional funding as a result of having access to IPPF core funding. Please only fill in where relevant. Please do not assume that all other funding you receive is a result of IPPF core funding. Please be specific about what funds you will have in the implementing period that you would not have had if not for access to IPPF core funding.</p><p>Examples might include a donor that will only give you a grant to cover programmatic costs if you can cover salary costs, and you used the core funding to cover those salary costs. Other examples might include a donor that requires you to co-fund 10% of salary costs, and you used core funding to cover those salary costs.</p>",
    sp: "<p>Esta sección trata sobre la obtención de financiamiento adicional como resultado de tener acceso al financiamiento básico de la IPPF. Por favor, completa solo los campos que sean pertinentes. No des por sentado que todo el resto del financiamiento que recibas sea resultado del financiamiento básico de la IPPF. Sé específico sobre qué fondos contarás durante el período de ejecución que no hubieras tenido de no ser por el acceso al financiamiento básico de la IPPF.</p><p>Algunos ejemplos podrían ser un donante que solo te otorgue una subvención para cubrir los costos del programa si puedes cubrir los costos salariales, y tú utilizaste la financiación básica para cubrir esos costos salariales. Otros ejemplos podrían incluir un donante que te exija cofinanciar el 10 % de los costos salariales, y tú utilizaste la financiación básica para cubrir esos costos salariales.</p>",
    fr: "<p>Cette section porte sur l’obtention de financements supplémentaires grâce à l’accès au financement de base de l’IPPF. Veuillez ne remplir cette section que si cela s’applique à votre cas. Ne partez pas du principe que tous les autres financements que vous recevez découlent du financement de base de l’IPPF. Précisez clairement quels sont les fonds dont vous disposerez pendant la période de mise en œuvre et que vous n’auriez pas obtenus sans l’accès au financement de base de l’IPPF.</p><p>Par exemple, un bailleur de fonds peut vous accorder une subvention destinée à couvrir les coûts programmatiques uniquement si vous prenez en charge les coûts salariaux, et vous avez utilisé le financement de base pour couvrir ces coûts salariaux. Autre exemple : un bailleur de fonds peut exiger que vous cofinanciez 10 % des coûts salariaux, et vous avez utilisé le financement de base pour couvrir ces coûts salariaux.</p>",
    ar: "<p>يتناول هذا القسم مسألة الحصول على تمويل إضافي نتيجةً للحصول على التمويل الأساسي من الاتحاد الدولي لتنظيم الأسرة (IPPF). يرجى ملء البيانات فقط في الحالات ذات الصلة. يرجى عدم الافتراض بأن جميع أشكال التمويل الأخرى التي تتلقاها هي نتيجة للتمويل الأساسي من الاتحاد الدولي لتنظيم الأسرة (IPPF). يرجى التحديد بدقة للأموال التي ستتوفر لديك خلال فترة التنفيذ والتي ما كنت لتحصل عليها لولا حصولك على التمويل الأساسي من الاتحاد الدولي لتنظيم الأسرة (IPPF).</p><p>ومن الأمثلة على ذلك، أن يمنحك أحد المانحين منحة لتغطية تكاليف البرنامج فقط إذا تمكنت من تغطية تكاليف الرواتب، وقمت باستخدام التمويل الأساسي لتغطية تلك التكاليف. ومن الأمثلة الأخرى، أن يشترط أحد المانحين أن تشارك في تمويل 10% من تكاليف الرواتب، وقمت باستخدام التمويل الأساسي لتغطية تلك التكاليف.</p>"
    },
    {
    id: "income_donor_info",
    en: `<p>
        Please fill in your annual income by donor. The donor is defined as the entity providing the income. Please provide a clear breakdown that matches the full income reported under Section 3.1. In cases where the income is autogenerated, e.g. through social enterprise, or sale of services, please indicate your organisational name as the donor.
      </p>`,
    sp: `<p>
        Indica tus ingresos anuales por donante. Se entiende por «donante» la entidad que proporciona los ingresos. Facilita un desglose claro que coincida con los ingresos totales declarados en la sección 3.1. En los casos en que los ingresos se generen, por ejemplo, a través de una empresa social o de la venta de servicios, indica el nombre de tu organización como donante.
      </p>`,
    fr: `<p>
        Veuillez indiquer vos revenus annuels par donateur. On entend par « donateur » l'entité qui génère ces revenus. Veuillez fournir une ventilation claire qui corresponde à l'intégralité des revenus déclarés à la section 3.1. Lorsque les revenus proviennent, par exemple, d'une entreprise sociale ou de la vente de services, veuillez indiquer le nom de votre organisation en tant que donateur.
      </p>`,
    ar: `<p>
        يرجى إدخال دخلك السنوي حسب الجهة المانحة. تُعرَّف الجهة المانحة بأنها الكيان الذي يوفر الدخل. يرجى تقديم تفصيل واضح يتطابق مع إجمالي الدخل المُبلغ عنه في القسم 3.1. وفي الحالات التي يتم فيها توليد الدخل من خلال، على سبيل المثال، مشروع اجتماعي أو بيع خدمات، يرجى الإشارة إلى اسم مؤسستك باعتبارها الجهة المانحة.
      </p>`
    },
    {
    id: "additional_funding_info",
    en: `<p>
        This section is about unlocking additional funding as a result of having access to IPPF core funding. Please only complete this section where relevant. Please do not assume that all other funding you receive is a result of IPPF core funding. Please be specific about what funds you will have during the implementation period that you would not have had without access to IPPF core funding.
      </p>
      <p class="mb-0">
        Examples might include a donor that will only provide you with a grant to cover programme costs if you can cover salary costs, and you used the core funding to cover those salary costs. Another example might be a donor that requires you to co-fund 10% of salary costs, and you used the core funding to cover those salary costs.
      </p>`,

    sp: `<p>
        Esta sección trata sobre la obtención de financiamiento adicional como resultado de tener acceso al financiamiento básico de la IPPF. Por favor, completa solo los campos que sean pertinentes. No des por sentado que todo el resto del financiamiento que recibas sea resultado del financiamiento básico de la IPPF. Sé específico sobre qué fondos contarás durante el período de ejecución que no hubieras tenido de no ser por el acceso al financiamiento básico de la IPPF.
      </p>
      <p class="mb-0">
        Algunos ejemplos podrían ser un donante que solo te otorgue una subvención para cubrir los costos del programa si puedes cubrir los costos salariales, y tú utilizaste la financiación básica para cubrir esos costos salariales. Otros ejemplos podrían incluir un donante que te exija cofinanciar el 10 % de los costos salariales, y tú utilizaste la financiación básica para cubrir esos costos salariales.
      </p>`,

    fr: `<p>
        Cette section porte sur l’obtention de financements supplémentaires grâce à l’accès au financement de base de l’IPPF. Veuillez ne remplir cette section que si cela s’applique à votre cas. Ne partez pas du principe que tous les autres financements que vous recevez découlent du financement de base de l’IPPF. Précisez clairement quels sont les fonds dont vous disposerez pendant la période de mise en œuvre et que vous n’auriez pas obtenus sans l’accès au financement de base de l’IPPF.
      </p>
      <p class="mb-0">
        Par exemple, un bailleur de fonds peut vous accorder une subvention destinée à couvrir les coûts programmatiques uniquement si vous prenez en charge les coûts salariaux, et vous avez utilisé le financement de base pour couvrir ces coûts salariaux. Autre exemple : un bailleur de fonds peut exiger que vous cofinanciez 10 % des coûts salariaux, et vous avez utilisé le financement de base pour couvrir ces coûts salariaux.
      </p>`,

    ar: `<p>
        يتناول هذا القسم مسألة الحصول على تمويل إضافي نتيجةً للحصول على التمويل الأساسي من الاتحاد الدولي لتنظيم الأسرة (IPPF). يرجى ملء البيانات فقط في الحالات ذات الصلة. يرجى عدم الافتراض بأن جميع أشكال التمويل الأخرى التي تتلقاها هي نتيجة للتمويل الأساسي من الاتحاد الدولي لتنظيم الأسرة (IPPF). يرجى التحديد بدقة للأموال التي ستتوفر لديك خلال فترة التنفيذ والتي ما كنت لتحصل عليها لولا حصولك على التمويل الأساسي من الاتحاد الدولي لتنظيم الأسرة (IPPF).
      </p>
      <p class="mb-0">
        ومن الأمثلة على ذلك، أن يمنحك أحد المانحين منحة لتغطية تكاليف البرنامج فقط إذا تمكنت من تغطية تكاليف الرواتب، وقمت باستخدام التمويل الأساسي لتغطية تلك التكاليف. ومن الأمثلة الأخرى، أن يشترط أحد المانحين أن تشارك في تمويل 10% من تكاليف الرواتب، وقمت باستخدام التمويل الأساسي لتغطية تلك التكاليف.
      </p>`
    },
    {
        id: "total_anticipated",
        en: "Total anticipated income",
        sp: "Ingresos totales previstos",
        fr: "Total Recettes anticipées",
        ar: 'إجمالي الدخل المتوقع'
    },
    {
        id: "donor_details",
        en: "Name of Donor",
        sp: "Nombre del donante",
        fr: "Nom du donateur",
        ar:'اسم المتبرع'
    },
    {
        id: "duration_details",
        en: "Duration of grant",
        sp: "Duración de la subvención",
        fr: "Durée de la subvention",
        ar: "مدة المنحة"
    },
    {
    id: "total_funding_donor",
    en: "Unlocked Funding",
    sp: "Financiamiento desbloqueado",
    fr: "Financement débloqué",
    ar: "التمويل المفتوح"
    },
    {
        id: "add_new_donor",
        en: "Add New Donor",
        sp: "Agregar nuevo donante",
        fr: "Ajouter un nouveau donateur",
        ar: 'إضافة مانح جديد'
    },
    {
        id: "donor_name",
        en: "Donor name",
        sp: "Nombre del donante",
        fr: "Nom du donateur'",
        ar: 'اسم الجهة المانحة'
    },
    {
        id: "grant_description",
        en: "Brief description of the grant, or notes on its likelihood of success (max 50 words)",
        sp: "Breve descripción de la subvención o notas sobre sus probabilidades de éxito (máximo 50 palabras)",
        fr: "Brève description de la subvention ou notes sur ses chances de succès (50 mots maximum)",
        ar: "وصف موجز للمنحة، أو ملاحظات حول احتمالات نجاحها (بحد أقصى 50 كلمة)"
    },
    //3.3 Value add of core funding
    {
    id: "amount_unlocked",
    en: "Total Amount Unlocked",
    sp: "Cantidad total desbloqueada",
    fr: "Montant total débloqué",
    ar: "إجمالي المبلغ المفتوح"
    },
    {
        id: "value_add_title",
        en: "Briefly describe the value add of the IPPF unrestricted funding towards achieving your strategic priorities for the funding cycle",
        sp: "Describa brevemente el valor agregado de los fondos no restringidos del IPPF para lograr sus prioridades estratégicas para el ciclo de financiación.",
        fr: "Décrivez brièvement la valeur ajoutée des fonds sans restriction de l’IPPF pour atteindre vos priorités stratégiques pour le cycle de financement.",
        ar: "قم بوصف القيمة المضافة التي تقدمها أموال الاتحاد الدولي لتنظيم الأسرة غير المقيدة بشكل موجز لتحقيق أولوياتك الاستراتيجية لدورة التمويل."
    },
    {
        id: "relevant_description",
        en: "Amount If relevant, please list specific funding unlocked by the IPPF Stream 1 funding, including the source and amount of the grant unlocked.",
        sp: "Si es pertinente, indique fondos específicos desbloqueados por la Línea 1 de financiamiento de IPPF, incluida la fuente y la cantidad de la subvención desbloqueada.",
        fr: "S’il y a lieu, veuillez indiquer les fonds spécifiques débloqués au titre des fonds du Volet 1 de l’IPPF, y compris la source et le montant de la subvention débloquée. ",
        ar: "المبلغ إذا كان ذلك ذا صلة ، يُرجى إدراج التمويل المحدد الذي تم الحصول عليه بفضل تمويل المرحلة الأولى من الاتحاد الدولي لتنظيم الاسرة، بما في ذلك مصدر التمويل وقيمة المنحة التي تم الحصول عليها."
    },
    //Order Commodities
    {
        id: "summary_commodities",
        en: "Summary of Core Grant in Cash & Commodities",
        sp: "Resumen de la subvención básica en efectivo y en productos",
        fr: "Résumé de la subvention de base en espèces et en matières premières",
        ar: "ملخص المنحة الأساسية في النقد والسلع"
    },
    {
        id: "order_commodities_info",
        en: `  <p>Note:</p>
        <ul class="list">
          <li>
            Scroll below and fill this form if you are ordering commodities from IPPF using your IPPF grant; otherwise, it can remain blank.
          </li>
          <li>
            The value of the commodities you order below will affect how much of your IPPF grant you will receive in cash versus commodities (as shown at the bottom of the form).
          </li>
          <li>
            Please only make a request for commodities you are allowed to import into your country. Our contracted manufacturers will require you to confirm the certainty of obtaining an import waiver for the requested commodities, should the commodities not be registered in your country.
          </li>
          <li>
            Please review the notes below the product you want to order.
            <ul>
              <li>
                Prices for products can be subject to your country’s World Bank Classification. <a href="https://blogs.worldbank.org/en/opendata/understanding-country-income--world-bank-group-income-classifica">Click on this link to find your country’s status</a>.
              </li>
              <li>
                Products can be subject to mandatory order multiples. The order form will only allow you to enter these mandatory quantities.
              </li>
              <li>
                Product can be subject to a Minimum Order Quantity. Only if the combined order quantities from all MAs meet this threshold, we can confirm to supply the product you request.
              </li>
            </ul>
          </li>
          <li>
            Transport costs will be added to the total costs when shipments are ready. For budgeting purposes only, the form works with following estimated standard rates:
          <ul>
            <li>
              100% value of your commodity order if your product request has a value between $0 and $1,999.
            </li>
            <li>
              50% value of your commodity order if your product request has a value between $2,000 and $4,999.
            </li>
            <li>
              40% value of your commodity order if your product request has a value between $5,000 and $9,999.
            </li>
            <li>
              30% value of your commodity order if your product request has a value higher than $10,000.
            </li>
          </ul>
          </li>
          <li>
            This is an indicative budgeting exercise only, commodities quantification for 2027 will be finalized in October 2026 per the initiative of the supply chain management (SCM) team.
          </li>
          <li>
            If you wish to procure products from IPPF that are funded by a different grant (e.g., restricted project), please email the supply chain team (sheath@ippf.org).
          </li>
          <li>
            If you wish to procure products that are not listed below (e.g., medical equipment, medical consumables, generic medicines), email the supply chain team (sheath@ippf.org).
          </li>
        </ul>
    
        <p class="mb-0">We cannot accept cancellations or changes to your request once your order is finalised and confirmed by the SCM team. </p>`,
        sp:`<p>Nota:</p>
        <ul class="list">
          <li>
            Desplázate hacia abajo y llena este formulario si vas a solicitar productos de la IPPF utilizando tu subvención de la IPPF; de lo contrario, puedes dejarlo en blanco.
          </li>
          <li>
            El valor de los productos que solicites a continuación influirá en la proporción de tu subvención de la IPPF que recibirás en efectivo frente a la que recibirás en productos (como se muestra al final del formulario).
          </li>
          <li>
            Por favor, solicita únicamente productos que estés autorizado a importar a tu país. Nuestros fabricantes contratados le pedirán que confirme que obtendrá una exención de importación para los productos solicitados, en caso de que estos no estén registrados en su país.
           </li>
          <li>
          Revise las notas que aparecen debajo del producto que desea pedir.
            <ul>
              <li>
                Los precios de los productos pueden estar sujetos a la Clasificación del Banco Mundial de su país.
                <a href="https://blogs.worldbank.org/en/opendata/understanding-country-income--world-bank-group-income-classifica"> Haga clic en este enlace para conocer el estatus de su país.</a>.
              </li>
              <li>
                Los productos pueden estar sujetos a cantidades mínimas de pedido obligatorias. El formulario de pedido solo le permitirá ingresar estas cantidades obligatorias.
              </li>
              <li>
                El producto puede estar sujeto a una cantidad mínima de pedido. Solo si las cantidades combinadas de los pedidos de todos los socios de mercado (MA) alcanzan este umbral, podremos confirmar el suministro del producto que solicitas.
              </li>
            </ul>
          </li>
          <li>
            Los costos de transporte se sumarán al costo total cuando los envíos estén listos. Solo para fines de presupuesto, el formulario utiliza las siguientes tarifas estándar estimadas:
          <ul>
            <li>
                100 % del valor de tu pedido de productos básicos si tu solicitud tiene un valor entre $0 y $1,999.
            </li>
            <li>
                50 % del valor de su pedido de productos básicos si su solicitud de productos tiene un valor entre $2,000 y $4,999.
            </li>
            <li>
                40 % del valor de su pedido de productos básicos si su solicitud de productos tiene un valor entre $5,000 y $9,999.
            </li>
            <li>
                30 % del valor de su pedido de productos básicos si su solicitud de productos tiene un valor superior a $10,000.
            </li>
          </ul>
          </li>
          <li>
            Este es solo un ejercicio presupuestario indicativo; la cuantificación de productos básicos para 2027 se finalizará en octubre de 2026, según la iniciativa del equipo de gestión de la cadena de suministro (SCM).
          </li>
          <li>
            Si deseas adquirir productos de la IPPF que estén financiados por una subvención diferente (por ejemplo, un proyecto restringido), envía un correo electrónico al equipo de la cadena de suministro (sheath@ippf.org).
          </li>
          <li>
            Si desea adquirir productos que no figuran en la lista a continuación (por ejemplo, equipo médico, consumibles médicos, medicamentos genéricos), envíe un correo electrónico al equipo de cadena de suministro (sheath@ippf.org).
        </li>
        </ul>
    
        <p class="mb-0">
            No podemos aceptar cancelaciones ni cambios en su solicitud una vez que su pedido haya sido finalizado y confirmado por el equipo de SCM.
        </p>`,
        fr: 
        `  <p>Remarque:</p>
        <ul class="list">
          <li>
            Faites défiler la page vers le bas et remplissez ce formulaire si vous commandez des produits auprès de l’IPPF en utilisant votre subvention IPPF ; sinon, vous pouvez le laisser vide
          </li>
          <li>
            La valeur des produits que vous commandez ci-dessous aura une incidence sur la répartition de votre subvention IPPF entre les versements en espèces et les produits (comme indiqué au bas du formulaire).
          </li>
          <li>
            Veuillez ne demander que des produits que vous êtes autorisé(e) à importer dans votre pays. Nos fabricants sous contrat vous demanderont de confirmer que vous êtes certain d’obtenir une dérogation d’importation pour les produits demandés, si ceux-ci ne sont pas enregistrés dans votre pays.
          </li>
          <li>
            Veuillez consulter les remarques figurant sous le produit que vous souhaitez commander.
            <ul>
              <li>
                Les prix des produits peuvent dépendre de la classification de la Banque mondiale attribuée à votre pays.
                <a href="https://blogs.worldbank.org/en/opendata/understanding-country-income--world-bank-group-income-classifica">Cliquez sur ce lien pour connaître le statut de votre pays.</a>.
              </li>
              <li>
                Les produits peuvent être soumis à des quantités minimales de commande obligatoires. Le formulaire de commande ne vous permettra de saisir que ces quantités obligatoires.
              </li>
              <li>
                Le produit peut être soumis à une quantité minimale de commande. Ce n’est que si les quantités commandées cumulées par l’ensemble des autorités contractantes (MA) atteignent ce seuil que nous pourrons confirmer la fourniture du produit que vous demandez.
              </li>
            </ul>
          </li>
          <li>
            Les frais de transport seront ajoutés au montant total lorsque les expéditions seront prêtes. À des fins de budgétisation uniquement, le formulaire utilise les taux standard estimés suivants :
          <ul>
            <li>
                100 % de la valeur de votre commande de produits si la valeur de votre demande de produit est comprise entre 0 et 1 999 dollars.
            </li>
            <li>
                50 % de la valeur de votre commande de produits de base si la valeur de votre demande de produit est comprise entre 2 000 $ et 4 999 $.
            </li>
            <li>
                40 % de la valeur de votre commande de produits de base si la valeur de votre demande de produit est comprise entre 5 000 $ et 9 999 $.
            </li>
            <li>
                30 % de la valeur de votre commande de produits de base si la valeur de votre demande de produit est supérieure à 10 000 $.
            </li>
          </ul>
          </li>
          <li>
            Il s’agit uniquement d’un exercice budgétaire indicatif ; la quantification des produits de base pour 2027 sera finalisée en octobre 2026, à l’initiative de l’équipe de gestion de la chaîne d’approvisionnement (SCM).
          </li>
          <li>
            Si vous souhaitez vous procurer auprès de l’IPPF des produits financés par une autre subvention (par exemple, un projet soumis à des restrictions), veuillez envoyer un e-mail à l’équipe de la chaîne d’approvisionnement (sheath@ippf.org).
          </li>
          <li>
             Si vous souhaitez vous procurer des produits qui ne figurent pas dans la liste ci-dessous (par exemple, du matériel médical, des consommables médicaux, des médicaments génériques), veuillez envoyer un e-mail à l’équipe de la chaîne d’approvisionnement (sheath@ippf.org).
          </li>
        </ul>
    
        <p class="mb-0">
            Nous ne pouvons accepter aucune annulation ni modification de votre demande une fois que votre commande a été finalisée et confirmée par l’équipe SCM.
        </p>`,
        ar:  `<p>ملحوظة:</p>
        <ul class="list">
          <li>
         يرجى التمرير لأسفل وملء هذا النموذج إذا كنت تطلب سلعًا من الاتحاد الدولي لتنظيم الأسرة (IPPF) باستخدام منحة IPPF الخاصة بك؛ وإلا، فيمكن تركه فارغًا.
          </li>
          <li>
         ستؤثر قيمة السلع التي تطلبها أدناه على المبلغ الذي ستحصل عليه من منحة IPPF نقدًا مقابل السلع (كما هو موضح في أسفل النموذج).
          </li>
          <li>
         يرجى تقديم طلب فقط للسلع المسموح باستيرادها إلى بلدك. سيطلب منك المصنعون المتعاقدون معنا تأكيد ضمان الحصول على إعفاء استيراد للسلع المطلوبة، في حال لم تكن هذه السلع مسجلة في بلدك.
          </li>
          <li>
         يرجى مراجعة الملاحظات الموجودة أسفل المنتج الذي ترغب في طلبه.
            <ul>
              <li>
              <a href="https://blogs.worldbank.org/en/opendata/understanding-country-income--world-bank-group-income-classifica">انقر على هذا الرابط لمعرفة حالة بلدك. </a>
              </li>
              <li>
             قد تخضع أسعار المنتجات لتصنيف البنك الدولي الخاص ببلدك
              </li>
              <li>
              قد تخضع المنتجات لحد أدنى إلزامي لكميات الطلب. لن يسمح لك نموذج الطلب إلا بإدخال هذه الكميات الإلزامية.
              </li>
              <li>
              قد يخضع المنتج لحد أدنى لكمية الطلب. لن نتمكن من تأكيد توريد المنتج الذي تطلبه إلا إذا استوفت الكميات الإجمالية للطلبات من جميع الوكلاء المعتمدين (MAs) هذا الحد الأدنى.
              </li>
            </ul>
          </li>
          <li>
        ستُضاف تكاليف النقل إلى التكاليف الإجمالية عندما تكون الشحنات جاهزة. لأغراض الميزانية فقط، يستخدم النموذج المعدلات القياسية التقديرية التالية:
          <ul>
            <li>
            100% من قيمة طلب السلع الخاص بك إذا كانت قيمة طلب المنتج تتراوح بين 0 و1,999 دولارًا أمريكيًا.
            </li>
            <li>
            50% من قيمة طلب السلع الخاص بك إذا كانت قيمة طلب المنتج تتراوح بين 2,000 دولار و4,999 دولار.
            </li>
            <li>
            40% من قيمة طلب السلع الخاص بك إذا كانت قيمة طلب المنتج تتراوح بين 5,000 دولار و9,999 دولار.
            </li>
            <li>
            30% من قيمة طلب السلع الخاص بك إذا كانت قيمة طلب المنتج أعلى من 10,000 دولار.
            </li>
          </ul>
          </li>
          <li>
          هذه مجرد عملية تقديرية للميزانية، وسيتم الانتهاء من تحديد كميات السلع لعام 2027 في أكتوبر 2026 وفقًا لمبادرة فريق إدارة سلسلة التوريد (SCM).
          </li>
          <li>
         إذا كنت ترغب في شراء منتجات من الاتحاد الدولي لتنظيم الأسرة (IPPF) ممولة من منحة مختلفة (مثل مشروع مقيد)، يرجى إرسال بريد إلكتروني إلى فريق سلسلة التوريد (sheath@ippf.org).
          </li>
          <li>
         إذا كنت ترغب في شراء منتجات غير مدرجة أدناه (مثل المعدات الطبية، والمستهلكات الطبية، والأدوية الجنيسة)، يرجى إرسال بريد إلكتروني إلى فريق إدارة سلسلة التوريد (sheath@ippf.org).
          </li>
        </ul>
    
        <p class="mb-0">لا يمكننا قبول أي إلغاءات أو تغييرات على طلبك بمجرد الانتهاء من إعداد طلبك وتأكيده من قبل فريق إدارة سلسلة التوريد (SCM).
        </p>`
    },
    
    {
        id: "total_unrestricted_amount",
        en: "Total Unrestricted Core Grant Amount",
        sp: "Subvención básica no restringida total",
        fr: "Total de la subvention de base sans restrictions",
        ar: "إجمالي مبلغ المنحة الأساسية غير المقيدة"
    },
    {
        id: "total_estimated",
        en: "Total Estimated Cost of Commodities",
        sp: "Costo PREVISTO de los productos",
        fr: "Coût ESTIMATIF des produits",
        ar: "إجمالي التكلفة التقديرية للسلع"
    },
    {
        id: "estimated_core",
        en: "Estimated Core Grant Amount in cash",
        sp: "Subvención básica no restringida total",
        fr: "Montant ESTIMATIF de la subvention de base en espèces",
        ar: "تقدير مبلغ المنحة الأساسية نقدًا"
    },
    {
        id: "order_commodities_based",
        en: "Order Commodities based on Product Type",
        sp: "Solicitar productos básicos según el tipo de producto",
        fr: "Commander des produits en fonction du type de produit",
        ar: "طلب السلع بناءً على نوع المنتج"
    },
    {
        id: "product_code",
        en: "Product Code",
        sp: "Código del producto",
        fr: "Code produit",
        ar: "كود المنتَج"
    },
    {
        id: "product_name",
        en: "Product Name",
        sp: "Nombre del producto",
        fr: "Nom du produit",
        ar: "اسم المنتج"
    },
    {
        id: "manufacturer",
        en: "Manufacturer",
        sp: "Fabricante",
        fr: "Fabricant",
        ar: "المصنّع"
    },
    {
        id: "formulation",
        en: "Formulation",
        sp: "formulación",
        fr: "Formule",
        ar: "التركيبة"
    },
    {
        id: "unit_measure",
        en: "Unit of Measure",
        sp: "Unidad de medida",
        fr: "Unité de mesure",
        ar: "وحدة القياس"
    },
    {
        id: "rate",
        en: "Rate",
        sp: "Precio",
        fr: "Prix",
        ar: "سعر"
    },
    {
        id: "order_quantity",
        en: "Order quantity request (per UoM)",
        sp: "Cantidad del pedido",
        fr: "Quantité commandée",
        ar: "كمية الطلب (سنة واحدة)"
    },
    {
        id: "total_price",
        en: "Total price",
        sp: "Precio total",
        fr: "Prix total",
        ar: "إجمالي السعر"
    },
    {
        id: "notes",
        en: "Notes",
        sp: "Comentarios",
        fr: "Commentaires",
        ar: "التعليقات"
    },
    {
        id: "total_price_commodities",
        en: "Total Price of the Commodities Ordered",
        sp: "Precio total de las mercancías solicitadas",
        fr: "Prix ​​total des produits commandés",
        ar: "السعر الإجمالي للسلع المطلوبة"
    },
    {
        id: "combined_cost",
        en: "Combined Cost of All Commodities Ordered",
        sp: "Costo total de productos",
        fr: "Coût combiné de tous les produits commandés",
        ar: "التكلفة المجمعة لجميع السلع المطلوبة"
    },
    {
        id: "estimatd_freight",
        en: "Estimated Freight Cost",
        sp: "Costo de transporte previsto",
        fr: "Coûts estimatifs de fret",
        ar: "تكلفة الشحن التقديرية"
    },
    {
        id: "total_cost",
        en: "Total Estimated Cost of Commodities (including Freight Cost)",
        sp: "Costo total de productos - PREVISTO",
        fr: "Coût total des produits – ESTIMATION",
        ar: "التكلفة التقديرية للسلع"
    },
    {
        id: "commodities_funding_title",
        en: "3.5 Commodities by Funding Source ",
        sp: "3.5 Productos por fuente de financiamiento",
        fr: "3.5 Produits par source de financement",
        ar: "5.3 السلع الطبية حسب مصدر التمويل"
    },
    {
        id: "Summary_commodities",
        en: "Summary of Commodities by Funding Source vis-à-vis Project Expenses for Commodities",
        sp: "Resumen de productos básicos por fuente de financiación en relación con los gastos del proyecto para productos básicos",
        fr: "Résumé des produits de base par source de financement par rapport aux dépenses du projet pour les produits de base",
        ar: "ملخص السلع حسب مصدر التمويل مقابل نفقات المشروع للسلع"
    },
   {
    id: "commodities_funding_title_info",
    en: `<p class="mb-1">This section includes additional information / data relating to commodities. This section is relevant for all organisations that procure and disseminate commodities. Please fill out all the sections fully.</p>`,
    sp: `<p class="mb-1">Esta sección incluye información y datos adicionales relacionados con los productos básicos. Esta sección es relevante para todas las organizaciones que adquieren y distribuyen productos básicos. Por favor, complete todas las secciones en su totalidad.</p>`,
    fr: `<p class="mb-1">Cette section contient des informations et des données supplémentaires concernant les produits de base. Elle s'adresse à toutes les organisations qui achètent et distribuent des produits de base. Veuillez remplir intégralement toutes les rubriques.</p>`,
    ar: `<p class="mb-1">يتضمن هذا القسم معلومات/بيانات إضافية تتعلق بالسلع الأساسية. ويُعتبر هذا القسم ذا صلة بجميع المؤسسات التي تقوم بشراء السلع الأساسية وتوزيعها. يرجى ملء جميع الأقسام بالكامل.</p>`
   },
    {
        id: "total_amount_funding",
        en: "Total Amount (USD) as per Commodities by Funding Source",
        sp: "Monto total (USD) por producto y fuente de financiación",
        fr: "Montant total (USD) selon les produits de base par source de financement",
        ar: "المبلغ الإجمالي (بالدولار الأمريكي) حسب السلع حسب مصدر التمويل"
    },
    {
        id: "total_amount_expense",
        en: "Total Amount (USD) as per Project Expense Category -Commodities",
        sp: "Monto total (USD) según categoría de gastos del proyecto: materias primas",
        fr: "Montant total (USD) selon la catégorie de dépenses du projet - Produits de base",
        ar: "المبلغ الإجمالي (بالدولار الأمريكي) حسب فئة نفقات المشروع - السلع"
    },
    {
        id: "variation",
        en: "Variance",
        sp: "Variación",
        fr: "Écart",
        ar: "تفاوت"
    },
    {
        id: "variation_focusarea",
        en: "Variance ($)",
        sp: "Variación ($)",
        fr: "Écart ($)",
        ar: "التباين ($)"
    },
    {
        id: "control_varaince",
        en: "Control Cell: Variance ($)",
        sp: "Célula de control: Varianza ($)",
        fr: "Cellule de contrôle : Variance ($)",
        ar: "خلية التحكم: التباين ($)"
    },
    {
        id: "control_cells",
        en: "Control Cells",
        sp: "Células de control",
        fr: "Cellules de contrôle",
        ar: "خلايا التحكم"
    },
    {
        id: "control_total_spend",
        en: "Control Cell: Total Spend (%)",
        sp: "Célula de control: Gasto total (%)",
        fr: "Cellule de contrôle : Dépenses totales (%)",
        ar: "خلية التحكم: إجمالي الإنفاق (%)"
    },
    {
        id: "variance_explanation",
        en: "Variance Explanation",
        sp: "Explicación de la varianza",
        fr: "Explication de la variance",
        ar: "شرح التباين"
    },
    {
        id: "commodities_source",
        en: "Commodities by Funding Source",
        sp: "Fuente de financiamiento",
        fr: "Source de financement",
        ar: "مصدر التمويل"
    },
    {
    id: "complete_business_plan",
    en: "Complete Business Plan",
    es: "Presentar plan de negocio",
    fr: "Soumettre le plan d’affaires",
    ar: "تقديم خطة العمل"
    },
    {
        id: "reopen_business_plan",
        en: "Reopen Business Plan",
        sp: "Reabrir el plan de negocios",
        fr: "Plan d'affaires de réouverture",
        ar: "إعادة فتح خطة العمل"
    },
    {
        id: "submit_annual_report",
        en: "Submit Annual Report",
        sp: "Presentar informe anual",
        fr: "Soumettre le rapport annuel",
        ar: "تقديم التقرير السنوي",
    },
    {
        id: "reopen_annual_report",
        en: "Reopen Annual Report",
        sp: "Reabrir el informe anual",
        fr: "Rouvrir le rapport annuel",
        ar: "إعادة فتح التقرير السنوي",
    },
    {
        id: "ippf_unrestricted",
        en: "IPPF Unrestricted (Either procurred directly from IPPF or purchased locally using the core grant)",
        sp: "No restringidos de IPPF (bien sea otorgados directamente por IPPF o comprados de forma local con la subvención básica)",
        fr: "Fonds sans restrictions de l’IPPF (soit obtenus directement auprès de l’IPPF, soit achetés localement à l’aide de la subvention de base)",
        ar: "غير مقيد من اتحاد IPPF (إما وارد مباشرة من اتحاد IPPF، أو تم شراؤه محليًا باستخدام المنحة الأساسية)"
    },
    {
        id: "international_donors",
        en: "International donors",
        sp: "Donantes internacionales",
        fr: "Donateurs internationaux",
        ar: "الجهات المانحة الدولية"
    },
    {
        id: "ippf_restricted_c",
        en: "IPPF Restricted grants or Non-IPPF grants",
        sp: "Donantes internacionales (subvenciones restringidas (restricted grants) de IPPF o subvenciones de entidades que no pertenecen a IPPF)",
        fr: "Bailleurs de fonds internationaux (subventions avec restriction de l’IPPF ou subventions hors IPPF)",
        ar: "منح الاتحاد المقيدة او المنح غير التابعة للاتحاد "
    },
    {
        id: "local_income",
        en: "Local Income",
        sp: "Ingresos locales",
        fr: "Recettes locales",
        ar: "الدخل المحلي"
    },
    {
        id: "donation",
        en: "In-kind donations",
        sp: "Donativos en especie",
        fr: "Dons en nature",
        ar: "تبرعات عينية"
    },
    //Annual Report 

    //Organisational Details 
    {
        id: "orgainsation-info",
        en: "1. Organizational details",
        sp: "1.1 Información de la organización",
        fr: "1.1 Renseignements sur l’organisation",
        ar: "1.1 البيانات التنظيمية"
    },
    {
        id: "membership_details",
        en: "Membership details",
        sp: "Datos de afiliación",
        fr: "Détails en tant que membre",
        ar: 'بيانات العضوية'
    },
    {
        id: "primary_point",
        en: "Primary point of contact for follow-up on business plan",
        sp: "Punto de contacto principal para el seguimiento del plan de negocios",
        fr: "Interlocuteur principal pour le suivi du plan d'affaires",
        ar: "نقطة الاتصال الأساسية لمتابعة خطة العمل"
    },
   
    {
        id: "specify_date",
        en: "Please specify the start date and end date for the current board's term",
        sp: "Por favor, especifique la fecha de inicio y la fecha de finalización del mandato de la junta actual",
        fr: "Veuillez préciser la date de début et la date de fin du mandat actuel du conseil d'administration",
        ar: "يرجى تحديد تاريخ البدء وتاريخ الانتهاء لفترة المجلس الحالية"
    },
    {
        id: "board_chair_term_end",
        en: "When does the current board chair's term end?",
        sp: "¿Cuándo termina el mandato del actual presidente de la junta directiva?",
        fr: "Quand se termine le mandat de l'actuel président du conseil ?",
        ar: "متى تنتهي ولاية الرئيس الحالي لمجلس الإدارة؟"
    },
    //Narrative Report
    {
        id: "context_events",
        en: "1. Strategic Context and Results",
        sp: "1. Hechos del contexto",
        fr: "1. Événements contextuels",
        ar: 'سياق الاحداث '
    },
    {
        id: "context_info",
        en: "Please describe any major events that shaped your context. Please consider SRHR and political context/legal changes, oppostion in your country.",
        sp: "Describa cualquier hecho importante que haya determinado su contexto. Tenga en cuenta los cambios legales/en el contexto político y en el área de SDSR relacionados con la oposición en su país.",
        fr: "Veuillez décrire tout événement majeur qui a influé sur votre contexte. Veuillez considérer la SDSR et le contexte politique, les changements juridiques et l'opposition dans votre pays.",
        ar: 'يرجى وصف أي أحداث رئيسية أثرت في السياق الذي تعملون فيه. الرجاء أخذ بعين الاعتبار قضايا الصحة الجنسية والإنجابية وحقوقها (SRHR)، والسياق السياسي، والتغييرات القانونية، والمعارضة في بلدكم .'
    },
    {
        id: "results_achivements",
        en: "2. Results & Achievements",
        sp: "2. Resultados y logros",
        fr: "2. Résultats et réalisations",
        ar: '2. النتائج والإنجازات'
    },
    {
        id: "smart_outcomes_heading",
        en: "SMART: Specific, Measurable, Achievable, Relevant, and Time-bound Outcomes",
        sp: "SMART: Resultados específicos, medibles, alcanzables, relevantes y con plazos definidos",
        fr: "SMART : Objectifs spécifiques, mesurables, réalisables, pertinents et assortis d'un délai",
        ar: "SMART: النتائج المحددة، القابلة للقياس، القابلة للتحقيق، ذات الصلة، والمحددة زمنياً"
    },
    {
        id: "smart_outcomes_desc",
        en: "Review and update (if required) your medium term (3-year) expected strategic outcomes (up to five).",
        sp: "Revisa y actualiza (si es necesario) tus resultados estratégicos esperados a mediano plazo (3 años) (hasta cinco).",
        fr: "Passez en revue et mettez à jour (si nécessaire) vos résultats stratégiques attendus à moyen terme (3 ans) (cinq au maximum).",
        ar: "يرجى مراجعة وتحديث (إذا لزم الأمر) النتائج الاستراتيجية المتوقعة على المدى المتوسط (3 سنوات) (بحد أقصى خمس نتائج)."
    },
    {
        id: "smart_outcomes_pillar",
        en: "For example: IPPF Strat Pillar 1: By December 2026, rolled out at least three national Digital Health Interventions in four national regions.",
        sp: "Por ejemplo: Pilar estratégico 1 de la IPPF: Para diciembre de 2026, haber implementado al menos tres intervenciones nacionales de salud digital en cuatro regiones del país.",
        fr: "Par exemple : Pilier stratégique n° 1 de l'IPPF : d'ici décembre 2026, déployer au moins trois interventions nationales en matière de santé numérique dans quatre régions du pays.",
        ar: "على سبيل المثال: الركيزة الاستراتيجية الأولى للاتحاد الدولي لتنظيم الأسرة (IPPF): بحلول ديسمبر 2026، تنفيذ ما لا يقل عن ثلاثة تدخلات وطنية في مجال الصحة الرقمية في أربع مناطق وطنية."
    },
    {
        id: "results_achivement_info",
        en: "Please describe your main achievements/results (by strategic pillar) in the reporting period. Please indicate whether and how these are different to your expectations/assumptions. Pleae emphasise your work with youth and marginalised populations.",
        sp: "Describa sus principales logros/resultados (para cada pilar estratégico) en el periodo del informe. Indique si estos difieren de sus expectativas/suposiciones y cómo. Ponga énfasis en su trabajo con la juventud y las poblaciones marginadas.",
        fr: "Veuillez décrire vos principales réalisations/principaux résultats (par pilier stratégique) au cours de la période visée par le rapport. Veuillez indiquer si et en quoi ils diffèrent de vos attentes/hypothèses. Veuillez mettre l'accent sur votre travail avec les jeunes et les populations marginalisées.",
        ar: 'يرجى توضيح أهم إنجازاتكم/نتائجكم (حسب الركيزة الاستراتيجية) في الفترة المشمولة بالتقرير. في حالة وجود أي اختلاف بينها وبين توقعاتكم/افتراضاتكم، نرجو التوضيح. يرجى التأكيد على عملكم مع الشباب والشرائح السكانية المهمشة.',
    },
    {
        id: "center_people",
        en: "Center Care on People:",
        sp: "Centrar la atención en las necesidades de las personas:",
        fr: "Centrer les soins sur la personne:",
        ar: ' تركيز الرعاية على الأفراد:'
    },
    {
        id: "move_sexuality_agenda",
        en: "Move the Sexuality Agenda:",
        sp: "Avanzar en la Agenda sobre sexualidad:",
        fr: "Faire évoluer la question de la sexualité :",
        ar: ' الارتقاء بالأجندة الجنسية:'
    },
    {
        id: "solidarity",
        en: "Solidarity for Change:",
        sp: "Construir solidaridad para lograr el cambio:",
        fr: "Solidarité pour le changement :",
        ar: ' التكافل من أجل التغيير:'
    },
    {
        id: "nurture",
        en: "Nurture our Federation:",
        sp: "Nutrir nuestra Federación:",
        fr: "Consolider notre Fédération",
        ar: 'ننمي اتحادنا:'
    },
    {
        id: "challenges_info",
        en: "Please describe the main challenges you faced in the reporting period",
        sp: "Describa los principales desafíos a los que se enfrentaron durante el periodo del informe.",
        fr: "Décrivez les principales difficultés auxquelles vous avez été confrontés au cours de la période visée par le rapport.",
        ar: 'يرجى توضيح أهم التحديات التي واجهتها منظمتكم في الفترة المشمولة بالتقرير. ',
    },
    {
        id: "most_effective",
        en: "4. Most effective strategies / approaches",
        sp: "4. Estrategias / métodos más efectivos",
        fr: "4. Stratégies / approches les plus efficaces",
        ar: '4. الاستراتيجيات / النُهج الأكثر فعالية'
    },
    {
        id: "most_effective_info",
        en: "Please describe the strategies or approaches that helped  you achieve your biggest successes. Do you have examples  of good practice or important learnings that you would like to share?",
        sp: "Describa las estrategias o los métodos que les ayudaron a lograr sus éxitos más importantes. ¿Tienen ejemplos de buenas prácticas o lecciones importantes que deseen difundir?",
        fr: "Veuillez décrire les stratégies ou les approches qui vous ont aidé à accomplir vos plus grandes réussites. Avez-vous des exemples de bonnes pratiques ou d'enseignements importants que vous souhaiteriez partager ?",
        ar: 'يرجى توضيح الاستراتيجيات أو النُهج التي ساعدتكم على تحقيق أكبر نجاحاتكم. هل لديكم أمثلة على الممارسات الجيدة أو الدروس المستفادة المهمة التي ترغبون في مشاركتها؟'
    },
    {
        id: "organisational_update",
        en: "5. Organisational update",
        sp: "5. Cambios en la organización",
        fr: "5. Mise à jour de l'organisation",
        ar: '5. التحديث التنظيمي'
    },
    {
        id: "organisational_info",
        en: "Briefly highlight any major changes related to your organization: structure, governance (board) , staff or internal procedures and policies such as Safeguarding, gender equality.",
        sp: "Destaque de forma breve cambios importantes relacionados con su organización: estructura, gobernanza (junta), personal o políticas y procedimientos internos, como Protección, Igualdad de género.",
        fr: "Veuillez indiquer en quelques mots tout changement majeur lié à votre organisation : structure, gouvernance (conseil d'administration), personnel ou procédures et politiques internes telles que la sauvegarde, l'égalité de genre.",
        ar: 'نرجو إلقاء الضوء بإيجاز على أي تغييرات رئيسية تتعلق بمنظمتكم: الهيكل التنظيمي أو الحوكمة (مجلس الإدارة)، الموظفون أو الإجراءات والسياسات الداخلية مثل الحماية والمساواة بين الجنسين.'
    },
    {
        id: "learning",
        en: "6. Learning",
        sp: "6. Aprendizaje",
        fr: "6. Apprentissage",
        ar: '6. التعلم.'
    },
    {
        id: "learning_info",
        en: "Please share your main learnings in the reporting  period",
        sp: "Describa sus principales aprendizajes durante el periodo del informe.",
        fr: "Veuillez décrire les principaux enseignements que vous avez tirés au cours de la période visée par le rapport",
        ar: 'يرجى مشاركة أهم الدروس المستفادة لديكم في الفترة المشمولة بالتقرير'
    },
    {
        id: "budget_vs_actual",
        en: "4. Budget vs actuals by focus area",
        sp: "4. Presupuesto vs. datos reales según área prioritaria",
        fr: "4. Écart entre le budget et les dépenses réelles par volet d’intervention",
        ar: "الميزانية مقابل القيم الفعلية (حسب مجال التركيز)"
    },
    {
        id: "total_budget_area",
        en: "Total Budgeted Expenses (by Focus Areas)",
        sp: "Presupuesto total por área de enfoque",
        fr: "Budget total par domaine d'intervention",
        ar: "الميزانية الإجمالية حسب مجال التركيز"
    },
    {
        id: "total_spend",
        en: "Total Spend",
        sp: "Gasto total",
        fr: "Dépense totale",
        ar: "إجمالي الإنفاق"
    },
    {
        id: "total_spend_focusarea",
        en: "Total Spend (%)",
        sp: "Gasto total (%)",
        fr: "Dépense totale (%)",
        ar: "إجمالي الإنفاق (%)"
    },
    {
        id: "actual_expense",
        en: "Actual Expenses",
        sp: "Gastos reales",
        fr: "Dépenses réelles",
        ar: "النفقات الفعلية"
    },
    {
        id: "actual_including_ippf",
        en: "Actual (including IPPF Core)",
        sp: "Actual (incluido el núcleo IPPF)",
        fr: "Réel (y compris IPPF Core)",
        ar: "الفعلي (بما في ذلك المنحة الاساسية الاتحاد) "
    },
    {
        id: "actual_expense_EC",
        en: "Total Budgeted Expenses (by Expense Categories)",
        sp: "Gastos reales",
        fr: "Dépenses réelles",
        ar: "النفقات الفعلية"
    },
    {
        id: "total_ma_actuals",
        en: "Total MA Actuals by Expense Category",
        sp: "Total de gastos reales de MA por categoría de gasto",
        fr: "Total des dépenses réelles MA par catégorie de dépenses",
        ar: "إجمالي النفقات الفعلية (حسب فئات المصروفات)"
    },
    {
        id: "actual_expense_FA",
        en: "Total Actual Expenses (by Focus Areas)",
        sp: "Gastos reales totales (por áreas de enfoque)",
        fr: "Dépenses réelles totales (par domaines d'intérêt)",
        ar: "إجمالي النفقات الفعلية (حسب مجالات التركيز)"
    },
    {
        id: "project_vs_focusarea",
        en: "Total Budgeted Expenses vs Actual Expenses (by Focus Areas)",
        sp: "Presupuesto vs. datos reales según área prioritaria",
        fr: "Projet par catégorie de dépenses",
        ar: "الميزانية مقابل القيم الفعلية حسب مجال التركيز"
    },
    {
        id: "focus_area",
        en: "Focus Area",
        sp: "Área de enfoque",
        fr: "Domaine d'intervention",
        ar: "مجال التركيز"
    },
    {
        id: "pillar",
        en: "Pillar",
        sp: "Pilar",
        fr: "Pilier",
        ar: "الركيزة"
    },
    {
        id: "project_total",
        en: "Project Total",
        sp: "Total del proyecto",
        fr: "Total du projet",
        ar: "إجمالي المشروع"
    },
    {
        id: "remarks",
        en: "Remarks",
        sp: "Notas",
        fr: "Remarques",
        ar: "ملاحظات"
    },
    {
        id: "budget_vs_project_expense",
        en: "5. Budget vs actuals by expense category",
        sp: "Presupuesto vs. datos reales por categoría de gastos",
        fr: "Écart entre le budget et les dépenses réelles par catégorie de dépenses",
        ar: "5. الميزانية مقابل القيم الفعلية (حسب فئة الإنفاق)"
    },
    {
        id: "total_budget_by_project",
        en: "Total Budgeted Expenses (by Expense Categories)",
        sp: "Presupuesto total por proyectos",
        fr: "Budget total par projets",
        ar: "الميزانية الإجمالية حسب المشاريع"
    },
    {
        id: "total_ma_budget_expense",
        en: "Total MA Budgeted Expense",
        sp: "Gasto total presupuestado de MA",
        fr: "Dépenses totales budgétisées par MA",
        ar: "إجمالي النفقات المدرجة في الميزانية"
    },
    {
        id: "project_budget_vs_project_expense",
        en: "Total Budgeted Expenses vs Actual Expenses (by Expense Category)",
        sp: "Presupuesto vs. datos reales por categoría de gastos",
        fr: "Écart entre le budget et les dépenses réelles par catégorie de dépenses",
        ar: "الميزانية مقابل القيم الفعلية حسب فئة الإنفاق"
    },
    {
        id: "budget_expenses",
        en: "Budgeted Expenses",
        sp: "Gastos presupuestados",
        fr: "Dépenses budgétisées",
        ar: "النفقات المدرجة في الميزانية"
    },
    {
        id: "budget_including_ippf",
        en: "Budget (including IPPF Core)",
        sp: "Presupuesto (incluido el núcleo del IPPF)",
        fr: "Budget (y compris le noyau IPPF)",
        ar: "الميزانية (بما في ذلك المنحة الأساسية للاتحاد الدولي لتنظيم الأسرة)"
    },
    {
        id: "actual_income_details",
        en: "6. Actual income",
        sp: "6 - Detalles de ingresos reales",
        fr: "6 - Détails du revenu réel",
        ar: "6- تفاصيل الدخل الفعلي     "
    },
    {
        id: "serious_risk_identified",
        en: "Serious Risk Identified",
        sp: "Riesgo grave identificado",
        fr: "Risque grave identifié",
        ar: "تم تحديد خطر جسيم"
    },
    {
        id: "actual_income_details_info",
        en: `<p><strong>Instructions:</strong></p>
        <p>This sheet captures the actual income during the year, divided into three categories. Actual locally generated income,
          Actual international income (Non-IPPF), and Actual IPPF income.</p>
        <p>Income categories are self-explained, but if further clarification is needed, please contact the
          Regional Office.</p>
        <p>Actual Income should be reported by Fund Type (i.e. Restricted, Unrestricted, or Designated). The
          Amount in 2023 grouped by major Funding Source will be compared with the budgeted Income as provided
          in the business plan.</p>`,
        sp: "Esta hoja recoge los ingresos reales durante el año. Está dividida en tres categorías: ingresos locales, ingresos internacionales no procedentes de la IPPF, ingresos de la IPPF. Estas categorías están desglosadas. Complete usando la mejor estimación posible. Estas categorías son las mismas que las del Plan de negocio. ",
        fr: "Cette feuille fait état des revenus réels au cours de l'année. Ces revenus sont divisés dans trois catégories : Revenus locaux, Revenus internationaux hors IPPF et Revenus de l'IPPF.Ces catégories sont ventilées. Veuillez utiliser vos estimations les plus précises pour les renseigner. Les catégories sont les mêmes que dans le plan d'activité. ",
        ar: '<p>التعليمات</p><p>نستعرض في هذه الورقة الدخل الفعلي خلال العام. ويُقسم إلى ثلاث فئات: الدخل المحلي، والدخل الدولي غير التابع لاتحاد IPPF، ودخل اتحاد IPPF. وهذه الفئات موزعة. ويرجى الاستعانة بأفضل تقدير لديكم لتعبئتها. الفئات هي نفسها المذكورة في خطة الأعمال.</p><p>فئات الدخل واضحة بذاتها، ولكن في حال الحاجة إلى مزيد من التوضيح، يُرجى التواصل مع المكتب الإقليمي.</p><p>يجب الإبلاغ عن الدخل الفعلي حسب نوع التمويل (أي المقيّد، غير المقيّد، أو المخصص). سيتم مقارنة المبلغ في عام 2023، والمُصنّف حسب مصادر التمويل الرئيسية، مع الدخل المُقدّر كما هو وارد في خطة العمل.</p>'
    },

    //other 
    {
        id: "new_project",
        en: "3. Add new project",
        sp: "Nuevo proyecto",
        fr: "Nouveau projet",
        ar: "مشروع جديد",
    },
    {
        id: "existing_project",
        en: "Existing Project",
        sp: "Proyecto existente",
        fr: "Projet existant",
        ar: "المشروع القائم",
    },
]

$(function () {
    var translations = [{
        lang: 'en',
        name: 'English',
        data: {intro: {}} 
    },
    {
        lang: 'sp',
        name: 'Spanish',
        data: {intro: {}} 
    },
    {
        lang: 'fr',
        name: 'French',
        data: {intro: {}} 
    },
    {
        lang: 'ar',
        name: 'Arabic',
        data: {intro: {}} 
    }];
    translation_mapping.forEach(mapping => {
        translations[0].data.intro[mapping.id] = mapping.en;
        translations[1].data.intro[mapping.id] = mapping.sp;
        translations[2].data.intro[mapping.id] = mapping.fr;
        translations[3].data.intro[mapping.id] = mapping.ar;
    })
    const resources = translations.reduce((acc, { lang, data }) => {
        acc[lang] = { translation: data };
        return acc;
    }, {});

    const languages = translations.reduce((acc, { lang, name }) => {
        acc[lang] = name;
        return acc;
    }, {});


    const languagePresent = window.localStorage.getItem('i18nextLng') || 'en';
    // Initialize i18next
    i18next
        .use(i18nextBrowserLanguageDetector)
        .init({
            lng: languagePresent,
            resources
        }, function (err, t) {
            if (err) return console.error(err);

            // Initialize jquery-i18next
            jqueryI18next.init(i18next, $);

            // Populate language switcher
            Object.keys(languages).forEach(lang => {
                $('#languageSwitcher').append(
                    new Option(languages[lang], lang, lang === i18next.language)
                );
            });
            $('#languageSwitcher').val(i18next.language);
            if (i18next.language == 'ar') {
                document.documentElement.setAttribute('dir', 'rtl');
                document.documentElement.classList.add('rtl-mode');
            } else {
                document.documentElement.setAttribute('dir', 'ltr');
                document.documentElement.classList.remove('rtl-mode');
            }

            // Localize content
            $('body').localize();

            // Change language event
            $('#languageSwitcher').on('change', function () {
                const selectedLang = $(this).val();
                if (selectedLang == 'ar') {
                    document.documentElement.setAttribute('dir', 'rtl');
                    document.documentElement.classList.add('rtl-mode');
                } else {
                    document.documentElement.setAttribute('dir', 'ltr');
                    document.documentElement.classList.remove('rtl-mode');
                }
                i18next.changeLanguage(selectedLang, function () {
                    $('body').localize();
                });
            });
        });
});
