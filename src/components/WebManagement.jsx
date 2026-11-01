import React, { useState, useEffect } from "react";
import {
  Globe,
  Image as ImageIcon,
  Layers,
  Sparkles,
  CheckCircle2,
  Trash2,
  Plus,
  RefreshCw,
  LoaderCircle,
  ExternalLink,
  Megaphone,
  Check,
  Pencil,
  X,
  UploadCloud,
} from "lucide-react";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";

// Helper to resolve images across Cloudinary, server uploads, and client assets

// Helper to resolve images across Cloudinary, server uploads, and client assets
export const resolveImageUrl = (url) => {
  if (!url) return "";
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("blob:") ||
    url.startsWith("data:")
  ) {
    return url;
  }
  if (url.startsWith("/new/")) {
    return `http://localhost:4000${url}`;
  }
  if (url.startsWith("/uploads/")) {
    return `http://localhost:4000${url}`;
  }
  return url;
};

// Reusable Luxury Image File Upload Input with Cloudinary Preview
const ImageFileInput = ({
  label = "Upload Image File (Cloudinary Synced) *",
  file,
  preview,
  currentValue,
  onFileChange,
  onClear,
  required = false,
}) => {
  const displayImage = resolveImageUrl(preview || currentValue);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-300">
          {label}
        </label>
        <span className="text-[10px] font-mono text-amber-400/90 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/25">
          Cloudinary CDN
        </span>
      </div>

      <div className="flex items-center gap-3 bg-black/40 border border-white/[0.1] hover:border-amber-400/40 rounded-xl p-3 transition">
        {/* Thumbnail Preview */}
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-black/60 border border-white/10 flex items-center justify-center flex-shrink-0 relative group">
          {displayImage ? (
            <img
              src={displayImage}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          ) : (
            <ImageIcon className="w-6 h-6 text-slate-500" />
          )}
        </div>

        {/* Action Controls */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 text-amber-300 border border-amber-400/30 text-xs font-semibold transition">
              <UploadCloud className="w-3.5 h-3.5" />
              <span>{file ? "Change File" : "Choose Image File"}</span>
              <input
                type="file"
                accept="image/*"
                required={required && !displayImage}
                onChange={onFileChange}
                className="hidden"
              />
            </label>

            {file && (
              <button
                type="button"
                onClick={onClear}
                className="text-[11px] text-rose-400 hover:text-rose-300 px-2 py-1 rounded bg-rose-500/10 border border-rose-500/20 transition"
              >
                Clear
              </button>
            )}
          </div>

          <p className="text-[11px] text-slate-400 mt-1 truncate">
            {file ? file.name : displayImage ? "Active formulation image ready" : "Select PNG, JPG, or WEBP"}
          </p>
        </div>
      </div>
    </div>
  );
};

