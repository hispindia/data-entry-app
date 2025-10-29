import { metadataApi } from "@/api";
import { MEMBER_PROGRAM_ID, HOUSEHOLD_PROGRAM_ID } from "@/constants/app-config";
import * as meManager from "@/indexDB/MeManager/MeManager";
import * as organisationUnitLevelsManager from "@/indexDB/OrganisationUnitLevelManager/OrganisationUnitLevelManager";
import * as organisationUnitManager from "@/indexDB/OrganisationUnitManager/OrganisationUnitManager";
import * as programManager from "@/indexDB/ProgramManager/ProgramManager";
import * as programRule from "@/indexDB/ProgramRuleManager/ProgramRuleManager";
import * as programRuleVariable from "@/indexDB/ProgramRuleVariable/ProgramRuleVariable";
import db from "@/indexDB/db";

export const getMetadataSet = (isOfflineMode) => {
  const savedProgram = sessionStorage.getItem("program");
  if (isOfflineMode) {
    return [
      organisationUnitManager.getAllOrganisationUnits(),
      meManager.getMe(),
      organisationUnitLevelsManager.getAllOrganisationUnitLevels(),
      organisationUnitManager.getUserOrgs(),
      programManager.getPrograms(),
      programManager.getProgramById(savedProgram),
      programRuleVariable.get(),
      programRule.get(),
    ];
  } else {
    
    return [
      metadataApi.get(`/api/organisationUnits`, {}, [
        "paging=false&fields=id,code,path,displayName,level,parent,translations&withinUserHierarchy=true",
      ]),
      metadataApi.getMe(),
      metadataApi.getOrgUnitLevels(),
      metadataApi.getUserOrgUnits(),
      metadataApi.getPrograms(),
      ...(savedProgram ? [metadataApi.getProgramMetadata(savedProgram)]: [{}]),
      metadataApi.getProgramRuleVariables(),
      metadataApi.getProgramRules(),
    ];
  }
};

// MEMBER_PROGRAM_ID

export const findOffline = (TABLE_NAME) => db[TABLE_NAME].where("isOnline").anyOf(0).toArray();

export const findChangedData = () =>
  Promise.all([findOffline("enrollment"), findOffline("event"), findOffline("trackedEntity")]);
