import React from "react";
import { Calendar, TrendingUp, Award, Target } from "lucide-react";

function TopCard({ stats }) {
  const cardData = [
    {
      id: 1,
      label: "Total Tests",
      value: stats?.totalTests || 0,
      color: "#3B82F6",
      bg: "bg-[#E4EEFF]",
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      id: 2,
      label: "Average Score",
      value: stats?.averageScore ? parseFloat(stats.averageScore).toFixed(2) : "0.00",
      color: "#22C55E",
      bg: "bg-[#E9FCEB]",
      icon: <Award className="w-5 h-5" />,
    },
    {
      id: 3,
      label: "Improvement",
      value: stats?.improvement ? `${parseFloat(stats.improvement).toFixed(2)}%` : "0.00%",
      color: "#FB923C",
      bg: "bg-[#FFF0E5]",
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      id: 4,
      label: "Rank",
      value: stats?.rank ? `#${stats.rank}` : "#-",
      color: "#A855F7",
      bg: "bg-[#F3E8FF]",
      icon: <Target className="w-5 h-5" />,
    },
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cardData.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-2xl
            bg-white shadow-[0_5px_15px_rgba(0,0,0,0.05)]
            border border-gray-100 px-5 py-4 relative"
            style={{ borderLeft: `4px solid ${item.color}` }}
          >
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">
                {item.label}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {item.value}
              </p>
            </div>

            <div
              className={`flex items-center justify-center w-10 h-10 rounded-xl ${item.bg}`}
              style={{ color: item.color }}
            >
              {item.icon}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopCard;
