function getEvents(programs, programId, periodId) {
  var events = {};

  const eventList = programs.filter(
    (enroll) => (enroll.program == programId)
  );

  eventList.forEach(list =>
    list.events.forEach((event) => {
      const dataValues = {};
      dataValues['event'] = event.event;
      event.dataValues.forEach(dv=> dataValues[dv.dataElement] = dv.value);
      if (dataValues[periodId]) events[dataValues[periodId]] = dataValues;
    })
  );
  return events;
}

function getEventsPeriodicity(programs, programId, year,periodicity) {
  var events = '';

  const eventList = programs.filter(
    (enroll) => (enroll.program == programId)
  );

  eventList.forEach(list =>
    list.events.forEach((event) => {
      const dataValues = {};
      dataValues['event'] = event.event;
      event.dataValues.forEach(dv=> dataValues[dv.dataElement] = dv.value);
      if((dataValues[year.id]==year.value) && dataValues[periodicity.id]==periodicity.value) events = dataValues;
    })
  );
  return events;
}

function getProgramStagePeriodicity(programs, programId, programStage, year,periodicity) {
  var events = '';

  const eventList = programs.filter(
    (enroll) => (enroll.program == programId)
  );

  eventList.forEach(list =>
    list.events.forEach((event) => {
        if(event.programStage==programStage) {
        const dataValues = {};
        dataValues['event'] = event.event;
        event.dataValues.forEach(dv=> dataValues[dv.dataElement] = dv.value);
        if((dataValues[year.id]==year.value) && dataValues[periodicity.id]==periodicity.value) events = dataValues;
      }
    })
  );
  return events;
}

function getProgramStageEvents(programs, programStage, programId, periodId) {
  var events = {};

  const eventList = programs.filter(
    (enroll) => (enroll.program == programId)
  );

  eventList.forEach(list =>
    list.events.forEach((event) => {
      if(event.programStage==programStage) {
        const dataValues = {};
        dataValues['event'] = event.event;
        event.dataValues.forEach(dv=> dataValues[dv.dataElement] = dv.value);
        if (dataValues[periodId]) events[dataValues[periodId]] = dataValues;
      }
    })
  );
  return events;
}

async function pushDataElementMultipleYears(dataElement, value) {
  for(let year = tei.year.start; year <= tei.year.end; year++) {
   await pushDataElementYear(`${dataElement}-${year}`, value);
  }
}

async function createEvent(dataElements) {
  const payload = {
    program: tei.program,
    programStage: tei.programStage,
    orgUnit: tei.orgUnit,
    trackedEntityInstance: tei.id,
    eventDate:formatDate(new Date()),
    status:'ACTIVE',
    dataValues: [...dataElements],
  };
  return await events.post(payload);
}

async function getSingleEvent(event) {
  return await events.getEvent(event);
}

async function updateEvent(event, dataValues) {
  return await events.update(event,dataValues);
}


async function createEventOther({orgUnit,program, programStage,teiId,dataElements}) {
  const payload = {
    program: program,
    programStage: programStage,
    orgUnit: orgUnit,
    trackedEntityInstance: teiId,
    eventDate:formatDate(new Date()),
    status:'ACTIVE',
    dataValues: [...dataElements],
  };
  return await events.post(payload);
}


async function pushDataElement(dataElement,value) {
  const payload = {
    program: tei.program,
    programStage: tei.programStage,
    orgUnit: tei.orgUnit,
    event: tei.event,
    trackedEntityInstance: tei.id,
    status:'ACTIVE',
    dataValues: [{ dataElement, value }],
  };
  return await events.put(tei.event, dataElement, payload);
  
}

async function pushDataElementOther(dataElement,value, program, programStage, event) {
  const payload = {
    program: program,
    programStage: programStage,
    orgUnit: tei.orgUnit,
    event: event,
    trackedEntityInstance: tei.id,
    status:'ACTIVE',
    dataValues: [{ dataElement, value }],
  };
  return await events.put(event, dataElement, payload);
}

async function pushDataElementYear(id,value) {
  const dataElement = id.split('-')[0];
  const year = id.split('-')[1];
  if(year && tei.event[year]) {
    const payload = {
      program: tei.program,
      programStage: tei.programStage,
      orgUnit: tei.orgUnit,
      event: tei.event[year],
      trackedEntityInstance: tei.id,
      status:'ACTIVE',
      dataValues: [{ dataElement, value }],
    };
    return await events.put(tei.event[year], dataElement, payload);
  }
}

function formatDate(date) {
  return [
    date.getFullYear(),
    `00${date.getMonth() + 1}`.slice(-2),
    `00${date.getDate()}`.slice(-2),
  ].join("-");
}

async function completeEvent() {
    const payload = {
        program: program.projectDescription,
        programStage: programStage.projectDescription,
        orgUnit: tei.orgUnit,
        trackedEntityInstance: tei.id,
        event: tei.event,
        status: 'COMPLETED'
      };
      return await events.complete(payload);
}

async function transferEvent(payload) {
  return await events.post(payload);
}


function displayValue(input) {
  let num = typeof input === "string" ? parseFloat(input) : input;
 
  if (isNaN(num)) {
      return "";
  }
 
  if (num % 1 === 0) {
     return num.toLocaleString();
  } else {
    let fixedNum = num.toFixed(2);
     return parseFloat(fixedNum).toLocaleString();
  }
 }
 