const doughnut_options = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    tooltip: {
      enabled: false,
    },
    title: {
      display: true,
      text: "",
      position: "bottom",
      font: {
        size: 16,
      },
    },
    legend: {
      display: true,
      position: "top",
    },
    datalabels: {
      anchor: "center",
      align: "center",
      color: "#555",
      formatter: (value, context) => {
        const dataPoints = context.dataset.data;
        const sum = parseInt(dataPoints.reduce((prop, a) => prop + a, 0));
        if (sum) return `${value}\n${((value / sum) * 100).toFixed(1)}%`;
        else return "error";
      },
      labels: {
        title: {
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
    },
  },
};

const bar_options = {
  maintainAspectRatio: false,
  responsive: true,
  scales: {
    y: {
      beginAtZero: true,
    },
  },
  plugins: {
    tooltip: {
      enabled: false,
    },
    title: {
      display: true,
      text: "",
      position: "bottom",
      font: {
        size: 16,
      },
    },
    legend: {
      display: false,
      position: "top",
    },
    datalabels: {
      anchor: "end",
      align: "center",
      color: "#555",
      formatter: (value, context) => {
        return `${value}`;
      },
      labels: {
        title: {
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
    },
  },
};

const line_options = {
  maintainAspectRatio: false,
  responsive: true,
  scales: {
    y: {
      beginAtZero: true,
    },
  },
  plugins: {
    tooltip: {
      enabled: false,
    },
    title: {
      display: true,
      text: "",
      position: "bottom",
      font: {
        size: 16,
      },
    },
    legend: {
      display: false,
      position: "top",
    },
    datalabels: {
      anchor: "end",
      align: "center",
      color: "#555",
      formatter: (value, context) => {
        return `${value}`;
      },
      labels: {
        title: {
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
    },
  },
};
