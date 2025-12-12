
export const pushPayloadInDhis2 = (tei, orgUnit, programs, programStage) => {
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

 const trackedEntity = {
    trackedEntities: [
    {
        orgUnit: orgUnit.id,
        trackedEntityType:"jmv5aktKbQh",
        enrollments: [
            {
                attributes: formattedAttributes,
                enrolledAt: formattedDate,
                occurredAt: formattedDate,
                orgUnit: orgUnit.id,
                program: programs.affiliateKyc,
                status: "ACTIVE",
                trackedEntityType: "jmv5aktKbQh",
                events: [
                    {
                        dataValues: formattedDataElements,
                        enrollmentStatus: "ACTIVE",
                        occurredAt: formattedDate,
                        orgUnit: orgUnit.id,
                        program: programs.affiliateKyc,
                        programStage: programStage.affiliateKyc,
                        status: "ACTIVE"
                    }
                ], 
            }
        ],
    },
  ]};

  return trackedEntity;
}

