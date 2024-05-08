/** Database connection for messagely. */


// const { Client } = require("pg");
// const { DB_URI } = require("./config");

// const client = new Client(DB_URI);

// client.connect();


// module.exports = client;

const  { Client } = require("pg");

let DB_URI;

if(process.env.NODE_ENV === "test") {
    DB_URI = "messagely_test";
} else {
    DB_URI = "messagely"
}

const db = new Client({
    host: "/var/run/postgresql",
    database: DB_URI })

db.connect();

module.exports = db;
