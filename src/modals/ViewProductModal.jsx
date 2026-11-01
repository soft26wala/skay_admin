import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toggleViewProductModal } from "../store/slices/extraSlice";
import { X, Star, Package, Calendar, Sparkles, Tag, ShieldCheck } from "lucide-react";

const ViewProductModal = ({ selectedProduct }) => {
  const dispatch = useDispatch();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!selectedProduct) return null;

  const images = selectedProduct.images || [];
  const currentImg = images[activeImageIndex]?.url || images[0]?.url;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex justify-center items-center p-4 overflow-y-auto">
      <div className="bg-gradient-to-b from-[#161D2B] via-[#0E131E] to-[#0B0F17] border border-amber-400/30 rounded-2xl w-full max-w-3xl p-6 sm:p-8 relative text-slate-100 shadow-2xl my-8 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => dispatch(toggleViewProductModal())}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-widest bg-amber-400/10 text-amber-300 border border-amber-400/25">
              {selectedProduct.category}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              ID #{selectedProduct.id}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
            {selectedProduct.name}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Images Gallery */}
          <div className="space-y-3">
            <div className="aspect-square rounded-2xl overflow-hidden border border-white/10 bg-[#080B11] flex items-center justify-center relative">
              {currentImg ? (
                <img
                  src={currentImg}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Package className="w-16 h-16 text-slate-600" />
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border transition flex-shrink-0 ${
                      activeImageIndex === idx
                        ? "border-amber-400 ring-2 ring-amber-400/30"
                        : "border-white/10 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img?.url}
                      alt={`Thumbnail ${idx}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dossier Information */}
          <div className="flex flex-col justify-between space-y-4 text-xs">
            <div className="space-y-4">
              {/* Pricing & Ratings */}
              <div className="bg-[#080B11]/70 border border-white/[0.06] rounded-xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                    Acquisition Value
                  </span>
                  <div className="text-2xl font-serif font-bold text-amber-300">
                    ${Number(selectedProduct.price).toFixed(2)}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                    Patron Satisfaction
                  </span>
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold text-sm mt-0.5 justify-end">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{Number(selectedProduct.ratings || 5.0).toFixed(1)} / 5.0</span>
                  </div>
                </div>
              </div>

              {/* Stock Status */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <span className="text-slate-400">Reserve Stock</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedProduct.stock > 0
                      ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                      : "bg-rose-500/10 text-rose-300 border border-rose-500/30"
                  }`}
                >
                  {selectedProduct.stock > 0
                    ? `${selectedProduct.stock} Flacons Available`
                    : "Depleted / Out of Stock"}
                </span>
              </div>

              {/* Description */}
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1.5">
                <span className="text-slate-400 uppercase tracking-wider font-semibold text-[10px] block">
                  Formulation Details & Terroir
                </span>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {selectedProduct.description || "Pure Canadian formulation."}
                </p>
              </div>

              {/* Creation Date & Authenticity */}
              <div className="grid grid-cols-2 gap-2 text-slate-400 text-[11px]">
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-amber-400/80" />
                  <span>
                    Cataloged:{" "}
                    {new Date(selectedProduct.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400/80" />
                  <span>Atelier Certified</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => dispatch(toggleViewProductModal())}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs font-semibold transition"
            >
              Close Specification View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProductModal;
