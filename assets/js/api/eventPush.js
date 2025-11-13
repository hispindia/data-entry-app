// function eventPushBPtoAU(trackedentityinstance) {
//     var eventIds ={
//         projectBudget: {},
//         projectFA: {},
//         projectEC: {},
        
//         auProjectBudget: {},
//         auProjectFA: {},
//         auProjectEC: {},
//     };
//     const filteredPrograms = trackedentityinstance.enrollments.filter(
//         (enroll) =>
//             enroll.program == program.organisationDetails ||
//             enroll.program == program.projectDescription ||
//             enroll.program == program.projectBudget ||
//             enroll.program == program.projectFocusArea ||
//             enroll.program == program.projectExpenseCategory
//     );

//     const auFilteredPrograms = trackedentityinstance.enrollments.filter(
//         (enroll) =>
//             enroll.program == program.auOrganisationDetails ||
//             enroll.program == program.auProjectDescription ||
//             enroll.program == program.auProjectBudget ||
//             enroll.program == program.auProjectFocusArea ||
//             enroll.program == program.auProjectExpenseCategory
//     );

//     const dataValuesPD = getEvents(
//         filteredPrograms,
//         program.auProjectDescription,
//         dataElements.perorganizationalDataiod.id
//     );

//     const dataValuesPB = getEvents(
//         filteredPrograms,
//         program.auProjectBudget,
//         dataElements.year.id
//     );
//     const dataValuesFA = getEvents(
//         filteredPrograms,
//         program.auProjectFocusArea,
//         dataElements.year.id
//     );
//     const dataValuesEC = getEvents(
//         filteredPrograms,
//         program.auProjectExpenseCategory,
//         dataElements.year.id
//     );


//     const auDataValuesPD = getEvents(
//         auFilteredPrograms,
//         program.auProjectDescription,
//         dataElements.perorganizationalDataiod.id
//     );
//     const auDataValuesPB = getEvents(
//         auFilteredPrograms,
//         program.auProjectBudget,
//         dataElements.year.id
//     );
//     const auDataValuesFA = getEvents(
//         auFilteredPrograms,
//         program.auProjectFocusArea,
//         dataElements.year.id
//     );
//     const auDataValuesEC = getEvents(
//         auFilteredPrograms,
//         program.auProjectExpenseCategory,
//         dataElements.year.id
//     );

//     for (let year = tei.year.start; year <= tei.year.end; year++) {
//         if (dataValuesPB[year]) {
//             eventIds['projectBudget'][year] = dataValuesPB[year]['event'];
//         }
//         if (dataValuesFA[year]) {
//             eventIds["projectFA"][year] = dataValuesFA[year]["event"];
//         }
//         if (dataValuesEC[year]) {
//             eventIds["projectEC"][year] = dataValuesEC[year]["event"];
//         }
        
//         //Annual Update
//         if (auDataValuesPB[year]) {
//             eventIds['auProjectBudget'][year] = auDataValuesPB[year]['event'];
//         }
//         if (auDataValuesFA[year]) {
//             eventIds["auProjectFA"][year] = auDataValuesFA[year]["event"];
//         }
//         if (auDataValuesEC[year]) {
//             eventIds["auProjectEC"][year] = auDataValuesEC[year]["event"];
//         }
//     }

