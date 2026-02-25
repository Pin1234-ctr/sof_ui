import React from "react";
import { X, UserPlus, LogIn } from "lucide-react";
import { Button } from "./ui/Button";
import { Card } from "./ui/cards";

export default function AuthSelectionModal({ onClose, onLogin, onRegister }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="w-full max-w-md p-6 relative bg-white shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="size-5" />
        </button>

        <div className="text-center mb-8 mt-2">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Complete Your Purchase
          </h2>
          <p className="text-slate-600">
            Please log in or create an account to proceed with your
            subscription.
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={onRegister}
            className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg font-semibold"
          >
            <UserPlus className="mr-2 size-5" />
            Create New Account
          </Button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500 font-medium">
                Already have an account?
              </span>
            </div>
          </div>

          <Button
            onClick={onLogin}
            variant="outline"
            className="w-full border-2 border-slate-200 hover:border-blue-600 hover:text-blue-600 h-12 text-lg font-semibold bg-transparent text-slate-700"
          >
            <LogIn className="mr-2 size-5" />
            Login to Existing Account
          </Button>
        </div>
      </Card>
    </div>
  );
}
