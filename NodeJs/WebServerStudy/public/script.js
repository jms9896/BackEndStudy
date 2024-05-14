document.addEventListener('DOMContentLoaded', function() {
    // 설문조사 결과 페이지에서 차트 그리기
    if (window.location.pathname.includes('survey.html')) {
        $.ajax({
            url: '/data',
            method: 'GET',
            success: function(data) {
                const chartsContainer = document.getElementById('chartsContainer');
                Object.keys(data).forEach(questionId => {
                    const counts = data[questionId];
                    const canvas = document.createElement('canvas');
                    chartsContainer.appendChild(canvas);

                    var ctx = canvas.getContext('2d');
                    new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'],
                            datasets: [{
                                label: `Question ${questionId} Votes`,
                                data: counts,
                                backgroundColor: [
                                    'rgba(255, 99, 132, 0.2)',
                                    'rgba(54, 162, 235, 0.2)',
                                    'rgba(255, 206, 86, 0.2)',
                                    'rgba(75, 192, 192, 0.2)',
                                    'rgba(153, 102, 255, 0.2)'
                                ],
                                borderColor: [
                                    'rgba(255, 99, 132, 1)',
                                    'rgba(54, 162, 235, 1)',
                                    'rgba(255, 206, 86, 1)',
                                    'rgba(75, 192, 192, 1)',
                                    'rgba(153, 102, 255, 1)'
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
});
