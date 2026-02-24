import React, { useState, useRef } from "react";
import { X } from "lucide-react";
import { Toast } from "primereact/toast";
import { useAuth } from "../helper/AuthContext";
import ApiService from "../../service/ApiService";
import { POST_APIS } from "../../../connection";
import { InputOtp } from "primereact/inputotp"; // If using prime
import { Eye, EyeOff } from "lucide-react";
import { InputText } from "primereact/inputtext";

export default function ForgotPasswordModal() {
  const toast = useRef(null);
  const { closeModal, openLoginModal } = useAuth();

  const [step, setStep] = useState(1); // 1=enter email, 2=OTP verify
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!email) return;

    setLoading(true);
    try {
      const res = await ApiService(POST_APIS.forgot_password_sent_otp, {
        method: "POST",
        body: { email },
      });

      if (res.isSuccess) {
        toast.current.show({
          severity: "success",
          summary: "OTP Sent",
          detail: "Check your email for OTP.",
        });
        setStep(2);
      } else {
        toast.current.show({
          severity: "error",
          summary: "Failed",
          detail: res.message || "Unable to send OTP",
        });
      }
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otp || !newPassword) return;

    setLoading(true);
    try {
      const res = await ApiService(POST_APIS.reset_password_usingotp, {
        method: "POST",
        body: { email, otp, newPassword },
      });

      if (res.isSuccess) {
        toast.current.show({
          severity: "success",
          summary: "Password Updated",
          detail: "You can now log in.",
        });

        setTimeout(() => {
          closeModal();
          openLoginModal();
        }, 800);
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: res.message,
        });
      }
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Toast ref={toast} />
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold text-blue-900">
            Forgot Password
          </h2>
          <button
            onClick={closeModal}
            className="text-gray-400 cursor-pointer hover:text-gray-600"
          >
            <X />
          </button>
        </div>

        {step === 1 && (
          <div className="flex flex-col gap-4">
            <label className="text-sm font-medium">
              Enter Registered Email
            </label>

            <InputText
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 rounded w-full"
            />

            <button
              disabled={loading}
              onClick={handleSendOtp}
              className={`w-full py-2 text-white font-semibold rounded cursor-pointer ${
                loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <label className="text-sm font-medium">Enter OTP</label>

            <InputOtp
              value={otp}
              onChange={(e) => setOtp(e.value)}
              length={6}
              
            />

            <label className="text-sm font-medium">New Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border p-2 pr-10 rounded w-full"
              />
              <button
                type="button"
                className="absolute right-2 top-2 text-gray-500"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <EyeOff /> : <Eye />}
              </button>
            </div>

            <button
              disabled={loading}
              onClick={handleResetPassword}
              className={`w-full py-2 text-white font-semibold rounded cursor-pointer ${
                loading ? "bg-green-300" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
