import { dataApi } from "@/api";
import { TABLE_NAME } from ".";
import db from "../db";

export const pull = async () => {
  try {
    await db[TABLE_NAME].clear();
    const result = await dataApi.get(
      "/api/programRules", 
      { paging: false }, 
      [
        "fields=id,name,displayName,program,priority,programRuleActions[programRuleActionType,programStageSection,data,content,dataElement,optionGroup],condition"
      ]);
    await persist(result.programRules);
  } catch (error) {
    console.log("Events:pull", error);
  }
};

export const persist = async (programRules) => {
  await db[TABLE_NAME].bulkPut(programRules);
};

export const get = async () => {
  try {
    const programRules = await db[TABLE_NAME].toArray();
    return { programRules };
  } catch (error) {
    console.error(`Failed to get program rule`, error);
  }
};