//     const organizationalData = trackedentityinstance.enrollments.filter((enroll) => enroll.program == program.organisationDetails);
//     if(organizationalData.length)
//     {
//         organizationalData[0].events.forEach(event => {
//             let payload = 
//             {
//                 program: program.auOrganisationDetails,
//                 orgUnit: event.orgUnit,
//                 trackedEntityInstance: event.trackedEntityInstance,
//                 eventDate:formatDate(new Date()),
//                 status:'ACTIVE',
//                 dataValues: event.dataValues,
//             }
//             if(event.programStage=='WCRytcUeLfD') {
//                 payload['programStage'] = programStage.auMembershipDetails
//             } else  if(event.programStage=='UzfHCTIm3AF') {
//                 payload['programStage'] = programStage.auKeyDetails
//             }else  if(event.programStage=='F0S4g5slsEC') {
//                 payload['programStage'] = programStage.auNarrativePlan
//             }
//         transferEvent(payload)
//     })
// }
//     const projectBudget = trackedentityinstance.enrollments.filter((enroll) => enroll.program == program.projectBudget);
//     if(projectBudget.length) projectBudget[0].events.forEach(event => {
//         transferEvent({
//             program: program.auProjectBudget,
//             programStage: programStage.auProjectBudget,
//             orgUnit: event.orgUnit,
//             trackedEntityInstance: event.trackedEntityInstance,
//             eventDate:formatDate(new Date()),
//             status:'ACTIVE',
//             dataValues: event.dataValues,
//         })
//     })
//     const projectDescription = trackedentityinstance.enrollments.filter((enroll) => enroll.program == program.projectDescription);
//     if(projectDescription.length)projectDescription[0].events.forEach(event => {
//         transferEvent({
//             program: program.auProjectDescription,
//             programStage: programStage.auProjectDescription,
//             orgUnit: event.orgUnit,
//             trackedEntityInstance: event.trackedEntityInstance,
//             eventDate:formatDate(new Date()),
//             status:'ACTIVE',
//             dataValues: event.dataValues,
//         })
//     })

//     // const projectFocusArea1 = trackedentityinstance.enrollments.filter((enroll) => enroll.program == program.projectFocusArea1);
//     // if(projectFocusArea1.length)projectFocusArea1[0].events.forEach(event => {
//     //     transferEvent({
//     //         program: program.auProjectFocusArea1,
//     //         programStage: programStage.auProjectFocusArea1,
//     //         orgUnit: event.orgUnit,
//     //         trackedEntityInstance: event.trackedEntityInstance,
//     //         eventDate:formatDate(new Date()),
//     //         status:'ACTIVE',
//     //         dataValues: event.dataValues,
//     //     })
//     // })

//     // const projectFocusArea2 = trackedentityinstance.enrollments.filter((enroll) => enroll.program == program.projectFocusArea2);
//     // if(projectFocusArea2.length)projectFocusArea2[0].events.forEach(event => {
//     //     transferEvent({
//     //         program: program.auProjectFocusArea2,
//     //         programStage: programStage.auProjectFocusArea2,
//     //         orgUnit: event.orgUnit,
//     //         trackedEntityInstance: event.trackedEntityInstance,
//     //         eventDate:formatDate(new Date()),
//     //         status:'ACTIVE',
//     //         dataValues: event.dataValues,
//     //     })
//     // })

//     const projectExpenseCategory = trackedentityinstance.enrollments.filter((enroll) => enroll.program == program.projectExpenseCategory);
//     if(projectExpenseCategory.length)projectExpenseCategory[0].events.forEach(event => {
//         transferEvent({
//             program: program.auProjectExpenseCategory,
//             programStage: programStage.auProjectExpenseCategory,
//             orgUnit: event.orgUnit,
//             trackedEntityInstance: event.trackedEntityInstance,
//             eventDate:formatDate(new Date()),
//             status:'ACTIVE',
//             dataValues: event.dataValues,
//         })
//     })

//     // const projectFocusArea = trackedentityinstance.enrollments.filter((enroll) => enroll.program == program.projectFocusArea);
//     // if(projectFocusArea.length)projectFocusArea[0].events.forEach(event => {
//     //     transferEvent({
//     //         program: program.auProjectFocusArea,
//     //         programStage: programStage.auProjectFocusArea,
//     //         orgUnit: event.orgUnit,
//     //         trackedEntityInstance: event.trackedEntityInstance,
//     //         eventDate:formatDate(new Date()),
//     //         status:'ACTIVE',
//     //         dataValues: event.dataValues,
//     //     })
//     // })

