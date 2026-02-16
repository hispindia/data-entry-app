import { stageMapping, trackedEntityType } from "../constant.js";

export const createPayload = {
    orgUnit: (parentOU, attributes, code) => {
        const data = {};
        attributes.forEach(attr => data[attr.attribute] = attr.value);
        return {
            "organisationUnits": [{
                "name": `${data.UkQI1dWzZOv}`,
                "shortName": `${code}`,
                "code": `${code}`,
                "openingDate": new Date().toISOString().split('T')[0],
                "level": `3`,
                "parent": {
                    "id": `${parentOU}`
                }
            }]
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
    newEnroll: ({tei, orgUnit, program, programStage, trackedEntity, enrollment, event, eventStatus}) => {
            const date = new Date();
            const formattedDate = date.toISOString().split("T")[0];

            const formattedAttributes = [];
            tei.attributes.forEach(attribute => {
                formattedAttributes.push({
                    attribute: attribute,
                    value: tei.values[attribute] || ""
                })
            })

            const formattedDataElements = [];
            tei.dataElements.forEach(dataElement => {
                formattedDataElements.push({
                    dataElement: dataElement,
                    value: tei.values[dataElement] || ""
                })
            })
            const trackedEntityInstance = {
                ...(trackedEntity && { trackedEntity }),
                orgUnit: orgUnit,
                trackedEntityType:trackedEntityType,
                enrollments: [
                    {
                        ...(enrollment && { enrollment }),
                        attributes: formattedAttributes,
                        enrolledAt: formattedDate,
                        occurredAt: formattedDate,
                        orgUnit: orgUnit,
                        program: program,
                        status: 'ACTIVE',
                        trackedEntityType: trackedEntityType,
                        events: [
                            {
                                ...(event && { event }),
                                dataValues: formattedDataElements,
                                enrollmentStatus: 'ACTIVE',
                                occurredAt: formattedDate,
                                orgUnit: orgUnit,
                                program: program,
                                programStage: programStage,
                                status: eventStatus ? eventStatus: 'ACTIVE'
                            }
                        ], 
                    }
                ],
            }
    
        return { trackedEntities: [trackedEntityInstance]} 
    },
    event: (tei, orgUnit, enrollment, program, programStage) => {
        const date = new Date();
        const formattedDate = date.toISOString();

        const formattedDataElements = [];
        tei.dataElements.forEach(dataElement => {
            formattedDataElements.push({
                dataElement: dataElement,
                value: tei.values[dataElement] || ""
            })
        })
        return {
            events:[{
                dataValues: formattedDataElements,
                occurredAt: formattedDate,
                enrollment,
                orgUnit,
                program,
                programStage,
                trackedEntity: tei.affiliate.trackedEntity,
                status: "ACTIVE"
            }]
        }
    },
    exchangeEvent: (dataValues, orgUnit, program, attributes, UINStages) => {
        const date = new Date();
        const formattedDate = date.toISOString().split("T")[0];

        const formattedAttributes = [];
        attributes.forEach(attribute => {
            if(dataValues[attribute]) {
                formattedAttributes.push({
                    attribute: attribute,
                    value: dataValues[attribute],
                })
            }
        })
        var stages = {};
        UINStages.forEach(stage => {
            stages[stage.id] = {
                dataValues: stage.dataElements.map(element => ({dataElement: element, value: dataValues[element] || ""})),
                enrollmentStatus: 'ACTIVE',
                occurredAt: formattedDate,
                orgUnit: orgUnit,
                program: program,
                programStage: stage.id,
                status: 'ACTIVE'
            }
        })

        var events = [];
        for(let stage in stages) {
            events.push(stages[stage]);
        }
          const tei = {
                orgUnit: orgUnit,
                trackedEntityType:trackedEntityType,
                enrollments: [
                    {
                        attributes: formattedAttributes,
                        enrolledAt: formattedDate,
                        occurredAt: formattedDate,
                        orgUnit: orgUnit,
                        program: program,
                        status: 'ACTIVE',
                        trackedEntityType: trackedEntityType,
                        events
                    }
                ],
            }
    
        return { trackedEntities: [tei]} 
    },
}