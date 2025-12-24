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
};

export const tei = {
    affiliate: '',
    affiliates: [],
    attributes: [],
    programStage: [],
    orgUnits: [],
    mandatoryList: [],
}

export const dataElements = {
    affiliateKYCOther: [{
        name: 'Affiliation',
        dataElements: [{
            id: 'gDI26Sq88pk',
            formName: 'Affiliation Type',
            optionSetValue: true,
            compulsory: true,
            valueType: "TEXT",
            optionSet: {
                options: [
                    {
                        code: "Full Member",
                        name: "Full Member",
                    },
                    {
                        code: "AM1/2",
                        name: "Associate Member 1 / Associate Member 2",
                    },
                    {
                        code: "CP",
                        name: "Collaborative Partner",
                    },
                    {
                        code: "International CP",
                        name: "International Collaborative Partner",
                    },
                    {
                        code: "Project Level Partner",
                        name: "Project Level Partner",
                    }
                ]
            }
        }, {
            id: 'qg4tyJoHEiS',
            formName: 'Affiliation Status',
            optionSetValue: true,
            compulsory: true,
            valueType: "TEXT",
            optionSet: {
                options: [
                    {
                        code: "Active",
                        name: "Active",
                    },
                    {
                        code: "Financial Suspension",
                        name: "Financial Suspension",
                    },
                    {
                        code: "Suspended",
                        name: "Membership Suspension",
                    },
                    {
                        code: "Expelled",
                        name: "Expelled",
                    },
                    {
                        code: "Resigned/Left",
                        name: "Resigned/Left",
                    },
                    {
                        code: "Dissoved/Closed",
                        name: "Dissoved/Closed",
                    }
                ]
            },  
        }]
    }]
}




