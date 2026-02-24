import React from "react";
import { Chart } from "primereact/chart";
import "chart.js/auto";

function SubjectWisePerformance({ data }) {
  const chartData = {
    labels: data?.labels || [],
    datasets: [
      {
        label: "Average Score",
        data: data?.data || [],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        min: 0,
        max: 100,
        ticks: { stepSize: 25 },
      },
    },
  };

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 md:p-6 h-full">
      <h3 className="text-lg font-semibold text-slate-800 mb-1">
        Subject-wise Performance
      </h3>
      <p className="text-xs text-slate-500 mb-4">
        Compare performance across different subjects
      </p>

      <div className="h-64 md:h-72">
        <Chart type="bar" data={chartData} options={options} className="h-full" />
      </div>
    </div>
  );
}

export default SubjectWisePerformance;
