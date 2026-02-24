import { useEffect, useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";

import ApiService from "../../service/ApiService";
import { POST_APIS } from "../../../connection";

import { Upload, FileText, X } from "lucide-react";

export default function UploadResourceDialog({ visible, onClose, onSuccess }) {
  const toast = useRef(null);
  const fileInputRef = useRef(null);

  // ==========================
  // Local Form State
  // ==========================
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
    if (visible) {
      loadSubjects();
      loadGrades();
      resetForm();
    }
  }, [visible]);

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

        setSubjectOptions([
          { label: "Select Subject", value: "" },
          ...formatted,
        ]);
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

        setTopicOptions([
          { label: "Select Category", value: "" },
          ...formatted,
        ]);
      }
    } catch (err) {
      console.error("Topics Load Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // STATIC GRADE DROPDOWN
  // ==========================
  const loadGrades = () => {
    setGradeOptions([
      { label: "Select Grade", value: "" },
      ...Array.from({ length: 12 }, (_, i) => ({
        label: `Class ${i + 1}`,
        value: `${i + 1}`,
      })),
    ]);
  };

  // ==========================
  // FILE PICK
  // ==========================
  const handleFilePick = (e) => {
    if (e.target.files?.[0]) {
      setForm((prev) => ({ ...prev, file: e.target.files[0] }));

      toast.current.show({
        severity: "success",
        summary: "File Selected",
        detail: e.target.files[0].name,
      });
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
        onSuccess(); // tell parent to refresh list
        onClose();
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
    <Dialog
      visible={visible}
      onHide={() => {
        resetForm();
        onClose();
      }}
      header="Upload Resource"
      className="w-[90%] md:w-[35%]"
      draggable={false}
    >
      <Toast ref={toast} />

      <div className="p-4">
        {/* FILE UPLOAD */}
        <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFilePick}
            accept=".pdf,.doc,.png,.jpg,.jpeg,.mp4"
          />

          <Upload className="size-12 mx-auto mb-2 text-gray-400" />
          <p className="text-gray-600 mb-2">
            Drag & drop file or click to browse
          </p>

          <button
            className="px-4 py-2 border rounded-md hover:bg-gray-100 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            Browse Files
          </button>

          {form.file && (
            <div className="flex items-center justify-center gap-2 mt-3">
              <FileText className="size-4 text-green-600" />
              <p className="text-green-600">{form.file.name}</p>
              <button
                className="p-1"
                onClick={() => setForm((prev) => ({ ...prev, file: null }))}
              >
                <X className="size-4" />
              </button>
            </div>
          )}
        </div>

        {/* FORM FIELDS */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          {/* SUBJECT */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Subject <span className="text-red-500">*</span></label>
            <Dropdown
              value={form.subject_id}
              onChange={(e) => {
                setForm({ ...form, subject_id: e.value, topic_id: "" });
                loadTopics(e.value);
              }}
              options={subjectOptions}
              optionLabel="label"
              className="w-full"
              loading={loading}
            />
          </div>

          {/* GRADE */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Grade <span className="text-red-500">*</span></label>
            <Dropdown
              value={form.class_grade}
              onChange={(e) => setForm({ ...form, class_grade: e.value })}
              options={gradeOptions}
              optionLabel="label"
              className="w-full"
            />
          </div>

          {/* CATEGORY */}
          <div className="col-span-2 space-y-1">
            <label className="text-sm font-medium">Category <span className="text-red-500">*</span></label>
            <Dropdown
              value={form.topic_id}
              onChange={(e) => setForm({ ...form, topic_id: e.value })}
              options={topicOptions}
              optionLabel="label"
              className="w-full"
              loading={loading}
            />
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-3 pt-3">
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="px-4 py-2 border rounded-md hover:bg-gray-100 cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleUpload}
            disabled={buttonLoading}
            className={`px-4 py-2 cursor-pointer rounded-md text-white ${
              buttonLoading ? "bg-green-400" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {buttonLoading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
                Uploading...
              </span>
            ) : (
              "Upload Resource"
            )}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
