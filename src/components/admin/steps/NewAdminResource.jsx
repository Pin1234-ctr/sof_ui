import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../ui/Cards";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import ApiService from "../../../service/ApiService";
import { POST_APIS } from "../../../../connection";
import {
  Upload,
  FileText,
  X,
  Image as ImageIcon,
  Video,
  File as FileIcon,
  FileType,
} from "lucide-react";

export default function NewAdminResource() {
  const toast = useRef(null);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    subject_id: "",
    topic_id: "",
    class_grade: "",
    file: null,
  });

  const [subjectOptions, setSubjectOptions] = useState([]);
  const [topicOptions, setTopicOptions] = useState([]);
  const [gradeOptions, setGradeOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const isFormDisabled = buttonLoading;

  // RESET form when modal closes
  const resetForm = () => {
    setForm({
      subject_id: "",
      topic_id: "",
      class_grade: "",
      file: null,
    });
    setTopicOptions([]);
  };

  // When modal opens → load subjects + grades
  useEffect(() => {
    loadSubjects();
    loadGrades();
    resetForm();
  }, []);

  // ==========================
  // STATIC GRADE DROPDOWN
  // ==========================
  const loadGrades = () => {
    setGradeOptions(
      Array.from({ length: 12 }, (_, i) => ({
        label: `Class ${i + 1}`,
        value: `${i + 1}`,
      }))
    );
  };

  // ==========================
  // LOAD SUBJECTS (POST)
  // ==========================
  const loadSubjects = async () => {
    try {
      setLoading(true);

      const json = await ApiService(POST_APIS.studymetadatadashboardurl, {
        method: "POST",
      });

      if (json.isSuccess && Array.isArray(json.data.subjects)) {
        const formatted = json.data.subjects.map((s) => ({
          label: s.subject_name,
          value: s.subject_id,
        }));

        setSubjectOptions(formatted);
      }
    } catch (err) {
      console.error("Subjects Load Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // LOAD TOPICS (POST) after subject select
  // ==========================
  const loadTopics = async (subject_id) => {
    try {
      setLoading(true);

      const json = await ApiService(POST_APIS.studymetadatadashboardurl, {
        method: "POST",
        body: { subject_id },
      });

      if (json.isSuccess && Array.isArray(json.data.topics)) {
        const formatted = json.data.topics.map((t) => ({
          label: t.topic_name,
          value: t.topic_id,
        }));

        setTopicOptions(formatted);
      }
    } catch (err) {
      console.error("Topics Load Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilePick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setForm((prev) => ({ ...prev, file }));

    if (file.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  // ==========================
  // VALIDATION
  // ==========================
  const validate = () => {
    if (!form.subject_id) return "Please select a subject.";
    if (!form.topic_id) return "Please select a category.";
    if (!form.class_grade) return "Please select a grade.";
    if (!form.file) return "Please select a file.";

    return null;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setForm((prev) => ({ ...prev, file }));

    if (file.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }

    toast.current.show({
      severity: "success",
      summary: "File Dropped",
      detail: file.name,
    });
  };

  // ==========================
  // UPLOAD RESOURCE (POST)
  // ==========================
  const handleUpload = async () => {
    const error = validate();
    if (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error,
      });
      return;
    }

    try {
      setButtonLoading(true);

      const formData = new FormData();
      formData.append("subject_id", form.subject_id);
      formData.append("topic_id", form.topic_id);
      formData.append("class_grade", form.class_grade);
      formData.append("file", form.file);

      const response = await ApiService(POST_APIS.adminuploadprocess, {
        method: "POST",
        body: formData,
        isFormData: true, // optional but recommended
      });

      if (response?.isSuccess) {
        toast.current.show({
          severity: "success",
          summary: "Uploaded",
          detail: response.message || "Resource uploaded successfully!",
        });

        resetForm();
      } else {
        toast.current.show({
          severity: "error",
          summary: "Failed",
          detail: response.message || "Upload failed",
        });
      }
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: err.message,
      });
    } finally {
      setButtonLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Toast ref={toast} />

      {/* Main Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-blue-900">Resource Library</CardTitle>
              <CardDescription>
                Upload and manage educational resources
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Search + Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="space-y-1">
              <label className="text-sm font-medium">
                Subject <span className="text-red-500">*</span>
              </label>

              <Dropdown
                value={form.subject_id}
                onChange={(e) => {
                  setForm({ ...form, subject_id: e.value, topic_id: "" });
                  loadTopics(e.value);
                }}
                options={subjectOptions}
                optionLabel="label"
                placeholder="Select a subject"
                className="w-full"
                loading={loading}
                disabled={isFormDisabled}
              />
            </div>

            {/* Grade */}
            {/* Grade Filter */}
            <div className="space-y-1">
              <label className="text-sm font-medium">
                Grade <span className="text-red-500">*</span>
              </label>
              <Dropdown
                value={form.class_grade}
                onChange={(e) => setForm({ ...form, class_grade: e.value })}
                options={gradeOptions}
                optionLabel="label"
                placeholder="Select a grade"
                className="w-full"
                disabled={isFormDisabled}
              />
            </div>

            {/* Subject */}
            <div className="space-y-1">
              <label className="text-sm font-medium">
                Category <span className="text-red-500">*</span>
              </label>

              <Dropdown
                value={form.topic_id}
                onChange={(e) => setForm({ ...form, topic_id: e.value })}
                options={topicOptions}
                optionLabel="label"
                className="w-full"
                placeholder="Select a category"
                emptyMessage={
                  form.subject_id
                    ? "No topics available"
                    : "First choose subject"
                }
                disabled={isFormDisabled || !form.subject_id}
              />
            </div>
          </div>

          {/* FILE UPLOAD */}
          <div
            className={`p-6 rounded-lg text-center border-2 border-dashed transition-all duration-300 cursor-pointer
                          ${
                            isDragging
                              ? "border-blue-500 bg-blue-50 shadow-md scale-[1.02]"
                              : "border-gray-300"
                          }${
              isFormDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onDragOver={!isFormDisabled ? handleDragOver : undefined}
            onDragLeave={!isFormDisabled ? handleDragLeave : undefined}
            onDrop={!isFormDisabled ? handleDrop : undefined}
            onClick={() =>
              !form.file && !isFormDisabled && fileInputRef.current?.click()
            }
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFilePick}
              accept=".pdf,.doc,.png,.jpg,.jpeg,.mp4"
              multiple={false}
            />

            <Upload
              className={`size-12 mx-auto mb-2 transition-all duration-300 
                            ${
                              isDragging
                                ? "text-blue-600 scale-110"
                                : "text-gray-400"
                            }`}
            />

            <p className="text-gray-600 mb-2">
              Drag & drop file or click to browse
            </p>

            {!form.file && (
              <button
                className="px-4 py-2 border rounded-md hover:bg-gray-100 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                Browse Files
              </button>
            )}

            {form.file && (
              <div className="flex flex-col items-center gap-3 mt-4">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="preview"
                    className="w-24 h-24 object-cover rounded-md shadow-md"
                  />
                ) : (
                  <FileText className="size-10 text-green-600" />
                )}

                <p className="text-green-700 font-medium text-sm text-center w-[200px] truncate">
                  {form.file.name}
                </p>

                <button
                  disabled={isFormDisabled}
                  className={`px-3 py-1 text-sm rounded-md flex items-center gap-2 transition ${
                    isFormDisabled
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-red-200 hover:bg-red-300 cursor-pointer"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent opening file picker
                    if (isFormDisabled) return; // block action during upload
                    setForm((prev) => ({ ...prev, file: null }));
                    setPreviewUrl(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                >
                  <X className="size-4" /> Remove File
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-3 w-full">
            <button
              onClick={() => {
                resetForm();
              }}
              className={`px-4 py-2 border rounded-md flex-1 cursor-pointer ${
                isFormDisabled
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              Reset
            </button>

            <button
              onClick={handleUpload}
              disabled={buttonLoading}
              className={`px-4 py-2 flex justify-center items-center gap-2 flex-1 rounded-md text-white ${
                buttonLoading
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 cursor-pointer"
              }`}
            >
              {buttonLoading ? (
                <>
                  <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
                  <span>Uploading...</span>
                </>
              ) : (
                "Upload Resource"
              )}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
