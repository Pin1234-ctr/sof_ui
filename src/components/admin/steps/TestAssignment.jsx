import { useState, useRef, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../../ui/Cards';
import { Badge } from '../../ui/Badge';
import { Toast } from 'primereact/toast';
import {
  ClipboardCheck,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  Users,
  CheckCircle2,
} from 'lucide-react';
import ApiService from '../../../service/ApiService';
import { GET_APIS } from '../../../../connection';
import TestAssignModal from '../../../common/modal/TestAssignModal';

export default function TestAssignment() {
  const toast = useRef(null);
  const [showAssignTest, setShowAssignTest] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [kpis, setKpis] = useState({
    total_assignments: 0,
    pending: 0,
    completed: 0,
    completion_rate: 0,
  });

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestAnalytics();
  }, []);

  const fetchTestAnalytics = async () => {
    setLoading(true);
    try {
      const response = await ApiService(GET_APIS.testanalyticsadmin);
      if (response && response.isSuccess) {
        const analyticsData = response.data || [];
        setAssignments(analyticsData);

        if (analyticsData.length > 0) {
          const kpiData = analyticsData[0];
          setKpis({
            total_assignments: kpiData.total_tests || 0,
            pending: kpiData.total_pending_tests || 0,
            completed: kpiData.total_completed_tests || 0,
            completion_rate: kpiData.overall_completion_rate || 0,
          });
        }
      } else {
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: response?.message || 'Failed to fetch test analytics.',
        });
      }
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: error.message || 'An unexpected error occurred.' });
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTest = (assignmentData) => {
    setShowAssignTest(false);
    fetchTestAnalytics(); 
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-green-100 text-green-800 border-0';

      case 'completed': return 'bg-gray-100 text-gray-800 border-0';
      default: return 'bg-gray-100 text-gray-800 border-0';
    }
  };

  const groupedAssignments = {
    all: assignments,
    pending: assignments.filter((a) => a.status === 'pending'),
    completed: assignments.filter((a) => a.status === 'completed'),
  };

  return (
    <div className="space-y-6">
      <Toast ref={toast} />
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-blue-900">Test Assignment</CardTitle>
              <CardDescription>Assign tests to specific students or groups</CardDescription>
            </div>
            <button
              onClick={() => setShowAssignTest(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer"
            >
              <Plus className="size-4" />
              Assign Test
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg border bg-blue-50 border-blue-100">
              <p className="text-sm text-gray-600">Total Assignments</p>
              <p className="text-xl font-semibold text-blue-900">{kpis.total_assignments}</p>
            </div>
            <div className="p-4 rounded-lg border bg-green-50 border-green-100">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-xl font-semibold text-green-900">{kpis.pending}</p>
            </div>
            <div className="p-4 rounded-lg border bg-purple-50 border-purple-100">
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-xl font-semibold text-purple-900">{kpis.completed}</p>
            </div>
            <div className="p-4 rounded-lg border bg-orange-50 border-orange-100">
              <p className="text-sm text-gray-600">Completion Rate</p>
              <p className="text-xl font-semibold text-orange-900">
                {parseFloat(kpis.completion_rate).toFixed(2)}%
              </p>
            </div>
          </div>

          <div className="">
              <div className="mt-4">
                <div className="flex gap-3 p-2 rounded-lg">
                  {[
                    { key: "all", label: "All" },
                    { key: "pending", label: "Pending" },
                    { key: "completed", label: "Completed" },
                  ].map((tab) => {
                    const isActive = activeTab === tab.key;
                    return (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`
            rounded-lg px-5 py-2 text-sm font-medium transition-all cursor-pointer
            ${isActive
                            ? "bg-[#1C398E] text-white shadow-md"
                            : "bg-[#E8F0FF] text-[#1C398E] hover:bg-[#bcd2ff]"
                          }
          `}
                      >
                        {tab.label} ({groupedAssignments[tab.key].length})
                      </button>
                    );
                  })}
                </div>


                {/* Tab Panels */}
                {["all", "pending", "completed"].map((tab) =>
                  activeTab === tab &&
                  (loading ? (
                    <div className="text-center py-10 text-gray-500">Loading...</div>
                  ) : (
                    <div key={tab} className="mt-4 space-y-3 max-h-[400px] overflow-y-auto pr-2">
                      {groupedAssignments[tab].length === 0 ?
                        (
                          <div className="text-center py-10 text-gray-500">
                            <ClipboardCheck className="size-12 mx-auto mb-3 text-gray-300" />
                            No {tab} tests found
                          </div>
                        ) : (
                          groupedAssignments[tab].map((assignment, index) => (
                            <Card
                              key={index}
                              className="hover:shadow-md mb-4 border border-gray-200"
                            >
                              <CardContent className="p-5 space-y-3">
                                {/* Title */}
                                <h3 className="text-blue-900">
                                  {assignment.test_title}
                                </h3>

                                {/* Badges */}
                                <div className="flex flex-wrap gap-2">
                                  <Badge className="bg-blue-50 text-blue-700 border border-blue-200">
                                    Class {assignment.class_grade}
                                  </Badge>
                                  <Badge className="bg-green-50 text-green-700 border border-green-200">
                                    {assignment.subject_name}
                                  </Badge>
                                  <Badge className={getStatusColor(assignment.status)}>
                                    {assignment.status}
                                  </Badge>
                                </div>

                                {/* Stats Row */}
                                <div className="grid grid-cols-4 gap-4 text-gray-700 text-sm">
                                  <div className="flex items-center gap-2">
                                    <Users className="w-4" />
                                    {assignment.total_students_assigned} students assigned
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4" />
                                    {assignment.total_students_completed}/{assignment.total_students_assigned} completed
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <Clock className="w-4" />
                                    {assignment.duration_minutes} minutes
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <CalendarIcon className="w-4" />
                                    Due: {new Date(assignment.due_date).toLocaleDateString()}
                                  </div>
                                </div>

                                {/* Footer */}
                                <p className="text-xs text-gray-500">
                                  {assignment.total_questions} questions • Assigned on{" "}
                                  {new Date(assignment.created_date).toLocaleDateString()}
                                </p>
                              </CardContent>
                            </Card>
                          ))
                        )}
                    </div>
                  ))
                )}

           </div>
          </div>
        </CardContent>
      </Card>
      <TestAssignModal
        visible={showAssignTest}
        onHide={() => setShowAssignTest(false)}
        onAssignTest={handleAssignTest}
      />
    </div>
  );
}
