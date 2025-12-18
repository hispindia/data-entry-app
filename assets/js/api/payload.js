const trackedEntitPayload = ({orgUnit, program, programStage, formattedDate, formattedAttributes, formattedDataElements}) => {
    return  {
    trackedEntities: [
    {
        orgUnit: orgUnit,
        trackedEntityType:"jmv5aktKbQh",
        enrollments: [
            {
                attributes: formattedAttributes,
                enrolledAt: formattedDate,
                occurredAt: formattedDate,
                orgUnit: orgUnit,
                program: program,
                status: "ACTIVE",
                trackedEntityType: "jmv5aktKbQh",
                events: [
                    {
                        dataValues: formattedDataElements,
                        enrollmentStatus: "ACTIVE",
                        occurredAt: formattedDate,
                        orgUnit: orgUnit,
                        program: program,
                        programStage: programStage,
                        status: "ACTIVE"
                    }
                ], 
            }
        ],
    },
  ]};
}

export const pushPayloadInDhis2 = (tei, orgUnit, program, programStage) => {
    const date = new Date();
    const formattedDate = date.toISOString().split("T")[0];

    const formattedAttributes = [];
    for(const attributesId of tei.attributes){
        formattedAttributes.push({
            attribute: attributesId,
            value: document.getElementById(attributesId)?.value || ""
        })
    }

    const formattedDataElements = [];
    for(const dataElementsId of tei.programStage){
        formattedDataElements.push({
            dataElement: dataElementsId,
            value: document.getElementById(dataElementsId)?.value || ""
        })
    }
  return trackedEntitPayload({orgUnit: orgUnit, program, programStage, formattedDate, formattedAttributes, formattedDataElements})
}

export const createPayload = {
    orgUnit: (orgUnits, attributes) => {
        const data = {};
        attributes.forEach(attr => data[attr.attribute] = attr.value);
        const orgUnit = orgUnits.find(orgUnit => orgUnit.code == data['LZacnHsQJRs']);
        return {
            "organisationUnits": [
                {
                "name": `${data.UkQI1dWzZOv}`,
                "shortName": `${data.UULMD0pa4wK}`,
                "openingDate": new Date().toISOString().split('T')[0],
                "level": `3`,
                "parent": {
                    "id": `${orgUnit.id}`
                }
                }
            ]
        }
    },
    program: (orgUnit, program) => {
        return {
            "programs": [
                {
                "id": `${program}`,
                "organisationUnits": [
                    { "id": `${orgUnit}` }
                ]
                }
            ]
        }
    },
    
    modifyEvent: (trackedEntity, orgUnit, program, programStage, affiliateKeyStage) => {
        const date = new Date();
        const formattedDate = date.toISOString().split("T")[0];
debugger;
        const formattedAttributes = [];
        for(const attribute of trackedEntity.attributes){
            formattedAttributes.push({
                attribute: attribute.attribute,
                value: attribute.value,
            })
        }

        var formattedDataElements = [];
        const requiredStage = trackedEntity.enrollments.find(enrollment => enrollment.events.some(event=> event.programStage == affiliateKeyStage))
        if(requiredStage) {
           formattedDataElements = requiredStage.events[0].dataValues
        }
        return trackedEntitPayload({orgUnit: orgUnit, program, programStage, formattedDate, formattedAttributes, formattedDataElements})
    }

}