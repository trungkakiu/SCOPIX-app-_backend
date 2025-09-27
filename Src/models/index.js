import fs from "fs";
import path from "path";
import { Sequelize, DataTypes } from "sequelize";
import { fileURLToPath, pathToFileURL } from "url";
import process from "process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = process.env.NODE_ENV || "development";
const configPath = path.join(__dirname, "..", "config", "config.json");
const configJSON = JSON.parse(fs.readFileSync(configPath, "utf-8"));
const config = configJSON[env];

const db = {};

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false,
  }
);

const files = fs.readdirSync(__dirname).filter((file) => {
  return (
    file.indexOf(".") !== 0 &&
    file !== path.basename(__filename) &&
    file.slice(-3) === ".js" &&
    !file.endsWith(".test.js")
  );
});

for (const file of files) {
  const filePath = path.join(__dirname, file);
  const fileUrl = pathToFileURL(filePath).href;
  const modelModule = await import(fileUrl);
  const model = modelModule.default(sequelize, DataTypes);
  db[model.name] = model;
}

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
