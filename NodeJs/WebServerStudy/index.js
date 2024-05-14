const express = require('express');
const cors = require('cors');
const fs = require('fs');
const csv = require('csv-parser');
const { json2csvAsync } = require('json-2-csv');
const app = express();
const port = 3000;
const path = require('path');

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // JSON 바디 파싱

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const filePath = path.join(__dirname, 'data', 'surveyData.csv');

// 질문별 선택지 정보
const options = {
  id0: ['Option A', 'Option B', 'Option C', 'Option D', 'Option E'],
  id1: ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'],
  id2: ['15inch', '16inch', '17inch', '18inch', 'Larger']
};

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

      res.json({ voteCounts, options, rawData: results }); // JSON 형태로 응답
    });
});

app.post('/data', (req, res) => {
  const newRow = req.body;
  const newCsvData = `${newRow.Timestamp},${newRow.QuestionId},${newRow.Answer0},${newRow.Answer1},${newRow.Answer2},${newRow.Answer3},${newRow.Answer4}\n`;

  fs.appendFile(filePath, newCsvData, (err) => {
    if (err) throw err;
    res.status(201).send('Data added successfully');
  });
});

app.delete('/data', (req, res) => {
  const { Timestamp, QuestionId } = req.body;
  const results = [];
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      const filteredResults = results.filter(row => !(row.Timestamp === Timestamp && row.QuestionId === QuestionId));

      try {
        const csvData = await json2csvAsync(filteredResults);
        console.log("Filtered Results:", filteredResults);
        console.log("New CSV Data:", csvData);

        // CSV 데이터에 줄바꿈 추가
        const csvWithNewline = csvData + '\n';

        fs.writeFile(filePath, csvWithNewline, (err) => {
          if (err) {
            console.error("File Write Error:", err);
            return res.status(500).send('Error deleting data');
          }
          res.status(200).send('Data deleted successfully');
        });
      } catch (err) {
        console.error("JSON2CSV Error:", err);
        res.status(500).send('Error deleting data');
      }
    });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${port}`);
});
