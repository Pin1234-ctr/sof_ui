import React from "react";

function StrongAreas({ data = [] }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 md:p-6 h-full">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
        Strong Areas
      </h3>

      {data.length > 0 ? (
        <div className="space-y-3">
          {data.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between rounded-lg px-4 py-3 bg-emerald-50/60`}
            >
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {item.subject_name} - {item.topic_name}
                </p>
                <p className="text-xs text-slate-500">Accuracy: {item.accuracy}%</p>
              </div>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700`}
              >
                Strong
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500 text-center py-8">No strong areas identified yet. Keep practicing!</p>
      )}
    </div>
  );
}

export default StrongAreas;
