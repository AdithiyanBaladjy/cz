var xValues1 = ["Fixed Income", "Bank Account"];
var yValues1 = [50, 50];
var barColors1 = [
  "#b91d47",
  "#00aba9"
];

new Chart("ctasset", {
  type: "doughnut",
  data: {
    labels: xValues1,
    datasets: [{
      backgroundColor: barColors1,
      data: yValues1
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    title: {
      display: true,
      text: "Asset"
    }
  }
});

var xValues2 = ["Home", "Auto", "Personal","LAS"];
var yValues2 = [25, 25, 25, 25];
var barColors2 = [
  "#b91d47",
  "#00aba9",
  "#2b5797",
  "#e8c3b9"
];

new Chart("ctliabl", {
  type: "doughnut",
  data: {
    labels: xValues2,
    datasets: [{
      backgroundColor: barColors2,
      data: yValues2
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    title: {
      display: true,
      text: "Liabilities"
    }
  }
});

var xValues3 = ["Equity", "MF", "Derivative"];
var yValues3 = [54, 25, 21];
var barColors3 = [
  "#b91d47",
  "#00aba9",
  "#2b5797"
];

new Chart("ctsecurity", {
  type: "doughnut",
  data: {
    labels: xValues3,
    datasets: [{
      backgroundColor: barColors3,
      data: yValues3
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    title: {
      display: true,
      text: "Securities"
    }
  }
});