const WebManagement = () => {
  const [activeTab, setActiveTab] = useState("hero"); // 'hero', 'cat', 'sanctum', 'why-choose'
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Edit Modal States
  const [editingItem, setEditingItem] = useState(null);
  const [editType, setEditType] = useState(null); // 'hero', 'cat', 'sanctum', 'why-choose'
  const [editForm, setEditForm] = useState({});

  // File upload states & previews
  const [heroFile, setHeroFile] = useState(null);
  const [heroPreview, setHeroPreview] = useState("");

  const [categoryFile, setCategoryFile] = useState(null);
  const [categoryPreview, setCategoryPreview] = useState("");

  const [sanctumFile, setSanctumFile] = useState(null);
  const [sanctumPreview, setSanctumPreview] = useState("");

  const [whyFile, setWhyFile] = useState(null);
  const [whyPreview, setWhyPreview] = useState("");

  const [editFile, setEditFile] = useState(null);
  const [editPreview, setEditPreview] = useState("");

  // Data states
  const [heroSlides, setHeroSlides] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sanctumSpaces, setSanctumSpaces] = useState([]);
  const [whyChooseFeatures, setWhyChooseFeatures] = useState([]);
  const [announcementText, setAnnouncementText] = useState(
    "Haute Formulation & Complimentary Concierge Delivery on Orders Above $75 CAD"
  );

  // Form toggles
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [heroForm, setHeroForm] = useState({
    title: "",
    subtitle: "",
    badge: "Artisanal Harvest",
    image: "",
    link: "/products",
    cta_text: "Explore Collection",
  });

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    image: "",
    description: "",
  });

  const [sanctumForm, setSanctumForm] = useState({
    label: "",
    src: "",
    badge: "Atelier Sanctum",
  });

  const [whyForm, setWhyForm] = useState({
    feature_number: "",
    title: "",
    subtitle: "",
    description: "",
    image: "",
    icon_name: "Activity",
    is_reverse: false,
  });

  // 1. Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [heroRes, catRes, sanctumRes, whyRes, annRes] = await Promise.all([
        axiosInstance.get("/web/hero").catch(() => ({ data: { slides: [] } })),
        axiosInstance.get("/web/categories").catch(() => ({ data: { categories: [] } })),
        axiosInstance.get("/web/sanctum").catch(() => ({ data: { spaces: [] } })),
        axiosInstance.get("/web/why-choose").catch(() => ({ data: { features: [] } })),
        axiosInstance.get("/web/announcement").catch(() => ({ data: { announcement: "" } })),
      ]);

      if (heroRes?.data?.slides) setHeroSlides(heroRes.data.slides);
      if (catRes?.data?.categories) setCategories(catRes.data.categories);
      if (sanctumRes?.data?.spaces) setSanctumSpaces(sanctumRes.data.spaces);
      if (whyRes?.data?.features) setWhyChooseFeatures(whyRes.data.features);
      if (annRes?.data?.announcement) setAnnouncementText(annRes.data.announcement);
    } catch (err) {
      console.error("Error fetching web data:", err);
      toast.error("Failed to load website content.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. Add Handlers with File Upload & Cloudinary Sync
  const handleAddHero = async (e) => {
    e.preventDefault();
    if (!heroFile && !heroForm.image?.trim()) {
      return toast.warning("Please choose an image file for the hero slide.");
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", heroForm.title);
      formData.append("subtitle", heroForm.subtitle);
      formData.append("badge", heroForm.badge);
      formData.append("link", heroForm.link);
      formData.append("cta_text", heroForm.cta_text);
      if (heroFile) {
        formData.append("image", heroFile);
      } else if (heroForm.image) {
        formData.append("image", heroForm.image);
      }

      const res = await axiosInstance.post("/web/hero", formData);
      toast.success(res.data.message || "Hero slide added successfully!");
      setHeroForm({
        title: "",
        subtitle: "",
        badge: "Artisanal Harvest",
        image: "",
        link: "/products",
        cta_text: "Explore Collection",
      });
      setHeroFile(null);
      setHeroPreview("");
      setShowAddForm(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add hero slide.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      return toast.warning("Category name is required.");
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", categoryForm.name);
      formData.append("description", categoryForm.description);
      if (categoryFile) {
        formData.append("image", categoryFile);
      } else if (categoryForm.image) {
        formData.append("image", categoryForm.image);
      }

      const res = await axiosInstance.post("/web/categories", formData);
      toast.success(res.data.message || "Category added to database!");
      setCategoryForm({ name: "", image: "", description: "" });
      setCategoryFile(null);
      setCategoryPreview("");
      setShowAddForm(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add category.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddSanctum = async (e) => {
    e.preventDefault();
    if (!sanctumForm.label.trim()) {
      return toast.warning("Space label is required.");
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("label", sanctumForm.label);
      formData.append("badge", sanctumForm.badge);
      if (sanctumFile) {
        formData.append("src", sanctumFile);
        formData.append("image", sanctumFile);
      } else if (sanctumForm.src) {
        formData.append("src", sanctumForm.src);
      }

      const res = await axiosInstance.post("/web/sanctum", formData);
      toast.success(res.data.message || "Sanctum space added successfully!");
      setSanctumForm({ label: "", src: "", badge: "Atelier Sanctum" });
      setSanctumFile(null);
      setSanctumPreview("");
      setShowAddForm(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add sanctum space.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddWhy = async (e) => {
    e.preventDefault();
    if (!whyForm.title.trim() || !whyForm.description.trim()) {
      return toast.warning("Title and description are required.");
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("feature_number", whyForm.feature_number);
      formData.append("title", whyForm.title);
      formData.append("subtitle", whyForm.subtitle);
      formData.append("description", whyForm.description);
      formData.append("icon_name", whyForm.icon_name);
      formData.append("is_reverse", whyForm.is_reverse);
      if (whyFile) {
        formData.append("image", whyFile);
      } else if (whyForm.image) {
        formData.append("image", whyForm.image);
      }

      const res = await axiosInstance.post("/web/why-choose", formData);
      toast.success(res.data.message || "Feature added successfully!");
      setWhyForm({
        feature_number: "",
        title: "",
        subtitle: "",
        description: "",
        image: "",
        icon_name: "Activity",
        is_reverse: false,
      });
      setWhyFile(null);
      setWhyPreview("");
      setShowAddForm(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add feature.");
    } finally {
      setSubmitting(false);
    }
  };

  // 3. Delete Handlers
  const handleDelete = async (endpoint, id, name) => {
    if (!window.confirm(`Are you sure you want to delete this ${name}?`)) return;
    try {
      await axiosInstance.delete(`/web/${endpoint}/${id}`);
      toast.success(`${name} deleted successfully.`);
      fetchData();
    } catch (err) {
      toast.error(`Failed to delete ${name}.`);
    }
  };

  // 4. Edit Modal Open & Handlers
  const openEditModal = (type, item) => {
    setEditType(type);
    setEditingItem(item);
    setEditFile(null);
    setEditPreview(item.image || item.src || "");

    if (type === "hero") {
      setEditForm({
        title: item.title || "",
        subtitle: item.subtitle || "",
        badge: item.badge || "",
        image: item.image || "",
        link: item.link || "/products",
        cta_text: item.cta_text || "Explore Collection",
        display_order: item.display_order ?? 1,
      });
    } else if (type === "cat") {
      setEditForm({
        name: item.name || "",
        image: item.image || "",
        description: item.description || "",
      });
    } else if (type === "sanctum") {
      setEditForm({
        label: item.label || "",
        src: item.src || item.image || "",
        badge: item.badge || "Atelier Sanctum",
        display_order: item.display_order ?? 1,
      });
    } else if (type === "why-choose") {
      setEditForm({
        feature_number: item.feature_number || "01",
        title: item.title || "",
        subtitle: item.subtitle || "",
        description: item.description || "",
        image: item.image || "",
        icon_name: item.icon_name || "Activity",
        is_reverse: item.is_reverse || false,
        display_order: item.display_order ?? 1,
      });
    }
  };

  const closeEditModal = () => {
    setEditingItem(null);
    setEditType(null);
    setEditForm({});
    setEditFile(null);
    setEditPreview("");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingItem) return;
    setSubmitting(true);

    try {
      let endpoint = "";
      let id = editingItem.id;
      if (editType === "cat") {
        endpoint = "categories";
        id = editingItem.id || editingItem.name;
      } else if (editType === "hero") {
        endpoint = "hero";
      } else if (editType === "sanctum") {
        endpoint = "sanctum";
      } else if (editType === "why-choose") {
        endpoint = "why-choose";
      }

      const formData = new FormData();
      Object.keys(editForm).forEach((key) => {
        if (editForm[key] !== undefined && editForm[key] !== null) {
          formData.append(key, editForm[key]);
        }
      });

      if (editFile) {
        formData.append("image", editFile);
        if (editType === "sanctum") {
          formData.append("src", editFile);
        }
      }

      const res = await axiosInstance.put(`/web/${endpoint}/${encodeURIComponent(id)}`, formData);
      toast.success(res?.data?.message || "Content updated successfully!");
      closeEditModal();
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update content.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveAnnouncement = async (e) => {
    if (e) e.preventDefault();
    if (!announcementText.trim()) {
      toast.error("Announcement message cannot be empty.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await axiosInstance.post("/web/announcement", {
        announcement: announcementText.trim(),
      });
      toast.success(res?.data?.message || "Announcement bar updated successfully!");
    } catch (err) {
      toast.error("Failed to update announcement bar.");
    } finally {
      setSubmitting(false);
    }
  };

  const tabs = [
    { id: "hero", label: "Hero Banner (Top 3+ Images)", icon: <ImageIcon className="w-4 h-4" />, count: heroSlides.length, path: "web/hero" },
    { id: "cat", label: "Categories", icon: <Layers className="w-4 h-4" />, count: categories.length, path: "web/cat" },
    { id: "sanctum", label: "Wellness Sanctum", icon: <Sparkles className="w-4 h-4" />, count: sanctumSpaces.length, path: "web/sanctum" },
    { id: "why-choose", label: "Why Choose Us", icon: <CheckCircle2 className="w-4 h-4" />, count: whyChooseFeatures.length, path: "web/why-choose" },
    { id: "announcement", label: "Announcement Bar", icon: <Megaphone className="w-4 h-4" />, count: "Active", path: "web/announcement" },
  ];

  return (
    <div className="p-4 pl-4 md:pl-[20rem] pr-4 md:pr-6 py-5 w-full min-h-screen text-slate-100">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-white/[0.08] gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs tracking-widest uppercase mb-1">
            <Globe className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Website CMS & Database Management</span>
          </div>
          <h1 className="font-serif-luxury text-2xl md:text-3xl font-extrabold text-gold-gradient tracking-tight">
            Web Sections Control
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Manage top hero banner (add 3+ images), store categories from database, wellness sanctum, and guarantees.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] rounded-xl text-xs font-semibold text-slate-200 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-amber-400" : ""}`} />
            <span>Refresh</span>
          </button>

          {activeTab !== "announcement" && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 text-black font-bold rounded-xl text-xs shadow-luxury-glow transition"
            >
              <Plus className="w-4 h-4" />
              <span>{showAddForm ? "Close Form" : `Add New in ${tabs.find((t) => t.id === activeTab)?.id.toUpperCase()}`}</span>
            </button>
          )}
        </div>
      </div>

      {/* Modern Sub-Tab Navigation (web/hero, web/cat, web/sanctum, web/why-choose, web/announcement) */}
      <div className="flex flex-wrap gap-2.5 mt-6 border-b border-white/[0.08] pb-4">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setShowAddForm(false);
              }}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-medium text-xs transition-all ${
                isActive
                  ? "bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent text-amber-300 border border-amber-400/40 shadow-luxury-glow font-bold"
                  : "bg-white/[0.03] text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] border border-white/[0.05]"
              }`}
            >
              <span className={isActive ? "text-amber-300" : "text-slate-400"}>{tab.icon}</span>
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full ${
                  isActive ? "bg-amber-400/20 text-amber-300 border border-amber-400/30" : "bg-white/[0.06] text-slate-400"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sub-route path indicator */}
      <div className="mt-3 text-xs text-slate-500 font-mono flex items-center gap-2">
        <span>Active Section:</span>
        <span className="text-amber-400 font-semibold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
          {tabs.find((t) => t.id === activeTab)?.path}
        </span>
      </div>

      {/* ========================================================================= */}
      {/* 1. HERO SLIDES TAB (Top 3+ Images) */}
      {/* ========================================================================= */}
      {activeTab === "hero" && (
        <div className="mt-6 space-y-6">
          {/* Add Form */}
          {showAddForm && (
            <div className="bg-[#0F1420]/95 backdrop-blur-xl p-6 rounded-2xl border border-amber-500/30 shadow-2xl animate-fade-in">
              <h3 className="font-serif-luxury text-lg font-bold text-gold-gradient mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                Add Hero Carousel Slide (Can Add 3+ Images)
              </h3>
              <form onSubmit={handleAddHero} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ImageFileInput
                  label="Hero Slide Imagery (File Upload) *"
                  file={heroFile}
                  preview={heroPreview}
                  currentValue={heroForm.image}
                  required={true}
                  onFileChange={(e) => {
                    const f = e.target.files[0];
                    if (f) {
                      setHeroFile(f);
                      setHeroPreview(URL.createObjectURL(f));
                    }
                  }}
                  onClear={() => {
                    setHeroFile(null);
                    setHeroPreview("");
                  }}
                />

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Badge Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. Artisanal Harvest 2026"
                    value={heroForm.badge}
                    onChange={(e) => setHeroForm({ ...heroForm, badge: e.target.value })}
                    className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-amber-400 focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Slide Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Sacred Botanical Wisdom"
                    value={heroForm.title}
                    onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                    className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-amber-400 focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Subtitle / Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Botanical Alchemy For Discriminating Rituals"
                    value={heroForm.subtitle}
                    onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                    className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-amber-400 focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    placeholder="e.g. Explore Collection"
                    value={heroForm.cta_text}
                    onChange={(e) => setHeroForm({ ...heroForm, cta_text: e.target.value })}
                    className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-amber-400 focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Button Link</label>
                  <input
                    type="text"
                    placeholder="e.g. /products"
                    value={heroForm.link}
                    onChange={(e) => setHeroForm({ ...heroForm, link: e.target.value })}
                    className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-amber-400 focus:border-amber-400"
                  />
                </div>

                <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 border border-white/[0.1] rounded-xl text-xs font-medium text-slate-400 hover:bg-white/[0.05] transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-bold rounded-xl text-xs shadow-luxury-glow hover:brightness-110 flex items-center gap-2 transition"
                  >
                    {submitting ? <LoaderCircle className="w-4 h-4 animate-spin" /> : "Save Hero Slide"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Grid of slides */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {heroSlides.map((slide, idx) => (
              <div
                key={slide.id || idx}
                className="bg-gradient-to-b from-[#131926] to-[#0C101A] rounded-2xl overflow-hidden border border-white/[0.08] hover:border-amber-500/30 shadow-card-luxury transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="relative h-44 bg-gray-950 overflow-hidden">
                  <img
                    src={resolveImageUrl(slide.image)}
                    alt={slide.title || "Slide"}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    onError={(e) => {
                      e.target.src = "http://localhost:4000/new/hero/img1.png";
                    }}
                  />
                  <div className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-md text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-amber-400/25">
                    Slide #{idx + 1}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                      {slide.badge || "Hero Banner"}
                    </span>
                    <h4 className="font-serif-luxury text-base font-bold text-slate-100 mt-1">{slide.title || "Untitled Slide"}</h4>
                    <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">{slide.subtitle}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-mono text-[11px] truncate max-w-[140px]">Link: {slide.link || "/products"}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEditModal("hero", slide)}
                        className="text-amber-300 hover:text-amber-200 p-1.5 rounded-lg hover:bg-amber-400/10 transition flex items-center gap-1 text-xs font-semibold"
                        title="Edit Slide"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete("hero", slide.id, "Hero Slide")}
                        className="text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-400/10 transition"
                        title="Delete Slide"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. CATEGORIES TAB (Database Categories) */}
      {/* ========================================================================= */}
      {activeTab === "cat" && (
        <div className="mt-6 space-y-6">
          {showAddForm && (
            <div className="bg-[#0F1420]/95 backdrop-blur-xl p-6 rounded-2xl border border-amber-500/30 shadow-2xl animate-fade-in">
              <h3 className="font-serif-luxury text-lg font-bold text-gold-gradient mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                Add Formulation Category to Database
              </h3>
              <form onSubmit={handleAddCategory} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Category Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kidney Care, Shilajit, Oils"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-amber-400 focus:border-amber-400"
                  />
                </div>

                <ImageFileInput
                  label="Category Flacon Photo (File Upload)"
                  file={categoryFile}
                  preview={categoryPreview}
                  currentValue={categoryForm.image}
                  onFileChange={(e) => {
                    const f = e.target.files[0];
                    if (f) {
                      setCategoryFile(f);
                      setCategoryPreview(URL.createObjectURL(f));
                    }
                  }}
                  onClear={() => {
                    setCategoryFile(null);
                    setCategoryPreview("");
                  }}
                />

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Description</label>
                  <input
                    type="text"
                    placeholder="Brief description of formulations in this category"
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                    className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-amber-400 focus:border-amber-400"
                  />
                </div>

                <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 border border-white/[0.1] rounded-xl text-xs font-medium text-slate-400 hover:bg-white/[0.05] transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-bold rounded-xl text-xs shadow-luxury-glow hover:brightness-110 flex items-center gap-2 transition"
                  >
                    {submitting ? <LoaderCircle className="w-4 h-4 animate-spin" /> : "Save Category to DB"}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {categories.map((cat, idx) => (
              <div
                key={cat.id || idx}
                className="bg-gradient-to-b from-[#131926] to-[#0C101A] rounded-2xl border border-white/[0.08] hover:border-amber-500/30 overflow-hidden shadow-card-luxury transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="relative aspect-square bg-gray-950 overflow-hidden">
                  <img
                    src={resolveImageUrl(cat.image)}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    onError={(e) => {
                      e.target.src = "http://localhost:4000/new/hero/img1.png";
                    }}
                  />
                </div>

                <div className="p-3.5">
                  <h4 className="font-serif-luxury font-bold text-slate-100 text-sm">{cat.name}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{cat.description || "Active Category"}</p>
                  <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between">
                    <span className="text-[9px] text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      DB Synced
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal("cat", cat)}
                        className="text-amber-300 hover:text-amber-200 p-1 rounded hover:bg-amber-400/10 transition flex items-center gap-1 text-[11px] font-semibold"
                        title="Edit Category"
                      >
                        <Pencil className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete("categories", cat.id || cat.name, "Category")}
                        className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-400/10 transition"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. WELLNESS SANCTUM TAB ("Inside Our Wellness Sanctum") */}
      {/* ========================================================================= */}
      {activeTab === "sanctum" && (
        <div className="mt-6 space-y-6">
          {showAddForm && (
            <div className="bg-[#0F1420]/95 backdrop-blur-xl p-6 rounded-2xl border border-amber-500/30 shadow-2xl animate-fade-in">
              <h3 className="font-serif-luxury text-lg font-bold text-gold-gradient mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                Add Space to Inside Our Wellness Sanctum
              </h3>
              <form onSubmit={handleAddSanctum} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Space Label *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Therapeutic Chamber"
                    value={sanctumForm.label}
                    onChange={(e) => setSanctumForm({ ...sanctumForm, label: e.target.value })}
                    className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-amber-400 focus:border-amber-400"
                  />
                </div>

                <ImageFileInput
                  label="Sanctum Space Visual (File Upload) *"
                  file={sanctumFile}
                  preview={sanctumPreview}
                  currentValue={sanctumForm.src}
                  required={true}
                  onFileChange={(e) => {
                    const f = e.target.files[0];
                    if (f) {
                      setSanctumFile(f);
                      setSanctumPreview(URL.createObjectURL(f));
                    }
                  }}
                  onClear={() => {
                    setSanctumFile(null);
                    setSanctumPreview("");
                  }}
                />

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Badge Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. Atelier Sanctum"
                    value={sanctumForm.badge}
                    onChange={(e) => setSanctumForm({ ...sanctumForm, badge: e.target.value })}
                    className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-amber-400 focus:border-amber-400"
                  />
                </div>

                <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 border border-white/[0.1] rounded-xl text-xs font-medium text-slate-400 hover:bg-white/[0.05] transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-bold rounded-xl text-xs shadow-luxury-glow hover:brightness-110 flex items-center gap-2 transition"
                  >
                    {submitting ? <LoaderCircle className="w-4 h-4 animate-spin" /> : "Save Sanctum Space"}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sanctumSpaces.map((space, idx) => (
              <div
                key={space.id || idx}
                className="bg-gradient-to-b from-[#131926] to-[#0C101A] rounded-2xl border border-white/[0.08] hover:border-amber-500/30 overflow-hidden shadow-card-luxury transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="relative aspect-video bg-gray-950 overflow-hidden">
                  <img
                    src={resolveImageUrl(space.src || space.image)}
                    alt={space.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    onError={(e) => {
                      e.target.src = "http://localhost:4000/new/hero/client/ofc.png";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-3">
                    <span className="text-amber-300 text-[8px] uppercase font-bold tracking-wider">
                      {space.badge || "Atelier Sanctum"}
                    </span>
                    <span className="font-serif-luxury text-white text-xs font-bold">{space.label}</span>
                  </div>
                </div>

                <div className="p-3 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px]">Position #{idx + 1}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal("sanctum", space)}
                      className="text-amber-300 hover:text-amber-200 p-1 rounded hover:bg-amber-400/10 transition flex items-center gap-1 text-[11px] font-semibold"
                      title="Edit Space"
                    >
                      <Pencil className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete("sanctum", space.id, "Sanctum Space")}
                      className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-400/10 transition"
                      title="Delete Space"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. WHY CHOOSE TAB ("Why Choose Skay Products") */}
      {/* ========================================================================= */}
      {activeTab === "why-choose" && (
        <div className="mt-6 space-y-6">
          {showAddForm && (
            <div className="bg-[#0F1420]/95 backdrop-blur-xl p-6 rounded-2xl border border-amber-500/30 shadow-2xl animate-fade-in">
              <h3 className="font-serif-luxury text-lg font-bold text-gold-gradient mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                Add "Why Choose Skay Products" Feature Card
              </h3>
              <form onSubmit={handleAddWhy} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Feature Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Single-Origin Sacred Harvests"
                    value={whyForm.title}
                    onChange={(e) => setWhyForm({ ...whyForm, title: e.target.value })}
                    className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-amber-400 focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Subtitle</label>
                  <input
                    type="text"
                    placeholder="e.g. Peak Astronomical Potency"
                    value={whyForm.subtitle}
                    onChange={(e) => setWhyForm({ ...whyForm, subtitle: e.target.value })}
                    className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-amber-400 focus:border-amber-400"
                  />
                </div>

                <ImageFileInput
                  label="Feature Visual Representation (File Upload)"
                  file={whyFile}
                  preview={whyPreview}
                  currentValue={whyForm.image}
                  onFileChange={(e) => {
                    const f = e.target.files[0];
                    if (f) {
                      setWhyFile(f);
                      setWhyPreview(URL.createObjectURL(f));
                    }
                  }}
                  onClear={() => {
                    setWhyFile(null);
                    setWhyPreview("");
                  }}
                />

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Feature Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 01, 02, 03"
                    value={whyForm.feature_number}
                    onChange={(e) => setWhyForm({ ...whyForm, feature_number: e.target.value })}
                    className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-amber-400 focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Layout Orientation</label>
                  <select
                    value={whyForm.is_reverse ? "true" : "false"}
                    onChange={(e) => setWhyForm({ ...whyForm, is_reverse: e.target.value === "true" })}
                    className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-slate-100 focus:ring-1 focus:ring-amber-400 focus:border-amber-400"
                  >
                    <option value="false">Text Left • Image Right (Normal)</option>
                    <option value="true">Image Left • Text Right (Reversed)</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Full Description *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Explain the commitment and quality assurance standard..."
                    value={whyForm.description}
                    onChange={(e) => setWhyForm({ ...whyForm, description: e.target.value })}
                    className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-amber-400 focus:border-amber-400"
                  />
                </div>

                <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 border border-white/[0.1] rounded-xl text-xs font-medium text-slate-400 hover:bg-white/[0.05] transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-bold rounded-xl text-xs shadow-luxury-glow hover:brightness-110 flex items-center gap-2 transition"
                  >
                    {submitting ? <LoaderCircle className="w-4 h-4 animate-spin" /> : "Save Feature Card"}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseFeatures.map((feat, idx) => (
              <div
                key={feat.id || idx}
                className="bg-gradient-to-b from-[#131926] to-[#0C101A] rounded-2xl border border-white/[0.08] hover:border-amber-500/30 overflow-hidden shadow-card-luxury transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="relative h-40 bg-gray-950 overflow-hidden">
                  <img
                    src={resolveImageUrl(feat.image)}
                    alt={feat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    onError={(e) => {
                      e.target.src = "http://localhost:4000/new/hero/downside/des.png";
                    }}
                  />
                  <div className="absolute top-2.5 left-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-black text-[11px] font-extrabold px-2.5 py-0.5 rounded shadow">
                    #{feat.feature_number || `0${idx + 1}`}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                      {feat.subtitle || "Philosophy"}
                    </span>
                    <h4 className="font-serif-luxury font-bold text-slate-100 text-base mt-1">{feat.title}</h4>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">{feat.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                    <span className="text-slate-500 text-[11px]">Card #{idx + 1}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEditModal("why-choose", feat)}
                        className="text-amber-300 hover:text-amber-200 p-1.5 rounded-lg hover:bg-amber-400/10 transition flex items-center gap-1 text-xs font-semibold"
                        title="Edit Feature"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete("why-choose", feat.id, "Feature Card")}
                        className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-400/10 transition"
                        title="Delete Feature"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. TOP ANNOUNCEMENT BAR TAB */}
      {/* ========================================================================= */}
      {activeTab === "announcement" && (
        <div className="mt-6 space-y-6 max-w-4xl">
          <div className="bg-gradient-to-b from-[#131926] to-[#0C101A] p-6 sm:p-8 rounded-2xl border border-white/[0.08] shadow-card-luxury">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/[0.08]">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-300">
                <Megaphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif-luxury text-lg font-bold text-slate-100">Top Header Announcement Bar</h3>
                <p className="text-xs text-slate-400">
                  Manage the top marquee alert banner displayed above the main navigation across the entire client website.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveAnnouncement} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Announcement Message *
                </label>
                <textarea
                  required
                  rows={3}
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  placeholder="e.g. Haute Formulation & Complimentary Concierge Delivery on Orders Above $75 CAD"
                  className="w-full bg-black/50 border border-white/[0.1] rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 font-medium"
                />
                <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
                  <span>Keep it concise and elegant for high-end luxury appeal.</span>
                  <span>{announcementText.length} characters</span>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">
                  Quick Presets (Click to Apply):
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Haute Formulation & Complimentary Concierge Delivery on Orders Above $75 CAD",
                    "Complimentary Expedited Delivery Across Canada on Orders Over $75 CAD",
                    "Spring Solstice Special: Complimentary Express Delivery Across All Canadian Provinces",
                    "Pure Canadian Botanical Potency • Free Delivery Over $75 CAD",
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAnnouncementText(preset)}
                      className="text-xs px-3 py-1.5 bg-white/[0.03] hover:bg-amber-400/10 hover:text-amber-300 border border-white/[0.06] rounded-xl text-slate-300 transition text-left"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Preview */}
              <div className="pt-4 border-t border-white/[0.08]">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Live Customer Site Preview:
                </label>
                <div className="bg-[#0B0E14] text-[#E5D7B7] px-4 py-3 rounded-xl border border-amber-500/25 shadow-inner flex items-center justify-center text-center">
                  <div className="flex items-center gap-2 text-xs tracking-[0.2em] font-serif uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                    <span>{announcementText || "Announcement text preview..."}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={fetchData}
                  className="px-4 py-2 border border-white/[0.1] rounded-xl text-xs font-medium text-slate-400 hover:bg-white/[0.05] transition"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 text-black rounded-xl text-xs font-bold shadow-luxury-glow transition flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <LoaderCircle className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save Announcement</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. UNIVERSAL EDIT CONTENT MODAL (Luxury Atelier Theme) */}
      {/* ========================================================================= */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-[#0D121D] rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-amber-500/30 my-8 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border-b border-amber-500/20 text-amber-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pencil className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif-luxury text-base font-bold text-gold-gradient">
                  {editType === "cat" && "Edit Formulation Category"}
                  {editType === "hero" && "Edit Hero Banner Slide"}
                  {editType === "sanctum" && "Edit Wellness Sanctum Space"}
                  {editType === "why-choose" && "Edit 'Why Choose Us' Feature Card"}
                </h3>
              </div>
              <button
                onClick={closeEditModal}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleUpdate} className="p-6 space-y-4 overflow-y-auto flex-1">
              {/* Preview current/new image */}
              {(editForm.image || editForm.src) && (
                <div className="bg-black/40 p-3 rounded-xl border border-white/[0.08] flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-950 border border-amber-400/40 flex-shrink-0">
                    <img
                      src={resolveImageUrl(editPreview || editForm.image || editForm.src)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "http://localhost:4000/new/hero/img1.png";
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase text-amber-400 tracking-wider">Live Formulation Preview</span>
                    <p className="text-xs text-slate-300 truncate font-mono mt-0.5">{editForm.image || editForm.src}</p>
                    <p className="text-[11px] text-emerald-400 mt-1">✓ Verified for Atelier Database</p>
                  </div>
                </div>
              )}

              {/* 1. Category Form Fields */}
              {editType === "cat" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Category Name *</label>
                    <input
                      type="text"
                      required
                      value={editForm.name || ""}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full bg-black/50 border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-amber-400 focus:border-amber-400"
                      placeholder="e.g. Skincare & Serums"
                    />
                  </div>
                  <ImageFileInput
                    label="Category Flacon Photo (File Upload)"
                    file={editFile}
                    preview={editPreview}
                    currentValue={editForm.image}
                    onFileChange={(e) => {
                      const f = e.target.files[0];
                      if (f) {
                        setEditFile(f);
                        setEditPreview(URL.createObjectURL(f));
                      }
                    }}
                    onClear={() => {
                      setEditFile(null);
                      setEditPreview("");
                    }}
                  />
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={editForm.description || ""}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="w-full bg-black/50 border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-amber-400 focus:border-amber-400"
                      placeholder="Brief description of formulations in this category"
                    />
                  </div>
                </>
              )}

              {/* 2. Hero Slide Form Fields */}
              {editType === "hero" && (
                <>
                  <ImageFileInput
                    label="Hero Slide Imagery (File Upload)"
                    file={editFile}
                    preview={editPreview}
                    currentValue={editForm.image}
                    onFileChange={(e) => {
                      const f = e.target.files[0];
                      if (f) {
                        setEditFile(f);
                        setEditPreview(URL.createObjectURL(f));
                      }
                    }}
                    onClear={() => {
                      setEditFile(null);
                      setEditPreview("");
                    }}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Badge Tag</label>
                      <input
                        type="text"
                        value={editForm.badge || ""}
                        onChange={(e) => setEditForm({ ...editForm, badge: e.target.value })}
                        className="w-full bg-black/50 border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-amber-400 focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Slide Title</label>
                      <input
                        type="text"
                        value={editForm.title || ""}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="w-full bg-black/50 border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-amber-400 focus:border-amber-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Subtitle / Description</label>
                    <textarea
                      rows={2}
                      value={editForm.subtitle || ""}
                      onChange={(e) => setEditForm({ ...editForm, subtitle: e.target.value })}
                      className="w-full bg-black/50 border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-amber-400 focus:border-amber-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">CTA Button Text</label>
                      <input
                        type="text"
                        value={editForm.cta_text || ""}
                        onChange={(e) => setEditForm({ ...editForm, cta_text: e.target.value })}
                        className="w-full bg-black/50 border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-amber-400 focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Button Link</label>
                      <input
                        type="text"
                        value={editForm.link || ""}
                        onChange={(e) => setEditForm({ ...editForm, link: e.target.value })}
                        className="w-full bg-black/50 border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-amber-400 focus:border-amber-400"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* 3. Sanctum Space Form Fields */}
              {editType === "sanctum" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Space Label *</label>
                    <input
                      type="text"
                      required
                      value={editForm.label || ""}
                      onChange={(e) => setEditForm({ ...editForm, label: e.target.value })}
                      className="w-full bg-black/50 border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-amber-400 focus:border-amber-400"
                    />
                  </div>
                  <ImageFileInput
                    label="Sanctum Space Visual (File Upload)"
                    file={editFile}
                    preview={editPreview}
                    currentValue={editForm.src}
                    onFileChange={(e) => {
                      const f = e.target.files[0];
                      if (f) {
                        setEditFile(f);
                        setEditPreview(URL.createObjectURL(f));
                      }
                    }}
                    onClear={() => {
                      setEditFile(null);
                      setEditPreview("");
                    }}
                  />
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Badge Tag</label>
                    <input
                      type="text"
                      value={editForm.badge || ""}
                      onChange={(e) => setEditForm({ ...editForm, badge: e.target.value })}
                      className="w-full bg-black/50 border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-amber-400 focus:border-amber-400"
                    />
                  </div>
                </>
              )}

              {/* 4. Why Choose Us Form Fields */}
              {editType === "why-choose" && (
                <>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Feature #</label>
                      <input
                        type="text"
                        value={editForm.feature_number || ""}
                        onChange={(e) => setEditForm({ ...editForm, feature_number: e.target.value })}
                        className="w-full bg-black/50 border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-amber-400 focus:border-amber-400"
                        placeholder="01"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Subtitle</label>
                      <input
                        type="text"
                        value={editForm.subtitle || ""}
                        onChange={(e) => setEditForm({ ...editForm, subtitle: e.target.value })}
                        className="w-full bg-black/50 border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-amber-400 focus:border-amber-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Feature Title *</label>
                    <input
                      type="text"
                      required
                      value={editForm.title || ""}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full bg-black/50 border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-amber-400 focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Layout Orientation</label>
                    <select
                      value={editForm.is_reverse ? "true" : "false"}
                      onChange={(e) => setEditForm({ ...editForm, is_reverse: e.target.value === "true" })}
                      className="w-full bg-black/50 border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-slate-100 focus:ring-1 focus:ring-amber-400 focus:border-amber-400"
                    >
                      <option value="false">Text Left • Image Right (Normal)</option>
                      <option value="true">Image Left • Text Right (Reversed)</option>
                    </select>
                  </div>
                  <ImageFileInput
                    label="Feature Visual Representation (File Upload)"
                    file={editFile}
                    preview={editPreview}
                    currentValue={editForm.image}
                    onFileChange={(e) => {
                      const f = e.target.files[0];
                      if (f) {
                        setEditFile(f);
                        setEditPreview(URL.createObjectURL(f));
                      }
                    }}
                    onClear={() => {
                      setEditFile(null);
                      setEditPreview("");
                    }}
                  />
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Full Description *</label>
                    <textarea
                      required
                      rows={3}
                      value={editForm.description || ""}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="w-full bg-black/50 border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-amber-400 focus:border-amber-400"
                    />
                  </div>
                </>
              )}

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 border border-white/[0.1] rounded-xl text-xs font-medium text-slate-400 hover:bg-white/[0.05] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-bold rounded-xl text-xs shadow-luxury-glow hover:brightness-110 transition flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <LoaderCircle className="w-4 h-4 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default WebManagement;
