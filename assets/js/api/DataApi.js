import BaseApi from "./BaseApi.js";

export const dataApi = {
  get: async (orgUnit, program, otherParam = "") => {
    const url = `tracker/trackedEntities.json?paging=false&ouMode=DESCENDANTS&${otherParam}&program=${program}&orgUnit=${orgUnit}&fields=trackedEntity,orgUnit,attributes[attribute,value],enrollments[program,enrollment,orgUnit,events[trackedEntityInstance,program,event,occurredAt,createdBy,programStage,orgUnit,orgUnitName,status,dataValues[dataElement,value]]`;
    try {
      const response = await BaseApi({url, method:"GET"});
      return response.json();
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  },
  getTrackedEntity: async (trackedEntity) => {
    const url = `tracker/trackedEntities.json?paging=false&trackedEntity=${trackedEntity}&fields=trackedEntity,orgUnit,attributes[attribute,value],enrollments[enrollment,program,orgUnit,events[trackedEntityInstance,program,event,occurredAt,programStage,orgUnit,orgUnitName,status,dataValues[dataElement,value]]`;
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
      if(!response.ok) throw new Error(data?.message || "Enrollment failed");
      if(data?.response?.importSummaries?.length) return data.response.importSummaries[0].reference;
    } catch (error) {
      console.error("Error while creating events", error);
    }
  },
  update: async (payload) => {
    const url = `tracker?async=false`;
    try {
      const response = await BaseApi({url, method:"POST", payload});
      return response.json();
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  },
  fromStage: async (orgunit, program, programStage) => {
    const url = `trackedEntityInstances.json?skipPaging=true&ou=${orgunit}&program=${program}&programStage=${programStage}&fields=trackedEntityInstance,attributes[attribute,value],enrollments[program,orgUnit,events[trackedEntityInstance,program,event,occurredAt,programStage,orgUnit,orgUnitName,status,dataValues[dataElement,value]]`;
    try {
      const response = await BaseApi({url, method:"GET"});
      return response.json();
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  },
  postAttribute: async (payload) => {
    const url = `tracker?async=false`;
    try {
      const response = await BaseApi({url, method:"POST", payload});
      const data = await response.json();
      return data.response.importSummaries[0].reference;
    } catch (error) {
      console.error("Error while creating events", error);
    }
  },
  getFile: async (id) => {
    const url = `fileResources/${id}.data`
    try {
      const response = await BaseApi({url});
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error while creating events", error);
    }
  },
  getFileResources: async (event, dataElement) => {
    const url = `events/files?eventUid=${event}&dataElementUid=${dataElement}`
    try {
      const response = await BaseApi({url});
      return response.blob();
    } catch (error) {
      console.error("Error while creating events", error);
    }
  },
  uploadFile: async (payload) => {
    const url = `fileResources`;
    try {
      const response = await BaseApi({url, method:"POST", payload, mode: "file"});
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error while creating events", error);
    }
  },
};