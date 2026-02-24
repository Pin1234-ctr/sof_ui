import { useState } from "react";
import { Users, BookOpen, ClipboardCheck, UsersRound } from "lucide-react";

import ParentsManager from "../steps/ParentsManager";
import StudentsManager from "../steps/StudentsManager";
import AdminResource from "../steps/AdminResource";
import TestAssignment from "../steps/TestAssignment";
import NewAdminResource from "../steps/NewAdminResource";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("parents");

  const tabs = [
    {
      id: "parents",
      label: "Parents",
      icon: <UsersRound className="size-4" />,
    },
    {
      id: "students",
      label: "Students",
      icon: <Users className="size-4" />,
    },
    {
      id: "resources",
      label: "Resources",
      icon: <BookOpen className="size-4" />,
    },
    {
      id: "assign-tests",
      label: "Assign Tests",
      icon: <ClipboardCheck className="size-4" />,
    },
  ];

  return (
    <div className="  h-full mx-auto px-4 py-8">
      {/* TABS (StudentDashboard Style) */}
      <div className="flex gap-4 pb-6">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold cursor-pointer
                  ${
                    isActive
                      ? "bg-[#1C398E] text-white"
                      : "bg-[#E8F0FF] text-[#1C398E] hover:bg-[#bcd2ff]"
                  }
                `}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* CONTENT */}
      {activeTab === "parents" && <ParentsManager />}
      {activeTab === "students" && <StudentsManager />}
      {activeTab === "resources" && <NewAdminResource />}
      {/* {activeTab === "resources" && <AdminResource />} */}
      {activeTab === "assign-tests" && <TestAssignment />}
    </div>
  );
}

export default AdminDashboard;
