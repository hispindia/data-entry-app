import BaseApi from "./BaseApi.js";

export const optionSetApi =  {
  get: async (id) => {
    const url = `optionSets/${id}.json?fields=id,name,options[name,code]`
    try {
      const response = await BaseApi({url});
      return response.json();
    } catch (error) {
      console.error("Error occured while Loading option Set", error);
    }
  }
}

export const programStageApi = {
  get: async (id) => {
    const url = `programStages/${id}.json?fields=id,name,programStageDataElements[compulsory,dataElement[id,name]],programStageSections[name,dataElements[id,formName,valueType,optionSetValue,optionSet[options[id,name,code]]]`;
    try{
        const response = await BaseApi({url});
        return response.json();
    } catch (error){
      console.error("Error occured while Loading option Set", error);
    }
  }
}

export const programsApi = {
  get: async (id) => {
    const url = `programs/${id}.json?fields=id,name,programTrackedEntityAttributes[displayInList,mandatory,trackedEntityAttribute[id,name,valueType,optionSet[options[name,code]],optionSetValue]]`;
    try{
        const response = await BaseApi({url});
        return response.json();
    } catch (error){
      console.error("Error occured while Loading option Set", error);
    }
  },
  postOU: async ({orgUnit, program}) => {
    var url = `programs/${program}/organisationUnits/${orgUnit}`
    const response = await BaseApi({url, method:"POST"});
    return response.json();
  }
}

export const meApi = {
  get: async () => {
    const url = `me.json?fields=id,name,username,dataViewOrganisationUnits[id,name],organisationUnits[id,name]`;
    try{
        const response = await BaseApi({url});
        return response.json();
    } catch (error){
      console.error("Error occured while Loading option Set", error);
    }
  }
}

export const orgUnitsApi = {
  get: async (level) => {
    var url = `organisationUnits.json?paging=false&fields=id,name,code`;
    url += level ? `&level=${level}` : '';
    try{
        const response = await BaseApi({url});
        return response.json();
    } catch (error){
      console.error("Error occured while Loading option Set", error);
    }
  },
  post: async (payload) => {
    var url = `metadata?importReportMode=FULL`
    const response = await BaseApi({url, payload, method:"POST"});
    return response.json();
  }
}