//     const incomeDetails = trackedentityinstance.enrollments.filter((enroll) => enroll.program == program.incomeDetails);
//     if(incomeDetails.length)
//     {
//         incomeDetails[0].events.forEach(event => {
//             let payload = 
//             {
//                 program: program.auIncomeDetails,
//                 orgUnit: event.orgUnit,
//                 trackedEntityInstance: event.trackedEntityInstance,
//                 eventDate:formatDate(new Date()),
//                 status:'ACTIVE',
//                 dataValues: event.dataValues,
//             }
//             if(event.programStage=='jOWGLmqgh3Q') {
//                 payload['programStage'] = programStage.auTotalIncome
//             } else  if(event.programStage=='glOZHvhoUns') {
//                 payload['programStage'] = programStage.auIncomeByDonor
//             }else  if(event.programStage=='Bp1qxeFLXZI') {
//                 payload['programStage'] = programStage.auValueAddCoreFunding
//             }
//         transferEvent(payload)
//     })
// }
//     alert('Programs moved to Annual Update Project.')
// }

// function eventPushBPtoAU(trackedentityinstance) {
  
//     const projectFocusArea = trackedentityinstance.enrollments.filter((enroll) => enroll.program == program.projectFocusArea);
//     if(projectFocusArea.length)projectFocusArea[0].events.forEach(event => {
//         transferEvent({
//             program: program.auProjectFocusArea,
//             programStage: programStage.auProjectFocusArea,
//             orgUnit: event.orgUnit,
//             trackedEntityInstance: event.trackedEntityInstance,
//             eventDate:formatDate(new Date()),
//             status:'ACTIVE',
//             dataValues: event.dataValues,
//         })
//     })
//     alert('Programs moved to Annual Update Project.')
// }

