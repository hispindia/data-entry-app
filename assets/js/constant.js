export const optionSet = {
    region: "UfIiapX3oeJ",
    country: "mLGObVVt5ov",
}

export const programRules = {
    hideCountry: {
        AR: "WON4mqPhGFG",
        ACR: "p9U78W1Hxi6",
        AWR: "QRgl825LhWc",
        EN: "wz9YiB0MhhR",
        ESEAOR: "fFQ9bQeowpb",
        SAR: "kSkOdweNyI2",
    }
}

export const trackedEntityType = "jmv5aktKbQh";

export const stageMapping = {
    pHiRWkSg9Wx: "HsKUiY7RyeO",
    wXlXBPIThiD: "jKxGLMkHnHy",
}

export const programStage = {
    affiliateKyc: "pHiRWkSg9Wx",
    dueDiligence: "wXlXBPIThiD",
    completionCheckList: "jKxGLMkHnHy",
    UINControlMaster: "HsKUiY7RyeO",
    acuityWaiver: "BpE6W2xgKXn",
    acuityStatusAndReport: "Dfxzc7dflN8"
}
export const programSection = {
    ChairPerson: "lCt44LGWvKj",
    viceChairperson: "l7hrKT6IQjN",
    Secretary: "d1GO05tFP5I",
    Treasurer: "ecLjek09RjK",
    Youth: "X49FNxQxAhQ",
    seniorManagement: "gg4cEgWHPvz", 
    seniorManagementFinance: "dkybztKm1Kr",
    seniorManagementPrograms: "Vww9954RV4Z", 
    bank: "L0jPilLQIns", 
}
export const userGroup = {
    disabledAOCGroup : "jrCxIJzq4eE",
    disabledIPPFAdmin : "rhii1gmT3vo",
    disabledKyc: "CNG5iylPUoo",
    diableTpo: "WBjDNaB9gS6",
    waiver: "qh0ixp80Gim"
}
export const programs = {
    affiliateKyc: "GJbgrJjzCrr",
    UINControlMaster: "w6sqrDv2VK8",
}

export const orgUnit = {
    id: "Eo4s43hL1Vi",
    affiliateKYC: "iR2btIxN87s"
}

export const attributes = {
    acuityCheck: "IzbdGgEgQ3T",
    countryRegistration: "LZacnHsQJRs",
    legalName: "UkQI1dWzZOv",
    region: "SMdW6ZnGllA",
    registrationNum: "qsASQ0NRTVA",
    submitted: "JHlOG80ijsg",
    user: "x1rcjWtOtI5",
    uinCode: "qZcVhl6kfpc",
    uinCodeAffiliate: "pkLdNynZWat",
    RegisteredAddress: "o1vN3K6W1P4",
    contactEmail: "IxhtGezsfWH",
    organisationType: "U7L75bi4oNF",
    dhis2CodeVerified: "ATmUT1JYobI",
    syncUINAttribute: "QikmXaoT3Vf"
};

export const users = {
    superUser: "yrB6vc5Ip3r",
    adminUser: "rhii1gmT3vo"
}

export const tei = {
    affiliate: '',
    attributes: [],
    attributeSection: [],
    disabled: false,
    dataElements:[],
    stageSection: [],
    mandatoryList: [],
    programRules: [],
    metadata: {},
    fileType: [],
    values: {},
    acuityList: [],
    dataElementcode:[],
}

export const PROGRAM_RULE_TYPES = {
  ASSIGN: 'ASSIGN',
  HIDEFIELD: 'HIDEFIELD',
  HIDESECTION: 'HIDESECTION',
  HIDEOPTIONGROUP: 'HIDEOPTIONGROUP',
  SETMANDATORYFIELD: 'SETMANDATORYFIELD',
  SHOWERROR: 'SHOWERROR',
  SHOWWARNING: 'SHOWWARNING',
}


