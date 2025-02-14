import { createConnection } from "snowflake-sdk";
import dotenv from "dotenv";

dotenv.config();

export default function initSnowflakeSession() {
  return createConnection({
    account: process.env.SNOWFLAKE_ACCOUNT || '',
    username: process.env.SNOWFLAKE_USER || '',
    password: process.env.SNOWFLAKE_USER_PASSWORD || '',
    role: process.env.SNOWFLAKE_ROLE || '',
    database: process.env.SNOWFLAKE_DATABASE || '',
    schema: process.env.SNOWFLAKE_SCHEMA || '',
    warehouse: process.env.SNOWFLAKE_WAREHOUSE || '',
  }).connect((err, conn) => {
    if (err) {
      console.error('Unable to connect: ' + err.message);
    } else {
      console.log('Successfully connected to Snowflake.');
    }
  });
}
