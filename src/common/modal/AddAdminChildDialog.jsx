import { useEffect, useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";

import ApiService from "../../service/ApiService";
import { GET_APIS, POST_APIS } from "../../../connection";
import { Eye, EyeOff } from "lucide-react";

export default function AddAdminChildDialog({ visible, onClose, onSuccess }) {
  const toast = useRef(null);

  const [form, setForm] = useState({
    child_name: "",
    parent_id: "",
    email: "",
    password: "",
    confirm_password: "",
    class_grade: "",
    school: "",
  });

  const [errors, setErrors] = useState({});
  const [parentOptions, setParentOptions] = useState([]);
  const [loadingParents, setLoadingParents] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Reset form
  const resetForm = () => {
    setForm({
      child_name: "",
      parent_id: "",
      email: "",
      password: "",
      confirm_password: "",
      class_grade: "",
      school: "",
    });
    setErrors({});
  };

  // Load parent dropdown on open
  useEffect(() => {
    if (visible) {
      loadParents();
      resetForm();
    }
  }, [visible]);

  // ============================
  // Load Parent List API
  // ============================
  const loadParents = async () => {
    try {
      setLoadingParents(true);

      const json = await ApiService(GET_APIS.fetchparents, {
        method: "GET",
      });

      if (json.isSuccess) {
        const formatted = json.data.map((p) => ({
          label: p.full_name,
          value: p.user_id,
        }));

        setParentOptions([{ label: "Select Parent", value: "" }, ...formatted]);
      }
    } catch (err) {
      console.error("Parent Load Error:", err);
    } finally {
      setLoadingParents(false);
    }
  };

  // ============================
  // VALIDATION
  // ============================
  const validate = () => {
    const newErrors = {};

    if (!form.child_name.trim())
      newErrors.child_name = "Child name is required.";
    if (!form.parent_id) newErrors.parent_id = "Parent is required.";
    if (!form.email.trim()) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Invalid email.";

    if (!form.class_grade) newErrors.class_grade = "Class is required.";
    if (!form.school.trim()) newErrors.school = "School name is required.";

    if (!form.password) newErrors.password = "Password is required.";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";

    if (!form.confirm_password)
      newErrors.confirm_password = "Confirm password is required.";
    else if (form.password !== form.confirm_password)
      newErrors.confirm_password = "Passwords do not match.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ============================
  // Submit Add Child API
  // ============================
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setButtonLoading(true);

      const payload = {
        parent_id: form.parent_id,
        full_name: form.child_name,
        email: form.email,
        password: form.password,
        class_grade: Number(form.class_grade),
        school_name: form.school,
      };

      console.log("Payload:", payload);

      const json = await ApiService(POST_APIS.adminaddchild, {
        method: "POST",
        body: payload,
      });

      if (json.isSuccess) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Child added successfully!",
        });

        onSuccess();
        onClose();
        resetForm();
      } else {
        toast.current.show({
          severity: "error",
          summary: "Failed",
          detail: json.message || "Something went wrong",
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
      header="Add Child"
      className="w-[90%] md:w-[35%]"
      draggable={false}
    >
      <Toast ref={toast} />

      <div className="space-y-4 pr-3 pb-2">
        {/* Child Name */}
        <div>
          <label className="text-sm font-medium">Child Name <span className="text-red-500">*</span></label>
          <InputText
            className={`w-full ${errors.child_name ? "border-red-500" : ""}`}
            value={form.child_name}
            onChange={(e) => setForm({ ...form, child_name: e.target.value })}
          />
          {errors.child_name && (
            <p className="text-red-500 text-xs">{errors.child_name}</p>
          )}
        </div>

        {/* Parent Dropdown */}
        <div>
          <label className="text-sm font-medium">Parent *</label>
          <Dropdown
            value={form.parent_id}
            onChange={(e) => setForm({ ...form, parent_id: e.value })}
            options={parentOptions}
            placeholder="Choose Parent"
            loading={loadingParents}
            className={`w-full ${errors.parent_id ? "border-red-500" : ""}`}
          />
          {errors.parent_id && (
            <p className="text-red-500 text-xs">{errors.parent_id}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-medium">Email <span className="text-red-500">*</span></label>
          <InputText
            className={`w-full ${errors.email ? "border-red-500" : ""}`}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email}</p>
          )}
        </div>

        {/* Class Dropdown */}
        <div>
          <label className="text-sm font-medium">Class <span className="text-red-500">*</span></label>
          <Dropdown
            value={form.class_grade}
            onChange={(e) => setForm({ ...form, class_grade: e.value })}
            options={[
              { label: "Select Class", value: "" },
              ...Array.from({ length: 12 }, (_, i) => ({
                label: `Class ${i + 1}`,
                value: `${i + 1}`,
              })),
            ]}
            placeholder="Choose Class"
            className={`w-full ${errors.class_grade ? "border-red-500" : ""}`}
          />
          {errors.class_grade && (
            <p className="text-red-500 text-xs">{errors.class_grade}</p>
          )}
        </div>

        {/* School */}
        <div>
          <label className="text-sm font-medium">School <span className="text-red-500">*</span></label>
          <InputText
            className={`w-full ${errors.school ? "border-red-500" : ""}`}
            value={form.school}
            onChange={(e) => setForm({ ...form, school: e.target.value })}
          />
          {errors.school && (
            <p className="text-red-500 text-xs">{errors.school}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="text-sm font-medium">Password <span className="text-red-500">*</span></label>
          <div className="relative">
            <InputText
              type={showPassword ? "text" : "password"}
              className={`w-full pr-10 ${
                errors.password ? "border-red-500" : ""
              }`}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="size-5" />
              ) : (
                <Eye className="size-5" />
              )}
            </button>
          </div>

          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="text-sm font-medium">Confirm Password <span className="text-red-500">*</span></label>
          <div className="relative">
            <InputText
              type={showConfirmPassword ? "text" : "password"}
              className={`w-full pr-10 ${
                errors.confirm_password ? "border-red-500" : ""
              }`}
              value={form.confirm_password}
              onChange={(e) =>
                setForm({ ...form, confirm_password: e.target.value })
              }
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? (
                <EyeOff className="size-5" />
              ) : (
                <Eye className="size-5" />
              )}
            </button>
          </div>

          {errors.confirm_password && (
            <p className="text-red-500 text-xs">{errors.confirm_password}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-3">
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="px-4 py-2 border rounded-md hover:bg-gray-200 cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={buttonLoading}
            className={`px-4 py-2 rounded-md text-white cursor-pointer
              ${
                buttonLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }
            `}
          >
            {buttonLoading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
                Saving...
              </span>
            ) : (
              "Add Child"
            )}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
