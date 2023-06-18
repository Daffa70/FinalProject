require("dotenv").config();
const {
  DB_HOST,
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD,
  DB_DIALECT = "postgres",
  DB_PORT,
} = process.env;

module.exports = {
  development: {
    host: DB_HOST,
    database: DB_NAME,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    dialect: DB_DIALECT,
    port: DB_PORT,
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
    },
    timezone: "+07:00",
  },
  test: {
    host: DB_HOST,
    database: DB_NAME,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    dialect: DB_DIALECT,
    port: DB_PORT,
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
    },
    timezone: "+07:00",
  },
  production: {
    host: DB_HOST,
    database: DB_NAME,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    dialect: DB_DIALECT,
    port: DB_PORT,
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
    },
    timezone: "+07:00",
  },
};
