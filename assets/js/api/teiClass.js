
export const create = {
    attr:(attributes) => {
        const formattedAttributes = [];
        for(const attribute of attributes){
            formattedAttributes.push({
                attribute: attribute.attribute,
                value: attribute.value,
            })
        }
        return formattedAttributes;
    },
    stage: ({enrollmentStatus, formattedDate, orgUnit, program, stage, status}) => {
        return {
            dataValues: stage.dataElement,
            enrollmentStatus: enrollmentStatus,
            occurredAt: formattedDate,
            orgUnit: orgUnit,
            program: program,
            programStage: stage.programStage,
            status: status
        }
    }
}