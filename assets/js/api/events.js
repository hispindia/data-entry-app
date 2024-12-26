const headers = {
  "Content-Type": "application/json",
};
const events = {
  get: async (orgUnit) => {
    const url = `../../trackedEntityInstances.json?skipPaging=true&trackedEntityType=XjSwTokefHP&ou=${orgUnit}&fields=trackedEntityInstance,attributes[attribute,value],enrollments[program,orgUnit,events[trackedEntityInstance,program,event,programStage,orgUnit,orgUnitName,status,dataValues[dataElement,value]]`;
    try {
      const response = await fetch(url, { headers: headers });
      return response.json();
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  },
  fromStage: async (orgunit, program, programStage) => {
    const url = `../../trackedEntityInstances.json?skipPaging=true&ou=${orgunit}&program=${program}&programStage=${programStage}&fields=trackedEntityInstance,attributes[attribute,value],enrollments[program,orgUnit,events[trackedEntityInstance,program,event,programStage,orgUnit,orgUnitName,status,dataValues[dataElement,value]]`;
    try {
      const response = await fetch(url, { headers: headers });
      return response.json();
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  },
  post: async (payload) => {
    const url = "../../events";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      return data.response.importSummaries[0].reference;
    } catch (error) {
      console.error("Error while creating events", error);
    }
  },
  update: async (event, dataValues) => {
    const url = `../../events/${event}`;
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(dataValues),
      });
      return response.json();
    } catch (error) {
      console.error("Error while creating events", error);
    }
  },
  put: async (event, id, payload) => {
    const url = `../../events/${event}/${id}`;
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(payload),
      });
      return response.json();
    } catch (error) {
      console.error("Error while creating events", error);
    }
  },
  complete:async (payload) => {
    const url = "../../events";
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(payload),
      });
      return await response.json();
    } catch (error) {
      console.error("Error while updating status", error);
    }
  },
};
