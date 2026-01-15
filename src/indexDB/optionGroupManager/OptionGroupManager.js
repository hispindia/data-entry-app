import db from "../db";
import { metadataApi } from "@/api";
import { TABLE_NAME } from ".";

export const pull = async () => {
  try {
    // clear the table
    await db[TABLE_NAME].clear();

    const result = await metadataApi.getOptionGroups();

    if (result.optionGroups && result.optionGroups.length > 0) {
      await addOptionGroups(result.optionGroups);
    }
  } catch (error) {
    console.error(`Failed to add org`, error);
  }
};

export const addOptionGroups = async (me) => {
  try {
    await db[TABLE_NAME].bulkPut(me);
  } catch (error) {
    console.error(`Failed to add optiongroup`, error);
  }
};

export const get = async () => {
  try {
    const optionGroups = await db[TABLE_NAME].toArray();
    return { optionGroups };
  } catch (error) {
    console.error(`Failed to get option group`, error);
  }
};

