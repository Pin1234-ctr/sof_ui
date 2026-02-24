
import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../../../common/helper/UserContext'
import ApiService from '../../../../service/ApiService';
import { GET_APIS } from '../../../../../connection';
import { Dropdown } from 'primereact/dropdown';
import { Loader } from 'lucide-react'
import TopCard from '../ui/TopCard'
import ProgressOverTime from '../ui/ProgressOverTime'
import TopicStrengthAnalysis from '../ui/TopicStrengthAnalysis'
import AreasNeedingAttention from '../ui/AreasNeedingAttention'
import StrongAreas from '../ui/StrongAreas'
import SubjectWisePerformance from '../ui/SubjectWisePerformance'

function ChildPerformance() {
  const { childdetails } = useContext(UserContext);
  const [selectedChild, setSelectedChild] = useState("")
  const [isLoading, setIsLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState();
  
  // Set the first child as default when the component loads
  useEffect(() => {
    if (childdetails && childdetails.length > 0 && !selectedChild) {
      setSelectedChild(childdetails[0].student_id);
    }
  }, [childdetails, selectedChild]);

  // Fetch performance data when a child is selected
  useEffect(() => {
    if (selectedChild) {
      setIsLoading(true);
      setPerformanceData(null);

      const fetchPerformanceData = async () => {
        try {
          const url = `${GET_APIS.child_performance_track}/${selectedChild}`;
          const responseData = await ApiService(url);
          // Map new API structure to the one expected by components
          const mappedData = {
            stats: responseData.data.kpi,
            graph: responseData.data.charts.progressLine,
            subject_wise_performance: responseData.data.charts.subjectBar,
            topic_strength_analysis: responseData.data.charts.topicRadar,
            weak_areas: responseData.data.insights.weakAreas,
            strong_areas: responseData.data.insights.strongAreas,
          };
          setPerformanceData(mappedData);
        } catch (error) {
          console.error("Error fetching performance data:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchPerformanceData();
    } else {
      setIsLoading(false);
    }
  }, [selectedChild]);

  return (
    <div className="w-full py-4">

      {/* Header Section */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-[#1C398E] text-xl font-semibold">
            Performance Monitor
          </h2>
          <p className="text-[#4A5565] text-sm">
            Track your child's progress and improvement
          </p>
        </div>

        {/* Right Side Dropdown */}
        <Dropdown
          value={selectedChild}
          onChange={(e) => setSelectedChild(e.value)}
          options={childdetails}
          optionLabel="name"
          optionValue="student_id"
          placeholder="Select a Child"
          className="w-full md:w-64"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="animate-spin text-blue-600" size={40} />
          <p className="ml-4 text-gray-600">Loading Performance Data...</p>
        </div>
      ) : performanceData ? (
        <>
          {/* Top Stats Cards */}
          <TopCard stats={performanceData.stats} />

          {/* Progress Over Time */}
          <div className="grid grid-cols-1 gap-6 mt-6">
            <ProgressOverTime data={performanceData.graph} />
          </div>

          {/* Subject + Topic Chart */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
            <SubjectWisePerformance data={performanceData.subject_wise_performance} />
            <TopicStrengthAnalysis data={performanceData.topic_strength_analysis} />
          </div>

          {/* Weak Areas + Strong Areas */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
            <AreasNeedingAttention data={performanceData.weak_areas} />
            <StrongAreas data={performanceData.strong_areas} />
          </div>
        </>
      ) : (
        <div className="text-center text-gray-500">
          {/* Avoid showing this message while the initial load for the first child is happening */}
          {!isLoading && !performanceData && (
            <p>No performance data available for the selected child.</p>
          )}
        </div>
      )}
    </div>
  )
}

export default ChildPerformance
