const myChart1 = document.getElementById("myChart1").getContext("2d");
const myChart2 = document.getElementById("myChart2").getContext("2d");
const myChart3 = document.getElementById("myChart3").getContext("2d");

doughnut_options.plugins.title.text = "提交";
Chart.register(ChartDataLabels);
const submitChart = new Chart(myChart1, {
  type: "doughnut", // bar,horizontalBar, pie, line, doughnut, radar, polarArea
  data: {
    labels: ["今日提交", "本周提交", "所有提交"],
    datasets: [
      {
        data: [1, 2, 6],
        backgroundColor: ["rgba(255, 99, 132)", "rgba(54, 162, 235)", "rgba(255, 206, 86)"],
      },
    ],
  },
  options: doughnut_options,
});

bar_options.plugins.title.text = "组别";
const groupChart = new Chart(myChart2, {
  type: "bar", // bar,horizontalBar, pie, line, doughnut, radar, polarArea
  data: {
    labels: ["航模", "编程", "电子", "静模"],
    datasets: [
      {
        data: [2, 3, 4, 5],
        backgroundColor: ["rgba(255, 99, 132)", "rgba(54, 162, 235)", "rgba(255, 206, 86)", "rgba(75, 192, 192)"],
      },
    ],
  },
  options: bar_options,
});

line_options.plugins.title.text = "每日提交";
const daySubmit = new Chart(myChart3, {
  type: "line", // bar,horizontalBar, pie, line, doughnut, radar, polarArea
  data: {
    labels: ["航模", "编程", "电子", "静模"],
    datasets: [
      {
        data: [4, 3, 4, 5],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  },
  options: line_options,
});
