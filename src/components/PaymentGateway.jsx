import React, { useState } from "react";
import {
  CreditCard,
  Smartphone,
  Building2,
  ShieldCheck,
  Lock,
  ChevronRight,
  X,
  CheckCircle2,
} from "lucide-react";
import { Button } from "./ui/Button";
import { Card } from "./ui/cards";

export default function PaymentGateway({ plan, onClose, onPaymentSuccess }) {
  const [method, setMethod] = useState("upi");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate Gateway processing
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <Card className="w-full max-w-4xl grid md:grid-cols-12 overflow-hidden bg-white animate-in fade-in zoom-in duration-200">
        {/* Left Side: Order Summary (Design match for Spe) */}
        <div className="md:col-span-5 bg-slate-50 p-8 border-r border-slate-100">
          <div className="flex justify-between items-center mb-8 md:hidden">
            <h2 className="font-bold text-xl">Checkout</h2>
            <button onClick={onClose}>
              <X className="size-6" />
            </button>
          </div>

          <h2 className="text-blue-900 font-bold text-xl mb-6 hidden md:block">
            Order Summary
          </h2>

          <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm mb-6">
            <div className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">
              Selected Plan
            </div>
            <div className="text-lg font-bold text-slate-800">
              {plan.name} Membership
            </div>
            <div className="text-2xl font-bold text-blue-600 mt-2">
              {plan.price}
            </div>
          </div>

          <ul className="space-y-3 mb-8">
            {plan.features.slice(0, 4).map((f, i) => (
              <li
                key={i}
                className="flex items-center gap-2 text-sm text-slate-600 font-medium"
              >
                <CheckCircle2 className="size-4 text-emerald-500" /> {f}
              </li>
            ))}
          </ul>

          <div className="pt-6 border-t border-slate-200">
            <div className="flex justify-between text-slate-500 text-sm mb-2">
              <span>Subtotal</span>
              <span>{plan.price}</span>
            </div>
            <div className="flex justify-between text-slate-500 text-sm mb-4">
              <span>GST (18%)</span>
              <span>Included</span>
            </div>
            <div className="flex justify-between text-slate-900 font-bold text-lg">
              <span>Total Amount</span>
              <span>{plan.price}</span>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-2 text-slate-400 text-xs font-bold">
            <Lock className="size-3" /> 256-BIT SSL SECURE PAYMENT
          </div>
        </div>

        {/* Right Side: Payment Methods */}
        <div className="md:col-span-7 p-8 relative">
          <button
            onClick={onClose}
            className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 hidden md:block"
          >
            <X className="size-6" />
          </button>

          <h2 className="text-slate-800 font-bold text-2xl mb-8">Pay with</h2>

          {/* Payment Options Toggles */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <PaymentTab
              active={method === "upi"}
              onClick={() => setMethod("upi")}
              icon={<Smartphone />}
              label="UPI"
            />
            <PaymentTab
              active={method === "card"}
              onClick={() => setMethod("card")}
              icon={<CreditCard />}
              label="Card"
            />
            <PaymentTab
              active={method === "netbanking"}
              onClick={() => setMethod("netbanking")}
              icon={<Building2 />}
              label="Bank"
            />
          </div>

          {/* Dynamic Forms */}
          <div className="min-h-[240px]">
            {method === "upi" && <UPIForm />}
            {method === "card" && <CardForm />}
            {method === "netbanking" && <NetBankingForm />}
          </div>

          <Button
            disabled={isProcessing}
            onClick={handlePayment}
            className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-lg font-bold rounded-xl mt-8 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <div className="size-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Pay {plan.price} Now <ChevronRight className="size-5" />
              </>
            )}
          </Button>

          <div className="mt-6 flex justify-center items-center gap-4 opacity-40 grayscale">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
              className="h-4"
              alt="paypal"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
              className="h-6"
              alt="mastercard"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
              className="h-4"
              alt="visa"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo.png"
              className="h-6"
              alt="upi"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

// Sub-Components
const PaymentTab = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${active ? "border-blue-600 bg-blue-50/50 text-blue-600 shadow-sm" : "border-slate-100 hover:border-slate-200 text-slate-500"}`}
  >
    {React.cloneElement(icon, { className: "size-6 mb-2" })}
    <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
  </button>
);

const UPIForm = () => (
  <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
    <div>
      <label className="text-xs font-bold text-slate-500 uppercase block mb-2">
        Virtual Payment Address (VPA)
      </label>
      <input
        type="text"
        placeholder="example@okhdfc"
        className="w-full h-12 px-4 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium"
      />
    </div>
    <div className="bg-emerald-50 p-3 rounded-lg text-emerald-700 text-xs font-medium flex items-center gap-2">
      <Smartphone className="size-4" /> You will receive a request on your UPI
      app.
    </div>
  </div>
);

const CardForm = () => (
  <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
    <div>
      <label className="text-xs font-bold text-slate-500 uppercase block mb-2">
        Card Number
      </label>
      <div className="relative">
        <input
          type="text"
          placeholder="XXXX XXXX XXXX XXXX"
          className="w-full h-12 px-4 rounded-lg border border-slate-200 outline-none"
        />
        <CreditCard className="absolute right-4 top-3 text-slate-300" />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="text-xs font-bold text-slate-500 uppercase block mb-2">
          Expiry
        </label>
        <input
          type="text"
          placeholder="MM/YY"
          className="w-full h-12 px-4 rounded-lg border border-slate-200 outline-none"
        />
      </div>
      <div>
        <label className="text-xs font-bold text-slate-500 uppercase block mb-2">
          CVV
        </label>
        <input
          type="password"
          placeholder="***"
          className="w-full h-12 px-4 rounded-lg border border-slate-200 outline-none"
        />
      </div>
    </div>
  </div>
);

const NetBankingForm = () => (
  <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">
      Select Your Bank
    </label>
    <select className="w-full h-12 px-4 rounded-lg border border-slate-200 outline-none font-medium bg-white">
      <option>HDFC Bank</option>
      <option>ICICI Bank</option>
      <option>State Bank of India</option>
      <option>Axis Bank</option>
    </select>
  </div>
);
