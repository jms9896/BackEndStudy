document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('survey.html')) {
        $.ajax({
            url: '/data',
            method: 'GET',
            success: function(response) {
                const rawData = response;

                // 타임스탬프를 로컬 시간대로 변환하는 함수
                const convertToLocalTime = (timestamp) => {
                    const date = new Date(timestamp);
                    return date.toISOString().slice(0, 19).replace('T', ' '); // UTC 시간 그대로 반환
                };

                // 차트 그리기
                const chartsContainer = document.getElementById('chartsContainer');
                const voteCounts = {};
                const options = {
                    id0: ['Option A', 'Option B', 'Option C', 'Option D', 'Option E'],
                    id1: ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'],
                    id2: ['15inch', '16inch', '17inch', '18inch', 'Larger']
                };

                rawData.forEach(row => {
                    const questionId = row.question_id;
                    if (!voteCounts[questionId]) {
                        voteCounts[questionId] = [0, 0, 0, 0, 0];
                    }
                    voteCounts[questionId][0] += row.answer0;
                    voteCounts[questionId][1] += row.answer1;
                    voteCounts[questionId][2] += row.answer2;
                    voteCounts[questionId][3] += row.answer3;
                    voteCounts[questionId][4] += row.answer4;
                });

                Object.keys(voteCounts).forEach(questionId => {
                    const counts = voteCounts[questionId];
                    const labels = options[questionId];
                    const canvas = document.createElement('canvas');
                    chartsContainer.appendChild(canvas);

                    const ctx = canvas.getContext('2d');
                    new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: labels,
                            datasets: [{
                                label: `Question ${questionId} Votes`,
                                data: counts,
                                backgroundColor: [
                                    'rgba(255, 99, 132, 0.2)',
                                    'rgba(54, 162, 235, 0.2)',
                                    'rgba(255, 206, 86, 0.2)',
                                    'rgba(75, 192, 192, 0.2)',
                                    'rgba(153, 102, 255, 0.2)',
                                    'rgba(255, 159, 64, 0.2)'
                                ],
                                borderColor: [
                                    'rgba(255, 99, 132, 1)',
                                    'rgba(54, 162, 235, 1)',
                                    'rgba(255, 206, 86, 1)',
                                    'rgba(75, 192, 192, 1)',
                                    'rgba(153, 102, 255, 1)',
                                    'rgba(255, 159, 64, 1)'
                                ],
                                borderWidth: 1
                            }]
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        callback: function(value) {
                                            return value + ' votes';
                                        }
                                    }
                                }
                            }
                        }
                    });
                });

                // 원본 데이터 테이블에 추가
                const tableBody = document.getElementById('surveyDataTable').getElementsByTagName('tbody')[0];
                rawData.forEach(row => {
                    const newRow = tableBody.insertRow();
                    newRow.insertCell().textContent = convertToLocalTime(row.timestamp);
                    newRow.insertCell().textContent = row.question_id;
                    newRow.insertCell().textContent = row.answer0;
                    newRow.insertCell().textContent = row.answer1;
                    newRow.insertCell().textContent = row.answer2;
                    newRow.insertCell().textContent = row.answer3;
                    newRow.insertCell().textContent = row.answer4;
                });
            },
            error: function(error) {
                console.error('Error loading data:', error);
            }
        });
    }

    // 메인 페이지에서 설문조사 결과 페이지로 이동
    const surveyButton = document.getElementById('surveyButton');
    if (surveyButton) {
        surveyButton.addEventListener('click', function() {
            window.location.href = 'survey.html';
        });
    }

    // CSV 다운로드
    const downloadCsvButton = document.getElementById('downloadCsvButton');
    if (downloadCsvButton) {
        downloadCsvButton.addEventListener('click', function() {
            window.location.href = '/export-csv';
        });
    }

    // 데이터 추가
    const addDataForm = document.getElementById('addDataForm');
    if (addDataForm) {
        addDataForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const newData = {
                timestamp: document.getElementById('timestamp').value,
                question_id: document.getElementById('questionId').value,
                answer0: document.getElementById('answer0').value,
                answer1: document.getElementById('answer1').value,
                answer2: document.getElementById('answer2').value,
                answer3: document.getElementById('answer3').value,
                answer4: document.getElementById('answer4').value
            };

            $.ajax({
                url: '/data',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(newData),
                success: function(response) {
                    alert('Data added successfully');
                    location.reload();
                },
                error: function(error) {
                    console.error('Error adding data:', error);
                }
            });
        });
    }

    // 데이터 삭제
    const deleteDataForm = document.getElementById('deleteDataForm');
    if (deleteDataForm) {
        deleteDataForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const deleteData = {
                timestamp: document.getElementById('deleteTimestamp').value,
                question_id: document.getElementById('deleteQuestionId').value
            };

            $.ajax({
                url: '/data',
                method: 'DELETE',
                contentType: 'application/json',
                data: JSON.stringify(deleteData),
                success: function(response) {
                    alert('Data deleted successfully');
                    location.reload();
                },
                error: function(error) {
                    console.error('Error deleting data:', error);
                }
            });
        });
    }
});