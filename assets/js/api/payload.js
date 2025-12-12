
export const pushPayloadInDhis2 = async(tei, orgUnit, programs, programStage) => {
    const date = new Date();
    const formattedDate = date.toISOString().split("T")[0];


    const formattedAttributes = [];
    for(const attributesId of tei.attributes){
        formattedAttributes.push({
            attrbutesId: attributesId,
            value: document.getElementById(attributesId)?.value || ""
        })
    }

    const formattedDataElements = [];
    for(const dataElementsId of tei.programStage){
        formattedDataElements.push({
            dataElementsId: dataElementsId,
            value: document.getElementById(dataElementsId)?.value || ""
        })
    }

 const trackedEntity = [
    {
        orgUnit: orgUnit.name,
        trackedEntityType:"jmv5aktKbQh",
        enrollment: [
            {
                attributes: formattedAttributes,
                enrolledAt: formattedDate,
                events: [
                    {
                        dataValues: formattedDataElements,
                        enrollmentStatus: "ACTIVE",
                        occurredAt: formattedDate,
                        orgUnit: orgUnit.name,
                        program: programs.affiliateKyc,
                        programStage: programStage.affiliateKyc,
                        status: "ACTIVE"
                    }
                ],
                    occurredAt: formattedDate,
                    orgUnit: orgUnit.name,
                    program: programs.affiliateKyc,
                    status: "ACTIVE",
                    trackedEntityType: "jmv5aktKbQh"    
            }
        ],
    },
  ]
  
   console.log('---', trackedEntity); 
}

