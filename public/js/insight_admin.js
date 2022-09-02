const myChart1 = document.getElementById("myChart1").getContext("2d");
Chart.register(ChartDataLabels);

const xmlHttp = new XMLHttpRequest();
xmlHttp.open("POST", "/insight_admin", false);
xmlHttp.send(null);
const insight = JSON.parse(xmlHttp.response);

function getInsightKeys(insight_key) {
  return Object.keys(insight[insight_key]);
}

function getInsightValues(insight_key) {
  const array = [];
  Object.keys(insight[insight_key]).forEach(function (key) {
    array.push(Number(insight[insight_key][key]));
  });
  return array;
}

bar_options.plugins.title.text = "部门汇总";
const submitChart = new Chart(myChart1, {
  type: "bar", // bar,horizontalBar, pie, line, doughnut, radar, polarArea
  data: {
    labels: getInsightKeys("department"),
    datasets: [
      {
        data: getInsightValues("department"),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
        ],
      },
    ],
  },
  options: bar_options,
});
