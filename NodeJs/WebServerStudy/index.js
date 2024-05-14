const express = require('express');
var cors = require('cors');
const fs = require('fs');
const csv = require('csv-parser');
const app = express();
const port = 3000;
const path = require('path');

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const filePath = path.join(__dirname, 'data', 'surveyData.csv');

app.get('/data', (req, res) => {
  const results = [];
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      const voteCounts = results.reduce((acc, row) => {
        const questionId = row['QuestionId'];
        if (!acc[questionId]) {
          acc[questionId] = [0, 0, 0, 0, 0];  // 5개의 선택지에 대한 투표 수 초기화
        }
        for (let i = 0; i < 5; i++) {
          if (row[`Answer${i}`] === 'True') {
            acc[questionId][i]++;
          }
        }
        return acc;
      }, {});

      res.json(voteCounts); // JSON 형태로 응답
    });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${port}`);
});
