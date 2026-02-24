import React, { useState} from 'react'
import ManageChild from '../manage-child/ManageChild'
import GenerateTestParent from '../generate-test/GenerateTestParent'
import ChildPerformance from '../child-performance/ChildPerformance'
import SmartAssistantChat from '../smart-assistant/SmartAssistantChat'


function ParentDashboard() {
  const [activeTab, setActiveTab] = useState("children");
 

  return (
    <div className="px-8 md:px-16 py-6 w-full">

      <div className="flex gap-4 pb-6">
        {[
          { id: "children", label: "Children" },
          { id: "test", label: "Test Generator" },
          { id: "performance", label: "Child Performance" },
          { id: "smart-assistant", label: "Smart Assistant" },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-6 py-3 rounded-xl font-semibold cursor-pointer
                ${isActive
                  ? "bg-[#1C398E] text-white"
                  : "bg-[#E8F0FF] text-[#1C398E] hover:bg-[#bcd2ff]"
                }
              `}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
     {activeTab === "children" && <ManageChild />}
      {activeTab === "test" && <GenerateTestParent />}
      {activeTab === "performance" && <ChildPerformance />}
      {activeTab === "smart-assistant" && <SmartAssistantChat />}
    </div>
  );
}

export default ParentDashboard;
