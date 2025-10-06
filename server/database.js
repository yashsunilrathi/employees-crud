// server/database.js
const sqlite3 = require('sqlite3').verbose();

// Use ':memory:' for an in-memory database, or a file path for a persistent one.
const db = new sqlite3.Database('./employees.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the employees SQLite database.');
});

// Create the employees table
db.run(`CREATE TABLE IF NOT EXISTS employees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  position TEXT NOT NULL
)`, (err) => {
  if (err) {
    console.error("Error creating table", err.message);
  }
});

module.exports = db;