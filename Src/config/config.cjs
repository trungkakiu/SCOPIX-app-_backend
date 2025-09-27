require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USER || "admins",
    password: process.env.DB_PASS || "admins",
    database: process.env.DB_NAME || "scopix_db",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3308,
    dialect: "mysql",
    logging: false,
  },
};
