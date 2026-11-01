import React, { useEffect, useState } from "react";
import avatarFallback from "../assets/avatar.jpg";
import { useDispatch, useSelector } from "react-redux";
import Header from "./Header";
import { deleteUser, fetchAllUsers } from "../store/slices/adminSlice";
import {
  Users as UsersIcon,
  Search,
  ShieldCheck,
  Calendar,
  Mail,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

const Users = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null, name: "" });

  const { loading, users, totalUsers } = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  const [maxPage, setMaxPage] = useState(null);

  useEffect(() => {
    dispatch(fetchAllUsers(page));
  }, [dispatch, page]);

  useEffect(() => {
    if (totalUsers !== undefined) {
      const newMax = Math.ceil(totalUsers / 10);
      setMaxPage(newMax || 1);
    }
  }, [totalUsers]);

  useEffect(() => {
    if (maxPage && page > maxPage) {
      setPage(maxPage);
    }
  }, [maxPage, page]);

  const handleDeleteUser = () => {
    if (deleteConfirm.id) {
      dispatch(deleteUser(deleteConfirm.id, page));
      setDeleteConfirm({ open: false, id: null, name: "" });
    }
  };

  const filteredUsers = (users || []).filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      (u.name || "").toLowerCase().includes(term) ||
      (u.email || "").toLowerCase().includes(term)
    );
  });

  return (
    <>
      <main className="pl-4 md:pl-[19rem] lg:pl-[20rem] pr-4 md:pr-8 py-6 w-full min-h-screen text-slate-100 bg-[#080B11]/50">
        <Header />

        {/* Page Title & Luxury Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] tracking-widest uppercase font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                Atelier Directory
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {totalUsers || (users?.length || 0)} Registered Patrons
              </span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-white tracking-wide">
              Patron & Client Accounts
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Maintain the verified directory of boutique clients, privilege tiers, and account permissions.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-gradient-to-b from-[#131926] to-[#0D111A] border border-white/[0.08] rounded-2xl p-4 mb-6 shadow-card-luxury flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search patron by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0B0F17] text-slate-200 text-xs rounded-xl pl-10 pr-4 py-2.5 border border-white/[0.08] focus:border-amber-400/50 focus:outline-none placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>End-to-End Encrypted Patron Credentials</span>
          </div>
        </div>

        {/* Patrons Table Card */}
        <div className="bg-gradient-to-b from-[#131926] to-[#0D111A] border border-white/[0.08] rounded-2xl shadow-card-luxury overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-12 h-12 border-2 border-amber-400/20 border-t-amber-400 rounded-full animate-spin" />
              <p className="mt-4 text-xs font-serif tracking-widest text-slate-400 uppercase">
                Accessing Patron Registry...
              </p>
            </div>
          ) : filteredUsers && filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#0E131E] border-b border-white/[0.08] text-slate-400 font-serif uppercase tracking-wider text-[11px]">
                    <th className="py-4 px-5">Patron</th>
                    <th className="py-4 px-5">Email Coordinates</th>
                    <th className="py-4 px-5">Privilege Tier</th>
                    <th className="py-4 px-5">Registered Since</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {filteredUsers.map((user, index) => {
                    const avatarSrc = user?.avatar?.url || avatarFallback;
                    const isAdmin = user?.role === "Admin";

                    return (
                      <tr
                        key={user.id || index}
                        className="hover:bg-amber-400/[0.02] transition-colors duration-200"
                      >
                        {/* Avatar & Name */}
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-amber-400/30 ring-2 ring-amber-400/10 flex-shrink-0">
                              <img
                                src={avatarSrc}
                                alt={user.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-serif font-bold text-sm text-slate-100">
                                {user.name}
                              </p>
                              <p className="text-[10px] text-slate-400 font-mono">
                                UID #{user.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="py-3.5 px-5 font-mono text-slate-300">
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-slate-500" />
                            <span>{user.email}</span>
                          </div>
                        </td>

                        {/* Role / Tier */}
                        <td className="py-3.5 px-5">
                          {isAdmin ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/30">
                              <Sparkles className="w-3 h-3" />
                              Atelier Administrator
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium bg-white/5 text-slate-300 border border-white/10">
                              Boutique Patron
                            </span>
                          )}
                        </td>

                        {/* Registered Date */}
                        <td className="py-3.5 px-5 text-slate-400 font-mono">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-500" />
                            <span>
                              {new Date(user.created_at).toLocaleDateString([], {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        </td>

                        {/* Delete Action */}
                        <td className="py-3.5 px-5 text-right">
                          <button
                            onClick={() =>
                              setDeleteConfirm({
                                open: true,
                                id: user.id,
                                name: user.name,
                              })
                            }
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 hover:border-rose-500/40 transition"
                            title="Revoke Patron Account"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Revoke</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <UsersIcon className="w-12 h-12 text-amber-400/40 mx-auto mb-3" />
              <h3 className="text-lg font-serif font-bold text-white mb-1">
                No Patron Records Found
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                No registered clientele matches your search query.
              </p>
              <button
                onClick={() => setSearchTerm("")}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-amber-300 border border-amber-400/30 transition"
              >
                Clear Search
              </button>
            </div>
          )}

          {/* Pagination Footer */}
          {!loading && filteredUsers.length > 0 && (
            <div className="px-6 py-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
              <span>
                Showing page <strong className="text-slate-200">{page}</strong> of{" "}
                <strong className="text-slate-200">{maxPage || 1}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0B0F17] border border-white/10 text-slate-300 hover:border-amber-400/30 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
                <span className="px-2.5 py-1 rounded-lg bg-amber-400/10 text-amber-300 font-mono font-bold border border-amber-400/20">
                  {page}
                </span>
                <button
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={maxPage === page || (maxPage && page >= maxPage)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0B0F17] border border-white/10 text-slate-300 hover:border-amber-400/30 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* DELETE CONFIRMATION MODAL */}
        {deleteConfirm.open && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-gradient-to-b from-[#161D2B] to-[#0E131E] border border-white/10 rounded-2xl p-6 text-center max-w-sm w-full shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/25 flex items-center justify-center mx-auto mb-4 text-rose-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-white mb-2">
                Revoke Account for {deleteConfirm.name}?
              </h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                This will permanently purge this patron profile, past cart tokens, and access privileges from the database.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    setDeleteConfirm({ open: false, id: null, name: "" })
                  }
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUser}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 transition"
                >
                  Confirm Revoke
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default Users;
