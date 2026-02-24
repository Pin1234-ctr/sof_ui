import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../ui/Cards";
import { Badge } from "../../ui/Badge";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "../ui-common/Table";

import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";

import {
  Mail,
  User,
  TrendingUp,
  Edit,
  GraduationCap,
  ClipboardList,
  AlertCircle,
  UserPlus,
} from "lucide-react";
import ApiService from "../../../service/ApiService";
import { GET_APIS } from "../../../../connection";
import { Dropdown } from "primereact/dropdown";
import EditStudentAdminModal from "../../../common/modal/EditStudentAdminModal";
import AddAdminChildDialog from "../../../common/modal/AddAdminChildDialog.jsx";

export default function StudentsManager() {
  const toast = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddChild, setShowAddChild] = useState(false);
  const [showEditStudent, setShowEditStudent] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [kpis, setKpis] = useState({
    active: 0,
    avgPlatformScore: "0",
    totalStudents: 0,
    totalTestsCompleted: 0,
  });
  const [confirmVisible, setConfirmVisible] = useState(false);


  useEffect(() => {
    fetchStudentsData();
  }, []);

  const fetchStudentsData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await ApiService(GET_APIS.adminstudentdashboardurl);
      if (response && response.isSuccess) {
        setStudents(response.data.students);
        setKpis(response.data.kpi);
      } else {
        setError(response.message || "Failed to fetch student data.");
      }
    } catch (error) {
      setError(error.message || "An unexpected error occurred.");
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch student data.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.student_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.parent_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Delete Dialog
  const deleteStudent = (studentId) => {
    const student = students.find((s) => s.user_id === studentId);
    setStudents(students.filter((s) => s.id !== studentId));
    toast.current.show({
      severity: "success",
      summary: "Deleted",
      detail: `Student ${student?.name} deleted.`,
    });
  };

  // Called when AddChildDialog successfully adds a child
  const handleAddSuccess = () => {
    toast.current.show({
      severity: "success",
      summary: "Added",
      detail: "Child added successfully!",
    });

    fetchStudentsData(); // Refresh data
    setShowAddChild(false); // Close modal
  };

  // Color for grade badges
  // Note: The API provides grades like 1, 3, 9. You might want to expand this color map.
  const gradeColors = {
    4: "bg-blue-100 text-blue-800 border-0",
    5: "bg-green-100 text-green-800 border-0",
    6: "bg-purple-100 text-purple-800 border-0",
    7: "bg-orange-100 text-orange-800 border-0",
    8: "bg-pink-100 text-pink-800 border-0",
  };

  return (
    <div className="space-y-6">
      <Toast ref={toast} />

      <Card className="gap-4!">
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle className="text-blue-900">
                Students Management
              </CardTitle>
              <CardDescription>
                View and manage all student accounts across the platform
              </CardDescription>
            </div>
            {/* Search */}
            <div className="flex-1">
              <InputText
                placeholder="Search by name, email, or parent..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <button
              onClick={() => setShowAddChild(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
            >
              <UserPlus className="size-4" /> Add Child
            </button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-3 rounded-lg border bg-blue-50 border-blue-100 flex flex-col justify-between">
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-xl font-semibold text-blue-900">
                {kpis.totalStudents}
              </p>
            </div>

            <div className="p-3 rounded-lg border bg-green-50 border-green-100 flex flex-col justify-between">
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-xl font-semibold text-green-900">
                {kpis.active}
              </p>
            </div>

            <div className="p-3 rounded-lg border bg-purple-50 border-purple-100 flex flex-col justify-between">
              <p className="text-sm text-gray-600">Total Tests Completed</p>
              <p className="text-xl font-semibold text-purple-900">
                {kpis.totalTestsCompleted}
              </p>
            </div>

            <div className="p-3 rounded-lg border bg-orange-50 border-orange-100 flex flex-col justify-between">
              <p className="text-sm text-gray-600">Avg Platform Score</p>
              <p className="text-xl font-semibold text-orange-900">
                {parseFloat(kpis.avgPlatformScore).toFixed(1)}%
              </p>
            </div>
          </div>

          {/* TABLE */}
          <div className="border-2 border-gray-300 rounded-lg">
            <div className="max-h-[290px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-bottom-2 border-gray-300">
                    <TableHead>Student</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Parent</TableHead>
                    <TableHead>Tests</TableHead>
                    <TableHead>Avg Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan="7" className="h-24 text-center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan="7" className="h-24">
                        <div className="flex flex-col items-center gap-2 text-red-500">
                          <AlertCircle className="size-7 text-red-300" />
                          Error fetching data: {error}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <TableRow
                        key={student.user_id}
                        className="border-b border-bottom-2 border-gray-300"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-100 rounded-full p-2">
                              <GraduationCap className="size-4 text-blue-600" />
                            </div>
                            <div>
                              <p>{student.student_name}</p>
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Mail className="size-3" />
                                {student.student_email}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge
                            className={
                              gradeColors[student.class_grade] ||
                              "bg-gray-100 text-gray-800 border-0"
                            }
                          >
                            class {student.class_grade}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="size-3 text-gray-400" />
                            <div>
                              <p className="text-sm">{student.parent_name}</p>
                              <p className="text-xs text-gray-500">
                                {student.parent_email}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge className="bg-gray-50 text-black border-2 border-gray-300">
                            {student.tests_completed} completed
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            <TrendingUp
                              className={`size-4 ${parseInt(student.avg_score) >= 80
                                  ? "text-green-600"
                                  : parseInt(student.avg_score) >= 60
                                    ? "text-orange-600"
                                    : "text-red-600"
                                }`}
                            />
                            <span
                              className={`${parseInt(student.avg_score) >= 80
                                  ? "text-green-600"
                                  : parseInt(student.avg_score) >= 60
                                    ? "text-orange-600"
                                    : "text-red-600"
                                }`}
                            >
                              {student.avg_score}%
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge
                            className={
                              student.account_status === 1
                                ? "bg-green-100 text-green-800 border-0"
                                : "bg-red-100 text-red-800 border-0"
                            }
                          >
                            {student.account_status === 1
                              ? "active"
                              : "suspended"}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-right">
                          <button
                            onClick={() => {
                              setSelectedStudent(student);
                              setShowEditStudent(true);
                            }}
                            className="p-2 hover:bg-gray-200 rounded-md"
                          >
                            <Edit className="size-4 text-blue-600" />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan="7" className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                          <ClipboardList className="size-10 text-gray-300" />
                          No students found.
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      <AddAdminChildDialog
        visible={showAddChild}
        onClose={() => setShowAddChild(false)}
        onSuccess={handleAddSuccess}
      />

      {showEditStudent && (
        <EditStudentAdminModal
          student={selectedStudent}
          visible={showEditStudent}
          onClose={() => setShowEditStudent(false)}
          onSuccess={fetchStudentsData}
        />
      )}

    </div>
  );
}
