import { Card } from "../../../ui/Cards";
import { CheckCircle } from "lucide-react";

export default function TestSummary({ result, onComplete }) {
  if (!result) return null;

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    return "text-orange-600";
  };

  const getBgColor = (score) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-blue-100";
    return "bg-orange-100";
  };

  return (
    <div className="h-full bg-linear-to-br from-blue-50 via-green-50 to-blue-50 p-4 flex items-center justify-center">
      <Card className="max-w-2xl w-full p-8">
        <div className="text-center mb-8">
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${getBgColor(
              result.score
            )}`}
          >
            <CheckCircle
              className={`size-12 ${getScoreColor(result.score)}`}
            />
          </div>

          <h2 className="text-blue-900 mb-2">Test Completed!</h2>
          <p className="text-gray-600">Great job, {result.studentName}!</p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Your Score</p>
              <p className={`text-3xl ${getScoreColor(result.score)}`}>
                {result.score}%
              </p>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Correct Answers</p>
              <p className="text-3xl text-green-600">
                {result.correctAnswers}/{result.totalQuestions}
              </p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-blue-900 mb-3">Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Questions Answered:</span>
                <span>
                  {result.totalAnswered} / {result.totalQuestions}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onComplete}
              className="flex-1 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 text-sm"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}