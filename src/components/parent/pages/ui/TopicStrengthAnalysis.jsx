import React from "react";
import { Chart } from "primereact/chart";
import "chart.js/auto";

function TopicStrengthAnalysis({ data }) {
  const chartData = {
    labels: data?.labels || [],
    datasets: [
      {
        label: "Score",
        data: data?.data || [],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: { stepSize: 25 },
      },
    },
  };

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 md:p-6 h-full">
      <h3 className="text-lg font-semibold text-slate-800 mb-1">
        Topic Strength Analysis
      </h3>
      <p className="text-xs text-slate-500 mb-4">
        Identify strong and weak topic areas
      </p>

      <div className="h-64 md:h-72">
        <Chart type="radar" data={chartData} options={options} />
      </div>
    </div>
  );
}

export default TopicStrengthAnalysis;
