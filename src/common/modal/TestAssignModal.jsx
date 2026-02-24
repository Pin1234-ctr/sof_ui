import { useState, useEffect, useRef } from 'react';
import {
  ClipboardCheck,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar as PrimeCalendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";
import { Toast } from 'primereact/toast';
import { Badge } from "../../components/ui/Badge";
import ApiService from "../../service/ApiService";
import { GET_APIS, POST_APIS } from "../../../connection";

export default function TestAssignModal({ visible, onHide, onAssignTest }) {
  const toast = useRef(null);
  const initialAssignmentState = {
    testName: '',
    subject: '',
    grade: '',
    duration: 60,
    totalQuestions: 50,
    dueDate: new Date(),
    selectedStudents: [],
    assignToAll: false,
  };

  const [newAssignment, setNewAssignment] = useState(initialAssignmentState);

  const [students, setStudents] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subjectOptions, setSubjectOptions] = useState([]);

  useEffect(() => {
    if (visible) {
      fetchStudentsData();
      fetchSubjects();
      // Reliably reset the form state each time the modal is opened
      setNewAssignment(initialAssignmentState);
    }
  }, [visible]);

  const fetchSubjects = async () => {
    try {
      const response = await ApiService(GET_APIS.subjectsdataurl);
      if (response && response.isSuccess && Array.isArray(response.data)) {
        setAllSubjects(response.data);
        const options = response.data.map((subject) => ({
          label: subject.subject_name,
          value: subject.subject_id,
        }));
        setSubjectOptions(options);
      } else {
        console.error(
          response.message || "Failed to fetch subjects."
        );
      }
    } catch (error) {
      console.error("An error occurred while fetching subjects:", error);
    }
  };

  const fetchStudentsData = async () => {
    try {
      setLoading(true);
      const response = await ApiService(GET_APIS.adminstudentdashboardurl);
      if (response && response.isSuccess) {
        setStudents(response.data.students);
      } else {
        console.error(response.message || "Failed to fetch student data.");
      }
    } catch (error) {
      console.error(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const gradeOptions = [
    { label: "All Grades", value: null },
    ...Array.from({ length: 12 }, (_, i) => ({
      label: `Class ${i + 1}`,
      value: `${i + 1}`,
    })),
  ];

  const filteredStudents = students.filter(
    (student) => !newAssignment.grade || String(student.class_grade) === newAssignment.grade
  );

  const handleStudentToggle = (studentId) => {
    setNewAssignment((prev) => ({
      ...prev,
      selectedStudents: prev.selectedStudents.includes(studentId)
        ? prev.selectedStudents.filter((id) => id !== studentId)
        : [...prev.selectedStudents, studentId],
    }));
  };

  const handleAssignToAll = (checked) => {
    setNewAssignment((prev) => ({
      ...prev,
      assignToAll: checked,
      selectedStudents: checked ? filteredStudents.map((s) => s.user_id) : [],
    }));
  };

  const handleAssign = async () => {
    // Validation
    if (!newAssignment.testName.trim()) {
      toast.current.show({ severity: 'warn', detail: 'Test Name is required.' });
      return;
    }
    if (!newAssignment.subject) {
      toast.current.show({ severity: 'warn', detail: 'Subject is required.' });
      return;
    }
    if (newAssignment.selectedStudents.length === 0) {
      toast.current.show({ severity: 'warn', detail: 'Please select at least one student.' });
      return;
    }

    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));
      const adminId = user?.userData?.id;

      if (!adminId) {
        throw new Error("Admin ID not found. Please log in again.");
      }

      const payload = {
        adminId: adminId,
        testName: newAssignment.testName,
        subjectId: newAssignment.subject, // This should be an integer ID
        gradeLevel: newAssignment.grade ? parseInt(newAssignment.grade) : null,
        duration: newAssignment.duration,
        totalQuestions: newAssignment.totalQuestions,
        dueDate: newAssignment.dueDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        studentIds: newAssignment.selectedStudents,
      };

      const response = await ApiService(POST_APIS.assigntestadmin, { method: 'POST', body: payload });

      if (response?.isSuccess) {
        toast.current.show({ severity: 'success', summary: 'Success', detail: response.message || 'Test assigned successfully!' });
        setTimeout(() => {
          onHide();
          setNewAssignment(initialAssignmentState); // Reset form
          setFilterGrade(null);
        }, 1500);
      } else {
        toast.current.show({ severity: 'error', summary: 'Error', detail: response?.message || 'Failed to assign test.' });
      }
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: error.message || 'An unexpected error occurred.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog visible={visible} onHide={onHide} header="Assign Test to Students" className="w-[90%] md:w-[50%] no-scroll-dialog" position="center" draggable={false}>
      <Toast ref={toast} />
      <div className="pr-2">
        <div className="space-y-2">
          <div className="space-y-1"><label className="text-sm font-medium">Test Name *</label><InputText id="testName" placeholder="e.g., Science Olympiad Mock Test" value={newAssignment.testName} onChange={(e) => setNewAssignment({ ...newAssignment, testName: e.target.value })} className="w-full" />
         </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">
                Subject <span className="text-red-500">*</span>
              </label>
              <Dropdown
                value={newAssignment.subject}
                onChange={(e) =>
                  setNewAssignment({ ...newAssignment, subject: e.value })
                }
                options={subjectOptions}
                placeholder="Select Subject"
                className="w-full"
                showClear
                filter
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Class/Grade Level</label>
              <Dropdown value={newAssignment.grade} onChange={(e) => { 
                setNewAssignment({ 
                  ...newAssignment, 
                  grade: e.value,
                  selectedStudents: [],
                  assignToAll: false,
                }); 
                }} 
                options={gradeOptions.slice(1)} placeholder="Select Class" className="w-full" 
                showClear filter/>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1"><label className="text-sm font-medium">Duration (minutes)</label><InputText id="duration" type="number" value={String(newAssignment.duration)} onChange={(e) => setNewAssignment({ ...newAssignment, duration: parseInt(e.target.value) || 60 })} className="w-full" /></div>

            <div className="space-y-1"><label className="text-sm font-medium">Total Questions</label><InputText id="questions" type="number" value={String(newAssignment.totalQuestions)} onChange={(e) => setNewAssignment({ ...newAssignment, totalQuestions: parseInt(e.target.value) || 50 })} className="w-full" /></div>

            <div className="space-y-1"><label className="text-sm font-medium">Due Date</label><PrimeCalendar value={newAssignment.dueDate} onChange={(e) => e.value && setNewAssignment({ ...newAssignment, dueDate: e.value })} className="w-full" showIcon /></div>
          </div>
        </div>
        <div className="space-y-3 pt-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Select Students *</label>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2"><Checkbox inputId="assignToAll" checked={newAssignment.assignToAll} onChange={(e) => handleAssignToAll(e.checked)} /><label htmlFor="assignToAll" className="cursor-pointer text-sm">Assign to all filtered students</label></div>
            </div>
          </div>
          <div className="border rounded-lg p-4 max-h-48 overflow-y-auto space-y-2">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <div key={student.user_id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                  <Checkbox inputId={`student-${student.user_id}`} value={student.user_id} checked={newAssignment.selectedStudents.includes(student.user_id)} onChange={() => handleStudentToggle(student.user_id)} />

                  <label htmlFor={`student-${student.user_id}`} className="flex-1 cursor-pointer flex items-center justify-between">
                    <div><p>{student.student_name}</p><p className="text-sm text-gray-500">{student.student_email}</p></div>
                    <div className="flex gap-2"><Badge className="bg-gray-100 text-gray-800 border-0">Class {student.class_grade}</Badge><Badge className="bg-blue-50 text-blue-800 border-0">{student.parent_name}</Badge></div>
                  </label>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">
                <p>No students found.</p>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600">{newAssignment.selectedStudents.length} student(s) selected</p>
        </div>
      </div>
      <div className="flex justify-end gap-2 p-4 bg-gray-50 border-t">
        <button onClick={onHide} className="px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-200">Cancel</button>
        <button onClick={handleAssign} disabled={loading} className="px-4 py-2 cursor-pointer bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2 disabled:bg-green-300 disabled:cursor-not-allowed">
          {loading ? <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span> : <ClipboardCheck className="size-4" />}
          {loading ? 'Assigning...' : 'Assign Test'}
        </button>
      </div>
    </Dialog>
  );
}