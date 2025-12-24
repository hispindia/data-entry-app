import { attributes } from "../constant.js";

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

const  eventPayload = ({orgUnit, enrollment, program, programStage, formattedDate, trackedEntity, formattedDataElements}) => {
    return { events: [{
                dataValues: formattedDataElements,
                occurredAt: formattedDate,
                enrollment,
                orgUnit,
                program,
                programStage,
                trackedEntity,
                status: "COMPLETED"

            }]
        }
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

    formattedAttributes.push({
    attribute: attributes.acuityCheck,   
    value: "In Progress"
    });


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
    orgUnit: (parentOU, attributes, code) => {
        const data = {};
        attributes.forEach(attr => data[attr.attribute] = attr.value);
        return {
            "organisationUnits": [
                {
                "name": `${data.UkQI1dWzZOv}`,
                "shortName": `${code}`,
                "code": `${code}`,
                "openingDate": new Date().toISOString().split('T')[0],
                "level": `3`,
                "parent": {
                    "id": `${parentOU}`
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
    },
    event: (tei, orgUnit, enrollment, trackedEntity, program, programStage) => {
        const date = new Date();
        const formattedDate = date.toISOString().split("T")[0];

        const formattedDataElements = [];
        for(const dataElementsId of tei.programStage){
            formattedDataElements.push({
                dataElement: dataElementsId,
                value: document.getElementById(dataElementsId)?.value || ""
            })
        }
        return eventPayload({orgUnit: orgUnit, program, programStage, formattedDate, trackedEntity, enrollment, formattedDataElements})
    }

}