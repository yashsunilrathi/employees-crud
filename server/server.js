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

// Replace the GET /api/employees TODO block with this:
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

// 2. POST /api/employees - Create a new employee
// Replace the POST /api/employees TODO block with this:
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

// 3. PUT /api/employees/:id - Update an existing employee
// Replace the PUT /api/employees/:id TODO block with this:
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

// 4. DELETE /api/employees/:id - Delete an employee
// Replace the DELETE /api/employees/:id TODO block with this:
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