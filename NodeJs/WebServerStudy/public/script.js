document.getElementById('surveyButton').addEventListener('click', function() {
    window.location.href = 'survey.html'; // 설문조사 결과 페이지로 이동
});

$(document).ready(function() {
    $.ajax({
        url: '/data',
        method: 'GET',
        success: function(data) {
            const labels = data.map(item => item.question);
            const counts = data.map(item => parseInt(item.count, 10));

            var ctx = document.getElementById('myChart').getContext('2d');
            var myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: '# of Votes',
                        data: counts,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)'
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
        },
        error: function(error) {
            console.error('Error loading data:', error);
        }
    });
});
