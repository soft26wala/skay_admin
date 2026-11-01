import React from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  User,
  LogOut,
  X,
  Globe,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { logout } from "../store/slices/authSlice";
import { toggleComponent, toggleNavbar } from "../store/slices/extraSlice";
import avatar from "../assets/avatar.jpg";

const SideBar = () => {
  const links = [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      title: "Dashboard",
      badge: "Live",
    },
    {
      icon: <ShoppingBag className="w-5 h-5" />,
      title: "Orders",
    },
    {
      icon: <Package className="w-5 h-5" />,
      title: "Products",
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: "Web",
      badge: "CMS",
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Users",
    },
    {
      icon: <User className="w-5 h-5" />,
      title: "Profile",
    },
  ];

  const { isNavbarOpened, openedComponent } = useSelector((state) => state.extra);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isNavbarOpened && (
        <div
          onClick={() => dispatch(toggleNavbar())}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 md:hidden"
        />
      )}

      <aside
        className={`${
          isNavbarOpened ? "left-3" : "-left-full"
        } fixed w-72 h-[calc(100vh-24px)] rounded-2xl bg-[#0D111A]/95 backdrop-blur-2xl border border-amber-500/20 z-40 top-3 transition-all duration-300 shadow-[0_16px_50px_rgba(0,0,0,0.8)] p-5 flex flex-col justify-between md:left-3`}
      >
        <div className="space-y-6">
          {/* Atelier Brand Header */}
          <div className="pb-4 border-b border-white/[0.08]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/20 via-amber-500/10 to-transparent border border-amber-400/40 flex items-center justify-center shadow-luxury-glow">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h2 className="font-serif-luxury text-lg font-bold tracking-wide text-gold-gradient">
                    SKAY PRODUCTS
                  </h2>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-amber-400/70 font-medium">
                    Atelier Executive
                  </p>
                </div>
              </div>

              <button
                className="block md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06]"
                onClick={() => dispatch(toggleNavbar())}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Management Portal
            </div>

            {links.map((item, index) => {
              const isActive = (openedComponent || "Dashboard") === item.title;
              return (
                <button
                  onClick={() => {
                    dispatch(toggleComponent(item.title));
                    if (isNavbarOpened) dispatch(toggleNavbar());
                  }}
                  key={index}
                  className={`w-full group relative transition-all duration-200 rounded-xl px-3.5 py-3 flex items-center justify-between text-sm font-medium ${
                    isActive
                      ? "bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent text-amber-300 border-l-2 border-amber-400 font-semibold shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]"
                      : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`transition-colors duration-200 ${
                        isActive ? "text-amber-300" : "text-slate-400 group-hover:text-amber-300/80"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span>{item.title}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        isActive
                          ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                          : "bg-white/[0.06] text-slate-400 border border-white/[0.05]"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="space-y-3 pt-4 border-t border-white/[0.08]">
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center gap-3">
            <div className="relative">
              <img
                src={user?.avatar?.url || avatar}
                alt={user?.name || "Admin"}
                className="w-10 h-10 rounded-full object-cover border border-amber-400/40 ring-2 ring-amber-400/20"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-[#0D111A]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-200 truncate">{user?.name || "Atelier Admin"}</p>
              <div className="flex items-center gap-1 text-[10px] text-amber-400/80 font-medium">
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                <span>Executive {user?.role || "Director"}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition duration-200 shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default SideBar;

