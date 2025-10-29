import { dataApi } from "@/api";
import { TABLE_NAME } from ".";
import db from "../db";

export const pull = async () => {
  try {
    const result = await dataApi.get(
      "/api/programRuleVariables", 
      { paging: false }, 
      [
        "fields=id,name,valueType,program,dataElement"
      ]);
      debugger;
    await persist(result.programRuleVariables);
  } catch (error) {
    console.log("Events:pull", error);
  }
};

export const get = async () => {
  try {
    return await db[TABLE_NAME].toArray();
  } catch (error) {
    console.error(`Failed to get program rule`, error);
  }
};


export const persist = async (programRuleVariables) => {
  await db[TABLE_NAME].bulkPut(programRuleVariables);
};

export const clearTable = async () => {
  console.log("Clearing Event table");
  await db[TABLE_NAME].clear();
};
