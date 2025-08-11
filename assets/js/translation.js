const translation_mapping = [
    // 1.1 Organization detials
    { 
        id: "organization_details", 
        en: "1.1 Organization Details",
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
        fr: "Montant de la subvention proposé tel qu’établi par la formule (USD)",
        ar: 'مبلغ المنحة المقترح المولد بالصيغة (بالدولار الأمريكي)'
    },
     {
        id: "grant_amount",
        en: "Formula-generated proposed grant amount (Year 1) (USD)",
        sp: "Monto de la subvención propuesta generado por fórmula (Año 1) (USD)",
        fr: "Montant de la subvention proposé tel qu’établi par la formule (Année 1) (USD)",
        ar: 'المبلغ المقترح للمنحة حسب المعادلة التمويلية (السنة الأولى) (بالدولار الأمريكي)'
    },
    {
        id: "grant_amount_year2",
        en: "Formula-generated proposed grant amount (Year 2) (USD)",
        sp: "Monto de la subvención generado por fórmula (Año 2) (USD)",
        fr: "Montant de la subvention établi par la formule (Année 2) (USD)",
        ar: 'المبلغ المقرر للمنحة حسب المعادلة (السنة الثانية) (بالدولار الأمريكي)',
    },
    {
        id: "grant_amount_year3",
        en: "Provisional formula- generated grant amount (Year 3) (USD)",
        sp: "Monto PROVISIONAL de la subvención generado por fórmula (Año 3) (USD)",
        fr: "Montant de la subvention PROVISOIRE tel qu’établi par la formule (Année 3) (USD)",
        ar: 'المبلغ المقرر للمنحة حسب المعادلة المؤقتة (السنة الثالثة) (بالدولار الأمريكي)',
    },
    {
        id: "primary_contact_person",
        en: "Primary contact person",
        sp: "Persona de contacto para el plan de negocio (nombre y cargo)",
        fr: "Personne de contact principale",
        ar: "'مسؤول التواصل بشأن خطة الأعمال (الاسم والدور المكلف به)'"
    },
    {
        id: "business_plan_contact_role",
        en: "Business plan contact role",
        sp: "Persona de contacto para el plan de negocio (nombre y cargo)",
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
        id: "executive_director",
        en: "Executive Director / CEO (or equivalent)",
        sp: "Cargo",
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
        id: "Officer_of_the_board2",
        en: "Officer of the board #2 (e.g., vice president, secretary, treasurer)",
        sp: "Directivo/a de la Junta #2 (p. ej., vicepresidente/a, secretario/a, tesorero/a)",
        fr: "Membre du Conseil d’administration n° 2 (par ex., vice-président·e, secrétaire, trésorier·ère)",
        ar: 'مسؤول في المجلس 2 (على سبيل المثال، نائب الرئيس، السكرتير، أمين الصندوق)'
    },
    {
        id: "Officer_of_the_board3",
        en: "Officer of the board #3 (e.g., vice president, secretary, treasurer)",
        sp: "Directivo/a de la Junta #3 (p. ej., vicepresidente/a, secretario/a, tesorero/a)",
        fr: "Membre du Conseil d’administration n° 3 (par ex., vice-président·e, secrétaire, trésorier·ère)",
        ar: 'مسؤول في المجلس 3 (على سبيل المثال، نائب الرئيس، السكرتير، أمين الصندوق)'
    },
    {
        id: "Youth_board_member",
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
        id: "stragegic_period",
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
        id: "Project budget based on focus area",
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
        id: "not_app",
        en: "Not applicable",
        sp: "No aplicable",
        fr: "Sans objet",
        ar: "لا ينطبق"
    },
    {
        id: "organisation_networks",
        en: "Does your organisation have a youth group or networks?",
        sp: "¿Tiene su organización una red o grupo juvenil?",
        fr: "Votre organisation dispose-t-elle d'un groupe ou d'un réseau de jeunes ?",
        ar: 'هل لديكم في منظمتكم مجموعة أو شبكة للشباب؟'
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
        en: "Does the MA have branches?",
        sp: "¿La AM tiene sucursales?",
        fr: "L'AM a-t-elle des succursales ?`",
        ar: 'هل توجد فروع للجمعية العضو؟'
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
        id: "choose",
        en: "Choose",
        sp: "",
        fr: "",
        ar: 'اختر'
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
        ar:  "ي هذا العام، هل ستتلقى جمعيتكم العضو أي سلع )تم التبرع بها( من )اختر جميع اإلجابات التي تنطبق عليها(:"
    },
    {
        id: "commudites_amount",
        en: "What is the total value of commodities in USD you plan to access in this year from:",
        sp: "¿Cuál es el valor total en USD de productos a los que planea acceder este año provenientes de:",
        fr: "Quel est le montant total en USD des produits que vous comptez obtenir auprès de :",
        ar:  "ما هو إجمالي قيمة السلع بالدولار الأمريكي التي تعتزمون الوصول إليها هذا العام من:"
    },
    {
        id: "ippf",
        en: "IPPF (see 3.4)",
        sp: "la IPPF? (Ver 3.4)",
        fr: "IPPF (voir 3.4)",
        ar:  "الاتحاد الدولي لتنظيم الأسرة (انظر 4.3)"
    },
    {
        id: "ministry_health",
        en: "Ministry of Health (upload MoU)",
        sp: "el Ministerio de Salud? (Subir memorando de entendimiento)",
        fr: "Ministère de la Santé (télécharger le protocole d’accord)",
        ar:  "وزارة الصحة (قم بتحميل مذكرة التفاهم)"
    },
    {
        id: "unfpa_supplies",
        en: "UNFPA Supplies (upload IP Agreement)",
        sp: "el UNFPA Supplies? (Subir acuerdo con los socios ejecutores)",
        fr: "UNFPA Supplies (télécharger l’accord de partenaire de mise en œuvre)",
        ar:  "إمدادات صندوق الأمم المتحدة للسكان (قم بتحميل اتفاقية الشريك التنفيذي)"
    },
    {
        id: "local_procurement",
        en: "Local Procurement",
        sp: "adquisición local",
        fr: "Approvisionnement local",
        ar:  "التوريدات المحلية"
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
        en: "Please upload key strategy documents",
        sp: "Cargue documentos estratégicos clave",
        fr: "Veuillez télécharger les documents stratégiques clés",
        ar: 'يرجى تحميل وثائق الاستراتيجية الرئيسية'
    },
    {
        id: "key_annual",
        en: "Please upload key annual report documents",
        sp: "Cargue los documentos clave del informe anual",
        fr: "Veuillez télécharger les principaux documents du rapport annuel",
        ar: 'يرجى تحميل وثائق التقرير السنوي الرئيسية'
    },
    {
        id: "key_audits",
        en: "Please upload key audits reports documents (if the most recent audit reports was submitted in 2024 Annual Reporting, please leave it as is)",
        sp: "Por favor, cargue los documentos clave de los informes de auditoría (si el informe de auditoría más reciente fue presentado en el Informe Anual 2024, déjelo tal como está).",
        fr: "Veuillez télécharger les documents clés des rapports d’audit (si le rapport d’audit le plus récent a été soumis dans le rapport annuel 2024, laissez-le tel quel).",
        ar: 'يرجى تحميل الوثائق الرئيسية لتقارير التدقيق (إذا تم تقديم أحدث تقارير التدقيق في التقرير السنوي لعام 2024، يرجى تركها كما هي).'
    },
    {
        id: "memorandum_understanding_upload",
        en: "Please upload valid Memorandum of Understanding with your Government, if in place and available",
        sp: "Por favor, cargue un Memorando de Entendimiento válido con su Gobierno, si existe y está disponible.",
        fr: "Veuillez télécharger un protocole d’accord valide avec votre gouvernement, s’il existe et est disponible.",
        ar: "يرجى تحميل مذكرة تفاهم سارية مع حكومتكم، إذا كانت موجودة ومتاحة."
    },
    {
        id: "partner_agreement_upload",
        en: "Please upload valid Implementing Partner Agreement with UNFPA (Supplies), if in place and available",
        sp: "Por favor, cargue un Acuerdo de Socio Implementador válido con el UNFPA (Suministros), si existe y está disponible.",
        fr: "Veuillez télécharger un accord valide de partenaire d’exécution avec l’UNFPA (Fournitures), s’il existe et est disponible.",
        ar: "يرجى تحميل اتفاقية شريك منفذ سارية مع صندوق الأمم المتحدة للسكان (الإمدادات)، إذا كانت موجودة ومتاحة."
    },
    {
        id: "other1",
        en: "Other 1",
        sp: "Otro 1",
        fr: "Autre 1",
        ar: "غير ذلك 1"
    },
    {
        id: "other2",
        en: "Other 2",
        sp: "Otro 2",
        fr: "Autre 2",
        ar: "آخر 2"
    },
     //Narrative Plan
    {
        id: "narrative_plan",
        en: "1.2 Narrative Plan",
        sp: "1.2 Narrativa del Plan",
        fr: "1.2 Narratif du plan",
        ar: 'الخطة السردية '
    },
    {
        id: "country_context",
        en: "Country context and theory of change",
        sp: "Contexto nacional y teoría del cambio",
        fr: "Contexte national et théorie du changement",
        ar: 'سياق الدولة ونظرية التغيير'
    },
    {
        id: "country_context_ques",
        en: "Ques 1. Country context",
        sp: "1. Contexto nacional",
        fr: "Ques 1.Contexte du pays",
        ar: 'السؤال الاول : سياق الدولة'
    },
    // 
    {
        id: "country_context_ques_description",
        en: "Please describe your country context as relevant to SRHR. What are the main SRHR gaps and social or political factors that should be addressed in the remainder of the IPPF strategic period (e.g., unmet need, service gaps, political environment, laws, policies, social norms, national health/education programmes and innovations, opposition, etc.). Please use updated and verified statistics where possible, and mention marginalized groups as relevant (500 words max)",
        fr: "Ofrezca una descripción de su contexto nacional en lo relativo a la SDSR. ¿Cuáles son las principales carencias en materia de SDSR y los factores sociales o políticos que deberían abordarse en lo que resta del período estratégico de la IPPF (por ejemplo, necesidad no satisfecha, carencias en servicios, entorno político, legislación, políticas públicas, normas sociales, innovaciones y programas nacionales de salud/educación, oposición, etc.)? Emplee datos estadísticos actualizados y comprobados cuando sea posible, y mencione los grupos marginados según sea pertinente (500 palabras como máximo)",
        sp: "Veuillez décrire le contexte de votre pays en ce qui concerne la SDSR. Quels sont les principales lacunes et les principaux facteurs sociaux ou politiques en matière de SDSR à prendre en compte au cours de la période stratégique du l’IPPF (par ex., besoins non satisfaits, services manquants, environnement politique, lois, politiques publiques, normes sociales, programmes et innovations sur le plan national en matière de santé et d’éducation, mouvements d’opposition, etc.) ? Veuillez utiliser dans la mesure du possible des statistiques à jour et vérifiées et mentionner les groupes marginalisés le cas échéant (500 mots maximum)",
        ar: "نرجو توضيح الوضع في بلدكم فيما يتعلق بالحقوق والصحة الجنسية والإنجابية. ما هي الثغرات الرئيسية في مجال الحقوق والصحة الجنسية والإنجابية والعوامل الاجتماعية أو السياسية التي ينبغي معالجتها في الفترة الاستراتيجية المتبقية للاتحاد الدولي لتنظيم الأسرة (على سبيل المثال، الاحتياجات غير الملباة، فجوات الخدمة، البيئة السياسية، القوانين، السياسات، الأعراف الاجتماعية، الابتكارات والبرامج الصحية/التعليمية الوطنية، المعارضة، إلخ). نرجو الاستناد إلى إحصاءات حديثة ومُوثّقة، كلما أمكن، مع ذكر الفئات المهمّشة ذات الصلة (بحد أقصى 500 كلمة)"
    },
    {
        id: "strategy",
        en: "Ques 2. Strategy",
        sp: "2. Estrategia",
        fr: "Ques 2. Stratégie",
        ar: 'السؤال الاول : الاستراتيجية'
    },
    {
        id: "des_curr_high_level",
        en: "Describe your current high-level strategy or theory of change. How does it respond to your local needs and context described above? What are its key components and activities, and how will you operationalize it?",
        sp: "Describa su actual estrategia de alto nivel o teoría del cambio. ¿De qué forma da respuesta a sus necesidades locales y al contexto que se describieron antes? ¿Cuáles son sus componentes y actividades principales, y cómo los pondrán en práctica?",
        fr: "Décrivez votre stratégie de haut niveau ou votre théorie du changement actuelle. Dans quelle mesure répond-elle à vos besoins locaux et à votre contexte tels que décrits ci-dessus ? Quels en sont les principaux composants et les principales activités et comment allez-vous la mettre en pratique ?",
        ar: "وضح نظريتكم في التغيير أو إستراتيجيتكم الحالية رفيعة المستوى. كيف تلبي هذه الاستراتيجية احتياجاتكم المحلية في ضوء السياق المذكور أعلاه؟ ما هي عناصرها وأنشطتها الرئيسية، وكيف تقومون بتفعيلها؟"
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
        sp: "SMART: específico, medible, apropiado, realista y con plazos establecidos",
        fr: "Résultats SMART : spécifiques, mesurables, atteignables, réalistes et limités dans le temps",
        ar: "SMART: واضحة وقابلة للقياس ويمكن تحقيقها ووثيقة الصلة ومحددة بوقت"
    },
    {
        id: "describe_youth_leadership_para2",
        en: "Describe your medium term (3-year) expected strategic outcomes (up to five).",
        sp: "Describa los resultados estratégicos esperados (hasta cinco) a mediano plazo (3 años).",
        fr: "Décrivez vos résultats stratégiques (5 au maximum) attendus à moyen terme (3 ans).",
        ar: "وضح النتائج الاستراتيجية التي تتوقعون تحقيقها على المدى المتوسط (3 سنوات) (حتى خمس سنوات)."
    },
    {
        id: "start_pillar_1",
        en: "IPPF Start Pillar 1: By December 2026, rolled out at least three national Digital Health Interventions in national four regions.",
        sp: "Por ejemplo: IPPF Start Pilar 1: Para diciembre de 2026, implementar al menos tres intervenciones nacionales de salud digital en cuatro regiones nacionales.",
        fr: "Par exemple : IPPF Start Pilier 1 : D’ici décembre 2026, déployer au moins trois interventions nationales de santé numérique dans quatre régions nationales.",
        ar: "على سبيل المثال: الركيزة الأولى لبرنامج IPPF Start: بحلول ديسمبر 2026، تم تنفيذ ما لا يقل عن ثلاث تدخلات وطنية في مجال الصحة الرقمية في أربع مناطق وطنية."
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
        en: "Describe the process followed to ensure youth decided 5% of your core funding. Please list the projects that will be youth led and/or have youth involvement.",
        sp: "Describa el proceso seguido para garantizar que la juventud decida sobre el 5 % del financiamiento básico. Enumere los proyectos que serán liderados por la juventud o en los que participarán.",
        fr: "Décrivez la démarche que vous avez adoptée pour faire en sorte que les jeunes décident de 5 % de votre financement de base. Veuillez énumérer les projets qui seront dirigés par des jeunes et/ou auxquels des jeunes participeront.",
        ar: "وضح الإجراءات التي تلتزمون بها لضمان حصول الشباب على 5٪ من تمويلكم الأساسي. نرجو إيضاح المشاريع التي سيقودها الشباب و/أو التي يشارك فيها الشباب."
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
        en: "Challenges and opportunitties",
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
        sp: "Áreas organizativas de experiencia / Capacidad (podemos compartir herramientas y capacitar a otros)",
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
        en: "Total Contract Value",
        sp: " Valor total del contrato",
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
        en: "Select MA / CP",
        sp: "Seleccione MA/CP",
        fr: "Sélectionnez MA/CP",
        ar: "اختر الجمعية العضو/ الشريك المتعاون",
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
        sp: "1.2 Narrativa del Plan",
        fr: "1.2 Narratif du plan",
        ar: "الخطة السردية",
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
        sp: "3.5 Productos por fuente",
        fr: "3.5 Produits par source de financement",
        ar: "5.3 مصدر السلع الطبية",
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
        en: "1. Organization Details",
        sp: "1. Información de la AM",
        fr: "1. Informations sur l'AM",
        ar: 'بيانات المنظمة'
    },
    {
        id: "narrative_report",
        en: "2. Narrative Report",
        sp: "2. Informe narrativo",
        fr: "2. Rapport descriptif",
        ar: 'التقرير السردي'
    },
    {
        id: "add_project",
        en: "3. Add New Project",
        sp: "3. Añadir nuevo proyecto",
        fr: "3. Ajouter un nouveau projet",
        ar: '3. إضافة مشروع جديد'
    },
    {
        id: "budget_vs_focusarea",
        en: "4. Budget vs Actuals by Focus Area",
        sp: "4. Presupuesto vs. datos reales según área prioritaria",
        fr: "4. Écart entre le budget et les dépenses réelles par volet d’intervention",
        ar: '4. الميزانية مقابل القيم الفعلية حسب مجال التركيز'
    },
    {
        id: "budget_vs_expense",
        en: "5. Budget vs Actuals by Expense Category",
        sp: "5. Presupuesto vs. datos reales por categoría de gastos",
        fr: "5. Écart entre le budget et les dépenses réelles par catégorie de dépenses",
        ar: '5. الميزانية مقابل القيم الفعلية حسب فئة الإنفاق'
    },
    {
        id: "actual_income",
        en: "6. Actual Income",
        sp: "6. Ingreso real (real)",
        fr: "6. Revenus réels (Chiffres réels)",
        ar: '6. الدخل الفعلي'
    },
    {
        id: "standard_reports",
        en: "Standard Report Generation from the BP Portal",
        sp: "Generación de informes estándar desde el portal BP",
        fr: "Génération de rapports standard à partir du portail BP",
        ar: 'إنشاء التقارير القياسية من بوابة BP'
    },
//changes updated above
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
        en: "Reporting Periodicity",
        sp: "Periodicidad de los informes",
        fr: "Périodicité des rapports",
        ar: 'دورية التقارير'
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
        id: "project_description_info",
        en: '<p class="mb-1">Please list all of the projects you plan to carry out in the three-year cycle (this should include all projects, both funded by restricted and unrestricted funds).</p><p class="mb-0">Only include projects where funding is either confirmed or has an 80%+ chance of materialising. For each project please enter the name and brief description including donor/funding source, regions/provinces where it will be implemented, the target audience/clients and its intended outcomes/results.</p>',
        sp: "Enumere todos los proyectos que planifican llevar a cabo en el ciclo de tres años (se deben incluir todos los proyectos, tanto los de fondos restringidos (restricted funds) como los de fondos no restringidos (unrestricted funds)). Incluya solo proyectos en los que el financiamiento esté confirmado o tenga más de un 80 % de probabilidades de obtenerse. Para cada proyecto, indique su nombre y ofrezca una breve descripción de no más de 250 palabras. En la descripción, mencione el donante o la fuente de financiamiento; las regiones o provincias en las que se implementará; los usuarios o la audiencia meta, y los resultados previstos. Para actualizaciones, agregue todo proyecto nuevo no incluido en el plan de negocio de 3 años. No es necesario completar todas las filas.",
        fr: "Veuillez énumérer tous les projets que vous prévoyez de porter à exécution au cours du cycle de trois ans (incluez tous les projets, financés à la fois par des fonds avec restrictions et des fonds sans restrictions). Veuillez indiquer uniquement les projets pour lesquels le financement est confirmé ou a plus de 80 % de chances de se concrétiserVeuillez accompagner chaque projet d’une brève description de pas plus de 250 mots. Dans la description, veuillez mentionner le bailleur de fonds/la source de financement, les régions/provinces où il sera mis en œuvre, le public cible/les clients et ses réalisations/résultats escomptés. Pour les mises à jour, veuillez ajouter tout nouveau projet non inclus dans le plan d'activité de 3 ans. Il n’est pas obligatoire de remplir toutes les lignes.",
        ar: "<p>نرجو إعداد قائمة بجميع المشاريع التي تخططون لتنفيذها في دورة الثلاث سنوات (ينبغي أن تشمل جميع المشاريع التي تمولها الصناديق المقيدة وغير المقيدة).</p><p>بالنسبة للسنة الثانية: يرجى إدراج المشاريع التي تم تأكيد تمويلها فقط أو التي لديها فرصة تحقيق تمويل بنسبة 80% أو أكثر (على سبيل المثال، مانح سبق أن موّل مشاريعكم في السنوات السابقة وأنتم في مفاوضات لتمديد التمويل، أو مانح أنتم متقدمون في إجراءات التمويل لديه مؤشرات على احتمالية الحصول على التمويل رغم عدم توقيع العقد بعد). </p>"
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
        en: ` <p>
        Please complete all of the budget data in USD, using the exchange rate provided by IPPF. Please
        break down annual funds based on calendar years (Jan - Dec).
      </p><p><strong>Note:</strong> Please update data for year 2 & 3. We request full detail on the upcoming
        year's plans (Year 2), and less detail on Year 3, as noted below.</p>
      <p>Near the end of next year, you will be asked to update your budgets and provide additional detail for the following year.</p>
      <p>Please included each project's budget; the total budget of all of your projects should equal your entire organisational budget (we assume that indirect/support costs and senior management costs are incorporated within each project; if there are additional indirect/support costs not captured in the projects, please add a separate project for them called "Indirect/Support").
      </p>

      <p class="mb-0">
        Only include projects where funding is either confirmed or has an 80%+ chance of materialising. For each project please enter the name and brief description including donor/funding source, regions/provinces where it will be implemented, the target audience/clients and its intended outcomes/results.
      </p>
      <p class="mt-2">
        <strong>Guidance for estimating budgets:</strong>
      </p>
      <p>
        <strong>For Year 1:</strong> You will not be allowed to make any changes to the budgets.
      </p>
      <p>
        <strong>For Year 2:</strong> Only include projects where funding is either confirmed or has an 80%+ chance of coming through (for example, a donor that has funded you in prior years and you are in talks for extending that funding, or a donor where you are far along in the process and have been given indications funding is likely even though it’s not signed yet).
      </p>
      <p>
        <strong>For Year 3:</strong> Include all projects you realistically plan to carry out, even if you do not yet know the donor who will fund them. As a result, it is OK if many of the projects in Year 3 are "uncertain." For each project, put your best guess of the likely budget, even if the exact amount is not confirmed, or if you might need multiple donors to fund it (e.g., if you expect your project to cost between 40,000 and 80,000, you can list the average, 60,000, as your estimate). You can then select from three options to indicate the likelihood of funding for that project:
      </p>
      <p>
        <strong>Confirmed:</strong> There is a firm commitment for the funding and project (can include explicit written or verbal commitments, even if a multi-year contract is not signed).
      </p>
      <p>
        <strong>Likely (over 80%):</strong> You estimate a greater than 80% chance the project will come
        through (for example, a donor that has funded you in prior years and you are in talks for extending
        that funding, or a donor where you are far along in the process and have been given indications
        funding is likely even though it’s not signed yet).
      </p>
      <p>
        <strong>Uncertain:</strong> There is a less than 80% chance of the project and funding coming
        through. Please only include projects you think there is a realistic chance you will carry out,
        rather than including a full wish-list of unlikely projects (for example, if you organization has
        typically carried out 5-6 projects per year with a total budget of $2M, do not list 12 “uncertain”
        projects with a total budget of $4M).
      </p>
      <p>
        Projects may end in the middle of the three-year period; if so, put "0" for their budget in the
        years they are finished.
      </p>
      <p>
        Note that for the upcoming year (Year 2), we are also requesting a breakdown of how much of the core
        unrestricted grant will go to each project. We realize this might change throughout the year as
        funding needs change; however, we would like your best estimate as of now. You do not need to
        specify exactly how core funding will be spend in Year 3, though it should still count towards your
        total amount. Not all rows must be filled.<i class="far fa-arrow-alt-circle-up ml-1"
          data-toggle="collapse" data-target="#collapseExample1" aria-expanded="true"
          aria-controls="collapseExample1"></i>
      </p>`,
        sp: "Todos los datos del presupuesto deben indicarse en USD utilizando la tasa de cambio que proporcione IPPF. Desglose los fondos anuales en base a los años naturales (de enero a diciembre).	Incluya el presupuesto de cada proyecto; el presupuesto total de todos los proyectos debe ser igual al presupuesto entero de la organización. Incluya solo proyectos en los que el financiamiento esté confirmado o tenga más de un 80 % de probabilidades de obtenerse. Está bien si muchos de los proyectos del Año 3 tienen un % mayor de incertidumbre. El año próximo tendrá la oportunidad de actualizar el Plan de negocio.",
        fr: "Veuillez indiquer toutes les données budgétaires en USD, en utilisant le taux de change fourni par l’IPPF. Veuillez ventiler les fonds annuels en fonction des années civiles (de janvier à décembre).	Veuillez indiquer le budget de chaque projet. Le budget total de tous vos projets doit correspondre au total du budget de votre organisation. Veuillez indiquer uniquement les projets pour lesquels le financement est confirmé ou a plus de 80 % de chances de se concrétiser Il est donc acceptable qu’un grand nombre de projets pour l’Année 3 présentent un plus fort pourcentage d'incertitude. L'occasion vous sera donnée l'an prochain d'actualiser le budget du projet.",
        ar: `<p>يرجى إكمال جميع البيانات الخاصة بالميزانية بالدولار الأمريكي، مع تطبيق سعر الصرف الذي حدده اتحاد IPPF. ويرجى توزيع التمويلات السنوية حسب التقويم الميلادي (يناير - ديسمبر)</p><p>ملاحظة: يرجى تحديث البيانات للسنة الثانية والثالثة. نرجو تزويدنا بتفاصيل كاملة عن خطط السنة القادمة (السنة الثانية)، وتفاصيل أقل للسنة الثالثة كما هو موضح أدناه.</p><p>في نهاية العام المقبل، سيُطلب منك تحديث الميزانيات وتقديم تفاصيل إضافية للسنة التالية.</p><p>يرجى تضمين ميزانية كل مشروع؛ يجب أن يكون إجمالي ميزانيات جميع مشاريعكم مساوياً للميزانية الكاملة للمنظمة (نفترض أن التكاليف غير المباشرة/دعم الإدارة وتكاليف الإدارة العليا مدرجة ضمن كل مشروع؛ وإذا كانت هناك تكاليف غير مباشرة/دعم إضافية غير مدرجة في المشاريع، يرجى إضافة مشروع منفصل لها بعنوان "تكاليف غير مباشرة/دعم").</p><p>يرجى إدراج المشاريع التي تم تأكيد تمويلها فقط أو التي لديها فرصة تحقيق تمويل بنسبة 80% أو أكثر. لكل مشروع، يرجى إدخال الاسم ووصف مختصر يشمل المانح/مصدر التمويل، المناطق/المحافظات التي سيتم تنفيذ المشروع فيها، الجمهور المستهدف/المستفيدين، والنتائج/الأهداف المرجوة.</p><p>إرشادات لتقدير الميزانيات</p><p>بالنسبة للسنة الأولى: لن يُسمح لك بإجراء أي تغييرات على الميزانيات.</p><p>بالنسبة للسنة الثانية: يرجى إدراج المشاريع التي تم تأكيد تمويلها فقط أو التي لديها فرصة تحقيق تمويل بنسبة 80% أو أكثر (على سبيل المثال، مانح سبق أن موّل مشاريعكم في السنوات السابقة وأنتم في مفاوضات لتمديد التمويل، أو مانح أنتم متقدمون في إجراءات التمويل لديه مؤشرات على احتمالية الحصول على التمويل رغم عدم توقيع العقد بعد).</p><p>بالنسبة للسنة الثالثة: يرجى إدراج جميع المشاريع التي تخططون لتنفيذها بشكل واقعي، حتى وإن لم تعرفوا بعد الجهة المانحة التي ستمولها. لذلك، من المقبول أن يكون العديد من المشاريع في السنة الثالثة "غير مؤكدة". لكل مشروع، قدم أفضل تقدير لديك للميزانية المتوقعة، حتى لو لم يتم تأكيد المبلغ الدقيق، أو إذا كنتم قد تحتاجون إلى تمويل من عدة جهات مانحة (على سبيل المثال، إذا كنت تتوقع أن تكلفتك للمشروع تتراوح بين 40,000 و80,000، يمكنك ذكر المتوسط وهو 60,000 كتقدير). بعد ذلك، يمكنك اختيار أحد الخيارات الثلاثة للإشارة إلى احتمال تمويل ذلك المشروع:</p><p>مؤكد: يوجد التزام ثابت بالتمويل والمشروع (يمكن أن يشمل التزامات مكتوبة أو شفوية صريحة، حتى لو لم يتم توقيع عقد متعدد السنوات).</p><p>محتمل (أكثر من 80%): تقدّر أن هناك فرصة تزيد عن 80% لتحقيق تمويل المشروع (على سبيل المثال، مانح سبق أن موّل مشاريعكم في السنوات السابقة وأنتم في مفاوضات لتمديد التمويل، أو مانح أنتم متقدمون في إجراءات التمويل لديه مؤشرات على احتمالية الحصول على التمويل رغم عدم توقيع العقد بعد).**</p>
        <p>غير مؤكد: هناك احتمال أقل من 80% لتنفيذ المشروع والحصول على التمويل. يرجى إدراج المشاريع التي تعتقدون أن هناك فرصة واقعية لتنفيذها فقط، وليس قائمة أمنيات لمشاريع غير مرجحة (على سبيل المثال، إذا كانت منظمتكم تنفذ عادةً 5 إلى 6 مشاريع سنويًا بميزانية إجمالية تبلغ 2 مليون دولار، فلا تقم بإدراج 12 مشروعًا "غير مؤكد" بميزانية إجمالية تبلغ 4 ملايين دولار).</p><p>
قد تنتهي بعض المشاريع في منتصف الفترة الممتدة لثلاث سنوات؛ إذا حدث ذلك، يرجى وضع "0" في الميزانية للسنوات التي ينتهي فيها المشروع.</p> <p>
يرجى ملاحظة أنه بالنسبة للسنة القادمة (السنة الثانية)، نطلب أيضًا تفصيلًا لكيفية توزيع المنحة الأساسية غير المقيّدة على كل مشروع. نحن ندرك أن هذا التوزيع قد يتغير خلال العام مع تغيّر احتياجات التمويل؛ ومع ذلك، نرغب في الحصول على أفضل تقدير لديكم في الوقت الحالي. لا تحتاجون إلى تحديد كيفية صرف التمويل الأساسي في السنة الثالثة بدقة، ولكن يجب أن يُحتسب ضمن المبلغ الإجمالي. ليس من الضروري تعبئة جميع الصفوف.
</p>`
    }, 
    {
        id: "project_year",
        en: "Year",
        sp: "Año",
        fr: "Année",
        ar: 'سنة'
    },
    {
        id: "budget",
        en: "Budget",
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
        sp: "Financiamiento básico asignado para",
        fr: "Fonds de base alloués à l’",
        ar: 'تقدير الاحتمالية'
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
        en: ` <p>
        Please fill in data for the upcoming year only (Year 2). Near the end of each year, you will be
        asked to provide information for the following year.
        </p><p>
        If there are projects you listed that will only be active in Year 3, you can leave the rows for them
        blank below.
        </p><p>For each project, provide a division of the costs by the Project Focus Areas used (selected from
        the drop-down menu). </p>
        <p><strong>A single project can have multiple Project Focus Areas. Please use a new row for each
        Project Focus Area that is directly relevant within a project (e.g., a single project that has
        both Mobile Clinic and Static Clinic would get two rows).</strong>
        <p></p> Please estimate the cost for
        work within each Project Focus Area; given that staff time might be split across multiple Project
        Focus Areas, please use your best estimate of the share of time spent on different Project Focus
        Areas to reach the cost breakdown. Kindly ensure that the project focus area assigned to a project
        in 2023 is not changed in 2024.
        </p><p class="mb-0">The reference table at the right (column Q, row 17) shows how much of each project's
        Year 2 budget you have allocated to Project Focus Areas, so you know if there is more to allocate <i
        class="far fa-arrow-alt-circle-up ml-1" data-toggle="collapse" data-target="#collapseExample1"
        aria-expanded="true" aria-controls="collapseExample"></i></p>`,
        sp: "Para cada proyecto, divida su presupuesto según las áreas prioritarias de IPPF (seleccione del menú desplegable). Un solo proyecto puede tener varias Áreas prioritarias. Utilice una fila nueva para cada área prioritaria del proyecto que sea directamente pertinente dentro de cada proyecto. Haga la mejor estimación posible para calcular los gastos presupuestados para cada área prioritaria del proyecto. La tabla de referencia en la derecha (columna Q, fila 17) indica qué cantidad del presupuesto del Año 2 de cada proyecto se ha asignado a Áreas prioritarias del proyecto, de ese modo sabrá si se puede asignar más. No es necesario completar todas las filas.",
        fr: "Pour chaque projet, veuillez diviser votre budget en fonction des domaines d'intervention de l'IPPF (sélectionnés dans le menu déroulant). Un même projet peut avoir plusieurs volets d’intervention. Veuillez utiliser une ligne pour chaque volet d'intervention qui est directement pertinent au projet en question Veuillez utiliser vos estimations les plus précises pour décider des dépenses budgétisées par volet d'intervention du projet. Le tableau de référence à droite (colonne Q, ligne 17) indique pour chaque projet la part du budget pour l'Année 2 que vous avez allouée aux volets d'intervention, afin de connaître le montant qu'il vous reste à allouer, le cas échéant Il n’est pas obligatoire de remplir toutes les lignes.",
        ar: "<p>يرجى تعبئة البيانات الخاصة بالسنة القادمة فقط (السنة الثانية). في نهاية كل عام، سيُطلب منكم تقديم المعلومات الخاصة بالسنة التالية.</p><p>إذا كانت هناك مشاريع قمت بإدراجها ولن تكون نشطة إلا في السنة الثالثة، يمكنك ترك الصفوف الخاصة بها فارغة أدناه.</p><p>لكل مشروع، يرجى تقديم توزيع للتكاليف حسب مجالات تركيز المشروع المستخدمة (يتم اختيارها من القائمة المنسدلة).</p><p>يمكن أن يحتوي المشروع الواحد على عدة مجالات تركيز. يرجى استخدام صف جديد لكل مجال تركيز مرتبط مباشرة بالمشروع (على سبيل المثال، المشروع الذي يشمل كلًا من العيادة المتنقلة والعيادة الثابتة يجب أن يُدرج في صفّين).</p><p>يرجى تقدير تكلفة العمل ضمن كل مجال تركيز في المشروع؛ ونظرًا لأن وقت الموظفين قد يكون موزعًا بين عدة مجالات تركيز، يرجى استخدام أفضل تقدير لديك لنسبة الوقت المخصص لكل مجال تركيز للوصول إلى توزيع التكلفة. نرجو التأكد من عدم تغيير مجال التركيز المخصص لأي مشروع في عام 2023 عند تحديثه لعام 2024.</p><p>يوضح الجدول المرجعي على اليمين (العمود Q، الصف 17) مقدار الميزانية المخصصة من السنة الثانية لكل مشروع حسب مجالات التركيز، بحيث يمكنك معرفة ما إذا كان لا يزال هناك جزء لم يتم تخصيصه بعد.</p>"
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
        en: `<p> Please fill in data for the upcoming year only (Year 2).
        Near the end of next year, you will be asked to provide
        information for the following year.
      </p> <p>
        If there are projects you listed that will only be active
        in Year 3, you can leave the rows for them blank below.
      </p> <p>
        Please list your expenses by project by expense category.
        As above, this table should cover your entire
        organizational budget.
      </p> <p>
        <strong >Cost categories are defined as follows: </strong>
      </p> <p>
        <strong>Personnel:</strong> Includes ALL costs for staff
        allocated to this project. For each project, this should
        also include a share of support staff personnel costs
        (e.g., accounting, HR, senior leadership) No staff costs
        should appear in “direct project activities” nor in
        “indirect/support costs.” We realize this will make
        personnel appear higher than it appears in other reports,
        and that is fine.
      </p> <p>
        Staff costs include Salaries, Benefits, Sessional Fees,
        Severance/Redundancy, Retirement/Pension, Recruitment,
        Other personnel expenses.Includes temporary workers,
        interns, uniforms, insurance, taxes, and other fiscal
        personnel charges. If the MA employs consultants to serve
        as ongoing service providers (instead of employees),
        include their fees as well.
      </p> <p>
        <strong>Direct project activities:</strong> This includes
        any direct costs that are not captured under personnel or
        commodity costs. Can include equipment, professional
        services,travel, media and print materials, etc. This can
        include both recurring and capital expenditures. No
        personnel costs should be included here.
      </p> <p>
        <strong>Commodities:</strong> Commodities: This includes
        the cost of purchasing medical supplies or contraceptives
        required for delivery of SRH services. The value of
        donated commodities should be listed both as an expense
        and as a source of income (below).
      </p> <p>
        <strong>Indirect and support costs:</strong> This includes
        occupancy costs, utilities, and other support functions
        that are not direct project costs and not captured in the
        above categories.This can include both recurring and
        capital expenditures. No personnel costs should be
        included here.
      </p> <p>
        The reference table at the right (column L, row 25) shows
        how much of each project's Year 2 budget you have
        allocated to Expense Categories, so you know if there is
        more to allocate Not all rows must be filled.
        <i
          class="far fa-arrow-alt-circle-up ml-1"
          data-toggle="collapse"
          data-target="#collapseExample1"
          aria-expanded="true"
          aria-controls="collapseExample"
        ></i></p>`,
        sp:`Para cada proyecto, enumere los gastos presupuestados por categoría de gasto de IPPF. Como en las tablas anteriores, esta tabla debe abarcar el presupuesto entero de su organización.	
        <strong>Las categorías de costos se definen del siguiente modo:</strong>	
            <strong>Personal:</strong> Incluye TODOS los costos de personal asignados a este proyecto. Para cada proyecto, esto también debería incluir un porcentaje de costos de personal de apoyo (p. ej., contabilidad, RR. HH., equipo directivo superior).
            No se deben incluir costos de personal en «costos directos de actividades del proyecto» ni en «costos indirectos/de apoyo». Sabemos que esto hará que los costos de personal parezcan más elevados que en otros informes; esto no es un problema.
            Los costos de personal incluyen salarios, prestaciones, honorarios por sesiones, indemnizaciones por despido/reducción de personal, jubilación/pensiones, contratación y otros gastos de personal. 
            Incluye a trabajadores temporales, pasantes, uniformes, seguros, impuestos y otros gastos fiscales de personal. Si la AM utiliza consultores para que presten servicios como proveedores 
            de forma continua (en vez de empleados), se deben incluir también sus honorarios.
            <strong>Costos directos de actividades del proyecto:</strong> Incluyen todos los costos directos que no estén contemplados en costos de personal o de productos. Pueden ser costos de equipos, servicios profesionales, 
            viajes, medios audiovisuales y materiales de impresión, etc. Pueden incluir tanto costos recurrentes como inversiones de capital. No se deben incluir aquí costos de personal.
            <strong>Productos:</strong> Incluyen los costos de la compra de suministros médicos o anticonceptivos necesarios para la prestación de servicios de SSR. 
            El valor de los productos donados debería registrarse como gasto y, al mismo tiempo, como fuente de ingresos (abajo).
            <strong>Costos indirectos y de apoyo:</strong> Incluyen costos de alquiler, servicios públicos, y otras funciones de apoyo que no sean costos directos del proyecto y que no estén registrados en las categorías anteriores. 
            Pueden incluir tanto costos recurrentes como inversiones de capital. No se deben incluir aquí costos de personal.`,
        fr: `Pour chaque projet, veuillez énumérer vos dépenses budgétisées par catégorie de dépenses de l'IPPF. Comme pour les tableaux précédents, ce tableau doit couvrir le budget de l'ensemble de votre organisation.	
        <strong>Les catégories de coût sont définies comme suit : </strong>	
        <strong>Personnel :</strong> Inclut TOUS LES frais du personnel affecté à ce projet. Pour chaque projet, il convient également d’inclure une part des frais du personnel de soutien (par ex. comptabilité, RH, haute direction)
            Aucuns frais de personnel ne doivent figurer à la rubrique « Activités directes du projet » et « Coûts indirects/de soutien ». Nous sommes conscients que les frais de personnel sembleront plus élevés que ceux qui figurent dans d’autres rapports et il n’y a pas de problème à cela.
            Les frais de personnel comprennent les salaires, les avantages sociaux, les indemnités de session, les indemnités de départ/de licenciement, les régimes de retraite/pension, les frais de recrutement et les autres dépenses de personnel. 
            Sont inclus les frais des travailleurs temporaires, des stagiaires, les uniformes, les assurances, les impôts, et autres frais budgétaires du personnel. Si l’AM emploie des consultants à titre de prestataires de service permanents 
            (au lieu de salariés), leurs honoraires doivent également être ajoutés.
            <strong>Activités directes du projet :</strong> Sont inclus tous les coûts directs qui ne sont pas comptabilisés dans les frais de personnel ou les coûts des produits. Peuvent inclure le matériel, les services professionnels, 
            les frais de déplacement, les annonces médiatiques et les frais d’impression, etc. Il peut s’agir de dépenses récurrentes et de dépenses en capital. Aucuns frais de personnel ne doivent être inclus ici.
            <strong>Produits :</strong> Est inclus le coût de l’achat de fournitures médicales ou de contraceptifs nécessaires à la prestation des services de SSR. 
            Le montant des dons de produits doit être comptabilisé à la fois comme dépense et comme source de revenu (ci-dessous).
            <strong>Coûts indirects et de soutien :</strong> Sont inclus les coûts d’occupation, des services publics et d’autres fonctions de soutien qui ne sont pas des coûts directs du projet et qui ne sont pas compris dans les catégories ci-dessus. 
            Il peut s’agir de dépenses récurrentes et de dépenses en capital. Aucuns frais de personnel ne doivent être inclus ici.`,
        ar: '<p>يرجى تعبئة البيانات الخاصة بالسنة القادمة فقط (السنة الثانية). في نهاية كل عام، سيُطلب منكم تقديم المعلومات الخاصة بالسنة التالية.</p><p>إذا كانت هناك مشاريع قمت بإدراجها ولن تكون نشطة إلا في السنة الثالثة، يمكنك ترك الصفوف الخاصة بها فارغة أدناه.</p><p>يرجى سرد مصروفاتكم لكل مشروع حسب فئة المصروفات. كما هو موضح أعلاه، يجب أن يشمل هذا الجدول ميزانية المنظمة بالكامل.</p><p><strong>تصنف فئات التكلفة كما يلي:</strong></p><p>الموظفون: تشمل جميع التكاليف الخاصة بالموظفين المخصصين لهذا المشروع. لكل مشروع، يجب أن يتضمن ذلك أيضًا حصة من تكاليف موظفي الدعم (مثل المحاسبة، الموارد البشرية، القيادة العليا). لا ينبغي أن تظهر تكاليف الموظفين ضمن "أنشطة المشروع المباشرة" أو "التكاليف غير المباشرة/دعم". نحن ندرك أن هذا قد يجعل تكاليف الموظفين تبدو أعلى مقارنة بالتقارير الأخرى، وهذا مقبول.</p><p>تشمل تكاليف الموظفين الرواتب، والمزايا، وأتعاب الجلسات، والتعويضات/المكافآت عند الفصل، والتقاعد/المعاشات، والتوظيف، ونفقات أخرى تتعلق بالموظفين. وتشمل أيضًا العمالة المؤقتة، والمتدربين، والزي الرسمي، والتأمين، والضرائب، وغيرها من التكاليف المالية المتعلقة بالموظفين. إذا كانت المنظمة التنفيذية توظف مستشارين كمقدمي خدمات مستمرة (بدلاً من الموظفين)، فيجب أيضًا تضمين أتعابهم.</p><p>الأنشطة المباشرة للمشروع: تشمل أي تكاليف مباشرة لا تندرج تحت تكاليف الموظفين أو السلع. يمكن أن تشمل المعدات، الخدمات المهنية، السفر، المواد الإعلامية والطباعة، وغيرها. يمكن أن تشمل النفقات المتكررة والنفقات الرأسمالية. لا يجب تضمين تكاليف الموظفين هنا.</p><p>السلع: تشمل تكاليف شراء المستلزمات الطبية أو وسائل منع الحمل المطلوبة لتقديم خدمات الصحة الجنسية والإنجابية. يجب إدراج قيمة السلع المتبرع بها كمصروفات وكمصدر دخل (أدناه).</p><p>التكاليف غير المباشرة وتكاليف الدعم: تشمل تكاليف الإشغال والمرافق والوظائف الداعمة الأخرى التي ليست تكاليف مباشرة للمشروع وليست مغطاة في الفئات السابقة. يمكن أن تشمل النفقات المتكررة والنفقات الرأسمالية. لا يجب تضمين تكاليف الموظفين هنا.</p><p>يوضح الجدول المرجعي على اليمين (العمود L، الصف 25) مقدار الميزانية المخصصة من السنة الثانية لكل مشروع حسب فئات المصروفات، بحيث يمكنك معرفة ما إذا كان لا يزال هناك مبلغ لم يتم تخصيصه بعد. ليس من الضروري تعبئة جميع الصفوف.</p>'
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
        sp: "totales",
        fr: "Totale",
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
        sp: "Ingresos internacionales (no procedentes de la IPPF)",
        fr: "Revenus internationaux (hors IPPF)",
        ar: "الدخل الدولي (من غير IPPF)"
    },
    {
        id: "ippf-income",
        en: "IPPF income",
        sp: "Ingresos de la IPPF",
        fr: "Revenus de l’IPPF",
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
        en: "IPPF Restricted Grant",
        sp: "SUBVENCIONES RESTRINGIDAS DE IPPF",
        fr: "SUBVENTION AVEC RESTRICTIONS DE L'IPPF",
        ar: "منحة مقيدة اتحاد IPPF"
    },
    {
        id: "ippf-unrestricted",
        en: "IPPF Unrestricted Grant",
        sp: "SUBVENCIONES NO RESTRINGIDAS DE LA IPPF",
        fr: "SUBVENTION SANS RESTRICTIONS DE L'IPPF",
        ar: "منحة غير مقيدة اتحاد IPPF"
    },
    {
        id: "organisation_contributor",
        en: "Which organisation (government, trust, foundation, IPPF or other donor) was the largest contributor",
        sp: "¿Qué organización (gobierno, patronato, fundación, IPPF u otro donante) contribuyó con la suma más grande a sus ingresos de 2023?",
        fr: "Quelle organisation (organisme public, trust, fondation, l'IPPF ou autre bailleur) a le plus contribué à vos revenus de 2023 ?",
        ar: 'ما هي المنظمة (سواء حكومة، اتحاد، مؤسسة، اتحاد IPPF أو جهة مانحة أخرى) التي كانت أكبر مساهم في دخلكم عام 2023؟ '
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
        id: "income_donor_info",
        en: `<p>
        Please fill in complete data for all three years, using your best estimates.
        Near the end of the next year, you will be able to update the numbers for the
        following year.
    </p><p class="mb-0">
        <strong>Please include all donors who either fund an entire project, or who fund
            at least 10% of your entire budget.</strong> You do not have to include all
        smaller donors.
        These income estimates should be the most likely scenario (e.g., 80% likely),
        not the best case scenario.
        Not all rows must be filled. <i class="far fa-arrow-alt-circle-up ml-1"
            data-toggle="collapse" data-target="#collapseExample1" aria-expanded="true"
            aria-controls="collapseExample1"></i>
    </p>`,
        sp: "Proporcione datos completos para los tres años, aplicando cálculos lo más precisos posibles.<strong> Incluya todos los donantes que o bien financian un proyecto completo, o que financian al menos un 10 % de su presupuesto total. </strong>Estas previsiones de ingresos deben basarse en la situación más probable (p. ej., un 80 % de probabilidad), no en la mejor situación posible. No es necesario completar todas las filas.",
        fr: "Veuillez remplir les données complètes pour les trois années, en utilisant vos estimations les plus précises. <strong>Veuillez inclure tous les bailleurs de fonds qui soit financent un projet dans son intégralité, soit financent au moins 10 % de l’ensemble de votre budget.</strong> Ces estimations de recettes doivent correspondre au scénario le plus probable (plus de 80 % de probabilité) et non au scénario fondé sur les hypothèses les plus favorables. Il n’est pas obligatoire de remplir toutes les lignes.",
        ar: "<p>يرجى تعبئة البيانات كاملة لجميع السنوات الثلاث، باستخدام أفضل تقديراتكم. في نهاية العام القادم، ستتمكنون من تحديث الأرقام للسنة التالية.</p><p>يرجى تضمين جميع المانحين الذين يمولون مشروعًا كاملاً أو الذين يمولون ما لا يقل عن 10% من إجمالي ميزانيتكم. ليس من الضروري تضمين جميع المانحين الصغار. يجب أن تعكس تقديرات الدخل السيناريو الأكثر احتمالاً (مثل 80% احتمالاً)، وليس السيناريو الافضل . ليس من الضروري تعبئة جميع الصفوف.</p>"
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
        en: "Donor Details",
        sp: "Donante",
        fr: "Nom du bailleur de fonds",
        ar: 'تفاصيل الجهة المانحة'
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
        en: "Amount Unlocked",
        sp: "Cantidad bloqueada",
        fr: "Montant bloqué",
        ar: 'المبلغ مفتوح'
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
        ar: "وإذا لزم الأمر، يرجى إدراج التمويل النوعي الذي فُتح في إطار تمويلات المسار 1 من اتحاد IPPF، بما في ذلك مصدر ومبلغ المنحة المقدمة. "
    },
    //Order Commodities
    {
        id: "summary_commodities",
        en: "Summary of Core Grant in Cash & Commodities",
        sp: "Resumen de la subvención básica en efectivo y materias primas",
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
                Prices for products can be subject to your country’s World Bank Classification. <a href="../../documents/uhH1VcyfDoW/data">Click on this link to find your country’s status</a>.
              </li>
              <li>
                Products can be subject to mandatory order multiples. The order form will only allow you to enter these mandatory quantities.
              </li>
            </ul>
          </li>
          <li>
            Transport costs will be added to the total costs when shipments are ready. For budgeting purposes only, the form works with following estimated standard rates:
          <ul>
            <li>
              100% value of your commodity order if your product request has a value between $0 and $1,000.
            </li>
            <li>
              40% value of your commodity order if your product request has a value between $1,000 and $5,000
            </li>
            <li>
              25% value of your commodity order if your product request has a value higher than $5,000
            </li>
          </ul>
          </li>
          <li>
            This is an indicative budgeting exercise only, commodities quantification for 2025 will be finalized in October 2024 per the initiative of the supply chain team.
          </li>
          <li>
            If you wish to procure products from IPPF that are funded by a different grant (e.g.,restricted project), please email the supply chain team (hlynds@ippf.org &amp;sheath@ippf.org).
          </li>
          <li>
            If you wish to procure products that are not listed below (e.g., medical equipment,medical consumables, generic medicines), email the supply chain team(hlynds@ippf.org &amp; sheath@ippf.org).
          </li>
        </ul>
    
        <p class="mb-0">We cannot accept cancellations or changes to your request upon order release.
          <i class="far fa-arrow-alt-circle-up ml-1" data-toggle="collapse" data-target="#collapseExample1"
            aria-expanded="true" aria-controls="collapseExample"></i>
        </p>`,
        sp:`<p>Nota:</p>
        <ul class="list">
          <li>
          Desplazarse hacia abajo y completar este formulario si están haciendo pedidos de productos a la IPPF con dinero de la subvención de la IPPF; de otro modo, puede dejarse en blanco.
          </li>
          <li>
          El valor de los productos que pidan abajo afectará a la cantidad de la 
subvención de la IPPF que reciban en efectivo y la que reciban en forma 
de productos (como se indica en la parte de abajo del formulario)
</li>
          <li>
          Solo deben pedir productos cuya importación esté permitida en su país. 
          Los fabricantes con los que tenemos contratos requerirán garantía de 
          permiso de importación para los productos pedidos, en caso de que dichos
          productos no estén registrados en su país.
           </li>
          <li>
          Se deben leer las notas debajo del producto que desean pedir.
            <ul>
              <li>
              Los precios de los productos pueden estar sujetos a la 
              Clasificación del Banco Mundial de su país. <a href="../../documents/uhH1VcyfDoW/data">Hacer clic en este enlace para averiguar la clasificación de su país</a>.
              </li>
              <li>
              Es posible que los pedidos de productos estén sujetos a múltiplos obligatorios. El formulario de pedido solo permitirá introducir esas cantidades obligatorias</li>
            </ul>
          </li>
          <li>
          Los costos de transporte se añadirán a los costos totales cuando los 
          envíos estén preparados. Para fines presupuestarios únicamente, el 
          formulario funciona con las siguientes tarifas estándar estimadas:
          <ul>
            <li>
            El 100% del valor del pedido de productos si su solicitud de productos tiene un valor de entre 0 USD y 1000 USD.
            </li>
            <li>
            El 40% del valor del pedido de productos si su solicitud de productos tiene un valor de entre 1000 USD y 5000 USD.
            </li>
            <li>
            El 25% del valor del pedido de productos si su solicitud de productos tiene un valor superior a 5000 USD.
            </li>
          </ul>
          </li>
          <li>
          Este es un ejercicio presupuestario meramente indicativo; la  cuantificación de productos para 2025 se completará en octubre de 2024 según la iniciativa del equipo de cadena de suministro.
          </li>
          <li>
          Si desean comprar productos a la IPPF financiados a través de otra 
          subvención (p. ej., de un proyecto restringido), deben enviar un correo 
          electrónico al equipo de cadena de suministro (hlynds@ippf.org y 
          sheath@ippf.org).
          </li>
          <li>
          Si desean comprar productos que no figuran abajo (p. ej., equipos 
            médicos, consumibles médicos, medicamentos genéricos), deben enviar 
            un correo electrónico al equipo de cadena de suministro (hlynds@ippf.org 
            & sheath@ippf.org).
            </li>
        </ul>
    
        <p class="mb-0">No podemos aceptar cancelaciones ni cambios en los pedidos tras su 
        expedición.
          <i class="far fa-arrow-alt-circle-up ml-1" data-toggle="collapse" data-target="#collapseExample1"
            aria-expanded="true" aria-controls="collapseExample"></i>
        </p>`,
        fr: 
        `  <p>Note:</p>
        <ul class="list">
          <li>
          Faites défiler ce formulaire sous-visé et remplissez-le si vous commandez
          des produits auprès de l’IPPF en utilisant votre subvention de l’IPPF ; 
          sinon, il peut rester vide.
          </li>
          <li>
          Le montant des produits que vous commandez ci-dessous aura des 
          répercussions sur la part de la subvention de base que vous recevrez en 
          espèces par rapport à celle reçue en produits (comme illustré au bas du 
          formulaire).
          </li>
          <li>
          Toute demande de votre part doit porter uniquement sur des produits 
          dont l’importation est autorisée dans votre pays. Nos fabricants sous 
          contrat vous demanderont de confirmer que vous avez la certitude 
          d’obtenir une exemption des droits d’importation pour les produits 
          demandés, au cas où ceux-ci ne sont pas enregistrés dans votre pays.
          </li>
          <li>
          Veuillez consulter les notes ci-dessous concernant le produit que vous 
          souhaitez commander.
            <ul>
              <li>
              Les prix des produits peuvent être soumis au statut de votre 
              pays en fonction de la classification de la Banque mondiale. 
             
              <a href="../../documents/uhH1VcyfDoW/data"> Cliquez sur ce lien pour connaître le statut de votre pays</a>.
              </li>
              <li>
              Les produits peuvent être soumis à des multiples de commande 
              fixes. Seules ces quantités selon des multiples fixes peuvent être 
              indiquées sur le formulaire.
              </li>
            </ul>
          </li>
          <li>
          Les coûts de transport seront ajoutés aux coûts totaux lorsque les envois 
          seront prêts. Uniquement à des fins d’établissement du budget, le 
          formulaire fonctionne avec les taux standard estimés suivants :
          <ul>
            <li>
            100 % de la valeur de votre commande de produits si le montant 
            de votre demande de produit est compris entre 0 dollar et 1 
            000 dollars
            </li>
            <li>
            40 % de la valeur de votre commande de produits si le montant de 
            votre demande de produit est compris entre 1 000 dollars et 
            5 000 dollars
            </li>
            <li>
            25 % de la valeur de votre commande de produits si le montant de 
            votre demande de produit est supérieur ou égal à 5 000 dollars
            </li>
          </ul>
          </li>
          <li>
          Il s’agit d’un exercice d’établissement du budget uniquement à titre 
          indicatif. La quantification des produits pour 2025 sera finalisée en 
          octobre 2024 à l’initiative de l’équipe de la chaîne d’approvisionnement.
          </li>
          <li>
          Si vous souhaitez vous procurer des produits auprès de l’IPPF qui sont 
          financés par une autre subvention (par ex. projet avec restrictions), 
          veuillez envoyer un e-mail à l’équipe d’achat de produits (hlynds@ippf.org
          et sheath@ippf.org)
          </li>
          <li>
          Si vous souhaitez vous procurer des produits qui ne sont pas répertoriés ci-
          dessous (par exemple du matériel médical, des consommables médicaux, 
          des médicaments génériques), veuillez envoyer un e-mail à l’équipe d’achat
          de produits (hlynds@ippf.org et sheath@ippf.org). </li>
        </ul>
    
        <p class="mb-0">Une fois la commande envoyée, il ne nous est plus possible d’en accepter 
        l’annulation ou la modification.
          <i class="far fa-arrow-alt-circle-up ml-1" data-toggle="collapse" data-target="#collapseExample1"
            aria-expanded="true" aria-controls="collapseExample"></i>
        </p>`,
        ar:  `<p>ملحوظة:</p>
        <ul class="list">
          <li>
          قم بالتمرير لأسفل وأكمل هذه الاستمارة إذا كنت تطلب سلعًا طبيةً من الاتحاد الدولي لتنظيم الأسرة مستخدمًا منحتكم من الاتحاد الدولي لتنظيم الأسرة؛ وإلا فاتركها فارغة
          </li>
          <li>
          سوف تؤثر قيمة السلع الطبية التي تطلبها أدناه على مقدار منحتكم الذي تحصلون عليه نقدًا مقابل ما تحصلون عليه سلعًا طبيةً من الاتحاد (كما هو موضح أسفل الاستمارة). 
          </li>
          <li>
          ونرجو أن يقتصر الطلب على السلع الطبية التي يُسمح لكم باستيرادها إلى بلادكم. وإذا كانت السلع غير مسجلة في بلادكم، فسوف تطلب منكم الشركات المصنعة المتعاقدة معنا تأكيد الحصول على إذن باستيراد السلع المطلوبة 
          </li>
          <li>
          يرجى مراجعة الملاحظات أسفل المنتج المطلوب.
            <ul>
              <li>
              <a href="../../documents/uhH1VcyfDoW/data">يمكن أن تخضع أسعار المنتجات لتصنيف البنك الدولي لبلدكم. انقر على هذا الرابط لمعرفة حالة بلدكم. </li>
              <li>
              تتأثر المنتجات بمضاعفات بنود الطلب الإجبارية. تسمح لكم استمارة الطلب بإدخال هذه الكميات الإجبارية فقط.</li>
            </ul>
          </li>
          <li>
          سوف تُضاف تكاليف النقل إلى إجمالي التكاليف عند تجهيز الشحنات. لأغراض الميزانية فقط، تخضع استمارة الطلب للمعدلات التقديرية الموحدة التالية:
          <ul>
            <li>%100 من قيمة طلب السلع الخاص بكم إذا كانت قيمة الطلب تتراوح بين 0 و1,000 دولار.
            </li>
            <li>
            40% من قيمة طلب السلع إذا كانت قيمة المنتجات المطلوبة تتراوح بين 1,000 دولار و 5,000 دولار
            </li>
            <li>
            25% من قيمة طلب السلع إذا كانت قيمة المنتجات المطلوبة أعلى من 5,000 دولار
            </li>
          </ul>
          </li>
          <li>
          وهذا إجراء توضيحي فقط للاستعانة به في إعداد الميزانية، وفي أكتوبر 2024 سيتم الانتهاء من تحديد كمية السلع لعام 2025 حسب مبادرة فريق سلسلة التوريد.
          </li>
          <li>
          وإذا كنت ترغب في شراء منتجات من اتحاد IPPF ممولة من منحة أخرى (على سبيل المثال، مشروع مقيد)، يرجى إرسال بريد إلكتروني إلى فريق سلسلة التوريد (hlynds@ippf.org و sheath@ippf.org).
          </li>
          <li>
          وإذا كنت ترغب في شراء منتجات غير مدرجة أدناه (على سبيل المثال، معدات طبية ومواد استهلاكية طبية وأدوية عامة)، أرسل بريدًا إلكترونيًا إلى فريق سلسلة التوريد (hlynds@ippf.org و sheath@ippf.org).
          </li>
        </ul>
    
        <p class="mb-0">لا يمكننا قبول إلغاءات أو تعديلات على طلبكم بعد إصدار الطلب.
          <i class="far fa-arrow-alt-circle-up ml-1" data-toggle="collapse" data-target="#collapseExample1"
            aria-expanded="true" aria-controls="collapseExample"></i>
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
        en: `<p>Please fill in complete data for Year 1 at the start of the cycle. Near the end
        of each year, you will be asked to provide information for the following year.
         <p>List your total expected commodities for the upcoming year, broken down by the
        following categories.</p>
    <p class="mb-0">The sum of all of these categories should equal your total
        commodities listed in project expenses. As above, please only include sources
        that have at least an 80% chance of being secured.
        <i class="far fa-arrow-alt-circle-up ml-1" data-toggle="collapse"
            data-target="#collapseExample1" aria-expanded="true"
            aria-controls="collapseExample"></i>
    </p>`,
        sp: "Se deben aportar los datos completos para el Año 1 al inicio del ciclo. Cuando se acerque el final de cada año, se le pedirá que ofrezca información para el año siguiente.Indique los productos totales previstos para el próximo año, desglosados según las siguientes categorías. La suma de todas estas categorías debería ser igual a los productos totales indicados en los gastos del proyecto. Como antes, solo se deben incluir fuentes cuya probabilidad de otorgar realmente los fondos sea de al menos un 80 %.",
        fr: "Veuillez indiquer les données complètes pour l’Année 1 au début du cycle. Vers la fin de chaque année, il vous sera demandé de fournir des informations pour l’année suivante.Dressez la liste de vos produits de base prévus pour l’année à venir, répartis en fonction des catégories suivantes. La somme de toutes ces catégories doit correspondre au montant total de vos produits indiqué dans vos dépenses de projet. Comme plus haut, veuillez indiquer uniquement les sources de recettes ayant au moins 80 % de chances d’être obtenues.",
        ar: "<p>يرجى ملء البيانات كاملة للسنة الأولى في بداية الدورة. ومع اقتراب نهاية كل سنة، سوف يُطلب منك بيانات عن السنة التالية</p><p> أعِد قائمة بإجمالي السلع الطبية المتوقعة للسنة القادمة، مع تقسيمها حسب الفئات التالية.</p><p>ينبغي أن يتساوي مجموع هذه الفئات كلها مع إجمالي السلع الطبية الذي أدرجته في نفقات المشروع. وعلى النحو المبين أعلاه، يرجى إدراج المصادر التي لا تقل فرصة تأمينها عن 80٪.</p>"
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
        fr: "Variance",
        ar: "تفاوت"
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
        en: "1.1 Organizational info",
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
        en: "Please specify the start date and end date for the current board's term (if different members have different terms, please specify those as well)",
        sp: "Por favor, especifique la fecha de inicio y la fecha de finalización del mandato de la junta actual (si los diferentes miembros tienen mandatos diferentes, especifíquelos también)",
        fr: "Veuillez préciser la date de début et la date de fin du mandat actuel du conseil d'administration (si différents membres ont des mandats différents, veuillez également les préciser)",
        ar: "يرجى تحديد تاريخ البدء وتاريخ الانتهاء لفترة المجلس الحالية (إذا كان لدى الأعضاء المختلفين فترات مختلفة، فيرجى تحديدها أيضًا)"
    },
    //Narrative Report
    {
        id: "context_events",
        en: "1. Context Events",
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
        sp: "M Avanzar en la Agenda sobre sexualidad:",
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
        en: "4. Most effective strategies / approache",
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
        en: "4. Total Budgeted Expenses vs Actual Expenses (by Focus Areas)",
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
        en: "Total Actual Expenses (by Expense Categories)",
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
        en: "5. Total Budgeted Expenses vs Actual Expenses (by Expense Category)",
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
        en: "5 - Actual Income Details",
        sp: "5 - Detalles de ingresos reales",
        fr: "5 - Détails du revenu réel",
        ar: "5- تفاصيل الدخل الفعلي     "
    },
    {
        id: "actual_income_details_info",
        en: `<p><strong>Instructions:</strong></p>
        <p>This sheet captures the actual income during the year, divided into three categories. Local Income,
          International Non-IPPF Income, and IPPF Income.</p>
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
        en: "New Project",
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
            } else {
                document.documentElement.setAttribute('dir', 'ltr');
            }

            // Localize content
            $('body').localize();

            // Change language event
            $('#languageSwitcher').on('change', function () {
                const selectedLang = $(this).val();
                if (selectedLang == 'ar') {
                    document.documentElement.setAttribute('dir', 'rtl');
                } else {
                    document.documentElement.setAttribute('dir', 'ltr');
                }
                i18next.changeLanguage(selectedLang, function () {
                    $('body').localize();
                });
            });
        });
});