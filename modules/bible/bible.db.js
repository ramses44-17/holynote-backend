import Database from "better-sqlite3";
import path from "path";

const db = new Database(
  path.join(process.cwd(), "database/bible/FRC97.SQLite3"),
  {
    readonly: true,
  }
);

export default db;