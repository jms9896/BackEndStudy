const fs = require('fs');
const csv = require('csv-parser');
const pool = require('./db');

const filePath = 'data/surveyData.csv'; // CSV 파일 경로

const importCsv = async () => {
  try {
    const client = await pool.getConnection();
    const results = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        const insertQuery = `
          INSERT INTO survey (timestamp, question_id, answer0, answer1, answer2, answer3, answer4)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        for (const row of results) {
          const values = [
            row.Timestamp,
            row.QuestionId,
            row.Answer0 === 'True' ? 1 : 0,
            row.Answer1 === 'True' ? 1 : 0,
            row.Answer2 === 'True' ? 1 : 0,
            row.Answer3 === 'True' ? 1 : 0,
            row.Answer4 === 'True' ? 1 : 0,
          ];

          await client.query(insertQuery, values);
        }

        client.release();
        console.log('CSV data imported successfully');
      });
  } catch (err) {
    console.error('Error importing CSV data:', err);
  }
};

importCsv();
