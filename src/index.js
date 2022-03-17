const { exit } = require("process");
const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const CREATE_TABLE = `
CREATE TABLE IF NOT EXISTS cron_test_log (
  "id" SERIAL PRIMARY KEY,
  "createdAt" TIMESTAMP NOT NULL
)
`;

const ADD_LOG = `
INSERT INTO cron_test_log (createdAt) VALUES ($1)
`;

const SELECT_LOGS = `
SELECT * FROM cron_test_log
`;

pool.query(CREATE_TABLE);

pool.query(ADD_LOG, [new Date().toUTCString()]);

pool
  .query(SELECT_LOGS)
  .then((res) => {
    return console.log(res.rows);
  })
  .then(() => exit());
