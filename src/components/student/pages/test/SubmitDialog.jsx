import { Dialog } from "primereact/dialog";
import { AlertCircle } from "lucide-react";

export default function SubmitDialog({
  visible,
  onHide,
  onSubmit,
  answeredCount,
  totalQuestions,
}) {
  const unansweredCount = totalQuestions - answeredCount;

  return (
    <Dialog
      header="Submit Test?"
      visible={visible}
      onHide={onHide}
      style={{ width: "30rem" }}
      breakpoints={{ "640px": "90vw" }}
      className="rounded-xl overflow-hidden w-full"
      position="center"
      draggable={false}
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-600 mt-1">
          Please review your answers before submitting.
        </p>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-2xl text-green-600">{answeredCount}</p>
            <p className="text-xs text-gray-600">Answered</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl text-gray-600">{unansweredCount}</p>
            <p className="text-xs text-gray-600">Unanswered</p>
          </div>
        </div>

        {unansweredCount > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="size-5 text-yellow-600 shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-900">
              You have {unansweredCount} unanswered question(s). Are you sure
              you want to submit?
            </p>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onHide} className="flex-1 border rounded-md cursor-pointer px-4 py-2 text-sm">
            Cancel
          </button>
          <button type="button" onClick={onSubmit} className="flex-1 cursor-pointer bg-green-600 hover:bg-green-700 text-white rounded-md px-4 py-2 text-sm">
            Submit Test
          </button>
        </div>
      </div>
    </Dialog>
  );
}