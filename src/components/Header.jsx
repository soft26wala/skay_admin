import React from "react";
import { useDispatch, useSelector } from "react-redux";
import avatar from "../assets/avatar.jpg";
import { Menu, ExternalLink, Sparkles, Activity, ShieldCheck } from "lucide-react";
import { toggleNavbar } from "../store/slices/extraSlice";

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const { openedComponent } = useSelector((state) => state.extra);
  const dispatch = useDispatch();

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-white/[0.08] gap-4">
      {/* Breadcrumb & Section Name */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-400/90 mb-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Skay Atelier</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-300 font-bold">{openedComponent || "Dashboard"}</span>
        </div>
        <h1 className="font-serif-luxury text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
          {openedComponent === "Dashboard" && "Executive Command Center"}
          {openedComponent === "Orders" && "Bespoke Orders & Consignments"}
          {openedComponent === "Products" && "Sacred Formulations Inventory"}
          {openedComponent === "Web" && "Website CMS & Digital Atelier"}
          {openedComponent === "Users" && "Patron Directory & Concierge"}
          {openedComponent === "Profile" && "Formulator Profile & Security"}
        </h1>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Live Status Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Atelier Operational</span>
        </div>

        {/* Client Store Link */}
        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-amber-300 text-xs font-semibold transition"
          title="Open Client Website"
        >
          <span>View Boutique</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        {/* Mobile Menu Button */}
        <button
          className="p-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-slate-300 hover:text-white md:hidden"
          onClick={() => dispatch(toggleNavbar())}
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Admin Avatar Preview */}
        <div className="hidden sm:flex items-center gap-2.5 pl-2 border-l border-white/[0.08]">
          <div className="relative">
            <img
              src={user?.avatar?.url || avatar}
              alt={user?.name || "Admin"}
              className="w-10 h-10 rounded-full object-cover border border-amber-400/40 ring-2 ring-amber-400/10"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-[#0D111A]" />
          </div>
          <div className="text-left hidden xl:block">
            <p className="text-xs font-bold text-slate-200">{user?.name || "Master Formulator"}</p>
            <p className="text-[10px] text-amber-400/80 font-medium">Canada Concierge</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

