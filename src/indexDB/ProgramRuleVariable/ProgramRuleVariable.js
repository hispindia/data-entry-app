import { dataApi } from "@/api";
import { TABLE_NAME } from ".";
import db from "../db";

export const pull = async () => {
  try {
    await db[TABLE_NAME].clear();
    const result = await dataApi.get(
      "/api/programRuleVariables", 
      { paging: false }, 
      [
        "fields=id,name,valueType,program,dataElement,useCodeForOptionSet"
      ]);
    await persist(result.programRuleVariables);
  } catch (error) {
    console.log("Events:pull", error);
  }
};

export const persist = async (programRuleVariables) => {
  await db[TABLE_NAME].bulkPut(programRuleVariables);
};

export const get = async () => {
  try {
    const programRuleVariables = await db[TABLE_NAME].toArray();
    return { programRuleVariables };
  } catch (error) {
    console.error(`Failed to get program rule`, error);
  }
};
