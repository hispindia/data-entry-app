import db from "../db";
import { metadataApi } from "../../api";
import { TABLE_NAME } from ".";

export const pull = async (program, raw) => {
  try {
    await db[TABLE_NAME].clear();
    const result = await metadataApi.getProgramMetadata(program, raw);

    await db[TABLE_NAME].bulkPut([result]);
  } catch (error) {
    console.error(`Failed to add programs`, error);
  }
};

export const getProgramById = async (id) => {
  try {
    return await db[TABLE_NAME].get(id);
  } catch (error) {
    console.error(`Failed to get org with children`, error);
  }
};

export const getPrograms = async () => {
  try {
    return await db[TABLE_NAME].toArray();
  } catch (error) {
    console.error(`Failed to get org with children`, error);
  }
};


