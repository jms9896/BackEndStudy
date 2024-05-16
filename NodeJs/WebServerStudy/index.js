// index.js
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const app = express();
const port = 3000;
const path = require('path');

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // JSON 바디 파싱

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/data', async (req, res) => {
  try {
    const query = `
      SELECT id, 
             CONVERT_TZ(timestamp, '+00:00', @@session.time_zone) AS timestamp, 
             question_id, 
             answer0, 
             answer1, 
             answer2, 
             answer3, 
             answer4 
      FROM survey
    `;
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).send('Error fetching data');
  }
});


app.post('/data', async (req, res) => {
  const { timestamp, question_id, answer0, answer1, answer2, answer3, answer4 } = req.body;

  try {
    const query = `
      INSERT INTO survey (timestamp, question_id, answer0, answer1, answer2, answer3, answer4)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [timestamp, question_id, answer0, answer1, answer2, answer3, answer4];
    await pool.query(query, values);
    res.status(201).send('Data added successfully');
  } catch (err) {
    console.error('Error adding data:', err);
    res.status(500).send('Error adding data');
  }
});

app.delete('/data', async (req, res) => {
  const { timestamp, question_id } = req.body;

  try {
    const query = `
      DELETE FROM survey WHERE timestamp = ? AND question_id = ?
    `;
    const values = [timestamp, question_id];
    await pool.query(query, values);
    res.status(200).send('Data deleted successfully');
  } catch (err) {
    console.error('Error deleting data:', err);
    res.status(500).send('Error deleting data');
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${port}`);
});
