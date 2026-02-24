import { useState } from "react";
import { BookOpen, Sparkles, Target } from "lucide-react";
import MyTests from "../steps/MyTests";
import SmartStudy from "../steps/SmartStudy";
import SelfPractice from "../steps/SelfPractice";
import TestInterface from "../test/TestInterface";

function StudentDashboard() {
  const [screen, setScreen] = useState("dashboard");
  const [selectedTestId, setSelectedTestId] = useState(null);
  const [activeTab, setActiveTab] = useState("tests");

  const handleStartTest = (testId) => {
    setSelectedTestId(testId);
    setScreen("test");
  };

  const handleTestComplete = () => {
    setScreen("dashboard"); // return to dashboard
  };

  // When test is running
  if (screen === "test") {
    return (
      <TestInterface
        testId={selectedTestId}
        studentName="Student Name"
        onComplete={handleTestComplete}
      />
    );
  }

  return (
    <div className="  mx-auto px-8 py-8">
      {/* Tabs */}
      <div className="flex gap-4 pb-6">
        {[
          {
            id: "tests",
            label: "My Tests",
            icon: <BookOpen className="size-4" />,
          },
          {
            id: "smart",
            label: "Smart Study",
            icon: <Sparkles className="size-4" />,
          },
          {
            id: "practice",
            label: "Self Practice",
            icon: <Target className="size-4" />,
          },
        ].map((tab) => {
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

      {/* Content */}
      {activeTab === "tests" && (
        <MyTests
          key={screen} // <-- FIX: refresh tests after completing exam
          onStartTest={handleStartTest}
        />
      )}

      {activeTab === "smart" && <SmartStudy />}
      {activeTab === "practice" && (
        <SelfPractice />
      )}
    </div>
  );
}

export default StudentDashboard;
