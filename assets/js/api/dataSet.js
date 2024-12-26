
const dataSet = {
  getElements: async (dataSetId) => {
    const url = `../../dataSets/${dataSetId}.json?fields=sections[name,dataElements[id,name,code,description]`;
    try {
      const response = await fetch(url, { headers: {
        "Content-Type": "application/json",
      }});
      return response.json();
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  },
  getValues:async (dataSetId, orgUnit, period) => {
    const url = `../../dataValueSets.json?dataSet=${dataSetId}&orgUnit=${orgUnit}&period=${period}`;
    try {
      const response = await fetch(url, { headers: {
        "Content-Type": "application/json",
      } });
      return response.json();
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  },
};
