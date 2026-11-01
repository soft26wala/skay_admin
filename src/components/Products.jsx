import React, { useState, useEffect } from "react";
import {
  LoaderCircle,
  Plus,
  Search,
  Filter,
  Sparkles,
  Star,
  Package,
  Layers,
  Edit3,
  BookOpen,
  Trash2,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import CreateProductModal from "../modals/CreateProductModal";
import { useDispatch, useSelector } from "react-redux";
import Header from "./Header";
import UpdateProductModal from "../modals/UpdateProductModal";
import ViewProductModal from "../modals/ViewProductModal";
import {
  toggleCreateProductModal,
  toggleUpdateProductModal,
  toggleViewProductModal,
  toggleUpdateHowToUseModal,
} from "../store/slices/extraSlice";
import { deleteProduct, fetchAllProducts } from "../store/slices/productsSlice";
import UpdateHowToUseModal from "../modals/UpdateHowToUseModal";

const Products = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [maxPage, setMaxPage] = useState(null);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const dispatch = useDispatch();

  const {
    isViewProductModalOpened,
    isCreateProductModalOpened,
    isUpdateProductModalOpened,
    updateHowToUseModal,
  } = useSelector((state) => state.extra);

  const { loading, products, totalProducts, fetchingProducts } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    dispatch(fetchAllProducts(page));
  }, [dispatch, page]);

  useEffect(() => {
    if (totalProducts !== undefined) {
      const newMax = Math.ceil(totalProducts / 10);
      setMaxPage(newMax || 1);
    }
  }, [totalProducts]);

  useEffect(() => {
    if (maxPage && page > maxPage) {
      setPage(maxPage);
    }
  }, [maxPage, page]);

  // Client-side search and category filtering
  const filteredProducts = (products || []).filter((prod) => {
    const matchesSearch =
      (prod.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (prod.category || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (prod.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat =
      selectedCategory === "All" || prod.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Unique categories list
  const categoriesList = [
    "All",
    ...Array.from(new Set((products || []).map((p) => p.category).filter(Boolean))),
  ];

  return (
    <>
      <main className="pl-4 md:pl-[19rem] lg:pl-[20rem] pr-4 md:pr-8 py-6 w-full min-h-screen text-slate-100 bg-[#080B11]/50">
        <Header />

        {/* Page Title & Luxury Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] tracking-widest uppercase font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                Formulation Catalog
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {totalProducts || (products?.length || 0)} Total Masterworks
              </span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-white tracking-wide">
              Active Botanical Formulations
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Oversee inventory levels, pricing tiers, ingredients dossier, and ritual application guides.
            </p>
          </div>

          <button
            onClick={() => dispatch(toggleCreateProductModal())}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 transition-all duration-300 shadow-glow-gold hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Formulation</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-gradient-to-b from-[#131926] to-[#0D111A] border border-white/[0.08] rounded-2xl p-4 mb-6 shadow-card-luxury flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search botanical, category, or note..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0B0F17] text-slate-200 text-xs rounded-xl pl-10 pr-4 py-2.5 border border-white/[0.08] focus:border-amber-400/50 focus:outline-none placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Filter className="w-3.5 h-3.5 text-amber-400" />
              <span>Category:</span>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#0B0F17] text-slate-200 text-xs rounded-xl px-3 py-2 border border-white/[0.08] focus:border-amber-400/50 focus:outline-none cursor-pointer"
            >
              {categoriesList.map((cat) => (
                <option key={cat} value={cat} className="bg-[#0B0F17]">
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Formulations Table Card */}
        <div className="bg-gradient-to-b from-[#131926] to-[#0D111A] border border-white/[0.08] rounded-2xl shadow-card-luxury overflow-hidden">
          {fetchingProducts ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-12 h-12 border-2 border-amber-400/20 border-t-amber-400 rounded-full animate-spin" />
              <p className="mt-4 text-xs font-serif tracking-widest text-slate-400 uppercase">
                Loading Atelier Formulations...
              </p>
            </div>
          ) : filteredProducts && filteredProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#0E131E] border-b border-white/[0.08] text-slate-400 font-serif uppercase tracking-wider text-[11px]">
                    <th className="py-4 px-5">Flacon</th>
                    <th className="py-4 px-5">Formulation Title</th>
                    <th className="py-4 px-5">Category</th>
                    <th className="py-4 px-5">Pricing</th>
                    <th className="py-4 px-5">Reserve Stock</th>
                    <th className="py-4 px-5">Patron Rating</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {filteredProducts.map((product, index) => {
                    const isOutOfStock = Number(product.stock) <= 0;
                    const isLowStock =
                      Number(product.stock) > 0 && Number(product.stock) <= 5;

                    return (
                      <tr
                        key={product.id || index}
                        className="hover:bg-amber-400/[0.02] transition-colors duration-200 cursor-pointer group"
                        onClick={() => {
                          setSelectedProduct(product);
                          dispatch(toggleViewProductModal());
                        }}
                      >
                        {/* Image Thumbnail */}
                        <td className="py-3.5 px-5">
                          {product?.images && product.images[0]?.url ? (
                            <img
                              src={product.images[0].url}
                              alt={product.name}
                              className="w-12 h-12 rounded-xl object-cover border border-white/[0.1] group-hover:border-amber-400/40 group-hover:scale-105 transition duration-300"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500">
                              <Package className="w-5 h-5" />
                            </div>
                          )}
                        </td>

                        {/* Title & Description preview */}
                        <td className="py-3.5 px-5 max-w-xs">
                          <p className="font-serif font-bold text-sm text-slate-100 group-hover:text-amber-200 transition">
                            {product.name}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            {product.description || "Pure Canadian formulation."}
                          </p>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-5">
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-amber-400/10 text-amber-300 border border-amber-400/20 whitespace-nowrap">
                            {product.category}
                          </span>
                        </td>

                        {/* Price & MRP */}
                        <td className="py-3.5 px-5 font-mono">
                          <span className="text-amber-300 font-bold text-sm">
                            ${Number(product.price).toFixed(2)}
                          </span>
                          {product.mrp && Number(product.mrp) > Number(product.price) && (
                            <span className="block text-[10px] text-slate-500 line-through">
                              ${Number(product.mrp).toFixed(2)}
                            </span>
                          )}
                        </td>

                        {/* Stock status badge */}
                        <td className="py-3.5 px-5">
                          {isOutOfStock ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-rose-500/10 text-rose-300 border border-rose-500/25">
                              Depleted (0)
                            </span>
                          ) : isLowStock ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/25">
                              Low Reserve ({product.stock})
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
                              {product.stock} Flacons
                            </span>
                          )}
                        </td>

                        {/* Ratings */}
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-1 text-amber-400 font-medium">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            <span className="font-mono text-xs">
                              {Number(product.ratings || 5.0).toFixed(1)}
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-5 text-right">
                          <div
                            className="inline-flex items-center gap-1.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {/* Update Button */}
                            <button
                              onClick={() => {
                                setSelectedProduct(product);
                                dispatch(toggleUpdateProductModal());
                              }}
                              className="p-2 rounded-xl text-slate-300 hover:text-amber-300 bg-white/5 hover:bg-amber-400/10 border border-white/10 hover:border-amber-400/30 transition"
                              title="Update Formulation Details"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            {/* How to use */}
                            <button
                              onClick={() => {
                                setSelectedProduct(product);
                                dispatch(toggleUpdateHowToUseModal());
                              }}
                              className="p-2 rounded-xl text-slate-300 hover:text-sky-300 bg-white/5 hover:bg-sky-400/10 border border-white/10 hover:border-sky-400/30 transition"
                              title="Edit Application Ritual Steps"
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => {
                                setSelectedProduct(product);
                                dispatch(deleteProduct(product.id, page));
                              }}
                              className="p-2 rounded-xl text-slate-300 hover:text-rose-300 bg-white/5 hover:bg-rose-400/10 border border-white/10 hover:border-rose-400/30 transition"
                              title="Archive / Purge Formulation"
                            >
                              {selectedProduct?.id === product.id && loading ? (
                                <LoaderCircle className="w-3.5 h-3.5 animate-spin text-rose-400" />
                              ) : (
                                <Trash2 className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <Package className="w-12 h-12 text-amber-400/40 mx-auto mb-3" />
              <h3 className="text-lg font-serif font-bold text-white mb-1">
                No Formulations Found
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                No active botanical items match your search term or active category filters.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-amber-300 border border-amber-400/30 transition"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Pagination Footer */}
          {!fetchingProducts && filteredProducts.length > 0 && (
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

        {/* Floating Add Formulation Action Button */}
        <button
          onClick={() => dispatch(toggleCreateProductModal())}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 p-4 rounded-full shadow-glow-gold z-40 transition-all duration-300 hover:scale-110 flex items-center justify-center group"
          title="Create New Botanical Formulation"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      </main>

      {/* MODALS */}
      {isCreateProductModalOpened && <CreateProductModal />}
      {isUpdateProductModalOpened && (
        <UpdateProductModal selectedProduct={selectedProduct} />
      )}
      {isViewProductModalOpened && (
        <ViewProductModal selectedProduct={selectedProduct} />
      )}
      {updateHowToUseModal && (
        <UpdateHowToUseModal selectedProduct={selectedProduct} />
      )}
    </>
  );
};

export default Products;
