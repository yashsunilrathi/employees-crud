// server/server.js
const express = require('express');
const cors = require('cors');
const db = require('./database.js');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// ROUTES
app.get('/', (req, res) => {
  res.send('Hello from the Employee CRUD API!');
});

app.get('/api/employees', (req, res) => {
  const sql = "SELECT * FROM employees";
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ "error": err.message });
      return;
    }
    res.json({
        "message": "success",
        "data": rows
    });
  });
});

app.post('/api/employees', (req, res) => {
  const { name, email, position } = req.body;
  const sql = `INSERT INTO employees (name, email, position) VALUES (?,?,?)`;
  const params = [name, email, position];
  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({
      "message": "success",
      "data": { name, email, position },
      "id": this.lastID
    });
  });
});


app.put('/api/employees/:id', (req, res) => {
  const { name, email, position } = req.body;
  const sql = `UPDATE employees set 
               name = COALESCE(?,name), 
               email = COALESCE(?,email), 
               position = COALESCE(?,position) 
               WHERE id = ?`;
  const params = [name, email, position, req.params.id];
  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ "error": res.message });
      return;
    }
    res.json({
        message: "success",
        data: { name, email, position },
        changes: this.changes
    });
  });
});

app.delete('/api/employees/:id', (req, res) => {
  const sql = 'DELETE FROM employees WHERE id = ?';
  const params = [req.params.id];
  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ "error": res.message });
      return;
    }
    res.json({ "message": "deleted", changes: this.changes });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});