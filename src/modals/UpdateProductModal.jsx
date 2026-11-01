import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleUpdateProductModal } from "../store/slices/extraSlice";
import { LoaderCircle, X, Sparkles, UploadCloud, Trash2, Edit3 } from "lucide-react";
import { updateProduct } from "../store/slices/productsSlice";
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

const UpdateProductModal = ({ selectedProduct }) => {
  const { loading } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  const [categories, setCategories] = useState(defaultCategoryOptions);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    mrp: "",
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    const fetchDBCategories = async () => {
      try {
        const res = await axiosInstance.get("/web/categories");
        if (res.data?.categories && res.data.categories.length > 0) {
          const catNames = res.data.categories.map((c) => c.name);
          setCategories(catNames);
        }
      } catch (err) {
        console.warn("Using default category options:", err);
      }
    };
    fetchDBCategories();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        name: selectedProduct.name || "",
        description: selectedProduct.description || "",
        price: selectedProduct.price || "",
        category: selectedProduct.category || "",
        stock: selectedProduct.stock || "",
        mrp: selectedProduct.mrp || "",
      });

      setExistingImages(selectedProduct.images || []);
    }
  }, [selectedProduct]);

  const handleRemoveOldImage = (img) => {
    setExistingImages((prev) => prev.filter((i) => i !== img));
  };

  const handleRemoveNewImage = (index) => {
    const updated = [...newImages];
    updated.splice(index, 1);
    setNewImages(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("stock", formData.stock);
    data.append("mrp", formData.mrp);

    data.append("existingImages", JSON.stringify(existingImages));

    newImages.forEach((img) => {
      data.append("newImages", img);
    });

    dispatch(updateProduct(data, selectedProduct.id));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-center items-center p-4 overflow-y-auto">
      <div className="bg-gradient-to-b from-[#161D2B] via-[#0E131E] to-[#0B0F17] border border-amber-400/30 rounded-2xl w-full max-w-2xl p-6 sm:p-8 relative text-slate-100 shadow-2xl my-8 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => dispatch(toggleUpdateProductModal())}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest bg-amber-400/10 text-amber-300 border border-amber-400/25 mb-2">
            <Edit3 className="w-3.5 h-3.5" />
            Atelier Revision
          </div>
          <h2 className="text-2xl font-serif font-bold text-white tracking-wide">
            Update Formulation
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Refine pricing, reserves, and media for {formData.name || "selected formulation"}.
          </p>
        </div>

        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"
          onSubmit={handleSubmit}
        >
          {/* Title */}
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">
              Formulation Title
            </label>
            <input
              type="text"
              placeholder="Title"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="w-full bg-[#080B11] border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 focus:border-amber-400/60 focus:outline-none placeholder:text-slate-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">
              Category
            </label>
            <select
              className="w-full bg-[#080B11] border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 focus:border-amber-400/60 focus:outline-none cursor-pointer"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              {categories.map((cat, idx) => (
                <option key={idx} value={cat} className="bg-[#080B11]">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">
              Acquisition Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="Price"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              required
              className="w-full bg-[#080B11] border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 focus:border-amber-400/60 focus:outline-none placeholder:text-slate-500"
            />
          </div>

          {/* MRP */}
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">
              Standard Retail MRP ($)
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="MRP"
              value={formData.mrp}
              onChange={(e) =>
                setFormData({ ...formData, mrp: e.target.value })
              }
              className="w-full bg-[#080B11] border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 focus:border-amber-400/60 focus:outline-none placeholder:text-slate-500"
            />
          </div>

          {/* Stock */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-slate-300 font-medium mb-1.5">
              Reserve Stock Quantity
            </label>
            <input
              type="number"
              placeholder="Stock"
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: e.target.value })
              }
              required
              className="w-full bg-[#080B11] border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 focus:border-amber-400/60 focus:outline-none placeholder:text-slate-500"
            />
          </div>

          {/* Description */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-slate-300 font-medium mb-1.5">
              Formulation Description
            </label>
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full bg-[#080B11] border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 focus:border-amber-400/60 focus:outline-none placeholder:text-slate-500"
              rows={4}
            />
          </div>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="col-span-1 md:col-span-2 bg-[#080B11]/60 border border-white/[0.06] rounded-xl p-4">
              <p className="font-semibold text-slate-300 mb-3 text-xs flex items-center justify-between">
                <span>Active Imagery in Atelier</span>
                <span className="text-[10px] text-slate-500">
                  Click trash icon to remove
                </span>
              </p>
              <div className="flex flex-wrap gap-3">
                {existingImages.map((img, index) => {
                  const imgUrl = typeof img === "string" ? img : img?.url;
                  return (
                    <div key={index} className="relative group">
                      <img
                        src={imgUrl}
                        alt="product"
                        className="w-20 h-20 object-cover rounded-xl border border-white/10 group-hover:border-amber-400/40"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveOldImage(img)}
                        className="absolute -top-2 -right-2 bg-rose-600 hover:bg-rose-700 text-white rounded-full p-1 shadow-lg transition"
                        title="Remove image"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Upload New Images */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-slate-300 font-medium mb-1.5">
              Upload Additional Flacon Imagery
            </label>
            <div className="border border-dashed border-white/20 hover:border-amber-400/50 rounded-xl p-4 text-center bg-[#080B11]/50 cursor-pointer relative transition">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setNewImages(Array.from(e.target.files))}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <UploadCloud className="w-7 h-7 text-amber-400/70 mx-auto mb-1.5" />
              <p className="text-slate-300 font-medium">
                {newImages.length > 0
                  ? `${newImages.length} new images selected`
                  : "Click or drag new photos to append"}
              </p>
            </div>
          </div>

          {/* New Images Preview */}
          {newImages.length > 0 && (
            <div className="col-span-1 md:col-span-2 flex flex-wrap gap-3">
              {newImages.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(img)}
                    alt="preview"
                    className="w-20 h-20 object-cover rounded-xl border border-emerald-400/30"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveNewImage(index)}
                    className="absolute -top-2 -right-2 bg-rose-600 text-white rounded-full p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-3 px-6 rounded-xl col-span-1 md:col-span-2 shadow-glow-gold transition duration-200 disabled:opacity-50 mt-2"
          >
            {loading ? (
              <>
                <LoaderCircle className="w-5 h-5 animate-spin" />
                <span>Updating Formulation Records...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Commit Formulation Updates</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProductModal;
