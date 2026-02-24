import { useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import ApiService from "../../service/ApiService";
import { GET_APIS, PUT_APIS } from "../../../connection";
import { Pencil } from "lucide-react";

export default function EditStudentAdminModal({
  student,
  visible,
  onClose,
  onSuccess,
}) {
  const toast = useRef(null);

  const [form, setForm] = useState({
    student_name: "",
    student_email: "",
    class_grade: "",
    parent_id: "",
    account_status: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [parents, setParents] = useState([]);

  useEffect(() => {
    if (student) {
      setForm({
        student_name: student.student_name || "",
        student_email: student.student_email || "",
        class_grade: student.class_grade || "",
        parent_id: student.parent_id || "",
        parent_name: student.parent_name || "",
        account_status: student.account_status === 1 ? "active" : "suspended",
      });
    }
    if (visible) {
      fetchParents();
    }
  }, [student, visible]);

  const fetchParents = async () => {
    try {
      const response = await ApiService(GET_APIS.adminparentdashboardurl);
      if (response && response.isSuccess) {
        const parentOptions = response.data.parents.map((p) => ({
          label: p.parent_name,
          value: p.user_id,
        }));
        setParents(parentOptions);
      }
    } catch (error) {}
  };

  const updateField = (field, value) => {
    setForm({ ...form, [field]: value });
    setErrors({ ...errors, [field]: null });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.student_name.trim()) newErrors.student_name = "Student name is required.";
    if (!form.student_email.trim()) newErrors.student_email = "Student email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(form.student_email))
      newErrors.student_email = "Invalid email format.";
    if (!form.class_grade) newErrors.class_grade = "Grade is required.";

    setErrors(newErrors);
    return Object.values(newErrors)[0] || null;
  };

  const handleSubmit = async () => {
    const firstError = validateForm();
    if (firstError) {
      toast.current.show({
        severity: "warn",
        detail: firstError,
      });
      return;
    }

    try {
      setLoading(true);
      const payload = {
        user_id: student.user_id,
        full_name: form.student_name,
        email: form.student_email,
        class_grade: form.class_grade,
        status: form.account_status,
      };

      const response = await ApiService(PUT_APIS.admineditchild, {
        method: "PUT",
        body: payload,
      });

      if (response?.isSuccess) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: response.message || "Student updated successfully.",
        });
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1000);
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: response?.message || "Failed to update student.",
        });
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "An unexpected error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  const gradeOptions = Array.from({ length: 12 }, (_, i) => ({
    label: `class ${i + 1}`,
    value: i + 1,
  }));

  return (
    <Dialog
      header={
        <div className="flex items-center gap-2">
          <Pencil className="size-5" /> Edit Student Details
        </div>
      }
      visible={visible}
      onHide={onClose}
      className="w-[90%] md:w-[35%]"
      draggable={false}
    >
      <Toast ref={toast} />
      <div className="space-y-4 p-4">
        <div>
          <label className="text-sm font-medium">
            Student Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <InputText
              value={form.student_name}
              onChange={(e) => updateField("student_name", e.target.value)}
              className={`w-full ${errors.student_name ? "border-red-500" : ""}`}
              disabled={loading}
            />
          </div>
          {errors.student_name && (
            <p className="text-red-500 text-xs mt-1">{errors.student_name}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium">
            Student Email <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <InputText
              value={form.student_email}
              onChange={(e) => updateField("student_email", e.target.value)}
              className={`w-full ${errors.student_email ? "border-red-500" : ""}`}
              disabled={loading}
            />
          </div>
          {errors.student_email && (
            <p className="text-red-500 text-xs mt-1">{errors.student_email}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium">
            Grade <span className="text-red-500">*</span>
          </label>
          <Dropdown
            value={form.class_grade}
            onChange={(e) => updateField("class_grade", e.value)}
            options={gradeOptions}
            placeholder="Select a Grade"
            className={`w-full ${errors.class_grade ? "border-red-500" : ""}`}
            disabled={loading}
          />
          {errors.class_grade && (
            <p className="text-red-500 text-xs mt-1">{errors.class_grade}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">
            Status <span className="text-red-500">*</span>
          </label>
          <Dropdown
            value={form.account_status}
            onChange={(e) => updateField("account_status", e.value)}
            options={[
              { label: "Active", value: "active" },
              { label: "Suspended", value: "suspended" },
            ]}
            className="w-full"
            disabled={loading}
          />
        </div>

        <div className="flex justify-end gap-3 pt-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-4 py-2 cursor-pointer rounded-md text-white ${
              loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
                Saving...
              </span>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
