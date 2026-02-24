import React from "react";

export function Progress({ value = 0, className = "" }) {
  const percent = Math.min(Math.max(value, 0), 100); // keep between 0–100

  return (
    <div
      className={
        "relative h-2 w-full bg-gray-200 rounded-full overflow-hidden " +
        className
      }
    >
      <div
        className="h-full bg-gray-500 transition-all"
        style={{ width: `${percent}%` }}
      ></div>
    </div>
  );
}
