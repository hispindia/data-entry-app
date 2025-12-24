import { eventApi, dataElementApi, meApi, organisationUnitGroup, attributeApi } from './DataApi-test.js';


export function getEvents(programs, programId, year) {
  var events = {};

  const eventList = programs.filter(
    (enroll) => (enroll.program == programId)
  );

  // console.log('getEvents: year object:', year);
  eventList.forEach(list =>
    list.events.forEach((event) => {
      const dataValues = {};
      dataValues['event'] = event.event;
      event.dataValues.forEach(dv => dataValues[dv.dataElement] = dv.value);
      // console.log('getEvents: checking event dataValues:', dataValues);
      if (dataValues[year.id] && dataValues[year.id]==year.value) {
        events[dataValues[year.id]] = dataValues;
        // console.log('getEvents: matched year', year.value, 'event:', dataValues);
      }
    })
  );
  return events;
}

export function getEventsPeriodicity(programs, programId, year, periodicity) {
  var events = '';

  const eventList = programs.filter(
    (enroll) => (enroll.program == programId)
  );

  eventList.forEach(list =>
    list.events.forEach((event) => {
      const dataValues = {};
      dataValues['event'] = event.event;
      event.dataValues.forEach(dv => dataValues[dv.dataElement] = dv.value);
      if ((dataValues[year.id] == year.value) && dataValues[periodicity.id] == periodicity.value) events = dataValues;
    })
  );
  return events;
}

export function getProgramStagePeriodicity(programs, programId, programStage, year, periodicity) {
  var events = '';

  const eventList = programs.filter(
    (enroll) => (enroll.program == programId)
  );

  eventList.forEach(list =>
    list.events.forEach((event) => {
      if (event.programStage == programStage) {
        const dataValues = {};
        dataValues['event'] = event.event;
        event.dataValues.forEach(dv => dataValues[dv.dataElement] = dv.value);
        if ((dataValues[year.id] == year.value) && dataValues[periodicity.id] == periodicity.value) events = dataValues;
      }
    })
  );
  return events;
}

export function getProgramStageEvents(programs, programStage, programId, year) {
  var events = {};

  const eventList = programs.filter(
    (enroll) => (enroll.program == programId)
  );

  // console.log('getProgramStageEvents: year object:', year);
  eventList.forEach(list =>
    list.events.forEach((event) => {
      if (event.programStage == programStage) {
        const dataValues = {};
        dataValues['event'] = event.event;
        event.dataValues.forEach(dv => dataValues[dv.dataElement] = dv.value);
        // console.log('getProgramStageEvents: checking event dataValues:', dataValues);
        if (dataValues[year.id] && dataValues[year.id]==year.value) {
          events[dataValues[year.id]] = dataValues;
          // console.log('getProgramStageEvents: matched year', year.value, 'event:', dataValues);
        }
      }
    })
  );
  return events;
}

export async function pushDataElementMultipleYears(dataElement, value) {
  for (let year = tei.year.start; year <= tei.year.end; year++) {
    await pushDataElementYear(`${dataElement}-${year}`, value);
  }
}

export async function pushAttribute(teiId, payload) {
    await attributeApi.put(teiId, payload);
}

export async function createEvent(dataElements) {
  const payload = {
    program: tei.program,
    programStage: tei.programStage,
    orgUnit: tei.orgUnit,
    trackedEntityInstance: tei.id,
    eventDate: formatDate(new Date()),
    status: 'ACTIVE',
    dataValues: [...dataElements],
  };
  return await eventApi.post(payload);
}

export async function getSingleEvent(event) {
  return await eventApi.getEvent(event);
}

export async function updateEvent(event, dataValues) {
  return await eventApi.put(event, dataValues);
}


export async function createEventOther({ orgUnit, program, programStage, teiId, dataElements }) {
  const payload = {
    program: program,
    programStage: programStage,
    orgUnit: orgUnit,
    trackedEntityInstance: teiId,
    eventDate: formatDate(new Date()),
    status: 'ACTIVE',
    dataValues: [...dataElements],
  };
  return await eventApi.post(payload);
}


export async function pushDataElement(dataElement, value) {
  const payload = {
    program: tei.program,
    event: tei.event,
    dataValues: [{ dataElement, value }],
  };
  return await dataElementApi.put(tei.event, dataElement, payload);

}

export async function pushDataElementOther(dataElement, value, program, programStage, event) {
  const payload = {
    program: program,
    programStage: programStage,
    orgUnit: tei.orgUnit,
    event: event,
    trackedEntityInstance: tei.id,
    status: 'ACTIVE',
    dataValues: [{ dataElement, value }],
  };
  return await dataElementApi.put(event, dataElement, payload);
}

export async function pushDataElementYear(id, value) {
  const dataElement = id.split('-')[0];
  const year = id.split('-')[1];
  if (year && tei.event[year]) {
    const payload = {
      program: tei.program,
      programStage: tei.programStage,
      orgUnit: tei.orgUnit,
      event: tei.event[year],
      trackedEntityInstance: tei.id,
      status: 'ACTIVE',
      dataValues: [{ dataElement, value }],
    };
    return await dataElementApi.put(tei.event[year], dataElement, payload);
  }
}

export async function completeEvent() {
  const payload = {
    program: program.projectDescription,
    programStage: programStage.projectDescription,
    orgUnit: tei.orgUnit,
    trackedEntityInstance: tei.id,
    event: tei.event,
    status: 'COMPLETED'
  };
  return await eventApi.complete(payload);
}

export async function transferEvent(payload) {
  return await eventApi.post(payload);
}


export function formatDate(date) {
  return [
    date.getFullYear(),
    `00${date.getMonth() + 1}`.slice(-2),
    `00${date.getDate()}`.slice(-2),
  ].join("-");
}


export function displayValue(input) {
  if (input === null || input === undefined || input === '') {
    return "";
  }

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

export async function getMeData() {
  return await meApi.get();
}

export async function getTEI(orgUnit) {
  return await eventApi.get(orgUnit);
}


export async function getOrganisationUnits(orgUnit) {
  return await organisationUnitGroup.get(orgUnit);
}

 
export function populateOptions(options, value) {
  var optionSet = `<option ${(value=="" ? 'selected' : '')} value="">Select</option>`;
  options.forEach(opt => {
  optionSet += `<option ${(value == opt.code ? 'selected' : '')} value="${opt.code}">${opt.name}</option>`;
})
  return optionSet;
}


