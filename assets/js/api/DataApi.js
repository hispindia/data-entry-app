import BaseApi from "./BaseApi.js";

const baseUrl = '../..';
// const baseUrl = 'https://links.hispindia.org/ippf_co/api';

export const eventApi = {
  get: async (orgUnit) => {
    const url = `${baseUrl}/trackedEntityInstances.json?skipPaging=true&trackedEntityType=XjSwTokefHP&ou=${orgUnit}&fields=trackedEntityInstance,attributes[attribute,value],enrollments[program,orgUnit,events[trackedEntityInstance,program,event,programStage,orgUnit,orgUnitName,status,dataValues[dataElement,value]]`;
    try {
      const response = await BaseApi({url, method:"GET"});
      return response.json();
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  },
  fromStage: async (orgunit, program, programStage) => {
    const url = `${baseUrl}/trackedEntityInstances.json?skipPaging=true&ou=${orgunit}&program=${program}&programStage=${programStage}&fields=trackedEntityInstance,attributes[attribute,value],enrollments[program,orgUnit,events[trackedEntityInstance,program,event,programStage,orgUnit,orgUnitName,status,dataValues[dataElement,value]]`;
    try {
      const response = await BaseApi({url, method:"GET"});
      return response.json();
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  },
  post: async (payload) => {
    const url = `${baseUrl}/events`;
    try {
      const response = await BaseApi({url, method:"POST", payload});
      const data = await response.json();
      return data.response.importSummaries[0].reference;
    } catch (error) {
      console.error("Error while creating events", error);
    }
  },
  put: async (event, payload) => {
    const url = `${baseUrl}/events/${event}`;
    try {
      const response = await BaseApi({url, method:"PUT", payload});
      return response.json();
    } catch (error) {
      console.error("Error while creating events", error);
    }
  },
  complete:async (payload) => {
    const url = `${baseUrl}/events`;
    try {
      const response = await BaseApi({url, method:"POST", payload});
      return await response.json();
    } catch (error) {
      console.error("Error while updating status", error);
    }
  },
};

export const dataElementApi = {
  put: async (event, id, payload) => {
    const url = `${baseUrl}/events/${event}/${id}`;
    try {
      const response = await BaseApi({url, method:"PUT", payload});
      return response.json();
    } catch (error) {
      console.error("Error Pusing dataElement", error);
    }
  },
}

export const meApi = {
  get: async () => {
    const url = `${baseUrl}/me.json?fields=id,username,userGroups[id,name],organisationUnits[id,name,path,code,level,children[id,name],parent[id,name]]`;
    try {
      const response = await BaseApi({url, method:"GET"});
      return response.json();
    } catch (error) {
      console.error("Error loading ME Api", error);
    }
  }
}

export const organisationUnitGroup =  {
  get: async (group) => {
    const url = `${baseUrl}/organisationUnitGroups/${group}.json?fields=id,name,organisationUnits[id,name,path,code,level,parent[id,name]]`;
    try {
      const response = await BaseApi({url, method:"GET"});
      return response.json();
    } catch (error) {
      console.error("Error loading Organisation Units", error);
    }
  }
}