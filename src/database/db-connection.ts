import { open } from "sqlite";
import sqlite3 from "sqlite3";
import { Database } from "sqlite";

export const initDb = async (): Promise<Database> => {
  return open({
    filename: "./src/database/new_tasks.db",
    driver: sqlite3.Database,
  });
};
