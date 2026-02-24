import React from "react";
import { Chart } from "primereact/chart";
import "chart.js/auto";

function ProgressOverTime({ data }) {
  const chartData = {
    labels: data?.labels || [],
    datasets: [
      {
        label: "Score",
        data: data?.data || [],
        borderWidth: 3,
        fill: false,
        tension: 0.4,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `Score: ${ctx.parsed.y}`,
        },
      },
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
        Progress Over Time
      </h3>
      <p className="text-xs text-slate-500 mb-4">
        Weekly performance trend based on recent tests
      </p>

      <div className="h-full">
        <Chart type="line" data={chartData} options={options} />
      </div>
    </div>
  );
}

export default ProgressOverTime;
