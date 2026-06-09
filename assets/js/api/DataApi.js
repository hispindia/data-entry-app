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
  getUser: async (user) => {
    const url = `users.json?query=${user}&fields=:all`;
    try {
      const response = await(await BaseApi({url, method:"GET"})).json();
      return response;
    } catch (error) {
      console.error("Error while viewing user", error);
    }
  },
  putUserOrgUnit: async (user, payload) => {
    const url = `users/${user}.json`;
    try {
      const response = await(await BaseApi({url, method:"PUT", payload})).json();
      return response;
    } catch (error) {
      console.error("Error while updating user", error);
    }
  },
  dataStore: async (payload) => {
    const url = `dataStore/${payload}`;
    try {
      const response = await(await BaseApi({url, method:"GET"})).json();
      return response;
    } catch (error) {
      console.error("Error while creating events", error);
    }
  },
  dataStoreNew: async (namespace, key, payload) => {
    const url = `dataStore/${namespace}/${key}`;
    try {
      const response = await(await BaseApi({url, method:"PUT", payload})).json();
      return response;
    } catch (error) {
      console.error("Error while creating events", error);
    }
  },
  dataStoreUpdate: async (namespace, key, payload) => {
    const url = `dataStore/${namespace}/${key}`;
    try {
      const response = await(await BaseApi({url, method:"POST", payload})).json();
      return response;
    } catch (error) {
      console.error("Error while creating events", error);
    }
  },
  dataStoreDelete: async (namespace, key, payload) => {
    const url = `dataStore/${namespace}/${key}`;
    try {
      const response = await(await BaseApi({url, method:"DELETE"})).json();
      return response;
    } catch (error) {
      console.error("Error while creating events", error);
    }
  },
  enroll: async (payload) => {
    const url = `tracker?async=false`;
    try {
      const response = await BaseApi({url, method:"POST", payload});
      const data = await response.json();
      if(!response.ok) throw new Error(data?.message || "Enrollment failed");
      return data?.bundleReport?.typeReportMap?.TRACKED_ENTITY?.objectReports[0]?.uid;
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
      return data;
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
  getIndicators: async (indicators) => {
     const url = `analytics.json?dimension=dx:${indicators.join(';')}&filter=ou:USER_ORGUNIT,pe:THIS_YEAR`;
    try {
      const response = await BaseApi({url, method:"GET"});
      return response.json();
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }
};