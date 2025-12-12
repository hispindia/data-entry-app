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
    const url = `programStages/${id}.json?fields=id,name,programStageSections[name,dataElements[id,name,valueType,optionSetValue,optionSet[options[id,name,code]]]`;
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
    const url = `programs/${id}.json?fields=id,name,programTrackedEntityAttributes[trackedEntityAttribute[id,name,valueType,optionSet[options[name,code]],optionSetValue]]`;
    try{
        const response = await BaseApi({url});
        return response.json();
    } catch (error){
      console.error("Error occured while Loading option Set", error);
    }
  }
  
}