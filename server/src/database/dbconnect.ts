const dotenv = require("dotenv").config();

import { Pool } from "pg";

export default new Pool({
  max: 20,
  connectionString: `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  idleTimeoutMillis: 30000,
});