export const dataElements = {
    affiliationStatus: 'qg4tyJoHEiS',
    uploadAccuity: 'R6nujxC6zLD',

    //affiliate Info 
    registeredAddress: "b6BcgDUCFog",
    countryIncomeStatus: "uA6aKCAdLYK",
    oecdDACEligible: "fxr7wKpqhtO",
    affiliationType: "gDI26Sq88pk",


    // Board Members
    chairPersonName: 'daG91uRV8pi', 
    chairPersonEmail: 'g4NwCcUEd9l', 
    chairPersonPhone: 'YArm5tnUuT7', 
    chairPersonNationality: 'FisnLiX71jG', 
    chairPersonDob: 'ZzXwEKd7s6b', 
    chairPersonIdNumber: 'DhSKMFMRH84', 

    viceChairPersonName: 'uT1NdSet4eo', 
    viceChairPersonEmail: 'IXu4ddpiYNs', 
    viceChairPersonPhone: 'D0fTmsUmrKR', 
    viceChairPersonNationality: 'gmCNhtm5PgH', 
    viceChairPersonDob: 'Xq5fIRzEb5K', 
    viceChairPersonIdNumber: 'LGaOnTyfRJ2', 

    secretaryName: "DMJOfwrOwo8", 
    secretaryEmail: "r5AFjCZh7NG", 
    secretaryPhone: "zIpXuDpL1Sf", 
    secretaryNationality: "F33Zmt6KMAE",
    secretaryDob: "gyvjaCqILkw", 
    secretaryIdNumber: "kezRO5k8bYy", 

    treasurerName: "fKFIKK33FRc", 
    treasurerEmail: "svxvNSIY1Lx", 
    treasurerPhone: "TGbkPE00NDD", 
    tressurerNationality: "C7eZyNAJgu2", 
    treasurerDob: "go3NkopSFOE", 
    treasurerIdNumber: "ZqxEuYK8vUB", 

    youthName: "xCJOBTvagP9", 
    youthEmail: "NWijMwHpgfl", 
    youthPhone: "ezGbAw31sJm", 
    youthNationality: "RXJVSBN4LJb",
    youthDob: "s1rGnBoGlAx",
    youthIdNumber: "NHoDQ5DC1jY",

    // Senior Management
    seniorManagementCEOName: "RA5zVHd7pVO", 
    seniorManagementCEOEmail: "rmEopjZaUfq", 
    seniorManagementCEOPhone: "jsOWlru7Csr", 
    seniorManagementCEONationality: "sRFwuhoFONa", 
    seniorManagementCEODob: "ehBoygsLFmB", 
    seniorManagementCEOIdNumber: "VWdVRyHFlBh",

    seniorManagementDirectorFinanceName: "glFVJpRaGWK", 
    seniorManagementDirectorFinanceEmail: "oRmRvZcwYLC", 
    seniorManagementDirectorFinancePhone: "w9fZHZNLW3J", 
    seniorManagementDirectorFinanceNationality: "RUqcSMnw7r6", 
    seniorManagementDirectorFinanceDob: "LtXqGVt0PXf", 
    seniorManagementDirectorFinanceIdNumber: "vcR9TS21A05",

    SeniorManagementDirectorProgramsName: "U4OSVfrlPxQ",
    SeniorManagementDirectorProgramsEmail: "rhzghQt2OIU",
    SeniorManagementDirectorProgramsPhone: "PVXFxbYUBO7",
    SeniorManagementDirectorProgramsNationality: "RK3IfIKl3CP",
    SeniorManagementDirectorProgramsDob: "eQQToiCD7Zm",
    SeniorManagementDirectorProgramsIdNumber: "A46ZGJLezyc",
    
    bankName: "cvI0Tq2uPjC", 
    bankAddress: "HTnwbE6NjXT", 
    bankTelephone: "v3iHRfxpOlB",
    bankAccountNumber: 'zB27tS5QtT0', 
    bankAccountCurrency: "TbN2rRfJxGs",
    bankSwift: "ACstTNRg27W",
    bankIBAN: "z7sYWdtwtZo",
    
    presidentAcuityStatus: "wDAC1CBloZz",
    viceChairPersonAcuityStatus: "jAM5Uh3AmLc",
    secretaryAcuityStatus: "MfucTwTQdL6",
    treasurerAcuityStatus: "c4H6jRfajui",
    youthAcuityStatus: "CXbQSkU2175",
    seniorManagementCEOAcuityStatus: "Y50Blcjw8r0",
    seniorManagementFinanceAcuityStatus: "PIIp2bOIoit",
    seniorManagementProgramsAcuityStatus: "EGNNQjCgf4m",
    bankAcuityStatus: "Mm19QhgeESl",

    paymentFileFormatBa1: "VPHBgGSnGLB",
    paymentFileFormatBa2: "oKam29mQNka",
    paymentFileFormatBa3: "wka3cIbbtHY",

    rejectBankReason: "QDEpw3i2Kqq",
    disclaimer: "ouTRvlYja1r"

}

export const ROLE_ACUITY_DE = {
  chairperson: dataElements.presidentAcuityStatus,
  viceChairperson: dataElements.viceChairPersonAcuityStatus,
  secretary: dataElements.secretaryAcuityStatus,
  treasurer: dataElements.treasurerAcuityStatus,
  youth: dataElements.youthAcuityStatus,
  seniorManagementCEO: dataElements.seniorManagementCEOAcuityStatus,
  seniorManagementFinance: dataElements.seniorManagementFinanceAcuityStatus,
  seniorManagementPrograms: dataElements.seniorManagementProgramsAcuityStatus,
  bank: dataElements.bankAcuityStatus
}

export const stageSections = {
    documentChecklist: "PY8SB39CqLY",
    documents: "ums0sWZ9bTF"
}
