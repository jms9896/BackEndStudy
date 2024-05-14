const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'Data', 'surveyData.csv');

// 파일의 첫 10줄만 읽어서 출력
fs.createReadStream(filePath)
  .on('data', (chunk) => {
    console.log(chunk.toString());
  })
  .on('error', (err) => {
    console.error('Error reading file:', err);
  });
