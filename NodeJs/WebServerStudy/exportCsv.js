const pool = require('./db');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const csvWriter = createCsvWriter({
    path: 'survey_data.csv',
    header: [
        { id: 'id', title: 'ID' },
        { id: 'timestamp', title: 'Timestamp' },
        { id: 'question_id', title: 'Question ID' },
        { id: 'answer0', title: 'Answer 0' },
        { id: 'answer1', title: 'Answer 1' },
        { id: 'answer2', title: 'Answer 2' },
        { id: 'answer3', title: 'Answer 3' },
        { id: 'answer4', title: 'Answer 4' }
    ]
});

const exportDataToCsv = async () => {
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

        await csvWriter.writeRecords(rows);
        console.log('CSV file was written successfully');
    } catch (err) {
        console.error('Error exporting data to CSV:', err);
    }
};

exportDataToCsv();