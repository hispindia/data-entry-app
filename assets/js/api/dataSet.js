import BaseApi from "./BaseApi.js";

export const dataSet = {
  getElements: async (dataSetId) => {
    const url = `dataSets/${dataSetId}.json?fields=sections[name,dataElements[id,name,code,description]`;
    try {
      const response = await BaseApi({url, method:"GET"});
      return response.json();
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  },
  getValues:async (dataSetId, orgUnit, period) => {
    const url = `dataValueSets.json?orgUnitGroup=nDrAezMbLFS&dataSet=vDbMUQy8JsD&period=2026`;
    try {
      const response = await BaseApi({url, method:"GET"});
      return response.json();
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  },
  post: async ({dataSetId, co, orgUnit, period, dataElement, value}) => {
    const dataValue = {
      co: co,
      ds: dataSetId,
      ou:orgUnit,
      pe: `${period}`,
      de: dataElement,
      value: value
  }
  const url = `dataValues`;
    try {
      await BaseApi({url, method:"POST", payload:dataValue, mode: 'dataset'});
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }
}
