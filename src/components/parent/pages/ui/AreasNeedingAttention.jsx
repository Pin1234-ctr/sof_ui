import React from "react";

function AreasNeedingAttention({ data = [] }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 md:p-6 h-full">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
        Areas Needing Attention
      </h3>

      {data.length > 0 ? (
        <div className="space-y-3">
          {data.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-lg bg-red-50/60 px-4 py-3"
            >
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {item.subject_name} - {item.topic_name}
                </p>
                <p className="text-xs text-slate-500">Accuracy: {item.accuracy}%</p>
              </div>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full bg-red-100 text-red-600`}
              >
                Weak
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500 text-center py-8">No specific areas needing attention right now. Great job!</p>
      )}
    </div>
  );
}

export default AreasNeedingAttention;
