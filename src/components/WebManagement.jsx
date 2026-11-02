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
  Cloud,
  CloudSun,
  Sun,
  Palette,
  Wind,
  Sliders,
  Eye,
} from "lucide-react";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";
import SkyCloudsBackground, { DEFAULT_BACKGROUND_SETTINGS } from "./SkyCloudsBackground";


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

  // Background Theme & Sky Clouds State
  const [bgSettings, setBgSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("site_background_settings");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_BACKGROUND_SETTINGS;
  });

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
      const [heroRes, catRes, sanctumRes, whyRes, annRes, bgRes] = await Promise.all([
        axiosInstance.get("/web/hero").catch(() => ({ data: { slides: [] } })),
        axiosInstance.get("/web/categories").catch(() => ({ data: { categories: [] } })),
        axiosInstance.get("/web/sanctum").catch(() => ({ data: { spaces: [] } })),
        axiosInstance.get("/web/why-choose").catch(() => ({ data: { features: [] } })),
        axiosInstance.get("/web/announcement").catch(() => ({ data: { announcement: "" } })),
        axiosInstance.get("/web/background").catch(() => ({ data: { background: null } })),
      ]);

      if (heroRes?.data?.slides) setHeroSlides(heroRes.data.slides);
      if (catRes?.data?.categories) setCategories(catRes.data.categories);
      if (sanctumRes?.data?.spaces) setSanctumSpaces(sanctumRes.data.spaces);
      if (whyRes?.data?.features) setWhyChooseFeatures(whyRes.data.features);
      if (annRes?.data?.announcement) setAnnouncementText(annRes.data.announcement);
      if (bgRes?.data?.background) {
        setBgSettings(bgRes.data.background);
        localStorage.setItem("site_background_settings", JSON.stringify(bgRes.data.background));
      }
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

  const handleSaveBackground = async (e) => {
    if (e) e.preventDefault();
    setSubmitting(true);
    try {
      const res = await axiosInstance.post("/web/background", bgSettings);
      toast.success(res?.data?.message || "Sky background & clouds saved successfully!");
      localStorage.setItem("site_background_settings", JSON.stringify(bgSettings));
      window.dispatchEvent(new CustomEvent("site-background-change", { detail: bgSettings }));
    } catch (err) {
      console.warn("API save background notice:", err);
      localStorage.setItem("site_background_settings", JSON.stringify(bgSettings));
      window.dispatchEvent(new CustomEvent("site-background-change", { detail: bgSettings }));
      toast.success("Sky background settings saved to local session & synced with storefront!");
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
    {
      id: "background",
      label: "Sky & Clouds Theme",
      icon: <CloudSun className="w-4 h-4" />,
      count: bgSettings.theme === "custom" ? "Custom" : bgSettings.theme === "sky-sunset" ? "Sunset" : "Day Sky",
      path: "web/background",
    },
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
            Manage top hero banner (add 3+ images), store categories from database, wellness sanctum, guarantees, and sky & clouds theme.
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

          {activeTab !== "announcement" && activeTab !== "background" && (
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
      {/* 5b. SKY VIEW & CLOUDS (BADAL) ANIMATION BACKGROUND MANAGEMENT */}
      {/* ========================================================================= */}
      {activeTab === "background" && (
        <div className="mt-6 space-y-8 max-w-6xl animate-fade-in">
          {/* Header Intro Card */}
          <div className="bg-gradient-to-r from-[#131926] via-[#101522] to-[#0C101A] p-6 rounded-2xl border border-white/[0.08] shadow-card-luxury flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500/20 via-sky-400/10 to-amber-500/10 border border-sky-400/30 flex items-center justify-center text-sky-300 flex-shrink-0 shadow-lg">
                <CloudSun className="w-6 h-6 text-sky-400 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-sky-400 bg-sky-400/10 px-2 py-0.5 rounded border border-sky-400/20">
                    Storefront Atmosphere & Animation
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                    Live Badal (Clouds) Motion
                  </span>
                </div>
                <h3 className="font-serif-luxury text-xl font-bold text-slate-100 mt-1">
                  Sky Background & Moving Cloud Animation
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                  Select between two curated dual-color sky themes (Day Azure Sky or Sunset Horizon) or customize your own colors. Smooth animated clouds (badal) continuously drift across the sky behind your products.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSaveBackground}
                disabled={submitting}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 text-black font-bold rounded-xl text-xs shadow-luxury-glow transition flex items-center gap-2 flex-shrink-0"
              >
                {submitting ? (
                  <>
                    <LoaderCircle className="w-4 h-4 animate-spin" />
                    <span>Saving Theme...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Save Background</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Section 1: 3 Preset Cards (2-Color Sky Presets & 1 Custom Option) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-serif-luxury text-base font-bold text-gold-gradient flex items-center gap-2">
                  <Palette className="w-4 h-4 text-amber-400" />
                  <span>1. Select Background Theme (2 Sky Presets + 1 Custom Option)</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Click any option to preview and activate it.
                </p>
              </div>
              <span className="text-xs text-amber-300 font-mono font-semibold bg-amber-400/10 px-3 py-1 rounded-xl border border-amber-400/20">
                Active: {bgSettings.theme === "sky-day" ? "Day Azure Sky (Preset 1)" : bgSettings.theme === "sky-sunset" ? "Sunset Horizon (Preset 2)" : "Custom Dual Color"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Preset 1: Day Azure Sky (2-Color) */}
              <div
                onClick={() => setBgSettings({ ...bgSettings, theme: "sky-day" })}
                className={`relative rounded-2xl p-5 cursor-pointer transition-all duration-300 border flex flex-col justify-between overflow-hidden group ${
                  bgSettings.theme === "sky-day"
                    ? "bg-[#131B2A] border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.2)] ring-1 ring-amber-400"
                    : "bg-[#0E131F]/90 border-white/[0.08] hover:border-white/20 hover:bg-[#121826]"
                }`}
              >
                {/* Visual Swatch */}
                <div
                  className="w-full h-28 rounded-xl overflow-hidden relative shadow-inner flex items-center justify-center p-3 mb-4"
                  style={{
                    background: "linear-gradient(180deg, #1d8cf8 0%, #38bdf8 45%, #bae6fd 100%)",
                  }}
                >
                  {/* Atmospheric Sun */}
                  <div className="absolute top-2 right-4 w-12 h-12 rounded-full bg-white/70 blur-sm animate-pulse" />
                  {/* Floating Mini Cloud */}
                  <div className="relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md shadow-md text-sky-950 font-bold text-[11px]">
                    <Cloud className="w-3.5 h-3.5 text-sky-500" />
                    <span>White Drifting Clouds</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest bg-sky-400/10 px-2 py-0.5 rounded border border-sky-400/20">
                      Preset 1 • 2 Colors
                    </span>
                    {bgSettings.theme === "sky-day" && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-amber-300">
                        <Check className="w-3.5 h-3.5" />
                        Selected
                      </span>
                    )}
                  </div>
                  <h5 className="font-serif-luxury text-base font-bold text-slate-100">Day Azure Sky</h5>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Vivid azure blue sky transitioning into gentle morning horizon cyan with pure white cumulus clouds.
                  </p>
                </div>

                {/* Color Palette Indicators */}
                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full border border-white/30" style={{ background: "#1d8cf8" }} />
                      <span className="font-mono text-slate-300">#1D8CF8</span>
                    </div>
                    <span className="text-slate-500">→</span>
                    <div className="flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full border border-white/30" style={{ background: "#bae6fd" }} />
                      <span className="font-mono text-slate-300">#BAE6FD</span>
                    </div>
                  </div>
                  <span className="text-sky-300 font-medium">180° Top-Down</span>
                </div>
              </div>

              {/* Preset 2: Sunset Horizon Sky (2-Color) */}
              <div
                onClick={() => setBgSettings({ ...bgSettings, theme: "sky-sunset" })}
                className={`relative rounded-2xl p-5 cursor-pointer transition-all duration-300 border flex flex-col justify-between overflow-hidden group ${
                  bgSettings.theme === "sky-sunset"
                    ? "bg-[#181524] border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.2)] ring-1 ring-amber-400"
                    : "bg-[#0E131F]/90 border-white/[0.08] hover:border-white/20 hover:bg-[#121826]"
                }`}
              >
                {/* Visual Swatch */}
                <div
                  className="w-full h-28 rounded-xl overflow-hidden relative shadow-inner flex items-center justify-center p-3 mb-4"
                  style={{
                    background: "linear-gradient(160deg, #ea580c 0%, #f43f5e 40%, #6366f1 100%)",
                  }}
                >
                  {/* Sunset Glow */}
                  <div className="absolute top-3 right-6 w-14 h-14 rounded-full bg-amber-300/60 blur-md animate-pulse" />
                  <div className="relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/85 backdrop-blur-md shadow-md text-amber-950 font-bold text-[11px]">
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>Golden Hour Clouds</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                      Preset 2 • 2 Colors
                    </span>
                    {bgSettings.theme === "sky-sunset" && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-amber-300">
                        <Check className="w-3.5 h-3.5" />
                        Selected
                      </span>
                    )}
                  </div>
                  <h5 className="font-serif-luxury text-base font-bold text-slate-100">Sunset Horizon Sky</h5>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Warm golden ember sunset blending into twilight lavender and dusk indigo with warm sunlit clouds.
                  </p>
                </div>

                {/* Color Palette Indicators */}
                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full border border-white/30" style={{ background: "#ea580c" }} />
                      <span className="font-mono text-slate-300">#EA580C</span>
                    </div>
                    <span className="text-slate-500">→</span>
                    <div className="flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full border border-white/30" style={{ background: "#6366f1" }} />
                      <span className="font-mono text-slate-300">#6366F1</span>
                    </div>
                  </div>
                  <span className="text-amber-300 font-medium">160° Horizon</span>
                </div>
              </div>

              {/* Option 3: Custom Dual Color Sky */}
              <div
                onClick={() => setBgSettings({ ...bgSettings, theme: "custom" })}
                className={`relative rounded-2xl p-5 cursor-pointer transition-all duration-300 border flex flex-col justify-between overflow-hidden group ${
                  bgSettings.theme === "custom"
                    ? "bg-[#141824] border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.2)] ring-1 ring-amber-400"
                    : "bg-[#0E131F]/90 border-white/[0.08] hover:border-white/20 hover:bg-[#121826]"
                }`}
              >
                {/* Visual Swatch */}
                <div
                  className="w-full h-28 rounded-xl overflow-hidden relative shadow-inner flex items-center justify-center p-3 mb-4"
                  style={{
                    background: `linear-gradient(${bgSettings.custom?.angle || "180deg"}, ${bgSettings.custom?.color1 || "#0284c7"} 0%, ${bgSettings.custom?.color2 || "#7dd3fc"} 100%)`,
                  }}
                >
                  <div className="relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md shadow-md text-slate-100 font-bold text-[11px] border border-white/20">
                    <Sliders className="w-3.5 h-3.5 text-amber-400" />
                    <span>Your Custom Sky Palette</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest bg-purple-400/10 px-2 py-0.5 rounded border border-purple-400/20">
                      Option 3 • Custom Pick
                    </span>
                    {bgSettings.theme === "custom" && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-amber-300">
                        <Check className="w-3.5 h-3.5" />
                        Selected
                      </span>
                    )}
                  </div>
                  <h5 className="font-serif-luxury text-base font-bold text-slate-100">Custom Colors</h5>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Pick your exact 2 colors using interactive color pickers, set gradient direction, and customize cloud color.
                  </p>
                </div>

                {/* Color Palette Indicators */}
                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full border border-white/30" style={{ background: bgSettings.custom?.color1 || "#0284c7" }} />
                      <span className="font-mono text-slate-300 uppercase">{bgSettings.custom?.color1 || "#0284c7"}</span>
                    </div>
                    <span className="text-slate-500">→</span>
                    <div className="flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full border border-white/30" style={{ background: bgSettings.custom?.color2 || "#7dd3fc" }} />
                      <span className="font-mono text-slate-300 uppercase">{bgSettings.custom?.color2 || "#7dd3fc"}</span>
                    </div>
                  </div>
                  <span className="text-purple-300 font-medium">{bgSettings.custom?.angle || "180deg"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Custom Color Pickers (Visible when Custom is active or for editing) */}
          {bgSettings.theme === "custom" && (
            <div className="bg-[#0F1420]/95 backdrop-blur-xl p-6 rounded-2xl border border-amber-500/30 shadow-2xl animate-fade-in space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-400/25 text-amber-300">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif-luxury text-base font-bold text-gold-gradient">
                      Custom Dual Color Sky Editor
                    </h4>
                    <p className="text-xs text-slate-400">
                      Fine-tune Color 1 (Sky Zenith), Color 2 (Horizon Light), and gradient angle.
                    </p>
                  </div>
                </div>

                {/* Quick One-Click Palettes */}
                <div className="hidden lg:flex items-center gap-2">
                  <span className="text-xs text-slate-400">Quick Themes:</span>
                  {[
                    { name: "Deep Ocean", c1: "#0369a1", c2: "#38bdf8", angle: "180deg" },
                    { name: "Aurora Sky", c1: "#065f46", c2: "#34d399", angle: "150deg" },
                    { name: "Rose Dusk", c1: "#9f1239", c2: "#fda4af", angle: "160deg" },
                    { name: "Royal Midnight", c1: "#312e81", c2: "#818cf8", angle: "180deg" },
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() =>
                        setBgSettings({
                          ...bgSettings,
                          custom: {
                            ...bgSettings.custom,
                            color1: preset.c1,
                            color2: preset.c2,
                            angle: preset.angle,
                          },
                        })
                      }
                      className="px-2.5 py-1 rounded-lg text-[11px] bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-slate-300 transition"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Color 1: Sky Zenith */}
                <div className="bg-black/40 p-4 rounded-xl border border-white/[0.08] space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      Color 1: Sky Zenith (Top)
                    </label>
                    <span className="text-[10px] font-mono text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded">
                      Primary
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={bgSettings.custom?.color1 || "#0284c7"}
                      onChange={(e) =>
                        setBgSettings({
                          ...bgSettings,
                          custom: { ...bgSettings.custom, color1: e.target.value },
                        })
                      }
                      className="w-12 h-12 rounded-xl border-2 border-white/20 cursor-pointer bg-transparent"
                    />
                    <div className="flex-1">
                      <input
                        type="text"
                        value={bgSettings.custom?.color1 || "#0284c7"}
                        onChange={(e) =>
                          setBgSettings({
                            ...bgSettings,
                            custom: { ...bgSettings.custom, color1: e.target.value },
                          })
                        }
                        className="w-full bg-black/60 border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-slate-100 font-mono uppercase focus:ring-1 focus:ring-amber-400"
                        placeholder="#0284c7"
                      />
                    </div>
                  </div>
                </div>

                {/* Color 2: Horizon Light */}
                <div className="bg-black/40 p-4 rounded-xl border border-white/[0.08] space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      Color 2: Horizon Glow (Bottom)
                    </label>
                    <span className="text-[10px] font-mono text-sky-300 bg-sky-400/10 px-2 py-0.5 rounded">
                      Secondary
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={bgSettings.custom?.color2 || "#7dd3fc"}
                      onChange={(e) =>
                        setBgSettings({
                          ...bgSettings,
                          custom: { ...bgSettings.custom, color2: e.target.value },
                        })
                      }
                      className="w-12 h-12 rounded-xl border-2 border-white/20 cursor-pointer bg-transparent"
                    />
                    <div className="flex-1">
                      <input
                        type="text"
                        value={bgSettings.custom?.color2 || "#7dd3fc"}
                        onChange={(e) =>
                          setBgSettings({
                            ...bgSettings,
                            custom: { ...bgSettings.custom, color2: e.target.value },
                          })
                        }
                        className="w-full bg-black/60 border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-slate-100 font-mono uppercase focus:ring-1 focus:ring-amber-400"
                        placeholder="#7dd3fc"
                      />
                    </div>
                  </div>
                </div>

                {/* Gradient Direction & Cloud Tint */}
                <div className="bg-black/40 p-4 rounded-xl border border-white/[0.08] space-y-3">
                  <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                    Gradient Angle & Direction
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Top-to-Bottom", value: "180deg" },
                      { label: "Gentle Angle", value: "160deg" },
                      { label: "Diagonal", value: "135deg" },
                      { label: "Side-to-Side", value: "90deg" },
                    ].map((ang) => (
                      <button
                        key={ang.value}
                        type="button"
                        onClick={() =>
                          setBgSettings({
                            ...bgSettings,
                            custom: { ...bgSettings.custom, angle: ang.value },
                          })
                        }
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                          (bgSettings.custom?.angle || "180deg") === ang.value
                            ? "bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold"
                            : "bg-white/[0.04] text-slate-400 hover:text-slate-200 border border-white/[0.06]"
                        }`}
                      >
                        {ang.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Cloud Animation Settings ("badal hi animtion me") */}
          <div className="bg-gradient-to-b from-[#131926] to-[#0C101A] p-6 rounded-2xl border border-white/[0.08] shadow-card-luxury space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-white/[0.08] gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-400/20 flex items-center justify-center text-sky-300">
                  <Wind className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif-luxury text-base font-bold text-slate-100 flex items-center gap-2">
                    <span>2. Badal (Clouds) Animation Controls</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20 font-sans font-bold">
                      {bgSettings.enableClouds ? "Animation Enabled" : "Animation Paused"}
                    </span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    Control cloud floating speed, cloud density across 3 parallax layers, and cloud opacity.
                  </p>
                </div>
              </div>

              {/* Master Clouds Toggle */}
              <button
                type="button"
                onClick={() =>
                  setBgSettings({ ...bgSettings, enableClouds: !bgSettings.enableClouds })
                }
                className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-bold transition border ${
                  bgSettings.enableClouds
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-lg"
                    : "bg-rose-500/20 text-rose-300 border-rose-500/40"
                }`}
              >
                <Cloud className="w-4 h-4" />
                <span>{bgSettings.enableClouds ? "Clouds Animation: ON" : "Clouds Animation: OFF"}</span>
              </button>
            </div>

            {bgSettings.enableClouds && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Cloud Speed */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Cloud Movement Speed
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "slow", label: "Peaceful", sub: "~80s" },
                      { id: "normal", label: "Gentle", sub: "~50s" },
                      { id: "fast", label: "Breezy", sub: "~30s" },
                    ].map((spd) => (
                      <button
                        key={spd.id}
                        type="button"
                        onClick={() => setBgSettings({ ...bgSettings, cloudSpeed: spd.id })}
                        className={`p-2 rounded-xl text-center transition border ${
                          (bgSettings.cloudSpeed || "normal") === spd.id
                            ? "bg-sky-500/20 text-sky-200 border-sky-400/40 font-bold shadow-md"
                            : "bg-black/30 text-slate-400 border-white/[0.06] hover:bg-white/[0.04]"
                        }`}
                      >
                        <div className="text-xs font-semibold">{spd.label}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{spd.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cloud Density */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Cloud Density & Layers
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "low", label: "Light", count: "4 clouds" },
                      { id: "medium", label: "Balanced", count: "7 clouds" },
                      { id: "high", label: "Lush Sky", count: "9+ clouds" },
                    ].map((den) => (
                      <button
                        key={den.id}
                        type="button"
                        onClick={() => setBgSettings({ ...bgSettings, cloudDensity: den.id })}
                        className={`p-2 rounded-xl text-center transition border ${
                          (bgSettings.cloudDensity || "high") === den.id
                            ? "bg-sky-500/20 text-sky-200 border-sky-400/40 font-bold shadow-md"
                            : "bg-black/30 text-slate-400 border-white/[0.06] hover:bg-white/[0.04]"
                        }`}
                      >
                        <div className="text-xs font-semibold">{den.label}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{den.count}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cloud Opacity Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                    <span>Cloud Softness / Opacity</span>
                    <span className="font-mono text-amber-300 font-bold">
                      {bgSettings.cloudOpacity !== undefined ? bgSettings.cloudOpacity : 90}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="100"
                    value={bgSettings.cloudOpacity !== undefined ? bgSettings.cloudOpacity : 90}
                    onChange={(e) =>
                      setBgSettings({ ...bgSettings, cloudOpacity: parseInt(e.target.value, 10) })
                    }
                    className="w-full accent-amber-400 h-2 bg-black/60 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Translucent Wisps (30%)</span>
                    <span>Fluffy White (100%)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Live Interactive Preview Window (Admin Mockup) */}
          <div className="bg-gradient-to-b from-[#131926] to-[#0C101A] p-6 rounded-2xl border border-white/[0.08] shadow-card-luxury space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-amber-400" />
                <h4 className="font-serif-luxury text-base font-bold text-slate-100">
                  3. Live Real-Time Sky & Cloud Motion Preview
                </h4>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Exact replica of what customers see on the website
              </span>
            </div>

            {/* Mockup Canvas */}
            <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-white/20 shadow-2xl flex flex-col justify-between p-6">
              {/* Actual Sky Background & Animated Clouds Component */}
              <SkyCloudsBackground isPreview={true} previewSettings={bgSettings} />

              {/* Mockup Storefront UI Overlay */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/50 text-slate-900 font-serif font-bold text-xs shadow-md">
                  sKay Products Storefront
                </div>
                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] font-mono border border-white/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>
                    Theme: {bgSettings.theme === "sky-day" ? "Day Azure Sky" : bgSettings.theme === "sky-sunset" ? "Sunset Horizon" : "Custom Dual Color"}
                  </span>
                </div>
              </div>

              {/* Sample Floating Storefront Glass Card */}
              <div className="relative z-10 max-w-sm mx-auto w-full bg-white/85 backdrop-blur-md p-5 rounded-2xl border border-white/70 shadow-2xl text-slate-900 flex items-center gap-4 animate-fade-in">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/30 border border-amber-500/40 flex items-center justify-center text-amber-600 font-serif font-bold text-xl flex-shrink-0 shadow-inner">
                  sKay
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Active Store View
                  </span>
                  <h6 className="font-serif font-bold text-sm text-slate-900 mt-0.5">
                    Haute Formulation Bottle
                  </h6>
                  <p className="text-[11px] text-slate-600 line-clamp-1">
                    Watch the soft clouds float behind transparent glass cards seamlessly.
                  </p>
                </div>
              </div>

              {/* Bottom Notification Pill */}
              <div className="relative z-10 flex items-center justify-center text-center">
                <div className="bg-black/50 backdrop-blur-md px-4 py-1 rounded-full text-[11px] text-slate-200 border border-white/10 font-mono">
                  {bgSettings.enableClouds
                    ? "☁️ Clouds are drifting continuously from west to east"
                    : "⏸️ Cloud animation is currently paused"}
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Save & Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-[#0E131F] rounded-2xl border border-white/[0.08]">
            <div>
              <h5 className="font-serif-luxury text-sm font-bold text-slate-200">
                Ready to Publish this Sky Atmosphere?
              </h5>
              <p className="text-xs text-slate-400 mt-0.5">
                Saving will instantly update the sky view and cloud animations on the live customer website.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setBgSettings(DEFAULT_BACKGROUND_SETTINGS)}
                className="px-4 py-2.5 border border-white/[0.1] rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/[0.05] transition"
              >
                Reset to Day Sky Default
              </button>

              <button
                type="button"
                onClick={handleSaveBackground}
                disabled={submitting}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 text-black font-bold rounded-xl text-xs shadow-luxury-glow transition flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <LoaderCircle className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Save Background Theme</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

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
