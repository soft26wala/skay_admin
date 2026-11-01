import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNewProduct } from "../store/slices/productsSlice";
import { toggleCreateProductModal } from "../store/slices/extraSlice";
import { LoaderCircle, X, Sparkles, UploadCloud, Image as ImageIcon } from "lucide-react";
import { axiosInstance } from "../lib/axios";

const defaultCategoryOptions = [
  "Skincare & Serums",
  "Hair Care & Oils",
  "Body & Bath Luxury",
  "Wellness & Daily Vitality",
  "Organic Teas & Infusions",
  "Aromatherapy & Essential Oils",
  "Men's Grooming",
  "Sleep & Relaxation",
];

const CreateProductModal = () => {
  const { loading } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  const [categories, setCategories] = useState(defaultCategoryOptions);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: defaultCategoryOptions[0],
    stock: "",
    images: [],
  });

  useEffect(() => {
    const fetchDBCategories = async () => {
      try {
        const res = await axiosInstance.get("/web/categories");
        if (res.data?.categories && res.data.categories.length > 0) {
          const catNames = res.data.categories.map((c) => c.name);
          setCategories(catNames);
          setFormData((prev) => ({
            ...prev,
            category: prev.category || catNames[0],
          }));
        }
      } catch (err) {
        console.warn("Using default category options:", err);
      }
    };
    fetchDBCategories();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("stock", formData.stock);

    for (let i = 0; i < formData.images.length; i++) {
      data.append("images", formData.images[i]);
    }

    dispatch(createNewProduct(data));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-center items-center p-4 overflow-y-auto">
      <div className="bg-gradient-to-b from-[#161D2B] via-[#0E131E] to-[#0B0F17] border border-amber-400/30 rounded-2xl w-full max-w-2xl p-6 sm:p-8 relative text-slate-100 shadow-2xl my-8">
        {/* Close Button */}
        <button
          onClick={() => dispatch(toggleCreateProductModal())}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest bg-amber-400/10 text-amber-300 border border-amber-400/25 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Atelier Creation
          </div>
          <h2 className="text-2xl font-serif font-bold text-white tracking-wide">
            Add New Formulation
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Publish a new haute botanical flacon to the Skay Products Canadian catalog.
          </p>
        </div>

        {/* Creation Form */}
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"
          onSubmit={handleSubmit}
        >
          {/* Formulation Title */}
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">
              Formulation Title
            </label>
            <input
              type="text"
              placeholder="e.g., Canadian Arctic Glow Serum"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              required
              className="w-full bg-[#080B11] border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 focus:border-amber-400/60 focus:outline-none placeholder:text-slate-500"
            />
          </div>

          {/* Category Select */}
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">
              Botanical Category
            </label>
            <select
              className="w-full bg-[#080B11] border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 focus:border-amber-400/60 focus:outline-none cursor-pointer"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              required
            >
              {categories.map((cat, idx) => (
                <option key={idx} value={cat} className="bg-[#080B11]">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Acquisition Price */}
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">
              Acquisition Price (CAD / USD)
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="e.g., 85.00"
              value={formData.price}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: e.target.value,
                })
              }
              required
              className="w-full bg-[#080B11] border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 focus:border-amber-400/60 focus:outline-none placeholder:text-slate-500"
            />
          </div>

          {/* Stock Reserve */}
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">
              Reserve Stock (Units)
            </label>
            <input
              type="number"
              placeholder="e.g., 100"
              value={formData.stock}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  stock: e.target.value,
                })
              }
              required
              className="w-full bg-[#080B11] border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 focus:border-amber-400/60 focus:outline-none placeholder:text-slate-500"
            />
          </div>

          {/* Image Files Upload */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-slate-300 font-medium mb-1.5">
              Botanical Flacon Imagery (Select Multiple)
            </label>
            <div className="border border-dashed border-white/20 hover:border-amber-400/50 rounded-xl p-4 text-center bg-[#080B11]/50 cursor-pointer relative transition">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    images: Array.from(e.target.files),
                  })
                }
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <UploadCloud className="w-8 h-8 text-amber-400/70 mx-auto mb-1.5" />
              <p className="text-slate-300 font-medium">
                {formData.images.length > 0
                  ? `${formData.images.length} images selected for upload`
                  : "Click or drag flacon photography here"}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                PNG, JPG, or WEBP up to 10MB each
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-slate-300 font-medium mb-1.5">
              Formulation Description & Botanical Notes
            </label>
            <textarea
              placeholder="Detailed description of active botanicals, terroir sourcing, and therapeutic ritual benefits..."
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
              className="w-full bg-[#080B11] border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 focus:border-amber-400/60 focus:outline-none placeholder:text-slate-500"
              rows={4}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-3 px-6 rounded-xl col-span-1 md:col-span-2 shadow-glow-gold transition duration-200 disabled:opacity-50 mt-2"
          >
            {loading ? (
              <>
                <LoaderCircle className="w-5 h-5 animate-spin" />
                <span>Publishing to Atelier Catalog...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Publish Formulation to Boutique</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProductModal;
