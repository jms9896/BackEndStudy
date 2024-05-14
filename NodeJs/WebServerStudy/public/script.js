document.addEventListener('DOMContentLoaded', function() {
    // 설문조사 결과 페이지에서 차트 그리기 및 데이터 로드
    if (window.location.pathname.includes('survey.html')) {
        $.ajax({
            url: '/data',
            method: 'GET',
            success: function(response) {
                const { voteCounts, options, rawData } = response;

                // 차트 그리기
                const chartsContainer = document.getElementById('chartsContainer');
                Object.keys(voteCounts).forEach(questionId => {
                    const counts = voteCounts[questionId];
                    const labels = options[questionId];
                    const canvas = document.createElement('canvas');
                    chartsContainer.appendChild(canvas);

                    var ctx = canvas.getContext('2d');
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
                                    beginAtZero: true
                                }
                            }
                        }
                    });
                });

                // 원본 데이터 테이블에 추가
                const tableBody = document.getElementById('surveyDataTable').getElementsByTagName('tbody')[0];
                rawData.forEach(row => {
                    const newRow = tableBody.insertRow();
                    newRow.insertCell().textContent = row.Timestamp;
                    newRow.insertCell().textContent = row.QuestionId;
                    newRow.insertCell().textContent = row.Answer0;
                    newRow.insertCell().textContent = row.Answer1;
                    newRow.insertCell().textContent = row.Answer2;
                    newRow.insertCell().textContent = row.Answer3;
                    newRow.insertCell().textContent = row.Answer4;
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

    // 데이터 추가
    const addDataForm = document.getElementById('addDataForm');
    addDataForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const newData = {
            Timestamp: document.getElementById('timestamp').value,
            QuestionId: document.getElementById('questionId').value,
            Answer0: document.getElementById('answer0').value,
            Answer1: document.getElementById('answer1').value,
            Answer2: document.getElementById('answer2').value,
            Answer3: document.getElementById('answer3').value,
            Answer4: document.getElementById('answer4').value
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

    // 데이터 삭제
    const deleteDataForm = document.getElementById('deleteDataForm');
    deleteDataForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const deleteData = {
            Timestamp: document.getElementById('deleteTimestamp').value,
            QuestionId: document.getElementById('deleteQuestionId').value
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
});
