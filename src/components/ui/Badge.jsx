import React from "react";

export function Badge({ children, className = "" }) {
  return (
    <span
      className={
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit gap-1 " +
        className
      }
    >
      {children}
    </span>
  );
}
