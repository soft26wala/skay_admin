import React from "react";
import { useSelector } from "react-redux";
import { Award, Star } from "lucide-react";

const TopSellingProducts = () => {
  const { topSellingProducts } = useSelector((state) => state.admin);

  return (
    <div className="bg-gradient-to-b from-[#131926] to-[#0C101A] rounded-2xl p-6 border border-white/[0.08] shadow-card-luxury overflow-hidden xl:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-serif-luxury font-bold text-slate-100 text-base tracking-wide flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            Top Botanical Formulations Leaderboard
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Most coveted formulations by patron demand</p>
        </div>

        <span className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20">
          Peak Velocity
        </span>
      </div>

      <div className="overflow-x-auto scrollbar-hide max-h-[380px]">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-white/[0.08] text-slate-400 uppercase tracking-wider text-[10px]">
              <th className="py-3 px-3">Formulation</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3 text-right">Volume Sold</th>
              <th className="py-3 px-3 text-right">Patron Review</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {topSellingProducts?.length > 0 ? (
              topSellingProducts.map((element, index) => (
                <tr
                  key={index}
                  className="hover:bg-white/[0.03] transition-colors duration-150 group"
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-900 border border-amber-400/30 flex-shrink-0 shadow-sm">
                        <img
                          src={element.image || "/new/hero/img1.png"}
                          alt={element.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          onError={(e) => {
                            e.target.src = "/new/hero/img1.png";
                          }}
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-200 group-hover:text-amber-300 transition line-clamp-1">
                          {element.name}
                        </p>
                        <span className="text-[10px] text-slate-500 font-mono">Rank #{index + 1}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/[0.04] border border-white/[0.08] text-slate-300">
                      {element.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="font-bold text-amber-300 font-serif-luxury text-sm">
                      {element.total_sold}
                    </span>
                    <span className="text-[10px] text-slate-500 ml-1">flacons</span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="inline-flex items-center gap-1 text-amber-400 font-semibold text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{element.ratings}</span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-500">
                  No formulation sales records yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopSellingProducts;

