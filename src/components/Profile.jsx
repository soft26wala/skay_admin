import React, { useState } from "react";
import avatarFallback from "../assets/avatar.jpg";
import Header from "./Header";
import { useDispatch, useSelector } from "react-redux";
import {
  updateAdminPassword,
  updateAdminProfile,
} from "../store/slices/authSlice";
import {
  User,
  ShieldCheck,
  KeyRound,
  Mail,
  Camera,
  Sparkles,
  LoaderCircle,
  Lock,
} from "lucide-react";

const Profile = () => {
  const { user, loading } = useSelector((state) => state.auth);
  const [editData, setEditData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [updatingSection, setUpdatingSection] = useState("");

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const dispatch = useDispatch();

  const updateProfile = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", editData.name);
    formData.append("email", editData.email);
    if (avatar) {
      formData.append("avatar", avatar);
    }
    setUpdatingSection("Profile");
    dispatch(updateAdminProfile(formData));
  };

  const updatePassword = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("currentPassword", passwordData.currentPassword);
    formData.append("newPassword", passwordData.newPassword);
    formData.append("confirmNewPassword", passwordData.confirmNewPassword);
    setUpdatingSection("Password");
    dispatch(updateAdminPassword(formData));
  };

  const displayAvatar =
    avatarPreview || user?.avatar?.url || avatarFallback;

  return (
    <>
      <main className="pl-4 md:pl-[19rem] lg:pl-[20rem] pr-4 md:pr-8 py-6 w-full min-h-screen text-slate-100 bg-[#080B11]/50">
        <Header />

        {/* Page Title & Luxury Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] tracking-widest uppercase font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                Atelier Administration
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Superuser Clearance Granted
              </span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-white tracking-wide">
              Executive Atelier Profile
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Manage your administrative identity, public executive credentials, and cryptographic security tokens.
            </p>
          </div>
        </div>

        {/* Executive Overview Hero Card */}
        <div className="bg-gradient-to-r from-[#131926] via-[#101522] to-[#0A0D15] border border-amber-400/30 rounded-3xl p-6 md:p-8 shadow-card-luxury mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-radial-gold opacity-15 pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
            {/* Avatar with luxury golden ring */}
            <div className="relative group">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-amber-400/60 shadow-glow-gold">
                <img
                  src={displayAvatar}
                  alt={user?.name || "Admin"}
                  className="w-full h-full object-cover"
                />
              </div>
              <label className="absolute bottom-1 right-1 bg-amber-500 hover:bg-amber-400 text-slate-950 p-2 rounded-full cursor-pointer shadow-lg transition duration-200">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Profile Info */}
            <div className="text-center md:text-left flex-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest bg-amber-400/10 text-amber-300 border border-amber-400/25 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                {user?.role || "Atelier Admin"} Privilege Tier
              </div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-white">
                {user?.name || "Executive Administrator"}
              </h2>
              <p className="text-xs md:text-sm text-slate-400 font-mono mt-1 flex items-center justify-center md:justify-start gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400/70" />
                <span>{user?.email || "admin@skayproducts.com"}</span>
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4 text-xs">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-slate-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Full Catalog Rights
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-slate-300">
                  <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                  Consignment Authorization
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Two Forms Grid: Identity Update & Security Credentials */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl">
          {/* Identity & Coordinates */}
          <div className="bg-gradient-to-b from-[#131926] to-[#0D111A] border border-white/[0.08] rounded-2xl p-6 shadow-card-luxury">
            <div className="flex items-center gap-2.5 mb-2">
              <User className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-serif font-bold text-white">
                Personal Credentials
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              Update your administrative display name, contact email, and executive avatar.
            </p>

            <form onSubmit={updateProfile} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  Full Administrative Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleProfileChange}
                  required
                  placeholder="Your Name"
                  className="w-full bg-[#080B11] border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 focus:border-amber-400/60 focus:outline-none placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  Official Communication Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleProfileChange}
                  required
                  placeholder="admin@skayproducts.com"
                  className="w-full bg-[#080B11] border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 focus:border-amber-400/60 focus:outline-none placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  Avatar Replacement File
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="w-full bg-[#080B11] border border-white/10 rounded-xl px-4 py-2 text-slate-400 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-400/10 file:text-amber-300 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-3 px-6 rounded-xl shadow-glow-gold transition duration-200 disabled:opacity-50 mt-6"
              >
                {loading && updatingSection === "Profile" ? (
                  <>
                    <LoaderCircle className="w-4 h-4 animate-spin" />
                    <span>Synchronizing Profile...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Save Profile Changes</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Security & Authentication */}
          <div className="bg-gradient-to-b from-[#131926] to-[#0D111A] border border-white/[0.08] rounded-2xl p-6 shadow-card-luxury">
            <div className="flex items-center gap-2.5 mb-2">
              <Lock className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-serif font-bold text-white">
                Security & Passcode
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              Safeguard your atelier clearance by regularly updating your master passcode.
            </p>

            <form onSubmit={updatePassword} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  Current Master Passcode
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-[#080B11] border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 focus:border-amber-400/60 focus:outline-none placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  New Desired Passcode
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-[#080B11] border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 focus:border-amber-400/60 focus:outline-none placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  Confirm New Passcode
                </label>
                <input
                  type="password"
                  name="confirmNewPassword"
                  value={passwordData.confirmNewPassword}
                  onChange={handlePasswordChange}
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-[#080B11] border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 focus:border-amber-400/60 focus:outline-none placeholder:text-slate-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-3 px-6 rounded-xl shadow-glow-gold transition duration-200 disabled:opacity-50 mt-6"
              >
                {loading && updatingSection === "Password" ? (
                  <>
                    <LoaderCircle className="w-4 h-4 animate-spin" />
                    <span>Encrypting New Passcode...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Update Security Passcode</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
};

export default Profile;
