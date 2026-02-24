import { useState, useEffect, useContext, useRef } from "react";
import { ClipboardList, Plus, CheckCircle, Loader } from "lucide-react";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { Toast } from "primereact/toast";
import ApiService from "../../../../service/ApiService";
import { GET_APIS, POST_APIS } from "../../../../../connection";
import { UserContext } from "../../../../common/helper/UserContext";
import { useAuth } from "../../../../common/helper/AuthContext";
import { ProgressBar } from 'primereact/progressbar';


export default function GenerateTestParent() {
  const [selectedChild, setSelectedChild] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [dueDate, setDueDate] = useState(null);
  const [numQuestions, setNumQuestions] = useState("20");
  const [difficulty, setDifficulty] = useState("");
  const [timeLimit, setTimeLimit] = useState("30");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { childdetails } = useContext(UserContext);
  const { user } = useAuth();
  const toast = useRef(null);
  const [isQuestionsTouched, setIsQuestionsTouched] = useState(false);
  const [isTimeTouched, setIsTimeTouched] = useState(false);


  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await ApiService(GET_APIS.subjectsdataurl);
        if (response && response.data) {
          setSubjects(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
      } finally {
        setIsPageLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  const difficulties = [
    { label: "Easy", value: "easy" },
    { label: "Medium", value: "medium" },
    { label: "Hard", value: "hard" },
    { label: "Mixed", value: "mixed" },
  ];

  const children = childdetails.map(child => ({
    id: child.student_id, fullName: child.name
  }));

  const createTest = async () => {
    if (!selectedChild || !selectedSubject || !difficulty || !dueDate) {
      toast.current.show({ severity: 'warn', summary: 'Missing Fields', detail: 'Please fill in all required fields.', life: 3000 });
      return;
    }

    setIsLoading(true);

    // Format date to YYYY-MM-DD
    const formattedDueDate = new Date(dueDate).toISOString().split('T')[0];

    const payload = {
      studentId: selectedChild,
      creatorId: user?.id,
      subjectId: selectedSubject,
      questions: Number(numQuestions),
      timeLimit: Number(timeLimit),
      difficulty: difficulty,
      dueDate: formattedDueDate
    };

    try {
      const response = await ApiService(POST_APIS.assigntest, {
        method: 'POST',
        body: payload,
      });

      if (response.isSuccess) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Test assigned successfully!', life: 3000 });
        setSelectedChild("");
        setSelectedSubject("");
        setDifficulty("");
        setDueDate(null);
        setNumQuestions("20");
        setTimeLimit("30");
        setIsQuestionsTouched(false);
        setIsTimeTouched(false);
      } else {
        toast.current.show({ severity: 'error', summary: 'Error', detail: response.message || 'Failed to assign test.', life: 3000 });
      }
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'API Error', detail: error.message || 'An error occurred.', life: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateProgress = () => {
    let completed = 0;
    if (selectedChild) completed++;
    if (selectedSubject) completed++;
    if (difficulty) completed++;
    if (dueDate) completed++;
    if (isQuestionsTouched) completed++;
    if (isTimeTouched) completed++;

    return Math.floor((completed / 6) * 100);
  };

  const progress = calculateProgress();

  return (
    <div className="flex flex-col h-full">
      <Toast ref={toast} />
      {/* Header */}
      <h2 className="text-[#1C398E] text-xl font-semibold">Test Generator</h2>
      <p className="text-[#4A5565] mb-6">
        Create customized tests for your children
      </p>

      {isPageLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="animate-spin text-blue-600" size={40} />
          <p className="ml-4 text-gray-600">Loading Test Generator...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 w-full">

          {/* Form Card */}
          <div className="xl:col-span-2 p-8 space-y-6 border-gray-200 shadow-sm bg-white rounded-2xl border-2">

            {/* Child Select */}
            <div className="space-y-2">
              <label className="font-medium text-sm">Select Child<span className="text-red-600"> *</span></label>
              <Dropdown
                value={selectedChild}
                onChange={(e) => setSelectedChild(e.value)}
                options={children}
                optionLabel="fullName"
                optionValue="id"
                placeholder="Choose a child"
                className="w-full"
                filter
                showClear
              />
            </div>

            {/* Subject Select */}
            <div className="space-y-2">
              <label className="font-medium text-sm">Select Subject<span className="text-red-600"> *</span></label>
              <Dropdown
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.value)}
                options={subjects}
                optionLabel="subject_name"
                optionValue="subject_id"
                placeholder="Choose a subject"
                className="w-full"
                filter
                showClear
              />
            </div>

            {/* Questions & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="font-medium text-sm">Number of Questions<span className="text-red-600"> *</span></label>
                <InputNumber
                  value={Number(numQuestions)}
                  onValueChange={(e) => setNumQuestions(e.value?.toString() || "20")}
                  onFocus={() => setIsQuestionsTouched(true)}
                  min={10} max={50}
                  showButtons
                  inputClassName="text-sm w-full"
                  className="w-full"
                />

              </div>
              <div className="space-y-2">
                <label className="font-medium text-sm">Time Limit (minutes)<span className="text-red-600"> *</span></label>
                <InputNumber
                  value={Number(timeLimit)}
                  onValueChange={(e) => setTimeLimit(e.value?.toString() || "30")}
                  onFocus={() => setIsTimeTouched(true)}
                  min={10} max={120}
                  showButtons
                  inputClassName="text-sm w-full"
                  className="w-full"
                />

              </div>
            </div>

            {/* Difficulty */}
            <div className="space-y-2">
              <label className="font-medium text-sm">Difficulty Level<span className="text-red-600"> *</span></label>
              <Dropdown
                value={difficulty}
                onChange={(e) => setDifficulty(e.value)}
                options={difficulties}
                optionLabel="label"
                placeholder="Choose difficulty"
                className="w-full"
                filter
                showClear
              />
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <label className="font-medium text-sm">Due Date<span className="text-red-600"> *</span></label>
              <Calendar
                value={dueDate}
                onChange={(e) => setDueDate(e.value)}
                dateFormat="yy-mm-dd"
                placeholder="Select a due date"
                className="w-full"
                showIcon
                minDate={new Date()}
              />
            </div>

            {/* Button */}
            <button
              onClick={createTest}
              disabled={isLoading || progress !== 100}
              className={`w-full rounded-lg py-3 flex justify-center items-center gap-2 font-medium cursor-pointer 
    ${progress !== 100 ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"}
  `}>
              {isLoading ? "Assigning..." : (<><Plus size={20} />Assign Test</>)}
            </button>

          </div>

          {/* Summary Card */}
          <div className="xl:col-span-1 bg-white rounded-2xl p-8 border-2 border-gray-200 flex flex-col">
            <div className="flex items-center gap-2">
              <ClipboardList className="text-blue-600" size={25} />
              <p className="font-semibold text-blue-900 text-lg">Test Summary</p>
            </div>

            <div className="text-sm space-y-4 flex flex-col justify-between mt-4">
              <div>
                <span className="text-gray-800">Student:</span>
                <p className="text-gray-600">
                  {selectedChild ? children.find(c => c.id === selectedChild)?.fullName : "Not selected"}
                </p>
              </div>
              <div>
                <span className="text-gray-800">Subject:</span>
                <p className="text-gray-600">{selectedSubject ? subjects.find(s => s.subject_id === selectedSubject)?.subject_name : "Not selected"}</p>
              </div>

              <div className="grid grid-cols-2 pt-3 border-t border-gray-200 gap-3">
                <div>
                  <span className="text-gray-800">Questions:</span>
                  <p className="text-blue-600">{numQuestions}</p>
                </div>
                <div>
                  <span className="text-gray-800">Time:</span>
                  <p className="text-blue-600">{timeLimit} min</p>
                </div>
              </div>

              <div>
                <span className="text-gray-800">Difficulty:</span>
                <p className="capitalize text-gray-600">{difficulty || "Not selected"}</p>
              </div>

              <div>
                <span className="text-gray-800">Due Date:</span>
                <p className="text-gray-600">{dueDate ? new Date(dueDate).toLocaleDateString() : "Not selected"}</p>
              </div>
              <div>
                {/* Progress Bar */}
                <div className="w-full mb-6">
                  <label className="text-sm font-medium text-gray-700">
                    Progress
                  </label>

                  <ProgressBar
                    value={progress}
                    showValue
                    color={progress === 100 ? "#16a34a" : "#2563eb"}
                    style={{ height: "20px", marginTop: "8px" }}
                    displayValueTemplate={(value) => `${value}%`}
                  />

                  {progress === 100 && (
                    <p className="text-green-600 flex items-center gap-1 mt-2 text-sm font-medium">
                      <CheckCircle size={18} /> Ready to assign!
                    </p>
                  )}
                </div>
                {showSuccess && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-start gap-2">
                    <CheckCircle className="text-green-600 mt-1" size={18} />
                    <span className="text-sm text-green-700">
                      Test has been assigned to the student!
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
