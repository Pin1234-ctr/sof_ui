import { useState, useEffect, useRef } from "react";
import { Card } from "../../../ui/Cards";
import { Badge } from "../../../ui/Badge";
import { Shuffle, Target, Loader } from "lucide-react";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { GET_APIS, POST_APIS } from "../../../../../connection";
import ApiService from "../../../../service/ApiService";
import { Toast } from "primereact/toast";

export default function SelfPractice() {
  const [subject, setSubject] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [numQuestions, setNumQuestions] = useState("10");
  const [subjects, setSubjects] = useState([]); // ← API DATA
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [examTime, setExamTime] = useState(20); // default 20 minutes
  const [errors, setErrors] = useState({});
  const [stats, setStats] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const toast = useRef(null);

  const difficulties = [
    { label: "Easy - Build Foundation", value: "easy" },
    { label: "Medium - Regular Practice", value: "medium" },
    { label: "Hard - Challenge Yourself", value: "hard" },
    { label: "Mixed - All Levels", value: "mixed" },
  ];

  // -------------------------------------------
  // Fetch Subjects from API
  // -------------------------------------------
  const fetchSubjects = async () => {
    try {
      const json = await ApiService(GET_APIS.subjectsdataurl, {
        method: "GET",
      });

      if (json.isSuccess && Array.isArray(json.data)) {
        const loadedSubjects = json.data.map((s) => ({
          value: s.subject_id,
          label: s.subject_name,
        }));
        setSubjects(loadedSubjects);
      }
    } catch (err) {
      console.error("Error fetching subjects:", err);
    } finally {
      setLoadingSubjects(false);
    }
  };

  const fetchSelfPracticeDashboard = async () => {
    try {
      const stored = JSON.parse(localStorage.getItem("user"));
      const studentId = stored?.userData?.id;

      setLoading(true); // start loader
      setError(false);

      // Hit API
      const json = await ApiService(
        `${GET_APIS.selfpracticedashboardurl}/${studentId}`,
        {
          method: "GET",
        }
      );

      // If API failed
      if (!json.isSuccess || !json.data) {
        setError(true);
        return;
      }

      // SUCCESS
      const data = json.data;

      setStats(data.stats || {});
      setRecommended(data.recommended || []);
    } catch (err) {
      console.error("SELF PRACTICE ERROR:", err);
      setError(true);
    } finally {
      setLoading(false); // stop loader
    }
  };

  useEffect(() => {
    fetchSubjects();
    fetchSelfPracticeDashboard();
  }, []);

  const getSubjectId = (name) => {
    return subjects.find((s) => s.label === name)?.value || null;
  };

  const validateForm = () => {
    let tempErrors = {};

    if (!subject) {
      tempErrors.subject = "Please select a subject.";
    }

    if (!difficulty) {
      tempErrors.difficulty = "Please select difficulty level.";
    }

    if (!numQuestions || numQuestions < 5) {
      tempErrors.numQuestions = "Enter at least 5 questions.";
    }

    if (!examTime || examTime < 5) {
      tempErrors.examTime = "Exam time must be at least 5 minutes.";
    }

    setErrors(tempErrors);

    return Object.keys(tempErrors).length === 0;
  };

  const handleGeneratePractice = async () => {
    if (!validateForm()) return; //  stop if validation fails

    try {
      // Get studentId from localStorage
      const stored = JSON.parse(localStorage.getItem("user"));
      const studentId = stored?.userData?.id;

      if (!studentId) {
        console.error("No student data found. Please login again.");
        return;
      }

      const payload = {
        studentId: studentId,
        subjectId: subject, // comes from dropdown
        questions: Number(numQuestions), // InputNumber
        timeLimit: Number(examTime),
        difficulty: difficulty, // dropdown difficulty
      };

      console.log("Practice Payload:", payload);

      const json = await ApiService(POST_APIS.generatetest, {
        method: "POST",
        body: payload,
      });

      if (json.isSuccess) {
        // SUCCESS TOAST
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Practice test generated successfully!",
          life: 2000,
        });

        // RESET INPUTS
        setSubject(null);
        setDifficulty(null);
        setNumQuestions(null);
        setExamTime(null);

        // RESET ERRORS
        setErrors({});
      }
    } catch (error) {
      console.error("Generate Practice Error:", error);

      // ERROR TOAST
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to generate practice test.",
        life: 2000,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin text-blue-600" size={40} />
        <p className="ml-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-gray-500 py-10">
        Failed to load dashboard data.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast must be here */}
      <Toast ref={toast} />

      <div>
        <h2 className="text-blue-900 text-xl font-medium mb-2">
          Self Practice
        </h2>
        <p className="text-gray-600">
          Generate random question sets to practice at your own pace
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Practice Generator */}
        <Card className="lg:col-span-2 p-6 border-2 border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Shuffle className="size-5 text-blue-600" />
            <h3 className="text-blue-900">Create Practice Session</h3>
          </div>

          <div className="space-y-6">
            {/* SUBJECT */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Select Subject *
              </label>

              <Dropdown
                value={subject}
                onChange={(e) => {
                  setSubject(e.value);
                  setErrors((prev) => ({ ...prev, subject: "" }));
                }}
                options={subjects}
                optionLabel="label"
                placeholder={
                  loadingSubjects ? "Loading..." : "Choose a Subject"
                }
                filter
                filterBy="label"
                className={`w-full ${errors.subject ? "p-invalid" : ""}`}
                showClear
                disabled={loadingSubjects}
                appendTo="self"
              />

              {errors.subject && (
                <p className="text-red-500 text-xs mt-1">{errors.subject}</p>
              )}
              {subject && (
                <p className="text-sm text-gray-600">
                  Selected: {subjects.find((s) => s.value === subject)?.label}
                </p>
              )}
            </div>

            {/* DIFFICULTY */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Difficulty Level *
              </label>

              <Dropdown
                value={difficulty}
                onChange={(e) => {
                  setDifficulty(e.value);
                  setErrors((prev) => ({ ...prev, difficulty: "" }));
                }}
                options={difficulties}
                optionLabel="label"
                placeholder="Choose Difficulty"
                filter
                filterBy="label"
                className={`w-full ${errors.difficulty ? "p-invalid" : ""}`}
                showClear
                appendTo="self"
              />
              {errors.difficulty && (
                <p className="text-red-500 text-xs mt-1">{errors.difficulty}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* EXAM TIME */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Exam Time (Minutes)
                </label>

                <InputNumber
                  value={examTime}
                  onValueChange={(e) => {
                    setExamTime(e.value);
                    setErrors((prev) => ({ ...prev, examTime: null }));
                  }}
                  min={5}
                  max={60}
                  step={1}
                  showButtons
                  placeholder="Select time in minutes"
                  className="w-full"
                  inputClassName={`text-sm ${
                    errors.examTime ? "border-red-500 bg-red-50" : ""
                  }`}
                />

                {errors.examTime && (
                  <p className="text-red-500 text-xs mt-1">{errors.examTime}</p>
                )}

                <p className="text-xs text-gray-600">
                  Recommended: 20–30 minutes
                </p>
              </div>

              {/* NUMBER OF QUESTIONS */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Number of Questions
                </label>

                <InputNumber
                  value={numQuestions}
                  onValueChange={(e) => {
                    setNumQuestions(e.value);
                    setErrors((prev) => ({ ...prev, numQuestions: null }));
                  }}
                  min={5}
                  max={50}
                  showButtons
                  step={1}
                  placeholder="Enter questions"
                  inputClassName={`text-sm ${
                    errors.numQuestions ? "border-red-500 bg-red-50" : ""
                  }`}
                  className="w-full"
                />

                {errors.numQuestions && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.numQuestions}
                  </p>
                )}

                <p className="text-xs text-gray-600">
                  Recommended: 10–20 questions per session
                </p>
              </div>
            </div>

            {/* Benefits Box */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="text-sm text-blue-900 mb-2">Practice Benefits:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">✓</span> No time limit
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">✓</span> Instant feedback
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">✓</span> SOF question bank
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">✓</span> Track improvement
                </li>
              </ul>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              onClick={handleGeneratePractice}
              className="w-full cursor-pointer bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2"
            >
              <Shuffle className="size-5" />
              Generate Test
            </button>
          </div>
        </Card>

        {/* Right Column */}
        <div className="space-y-4 flex flex-col">
          {/* Stats */}
          <Card className="p-6 border-2 border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Target className="size-5 text-green-600" />
              <h3 className="text-blue-900">Your Practice Stats</h3>
            </div>

            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Sessions This Week</span>
                <span className="text-blue-900">{stats.sessionsThisWeek}</span>
              </div>

              <div className="flex justify-between">
                <span>Questions Solved</span>
                <span className="text-blue-900">{stats.questionsSolved}</span>
              </div>

              <div className="flex justify-between">
                <span>Average Accuracy</span>
                <span
                  className={
                    Number(stats.averageAccuracy) > 50
                      ? "text-green-600"
                      : "text-orange-600"
                  }
                >
                  {stats.averageAccuracy}%
                </span>
              </div>
            </div>
          </Card>

          {/* Recommendations */}
          <Card className="p-6 border-2 border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-blue-900">Recommended</h3>
            </div>

            <div className="space-y-3">
              {recommended.length === 0 ? (
                <p className="text-center text-gray-500 text-sm py-3">
                  No recommendations available
                </p>
              ) : (
                recommended.map((item, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg border ${
                      item.tag === "Priority"
                        ? "bg-orange-50 border-orange-200"
                        : "bg-blue-50 border-blue-200"
                    }`}
                  >
                    <div className="flex justify-between mb-1">
                      <h4 className="text-sm text-blue-900">{item.topic}</h4>

                      <Badge
                        className={`text-xs border ${
                          item.tag === "Priority"
                            ? "bg-orange-100 text-orange-700 border-orange-200"
                            : "bg-blue-100 text-blue-700 border-blue-200"
                        }`}
                      >
                        {item.tag}
                      </Badge>
                    </div>

                    <p className="text-xs text-gray-600">{item.detail}</p>
                  </div>
                ))
              )}
            </div>
          </Card>
          {/* Quick Start Presets */}
          <Card className="p-6 border-2 border-gray-200 grow">
            <h3 className="text-blue-900 mb-4">Quick Start</h3>
            <div className="space-y-2">
              {/* EASY MATH */}
              <button
                className="w-full cursor-pointer flex items-center gap-2 justify-start border border-gray-300 rounded-md px-3 py-2 text-sm hover:bg-gray-100"
                onClick={() => {
                  setSubject(getSubjectId("Mathematics"));
                  setDifficulty("easy");
                  setNumQuestions("10");
                }}
              >
                <Shuffle className="size-4 mr-2" />
                Easy Math - 10Q
              </button>

              {/* MEDIUM SCIENCE */}
              <button
                className="w-full cursor-pointer flex items-center gap-2 justify-start border border-gray-300 rounded-md px-3 py-2 text-sm hover:bg-gray-100"
                onClick={() => {
                  setSubject(getSubjectId("Science"));
                  setDifficulty("medium");
                  setNumQuestions("15");
                }}
              >
                <Shuffle className="size-4 mr-2" />
                Medium Science - 15Q
              </button>

              {/* HARD ENGLISH */}
              <button
                className="w-full cursor-pointer flex items-center gap-2 justify-start border border-gray-300 rounded-md px-3 py-2 text-sm hover:bg-gray-100"
                onClick={() => {
                  setSubject(getSubjectId("English"));
                  setDifficulty("hard");
                  setNumQuestions("20");
                }}
              >
                <Shuffle className="size-4 mr-2" />
                Hard English - 20Q
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
