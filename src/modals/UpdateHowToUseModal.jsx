import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleUpdateHowToUseModal } from "../store/slices/extraSlice";
import { LoaderCircle, X, Plus, Trash2, Sparkles, BookOpen, UploadCloud } from "lucide-react";
import { updateHowToUse } from "../store/slices/productsSlice";

const UpdateHowToUseModal = ({ selectedProduct }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.product);

  const [steps, setSteps] = useState([
    { title: "", description: "", img: "" },
  ]);

  useEffect(() => {
    if (selectedProduct?.how_to_use) {
      setSteps(selectedProduct.how_to_use);
    }
  }, [selectedProduct]);

  const addStep = () => {
    setSteps([...steps, { title: "", description: "", img: "" }]);
  };

  const removeStep = (index) => {
    const updated = [...steps];
    updated.splice(index, 1);
    setSteps(updated);
  };

  const handleChange = (index, field, value) => {
    const updated = [...steps];
    updated[index][field] = value;
    setSteps(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    let imgIndex = 0;

    const cleanSteps = steps.map((step) => {
      if (step.img instanceof File) {
        formData.append("stepImages", step.img);
        return {
          ...step,
          img: `__file_${imgIndex++}`,
        };
      }
      return step;
    });

    formData.append("steps", JSON.stringify(cleanSteps));
    dispatch(updateHowToUse(formData, selectedProduct.id));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-center items-center p-4 overflow-y-auto">
      <div className="bg-gradient-to-b from-[#161D2B] via-[#0E131E] to-[#0B0F17] border border-amber-400/30 rounded-2xl w-full max-w-3xl p-6 sm:p-8 relative text-slate-100 shadow-2xl my-8 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => dispatch(toggleUpdateHowToUseModal())}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest bg-amber-400/10 text-amber-300 border border-amber-400/25 mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            Application Rituals
          </div>
          <h2 className="text-2xl font-serif font-bold text-white tracking-wide">
            Application Ritual Steps
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Curate step-by-step skincare rites for {selectedProduct?.name || "this botanical formulation"}.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-[#080B11]/70 border border-white/[0.08] rounded-xl p-5 relative group"
            >
              {/* Step indicator badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/20 font-serif">
                  Step 0{index + 1}
                </span>

                {steps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStep(index)}
                    className="text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-rose-500/10 transition"
                    title="Remove this ritual step"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Title input */}
              <div className="mb-3">
                <label className="block text-slate-400 font-medium mb-1">
                  Ritual Step Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Cleanse & Warm Between Palms"
                  value={step.title}
                  onChange={(e) => handleChange(index, "title", e.target.value)}
                  required
                  className="w-full bg-[#0E131E] border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 focus:border-amber-400/60 focus:outline-none placeholder:text-slate-500"
                />
              </div>

              {/* Description textarea */}
              <div className="mb-3">
                <label className="block text-slate-400 font-medium mb-1">
                  Instructions & Technique
                </label>
                <textarea
                  placeholder="Dispense 2-3 drops into the palm, inhale botanical aroma, and gently press into cheeks and forehead..."
                  value={step.description}
                  onChange={(e) =>
                    handleChange(index, "description", e.target.value)
                  }
                  required
                  rows={2}
                  className="w-full bg-[#0E131E] border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 focus:border-amber-400/60 focus:outline-none placeholder:text-slate-500"
                />
              </div>

              {/* Image upload */}
              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Step Demonstration Visual
                </label>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition">
                    <UploadCloud className="w-4 h-4 text-amber-400" />
                    <span>Upload Ritual Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleChange(index, "img", e.target.files[0])
                      }
                      className="hidden"
                    />
                  </label>

                  {step.img && (
                    <div className="relative">
                      <img
                        src={
                          typeof step.img === "string"
                            ? step.img
                            : URL.createObjectURL(step.img)
                        }
                        alt={`Step ${index + 1}`}
                        className="w-12 h-12 rounded-xl object-cover border border-amber-400/40"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Add Step Button */}
          <button
            type="button"
            onClick={addStep}
            className="w-full py-2.5 rounded-xl border border-dashed border-white/20 hover:border-amber-400/50 bg-[#080B11]/40 text-amber-300 hover:text-amber-200 font-medium flex items-center justify-center gap-2 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Additional Ritual Phase</span>
          </button>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-3 px-6 rounded-xl shadow-glow-gold transition duration-200 disabled:opacity-50 mt-4"
          >
            {loading ? (
              <>
                <LoaderCircle className="w-4 h-4 animate-spin" />
                <span>Committing Ritual Guides...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Save Application Rituals</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateHowToUseModal;