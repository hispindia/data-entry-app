/**
 * IPPF BPR Portal — Help & Guidance Panel
 * Global sidebar with Instructions, Walkthrough, and Glossary tabs
 * Glossary data sourced from BPR_Annual Report_Glossary v1.6
 */

(function() {
  'use strict';

  // ═══════════════════════════════
  //  TRANSLATION SUPPORT
  //  Translates glossary names + definitions at display time
  //  Uses: translation_mapping (names) & translation_mapping_ar_glossary (definitions)
  // ═══════════════════════════════

  // Map: GLOSSARY name → { nid: translation_mapping id (for name), tid: glossary translation id (for def) }
  // Section 7 entries are omitted — they stay English-only
  var GLOSSARY_TRANS_MAP = {
    // Section 1
    'Reporting Year': { nid:'reporting_year' },
    'Reporting Periodicity': { nid:'reporting_periodicity' },
    'IPPF Region': { nid:'ippf_region', tid:'ippf_region' },
    'Affiliate': { nid:'organisation_name', tid:'affiliate' },
    'Country of Operation': { nid:'country_of_operation', tid:'country_of_operation' },
    'Affiliate Code': { nid:'organisation_code', tid:'affiliate_code' },
    'Membership Details': { nid:'membership_details', tid:'membership_details_section' },
    'Organisation Name (English)': { nid:'organisation_name', tid:'organisation_name_english' },
    'Organisation Name (Original Language)': { nid:'organisation_name_original', tid:'organisation_name_original' },
    'Primary Point of Contact': { nid:'primary_contact_person', tid:'primary_contact_person' },
    'Contact Email': { nid:'contact_email', tid:'contact_email' },
    'Institutional Data': { nid:'institutional_data', tid:'institutional_data_section' },
    'Address': { nid:'physical_address', tid:'address_definition' },
    'Key Contacts': { nid:'key_contacts', tid:'key_contacts_definition' },
    'Executive Director / CEO': { nid:'executive_director', tid:'executive_director_definition' },
    'Board Chair / President': { nid:'board_chair', tid:'board_chair_definition' },
    'Officer of the Board': { nid:'officer_of_the_board1', tid:'officer_of_the_board_definition' },
    'Treasurer': { nid:'treasurer_equivalent', tid:'treasurer' },
    'Youth Board Member': { nid:'youth_board_member', tid:'youth_board_member_definition' },
    'Programmatic Lead(s)': { nid:'programmatic_lead', tid:'programmatic_lead_definition' },
    'Finance Lead': { nid:'finance_lead', tid:'finance_lead_definition' },
    'Director of Finance': { nid:'director_finance', tid:'director_of_finance' },
    'Key Documents': { nid:'key_document', tid:'key_documents_section' },
    'Key Annual Report Documents': { nid:'key_document', tid:'key_annual_report_documents_definition' },
    'Management Letter (Audit Report)': { nid:'key_management', tid:'management_letter_audit_report_definition' },
    // Section 2
    'Context Shifts and Operational Environment': { nid:'context_events', tid:'context_events' },
    'Results & Achievements': { nid:'results_achivements', tid:'results_and_achievements' },
    'Strategic Pillar': { nid_g:'name_strategic_pillar', tid:'def_strategic_pillar' },
    'Center Care on People': { nid:'center_people', tid:'centre_care_on_people' },
    'Move the Sexuality Agenda': { nid:'move_sexuality_agenda', tid:'move_the_sexuality_agenda' },
    'Solidarity for Change': { nid:'solidarity', tid:'solidarity_for_change' },
    'Nurture our Federation': { nid:'nurture', tid:'nurture_our_federation' },
    'Marginalised Populations': { nid_g:'name_marginalised_populations', tid:'def_marginalised_populations' },
    'Youth': { nid_g:'name_youth', tid:'def_youth' },
    'Challenges': { nid:'challenges', tid:'challenges' },
    'Most Effective Strategies / Approaches': { nid:'most_effective', tid:'most_effective_strategies_approaches' },
    'Good Practice': { nid_g:'name_good_practice', tid:'good_practice' },
    'Organisational Update': { nid:'organisational_update', tid:'organisational_update' },
    'Learning': { nid:'learning', tid:'learning' },
    // Section 3
    'New Project': { nid:'new_project', tid:'new_project' },
    'Add new project': { nid:'new_project', tid:'new_project' },
    'Project Name': { nid:'project_name', tid:'project_name' },
    'Start Date': { nid:'start_date', tid:'start_date' },
    'End Date': { nid:'end_date', tid:'end_date' },
    'Project Theme': { nid:'project_theme', tid:'project_theme' },
    'Project Donor': { nid:'project_donor', tid:'project_donor' },
    'Funding Type': { nid:'funding_type', tid:'funding_type' },
    'Restricted': { nid:'restricted', tid:'restricted' },
    'Unrestricted': { nid:'unrestricted', tid:'unrestricted' },
    'Total Contract Value': { nid:'total_contract_value', tid:'total_contract_value' },
    'Annual Project Income': { nid:'annual_proj_income', tid:'annual_project_income' },
    'Description of Project': { nid:'description_project', tid:'description_of_project' },
    'Project Focus Area': { nid:'project_focus_area', tid:'project_focus_area' },
    'Expense Budget (per Focus Area)': { nid_g:'name_expense_budget_per_focus_area', tid:'expense_budget_per_focus_area' },
    'Care: Static Clinic': { nid:'focus_area_1', tid:'care_static_clinic' },
    'Care: Outreach, Mobile Clinic, Community-based Delivery': { nid:'focus_area_2', tid:'care_outreach_mobile_clinic_community_based_delivery' },
    'Care: Other Services, Enabled or Referred': { nid:'focus_area_3', tid:'care_other_services_enabled_or_referred' },
    'Care: Social Marketing Services': { nid:'focus_area_4', tid:'care_social_marketing_services' },
    'Care: Digital Health Intervention and Selfcare': { nid:'focus_area_5', tid:'care_digital_health_intervention_and_selfcare' },
    'Advocacy': { nid:'focus_area_6', tid:'advocacy' },
    'CSE (Comprehensive Sexuality Education)': { nid:'focus_area_7', tid:'cse_comprehensive_sexuality_education' },
    'CSE Online, including Social Media': { nid:'focus_area_8', tid:'cse_online_including_social_media' },
    'Partnerships and Movements': { nid_g:'name_partnerships_and_movements', tid:'partnerships_and_movements' },
    'Knowledge, Research, Evidence, Innovation': { nid_g:'name_knowledge_research', tid:'knowledge_research_evidence_innovation_and_publishing' },
    'Internal MA Infrastructure': { nid_g:'name_internal_ma_infrastructure', tid:'internal_ma_infrastructure_organisational_development' },
    'Project by Expense Category': { nid:'project_expense_category', tid:'project_by_expense_category' },
    'Personnel': { nid:'personnel', tid:'personnel' },
    'Direct Project Activities': { nid:'activities', tid:'direct_project_activities' },
    'Commodities': { nid:'commodities', tid:'commodities' },
    'Indirect / Support Costs': { nid:'indirect', tid:'indirect_support_costs' },
    // Section 4
    'Control Cells (Focus Area)': { nid:'control_cells', tid:'control_cells' },
    'Total Budgeted Expenses (by Focus Areas)': { nid:'total_budget_area', tid:'total_budgeted_expenses_by_focus_areas' },
    'Total Actual Expenses (by Focus Areas)': { nid:'actual_expense_FA', tid:'total_actual_expenses_by_focus_areas' },
    'Variance ($) \u2014 Focus Area': { nid:'variation', tid:'control_cell_variance' },
    'Total Spend (%) \u2014 Focus Area': { nid:'total_spend', tid:'control_cell_total_spend' },
    'Focus Area': { nid:'focus_area', tid:'focus_area' },
    'Budget (Focus Area)': { nid:'budget', tid:'budget' },
    'Actual Expenses (Focus Area)': { nid:'actual_expense', tid:'actual_expenses' },
    'Variance ($)': { nid:'variation', tid:'variance' },
    'Total Spend (%)': { nid:'total_spend', tid:'total_spend' },
    'Project Total (Focus Area)': { nid:'project_total', tid:'project_total' },
    'Remarks': { nid:'remarks', tid:'remarks' },
    // Section 5
    'Control Cells (Expense Category)': { nid:'control_cells', tid:'control_cells_sec5' },
    'Total MA Budgeted Expense': { nid:'total_ma_budget_expense', tid:'total_ma_budgeted_expense' },
    'Total MA Actuals by Expense Category': { nid:'total_ma_actuals', tid:'total_ma_actuals_by_expense_category' },
    'Variance ($) \u2014 Expense Category': { nid:'variation', tid:'control_cell_variance_sec5' },
    'Total Spend (%) \u2014 Expense Category': { nid:'total_spend', tid:'control_cell_total_spend_sec5' },
    'Expense Budget (including IPPF Core)': { nid:'budget_including_ippf', tid:'expense_budget_including_ippf_core' },
    'Actual (including IPPF Core)': { nid:'actual_including_ippf', tid:'actual_including_ippf_core' },
    'IPPF Core': { nid:'ippf-unrestricted', tid:'ippf_core' },
    'Variance ($) \u2014 Expense': { nid:'variation', tid:'variance_sec5' },
    'Total Spend (%) \u2014 Expense': { nid:'total_spend', tid:'total_spend_sec5' },
    'Project Total (Expense Category)': { nid:'project_total', tid:'project_total_sec5' },
    'Variance Explanation': { nid:'variance_explanation', tid:'variance_explanation' },
    // Section 6
    'Actual Income Details': { nid:'income_details', tid:'actual_income_details' },
    'Actual income': { nid:'income_details', tid:'actual_income_details' },
    'Income Category': { nid:'income_category', tid:'income_category' },
    'Serious Risk Identified': { nid:'serious_risk_identified', tid:'serious_risk_identified' },
    'Restricted (Income)': { nid:'restricted', tid:'restricted_sec6' },
    'Unrestricted (Income)': { nid:'unrestricted', tid:'unrestricted_sec6' },
    'Total Income': { nid:'total_income_ar', tid:'total_income' },
    'Total Actual Expenses (by Expense Categories)': { nid:'actual_expense_EC', tid:'total_actual_expenses_by_expense_categories' },
    'Deficit / Surplus': { nid:'deficit', tid:'deficit_surplus' },
    'Locally Generated Income': { nid:'locally-generated', tid:'locally_generated_income' },
    'Actual Locally Generated Income': { nid:'locally-generated', tid:'locally_generated_income' },
    'Commodity Sales': { nid:'commodity-sales', nid_g:'name_commodity_sales', tid:'commodity_sales' },
    'Client / Patient Fees': { nid:'client-fees', tid:'client_patient_fees' },
    'Training, Education, Professional Services': { nid:'services-rental', tid:'training_education_professional_services_and_rentals' },
    'Local/National: Government': { nid:'local-government', tid:'local_national_government' },
    'Local/National: Non-Government': { nid:'local-nongovernment', tid:'local_national_non_government' },
    'Membership Fees': { nid:'membership-fees', tid:'membership_fees' },
    'Non-operational Income': { nid:'nonoperational-income', tid:'non_operational_income' },
    'Other National Income': { nid:'other-income', tid:'other_national_income' },
    'International Income (Non-IPPF)': { nid:'international-income', tid:'international_income_non_ippf' },
    'Actual International Income (Non-IPPF)': { nid:'international-income', tid:'international_income_non_ippf' },
    'Actual International Income (Non - IPPF)': { nid:'international-income', tid:'international_income_non_ippf' },
    'Multilateral Agencies and Organisations': { nid:'multinational-agencies', tid:'multilateral_agencies_and_organisations' },
    'Foreign Governments': { nid:'foriegn-governments', tid:'foreign_governments' },
    'International Trusts and Foundations / NGOs': { nid:'interational-trusts', tid:'international_trusts_and_foundations_ngos' },
    'Corporate / Business Sector': { nid:'corporate-sector', tid:'corporate_business_sector' },
    'Other International Income': { nid:'other-international-income', tid:'other_international_income' },
    'IPPF Income': { nid:'ippf-income', tid:'ippf_income' },
    'Actual IPPF Income': { nid:'ippf-income', tid:'ippf_income' },
    'IPPF Core Grant': { nid:'ippf-unrestricted', tid:'ippf_core_grant' },
    'Other IPPF Grant': { nid:'ippf-restricted', tid:'other_ippf_grant' },
    'Largest Contributor': { nid:'organisation_contributor', tid:'largest_contributor' },
    'How Much Income Did They Provide?': { nid:'income_provided', tid:'how_much_income_did_they_provide' },
  };

  function _getCurrentLang() {
    // Read language at display time, not build time
    if (typeof i18next !== 'undefined' && i18next.language) return i18next.language;
    try { var l = localStorage.getItem('i18nextLng'); return l || 'en'; } catch(e) { return 'en'; }
  }

  function _lookupInArray(arr, id, lang) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].id === id) {
        var val = arr[i][lang];
        if (val && val.trim()) return val;
        return arr[i].en || null;
      }
    }
    return null;
  }

  function normalizeLabelText(value) {
    return (value || '')
      .replace(/[\u00A0\u202F]/g, ' ')
      .replace(/[\u2018\u2019'´`]/g, "'")
      .replace(/[\u201c\u201d]/g, '"')
      .replace(/[–—]/g, '-')
      .replace(/\s*\/\s*/g, ' / ')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  // Get translated DEFINITION for a glossary term (from glossary_translations.js)
  function getTranslatedDef(glossaryName, fallbackDef) {
    var lang = _getCurrentLang();
    if (lang === 'en') return fallbackDef;
    var mapping = GLOSSARY_TRANS_MAP[glossaryName];
    if (!mapping || !mapping.tid) return fallbackDef;
    if (typeof translation_mapping_ar_glossary === 'undefined') return fallbackDef;
    return _lookupInArray(translation_mapping_ar_glossary, mapping.tid, lang) || fallbackDef;
  }

  // Get translated NAME for a glossary term
  // First checks translation.js (nid), then glossary_translations.js (nid_g)
  function getTranslatedName(glossaryName) {
    var lang = _getCurrentLang();
    if (lang === 'en') return glossaryName;
    var mapping = GLOSSARY_TRANS_MAP[glossaryName];
    if (!mapping) return glossaryName;
    // Try translation_mapping first (nid)
    if (mapping.nid && typeof translation_mapping !== 'undefined') {
      var result = _lookupInArray(translation_mapping, mapping.nid, lang);
      if (result) return result;
    }
    // Fallback to glossary_translations (nid_g)
    if (mapping.nid_g && typeof translation_mapping_ar_glossary !== 'undefined') {
      var result2 = _lookupInArray(translation_mapping_ar_glossary, mapping.nid_g, lang);
      if (result2) return result2;
    }
    return glossaryName;
  }

  // UI label translations for help panel tabs
  var UI_LABELS = {
    'Instructions':  { sp: 'Instrucciones',       fr: 'Directives',       ar: 'تعليمات' },
    'Glossary':      { sp: 'Glosario',             fr: 'Glossaire',        ar: 'مسرد المصطلحات' },
    'Help & Guidance': { sp: 'Ayuda y orientación', fr: 'Aide et conseils', ar: 'المساعدة والإرشاد' },
  };

  function getUILabel(englishLabel) {
    var lang = _getCurrentLang();
    if (lang === 'en') return englishLabel;
    var entry = UI_LABELS[englishLabel];
    if (!entry || !entry[lang]) return englishLabel;
    return entry[lang];
  }

  // ═══════════════════════════════
  //  WALKTHROUGH / INSTRUCTIONS TRANSLATION MAP
  //  Maps section walkthrough subtitle + step descriptions to translation IDs
  //  in translation_mapping_ar_glossary (glossary_translations.js)
  // ═══════════════════════════════
  var INSTR_TRANS_MAP = {
    '1': {
      sectionTitle: 'instr_sec1_section_title',
      subtitle: 'instr_sec1_title',
      steps:  ['instr_sec1_step1_title','instr_sec1_step2_title','instr_sec1_step3_title','instr_sec1_step4_title'],
      labels: ['instr_sec1_step1_label','instr_sec1_step2_label','instr_sec1_step3_label','instr_sec1_step4_label']
    },
    '3': {
      sectionTitle: 'instr_sec3_section_title',
      subtitle: 'instr_sec3_title',
      steps:  ['instr_sec3_step1_title','instr_sec3_step2_title','instr_sec3_step3_title','instr_sec3_step4_title'],
      labels: ['instr_sec3_step1_label','instr_sec3_step2_label','instr_sec3_step3_label','instr_sec3_step4_label']
    },
    '4': {
      sectionTitle: 'instr_sec4_section_title',
      subtitle: 'instr_sec4_title',
      steps:  ['instr_sec4_step1_title','instr_sec4_step2_title','instr_sec4_step3_title','instr_sec4_step4_title'],
      labels: ['instr_sec4_step1_label','instr_sec4_step2_label','instr_sec4_step3_label','instr_sec4_step4_label']
    },
    '5': {
      sectionTitle: 'instr_sec5_section_title',
      subtitle: 'instr_sec5_title',
      steps:  ['instr_sec5_step1_title','instr_sec5_step2_title','instr_sec5_step3_title','instr_sec5_step4_title'],
      labels: ['instr_sec5_step1_label','instr_sec5_step2_label','instr_sec5_step3_label','instr_sec5_step4_label']
    },
    '6': {
      sectionTitle: 'instr_sec6_section_title',
      subtitle: 'instr_sec6_title',
      steps:  ['instr_sec6_step1_title','instr_sec6_step2_title','instr_sec6_step3_title','instr_sec6_step4_title','instr_sec6_step5_title'],
      labels: ['instr_sec6_step1_label','instr_sec6_step2_label','instr_sec6_step3_label','instr_sec6_step4_label','instr_sec6_step5_label']
    },
  };

  // Translate a walkthrough instruction text by its ID in translation_mapping_ar_glossary
  function getTranslatedInstr(instrId, fallback) {
    var lang = _getCurrentLang();
    if (lang === 'en') return fallback;
    if (typeof translation_mapping_ar_glossary === 'undefined') return fallback;
    return _lookupInArray(translation_mapping_ar_glossary, instrId, lang) || fallback;
  }

  // ═══════════════════════════════
  //  GLOSSARY DATA — from BPR v1.6
  // ═══════════════════════════════
  const GLOSSARY = [
    // ── Section 1: Organisational Info ──
    // 1.1 Membership Details
    { name:'Membership Details', def:'Basic affiliate identity and registration information for the reporting entity, including country of operation, affiliate code, IPPF region, organisation names, and the main contact person for follow-up.', sec:'sec1', tag:'1.1 Membership' },
    { name:'Reporting Year', def:'The calendar year for which the Annual Report is being submitted (e.g. 2025). All data, activities, and financial information in the report should correspond to this year.', sec:'sec1', tag:'1.1 Membership' },
    { name:'Reporting Periodicity', def:'The frequency or cycle of reporting. "Annual Reporting" indicates that the submission covers a full 12-month period, as opposed to half-yearly reporting cycles which is a 6-month period.', sec:'sec1', tag:'1.1 Membership' },
    { name:'IPPF Region', def:'The IPPF region in which the Affiliate is located (e.g. ACR \u2014 Americas and Caribbean Region).', sec:'sec1', tag:'1.1 Membership' },
    { name:'Affiliate', def:'A national organisation that is a formal member or collaborative partner of IPPF. The affiliate is the entity submitting the report.', sec:'sec1', tag:'1.1 Membership' },
    { name:'Country of Operation', def:'The country in which the Affiliate is legally registered and primarily operates.', sec:'sec1', tag:'1.1 Membership' },
    { name:'Affiliate Code', def:'The short-form or abbreviated code assigned to the Affiliate for use within the IPPF reporting system (e.g. APPA (401)).', sec:'sec1', tag:'1.1 Membership' },
    { name:'Organisation Name (English)', def:'The official name of the Affiliate written in English, as registered with IPPF.', sec:'sec1', tag:'1.1 Membership' },
    { name:'Organisation Name (Original Language)', def:'The official name of the Affiliate in the preferred IPPF language, if different from English.', sec:'sec1', tag:'1.1 Membership' },
    { name:'Primary Point of Contact', def:'The designated individual within the organisation responsible for responding to queries, clarifications, or follow-up actions related to the Annual Business Plan or Report submission.', sec:'sec1', tag:'1.1 Membership' },
    { name:'Contact Email', def:'The official email address of the primary point of contact, used for all formal correspondence regarding the submitted report or business plan.', sec:'sec1', tag:'1.1 Membership' },
    // 1.2 Institutional Data
    { name:'Institutional Data', def:'Core organisational and governance information about the affiliate, including address, leadership contacts, board details, and key management roles used for oversight and follow-up.', sec:'sec1', tag:'1.2 Institutional' },
    { name:'Address', def:'The registered physical or postal address of the Affiliate\'s main office or headquarters.', sec:'sec1', tag:'1.2 Institutional' },
    { name:'Key Contacts', def:'A set of designated individuals within the Affiliate who hold leadership or functional roles and serve as primary points of contact for IPPF communication and follow-up.', sec:'sec1', tag:'1.2 Institutional' },
    { name:'Executive Director / CEO', def:'The person responsible for the overall management and operational leadership of the organisation.', sec:'sec1', tag:'1.2 Institutional' },
    { name:'Board Chair / President', def:'The elected or appointed leader of the Affiliate\'s governing board.', sec:'sec1', tag:'1.2 Institutional' },
    { name:'Officer of the Board', def:'Additional elected or appointed members of the governing board holding designated roles such as Vice President, Secretary, or Treasurer. These individuals support the governance and oversight of the organisation.', sec:'sec1', tag:'1.2 Institutional' },
    { name:'Treasurer', def:'An elected or appointed member of the governing board responsible for overseeing the financial health of the Affiliate, ensuring proper financial governance, reviewing financial reports, and providing board-level accountability for the organisation\'s funds.', sec:'sec1', tag:'1.2 Institutional' },
    { name:'Youth Board Member', def:'A member of the governing board who represents the youth constituency of the Affiliate. Put N/A in case the position is vacant.', sec:'sec1', tag:'1.2 Institutional' },
    { name:'Programmatic Lead(s)', def:'The individual responsible for managing and delivering the Affiliate\'s portfolio of programmes and/or projects.', sec:'sec1', tag:'1.2 Institutional' },
    { name:'Finance Lead', def:'The individual responsible for managing the financial operations of the Affiliate, including budgeting, accounting, financial reporting, and audit compliance.', sec:'sec1', tag:'1.2 Institutional' },
    { name:'Director of Finance', def:'The senior staff member responsible for overseeing the financial management of the Affiliate, including budgeting, financial reporting, audit processes, internal controls, and compliance with donor and regulatory requirements.', sec:'sec1', tag:'1.2 Institutional' },
    { name:'Board Term \u2014 Start Year', def:'The year in which the current governing board\'s term of service commenced. Alternatively, use the term period of the Board Chair / President.', sec:'sec1', tag:'1.2 Institutional' },
    { name:'Board Term \u2014 End Year', def:'The year in which the current governing board\'s term of service is scheduled to conclude. Alternatively, use the term period of the Board Chair / President.', sec:'sec1', tag:'1.2 Institutional' },
    // 1.3 Key Documents
    { name:'Key Documents', def:'Supporting files required as part of the report submission, such as audit-related documents and other key records used to validate organisational and financial reporting.', sec:'sec1', tag:'1.3 Key Documents' },
    { name:'Key Annual Report Documents', def:'Supporting documents that accompany the Annual Report submission, such as the organisation\'s annual audit report.', sec:'sec1', tag:'1.3 Key Documents' },
    { name:'Management Letter (Audit Report)', def:'A formal letter issued by the external auditor to the management of the Affiliate, alongside the audit report. It typically contains findings, observations, and recommendations on internal controls, financial management, and compliance noted during the audit.', sec:'sec1', tag:'1.3 Key Documents' },

    // ── Section 2: Narrative Report ──
    // 2.1 Context Shifts and Operational Environment
    { name:'Context Shifts and Operational Environment', def:'A narrative description of significant external events or developments during the reporting year that influenced the Affiliate\'s operating environment. This includes changes in the political or legal landscape, shifts in public opinion, opposition movements, or other country-level developments relevant to Sexual and Reproductive Health and Rights (SRHR).', sec:'sec2', tag:'2.1 Context' },
    // 2.2 Results & Achievements
    { name:'Results & Achievements', def:'A summary of the main outcomes and accomplishments of the Affiliate during the reporting period, organised by IPPF Strategic Pillar. Affiliates are requested to highlight how actual results compare with planned expectations and to emphasise work with youth and marginalised populations.', sec:'sec2', tag:'2.2 Results' },
    { name:'Strategic Pillar', def:'One of the core thematic areas of IPPF\'s organisational strategy. Current pillars: Center Care on People, Move the Sexuality Agenda, Solidarity for Change, and Nurture our Federation.', sec:'sec2', tag:'2.2 Results' },
    { name:'Center Care on People', def:'IPPF Strategic Pillar focused on placing the needs, rights, and experiences of individuals \u2014 especially those most marginalised \u2014 at the heart of service delivery.', sec:'sec2', tag:'2.2 Results' },
    { name:'Move the Sexuality Agenda', def:'IPPF Strategic Pillar centred on advocacy, rights-based approaches, and shifting norms to advance sexual rights and CSE.', sec:'sec2', tag:'2.2 Results' },
    { name:'Solidarity for Change', def:'IPPF Strategic Pillar focused on movement-building, partnerships, and collective action to drive systemic SRHR change.', sec:'sec2', tag:'2.2 Results' },
    { name:'Nurture our Federation', def:'IPPF Strategic Pillar focused on strengthening internal capacity, governance, sustainability, and culture of MAs.', sec:'sec2', tag:'2.2 Results' },
    { name:'Marginalised Populations', def:'Groups facing systemic barriers to accessing SRHR services due to age, gender identity, sexual orientation, disability, socioeconomic status, ethnicity, or geographic location.', sec:'sec2', tag:'2.2 Results' },
    { name:'Youth', def:'In IPPF reporting, individuals aged 10\u201324 years. MAs are specifically asked to highlight their work with this age group.', sec:'sec2', tag:'2.2 Results' },
    // 2.3 Challenges
    { name:'Challenges', def:'A description of the main difficulties, obstacles, or constraints encountered by the Affiliate during the reporting period that affected program delivery, organisational operations, or achievement of planned results.', sec:'sec2', tag:'2.3 Challenges' },
    // 2.4 Most Effective Strategies / Approaches
    { name:'Most Effective Strategies / Approaches', def:'A reflective account of the methods, interventions, or programmatic approaches that proved most successful in achieving results during the reporting period. Affiliates are encouraged to share examples of good practice and important learnings that could benefit the wider federation.', sec:'sec2', tag:'2.4 Strategies' },
    { name:'Good Practice', def:'A documented approach, initiative, or method that has demonstrated effectiveness, efficiency, or innovation in achieving SRHR outcomes. Good practices shared may be considered for wider dissemination across affiliates.', sec:'sec2', tag:'2.4 Strategies' },
    // 2.5 Organisational Update
    { name:'Organisational Update', def:'A summary of any significant internal changes that occurred within the Affiliate during the reporting period. This may include changes to the organisational structure, leadership or board composition, staffing, or internal policies and procedures.', sec:'sec2', tag:'2.5 Org Update' },
    // 2.6 Learning
    { name:'Learning', def:'Key insights, lessons, or knowledge gained by the Affiliate through its work during the reporting period. This may include what worked well, what did not work, unexpected outcomes, or reflections that will inform future planning and programming.', sec:'sec2', tag:'2.6 Learning' },

    // ── Section 3: Add New Projects ──
    // 3.1 New Project \u2014 General Information
    { name:'New Project', def:'A project added by the Affiliate during the Annual Reporting process that was not included in the original Annual Business Plan for the reporting year. This may include newly secured grants, emergency-response initiatives, or opportunistic partnerships that arose after the business plan was finalised.', sec:'sec3', tag:'3.1 General Info' },
    { name:'Project Name', def:'The official or working title of the project as agreed with the donor or as used internally by the Affiliate.', sec:'sec3', tag:'3.1 General Info' },
    { name:'Start Date', def:'The date on which the project officially commenced implementation, formatted as DD/MM/YYYY.', sec:'sec3', tag:'3.1 General Info' },
    { name:'End Date', def:'The date on which the project is scheduled to conclude or has concluded, formatted as DD/MM/YYYY.', sec:'sec3', tag:'3.1 General Info' },
    { name:'Project Theme', def:'The primary thematic area or program focus that the project addresses. Selected from a predefined list aligned with IPPF\'s strategic priorities (e.g. SRHR services, advocacy, CSE).', sec:'sec3', tag:'3.1 General Info' },
    { name:'Project Donor', def:'The external organisation, institution, or government body that is providing funding for the project. Selected from a predefined list; if not listed, the donor can be specified under "Other".', sec:'sec3', tag:'3.1 General Info' },
    { name:'Funding Type', def:'The classification of funds as either restricted or unrestricted (core). Restricted funds have clear restrictions for their use; Unrestricted funds may be allocated flexibly.', sec:'sec3', tag:'3.1 General Info' },
    { name:'Restricted', def:'Funding that has been received from a donor with clear restrictions for its use. Restricted funds may only be used in accordance with the donor\'s conditions and cannot be redirected without donor approval.', sec:'sec3', tag:'3.1 General Info' },
    { name:'Unrestricted', def:'Funding that has not been tied to a specific purpose by the donor, giving the Affiliate flexibility to allocate it according to its own strategic priorities and operational needs.', sec:'sec3', tag:'3.1 General Info' },
    { name:'Total Contract Value', def:'The full monetary value of the project contract or grant agreement with the donor, covering the entire project period. Expressed in USD.', sec:'sec3', tag:'3.1 General Info' },
    { name:'Annual Project Income', def:'The portion of the total project funding that was received (or recognised as income) during the specific reporting year. This may differ from the total contract value if the project spans multiple years.', sec:'sec3', tag:'3.1 General Info' },
    { name:'Description of Project', def:'A summary of the project\'s purpose, target population, geographic scope, and key activities. Should provide enough context for the IPPF Secretariat to understand what the project entails and who it benefits.', sec:'sec3', tag:'3.1 General Info' },
    // 3.2 Project Focus Area
    { name:'Project Focus Area', def:'A breakdown of how the project budget is allocated across standardised programmatic categories. Each focus area represents a distinct type of service delivery, programmatic activity, or organisational function.', sec:'sec3', tag:'3.2 Focus Area' },
    { name:'Expense Budget (per Focus Area)', def:'The amount of project funding allocated to each specific focus area, expressed in the reporting currency. The sum of all focus area budgets should correspond to the total project budget.', sec:'sec3', tag:'3.2 Focus Area' },
    { name:'Care: Static Clinic', def:'Services delivered through a fixed, permanent facility such as a clinic or health centre operated by the Affiliate. This includes all SRHR services provided on-site at a designated location.', sec:'sec3', tag:'3.2 Focus Area' },
    { name:'Care: Outreach, Mobile Clinic, Community-based Delivery', def:'Services delivered outside of a fixed facility, reaching clients in their communities through outreach workers, mobile clinics, or community-based service providers.', sec:'sec3', tag:'3.2 Focus Area' },
    { name:'Care: Other Services, Enabled or Referred', def:'SRHR services that the Affiliate facilitates or enables through referral pathways to associated clinics or partner clinics, rather than delivering directly.', sec:'sec3', tag:'3.2 Focus Area' },
    { name:'Care: Social Marketing Services', def:'Health services or products (such as contraceptives) distributed through commercial or social marketing channels, often at subsidised prices, to increase access and uptake in the community.', sec:'sec3', tag:'3.2 Focus Area' },
    { name:'Care: Digital Health Intervention and Selfcare', def:'SRHR services, information, or support delivered through digital platforms such as apps, websites, SMS, or online consultations. Selfcare refers to individuals managing their own health with or without the support of a health provider, using tools or commodities independently.', sec:'sec3', tag:'3.2 Focus Area' },
    { name:'Advocacy', def:'Activities aimed at influencing policies, laws, social norms, or public opinion in support of SRHR. Advocacy work may target government bodies, decision-makers, communities, or the wider public.', sec:'sec3', tag:'3.2 Focus Area' },
    { name:'CSE (Comprehensive Sexuality Education)', def:'A curriculum-based process of teaching and learning about the cognitive, emotional, physical, and social aspects of sexuality. CSE is evidence-informed and rights-based, equipping young people with the knowledge and skills to make informed decisions about their health and relationships.', sec:'sec3', tag:'3.2 Focus Area' },
    { name:'CSE Online, including Social Media', def:'Comprehensive Sexuality Education content and programs delivered through digital channels, including websites, social media platforms, and online learning environments.', sec:'sec3', tag:'3.2 Focus Area' },
    { name:'Partnerships and Movements', def:'Activities that strengthen the wider SRHR movement through collaboration, including building the capacity of partner organisations, amplifying advocacy messages, and distributing sub-grants to civil society organisations.', sec:'sec3', tag:'3.2 Focus Area' },
    { name:'Knowledge, Research, Evidence, Innovation', def:'Activities focused on generating, synthesising, or disseminating evidence related to SRHR. This includes research studies, evaluations, innovations in service delivery, and publication of findings including peer-reviewed articles.', sec:'sec3', tag:'3.2 Focus Area' },
    { name:'Internal MA Infrastructure', def:'Resources and activities directed towards strengthening the Affiliate\'s own organisational capacity, systems, governance, workforce development, and institutional culture, rather than direct programme delivery.', sec:'sec3', tag:'3.2 Focus Area' },
    // 3.3 Project by Expense Category
    { name:'Project by Expense Category', def:'A financial breakdown of project expenditure classified into standardised cost categories. Provides the IPPF Secretariat with insight into how project funds were spent across different types of costs.', sec:'sec3', tag:'3.3 Expense' },
    { name:'Personnel', def:'Costs related to staff and human resources including salaries, benefits, consultancy fees, and other staff-related expenses.', sec:'sec3', tag:'3.3 Expense' },
    { name:'Direct Project Activities', def:'Costs incurred in implementing the core activities of the project, such as training events, community mobilisation, service delivery campaigns, and other programmatic costs directly tied to project outputs.', sec:'sec3', tag:'3.3 Expense' },
    { name:'Commodities', def:'The cost of physical goods and supplies used in project implementation, such as contraceptives, medical supplies, educational materials, or other consumable items directly related to service delivery.', sec:'sec3', tag:'3.3 Expense' },
    { name:'Indirect / Support Costs', def:'Overhead or administrative costs that support the project but are not directly tied to a specific activity. These may include a proportion of rent, utilities, management time, IT, and other organisational running costs.', sec:'sec3', tag:'3.3 Expense' },

    // ── Section 4: Budget vs Actuals by Focus Area ──
    // 4.1 Control Cells
    { name:'Control Cells (Focus Area)', def:'A summary row at the top of the Budget vs Actuals section that automatically aggregates key financial figures across all projects and focus areas. Control cells provide an at-a-glance financial overview and are system-calculated.', sec:'sec4', tag:'4.1 Control' },
    { name:'Total Budgeted Expenses (by Focus Areas)', def:'The sum of all budgeted amounts across all focus areas and all projects in the reporting year, as originally planned in the Annual Business Plan. Serves as the baseline for variance analysis.', sec:'sec4', tag:'4.1 Control' },
    { name:'Total Actual Expenses (by Focus Areas)', def:'The sum of all actual expenditure recorded across all focus areas and all projects during the reporting year. Reflects real spending as opposed to planned spending.', sec:'sec4', tag:'4.1 Control' },
    { name:'Variance ($) \u2014 Focus Area', def:'The difference between Total Budgeted Expenses and Total Actual Expenses, expressed in monetary value. Positive = underspend; negative = overspend. System-calculated.', sec:'sec4', tag:'4.1 Control' },
    { name:'Total Spend (%) \u2014 Focus Area', def:'The proportion of the total budget that has been spent, expressed as a percentage. Calculated as (Total Actual Expenses \u00f7 Total Budgeted Expenses) \u00d7 100.', sec:'sec4', tag:'4.1 Control' },
    // 4.2 Budget vs Actuals Table
    { name:'Focus Area', def:'One of the standardised programmatic categories under which project budgets and actual expenditures are reported. The same focus areas used in project setup are used here for consistency.', sec:'sec4', tag:'4.2 Table' },
    { name:'Budget (Focus Area)', def:'The project budget broken down by the 11 IPPF Focus Areas. Fill in as many as are relevant. The total should match the project total in the other sections.', sec:'sec4', tag:'4.2 Table' },
    { name:'Actual Expenses (Focus Area)', def:'The amount spent within a specific focus area during the reporting year. Should reflect verified expenditure from the Affiliate\'s financial records.', sec:'sec4', tag:'4.2 Table' },
    { name:'Variance ($)', def:'The monetary difference between budgeted amount and actual expenses for a specific focus area. Calculated as Budget minus Actual Expenses. Positive = underspend; negative = overspend.', sec:'sec4', tag:'4.2 Table' },
    { name:'Total Spend (%)', def:'The percentage of the budgeted amount that was actually spent within a specific focus area. Calculated as (Actual Expenses \u00f7 Budget) \u00d7 100.', sec:'sec4', tag:'4.2 Table' },
    { name:'Project Total (Focus Area)', def:'The sum row at the bottom of each project\'s focus area table, showing total budgeted amount, total actual expenses, total variance, and overall spend percentage across all focus areas.', sec:'sec4', tag:'4.2 Table' },
    { name:'Remarks', def:'A free-text field (up to 200 words) at the end of each project\'s budget vs actuals table, where the Affiliate can provide explanations for significant variances, delays, reallocation of funds, or any other context relevant to the project\'s financial performance.', sec:'sec4', tag:'4.2 Table' },
    // Reuse the Section 3 focus-area glossary terms here so they also appear under Section 4.
    { name:'Care: Static Clinic', def:'Services delivered through a fixed, permanent facility such as a clinic or health centre operated by the Affiliate. This includes all SRHR services provided on-site at a designated location.', sec:'sec4', tag:'4.2 Table' },
    { name:'Care: Outreach, Mobile Clinic, Community-based Delivery', def:'Services delivered outside of a fixed facility, reaching clients in their communities through outreach workers, mobile clinics, or community-based service providers.', sec:'sec4', tag:'4.2 Table' },
    { name:'Care: Other Services, Enabled or Referred', def:'SRHR services that the Affiliate facilitates or enables through referral pathways to associated clinics or partner clinics, rather than delivering directly.', sec:'sec4', tag:'4.2 Table' },
    { name:'Care: Social Marketing Services', def:'Health services or products (such as contraceptives) distributed through commercial or social marketing channels, often at subsidised prices, to increase access and uptake in the community.', sec:'sec4', tag:'4.2 Table' },
    { name:'Care: Digital Health Intervention and Selfcare', def:'SRHR services, information, or support delivered through digital platforms such as apps, websites, SMS, or online consultations. Selfcare refers to individuals managing their own health with or without the support of a health provider, using tools or commodities independently.', sec:'sec4', tag:'4.2 Table' },
    { name:'Advocacy', def:'Activities aimed at influencing policies, laws, social norms, or public opinion in support of SRHR. Advocacy work may target government bodies, decision-makers, communities, or the wider public.', sec:'sec4', tag:'4.2 Table' },
    { name:'CSE (Comprehensive Sexuality Education)', def:'A curriculum-based process of teaching and learning about the cognitive, emotional, physical, and social aspects of sexuality. CSE is evidence-informed and rights-based, equipping young people with the knowledge and skills to make informed decisions about their health and relationships.', sec:'sec4', tag:'4.2 Table' },
    { name:'CSE Online, including Social Media', def:'Comprehensive Sexuality Education content and programs delivered through digital channels, including websites, social media platforms, and online learning environments.', sec:'sec4', tag:'4.2 Table' },
    { name:'Partnerships and Movements', def:'Activities that strengthen the wider SRHR movement through collaboration, including building the capacity of partner organisations, amplifying advocacy messages, and distributing sub-grants to civil society organisations.', sec:'sec4', tag:'4.2 Table' },
    { name:'Knowledge, Research, Evidence, Innovation', def:'Activities focused on generating, synthesising, or disseminating evidence related to SRHR. This includes research studies, evaluations, innovations in service delivery, and publication of findings including peer-reviewed articles.', sec:'sec4', tag:'4.2 Table' },
    { name:'Internal MA Infrastructure', def:'Resources and activities directed towards strengthening the Affiliate\'s own organisational capacity, systems, governance, workforce development, and institutional culture, rather than direct programme delivery.', sec:'sec4', tag:'4.2 Table' },

    // ── Section 5: Budget vs Actuals by Expense Category ──
    // 5.1 Control Cells
    { name:'Control Cells (Expense Category)', def:'A summary row at the top of the section that automatically aggregates total financial figures across all projects and expense categories for the entire Affiliate. System-calculated, providing an organisation-wide financial snapshot.', sec:'sec5', tag:'5.1 Control' },
    { name:'Total MA Budgeted Expense', def:'The total planned expenditure for the Affiliate across all projects and all expense categories for the reporting year. Drawn from the Annual Business Plan.', sec:'sec5', tag:'5.1 Control' },
    { name:'Total MA Actuals by Expense Category', def:'The total actual expenditure recorded by the Affiliate across all projects and all expense categories during the reporting year. Represents verified real-world spending at the organisational level.', sec:'sec5', tag:'5.1 Control' },
    { name:'Variance ($) \u2014 Expense Category', def:'The difference between Total MA Budgeted Expense and Total MA Actuals by Expense Category, expressed in monetary value. Positive = underspend; negative = overspend. System-calculated.', sec:'sec5', tag:'5.1 Control' },
    { name:'Total Spend (%) \u2014 Expense Category', def:'The overall budget utilisation rate for the Affiliate, calculated as (Total MA Actuals \u00f7 Total MA Budgeted Expense) \u00d7 100. Gives an organisation-wide view of financial performance against plan.', sec:'sec5', tag:'5.1 Control' },
    // 5.2 Budget vs Actuals Table by Expense Category
    { name:'Expense Budget (including IPPF Core)', def:'The planned expenditure for a project, inclusive of any core funding received from IPPF.', sec:'sec5', tag:'5.2 Table' },
    { name:'Actual (including IPPF Core)', def:'The actual expenditure recorded for a specific expense category within a project, inclusive of IPPF core funds.', sec:'sec5', tag:'5.2 Table' },
    { name:'IPPF Core', def:'Strategic funding provided by IPPF to the Affiliate as core support. The IPPF Core grant is unrestricted and can be used across various projects. The amount is based on a transparent formula considering criteria mostly based on SRHR need.', sec:'sec5', tag:'5.2 Table' },
    { name:'Variance ($) \u2014 Expense', def:'The monetary difference between the budgeted amount and actual expenses for a specific expense category within a project. Positive = underspend; negative = overspend.', sec:'sec5', tag:'5.2 Table' },
    { name:'Total Spend (%) \u2014 Expense', def:'The percentage of the budgeted amount that has been spent for a specific expense category within a project. Calculated as (Actual \u00f7 Budget) \u00d7 100.', sec:'sec5', tag:'5.2 Table' },
    { name:'Project Total (Expense Category)', def:'The sum row at the bottom of each project\'s expense category table, aggregating the budget, actuals, variance, and total spend percentage across all four expense categories.', sec:'sec5', tag:'5.2 Table' },
    { name:'Variance Explanation', def:'A free-text field (up to 200 words) provided at the end of each project\'s expense category table, where the Affiliate can explain the reasons behind significant budget variances.', sec:'sec5', tag:'5.2 Table' },
    // Reuse the expense-category glossary terms here so they also appear under Section 5.
    { name:'Personnel', def:'Costs related to staff and human resources including salaries, benefits, consultancy fees, and other staff-related expenses.', sec:'sec5', tag:'5.2 Table' },
    { name:'Direct Project Activities', def:'Costs incurred in implementing the core activities of the project, such as training events, community mobilisation, service delivery campaigns, and other programmatic costs directly tied to project outputs.', sec:'sec5', tag:'5.2 Table' },
    { name:'Commodities', def:'The cost of physical goods and supplies used in project implementation, such as contraceptives, medical supplies, educational materials, or other consumable items directly related to service delivery.', sec:'sec5', tag:'5.2 Table' },
    { name:'Indirect / Support Costs', def:'Overhead or administrative costs that support the project but are not directly tied to a specific activity. These may include a proportion of rent, utilities, management time, IT, and other organisational running costs.', sec:'sec5', tag:'5.2 Table' },

    // ── Section 6: Actual Income Details ──
    // 6.1 Income Summary
    { name:'Actual Income Details', def:'A comprehensive record of all income received by the Affiliate during the reporting year, broken down by income category, sub-category, and funding type (Restricted vs Unrestricted).', sec:'sec6', tag:'6.1 Summary' },
    { name:'Income Category', def:'The top-level classification of income sources. The three income categories are: Actual Locally Generated Income, Actual International Income (Non-IPPF), and Actual IPPF Income.', sec:'sec6', tag:'6.1 Summary' },
    { name:'Restricted (Income)', def:'Funding that has been designated by the donor for a specific purpose, project, activity, or population. May only be used in accordance with the donor\'s conditions.', sec:'sec6', tag:'6.1 Summary' },
    { name:'Unrestricted (Income)', def:'Funding that has not been tied to a specific purpose by the donor, giving the Affiliate flexibility to allocate it according to its own strategic priorities.', sec:'sec6', tag:'6.1 Summary' },
    { name:'Total Income', def:'The sum of all income received by the Affiliate across all income categories (Actual Locally Generated, Actual International Non-IPPF, and Actual IPPF Income) during the reporting year, combining both Restricted and Unrestricted amounts.', sec:'sec6', tag:'6.1 Summary' },
    { name:'Total Actual Expenses (by Expense Categories)', def:'The total verified expenditure of the Affiliate during the reporting year, drawn from the expense category data entered in Section 5. Displayed to enable direct comparison with total income.', sec:'sec6', tag:'6.1 Summary' },
    { name:'Deficit / Surplus', def:'The net financial position of the Affiliate for the reporting year, calculated as Total Income minus Total Actual Expenses. Positive = surplus; negative = deficit. System-calculated.', sec:'sec6', tag:'6.1 Summary' },
    // 6.2 Actual Locally Generated Income
    { name:'Actual Locally Generated Income', def:'All income earned or raised by the Affiliate within its own country of operation, from sources other than IPPF or international donors. Includes service fees, commodity sales, government grants, and other domestically sourced revenue.', sec:'sec6', tag:'6.2 Local' },
    { name:'Commodity Sales', def:'Revenue generated from the sale of health products/commodities, including contraceptives, other sexual and reproductive health supplies, and any non-SRH products sold by the Affiliate.', sec:'sec6', tag:'6.2 Local' },
    { name:'Client / Patient Fees', def:'Income collected directly from clients or patients in exchange for health services provided by the Affiliate. This may be full fees, co-payments, or nominal charges.', sec:'sec6', tag:'6.2 Local' },
    { name:'Training, Education, Professional Services', def:'Income earned by the Affiliate through delivering training programs, educational services, professional consultancy, or by renting out facilities or equipment to external parties.', sec:'sec6', tag:'6.2 Local' },
    { name:'Local/National: Government', def:'Grants, subsidies, contracts, or other financial support received from local or national government bodies within the Affiliate\'s country of operation.', sec:'sec6', tag:'6.2 Local' },
    { name:'Local/National: Non-Government', def:'Donations, grants, or other income received from local or national non-governmental sources, such as national foundations, trusts, businesses, or private donors based within the country.', sec:'sec6', tag:'6.2 Local' },
    { name:'Membership Fees', def:'Income collected from individuals or organisations who pay a fee to become members of the Affiliate, often granting them certain rights, services, or participation in the organisation\'s governance.', sec:'sec6', tag:'6.2 Local' },
    { name:'Non-operational Income', def:'Income that does not arise from the MA\'s core programmatic or service delivery activities. This may include interest earned on bank accounts, investment returns, or other incidental financial gains.', sec:'sec6', tag:'6.2 Local' },
    { name:'Other National Income', def:'Any locally generated income that does not fit into the other defined sub-categories. Used for miscellaneous or atypical domestic income sources.', sec:'sec6', tag:'6.2 Local' },
    // 6.3 Actual International Income (Non-IPPF)
    { name:'Actual International Income (Non-IPPF)', def:'All income received from international donors and sources outside the MA\'s country of operation, excluding funds channeled through IPPF. Includes bilateral and multilateral donors, foreign governments, international NGOs, and global foundations.', sec:'sec6', tag:'6.3 International' },
    { name:'Multilateral Agencies and Organisations', def:'International bodies funded and governed by multiple member states or governments, such as UN agencies (e.g. UNFPA, UNICEF, WHO) or the World Bank.', sec:'sec6', tag:'6.3 International' },
    { name:'Foreign Governments', def:'Direct funding received from the government of a country other than the MA\'s own country of operation, typically through bilateral aid programs or government development agencies.', sec:'sec6', tag:'6.3 International' },
    { name:'International Trusts and Foundations / NGOs', def:'Grants or donations received from internationally operating private foundations, charitable trusts, or non-governmental organisations headquartered outside the MA\'s country of operation.', sec:'sec6', tag:'6.3 International' },
    { name:'Corporate / Business Sector', def:'Income received from private sector companies or business entities, whether as direct donations, sponsorships, corporate social responsibility (CSR) contributions, or contractual payments for services.', sec:'sec6', tag:'6.3 International' },
    { name:'Other International Income', def:'Any international income not captured by the above sub-categories. Used for atypical or miscellaneous income from overseas sources.', sec:'sec6', tag:'6.3 International' },
    // 6.4 Actual IPPF Income
    { name:'Actual IPPF Income', def:'All funds received directly from IPPF, whether as a core grant, Stream 2 or 3 grants, or through restricted grants. Captures the full extent of IPPF\'s financial contribution to the MA in the reporting year.', sec:'sec6', tag:'6.4 IPPF' },
    { name:'IPPF Core Grant', def:'The strategic funding allocation provided by IPPF to the Affiliate without restrictions. This amount is auto-populated.', sec:'sec6', tag:'6.4 IPPF' },
    { name:'Other IPPF Grant', def:'Any additional funding received from IPPF beyond the Core Grant. This may include grants for specific programs, emergency funding, innovation funds, or other targeted financial support. Please enter vouchers and opportunity grants as restricted income.', sec:'sec6', tag:'6.4 IPPF' },
    // 6.5 Largest Contributor
    { name:'Largest Contributor', def:'The single organisation \u2014 whether a government, trust, foundation, IPPF, or other donor \u2014 that provided the greatest amount of income to the Affiliate during the reporting year.', sec:'sec6', tag:'6.5 Contributor' },
    { name:'How Much Income Did They Provide?', def:'The total monetary value of funding received from the largest contributing organisation during the reporting year, expressed in the reporting currency.', sec:'sec6', tag:'6.5 Contributor' },

    // ── Section 7: AOC Review Form ──
    // 7.0 AOC Review — General
    { name:'Review Outcome', def:'The overall rating on completion of the review. This rating is used by AOCs to inform follow-up actions.', sec:'sec7', tag:'7.0 AOC Review' },
    { name:'Flag Colour', def:'A visual indicator of the review outcome. A red \'flag\' indicates significant concerns requiring follow-up with the affiliate. A green flag indicates the report is approved with no follow-up actions required.', sec:'sec7', tag:'7.0 AOC Review' },
    { name:'Comments', def:'A free-text field of up to 200 words available for each criterion, allowing the AOC to provide context, observations, or recommended actions, e.g. to raise concerns, point out partial compliance, or highlight areas requiring follow-up.', sec:'sec7', tag:'7.0 AOC Review' },
    { name:'AOC Comments / Remedial Actions', def:'A dedicated field where the AOC records their overall observations on the affiliate\'s Annual Report and specifies any concrete remedial actions that the affiliate is required to take following the review. Remedial actions should be clearly stated, time-bound where possible, and directly linked to the specific deficiencies or risks identified during the review. This field forms part of the official AOC review record and is visible to the IPPF Secretariat.', sec:'sec7', tag:'7.0 AOC Review' },
    // 7.1 General Requirements
    { name:'General Requirements', def:'The first section of the AOC Review Form, covering quality criteria. AOCs must assess each criterion independently and provide comments where a "No" response is given or where additional context is needed. More than a certain number of "NOs" will give a Red Flag outcome of the review.', sec:'sec7', tag:'7.1 General Req.' },
    { name:'Question 1. Was the report submitted on time?', def:'An assessment of whether the affiliate submitted its Annual Report by the official deadline set by IPPF for the reporting year. A "Yes" response confirms timely submission. A "No" response should be accompanied by a comment explaining the delay and any prior communication with the affiliate regarding the late submission.', sec:'sec7', tag:'7.1 General Req.' },
    { name:'Question 2. Has the affiliate consulted with the AOC?', def:'An assessment of whether the affiliate engaged with the AOC during the preparation of the Annual Report, for example, by seeking guidance on data entry, narrative content, or financial reporting. A "Yes" response indicates active consultation. A "No" response signifies that there was no support requested or given before the reporting deadline.', sec:'sec7', tag:'7.1 General Req.' },
    { name:'Question 3. Is the report done to the required standard?', def:'An assessment of whether the Annual Report meets the minimum quality standards, e.g. whether all required fields are completed, narrative responses are substantive and understandable, and financial data is coherent and consistent. A "No" response should specify which sections or fields fall below the required standard, or have been left blank.', sec:'sec7', tag:'7.1 General Req.' },
    { name:'Question 4. Tangible results in at least two Strategic Pillars?', def:'An assessment of whether the affiliate has reported clear results under at least two of the four IPPF Strategic Pillars: Center Care on People, Move the Sexuality Agenda, Solidarity for Change, and Nurture our Federation.', sec:'sec7', tag:'7.1 General Req.' },
    { name:'Question 5. Meaningful reflection on challenges and learnings?', def:'An assessment of whether the affiliate has provided substantive, reflective responses in the Challenges, Most Effective Strategies, Organisational Update, and Learning sub-sections of the Narrative Report. Responses should demonstrate genuine reflection. A "No" response should indicate which sub-sections lack sufficient depth.', sec:'sec7', tag:'7.1 General Req.' },
    { name:'Question 6. Total expense Section 4 equals Section 5?', def:'A financial consistency check confirming that the total expenditure reported in Section 4 (Budget vs Actuals by Focus Area) matches the total reported in Section 5 (Budget vs Actuals by Expense Category). These two figures must be equal as they represent the same expenditure from different analytical dimensions. A "No" response indicates a discrepancy that requires the affiliate to review and correct its financial data before final submission.', sec:'sec7', tag:'7.1 General Req.' },
    // 7.2 Critical Requirements
    { name:'Critical Requirements', def:'The second section of the AOC Review Form, covering financial criteria that are considered essential for the integrity and validity of the Annual Report. Unlike General Requirements, the criteria in this section relate specifically to audit status, financial position, and budget variance explanations. Any negative answer in this section will raise a red flag in the final review.', sec:'sec7', tag:'7.2 Critical Req.' },
    { name:'Question 7. Status of the audit report?', def:'An assessment of whether the affiliate\'s external audit report for the reporting year carries an unqualified or qualified opinion. This field uses "Unqualified / Qualified" rather than "Yes / No". This question applies only to Annual Reports; half-year reports do not have this requirement.', sec:'sec7', tag:'7.2 Critical Req.' },
    { name:'Unqualified (Audit Opinion)', def:'An audit opinion issued by an external auditor indicating that the affiliate\'s financial statements are presented fairly and in accordance with the applicable accounting standards, with no material misstatements or scope limitations. An unqualified opinion is the expected and preferred outcome for a financially compliant affiliate.', sec:'sec7', tag:'7.2 Critical Req.' },
    { name:'Qualified (Audit Opinion)', def:'An audit opinion issued by an external auditor indicating that the auditor has found material concerns such as limitations in scope, disagreements on accounting treatment, or significant internal control weaknesses that prevent a fully clean opinion. Affiliates with qualified audits require AOC follow-up and may be subject to additional IPPF oversight.', sec:'sec7', tag:'7.2 Critical Req.' },
    { name:'Question 8. Negative variances sufficiently explained?', def:'An assessment of whether project-level negative variance (where actual expenditure exceeded the budgeted amount for a given expense category) is accompanied by a sufficient explanation. Negative variances are highlighted in red in the portal. A "Yes" response confirms that all red variances across all projects have been adequately explained. A "No" response should identify which specific projects or expense categories have unexplained overspends. This question applies only to Annual Reports.', sec:'sec7', tag:'7.2 Critical Req.' },
    { name:'Question 9. Surplus or balanced budget?', def:'An assessment of whether the affiliate\'s Deficit / Surplus figure in Section 6 is positive or neutral \u2014 meaning total income is equal to or greater than total actual expenses. A "Yes" response (shown in green in the portal) confirms a financially healthy position. A "No" response indicates a deficit where expenditure has exceeded income, which is a critical finding requiring a comment explaining the cause and the affiliate\'s plan to address the shortfall. This question applies only to Annual Reports.', sec:'sec7', tag:'7.2 Critical Req.' },
    // 7.3 Serious Risks Identified
    { name:'Serious Risks Identified', def:'A free-text section at the end of the AOC Review Form where the AOC formally documents any significant risks identified during the review of the affiliate\'s Annual Report that require IPPF Secretariat\'s attention. This section is distinct from the criteria-based sections above. It allows the AOC to flag concerns that may not be captured by the Yes/No criteria, such as governance failures, safeguarding concerns, financial sustainability issues, or programme delivery risks.', sec:'sec7', tag:'7.3 Serious Risks' },
    { name:'Serious Risk Identified', def:'A concise title or label for a specific serious risk identified by the AOC during the review. This should name the nature of the risk clearly and briefly, for example, "Qualified Audit for Second Consecutive Year", "Board Governance Breakdown", or "Significant Unexplained Deficit". Each identified risk is paired with a Comment field where the AOC provides further detail. Additional risks can be added using the + button.', sec:'sec7', tag:'7.3 Serious Risks' },
    { name:'Identified Risk', def:'A concise title or label for a specific serious risk identified by the AOC during the review. This should name the nature of the risk clearly and briefly, for example, "Qualified Audit for Second Consecutive Year", "Board Governance Breakdown", or "Significant Unexplained Deficit". Each identified risk is paired with a Comment field where the AOC provides further detail. Additional risks can be added using the + button.', sec:'sec7', tag:'7.3 Serious Risks' },
    { name:'Comment (Serious Risks)', def:'A free-text field of up to 200 words paired with each Identified Risk, where the AOC provides a detailed description of the risk, its potential impact on the affiliate\'s operations and any recommended follow-up actions or support measures. This comment forms part of the formal AOC review record and may be used by IPPF Secretariat to determine next steps, including escalation, capacity support, or compliance review.', sec:'sec7', tag:'7.3 Serious Risks' },
  ];

  // ── WALKTHROUGH DATA ──
  const WALKTHROUGHS = {
    // Annual Report sections (detected by leading number in URL/title)
    '1': { title:'Section 1 \u2014 Organisation Details', subtitle:'Membership details, contacts, institutional data, and key documents', steps:[
      { label:'Membership Details', desc:'Verify your Reporting Year, Reporting Periodicity, IPPF Region, Affiliate Code, Organisation Name, Country of Operation, and Primary Contact.' },
      { label:'Institutional Data', desc:'Provide your registered address and details for key contacts \u2014 Executive Director, Board Chair, Finance Lead, Youth Board Member, and Programmatic Leads. Put N/A in case the position is vacant.' },
      { label:'Board Term & Governance', desc:'Enter Board Term start/end years and other institutional governance data.' },
      { label:'Key Documents', desc:'Upload the Management Letter (Audit Report) from your external auditor for the reporting year.' },
    ]},
    '1.1': { title:'Section 1.1 \u2014 Organizational details', subtitle:'Membership details, contacts, institutional data, and key documents', steps:[
      { label:'Membership Details', desc:'Verify your Reporting Year, Reporting Periodicity, IPPF Region, Affiliate Code, Organisation Name, Country of Operation, and Primary Contact.' },
      { label:'Institutional Data', desc:'Provide your registered address and details for key contacts \u2014 Executive Director, Board Chair, Finance Lead, Youth Board Member, and Programmatic Leads. Put N/A in case the position is vacant.' },
      { label:'Board Term & Governance', desc:'Enter Board Term start/end years and other institutional governance data.' },
      { label:'Key Documents', desc:'Upload the Management Letter (Audit Report) from your external auditor for the reporting year.' },
    ]},
    '2': { title:'Section 2 \u2014 Narrative report', subtitle:'Context, results, challenges, strategies, and learning', steps:[
      { label:'Context Shifts and Operational Environment', desc:'Describe significant external events or developments during the reporting year that influenced your operating environment.' },
      { label:'Results & Achievements', desc:'Summarise the main outcomes organised by IPPF Strategic Pillar. Highlight work with youth and marginalised populations.' },
      { label:'Challenges', desc:'Describe main difficulties or constraints that affected programme delivery or achievement of planned results.' },
      { label:'Most Effective Strategies', desc:'Reflect on methods or approaches that proved most successful. Share examples of good practice.' },
      { label:'Organisational Update', desc:'Summarise any significant internal changes \u2014 structure, leadership, board composition, staffing, or policies.' },
      { label:'Learning', desc:'Share key insights, lessons, or knowledge gained that will inform future planning.' },
    ]},
    '3': { title:'Section 3 \u2014 Add new project', subtitle:'Register projects not in the original Business Plan', steps:[
      { label:'Project General Information', desc:'Enter project name, start/end dates, theme, donor, funding type, total contract value, and annual project income.' },
      { label:'Project Focus Area Breakdown', desc:'Allocate the project budget across standardised programmatic focus areas (e.g. Static Clinic, Outreach, Advocacy, CSE).' },
      { label:'Expense Category Breakdown', desc:'Break down expenditure by Personnel, Direct Project Activities, Commodities, and Indirect/Support Costs.' },
      { label:'Project Description', desc:'Provide a summary of the project\'s purpose, target population, geographic scope, and key activities.' },
    ]},
    '4': { title:'Section 4 \u2014 Budget vs actuals by focus area', subtitle:'Compare budgeted and actual expenses by programmatic focus area', steps:[
      { label:'Review Control Cells', desc:'Check the summary row showing total budgeted expenses, total actual expenses, variance, and total spend percentage across all focus areas.' },
      { label:'Enter Actual Expenses', desc:'For each project and focus area, enter the actual amount spent during the reporting year.' },
      { label:'Review Variance & Spend', desc:'Check system-calculated variance ($) and total spend (%) for each focus area. Identify significant deviations.' },
      { label:'Add Remarks', desc:'Provide explanations (up to 200 words) for significant variances, delays, or reallocation of funds.' },
    ]},
    '5': { title:'Section 5 \u2014 Budget vs actuals by expense category', subtitle:'Compare budgeted and actual expenses by cost type', steps:[
      { label:'Review Control Cells', desc:'Check the summary row showing total MA budgeted expense, total MA actuals, variance, and total spend percentage.' },
      { label:'Enter Actual Expenses', desc:'For each project and expense category (Personnel, Direct Activities, Commodities, Indirect Costs), enter the actual amount spent.' },
      { label:'Review Variance & Spend', desc:'Check system-calculated variance and total spend percentage. Compare against the focus area view in Section 4.' },
      { label:'Add Variance Explanation', desc:'Provide explanations (up to 200 words) for significant variances in each project.' },
    ]},
    '6': { title:'Section 6 \u2014 Actual income', subtitle:'Record all income received during the reporting year', steps:[
      { label:'Income Summary', desc:'Review the summary showing Total Income, Total Actual Expenses, and Deficit/Surplus calculation.' },
      { label:'Actual Locally Generated Income', desc:'Enter income from commodity sales, patient fees, training services, government grants, membership fees, and other local sources.' },
      { label:'Actual International Income (Non-IPPF)', desc:'Enter income from multilateral agencies, foreign governments, international trusts/NGOs, and corporate sources.' },
      { label:'Actual IPPF Income', desc:'Verify IPPF Core Grant (auto-populated) and enter any other IPPF grants received.' },
      { label:'Largest Contributor', desc:'Identify the single organisation that provided the greatest amount of income and specify the amount.' },
    ]},
    '7': { title:'Section 7 \u2014 AOC Review Form', subtitle:'Review and assess the affiliate\'s Annual Report submission', steps:[
      { label:'Final AOC Rating', desc:'View the overall review outcome and flag colour indicator. A red flag indicates significant concerns; a green flag indicates the report is approved.' },
      { label:'General Requirements (Questions 1\u20136)', desc:'Assess six quality criteria covering timeliness, AOC consultation, report quality, strategic pillar results, meaningful reflection, and financial consistency between Sections 4 and 5.' },
      { label:'Critical Requirements (Questions 7\u20139)', desc:'Assess three financial criteria covering audit report status (unqualified/qualified), variance explanations for overspends, and overall surplus/deficit position.' },
      { label:'AOC Comments / Remedial Actions', desc:'Record overall observations and specify any concrete remedial actions the affiliate must take, linked to deficiencies identified during the review.' },
      { label:'Serious Risks Identified', desc:'Document any significant risks requiring IPPF Secretariat attention, such as governance failures, safeguarding concerns, or financial sustainability issues. Each risk has a title and detailed comment.' },
    ]},
    '1.2': { title:'Section 1.2 \u2014 Narrative Plan', subtitle:'Country context, organisational status, and technical assistance', steps:[
      { label:'Country Context & Theory of Change', desc:'Describe the operating environment, political/legal context, opposition, and how your theory of change addresses the country context.' },
      { label:'Organisational Status', desc:'Provide an update on your organisation\'s current status, strengths, and areas for development.' },
      { label:'Technical Assistance', desc:'Describe any technical assistance needed or received from IPPF or other partners.' },
    ]},
    '2.1': { title:'Section 2.1 \u2014 Project Description', subtitle:'Project details and descriptions', steps:[
      { label:'Project Information', desc:'Enter project names, donors, themes, and detailed descriptions for each project.' },
    ]},
    '2.2': { title:'Section 2.2 \u2014 Project Expense Budget', subtitle:'Budget allocation by project', steps:[
      { label:'Expense Budget Entry', desc:'Enter budgeted amounts for each expense category per project.' },
    ]},
    '3.1': { title:'Section 3.1 \u2014 Total Income', subtitle:'Income details by source', steps:[
      { label:'Income Sources', desc:'Enter all income received during the reporting year, broken down by category and funding type.' },
    ]},
    'default': { title:'Help & Guidance', subtitle:'Navigate through sections to see guidance', steps:[
      { label:'Select a Section', desc:'Use the sidebar navigation to go to a section, then click the ? icon for contextual help.' },
    ]},
  };

  // ═══════════════════════════════
  //  PLACE TOGGLE BUTTON INLINE WITH SECTION TITLE
  // ═══════════════════════════════
  function createToggleBtn() {
    var toggleBtn = document.createElement('button');
    toggleBtn.className = 'help-toggle-btn';
    toggleBtn.id = 'helpToggleBtn';
    toggleBtn.innerHTML = '?';
    toggleBtn.title = 'Help & Guidance';
    toggleBtn.onclick = function(e) { e.preventDefault(); e.stopPropagation(); toggleHelpPanel(); };
    return toggleBtn;
  }

  function placeToggleButton() {
    // Only show the help icon on pages that have a section title
    var titleEl = document.querySelector('.title-main');
    if (!titleEl) return; // No section title — skip (e.g. dashboard/index page)

    // Try to place inline with the section title
    var placed = tryPlaceInlineWithTitle();
    if (!placed) {
      // Title exists but container is hidden (loading) — observe for visibility
      observeForTitle();
    }
  }

  function tryPlaceInlineWithTitle() {
    // Don't duplicate
    if (document.getElementById('helpToggleBtn')) return true;

    var titleEl = document.querySelector('.title-main');
    if (!titleEl) return false;

    var container = titleEl.closest('.myContainer');
    if (!container) return false;

    // Check if container is visible (display != none)
    if (window.getComputedStyle(container).display === 'none') return false;

    var parent = titleEl.parentElement;

    // Pattern 1: title is inside a d-flex div — just append the button there
    // Pattern 2: title is direct child of myContainer — wrap in a flex row
    if (parent.classList.contains('d-flex')) {
      parent.appendChild(createToggleBtn());
    } else {
      var wrapper = document.createElement('div');
      wrapper.className = 'help-title-row';
      parent.insertBefore(wrapper, titleEl);
      wrapper.appendChild(titleEl);
      wrapper.appendChild(createToggleBtn());
    }
    return true;
  }

  function placeFallbackButton() {
    // Fixed-position fallback for pages without a section title
    if (document.getElementById('helpToggleBtn')) return;
    var btn = createToggleBtn();
    btn.classList.add('help-toggle-btn--fixed');
    document.body.appendChild(btn);
  }

  function observeForTitle() {
    var observer = new MutationObserver(function(mutations) {
      var placed = tryPlaceInlineWithTitle();
      if (placed) {
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });

    // Fallback: if not placed after 30s, use fixed-position button
    setTimeout(function() {
      observer.disconnect();
      placeFallbackButton();
    }, 30000);
  }

  // ═══════════════════════════════
  //  INJECT PANEL HTML
  // ═══════════════════════════════
  function injectHelpPanel() {
    // Avoid double injection
    if (document.getElementById('helpPanelOverlay')) return;

    // Create backdrop
    var backdrop = document.createElement('div');
    backdrop.className = 'help-panel-backdrop';
    backdrop.id = 'helpPanelBackdrop';
    backdrop.onclick = function() { closeHelpPanel(); };
    document.body.appendChild(backdrop);

    // Place the toggle button next to the section title
    placeToggleButton();

    // Create the panel
    var panel = document.createElement('aside');
    panel.className = 'help-panel-overlay';
    panel.id = 'helpPanelOverlay';
    panel.innerHTML = '<div class="help-panel-head">'
      + '<div class="help-panel-head-row">'
      + '<div class="help-panel-title" id="helpPanelTitle">' + getUILabel('Help & Guidance') + '</div>'
      + '<button class="help-panel-close" onclick="window.IPPFHelp.close()" title="Close">&#10005;</button>'
      + '</div>'
      + '<div class="help-panel-ctx" id="helpPanelCtx">' + getTranslatedInstr('ui_help_subtitle', 'Click any ? icon or field to see guidance') + '</div>'
      + '<div class="help-tabs">'
      + '<button class="help-tab active" data-tab="instructions" onclick="window.IPPFHelp.switchTab(\'instructions\',this)">' + getUILabel('Instructions') + '</button>'
      + '<button class="help-tab" data-tab="walkthrough" onclick="window.IPPFHelp.switchTab(\'walkthrough\',this)">Walkthrough</button>'
      + '<button class="help-tab" data-tab="glossary" onclick="window.IPPFHelp.switchTab(\'glossary\',this)">' + getUILabel('Glossary') + '</button>'
      + '</div>'
      + '</div>'
      + '<div class="help-panel-body">'
      // Instructions pane
      + '<div class="help-pane active" id="hp-instructions">'
      + '<div class="help-idle" id="helpIdle">'
      + '<div class="help-idle-icon">&#128161;</div>'
      + '<h3 id="helpIdleTitle">' + getTranslatedInstr('ui_field_level_guidance', 'Field-Level Guidance') + '</h3>'
      + '<p id="helpIdleDesc">' + getTranslatedInstr('ui_field_level_guidance_desc', 'Click any <strong>?</strong> icon or field label to see its definition, an example, and common mistakes to avoid.') + '</p>'
      + '</div>'
      + '<div id="helpContent" style="display:none"></div>'
      + '</div>'
      // Walkthrough pane
      + '<div class="help-pane" id="hp-walkthrough">'
      + '<div id="walkthroughContent"></div>'
      + '</div>'
      // Glossary pane
      + '<div class="help-pane" id="hp-glossary">'
      + '<div class="g-search"><input type="text" id="helpGSearch" placeholder="Search glossary terms..." oninput="window.IPPFHelp.filterGlossary(this.value)" /></div>'
      + '<div class="g-filter" id="helpGFilter"></div>'
      + '<div id="helpGList"></div>'
      + '</div>'
      + '</div>';

    document.body.appendChild(panel);

    // Build glossary filter tags
    buildGlossaryFilters();
    renderGlossary(GLOSSARY);
    renderWalkthrough();

    // Configure which tabs are visible based on current section
    configureSectionTabs();

    // Inject field-level help icons (after a short delay to let forms render)
    injectFieldHelpIcons();
    // Also observe for dynamic content (forms that load after API calls)
    observeForFieldLabels();

    // Re-render glossary when language changes
    var langSwitcher = document.getElementById('languageSwitcher');
    if (langSwitcher) {
      langSwitcher.addEventListener('change', function() {
        // Small delay to let i18next finish changing language and localize() to complete
        setTimeout(function() {
          // Re-translate glossary
          var searchInput = document.getElementById('helpGSearch');
          filterGlossary(searchInput ? searchInput.value : '');
          // Re-translate tab labels
          var allTabs = document.querySelectorAll('.help-tab');
          allTabs.forEach(function(tab) {
            var tabKey = tab.getAttribute('data-tab');
            if (tabKey === 'instructions') tab.textContent = getUILabel('Instructions');
            if (tabKey === 'glossary') tab.textContent = getUILabel('Glossary');
            if (tabKey === 'walkthrough' && tab.style.display !== 'none') {
              // Walkthrough tab is renamed to "Instructions" in sections 1, 3-7
              if (tab.textContent !== 'Walkthrough') tab.textContent = getUILabel('Instructions');
            }
          });
          // Re-inject ? help icons (localize() wipes them when it replaces label text)
          reinjectFieldHelpIcons();
          // Re-render walkthrough/instructions with translated text
          renderWalkthrough();
          // Re-translate panel title and subtitle
          var panelTitle = document.getElementById('helpPanelTitle');
          if (panelTitle) panelTitle.textContent = getUILabel('Help & Guidance');
          var panelCtx = document.getElementById('helpPanelCtx');
          if (panelCtx) panelCtx.textContent = getTranslatedInstr('ui_help_subtitle', 'Click any ? icon or field to see guidance');
          // Re-translate field-level guidance idle state
          var idleTitle = document.getElementById('helpIdleTitle');
          if (idleTitle) idleTitle.textContent = getTranslatedInstr('ui_field_level_guidance', 'Field-Level Guidance');
          var idleDesc = document.getElementById('helpIdleDesc');
          if (idleDesc) idleDesc.textContent = getTranslatedInstr('ui_field_level_guidance_desc', 'Click any ? icon or field label to see its definition, an example, and common mistakes to avoid.');
        }, 300);
      });
    }
  }

  // ═══════════════════════════════
  //  PANEL OPEN/CLOSE
  // ═══════════════════════════════
  function toggleHelpPanel() {
    var panel = document.getElementById('helpPanelOverlay');
    var btn = document.getElementById('helpToggleBtn');
    var backdrop = document.getElementById('helpPanelBackdrop');
    if (!panel) return;
    var isOpen = panel.classList.contains('open');
    if (isOpen) {
      closeHelpPanel();
    } else {
      panel.classList.add('open');
      backdrop.classList.add('open');
      btn.classList.add('active');
      // Auto-select the glossary section filter matching the current page
      autoSelectGlossarySection();
    }
  }

  function autoSelectGlossarySection() {
    var pageSection = detectCurrentSection();
    if (!pageSection || pageSection === 'default') return;
    // Extract the major section number (e.g. "1.2" -> "1", "3" -> "3")
    var majorSec = pageSection.split('.')[0];
    var secFilterValue = 'sec' + majorSec;
    // Find the matching filter tag and click it
    var tags = document.querySelectorAll('.g-filter-tag');
    tags.forEach(function(tag) {
      var onclick = tag.getAttribute('onclick') || '';
      if (onclick.indexOf("'" + secFilterValue + "'") !== -1) {
        filterBySection(secFilterValue, tag);
      }
    });
  }

  // ═══════════════════════════════
  //  SECTION-SPECIFIC TAB CONFIGURATION
  //  Section 1: Only "Instructions" (which shows walkthrough content)
  //  Section 2: Only "Instructions" + "Glossary" (no walkthrough)
  //  Sections 3–6: "Instructions" (walkthrough content) + "Glossary"
  // ═══════════════════════════════
  function configureSectionTabs() {
    var pageSection = detectCurrentSection();
    if (!pageSection || pageSection === 'default') return;
    var majorSec = pageSection.split('.')[0];

    var tabInstructions = document.querySelector('.help-tab[data-tab="instructions"]');
    var tabWalkthrough = document.querySelector('.help-tab[data-tab="walkthrough"]');
    var tabGlossary = document.querySelector('.help-tab[data-tab="glossary"]');
    var paneInstructions = document.getElementById('hp-instructions');
    var paneWalkthrough = document.getElementById('hp-walkthrough');
    var paneGlossary = document.getElementById('hp-glossary');

    if (majorSec === '1') {
      // Section 1: Hide Instructions & Glossary tabs; rename Walkthrough to "Instructions"
      if (tabInstructions) tabInstructions.style.display = 'none';
      if (paneInstructions) { paneInstructions.style.display = 'none'; paneInstructions.classList.remove('active'); }
      if (tabGlossary) tabGlossary.style.display = 'none';
      if (paneGlossary) paneGlossary.style.display = 'none';
      if (tabWalkthrough) {
        tabWalkthrough.textContent = getUILabel('Instructions');
        tabWalkthrough.classList.add('active');
      }
      if (paneWalkthrough) paneWalkthrough.classList.add('active');
    } else if (majorSec === '2') {
      // Section 2: Hide Walkthrough tab; keep Instructions + Glossary
      if (tabWalkthrough) tabWalkthrough.style.display = 'none';
      if (paneWalkthrough) paneWalkthrough.style.display = 'none';
      // Ensure Instructions is the active default tab
      if (tabInstructions) tabInstructions.classList.add('active');
      if (paneInstructions) paneInstructions.classList.add('active');
    } else if (majorSec === '3' || majorSec === '4' || majorSec === '5' || majorSec === '6' || majorSec === '7') {
      // Sections 3–7: Hide Instructions tab; rename Walkthrough to "Instructions"; keep Glossary
      if (tabInstructions) tabInstructions.style.display = 'none';
      if (paneInstructions) { paneInstructions.style.display = 'none'; paneInstructions.classList.remove('active'); }
      if (tabWalkthrough) {
        tabWalkthrough.textContent = getUILabel('Instructions');
        tabWalkthrough.classList.add('active');
      }
      if (paneWalkthrough) paneWalkthrough.classList.add('active');
    }
  }

  function closeHelpPanel() {
    var panel = document.getElementById('helpPanelOverlay');
    var btn = document.getElementById('helpToggleBtn');
    var backdrop = document.getElementById('helpPanelBackdrop');
    if (panel) panel.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
    if (btn) btn.classList.remove('active');
  }

  function openHelpPanel() {
    var panel = document.getElementById('helpPanelOverlay');
    var btn = document.getElementById('helpToggleBtn');
    var backdrop = document.getElementById('helpPanelBackdrop');
    if (panel) panel.classList.add('open');
    if (backdrop) backdrop.classList.add('open');
    if (btn) btn.classList.add('active');
  }

  // ═══════════════════════════════
  //  TAB SWITCHING
  // ═══════════════════════════════
  function switchTab(tabId, el) {
    document.querySelectorAll('.help-tab').forEach(function(t) { t.classList.remove('active'); });
    document.querySelectorAll('.help-pane').forEach(function(p) { p.classList.remove('active'); });
    var pane = document.getElementById('hp-' + tabId);
    if (pane) pane.classList.add('active');
    if (el) el.classList.add('active');
  }

  // ═══════════════════════════════
  //  INSTRUCTIONS — show field help
  // ═══════════════════════════════
  function showFieldHelp(name, definition, example, avoidList, section) {
    var idle = document.getElementById('helpIdle');
    var content = document.getElementById('helpContent');
    var ctx = document.getElementById('helpPanelCtx');
    if (!idle || !content) return;

    // Translate at display time
    var displayName = getTranslatedName(name);
    var displayDef = getTranslatedDef(name, definition);

    idle.style.display = 'none';
    content.style.display = 'block';
    if (ctx) ctx.textContent = displayName;
    name = displayName;
    definition = displayDef;

    var avoidHtml = '';
    if (avoidList && avoidList.length) {
      avoidHtml = '<div class="h-avoid"><div class="h-avoid-label">Avoid</div>'
        + avoidList.map(function(a) { return '<div class="h-avoid-item">' + a + '</div>'; }).join('')
        + '</div>';
    }

    var exampleHtml = '';
    if (example) {
      exampleHtml = '<div class="h-example"><div class="h-ex-label">Example</div><div class="h-ex-text">' + example + '</div></div>';
    }

    content.innerHTML = '<div class="h-field-name">' + name + '</div>'
      + (section ? '<div class="h-badge">' + section + '</div>' : '')
      + '<div class="h-desc">' + definition + '</div>'
      + exampleHtml
      + avoidHtml;

    switchTab('instructions', document.querySelector('.help-tab[data-tab="instructions"]'));
    openHelpPanel();
  }

  // ═══════════════════════════════
  //  WALKTHROUGH
  // ═══════════════════════════════
  function renderWalkthrough() {
    var container = document.getElementById('walkthroughContent');
    if (!container) return;

    // Detect current section from page URL or title
    var pageSection = detectCurrentSection();
    var data = WALKTHROUGHS[pageSection] || WALKTHROUGHS['default'];

    // Check if we have translations for this section's instructions
    var majorSec = pageSection.split('.')[0];
    var instrMap = INSTR_TRANS_MAP[majorSec];

    // Translate section title if mapping exists
    var displayTitle = data.title;
    if (instrMap && instrMap.sectionTitle) {
      displayTitle = getTranslatedInstr(instrMap.sectionTitle, data.title);
    }

    // Translate subtitle if mapping exists
    var displaySubtitle = data.subtitle;
    if (instrMap && instrMap.subtitle) {
      displaySubtitle = getTranslatedInstr(instrMap.subtitle, data.subtitle);
    }

    var stepsHtml = data.steps.map(function(s, i) {
      // Translate step label if mapping exists
      var displayLabel = s.label;
      if (instrMap && instrMap.labels && instrMap.labels[i]) {
        displayLabel = getTranslatedInstr(instrMap.labels[i], s.label);
      }
      // Translate step description if mapping exists
      var displayDesc = s.desc;
      if (instrMap && instrMap.steps && instrMap.steps[i]) {
        displayDesc = getTranslatedInstr(instrMap.steps[i], s.desc);
      }
      return '<div class="wstep"><div class="wnum todo">' + (i + 1) + '</div>'
        + '<div class="wcontent"><h4>' + displayLabel + '</h4><p>' + displayDesc + '</p></div></div>';
    }).join('');

    container.innerHTML = '<div style="font-size:14px;font-weight:700;color:#333333;margin-bottom:4px;">' + displayTitle + '</div>'
      + '<div style="font-size:12px;color:#666666;margin-bottom:16px;">' + displaySubtitle + '</div>'
      + stepsHtml;
  }

  function detectCurrentSection() {
    var path = window.location.pathname;
    // Match section numbers from filename: e.g. "1-ma-info-ar.html" -> "1", "4-budget..." -> "4"
    var match = path.match(/\/(\d+\.?\d*)-/);
    if (match) return match[1];
    // Fallback: check title text
    var title = document.querySelector('.title-main');
    if (title) {
      var tm = title.textContent.match(/(\d+\.?\d*)/);
      if (tm) return tm[1];
    }
    return 'default';
  }

  // ═══════════════════════════════
  //  GLOSSARY
  // ═══════════════════════════════
  var currentSecFilter = '';

  function buildGlossaryFilters() {
    var container = document.getElementById('helpGFilter');
    if (!container) return;
    var sections = ['All', 'Sec 1', 'Sec 2', 'Sec 3', 'Sec 4', 'Sec 5', 'Sec 6', 'Sec 7'];
    var secVals = ['', 'sec1', 'sec2', 'sec3', 'sec4', 'sec5', 'sec6', 'sec7'];
    container.innerHTML = sections.map(function(s, i) {
      return '<div class="g-filter-tag' + (i === 0 ? ' active' : '') + '" onclick="window.IPPFHelp.filterBySection(\'' + secVals[i] + '\',this)">' + s + '</div>';
    }).join('');
  }

  function renderGlossary(terms) {
    var list = document.getElementById('helpGList');
    if (!list) return;
    if (!terms.length) {
      list.innerHTML = '<div style="font-size:12px;color:#999;padding:12px 0">No matching terms found.</div>';
      return;
    }
    list.innerHTML = terms.map(function(t) {
      var displayName = getTranslatedName(t.name);
      var displayDef = getTranslatedDef(t.name, t.def);
      return '<div class="g-term"><div class="g-term-name">' + displayName + '</div><div class="g-term-def">' + displayDef + '</div><span class="g-term-tag">' + t.tag + '</span></div>';
    }).join('');
  }

  function filterGlossary(query) {
    var s = (query || '').toLowerCase();
    var filtered = GLOSSARY.filter(function(t) {
      var tName = getTranslatedName(t.name).toLowerCase();
      var tDef = getTranslatedDef(t.name, t.def).toLowerCase();
      var matchQ = !query || t.name.toLowerCase().indexOf(s) !== -1 || tName.indexOf(s) !== -1 || t.def.toLowerCase().indexOf(s) !== -1 || tDef.indexOf(s) !== -1;
      var matchSec = !currentSecFilter || t.sec === currentSecFilter;
      return matchQ && matchSec;
    });
    renderGlossary(filtered);
  }

  function filterBySection(sec, el) {
    currentSecFilter = sec;
    document.querySelectorAll('.g-filter-tag').forEach(function(t) { t.classList.remove('active'); });
    if (el) el.classList.add('active');
    var searchInput = document.getElementById('helpGSearch');
    filterGlossary(searchInput ? searchInput.value : '');
  }

  function openGlossaryTerm(termName) {
    switchTab('glossary', document.querySelector('.help-tab[data-tab="glossary"]'));
    openHelpPanel();
    setTimeout(function() {
      var inp = document.getElementById('helpGSearch');
      if (inp) { inp.value = termName; filterGlossary(termName); }
    }, 50);
  }

  // ═══════════════════════════════
  //  FIELD-LEVEL HELP ICONS
  //  Auto-inject ? icons next to labels that match glossary terms
  // ═══════════════════════════════

  // Build a lookup map: normalised label text -> glossary entry
  var glossaryLookup = {};
  var allowedEnglishLabelGlossary = {};
  (function buildLookup() {
    // Map of common label text -> glossary term name (for fuzzy matching)
    var labelAliases = {
      'reporting year': 'Reporting Year',
      'reporting periodicity': 'Reporting Periodicity',
      'ippf region': 'IPPF Region',
      'region': 'IPPF Region',
      'country of operation': 'Country of Operation',
      'organisation code': 'Affiliate Code',
      'organization code': 'Affiliate Code',
      'membership details': 'Membership Details',
      'institutional data': 'Institutional Data',
      'key documents': 'Key Documents',
      'organisation name (english)': 'Organisation Name (English)',
      'organisation name(english)': 'Organisation Name (English)',
      'organization name (english)': 'Organisation Name (English)',
      'organization name(english)': 'Organisation Name (English)',
      'organisation name (original lang)': 'Organisation Name (Original Language)',
      'organisation name (original language)': 'Organisation Name (Original Language)',
      'primary contact person': 'Primary Point of Contact',
      'primary point of contact for follow-up on business plan': 'Primary Point of Contact',
      'primary point of contact': 'Primary Point of Contact',
      'persona de contacto para el plan de negocio': 'Primary Point of Contact',
      'personne de contact principale': 'Primary Point of Contact',
      'مسؤول التواصل بشأن خطة الأعمال (الاسم والدور المكلف به)': 'Primary Point of Contact',
      'contact email': 'Contact Email',
      'address': 'Address',
      'key contacts': 'Key Contacts',
      'executive director / ceo (or equivalent)': 'Executive Director / CEO',
      'executive director / ceo': 'Executive Director / CEO',
      'board chair / president': 'Board Chair / President',
      'treasurer (or equivalent)': 'Treasurer',
      'treasurer': 'Treasurer',
      'youth board member': 'Youth Board Member',
      'finance lead': 'Finance Lead',
      'director of finance (or equivalent)': 'Director of Finance',
      'director of finance': 'Director of Finance',
      'programmatic lead': 'Programmatic Lead(s)',
      'programmatic lead(s)': 'Programmatic Lead(s)',
      'board term — start year': 'Board Term \u2014 Start Year',
      'board term — end year': 'Board Term \u2014 End Year',
      'board term - start year': 'Board Term \u2014 Start Year',
      'board term - end year': 'Board Term \u2014 End Year',
      'management letter (audit report)': 'Management Letter (Audit Report)',
      'ma': 'Affiliate',
      'ma (member association)': 'Affiliate',
      'ma-id': 'Affiliate Code',
      // Section 2
      'context shifts and operational environment': 'Context Shifts and Operational Environment',
      '1. context shifts and operational environment': 'Context Shifts and Operational Environment',
      'results & achievements': 'Results & Achievements',
      '2. results & achievements': 'Results & Achievements',
      'challenges': 'Challenges',
      '3. challenges': 'Challenges',
      'most effective strategies / approaches': 'Most Effective Strategies / Approaches',
      '4. most effective strategies / approaches': 'Most Effective Strategies / Approaches',
      'organisational update': 'Organisational Update',
      'organizational update': 'Organisational Update',
      '5. organisational update': 'Organisational Update',
      '5. organizational update': 'Organisational Update',
      'learning': 'Learning',
      '6. learning': 'Learning',
      'center care on people': 'Center Care on People',
      'move the sexuality agenda': 'Move the Sexuality Agenda',
      'solidarity for change': 'Solidarity for Change',
      'nurture our federation': 'Nurture our Federation',
      // Section 3
      'new project': 'New Project',
      'add new project': 'New Project',
      'project name': 'Project Name',
      'start date': 'Start Date',
      'end date': 'End Date',
      'project theme': 'Project Theme',
      'project donor': 'Project Donor',
      'funding type': 'Funding Type',
      'total contract value': 'Total Contract Value',
      'annual project income': 'Annual Project Income',
      'description of project': 'Description of Project',
      'project focus area': 'Project Focus Area',
      'expense budget (per focus area)': 'Expense Budget (per Focus Area)',
      'project by expense category': 'Project by Expense Category',
      'personnel': 'Personnel',
      'direct project activities': 'Direct Project Activities',
      'commodities': 'Commodities',
      'indirect / support costs': 'Indirect / Support Costs',
      'indirect/ support costs': 'Indirect / Support Costs',
      // Section 3 — Spanish aliases
      'nuevo proyecto': 'New Project',
      'nombre del proyecto': 'Project Name',
      'fecha de inicio': 'Start Date',
      'fecha de finalizacion': 'End Date',
      'tema del proyecto': 'Project Theme',
      'donante del proyecto': 'Project Donor',
      'tipo de financiamiento': 'Funding Type',
      'valor total del contrato': 'Total Contract Value',
      'ingreso anual del proyecto': 'Annual Project Income',
      'descripcion del proyecto': 'Description of Project',
      'area prioritaria del proyecto': 'Project Focus Area',
      'presupuesto de gastos (por area prioritaria)': 'Expense Budget (per Focus Area)',
      'proyecto segun la categoria de gastos': 'Project by Expense Category',
      'personal': 'Personnel',
      'costos directos de actividades del proyecto': 'Direct Project Activities',
      'productos': 'Commodities',
      'costos indirectos / de apoyo': 'Indirect / Support Costs',
      'costos indirectos/de apoyo': 'Indirect / Support Costs',
      // Section 3 — French aliases
      'nouveau projet': 'New Project',
      'nom du projet': 'Project Name',
      'date de debut': 'Start Date',
      'date de fin': 'End Date',
      'thematique du projet': 'Project Theme',
      'bailleur de fonds du projet': 'Project Donor',
      'type de financement': 'Funding Type',
      'valeur totale du contrat': 'Total Contract Value',
      'recettes annuelles du projet': 'Annual Project Income',
      'description du projet': 'Description of Project',
      "volet d'intervention du projet": 'Project Focus Area',
      "budget des depenses (par volet d'intervention)": 'Expense Budget (per Focus Area)',
      "projet par categorie de depenses": 'Project by Expense Category',
      'activites directes du projet': 'Direct Project Activities',
      'couts indirects / de soutien': 'Indirect / Support Costs',
      'couts indirects/de soutien': 'Indirect / Support Costs',
      // Section 3 — Arabic aliases
      '\u0645\u0634\u0631\u0648\u0639 \u062c\u062f\u064a\u062f': 'New Project',
      '\u0627\u0633\u0645 \u0627\u0644\u0645\u0634\u0631\u0648\u0639': 'Project Name',
      '\u062a\u0627\u0631\u064a\u062e \u0627\u0644\u0628\u062f\u0621': 'Start Date',
      '\u0645\u0648\u0636\u0648\u0639 \u0627\u0644\u0645\u0634\u0631\u0648\u0639': 'Project Theme',
      '\u0627\u0644\u062c\u0647\u0629 \u0627\u0644\u0645\u0627\u0646\u062d\u0629 \u0644\u0644\u0645\u0634\u0631\u0648\u0639': 'Project Donor',
      '\u0646\u0648\u0639 \u0627\u0644\u062a\u0645\u0648\u064a\u0644': 'Funding Type',
      '\u0627\u0644\u0642\u064a\u0645\u0629 \u0627\u0644\u0625\u062c\u0645\u0627\u0644\u064a\u0629 \u0644\u0644\u0639\u0642\u062f': 'Total Contract Value',
      '\u0627\u0644\u062f\u062e\u0644 \u0627\u0644\u0633\u0646\u0648\u064a \u0644\u0644\u0645\u0634\u0631\u0648\u0639': 'Annual Project Income',
      // Section 3.2 Focus Area labels (as they appear in the dynamic tables)
      'care: static clinic': 'Care: Static Clinic',
      '1. care: static clinic': 'Care: Static Clinic',
      "1. soins : clinique statique": 'Care: Static Clinic',
      'care: outreach, mobile clinic, community-based, delivery': 'Care: Outreach, Mobile Clinic, Community-based Delivery',
      '2. care: outreach, mobile clinic, community-based, delivery': 'Care: Outreach, Mobile Clinic, Community-based Delivery',
      'care: outreach, mobile clinic': 'Care: Outreach, Mobile Clinic, Community-based Delivery',
      "2. soins : sensibilisation, clinique mobile, communautaire, prestation": 'Care: Outreach, Mobile Clinic, Community-based Delivery',
      'care: other services, enabled or referred (associated clinics)': 'Care: Other Services, Enabled or Referred',
      '3. care: other services, enabled or referred (associated clinics)': 'Care: Other Services, Enabled or Referred',
      'care: other services': 'Care: Other Services, Enabled or Referred',
      "3. soins : autres services, facilites ou referes (cliniques associees)": 'Care: Other Services, Enabled or Referred',
      "3. soins : autres services, facilités ou référés (cliniques associées)": 'Care: Other Services, Enabled or Referred',
      'care: social marketing services': 'Care: Social Marketing Services',
      '4. care: social marketing services': 'Care: Social Marketing Services',
      'care: social marketing': 'Care: Social Marketing Services',
      "4. soins : services de marketing social": 'Care: Social Marketing Services',
      'care: digital health intervention and selfcare': 'Care: Digital Health Intervention and Selfcare',
      '5. care: digital health intervention and selfcare': 'Care: Digital Health Intervention and Selfcare',
      'care: digital health & selfcare': 'Care: Digital Health Intervention and Selfcare',
      '6. advocacy': 'Advocacy',
      'advocacy': 'Advocacy',
      '7. cse': 'CSE (Comprehensive Sexuality Education)',
      'cse': 'CSE (Comprehensive Sexuality Education)',
      '8. cse online, including social media': 'CSE Online, including Social Media',
      'cse online, including social media': 'CSE Online, including Social Media',
      'cse online / social media': 'CSE Online, including Social Media',
      '9. partnerships and movements: capacity-sharing, amplifying messages, and sub-granting': 'Partnerships and Movements',
      'partnerships and movements': 'Partnerships and Movements',
      '9. asociaciones y movimientos: capacidades compartidas, amplificación de mensajes, y subconcesión de subvenciones': 'Partnerships and Movements',
      'asociaciones y movimientos': 'Partnerships and Movements',
      '9. partenariats et mouvements – partage des capacités, amplification des messages et octroi de subventions subsidiaires': 'Partnerships and Movements',
      'partenariats et mouvements': 'Partnerships and Movements',
      '9. الشراكات والحركات: تبادل القدرات، تعظيم الرسائل وتقديم المنح الفرعية': 'Partnerships and Movements',
      'الشراكات والحركات': 'Partnerships and Movements',
      '10. knowledge, research, evidence, innovation, and publishing, including peer-review articles': 'Knowledge, Research, Evidence, Innovation',
      'knowledge, research, evidence': 'Knowledge, Research, Evidence, Innovation',
      '10. المعرفة، البحث، الأدلة، الابتكار، والنشر، بما في ذلك المقالات التي يراجعها الأقران': 'Knowledge, Research, Evidence, Innovation',
      '10. conocimientos, investigación, evidencia, innovación, y publicaciones, incluidos artículos sometidos a revisión de pares': 'Knowledge, Research, Evidence, Innovation',
      'conocimientos, investigación, evidencia, innovación': 'Knowledge, Research, Evidence, Innovation',
      '10. connaissances, recherche, données probantes, innovation et édition, y compris des articles soumis à une évaluation par des pairs': 'Knowledge, Research, Evidence, Innovation',
      'connaissances, recherche, données probantes, innovation': 'Knowledge, Research, Evidence, Innovation',
      'المعرفة، البحث، الأدلة، الابتكار': 'Knowledge, Research, Evidence, Innovation',
      '11. internal ma infrastructure, organisational development, capacity development, values, processes, and procedures': 'Internal MA Infrastructure',
      'internal ma infrastructure': 'Internal MA Infrastructure',
      '11. infraestructura interna de la am, desarrollo organizativo, ampliación de capacidad, valores, procesos, y procedimientos': 'Internal MA Infrastructure',
      'infraestructura interna de la am': 'Internal MA Infrastructure',
      "11. infrastructure interne de l'association membre, developpement organisationnel, renforcement des capacites, valeurs, processus et procedures": 'Internal MA Infrastructure',
      "11. infrastructure interne de l'association membre, développement organisationnel, renforcement des capacités, valeurs, processus et procédures": 'Internal MA Infrastructure',
      "11. infrastructure interne de l'association membre, développement organisationnel, renforcement des capacités, valeurs, processus et procédures": 'Internal MA Infrastructure',
      "infrastructure interne de l'association membre": 'Internal MA Infrastructure',
      '11. البنية التحتية الداخلية للجمعية العضو، التطوير التنظيمي، تنمية القدرات، القيم، العمليات، والإجراءات': 'Internal MA Infrastructure',
      'البنية التحتية الداخلية للجمعية العضو': 'Internal MA Infrastructure',
      'project focus area': 'Project Focus Area',
      'expense budget (per focus area)': 'Expense Budget (per Focus Area)',
      // Section 4 & 5
      'control cell: variance ($)': 'Variance ($) — Focus Area',
      'control cell : variance ($)': 'Variance ($) — Focus Area',
      'control cell: total spend (%)': 'Total Spend (%) — Focus Area',
      'control cell : total spend (%)': 'Total Spend (%) — Focus Area',
      'célula de control: varianza ($)': 'Variance ($) — Focus Area',
      'célula de control : varianza ($)': 'Variance ($) — Focus Area',
      'célula de control: gasto total (%)': 'Total Spend (%) — Focus Area',
      'célula de control : gasto total (%)': 'Total Spend (%) — Focus Area',
      'cellule de contrôle : variance ($)': 'Variance ($) — Focus Area',
      'cellule de controle : variance ($)': 'Variance ($) — Focus Area',
      'cellule de contrôle : dépenses totales (%)': 'Total Spend (%) — Focus Area',
      'cellule de controle : depenses totales (%)': 'Total Spend (%) — Focus Area',
      'خلية التحكم: التباين ($)': 'Variance ($) — Focus Area',
      'خلية التحكم: إجمالي الإنفاق (%)': 'Total Spend (%) — Focus Area',
      'budget': 'Budget (Focus Area)',
      'actual expenses': 'Actual Expenses (Focus Area)',
      'variance ($)': 'Variance ($)',
      'variance': 'Variance ($)',
      'total spend (%)': 'Total Spend (%)',
      'total spend': 'Total Spend (%)',
      'remarks': 'Remarks',
      'variance explanation': 'Variance Explanation',
      'personnel': 'Personnel',
      'direct project activities': 'Direct Project Activities',
      'commodities': 'Commodities',
      'indirect / support costs': 'Indirect / Support Costs',
      'indirect/support costs': 'Indirect / Support Costs',
      'indirect/ support costs': 'Indirect / Support Costs',
      'ippf core': 'IPPF Core',
      // Section 6
      'restricted': 'Restricted (Income)',
      'unrestricted': 'Unrestricted (Income)',
      'deficit / surplus': 'Deficit / Surplus',
      'locally generated income': 'Actual Locally Generated Income',
      'actual locally generated income': 'Actual Locally Generated Income',
      'international income (non-ippf)': 'Actual International Income (Non-IPPF)',
      'international income (non - ippf)': 'Actual International Income (Non-IPPF)',
      'actual international income (non-ippf)': 'Actual International Income (Non-IPPF)',
      'actual international income (non - ippf)': 'Actual International Income (Non-IPPF)',
      'ippf income': 'Actual IPPF Income',
      'actual ippf income': 'Actual IPPF Income',
      'commodity sales (including contraceptive, other srh and non-srh supplies/products)': 'Commodity Sales',
      'training, education, professional services and rentals': 'Training, Education, Professional Services',
      'local/national: government': 'Local/National: Government',
      'local/national: non-government': 'Local/National: Non-Government',
      'multilateral agencies and organizations': 'Multilateral Agencies and Organisations',
      'commodity sales': 'Commodity Sales',
      'client / patient fees': 'Client / Patient Fees',
      'membership fees': 'Membership Fees',
      'non-operational income': 'Non-operational Income',
      'total income': 'Total Income',
      'largest contributor': 'Largest Contributor',
      'ippf core grant': 'IPPF Core Grant',
      'other ippf grant': 'Other IPPF Grant',
      'income details': 'Actual Income Details',
      'actual income details': 'Actual Income Details',
      'actual income': 'Actual Income Details',
      'Actual income': 'Actual Income Details',
      // Section 7 — AOC Review Form
      'final aoc rating': 'Review Outcome',
      'review outcome': 'Review Outcome',
      'flag colour': 'Flag Colour',
      'flag color': 'Flag Colour',
      'comments': 'Comments',
      'aoc comment/agreed remedial actions.': 'AOC Comments / Remedial Actions',
      'aoc comment/agreed remedial actions': 'AOC Comments / Remedial Actions',
      'aoc comments / remedial actions': 'AOC Comments / Remedial Actions',
      'general requirements': 'General Requirements',
      'critical requirements': 'Critical Requirements',
      'serious risks identified': 'Serious Risks Identified',
      'serious risk identified': 'Serious Risk Identified',
      'serious risk identified 1': 'Serious Risk Identified',
      'serious risk identified 2': 'Serious Risk Identified',
      'serious risk identified 3': 'Serious Risk Identified',
      'identified risk': 'Serious Risk Identified',
      'identified risk 1': 'Serious Risk Identified',
      'identified risk 2': 'Serious Risk Identified',
      'identified risk 3': 'Serious Risk Identified',
      'comment 1': 'Comment (Serious Risks)',
      'comment 2': 'Comment (Serious Risks)',
      'comment 3': 'Comment (Serious Risks)',
      '1. process: was the report was submitted on time?': 'Question 1. Was the report submitted on time?',
      '2. process: has the ma consulted with you, the aoc, during the development of the ar?': 'Question 2. Has the affiliate consulted with the AOC?',
      '3. quality: is the report done to the required standard: e.g. all answers and budget fields are completed and are understandable?': 'Question 3. Is the report done to the required standard?',
      '4. narrative report: in section 2, question 2, has the ma/cp reported tangible results in at least two of the four ippf strategic pillars': 'Question 4. Tangible results in at least two Strategic Pillars?',
      '5.  narrative report: in section 2, question 3 to 6, has the ma/cp meaningfully reflected on challenges and learnings in the reporting period?': 'Question 5. Meaningful reflection on challenges and learnings?',
      '5. narrative report: in section 2, question 3 to 6, has the ma/cp meaningfully reflected on challenges and learnings in the reporting period?': 'Question 5. Meaningful reflection on challenges and learnings?',
      '6. financial: is the total expense reported under section 4 the same as the total reported in section 5?': 'Question 6. Total expense Section 4 equals Section 5?',
      '7. financial: what is the status of the audit report for the financial year?': 'Question 7. Status of the audit report?',
      '8. in section 5 "budget vs actuals by expense category", are negative variances (in red) sufficiently explained for all of the individual projects?': 'Question 8. Negative variances sufficiently explained?',
      '9.  financial: in section 6 "actual income", is the overall financial status indicating a surplus or balanced budget (income minus expenses)?': 'Question 9. Surplus or balanced budget?',
      '9. financial: in section 6 "actual income", is the overall financial status indicating a surplus or balanced budget (income minus expenses)?': 'Question 9. Surplus or balanced budget?',
    };

    // Index glossary by exact name (lower-cased)
    GLOSSARY.forEach(function(term) {
      var normName = normalizeLabelText(term.name);
      glossaryLookup[normName] = term;
      allowedEnglishLabelGlossary[normName] = term.name;
    });
    // Add aliases
    Object.keys(labelAliases).forEach(function(alias) {
      var termName = labelAliases[alias];
      var term = glossaryLookup[normalizeLabelText(termName)];
      if (term) {
        var normAlias = normalizeLabelText(alias);
        glossaryLookup[normAlias] = term;
        allowedEnglishLabelGlossary[normAlias] = termName;
      }
    });
  })();

  function findGlossaryMatch(labelText) {
    var clean = normalizeLabelText(labelText);
    // Remove trailing asterisks, colons
    clean = clean.replace(/[\*:]+$/, '').trim();
    // Remove leading numbers like "1. ", "2. "
    var withoutNum = clean.replace(/^\d+[.)]?\s*/, '');

    // Direct match (English glossary names)
    if (glossaryLookup[clean]) return glossaryLookup[clean];
    if (glossaryLookup[withoutNum]) return glossaryLookup[withoutNum];

    // Partial match: check if any glossary key starts with or is contained in the label
    // Require minimum 4 characters for partial matching to avoid false matches
    // (e.g. "No" matching "Non-operational Income", "Yes" matching unrelated terms)
    var keys = Object.keys(glossaryLookup);
    if (clean.length >= 4) {
      for (var i = 0; i < keys.length; i++) {
        if (clean.indexOf(keys[i]) === 0 || keys[i].indexOf(clean) === 0) {
          return glossaryLookup[keys[i]];
        }
      }
    }
    // Try without number prefix
    if (withoutNum.length >= 4) {
      for (var j = 0; j < keys.length; j++) {
        if (withoutNum.indexOf(keys[j]) === 0 || keys[j].indexOf(withoutNum) === 0) {
          return glossaryLookup[keys[j]];
        }
      }
    }

    // Reverse-lookup: label text may be in a translated language (after localize()),
    // so check if it matches any translated glossary name
    var lang = _getCurrentLang();
    if (lang !== 'en') {
      var glossaryNames = Object.keys(GLOSSARY_TRANS_MAP);
      for (var k = 0; k < glossaryNames.length; k++) {
        var mapping = GLOSSARY_TRANS_MAP[glossaryNames[k]];
        if (!mapping) continue;
        var translatedName = null;
        var englishSource = null;
        // Check nid (translation_mapping) first
        if (mapping.nid && typeof translation_mapping !== 'undefined') {
          translatedName = _lookupInArray(translation_mapping, mapping.nid, lang);
          englishSource = _lookupInArray(translation_mapping, mapping.nid, 'en');
        }
        // Fallback: check nid_g (translation_mapping_ar_glossary)
        if (!translatedName && mapping.nid_g && typeof translation_mapping_ar_glossary !== 'undefined') {
          translatedName = _lookupInArray(translation_mapping_ar_glossary, mapping.nid_g, lang);
          englishSource = _lookupInArray(translation_mapping_ar_glossary, mapping.nid_g, 'en');
        }
        if (translatedName) {
          var englishSourceKey = normalizeLabelText(englishSource).replace(/[\*:]+$/, '').trim();
          if (allowedEnglishLabelGlossary[englishSourceKey] !== glossaryNames[k]) continue;
          var transLower = normalizeLabelText(translatedName).replace(/[\*:]+$/, '').trim();
          // For translated labels, require exact equality only.
          // Prefix/contains matching creates false positives for short generic
          // labels like "Name", "Nombre", "Nom", which can match many terms.
          if (transLower === clean || transLower === withoutNum) {
            return glossaryLookup[normalizeLabelText(glossaryNames[k])];
          }
        }
      }
    }

    return null;
  }

  // ============================================
  //  Global body-appended tooltip (shared by all ? icons)
  // ============================================
  var globalTooltip = null;
  var tooltipHideTimer = null;

  function createGlobalTooltip() {
    if (globalTooltip) return globalTooltip;
    var tt = document.createElement('div');
    tt.className = 'help-field-tooltip';
    tt.innerHTML = '<span class="tooltip-term"></span><span class="tooltip-def"></span>';
    document.body.appendChild(tt);
    globalTooltip = tt;
    return tt;
  }

  function showTooltip(iconEl, termName, termDef) {
    clearTimeout(tooltipHideTimer);
    var tt = createGlobalTooltip();

    // Translate at display time
    var displayName = getTranslatedName(termName);
    var displayDef = getTranslatedDef(termName, termDef);

    // Set content
    tt.querySelector('.tooltip-term').textContent = displayName;
    tt.querySelector('.tooltip-def').textContent = displayDef;

    // Remove old arrow classes and hide
    tt.classList.remove('arrow-down', 'arrow-up', 'visible');
    tt.style.display = 'block';
    tt.style.opacity = '0';
    tt.style.left = '-9999px';
    tt.style.top = '-9999px';

    // Force reflow so the browser registers the initial state
    void tt.offsetHeight;

    var ttRect = tt.getBoundingClientRect();
    var iconRect = iconEl.getBoundingClientRect();

    // Decide: show above or below the icon
    var spaceAbove = iconRect.top;
    var spaceBelow = window.innerHeight - iconRect.bottom;
    var showAbove = spaceAbove > ttRect.height + 12 || spaceAbove > spaceBelow;

    var left = iconRect.left + (iconRect.width / 2) - (ttRect.width / 2);
    // Clamp within viewport
    if (left < 8) left = 8;
    if (left + ttRect.width > window.innerWidth - 8) left = window.innerWidth - ttRect.width - 8;

    var top;
    if (showAbove) {
      top = iconRect.top - ttRect.height - 8;
      tt.classList.add('arrow-down'); // arrow points down toward the icon
    } else {
      top = iconRect.bottom + 8;
      tt.classList.add('arrow-up');   // arrow points up toward the icon
    }

    tt.style.left = left + 'px';
    tt.style.top = top + 'px';
    tt.style.opacity = '1';
    tt.classList.add('visible');
  }

  function hideTooltip() {
    tooltipHideTimer = setTimeout(function() {
      if (globalTooltip) {
        globalTooltip.classList.remove('visible', 'arrow-down', 'arrow-up');
        globalTooltip.style.display = 'none';
      }
    }, 80); // small delay so rapid mouse movements don't flicker
  }

  // Track which labels we've already processed
  var processedLabels = new WeakSet();

  // Re-inject help icons after language change (localize() wipes them out)
  function reinjectFieldHelpIcons() {
    // Remove all existing help icons
    var existingIcons = document.querySelectorAll('.help-field-icon');
    existingIcons.forEach(function(icon) { icon.parentNode.removeChild(icon); });
    // Reset the processed set so labels can be re-processed
    processedLabels = new WeakSet();
    // Re-inject
    injectFieldHelpIcons();
  }

  function injectFieldHelpIcons() {
    // Process all labels, h3/h4 section headers, and focus area spans in tables
    var selectors = '.form-group label, .form-row label, .box-from-inner label, .top-detail-form label, .accordion-body h3, .accordion-body h4, .cont-wrap-inner label, td[data-i18n], td > span[id^="projectArea"], td > span[data-i18n*="focus_area"], td > span[id$="-area"], .listnum > div, .cont-wrap-inner h6.title-main, .budget-wrap strong, th[data-i18n], th > span[data-i18n]';
    var labels = document.querySelectorAll(selectors);

    labels.forEach(function(label) {
      // Skip if already has a help icon (prevents duplicates from MutationObserver re-runs)
      if (label.querySelector('.help-field-icon')) return;

      // Get visible text (strip any existing icons)
      var rawText = '';
      label.childNodes.forEach(function(node) {
        if (node.nodeType === 3) { // Text node
          rawText += node.textContent;
        } else if (node.nodeType === 1 && node.tagName !== 'I' && !node.classList.contains('help-field-icon') && node.tagName !== 'BUTTON') {
          rawText += node.textContent;
        }
      });
      rawText = rawText.replace(/\s+/g, ' ').trim();

      if (!rawText || rawText.length < 2) return;

      var match = findGlossaryMatch(rawText);
      if (!match) return;

      processedLabels.add(label);

      // Remove any existing fa-info-circle toggle icons from the label
      var infoIcons = label.querySelectorAll('.fa-info-circle');
      infoIcons.forEach(function(icon) {
        icon.parentNode.removeChild(icon);
      });

      // Create the ? icon (no child tooltip — uses global body-appended tooltip)
      var qIcon = document.createElement('span');
      qIcon.className = 'help-field-icon';
      qIcon.setAttribute('role', 'button');
      qIcon.setAttribute('tabindex', '0');
      qIcon.innerHTML = '?';
      qIcon.setAttribute('data-help-term', match.name);
      qIcon.setAttribute('data-help-def', match.def);

      // Click → no action (glossary only opens via main green icon)
      qIcon.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
      };

      // Hover → show body-appended tooltip (no sidebar)
      (function(icon, termName, termDef) {
        icon.addEventListener('mouseenter', function() {
          showTooltip(icon, termName, termDef);
        });
        icon.addEventListener('mouseleave', function() {
          hideTooltip();
        });
        // Keyboard accessibility: show on focus, hide on blur
        icon.addEventListener('focus', function() {
          showTooltip(icon, termName, termDef);
        });
        icon.addEventListener('blur', function() {
          hideTooltip();
        });
      })(qIcon, match.name, match.def);

      // Insert ? icon right after the label text
      label.appendChild(document.createTextNode(' '));
      label.appendChild(qIcon);

    });
  }

  // Also handle the Narrative Report collapse pattern:
  // Make collapse descriptions always visible (remove toggle behavior)
  function fixNarrativeCollapses() {
    var collapseEls = document.querySelectorAll('.cont-wrap-inner .collapse, .cont-wrapper .collapse');
    collapseEls.forEach(function(el) {
      // Skip accordion bodies — those should remain collapsible
      if (el.classList.contains('accordion-body')) return;
      // Ensure always shown
      if (!el.classList.contains('show')) {
        el.classList.add('show');
      }
      // Remove collapse class so Bootstrap doesn't toggle it
      el.classList.remove('collapse');
      el.style.display = '';
      // Remove the up-arrow toggle icons inside
      var upArrows = el.querySelectorAll('.fa-arrow-alt-circle-up');
      upArrows.forEach(function(arrow) {
        var parent = arrow.closest('i');
        if (parent) parent.style.display = 'none';
      });
    });
  }

  function observeForFieldLabels() {
    // Observe for dynamically loaded content (forms appear after API calls)
    var fieldObserver = new MutationObserver(function() {
      injectFieldHelpIcons();
      fixNarrativeCollapses();
    });

    fieldObserver.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    // Also run after a delay for initial page load
    setTimeout(function() {
      injectFieldHelpIcons();
      fixNarrativeCollapses();
    }, 500);
    setTimeout(function() {
      injectFieldHelpIcons();
      fixNarrativeCollapses();
    }, 2000);
    setTimeout(function() {
      injectFieldHelpIcons();
    }, 5000);
  }

  // ═══════════════════════════════
  //  PUBLIC API
  // ═══════════════════════════════
  window.IPPFHelp = {
    toggle: toggleHelpPanel,
    open: openHelpPanel,
    close: closeHelpPanel,
    switchTab: switchTab,
    showFieldHelp: showFieldHelp,
    filterGlossary: filterGlossary,
    filterBySection: filterBySection,
    openGlossary: openGlossaryTerm,
    glossary: GLOSSARY,
  };

  // ═══════════════════════════════
  //  INIT ON DOM READY
  // ═══════════════════════════════
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectHelpPanel);
  } else {
    injectHelpPanel();
  }

})();
