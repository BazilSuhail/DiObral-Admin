import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { useApiQuery, useApiMutation } from "../../api/adapter";
import { API_BASE_URL } from "../../api/client";
import CategoryModal from "../../components/categories/CategoryModal";
import {
  FiArrowLeft, FiSave, FiDollarSign, FiGrid,
  FiTag, FiType, FiFileText, FiCamera, FiLayers, FiPlus, FiX,
  FiCheck, FiFolder, FiChevronDown, FiInfo, FiMaximize,
} from "react-icons/fi";

const SIZES = ["S", "M", "L", "XL", "XXL"];
const EXTRA_FIELDS = ["image1", "image2", "image3", "image4", "image5"];

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { data: product } = useApiQuery(isEdit ? `/retailer/products/${id}` : null);

  const [error, setError] = useState(null);

  const { mutate, isPending } = useApiMutation(
    isEdit ? `/retailer/products/${id}` : "/retailer/products",
    isEdit ? "PUT" : "POST",
    {
      onSuccess: () => navigate("/products"),
      onError: (err) => {
        const msg = err?.response?.data?.error || err?.message || "Something went wrong";
        setError(msg);
      },
    }
  );

  const [form, setForm] = useState({
    name: "", description: "", price: "", sale: "", stock: "", category: "", size: "", tags: "",
  });
  const [images, setImages] = useState({});
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [categoryModal, setCategoryModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    if (product) {
      const sizes = product.size || [];
      setSelectedSizes(sizes);
      setForm({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        sale: product.sale || "",
        stock: product.stock || "",
        category: product.category?._id || "",
        size: sizes.join(","),
        tags: product.tags?.join(",") || "",
      });
      if (product.category) {
        const cat = product.category;
        setSelectedCategory({ _id: cat._id, name: cat.name || cat });
      }
    }
  }, [product]);

  useEffect(() => {
    setForm((prev) => ({ ...prev, size: selectedSizes.join(",") }));
  }, [selectedSizes]);

  const toggleSize = (s) => {
    setSelectedSizes((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleImage = (field) => (e) => {
    setError(null);
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError(`"${field}" is too large. Maximum size is 5MB per image.`);
      return;
    }
    setImages((prev) => ({ ...prev, [field]: file, [`${field}_preview`]: URL.createObjectURL(file) }));
  };

  const removeImage = (field) => {
    setImages((prev) => {
      const next = { ...prev };
      delete next[field];
      delete next[`${field}_preview`];
      return next;
    });
  };

  const uploadUrl = (filename) => filename ? `${API_BASE_URL}/uploads/${filename}` : null;

  const getPreview = (field) => {
    const p = images[`${field}_preview`];
    if (p) return p;
    if (field === "mainImage" && product?.image) return uploadUrl(product.image);
    const idx = EXTRA_FIELDS.indexOf(field);
    const other = product?.otherImages?.[idx];
    if (other) return uploadUrl(other);
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    fd.append("mainImage", images.mainImage || "");
    EXTRA_FIELDS.forEach((f) => {
      if (images[f]) fd.append(f, images[f]);
    });
    mutate(fd);
  };

  const mainPreview = getPreview("mainImage");

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}>
        <Link to="/products" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-600 transition-colors">
          <FiArrowLeft size={14} />
          Back to Products
        </Link>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <h1 className="text-2xl font-bold text-gray-900">{isEdit ? "Edit Product" : "New Product"}</h1>
        <p className="text-sm text-gray-500 mt-0.5">{isEdit ? "Update your product details" : "Add a new product to your store"}</p>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3 shadow-sm"
        >
          <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <FiX size={16} className="text-red-600" />
          </div>
          <p className="text-sm text-red-700 flex-1 min-w-0">{error}</p>
          <button type="button" onClick={() => setError(null)} className="p-1 rounded-lg hover:bg-red-100 transition-colors flex-shrink-0">
            <FiX size={16} className="text-red-400" />
          </button>
        </motion.div>
      )}

      <motion.form
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        onSubmit={handleSubmit}
        className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-md shadow-black/5 space-y-5"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5"><FiType size={14} className="text-gray-400" /> Name</label>
              <input className="w-full rounded-2xl px-4 py-2.5 text-sm bg-gray-50/50 shadow-sm shadow-black/5 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all placeholder:text-gray-400" name="name" placeholder="Cool T-Shirt" value={form.name} onChange={handleChange} required />
              <p className="text-[10px] text-amber-600 mt-1 flex items-center gap-1"><FiInfo size={10} /> Required. A short, descriptive product name.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5"><FiFileText size={14} className="text-gray-400" /> Description</label>
              <textarea className="w-full rounded-2xl px-4 py-2.5 text-sm bg-gray-50/50 shadow-sm shadow-black/5 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all resize-none" name="description" placeholder="Describe your product..." value={form.description} onChange={handleChange} rows={3} />
              <p className="text-[10px] text-amber-600 mt-1 flex items-center gap-1"><FiInfo size={10} /> Helps customers understand the product. Supports basic text.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5"><FiDollarSign size={14} className="text-gray-400" /> Price</label>
                <input className="w-full rounded-2xl px-4 py-2.5 text-sm bg-gray-50/50 shadow-sm shadow-black/5 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all" name="price" type="number" step="0.01" placeholder="29.99" value={form.price} onChange={handleChange} required />
                <p className="text-[10px] text-amber-600 mt-1 flex items-center gap-1"><FiInfo size={10} /> Regular selling price. Required.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5"><FiDollarSign size={14} className="text-gray-400" /> Sale Price</label>
                <input className="w-full rounded-2xl px-4 py-2.5 text-sm bg-gray-50/50 shadow-sm shadow-black/5 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all" name="sale" type="number" step="0.01" placeholder="19.99" value={form.sale} onChange={handleChange} />
                <p className="text-[10px] text-amber-600 mt-1 flex items-center gap-1"><FiInfo size={10} /> Leave 0 or empty if not on sale.</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5"><FiGrid size={14} className="text-gray-400" /> Stock</label>
              <input className="w-full rounded-2xl px-4 py-2.5 text-sm bg-gray-50/50 shadow-sm shadow-black/5 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all" name="stock" type="number" placeholder="50" value={form.stock} onChange={handleChange} required />
              <p className="text-[10px] text-amber-600 mt-1 flex items-center gap-1"><FiInfo size={10} /> Current quantity available. Set 0 for out-of-stock.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5"><FiFolder size={14} className="text-gray-400" /> Category</label>
              <button
                type="button"
                onClick={() => setCategoryModal(true)}
                className="w-full rounded-2xl px-4 py-2.5 text-sm bg-gray-50/50 shadow-sm shadow-black/5 transition-all text-left flex items-center justify-between group hover:bg-gray-100"
              >
                <span className={selectedCategory ? "text-gray-900" : "text-gray-400"}>
                  {selectedCategory ? selectedCategory.name : "Select category..."}
                </span>
                <FiChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
              </button>
              <p className="text-[10px] text-amber-600 mt-1 flex items-center gap-1"><FiInfo size={10} /> Helps customers find your product by department.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5"><FiLayers size={14} className="text-gray-400" /> Sizes</label>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSize(s)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                      selectedSizes.includes(s)
                        ? "bg-red-50 border-red-200 text-red-700 shadow-sm"
                        : "bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {selectedSizes.includes(s) && <FiCheck size={12} className="inline mr-1" />}
                    {s}
                  </button>
                ))}
              </div>
              <input type="hidden" name="size" value={form.size} />
              <p className="text-[10px] text-amber-600 mt-1 flex items-center gap-1"><FiInfo size={10} /> Select all available sizes. Leave empty if not applicable.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5"><FiTag size={14} className="text-gray-400" /> Tags (csv)</label>
              <input className="w-full rounded-2xl px-4 py-2.5 text-sm bg-gray-50/50 shadow-sm shadow-black/5 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all" name="tags" placeholder="clothing,cotton" value={form.tags} onChange={handleChange} />
              <p className="text-[10px] text-amber-600 mt-1 flex items-center gap-1"><FiInfo size={10} /> Comma-separated. e.g. "cotton,summer,unisex"</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5"><FiCamera size={14} className="text-gray-400" /> Images</label>
              </div>
              <div className="space-y-3">
                {/* Cover image */}
                <div className="relative">
                  {mainPreview ? (
                    <div className="relative group">
                      <img src={mainPreview} alt="" className="w-full aspect-video rounded-2xl object-cover shadow-sm" />
                      <div className="absolute inset-0 bg-black/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button type="button" onClick={() => setPreviewUrl(mainPreview)} className="p-2 bg-white/90 rounded-xl text-gray-700 hover:text-blue-600 transition-colors shadow-sm">
                          <FiCamera size={16} />
                        </button>
                        <button type="button" onClick={() => removeImage("mainImage")} className="p-2 bg-white/90 rounded-xl text-gray-700 hover:text-red-600 transition-colors shadow-sm">
                          <FiX size={16} />
                        </button>
                      </div>
                      <span className="absolute bottom-2 left-2 text-[10px] text-white bg-black/40 px-2.5 py-1 rounded-lg backdrop-blur-sm">Cover image</span>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full aspect-video rounded-2xl bg-gray-50/50 border-2 border-dashed border-gray-200 cursor-pointer hover:border-red-300 hover:bg-red-50/30 transition-all group">
                      <FiCamera size={28} className="text-gray-300 group-hover:text-red-400 transition-colors" />
                      <span className="text-xs text-gray-400 mt-2 group-hover:text-red-400 transition-colors">Upload cover image (required)</span>
                      <input type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handleImage("mainImage")} className="hidden" />
                    </label>
                  )}
                </div>

                {/* Extra images */}
                <div className="grid grid-cols-5 gap-2">
                  {EXTRA_FIELDS.map((field) => {
                    const preview = getPreview(field);
                    return (
                      <div key={field} className="relative">
                        {preview ? (
                          <div className="relative group">
                            <img src={preview} alt="" className="w-full aspect-square rounded-xl object-cover shadow-sm" />
                            <div className="absolute inset-0 bg-black/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                              <button type="button" onClick={() => setPreviewUrl(preview)} className="p-1 bg-white/90 rounded-lg text-gray-700 hover:text-blue-600 transition-colors shadow-sm">
                                <FiCamera size={12} />
                              </button>
                              <button type="button" onClick={() => removeImage(field)} className="p-1 bg-white/90 rounded-lg text-gray-700 hover:text-red-600 transition-colors shadow-sm">
                                <FiX size={12} />
                              </button>
                            </div>
                            <span className="absolute bottom-1 left-1 text-[8px] text-white bg-black/40 px-1.5 py-0.5 rounded-md backdrop-blur-sm">{field.replace("image", "#")}</span>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center w-full aspect-square rounded-xl bg-gray-50/50 border-2 border-dashed border-gray-200 cursor-pointer hover:border-red-300 hover:bg-red-50/30 transition-all group">
                            <FiPlus size={14} className="text-gray-300 group-hover:text-red-400 transition-colors" />
                            <span className="text-[8px] text-gray-400 mt-0.5 group-hover:text-red-400 transition-colors">{field.replace("image", "#")}</span>
                            <input type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handleImage(field)} className="hidden" />
                          </label>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1"><FiInfo size={10} /> Cover image is required. Accepted: .jpg, .png, .webp (max 5MB each)</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2.5 rounded-2xl font-medium text-sm hover:from-red-700 hover:to-red-800 disabled:opacity-50 transition-all shadow-lg shadow-red-600/20"
            disabled={isPending}
          >
            <FiSave size={16} />
            {isPending ? "Saving..." : isEdit ? "Update" : "Create"}
          </motion.button>
          <Link to="/products" className="px-6 py-2.5 rounded-2xl text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors">Cancel</Link>
        </div>
      </motion.form>

      {categoryModal && (
        <CategoryModal
          onSelect={(cat) => { setSelectedCategory(cat); setForm((p) => ({ ...p, category: cat._id })); }}
          onClose={() => setCategoryModal(false)}
        />
      )}

      {previewUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPreviewUrl(null)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="relative max-w-4xl w-full max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewUrl(null)}
              className="absolute -top-3 -right-3 z-10 p-2 bg-white rounded-xl shadow-lg text-gray-600 hover:text-red-600 transition-colors"
            >
              <FiX size={16} />
            </button>
            <div className="w-full h-full max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl">
              <img src={previewUrl} alt="" className="w-full h-full object-cover" />
            </div>
            <p className="text-xs text-white/60 text-center mt-2">Click outside or press Esc to close</p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
