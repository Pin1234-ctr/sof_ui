import { useEffect, useState, useRef } from "react";
import { Card } from "../../../ui/Cards"; 
import { Badge } from "../../../ui/Badge"; 
import { Progress } from "../ui-common/Progress";
import ApiService from "../../../../service/ApiService";
import { GET_APIS } from "../../../../../connection";

import {
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  TrendingUp,
  Target,
  Loader,
} from "lucide-react";

export default function SmartStudy() {
  const [weakAreas, setWeakAreas] = useState([]);
  const [strongAreas, setStrongAreas] = useState([]);
  const [tipsForImprovement, setTipsForImprovement] = useState([]);
  const [summary, setSummary] = useState(null);
  const [todaysRec, setTodaysRec] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return; // stop second call
    fetchedRef.current = true;

    fetchSmartStudy();
  }, []);

  const formatMarkdownBold = (text) => {
    return text?.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") || "";
  };

  const normalizeRecommendation = (text) => {
    if (!text) return "";
    return text
      .replace(/\\"/g, "") // remove escaped quotes
      .replace(/\"/g, "") // remove plain quotes
      .replace(/\\n/g, "\n") // convert literal \n to real newline
      .trim();
  };

  const fetchSmartStudy = async () => {
    try {
      const stored = JSON.parse(localStorage.getItem("user"));
      const studentId = stored?.userData?.id;
      setLoading(true); // start loader
      setError(false);

      const json = await ApiService(`${GET_APIS.aiinsightsurl}/${studentId}`, {
        method: "GET",
      });


      if (!json.isSuccess || !json.data) {
        setError(true);
        return;
      }

      if (json.isSuccess) {
        const data = json.data;

        setWeakAreas(data.weakAreas || []);
        setStrongAreas(data.strongAreas || []);
        setTipsForImprovement(data.tipsForImprovement || []);
        setSummary(data.summary || {});

        // Fix recommendation formatting
        const cleaned = normalizeRecommendation(
          data.todaysRecommendation || ""
        );
        setTodaysRec(cleaned);
      }
    } catch (err) {
      console.error("SMART STUDY ERROR:", err);
      setError(true);
    } finally {
      setLoading(false); // stop loader
    }
  };

  const noData =
    error ||
    (!summary &&
      weakAreas.length === 0 &&
      strongAreas.length === 0 &&
      tipsForImprovement.length === 0 &&
      todaysRec.trim() === "");

  if (loading) {
    return (
      <div className="flex justify-center items-center h-80">
        <Loader className="animate-spin text-blue-600" size={40} />
        <p className="ml-4 text-gray-600">Loading Insights...</p>
      </div>
    );
  }

  if (noData) {
    return (
      <div className="flex flex-col items-center justify-center h-80 text-center">
        <AlertTriangle className="text-red-500" size={40} />
        <p className="text-gray-600 mt-2">No Smart Study Insights found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
          <Sparkles className="size-6 text-white" />
        </div>
        <div>
          <h2 className="text-blue-900">Smart Study - AI Insights</h2>
          <p className="text-sm text-gray-600">
            Personalized recommendations based on your performance
          </p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-linear-to-br from-red-50 to-orange-50 border-2 border-red-100">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="size-5 text-red-600" />
            <span className="text-sm text-gray-700">Needs Attention</span>
          </div>
          <p className="text-2xl text-red-700">
            {summary?.weakCount || 0} Topics
          </p>
        </Card>

        <Card className="p-4 bg-linear-to-br from-green-50 to-emerald-50 border-2 border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="size-5 text-green-600" />
            <span className="text-sm text-gray-700">Strong Areas</span>
          </div>
          <p className="text-2xl text-green-700">
            {summary?.strongCount || 0} Topics
          </p>
        </Card>

        <Card className="p-4 bg-linear-to-br from-blue-50 to-cyan-50 border-2 border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="size-5 text-blue-600" />
            <span className="text-sm text-gray-700">Overall Progress</span>
          </div>
          <p className="text-2xl text-blue-700">
            {summary?.overallProgress || 0}%
          </p>
        </Card>
      </div>

      {/* Weak Areas */}
      <Card className="p-6 border-2 border-red-200">
        <h3 className="text-blue-900 mb-4 flex items-center gap-2">
          <AlertTriangle className="text-red-600" /> Weak Areas
        </h3>

        {weakAreas.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            No weak areas found
          </div>
        ) : (
          weakAreas.map((area, index) => (
            <div key={index} className="p-4 bg-red-50 rounded-lg mb-3">
              <div className="flex justify-between mb-2">
                <div>
                  <h4 className="text-blue-900">{area.topic_name}</h4>
                  <p className="text-sm text-gray-600">{area.subject_name}</p>
                  <p className="text-sm text-gray-600">
                    Attempts: {area.attempts}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl text-red-700">{area.accuracy}%</p>
                </div>
              </div>

              <Progress value={Number(area.accuracy)} className="h-2" />
            </div>
          ))
        )}
      </Card>

      {/* Improvement Tips */}

      <Card className="p-6 border-2 border-blue-200 bg-blue-50">
        <h3 className="text-blue-900 mb-4 flex items-center gap-2">
          <Lightbulb className="text-blue-600" /> Tips for Improvement
        </h3>

        {tipsForImprovement.length === 0 ? (
          <div className="text-center pb-6 text-gray-500 h-full">
            No improvement tips found
          </div>
        ) : (
          tipsForImprovement.map((item, i) => (
            <div
              key={item.topic}
              className="p-4 bg-white rounded-lg border border-blue-100 mb-4"
            >
              <h4 className="text-blue-800 mb-2 flex items-center gap-2">
                <Target className="text-blue-600" /> {item.topic}
              </h4>

              <ul className="space-y-2">
                {item.tips.map((tip, idx) => (
                  <li key={idx} className="flex gap-2 text-sm text-gray-700">
                    <span className="text-blue-500">•</span> {tip}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </Card>

      {/* Strong Areas */}
      <Card className="p-6 border-green-200 border-2">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="size-5 text-green-600" />
          <h3 className="text-blue-900">Strong Areas - Keep it Up!</h3>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {strongAreas.length === 0 ? (
            <div className="text-center col-span-full py-6 text-gray-500">
              No strong areas found
            </div>
          ) : (
            strongAreas.map((area, i) => (
              <div
                key={area.id}
                className="p-4 bg-green-50 rounded-lg border border-green-100"
              >
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="size-5 text-green-600" />

                  <Badge className="bg-green-100 text-green-700 border border-green-200">
                    {area.accuracy}%
                  </Badge>
                </div>

                <h4 className="text-blue-900 mb-1">{area.topic_name}</h4>
                <p className="text-sm text-gray-600">{area.subject_name}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {area.attempts} tests attempted
                </p>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Recommendation */}
      <Card className="p-6 bg-linear-to-r from-purple-50 to-pink-50 border-2 border-gray-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
            <Sparkles className="size-6 text-white" />
          </div>

          <div className="w-full">
            <h3 className="text-blue-900 mb-2">Today's Recommendation</h3>

            {todaysRec ? (
              <p
                className="text-gray-700 mb-3 whitespace-pre-line"
                dangerouslySetInnerHTML={{
                  __html: formatMarkdownBold(todaysRec),
                }}
              />
            ) : (
              <p className="text-center flex items-center justify-center py-6 text-gray-500">
                No recommendation available
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
