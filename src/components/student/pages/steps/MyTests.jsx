import { useEffect, useState } from "react";
import { Card } from "../../../ui/Cards";
import { Badge } from "../../../ui/Badge";
import {
  Clock,
  PlayCircle,
  CheckCircle,
  Calendar,
  AlertCircle,
  BookOpen,
  Loader,
  Award, // <-- ADD
  Target, // <-- ADD
  TrendingUp, // <-- ADD
} from "lucide-react";
import ApiService from "../../../../service/ApiService";
import { POST_APIS } from "../../../../../connection";

import { Dialog } from "primereact/dialog";

export default function MyTests({ onStartTest }) {
  const [pendingTests, setPendingTests] = useState([]);
  const [completedTests, setCompletedTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // -----------------------------
  // Fetch Tests from API
  // -----------------------------
  const fetchTests = async () => {
    try {
      // Read student ID from localStorage
      const stored = JSON.parse(localStorage.getItem("user"));
      const studentId = stored?.userData?.id;

      if (!studentId) {
        console.error("No student ID found in localStorage");
        setLoading(false);
        return;
      }

      const json = await ApiService(POST_APIS.testresult, {
        method: "POST",
        body: { student_id: studentId },
      });

      if (json.isSuccess && Array.isArray(json.data)) {
        const all = json.data;

        // Split into pending & completed
        const pending = all.filter((t) => t.status === "pending");
        const completed = all.filter((t) => t.status === "completed");

        // Convert API fields to match UI structure
        setPendingTests(
          pending.map((t) => ({
            id: t.test_id,
            title: t.test_title,
            subject: t.subject_name,
            questions: t.total_questions,
            duration: t.duration_minutes,
            status: t.status,
            dueDate: t.due_date, // can be null
            time_taken_seconds: t.time_taken_seconds, // can be null
          }))
        );

        setCompletedTests(
          completed.map((t) => ({
            id: t.test_id,
            title: t.test_title,
            subject: t.subject_name,
            questions: t.total_questions,
            duration: t.duration_minutes,
            status: t.status,

            completedDate: t.completed_at,

            //  use correct accuracy field from API
            score: t.score_obtained ? Number(t.score_obtained) : 0,
            accuracypercentage: t.accuracy_percentage || 0,

            //  new fields from API
            correct: t.correct_answers,
            incorrect: t.incorrect_answers,
            timeTaken: t.time_taken_seconds,
            timeManagement: t.performance_breakdown?.timeManagement || "Good",
            timeManagementaccuracy: t.performance_breakdown?.accuracy || "Good",
          }))
        );
      }
    } catch (error) {
      console.error("API ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const getStatusBadge = (status) => {
    if (status === "pending") {
      return (
        <Badge className="bg-blue-50 text-blue-700 border-blue-200 border">
          <Clock className="size-3 mr-1" />
          Pending
        </Badge>
      );
    }
    if (status === "completed") {
      return (
        <Badge className="bg-green-50 text-green-700 border-green-200 border">
          <CheckCircle className="size-3 mr-1" />
          Completed
        </Badge>
      );
    }
    if (status === "overdue") {
      return (
        <Badge className="bg-red-50 text-red-700 border-red-200 border">
          <AlertCircle className="size-3 mr-1" />
          Overdue
        </Badge>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-80">
        <Loader className="animate-spin text-blue-600" size={40} />
        <p className="ml-4 text-gray-600">Loading Children...</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Pending Tests */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-blue-900">Pending Tests</h2>
              <p className="text-sm text-gray-600">
                Complete these tests before the due date
              </p>
            </div>
            <Badge className="bg-blue-600 text-white px-3 py-1 rounded-md">
              {pendingTests.length} Tests
            </Badge>
          </div>

          <div className="space-y-3">
            {pendingTests.length === 0 ? (
              <Card className="p-6 border-2 border-dashed border-gray-300 bg-gray-50">
                <div className="flex items-center justify-center text-center gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center shrink-0">
                    <CheckCircle className="size-5 text-gray-500" />
                  </div>
                  <div className="text-left flex-grow">
                    <h3 className="text-blue-900 font-semibold">All Caught Up!</h3>
                    <p className="text-sm text-gray-600">
                      There are no pending tests at the moment.
                    </p>
                  </div>
                </div>
              </Card>
            ) : (
              pendingTests.map((test) => (
                <Card
                  key={test.id}
                  className={
                    "p-6 hover:shadow-md transition-shadow border-2" +
                    (test.status === "overdue"
                      ? " border-red-200 bg-red-50/50"
                      : " border-gray-200")
                  }
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Left Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                          <PlayCircle className="size-5 text-white" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="text-blue-900">{test.title}</h3>
                            {getStatusBadge(test.status)}
                          </div>

                          <p className="text-sm text-gray-600 mb-2">
                            {test.subject}
                          </p>

                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <BookOpen className="size-4" />
                              {test.questions} Questions
                            </div>

                            <div className="flex items-center gap-1">
                              <Clock className="size-4" />
                              {test.duration} Minutes
                            </div>

                            <div className="flex items-center gap-1">
                              <Calendar className="size-4" />
                              Due: {new Date(test.dueDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Replace Button component with RAW button */}
                    <button
                      onClick={() => onStartTest(test.id)}
                      className={
                        (test.status === "overdue"
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-blue-600 hover:bg-blue-700") +
                        " text-white px-4 py-2 rounded-md w-full sm:w-auto flex items-center justify-center cursor-pointer"
                      }
                    >
                      <PlayCircle className="size-4 mr-2" />
                      Start Test
                    </button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Completed Tests */}
        <div>
          <h2 className="text-blue-900 mb-1">Completed Tests</h2>
          <p className="text-sm text-gray-600 mb-4">
            Review your past performance
          </p>

          <div className="space-y-3">
            {completedTests.length === 0 ? (
              <div className="text-center py-6 text-gray-500 ">
                No completed tests found
              </div>
            ) : (
              completedTests.map((test) => (
                <Card
                  key={test.id}
                  className="p-6 hover:shadow-md transition-shadow border-2 border-gray-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <CheckCircle className="size-5 text-green-600" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="text-blue-900">{test.title}</h3>
                            {getStatusBadge(test.status)}
                          </div>

                          <p className="text-sm text-gray-600 mb-2">
                            {test.subject}
                          </p>

                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <BookOpen className="size-4" />
                              {test.questions} Questions
                            </div>

                            <div className="flex items-center gap-1">
                              <Calendar className="size-4" />
                              Completed:{" "}
                              {test.completedDate
                                ? new Date(
                                    test.completedDate
                                  ).toLocaleDateString()
                                : "-"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Replace Button component here too */}
                    <button
                      className="px-4 py-2 cursor-pointer rounded-md border bg-white text-blue-600 w-full sm:w-auto"
                      onClick={() => {
                        setSelectedTest({ ...test }); // ← ensures fresh object clone
                        setIsDetailsOpen(true);
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
      <Dialog
        visible={isDetailsOpen}
        onHide={() => setIsDetailsOpen(false)}
        header={null}
        closable={false}
        className="w-full max-w-xl rounded-lg"
        modal
      >
        {/* Custom Close Button */}
        <button
          onClick={() => setIsDetailsOpen(false)}
          className="absolute top-4 right-6 text-gray-500 hover:text-gray-700 text-xl cursor-pointer z-50"
        >
          ✕
        </button>

        <div className="relative bg-white rounded-lg w-full p-2">
          <div className="overflow-y-auto max-h-[70vh] w-full pr-2">
            {selectedTest && (
              <>
                {/* Header */}
                <div className="mb-4">
                  <h2 className="text-blue-900 flex items-center gap-2 text-xl font-semibold mb-2">
                    <Award className="size-6 text-blue-600" />
                    {selectedTest.title}
                  </h2>

                  <p className="text-gray-600 text-sm">
                    {selectedTest.completedDate
                      ? `Completed on ${new Date(
                          selectedTest.completedDate
                        ).toLocaleDateString()}`
                      : "Test Details"}
                  </p>
                </div>

                <div className="space-y-6 mt-4">
                  {/* SCORE CARD */}
                  <div className="bg-linear-to-r from-blue-50 to-green-50 p-6 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          Overall Score
                        </p>
                        <div className="flex items-baseline gap-2">
                          {/* OVERALL SCORE */}
                          <span
                            className={`text-4xl ${
                              selectedTest.score >= 80
                                ? "text-green-600"
                                : selectedTest.score >= 60
                                ? "text-blue-600"
                                : "text-orange-600"
                            }`}
                          >
                            {selectedTest.score}% {/* accuracy_percentage */}
                          </span>

                          <span className="text-sm text-gray-600">
                            ({selectedTest.correct} / {selectedTest.questions})
                          </span>
                        </div>
                      </div>

                      <div className="p-4 bg-white rounded-full">
                        {selectedTest.score >= 80 ? (
                          <Award className="size-12 text-green-600" />
                        ) : selectedTest.score >= 60 ? (
                          <Target className="size-12 text-blue-600" />
                        ) : (
                          <TrendingUp className="size-12 text-orange-600" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* BASIC INFO */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <Card className="p-4 bg-blue-50 border-blue-100 border">
                      <div className="flex items-center gap-3">
                        <BookOpen className="text-blue-600" />
                        <div>
                          <p className="text-xs text-gray-600">Questions</p>
                          <p className="text-blue-900">
                            {selectedTest.questions}
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4 bg-green-50 border-green-200 border">
                      <div className="flex items-center gap-3">
                        <Clock className="text-green-600" />
                        <div>
                          <p className="text-xs text-gray-600">Duration</p>
                          <p className="text-green-900">
                            {selectedTest.duration} Minutes
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Correct & Incorrect */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <Card className="p-4 bg-purple-50 border-purple-200 border">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-purple-600 rounded-lg">
                          <CheckCircle className="size-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">
                            Correct Answers
                          </p>
                          <p className="text-purple-900">
                            {selectedTest.correct}
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4 bg-orange-50 border-orange-200 border">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-orange-600 rounded-lg">
                          <AlertCircle className="size-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">
                            Incorrect Answers
                          </p>
                          <p className="text-orange-900">
                            {selectedTest.incorrect}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Performance Breakdown */}
                  <Card className="p-6 border-2 border-gray-200">
                    <h4 className="text-blue-900 mb-4">
                      Performance Breakdown
                    </h4>

                    <div className="space-y-4">
                      {/* Accuracy */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">
                            Accuracy
                          </span>
                          <span className="text-sm">{selectedTest.accuracypercentage}%</span>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            style={{ width: `${selectedTest.accuracypercentage}%` }}
                            className={`h-2 rounded-full ${
                              selectedTest.score >= 80
                                ? "bg-green-600"
                                : selectedTest.score >= 60
                                ? "bg-blue-600"
                                : "bg-orange-600"
                            }`}
                          />
                        </div>
                      </div>

                      {/* TIME MANAGEMENT */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">
                            Time Management
                          </span>
                          <span className="text-sm">
                            {selectedTest.timeManagement}{" "}
                            {/* Rushed / Good / Excellent */}
                          </span>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${selectedTest.timeManagementaccuracy }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </>
            )}
          </div>
        </div>
      </Dialog>
    </>
  );
}
