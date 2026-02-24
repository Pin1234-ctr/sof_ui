import { useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import ApiService from "../../service/ApiService";
import { POST_APIS } from "../../../connection";
import { Toast } from "primereact/toast";

export default function AddParentModal({ visible, onClose, onSuccess }) {
  const toast = useRef(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const updateField = (field, value) => {
    setForm({ ...form, [field]: value });
    setErrors({ ...errors, [field]: null }); // clear error on change
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Parent name is required.";

    if (!form.email.trim()) newErrors.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      newErrors.email = "Invalid email format.";

    // Phone now mandatory
    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^[0-9]{10}$/.test(form.phone)) {
      newErrors.phone = "Phone must be exactly 10 digits.";
    }

    setErrors(newErrors);

    const firstError = Object.values(newErrors)[0];
    return firstError || null;
  };

  const handleSubmit = async () => {
    const firstError = validateForm();
    if (firstError) {
      toast.current.show({ severity: "warn", detail: firstError });
      return;
    }

    try {
      setLoading(true);
      const body = {
        parent_name: form.name,
        email: form.email,
        phone_number: form.phone,
      };

      const response = await ApiService(POST_APIS.adminaddparent, {
        method: "POST",
        body,
      });

      if (response?.isSuccess) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: response.message,
        });

        setTimeout(() => {
          onSuccess();
          onClose();
          setForm({ name: "", email: "", phone: "" });
        }, 1000);
      } else {
        toast.current.show({
          severity: "error",
          summary: "Failed",
          detail: response.message || "Unable to add parent",
        });
      }
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: err.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      header="Add Parent"
      visible={visible}
      onHide={onClose}
      className="w-[90%] md:w-[35%]"
      draggable={false}
    >
      <Toast ref={toast} />

      <div className="space-y-4 relative pr-4">
        {/* NAME */}
        <div>
          <label className="text-sm font-medium">Parent Name <span className="text-red-500">*</span></label>
          <InputText
            className={`w-full ${errors.name ? "border-red-500" : ""}`}
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            disabled={loading}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        {/* EMAIL */}
        <div>
          <label className="text-sm font-medium">Email <span className="text-red-500">*</span></label>
          <InputText
            className={`w-full ${errors.email ? "border-red-500" : ""}`}
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            disabled={loading}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* PHONE */}
        <div>
          <label className="text-sm font-medium">Phone <span className="text-red-500">*</span></label>
          <InputText
            className={`w-full ${errors.phone ? "border-red-500" : ""}`}
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            disabled={loading}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
          )}
        </div>

        {/* BUTTONS */}
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
              "Add Parent"
            )}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
