export const optionSet = {
    region: "UfIiapX3oeJ",
    country: "mLGObVVt5ov",
}

export const programStage = {
    affiliateKyc: "pHiRWkSg9Wx",
    dueDiligence: "wXlXBPIThiD",
    UINControlMaster: "HsKUiY7RyeO",
}

export const programs = {
    affiliateKyc: "GJbgrJjzCrr",
    UINControlMaster: "w6sqrDv2VK8",
}

export const orgUnit = {
    id: "iR2btIxN87s"
}

export const attributes = {
    acuityCheck: "IzbdGgEgQ3T",
    countryRegistration: "LZacnHsQJRs",
    region: "SMdW6ZnGllA",
    legalName: "UkQI1dWzZOv"
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
            optionSet: {
                options: [
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
            }
        }, {
            code: 'qg4tyJoHEiS',
            name: 'Affiliation Status',
            hidden: false,
            mandatory: true,
            disabled: false,
            optionSetValue: true,
            valueType: "TEXT",
            optionSet: {
                options: [
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
            },  
        }]
    }]
}