// all at once.
function eventPushBPtoAU(trackedentityinstance) {
    const organizationalData = trackedentityinstance.enrollments.filter((enroll) => enroll.program == program.organisationDetails);
    if(organizationalData.length)
    {
        organizationalData[0].events.forEach(event => {
            let payload = 
            {
                program: program.auOrganisationDetails,
                orgUnit: event.orgUnit,
                trackedEntityInstance: event.trackedEntityInstance,
                eventDate:formatDate(new Date()),
                status:'ACTIVE',
                dataValues: event.dataValues,
            }
            if(event.programStage=='WCRytcUeLfD') {
                payload['programStage'] = programStage.auMembershipDetails
            } else  if(event.programStage=='UzfHCTIm3AF') {
                payload['programStage'] = programStage.auKeyDetails
            }else  if(event.programStage=='F0S4g5slsEC') {
                payload['programStage'] = programStage.auNarrativePlan
            }
        transferEvent(payload)
    })
}
    const projectBudget = trackedentityinstance.enrollments.filter((enroll) => enroll.program == program.projectBudget);
    if(projectBudget.length) projectBudget[0].events.forEach(event => {
        transferEvent({
            program: program.auProjectBudget,
            programStage: programStage.auProjectBudget,
            orgUnit: event.orgUnit,
            trackedEntityInstance: event.trackedEntityInstance,
            eventDate:formatDate(new Date()),
            status:'ACTIVE',
            dataValues: event.dataValues,
        })
    })
    const projectDescription = trackedentityinstance.enrollments.filter((enroll) => enroll.program == program.projectDescription);
    if(projectDescription.length)projectDescription[0].events.forEach(event => {
        transferEvent({
            program: program.auProjectDescription,
            programStage: programStage.auProjectDescription,
            orgUnit: event.orgUnit,
            trackedEntityInstance: event.trackedEntityInstance,
            eventDate:formatDate(new Date()),
            status:'ACTIVE',
            dataValues: event.dataValues,
        })
    })

    // const projectFocusArea1 = trackedentityinstance.enrollments.filter((enroll) => enroll.program == program.projectFocusArea1);
    // if(projectFocusArea1.length)projectFocusArea1[0].events.forEach(event => {
    //     transferEvent({
    //         program: program.auProjectFocusArea1,
    //         programStage: programStage.auProjectFocusArea1,
    //         orgUnit: event.orgUnit,
    //         trackedEntityInstance: event.trackedEntityInstance,
    //         eventDate:formatDate(new Date()),
    //         status:'ACTIVE',
    //         dataValues: event.dataValues,
    //     })
    // })

    // const projectFocusArea2 = trackedentityinstance.enrollments.filter((enroll) => enroll.program == program.projectFocusArea2);
    // if(projectFocusArea2.length)projectFocusArea2[0].events.forEach(event => {
    //     transferEvent({
    //         program: program.auProjectFocusArea2,
    //         programStage: programStage.auProjectFocusArea2,
    //         orgUnit: event.orgUnit,
    //         trackedEntityInstance: event.trackedEntityInstance,
    //         eventDate:formatDate(new Date()),
    //         status:'ACTIVE',
    //         dataValues: event.dataValues,
    //     })
    // })

    const projectExpenseCategory = trackedentityinstance.enrollments.filter((enroll) => enroll.program == program.projectExpenseCategory);
    if(projectExpenseCategory.length)projectExpenseCategory[0].events.forEach(event => {
        transferEvent({
            program: program.auProjectExpenseCategory,
            programStage: programStage.auProjectExpenseCategory,
            orgUnit: event.orgUnit,
            trackedEntityInstance: event.trackedEntityInstance,
            eventDate:formatDate(new Date()),
            status:'ACTIVE',
            dataValues: event.dataValues,
        })
    })

    const projectFocusArea = trackedentityinstance.enrollments.filter((enroll) => enroll.program == program.projectFocusArea);
    if(projectFocusArea.length)projectFocusArea[0].events.forEach(event => {
        transferEvent({
            program: program.auProjectFocusArea,
            programStage: programStage.auProjectFocusArea,
            orgUnit: event.orgUnit,
            trackedEntityInstance: event.trackedEntityInstance,
            eventDate:formatDate(new Date()),
            status:'ACTIVE',
            dataValues: event.dataValues,
        })
    })

    const incomeDetails = trackedentityinstance.enrollments.filter((enroll) => enroll.program == program.incomeDetails);
    if(incomeDetails.length)
    {
        incomeDetails[0].events.forEach(event => {
            let payload = 
            {
                program: program.auIncomeDetails,
                orgUnit: event.orgUnit,
                trackedEntityInstance: event.trackedEntityInstance,
                eventDate:formatDate(new Date()),
                status:'ACTIVE',
                dataValues: event.dataValues,
            }
            if(event.programStage=='jOWGLmqgh3Q') {
                payload['programStage'] = programStage.auTotalIncome
            } else  if(event.programStage=='glOZHvhoUns') {
                payload['programStage'] = programStage.auIncomeByDonor
            }else  if(event.programStage=='Bp1qxeFLXZI') {
                payload['programStage'] = programStage.auValueAddCoreFunding
            }
        transferEvent(payload)
    })
}
    alert('Programs moved to Annual Update Project.')
}

// function eventPushBPtoAU(trackedentityinstance) {
  
//     const projectFocusArea = trackedentityinstance.enrollments.filter((enroll) => enroll.program == program.projectFocusArea);
//     if(projectFocusArea.length)projectFocusArea[0].events.forEach(event => {
//         transferEvent({
//             program: program.auProjectFocusArea,
//             programStage: programStage.auProjectFocusArea,
//             orgUnit: event.orgUnit,
//             trackedEntityInstance: event.trackedEntityInstance,
//             eventDate:formatDate(new Date()),
//             status:'ACTIVE',
//             dataValues: event.dataValues,
//         })
//     })
//     alert('Programs moved to Annual Update Project.')
// }