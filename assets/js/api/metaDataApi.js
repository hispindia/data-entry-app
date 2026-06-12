import BaseApi from "./BaseApi.js";

export const optionSetApi =  {
  get: async (id) => {
    const url = `optionSets/${id}.json?fields=id,name,options[id,name,code]`
    try {
      const response = await BaseApi({url});
      const data =  await response.json();
      data.options = data.options.map(option => ({
        label: option.name,
        value: option.code,
        id: option.id,
      }))
      return data;
    } catch (error) {
      console.error("Error occured while Loading option Set", error);
    }
  },

  getOptionGroups : async () => {
    const url = `optionGroups.json?paging=false&fields=id,displayName,options[id,name,code]`
    try {
      const response = await BaseApi({url});
      return response.json();
    } catch (error) {
      console.error("Error occured while Loading option group", error);
    }
  },
}

export const programStageApi = {
  get: async (id) => {
    const url = `programStages/${id}.json?fields=id,name,programStageDataElements[compulsory,dataElement[id,name,formName,valueType,optionSetValue,optionSet[options[id,name,code]]]],programStageSections[id,name,dataElements[id,formName,valueType,optionSetValue,optionSet[options[id,name,code]]]]`;
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
    const url = `programs/${id}.json?fields=id,name,programSections[name,trackedEntityAttributes[id,name,valueType,optionSet[options[name,code]],optionSetValue]],programTrackedEntityAttributes[displayInList,mandatory,trackedEntityAttribute[id,name]]`;
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
  },
  rules: async (program) => {
    const url = `programRules.json?paging=false&filter=program.id:eq:${program}&fields=id,name,displayName,program,priority,programRuleActions[programRuleActionType,programStageSection,data,content,dataElement,optionGroup,trackedEntityAttribute],condition`;
    try{
        const response = await BaseApi({url});
        return response.json();
    } catch (error){
      console.error("Error occured while Loading rules", error);
    }
  },
  ruleVariables: async (program) => {
    const url = `programRuleVariables.json?paging=false&filter=program.id:eq:${program}&fields=id,name,valueType,program,dataElement,trackedEntityAttribute,useCodeForOptionSet`;
    try{
        const response = await BaseApi({url});
        return response.json();
    } catch (error){
      console.error("Error occured while Loading rule variables", error);
    }
  },
}

export const meApi = {
  get: async () => {
    const url = `me.json?fields=id,name,username,userRoles,userGroups[id,name,code],dataViewOrganisationUnits[id,name],organisationUnits[id,name,code],teiSearchOrganisationUnits[id,name,code],attributeValues`;
    try{
        const response = await BaseApi({url});
        return response.json();
    } catch (error){
      console.error("Error occured while Loading option Set", error);
    }
  }
}

export const orgUnitsApi = {
  get: async ({level, filter}) => {
    var url = `organisationUnits.json?paging=false&fields=id,name,code,children[id,name,code],parent[id,name,code]`;
    url += level ? `&level=${level}` : '';
    url += filter ? `&filter=code:eq:${filter}`: '';
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

export const dataElementsApi = {
  get: async ({param}) => {
    var url = `dataElements.json?paging=false&${param.join('&')}`
    const response = await BaseApi({url, method:"GET"});
    return response.json();
  }
}
export const changePassword = {
  put: async ({ oldPassword, newPassword }) => {
    var url = `me/changePassword`
    const response = await BaseApi({url, method:"PUT", payload: { oldPassword, newPassword}});
    return response;
  }
}