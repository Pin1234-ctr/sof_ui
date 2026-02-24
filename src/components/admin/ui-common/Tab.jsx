import React, { useState } from "react";

/* ROOT */
export function Tabs({ defaultValue, children, className = "" }) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  // Pass activeTab + setActiveTab to ALL children
  const enhance = (child) => {
    if (!child) return null;
    return React.cloneElement(child, { activeTab, setActiveTab });
  };

  return (
    <div className={"flex flex-col gap-4 " + className}>
      {React.Children.map(children, enhance)}
    </div>
  );
}

/* TAB LIST */
export function TabsList({
  children,
  className = "",
  activeTab,
  setActiveTab,
}) {
  const enhance = (child) => {
    if (!child) return null;
    return React.cloneElement(child, { activeTab, setActiveTab });
  };

  return (
    <div
      className={
        "inline-flex items-center bg-gray-100 text-black font-semibold rounded-full p-2 gap-1 w-fit" +
        className
      }
    >
      {React.Children.map(children, enhance)}
    </div>
  );
}

/* TAB BUTTON */
export function TabsTrigger({
  value,
  activeTab,
  setActiveTab,
  children,
  className = "",
}) {
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={
        (isActive
          ? "bg-blue-600 text-white "
          : "text-gray-700 hover:bg-gray-200 ") +
        "px-3 py-1.5 rounded-full text-sm transition-all " +
        className
      }
    >
      {children}
    </button>
  );
}

/* TAB CONTENT */
export function TabsContent({ value, activeTab, children, className = "" }) {
  if (value !== activeTab) return null;

  return <div className={"mt-4 " + className}>{children}</div>;
}
