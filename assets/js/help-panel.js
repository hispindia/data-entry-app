/**
 * IPPF BPR Portal — Help & Guidance Panel
 * Global sidebar with Instructions, Walkthrough, and Glossary tabs
 * Glossary data sourced from BPR_Annual Report_Glossary v1.6
 */

(function() {
  'use strict';

  // ═══════════════════════════════
  //  GLOSSARY DATA — from BPR v1.6
  // ═══════════════════════════════
  const GLOSSARY = [
    // ── Section 1: Organisational Info ──
    // 1.1 Membership Details
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
    { name:'Address', def:'The registered physical or postal address of the Affiliate\'s main office or headquarters.', sec:'sec1', tag:'1.2 Institutional' },
    { name:'Key Contacts', def:'A set of designated individuals within the Affiliate who hold leadership or functional roles and serve as primary points of contact for IPPF communication and follow-up.', sec:'sec1', tag:'1.2 Institutional' },
    { name:'Executive Director / CEO', def:'The person responsible for the overall management and operational leadership of the organisation.', sec:'sec1', tag:'1.2 Institutional' },
    { name:'Board Chair / President', def:'The elected or appointed leader of the Affiliate\'s governing board.', sec:'sec1', tag:'1.2 Institutional' },
    { name:'Officer of the Board', def:'Additional elected or appointed members of the governing board holding designated roles such as Vice President, Secretary, or Treasurer. These individuals support the governance and oversight of the organisation.', sec:'sec1', tag:'1.2 Institutional' },
    { name:'Youth Board Member', def:'A member of the governing board who represents the youth constituency of the Affiliate.', sec:'sec1', tag:'1.2 Institutional' },
    { name:'Programmatic Lead(s)', def:'The individual responsible for managing and delivering the Affiliate\'s portfolio of programmes and/or projects.', sec:'sec1', tag:'1.2 Institutional' },
    { name:'Finance Lead', def:'The individual responsible for managing the financial operations of the Affiliate, including budgeting, accounting, financial reporting, and audit compliance.', sec:'sec1', tag:'1.2 Institutional' },
    { name:'Board Term \u2014 Start Year', def:'The year in which the current governing board\'s term of service commenced. Alternatively, use the term period of the Board Chair / President.', sec:'sec1', tag:'1.2 Institutional' },
    { name:'Board Term \u2014 End Year', def:'The year in which the current governing board\'s term of service is scheduled to conclude. Alternatively, use the term period of the Board Chair / President.', sec:'sec1', tag:'1.2 Institutional' },
    // 1.3 Key Documents
    { name:'Key Annual Report Documents', def:'Supporting documents that accompany the Annual Report submission, such as the organisation\'s annual audit report.', sec:'sec1', tag:'1.3 Key Documents' },
    { name:'Management Letter (Audit Report)', def:'A formal letter issued by the external auditor to the management of the Affiliate, alongside the audit report. It typically contains findings, observations, and recommendations on internal controls, financial management, and compliance noted during the audit.', sec:'sec1', tag:'1.3 Key Documents' },

    // ── Section 2: Narrative Report ──
    // 2.1 Context Events
    { name:'Context Events', def:'A narrative description of significant external events or developments during the reporting year that influenced the Affiliate\'s operating environment. This includes changes in the political or legal landscape, shifts in public opinion, opposition movements, or other country-level developments relevant to Sexual and Reproductive Health and Rights (SRHR).', sec:'sec2', tag:'2.1 Context' },
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
    { name:'Budget (Focus Area)', def:'The planned or approved financial allocation for a specific focus area within a project for the reporting year, as set out in the Annual Business Plan or project agreement.', sec:'sec4', tag:'4.2 Table' },
    { name:'Actual Expenses (Focus Area)', def:'The amount spent within a specific focus area during the reporting year. Should reflect verified expenditure from the Affiliate\'s financial records.', sec:'sec4', tag:'4.2 Table' },
    { name:'Variance ($)', def:'The monetary difference between budgeted amount and actual expenses for a specific focus area. Calculated as Budget minus Actual Expenses. Positive = underspend; negative = overspend.', sec:'sec4', tag:'4.2 Table' },
    { name:'Total Spend (%)', def:'The percentage of the budgeted amount that was actually spent within a specific focus area. Calculated as (Actual Expenses \u00f7 Budget) \u00d7 100.', sec:'sec4', tag:'4.2 Table' },
    { name:'Project Total (Focus Area)', def:'The sum row at the bottom of each project\'s focus area table, showing total budgeted amount, total actual expenses, total variance, and overall spend percentage across all focus areas.', sec:'sec4', tag:'4.2 Table' },
    { name:'Remarks', def:'A free-text field (up to 200 words) at the end of each project\'s budget vs actuals table, where the Affiliate can provide explanations for significant variances, delays, reallocation of funds, or any other context relevant to the project\'s financial performance.', sec:'sec4', tag:'4.2 Table' },

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

    // ── Section 6: Actual Income Details ──
    // 6.1 Income Summary
    { name:'Actual Income Details', def:'A comprehensive record of all income received by the Affiliate during the reporting year, broken down by income category, sub-category, and funding type (Restricted vs Unrestricted).', sec:'sec6', tag:'6.1 Summary' },
    { name:'Income Category', def:'The top-level classification of income sources. The three income categories are: Locally Generated Income, International Income (Non-IPPF), and IPPF Income.', sec:'sec6', tag:'6.1 Summary' },
    { name:'Restricted (Income)', def:'Funding that has been designated by the donor for a specific purpose, project, activity, or population. May only be used in accordance with the donor\'s conditions.', sec:'sec6', tag:'6.1 Summary' },
    { name:'Unrestricted (Income)', def:'Funding that has not been tied to a specific purpose by the donor, giving the Affiliate flexibility to allocate it according to its own strategic priorities.', sec:'sec6', tag:'6.1 Summary' },
    { name:'Total Income', def:'The sum of all income received by the Affiliate across all income categories (Locally Generated, International Non-IPPF, and IPPF Income) during the reporting year, combining both Restricted and Unrestricted amounts.', sec:'sec6', tag:'6.1 Summary' },
    { name:'Total Actual Expenses (by Expense Categories)', def:'The total verified expenditure of the Affiliate during the reporting year, drawn from the expense category data entered in Section 5. Displayed to enable direct comparison with total income.', sec:'sec6', tag:'6.1 Summary' },
    { name:'Deficit / Surplus', def:'The net financial position of the Affiliate for the reporting year, calculated as Total Income minus Total Actual Expenses. Positive = surplus; negative = deficit. System-calculated.', sec:'sec6', tag:'6.1 Summary' },
    // 6.2 Locally Generated Income
    { name:'Locally Generated Income', def:'All income earned or raised by the Affiliate within its own country of operation, from sources other than IPPF or international donors. Includes service fees, commodity sales, government grants, and other domestically sourced revenue.', sec:'sec6', tag:'6.2 Local' },
    { name:'Commodity Sales', def:'Revenue generated from the sale of health products/commodities, including contraceptives, other sexual and reproductive health supplies, and any non-SRH products sold by the Affiliate.', sec:'sec6', tag:'6.2 Local' },
    { name:'Client / Patient Fees', def:'Income collected directly from clients or patients in exchange for health services provided by the Affiliate. This may be full fees, co-payments, or nominal charges.', sec:'sec6', tag:'6.2 Local' },
    { name:'Training, Education, Professional Services', def:'Income earned by the Affiliate through delivering training programs, educational services, professional consultancy, or by renting out facilities or equipment to external parties.', sec:'sec6', tag:'6.2 Local' },
    { name:'Local/National: Government', def:'Grants, subsidies, contracts, or other financial support received from local or national government bodies within the Affiliate\'s country of operation.', sec:'sec6', tag:'6.2 Local' },
    { name:'Local/National: Non-Government', def:'Donations, grants, or other income received from local or national non-governmental sources, such as national foundations, trusts, businesses, or private donors based within the country.', sec:'sec6', tag:'6.2 Local' },
    { name:'Membership Fees', def:'Income collected from individuals or organisations who pay a fee to become members of the Affiliate, often granting them certain rights, services, or participation in the organisation\'s governance.', sec:'sec6', tag:'6.2 Local' },
    { name:'Non-operational Income', def:'Income that does not arise from the MA\'s core programmatic or service delivery activities. This may include interest earned on bank accounts, investment returns, or other incidental financial gains.', sec:'sec6', tag:'6.2 Local' },
    { name:'Other National Income', def:'Any locally generated income that does not fit into the other defined sub-categories. Used for miscellaneous or atypical domestic income sources.', sec:'sec6', tag:'6.2 Local' },
    // 6.3 International Income (Non-IPPF)
    { name:'International Income (Non-IPPF)', def:'All income received from international donors and sources outside the MA\'s country of operation, excluding funds channeled through IPPF. Includes bilateral and multilateral donors, foreign governments, international NGOs, and global foundations.', sec:'sec6', tag:'6.3 International' },
    { name:'Multilateral Agencies and Organisations', def:'International bodies funded and governed by multiple member states or governments, such as UN agencies (e.g. UNFPA, UNICEF, WHO) or the World Bank.', sec:'sec6', tag:'6.3 International' },
    { name:'Foreign Governments', def:'Direct funding received from the government of a country other than the MA\'s own country of operation, typically through bilateral aid programs or government development agencies.', sec:'sec6', tag:'6.3 International' },
    { name:'International Trusts and Foundations / NGOs', def:'Grants or donations received from internationally operating private foundations, charitable trusts, or non-governmental organisations headquartered outside the MA\'s country of operation.', sec:'sec6', tag:'6.3 International' },
    { name:'Corporate / Business Sector', def:'Income received from private sector companies or business entities, whether as direct donations, sponsorships, corporate social responsibility (CSR) contributions, or contractual payments for services.', sec:'sec6', tag:'6.3 International' },
    { name:'Other International Income', def:'Any international income not captured by the above sub-categories. Used for atypical or miscellaneous income from overseas sources.', sec:'sec6', tag:'6.3 International' },
    // 6.4 IPPF Income
    { name:'IPPF Income', def:'All funds received directly from IPPF, whether as a core grant, Stream 2 or 3 grants, or through restricted grants. Captures the full extent of IPPF\'s financial contribution to the MA in the reporting year.', sec:'sec6', tag:'6.4 IPPF' },
    { name:'IPPF Core Grant', def:'The strategic funding allocation provided by IPPF to the Affiliate without restrictions. This amount is auto-populated.', sec:'sec6', tag:'6.4 IPPF' },
    { name:'Other IPPF Grant', def:'Any additional funding received from IPPF beyond the Core Grant. This may include grants for specific programs, emergency funding, innovation funds, or other targeted financial support.', sec:'sec6', tag:'6.4 IPPF' },
    // 6.5 Largest Contributor
    { name:'Largest Contributor', def:'The single organisation \u2014 whether a government, trust, foundation, IPPF, or other donor \u2014 that provided the greatest amount of income to the Affiliate during the reporting year.', sec:'sec6', tag:'6.5 Contributor' },
    { name:'How Much Income Did They Provide?', def:'The total monetary value of funding received from the largest contributing organisation during the reporting year, expressed in the reporting currency.', sec:'sec6', tag:'6.5 Contributor' },
  ];

  // ── WALKTHROUGH DATA ──
  const WALKTHROUGHS = {
    // Annual Report sections (detected by leading number in URL/title)
    '1': { title:'Section 1 \u2014 Organisation Details', subtitle:'Membership details, contacts, institutional data, and key documents', steps:[
      { label:'Membership Details', desc:'Verify your Reporting Year, Reporting Periodicity, IPPF Region, Affiliate Code, Organisation Name, Country of Operation, and Primary Contact.' },
      { label:'Institutional Data', desc:'Provide your registered address and details for key contacts \u2014 Executive Director, Board Chair, Finance Lead, Youth Board Member, and Programmatic Leads.' },
      { label:'Board Term & Governance', desc:'Enter Board Term start/end years and other institutional governance data.' },
      { label:'Key Documents', desc:'Upload the Management Letter (Audit Report) from your external auditor for the reporting year.' },
    ]},
    '1.1': { title:'Section 1.1 \u2014 Organisation Details', subtitle:'Membership details, contacts, institutional data, and key documents', steps:[
      { label:'Membership Details', desc:'Verify your Reporting Year, Reporting Periodicity, IPPF Region, Affiliate Code, Organisation Name, Country of Operation, and Primary Contact.' },
      { label:'Institutional Data', desc:'Provide your registered address and details for key contacts \u2014 Executive Director, Board Chair, Finance Lead, Youth Board Member, and Programmatic Leads.' },
      { label:'Board Term & Governance', desc:'Enter Board Term start/end years and other institutional governance data.' },
      { label:'Key Documents', desc:'Upload the Management Letter (Audit Report) from your external auditor for the reporting year.' },
    ]},
    '2': { title:'Section 2 \u2014 Narrative Report', subtitle:'Context, results, challenges, strategies, and learning', steps:[
      { label:'Context Events', desc:'Describe significant external events or developments during the reporting year that influenced your operating environment.' },
      { label:'Results & Achievements', desc:'Summarise the main outcomes organised by IPPF Strategic Pillar. Highlight work with youth and marginalised populations.' },
      { label:'Challenges', desc:'Describe main difficulties or constraints that affected programme delivery or achievement of planned results.' },
      { label:'Most Effective Strategies', desc:'Reflect on methods or approaches that proved most successful. Share examples of good practice.' },
      { label:'Organisational Update', desc:'Summarise any significant internal changes \u2014 structure, leadership, board composition, staffing, or policies.' },
      { label:'Learning', desc:'Share key insights, lessons, or knowledge gained that will inform future planning.' },
    ]},
    '3': { title:'Section 3 \u2014 Add New Projects', subtitle:'Register projects not in the original Business Plan', steps:[
      { label:'Project General Information', desc:'Enter project name, start/end dates, theme, donor, funding type, total contract value, and annual project income.' },
      { label:'Project Focus Area Breakdown', desc:'Allocate the project budget across standardised programmatic focus areas (e.g. Static Clinic, Outreach, Advocacy, CSE).' },
      { label:'Expense Category Breakdown', desc:'Break down expenditure by Personnel, Direct Project Activities, Commodities, and Indirect/Support Costs.' },
      { label:'Project Description', desc:'Provide a summary of the project\'s purpose, target population, geographic scope, and key activities.' },
    ]},
    '4': { title:'Section 4 \u2014 Budget vs Actuals by Focus Area', subtitle:'Compare budgeted and actual expenses by programmatic focus area', steps:[
      { label:'Review Control Cells', desc:'Check the summary row showing total budgeted expenses, total actual expenses, variance, and total spend percentage across all focus areas.' },
      { label:'Enter Actual Expenses', desc:'For each project and focus area, enter the actual amount spent during the reporting year.' },
      { label:'Review Variance & Spend', desc:'Check system-calculated variance ($) and total spend (%) for each focus area. Identify significant deviations.' },
      { label:'Add Remarks', desc:'Provide explanations (up to 200 words) for significant variances, delays, or reallocation of funds.' },
    ]},
    '5': { title:'Section 5 \u2014 Budget vs Actuals by Expense Category', subtitle:'Compare budgeted and actual expenses by cost type', steps:[
      { label:'Review Control Cells', desc:'Check the summary row showing total MA budgeted expense, total MA actuals, variance, and total spend percentage.' },
      { label:'Enter Actual Expenses', desc:'For each project and expense category (Personnel, Direct Activities, Commodities, Indirect Costs), enter the actual amount spent.' },
      { label:'Review Variance & Spend', desc:'Check system-calculated variance and total spend percentage. Compare against the focus area view in Section 4.' },
      { label:'Add Variance Explanation', desc:'Provide explanations (up to 200 words) for significant variances in each project.' },
    ]},
    '6': { title:'Section 6 \u2014 Actual Income Details', subtitle:'Record all income received during the reporting year', steps:[
      { label:'Income Summary', desc:'Review the summary showing Total Income, Total Actual Expenses, and Deficit/Surplus calculation.' },
      { label:'Locally Generated Income', desc:'Enter income from commodity sales, patient fees, training services, government grants, membership fees, and other local sources.' },
      { label:'International Income (Non-IPPF)', desc:'Enter income from multilateral agencies, foreign governments, international trusts/NGOs, and corporate sources.' },
      { label:'IPPF Income', desc:'Verify IPPF Core Grant (auto-populated) and enter any other IPPF grants received.' },
      { label:'Largest Contributor', desc:'Identify the single organisation that provided the greatest amount of income and specify the amount.' },
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
      + '<div class="help-panel-title">Help & Guidance</div>'
      + '<button class="help-panel-close" onclick="window.IPPFHelp.close()" title="Close">&#10005;</button>'
      + '</div>'
      + '<div class="help-panel-ctx" id="helpPanelCtx">Click any ? icon or field to see guidance</div>'
      + '<div class="help-tabs">'
      + '<button class="help-tab active" data-tab="instructions" onclick="window.IPPFHelp.switchTab(\'instructions\',this)">Instructions</button>'
      + '<button class="help-tab" data-tab="walkthrough" onclick="window.IPPFHelp.switchTab(\'walkthrough\',this)">Walkthrough</button>'
      + '<button class="help-tab" data-tab="glossary" onclick="window.IPPFHelp.switchTab(\'glossary\',this)">Glossary</button>'
      + '</div>'
      + '</div>'
      + '<div class="help-panel-body">'
      // Instructions pane
      + '<div class="help-pane active" id="hp-instructions">'
      + '<div class="help-idle" id="helpIdle">'
      + '<div class="help-idle-icon">&#128161;</div>'
      + '<h3>Field-Level Guidance</h3>'
      + '<p>Click any <strong>?</strong> icon or field label to see its definition, an example, and common mistakes to avoid.</p>'
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
        tabWalkthrough.textContent = 'Instructions';
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
    } else if (majorSec === '3' || majorSec === '4' || majorSec === '5' || majorSec === '6') {
      // Sections 3–6: Hide Instructions tab; rename Walkthrough to "Instructions"; keep Glossary
      if (tabInstructions) tabInstructions.style.display = 'none';
      if (paneInstructions) { paneInstructions.style.display = 'none'; paneInstructions.classList.remove('active'); }
      if (tabWalkthrough) {
        tabWalkthrough.textContent = 'Instructions';
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

    idle.style.display = 'none';
    content.style.display = 'block';
    if (ctx) ctx.textContent = name;

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

    var stepsHtml = data.steps.map(function(s, i) {
      return '<div class="wstep"><div class="wnum todo">' + (i + 1) + '</div>'
        + '<div class="wcontent"><h4>' + s.label + '</h4><p>' + s.desc + '</p></div></div>';
    }).join('');

    container.innerHTML = '<div style="font-size:14px;font-weight:700;color:#333333;margin-bottom:4px;">' + data.title + '</div>'
      + '<div style="font-size:12px;color:#666666;margin-bottom:16px;">' + data.subtitle + '</div>'
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
    var sections = ['All', 'Sec 1', 'Sec 2', 'Sec 3', 'Sec 4', 'Sec 5', 'Sec 6'];
    var secVals = ['', 'sec1', 'sec2', 'sec3', 'sec4', 'sec5', 'sec6'];
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
      return '<div class="g-term"><div class="g-term-name">' + t.name + '</div><div class="g-term-def">' + t.def + '</div><span class="g-term-tag">' + t.tag + '</span></div>';
    }).join('');
  }

  function filterGlossary(query) {
    var s = (query || '').toLowerCase();
    var filtered = GLOSSARY.filter(function(t) {
      var matchQ = !query || t.name.toLowerCase().indexOf(s) !== -1 || t.def.toLowerCase().indexOf(s) !== -1;
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
      'organisation name (english)': 'Organisation Name (English)',
      'organisation name (original lang)': 'Organisation Name (Original Language)',
      'organisation name (original language)': 'Organisation Name (Original Language)',
      'primary point of contact for follow-up on business plan': 'Primary Point of Contact',
      'primary point of contact': 'Primary Point of Contact',
      'contact email': 'Contact Email',
      'address': 'Address',
      'key contacts': 'Key Contacts',
      'executive director / ceo (or equivalent)': 'Executive Director / CEO',
      'executive director / ceo': 'Executive Director / CEO',
      'board chair / president': 'Board Chair / President',
      'youth board member': 'Youth Board Member',
      'finance lead': 'Finance Lead',
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
      'context events': 'Context Events',
      '1. context events': 'Context Events',
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
      'project name': 'Project Name',
      'start date': 'Start Date',
      'end date': 'End Date',
      'project theme': 'Project Theme',
      'project donor': 'Project Donor',
      'funding type': 'Funding Type',
      'total contract value': 'Total Contract Value',
      'annual project income': 'Annual Project Income',
      'description of project': 'Description of Project',
      // Section 3.2 Focus Area labels (as they appear in the dynamic tables)
      'care: static clinic': 'Care: Static Clinic',
      '1. care: static clinic': 'Care: Static Clinic',
      'care: outreach, mobile clinic, community-based, delivery': 'Care: Outreach, Mobile Clinic, Community-based Delivery',
      '2. care: outreach, mobile clinic, community-based, delivery': 'Care: Outreach, Mobile Clinic, Community-based Delivery',
      'care: outreach, mobile clinic': 'Care: Outreach, Mobile Clinic, Community-based Delivery',
      'care: other services, enabled or referred (associated clinics)': 'Care: Other Services, Enabled or Referred',
      '3. care: other services, enabled or referred (associated clinics)': 'Care: Other Services, Enabled or Referred',
      'care: other services': 'Care: Other Services, Enabled or Referred',
      'care: social marketing services': 'Care: Social Marketing Services',
      '4. care: social marketing services': 'Care: Social Marketing Services',
      'care: social marketing': 'Care: Social Marketing Services',
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
      '10. knowledge, research, evidence, innovation, and publishing, including peer-review articles': 'Knowledge, Research, Evidence, Innovation',
      'knowledge, research, evidence': 'Knowledge, Research, Evidence, Innovation',
      '11. internal ma infrastructure, organisational development, capacity development, values, processes, and procedures': 'Internal MA Infrastructure',
      'internal ma infrastructure': 'Internal MA Infrastructure',
      'project focus area': 'Project Focus Area',
      'expense budget (per focus area)': 'Expense Budget (per Focus Area)',
      // Section 4 & 5
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
      'ippf core': 'IPPF Core',
      // Section 6
      'restricted': 'Restricted (Income)',
      'unrestricted': 'Unrestricted (Income)',
      'deficit / surplus': 'Deficit / Surplus',
      'locally generated income': 'Locally Generated Income',
      'international income (non-ippf)': 'International Income (Non-IPPF)',
      'ippf income': 'IPPF Income',
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
    };

    // Index glossary by exact name (lower-cased)
    GLOSSARY.forEach(function(term) {
      glossaryLookup[term.name.toLowerCase()] = term;
    });
    // Add aliases
    Object.keys(labelAliases).forEach(function(alias) {
      var termName = labelAliases[alias];
      var term = glossaryLookup[termName.toLowerCase()];
      if (term) {
        glossaryLookup[alias] = term;
      }
    });
  })();

  function findGlossaryMatch(labelText) {
    var clean = labelText.replace(/\s+/g, ' ').trim().toLowerCase();
    // Remove trailing asterisks, colons
    clean = clean.replace(/[\*:]+$/, '').trim();
    // Remove leading numbers like "1. ", "2. "
    var withoutNum = clean.replace(/^\d+\.\s*/, '');

    // Direct match
    if (glossaryLookup[clean]) return glossaryLookup[clean];
    if (glossaryLookup[withoutNum]) return glossaryLookup[withoutNum];

    // Partial match: check if any glossary key starts with or is contained in the label
    var keys = Object.keys(glossaryLookup);
    for (var i = 0; i < keys.length; i++) {
      if (clean.indexOf(keys[i]) === 0 || keys[i].indexOf(clean) === 0) {
        return glossaryLookup[keys[i]];
      }
    }
    // Try without number prefix
    for (var j = 0; j < keys.length; j++) {
      if (withoutNum.indexOf(keys[j]) === 0 || keys[j].indexOf(withoutNum) === 0) {
        return glossaryLookup[keys[j]];
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

    // Set content
    tt.querySelector('.tooltip-term').textContent = termName;
    tt.querySelector('.tooltip-def').textContent = termDef;

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

  function injectFieldHelpIcons() {
    // Process all labels, h3/h4 section headers, and focus area spans in tables
    var selectors = '.form-group label, .form-row label, .box-from-inner label, .top-detail-form label, .accordion-body h3, .accordion-body h4, .cont-wrap-inner label, td > span[id^="projectArea"], td > span[data-i18n*="focus_area"], td > span[id$="-area"]';
    var labels = document.querySelectorAll(selectors);

    labels.forEach(function(label) {
      if (processedLabels.has(label)) return;

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
