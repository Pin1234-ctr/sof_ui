import React from "react";

export function Table({ children, className = "" }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={`w-full text-sm ${className}`}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children, className = "" }) {
  return (
    <thead className={`border-b ${className}`}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className = "" }) {
  return (
    <tbody className={className}>
      {children}
    </tbody>
  );
}

export function TableRow({ children, className = "" }) {
  return (
    <tr className={`border-b hover:bg-gray-50 transition ${className}`}>
      {children}
    </tr>
  );
}

export function TableHead({ children, className = "" }) {
  return (
    <th
      className={`text-left px-3 py-2 font-medium whitespace-nowrap ${className}`}
    >
      {children}
    </th>
  );
}

export function TableCell({ children, className = "" }) {
  return (
    <td
      className={`px-3 py-2 whitespace-nowrap text-gray-700 ${className}`}
    >
      {children}
    </td>
  );
}
