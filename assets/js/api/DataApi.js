import BaseApi from "./BaseApi.js";

export const dataApi = {
  get: async (orgUnit) => {
    const url = `trackedEntityInstances.json?skipPaging=true&program=${program}&ou=${orgUnit}&fields=trackedEntityInstance,attributes[attribute,value],enrollments[program,orgUnit,events[trackedEntityInstance,program,event,programStage,orgUnit,orgUnitName,status,dataValues[dataElement,value]]`;
    try {
      const response = await BaseApi({url, method:"GET"});
      return response.json();
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  },
  enroll: async (payload) => {
    const url = `tracker?async=false`;
    try {
      const response = await BaseApi({url, method:"POST", payload});
      const data = await response.json();
      return data.response.importSummaries[0].reference;
    } catch (error) {
      console.error("Error while creating events", error);
    }
  },
  fromStage: async (orgunit, program, programStage) => {
    const url = `trackedEntityInstances.json?skipPaging=true&ou=${orgunit}&program=${program}&programStage=${programStage}&fields=trackedEntityInstance,attributes[attribute,value],enrollments[program,orgUnit,events[trackedEntityInstance,program,event,programStage,orgUnit,orgUnitName,status,dataValues[dataElement,value]]`;
    try {
      const response = await BaseApi({url, method:"GET"});
      return response.json();
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  },
  post: async (payload) => {
    const url = `events`;
    try {
      const response = await BaseApi({url, method:"POST", payload});
      const data = await response.json();
      return data.response.importSummaries[0].reference;
    } catch (error) {
      console.error("Error while creating events", error);
    }
  },
  put: async (event, payload) => {
    const url = `events/${event}`;
    try {
      const response = await BaseApi({url, method:"PUT", payload});
      return response.json();
    } catch (error) {
      console.error("Error while creating events", error);
    }
  },
  complete:async (payload) => {
    const url = `events`;
    try {
      const response = await BaseApi({url, method:"POST", payload});
      return await response.json();
    } catch (error) {
      console.error("Error while updating status", error);
    }
  },
};