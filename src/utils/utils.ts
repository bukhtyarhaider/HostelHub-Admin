export const getChartData = (data: Number[]) => {
  return {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Total Hostels Created",
        data: data,
        fill: false,
        borderColor: "#007bff",
        tension: 0.1,
        pointBackgroundColor: "#fff",
        pointBorderColor: "#007bff",
        pointHoverBackgroundColor: "#007bff",
        pointHoverBorderColor: "#fff",
        pointRadius: 5,
        pointHoverRadius: 8,
      },
    ],
  };
};
