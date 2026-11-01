import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { forgotPassword } from "../store/slices/authSlice";
import { Sparkles, Mail, ArrowLeft, ArrowRight, LoaderCircle } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const dispatch = useDispatch();
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword({ email }));
    setEmail("");
  };

  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  if (isAuthenticated && user?.role === "Admin") {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080B11] relative overflow-hidden px-4 py-12">
      {/* Luxury Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-radial-gold opacity-15 pointer-events-none blur-2xl" />

      <div className="relative z-10 bg-gradient-to-b from-[#131926]/95 via-[#0E131E]/95 to-[#0A0D14]/95 border border-amber-400/30 rounded-3xl p-8 sm:p-10 shadow-card-luxury max-w-md w-full backdrop-blur-xl text-slate-100">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-[1px] shadow-glow-gold mb-3 flex items-center justify-center">
            <div className="w-full h-full bg-[#0D111A] rounded-2xl flex items-center justify-center">
              <span className="font-serif font-black text-amber-300 text-xl tracking-tighter">
                SP
              </span>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] uppercase tracking-widest font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/25 mb-1.5">
            <Sparkles className="w-3 h-3" />
            Security Recovery
          </div>
          <h2 className="text-2xl font-serif font-bold text-white tracking-wide">
            Reset Passcode
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Provide your registered atelier email to receive cryptographic password reset credentials.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label
              htmlFor="email"
              className="block text-slate-300 font-medium mb-1.5"
            >
              Registered Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@skayproducts.com"
                className="w-full bg-[#080B11] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-slate-200 focus:border-amber-400/60 focus:outline-none placeholder:text-slate-500 text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Atelier Portal</span>
            </Link>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-3.5 rounded-xl text-xs tracking-wider uppercase shadow-glow-gold transition duration-200 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <LoaderCircle className="w-4 h-4 animate-spin" />
                  <span>Dispatching Token...</span>
                </>
              ) : (
                <>
                  <span>Send Reset Authorization</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
