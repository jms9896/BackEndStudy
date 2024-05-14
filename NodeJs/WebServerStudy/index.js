const express = require('express')
var cors = require('cors')
const fs = require('fs');
const csv = require('csv-parser');
const app = express()
const port = 3000
const path = require('path')

app.use(cors())
app.use(express.static(path.join(__dirname, 'public')));  // public 디렉토리를 정적 파일로 설정합니다.

// app.get('/', (req, res) => {
//   res.send('Hello World')
// })

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/sound/:name', (req, res) => {
  const { name } = req.params
  console.log(name)

  if(name=='dog'){
    res.json({'sound': '멍멍'})
  }
  else if (name == 'cat'){
    res.json({'sound': '야옹'})
  }
})

const filePath = path.join(__dirname, 'Data', 'surveyData.csv');

app.get('/data', (req, res) => {
  const results = [];
  //const filePath = '/Users/byondr/Library/Application Support/DefaultCompany/HDcW/surveyData.csv';
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      res.json(results); // CSV 데이터를 JSON 형태로 변환하여 응답
    });
});


app.listen(port, '0.0.0.0', ()=> {
  console.log(`Server running on http://localhost:${port}`)
});