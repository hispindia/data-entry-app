import BaseApi from "./BaseApi.js";

const baseUrl = 'https://links.hispindia.org/ippf_co/api';

export const dataSet = {
  getElements: async (dataSetId) => {
    const url = `${baseUrl}/dataSets/${dataSetId}.json?fields=sections[name,dataElements[id,name,code,description]`;
    try {
      const response = await BaseApi({url, method:"GET"});
      return response.json();
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  },
  getValues:async (dataSetId, orgUnit, period) => {
    const url = `${baseUrl}/dataValueSets.json?dataSet=${dataSetId}&orgUnit=${orgUnit}&period=${period}`;
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
  try {
  $.ajax( {
		url: `${baseUrl}/dataValues`,
		data: dataValue,
		type: 'post',
		success: handleSuccess,
		// error: handleError
	} );
  function handleSuccess() {
    console.log('success')
  }
    // return response.json();
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}
}
