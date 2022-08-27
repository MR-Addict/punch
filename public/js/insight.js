const myChart1 = document.getElementById("myChart1").getContext("2d");
const myChart2 = document.getElementById("myChart2").getContext("2d");
const myChart3 = document.getElementById("myChart3").getContext("2d");
Chart.register(ChartDataLabels);

const xmlHttp = new XMLHttpRequest();
xmlHttp.open("POST", "/insight", false);
xmlHttp.send(null);
const insight = JSON.parse(xmlHttp.response);
const days_length = 20;

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

function getInsightDaysValues() {
  const array = [];

  getInsightDaysKeys().forEach((prop) => {
    array.push(0);
    insight.days.forEach((day) => {
      if (new Date(day.日期.slice(5)).getTime() === new Date(prop).getTime()) {
        array.pop();
        array.push(Number(day.提交次数));
      }
    });
  });
  return array;
}

function getInsightDaysKeys() {
  var array = [];
  for (
    dt = new Date(new Date().setDate(new Date().getDate() - days_length + 1));
    dt <= new Date();
    dt.setDate(dt.getDate() + 1)
  ) {
    const temp_date = dt.toISOString().slice(5, 10);
    array.push(Number(temp_date.split("-")[0]) + "-" + Number(temp_date.split("-")[1]));
  }
  return array;
}

bar_options.plugins.title.text = "提交汇总";
const submitChart = new Chart(myChart1, {
  type: "bar", // bar,horizontalBar, pie, line, doughnut, radar, polarArea
  data: {
    labels: getInsightKeys("sum"),
    datasets: [
      {
        data: getInsightValues("sum"),
        backgroundColor: ["rgba(255, 99, 132, 0.5)", "rgba(54, 162, 235, 0.5)", "rgba(255, 206, 86, 0.5)"],
      },
    ],
  },
  options: bar_options,
});

bar_options.plugins.title.text = "组别汇总";
const groupChart = new Chart(myChart2, {
  type: "bar", // bar,horizontalBar, pie, line, doughnut, radar, polarArea
  data: {
    labels: getInsightKeys("group"),
    datasets: [
      {
        data: getInsightValues("group"),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
        ],
      },
    ],
  },
  options: bar_options,
});

line_options.plugins.title.text = "提交曲线";
const daySubmit = new Chart(myChart3, {
  type: "line", // bar,horizontalBar, pie, line, doughnut, radar, polarArea
  data: {
    labels: getInsightDaysKeys(),
    datasets: [
      {
        data: getInsightDaysValues(),
        fill: false,
        borderColor: "rgb(75, 192, 192, 0.5)",
        tension: 0.1,
      },
    ],
  },
  options: line_options,
});
