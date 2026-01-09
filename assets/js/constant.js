export const optionSet = {
    region: "UfIiapX3oeJ",
    country: "mLGObVVt5ov",
}

export const programStage = {
    affiliateKyc: "pHiRWkSg9Wx",
    dueDiligence: "wXlXBPIThiD",
    UINControlMaster: "HsKUiY7RyeO",
}
export const userGroup = {
    disabledAOCGroup : "jrCxIJzq4eE",
    disabledIPPFAdmin : "rhii1gmT3vo",
    disabledKyc: "CNG5iylPUoo"
}
export const programs = {
    affiliateKyc: "GJbgrJjzCrr",
    UINControlMaster: "w6sqrDv2VK8",
}

export const orgUnit = {
    id: "Eo4s43hL1Vi"
}

export const attributes = {
    acuityCheck: "IzbdGgEgQ3T",
    countryRegistration: "LZacnHsQJRs",
    region: "SMdW6ZnGllA",
    legalName: "UkQI1dWzZOv",
    uinCode: "qZcVhl6kfpc" 
};

export const tei = {
    affiliate: '',
    attributes: [],
    programStages: [],
    mandatoryList: [],
    programRules: [],
    metadata: {},
    values: {},
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
    submitKYC: 'twLRopHhF2Q',
    affiliateKYCOther: [{
        id: 'AffiliationOther',
        name: 'Affiliation',
        hidden: false,
        items: [{
            code: 'gDI26Sq88pk',
            name: 'Affiliation Type',
            hidden: false,
            mandatory: true,
            disabled: false,
            optionSetValue: true,
            valueType: "TEXT",
            valueSet:[
                    {
                        label: "Full Member",
                        value: "Full Member",
                    },
                    {
                        label: "AM1/2",
                        value: "Associate Member 1 / Associate Member 2",
                    },
                    {
                        label: "CP",
                        value: "Collaborative Partner",
                    },
                    {
                        label: "International CP",
                        value: "International Collaborative Partner",
                    },
                    {
                        label: "Project Level Partner",
                        value: "Project Level Partner",
                    }
                ]
        }, {
            code: 'qg4tyJoHEiS',
            name: 'Affiliation Status',
            hidden: false,
            mandatory: true,
            disabled: false,
            optionSetValue: true,
            valueType: "TEXT",
            valueSet: [
                    {
                        label: "Active",
                        value: "Active",
                    },
                    {
                        label: "Financial Suspension",
                        value: "Financial Suspension",
                    },
                    {
                        label: "Suspended",
                        value: "Membership Suspension",
                    },
                    {
                        label: "Expelled",
                        value: "Expelled",
                    },
                    {
                        label: "Resigned/Left",
                        value: "Resigned/Left",
                    },
                    {
                        label: "Dissoved/Closed",
                        value: "Dissoved/Closed",
                    }
                ] 
        }]
    }]
}
