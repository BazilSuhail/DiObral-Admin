import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useApiQuery, useApiMutation } from "../../api/adapter";
import { API_BASE_URL } from "../../api/client";
import CategoryModal from "../../components/categories/CategoryModal";
import ImageCropperModal from "../../components/products/ImageCropperModal";
import {
  FiArrowLeft, FiSave, FiDollarSign, FiGrid,
  FiTag, FiType, FiFileText, FiCamera, FiLayers, FiPlus, FiX,
  FiCheck, FiFolder, FiChevronDown, FiInfo, FiMessageSquare,
} from "react-icons/fi";

const SIZES = ["S", "M", "L", "XL", "XXL"];
const EXTRA_FIELDS = ["image1", "image2", "image3", "image4", "image5"];

const inputCls = "w-full rounded-2xl px-4 py-2.5 text-sm bg-white border border-secondary shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400";
const hintCls = "text-[10px] text-gray-400 mt-1 flex items-center gap-1";
const requiredHintCls = "text-[10px] text-amber-600 mt-1 flex items-center gap-1";
const labelCls = "block text-sm font-medium text-ink mb-1.5 flex items-center gap-1.5";
const iconCls = "text-primary";

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
    name: "", description: "", price: "", sale: "", stock: "", category: "", subcategory: "", size: "", tags: "", notes: "",
  });
  const [images, setImages] = useState({});
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [categoryModal, setCategoryModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [cropperField, setCropperField] = useState(null);
  const [rootOpen, setRootOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  const rootRef = useRef(null);
  const subRef = useRef(null);

  const { data: rootCategories } = useApiQuery("/categories");
  const { data: retailerCats } = useApiQuery("/retailer/categories");

  useEffect(() => {
    const handler = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setRootOpen(false);
      if (subRef.current && !subRef.current.contains(e.target)) setSubOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedRoot = rootCategories?.find((r) => r._id === form.category);
  const retailerByParent = {};
  retailerCats?.forEach((c) => {
    const pid = c.parent?._id || c.parent;
    if (!retailerByParent[pid]) retailerByParent[pid] = [];
    retailerByParent[pid].push(c);
  });
  const subOptions = selectedRoot
    ? [...new Map([...(selectedRoot.children || []), ...(retailerByParent[selectedRoot._id] || [])].map((s) => [s._id, s])).values()]
    : [];
  const selectedSub = subOptions.find((s) => s._id === form.subcategory);

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
        subcategory: product.subcategory?._id || product.subcategory || "",
        size: sizes.join(","),
        tags: product.tags?.join(",") || "",
        notes: product.notes || "",
      });

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

  const openCropper = (field) => setCropperField(field);

  const handleCroppedImage = (file, preview) => {
    setImages((prev) => ({ ...prev, [cropperField]: file, [`${cropperField}_preview`]: preview }));
    setCropperField(null);
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

  const extraCount = EXTRA_FIELDS.filter((f) => images[f] instanceof File).length;
  const imagesReady = images.mainImage instanceof File && extraCount >= 1;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    if (!imagesReady) {
      setError("Upload cover image and at least 1 extra image before saving.");
      return;
    }
    const fd = new FormData();
    const { subcategory, ...textFields } = form;
    Object.entries(textFields).forEach(([k, v]) => fd.append(k, v));
    if (subcategory) fd.append("subcategory", subcategory);
    fd.append("mainImage", images.mainImage);
    EXTRA_FIELDS.forEach((f) => { if (images[f] instanceof File) fd.append(f, images[f]); });
    mutate(fd);
  };

  const mainPreview = getPreview("mainImage");

  return (
    <div className="px-2 lg:px-6 py-6 space-y-6 max-w-[1400px] mx-auto">
      <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}>
        <Link to="/products" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-primary transition-colors">
          <FiArrowLeft size={14} />
          Back to Products
        </Link>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <h1 className="text-2xl font-bold text-ink">{isEdit ? "Edit Product" : "New Product"}</h1>
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
        className="bg-white rounded-2xl border border-secondary shadow-sm p-6 space-y-5"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-5">
            <div>
              <label className={labelCls}><FiType size={14} className={iconCls} /> Name</label>
              <input className={inputCls} name="name" placeholder="Cool T-Shirt" value={form.name} onChange={handleChange} required />
              <p className={requiredHintCls}><FiInfo size={10} /> Required. A short, descriptive product name.</p>
            </div>
            <div>
              <label className={labelCls}><FiFileText size={14} className={iconCls} /> Description</label>
              <textarea className={`${inputCls} resize-none`} name="description" placeholder="Describe your product..." value={form.description} onChange={handleChange} rows={3} />
              <p className={requiredHintCls}><FiInfo size={10} /> Helps customers understand the product. Supports basic text.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}><FiDollarSign size={14} className={iconCls} /> Price</label>
                <input className={inputCls} name="price" type="number" step="0.01" placeholder="29.99" value={form.price} onChange={handleChange} required />
                <p className={requiredHintCls}><FiInfo size={10} /> Regular selling price. Required.</p>
              </div>
              <div>
                <label className={labelCls}><FiDollarSign size={14} className={iconCls} /> Sale Price</label>
                <input className={inputCls} name="sale" type="number" step="0.01" placeholder="19.99" value={form.sale} onChange={handleChange} />
                <p className={requiredHintCls}><FiInfo size={10} /> Leave 0 or empty if not on sale.</p>
              </div>
            </div>
            <div>
              <label className={labelCls}><FiGrid size={14} className={iconCls} /> Stock</label>
              <input className={inputCls} name="stock" type="number" placeholder="50" value={form.stock} onChange={handleChange} required />
              <p className={requiredHintCls}><FiInfo size={10} /> Current quantity available. Set 0 for out-of-stock.</p>
            </div>
            <div>
              <label className={labelCls}><FiFolder size={14} className={iconCls} /> Main Category <span className="text-primary text-[10px]">(required)</span></label>
              <div ref={rootRef} className="relative">
                <button
                  type="button"
                  onClick={() => setRootOpen((p) => !p)}
                  className="w-full rounded-2xl px-4 py-2.5 text-sm bg-white border border-secondary shadow-sm transition-all text-left flex items-center justify-between group hover:bg-secondary/60"
                >
                  <span className={form.category ? "text-ink" : "text-gray-400"}>
                    {selectedRoot ? selectedRoot.name : "Select main category..."}
                  </span>
                  <FiChevronDown size={14} className={`text-gray-400 transition-transform ${rootOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {rootOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute z-20 mt-1 w-full bg-white rounded-2xl shadow-xl shadow-black/10 border border-secondary overflow-hidden"
                    >
                      <div className="max-h-52 overflow-y-auto p-1.5">
                        {rootCategories?.length === 0 && (
                          <p className="text-center text-sm text-gray-400 py-4">No categories available</p>
                        )}
                        {rootCategories?.map((r) => (
                          <button
                            key={r._id}
                            type="button"
                            onClick={() => {
                              setForm((p) => ({ ...p, category: r._id, subcategory: p.subcategory && r._id === p.category ? p.subcategory : "" }));
                              setRootOpen(false);
                            }}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-all ${
                              form.category === r._id ? "bg-red-50 text-red-700" : "text-gray-700 hover:bg-secondary"
                            }`}
                          >
                            <FiFolder size={14} className={form.category === r._id ? "text-red-400" : "text-amber-500"} />
                            <span className="text-sm font-medium flex-1">{r.name}</span>
                            {form.category === r._id && <FiCheck size={14} className="text-red-500" />}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <input type="hidden" name="category" value={form.category} required />
              <p className={requiredHintCls}><FiInfo size={10} /> Choose the root department for your product.</p>
            </div>

            <div>
              <label className={labelCls}><FiLayers size={14} className={iconCls} /> Subcategory <span className="text-gray-400 text-[10px] font-normal">(optional)</span></label>
              <div ref={subRef} className="relative">
                <button
                  type="button"
                  onClick={() => form.category ? setSubOpen((p) => !p) : null}
                  disabled={!form.category}
                  className="w-full rounded-2xl px-4 py-2.5 text-sm bg-white border border-secondary shadow-sm transition-all text-left flex items-center justify-between group hover:bg-secondary/60 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className={form.subcategory ? "text-ink" : "text-gray-400"}>
                    {selectedSub ? selectedSub.name : form.category ? "Select subcategory (optional)..." : "Select a main category first"}
                  </span>
                  <FiChevronDown size={14} className={`text-gray-400 transition-transform ${subOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {subOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute z-20 mt-1 w-full bg-white rounded-2xl shadow-xl shadow-black/10 border border-secondary overflow-hidden"
                    >
                      <div className="max-h-52 overflow-y-auto p-1.5">
                        <button
                          type="button"
                          onClick={() => { setForm((p) => ({ ...p, subcategory: "" })); setSubOpen(false); }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-gray-400 hover:bg-secondary transition-all text-sm"
                        >
                          None
                        </button>
                        {subOptions.map((s) => (
                          <button
                            key={s._id}
                            type="button"
                            onClick={() => { setForm((p) => ({ ...p, subcategory: s._id })); setSubOpen(false); }}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-all ${
                              form.subcategory === s._id ? "bg-red-50 text-red-700" : "text-gray-700 hover:bg-secondary"
                            }`}
                          >
                            <FiFolder size={13} className={form.subcategory === s._id ? "text-red-400" : "text-gray-400"} />
                            <span className="text-sm flex-1">{s.name}</span>
                            {s.isSystem && <span className="text-[9px] text-gray-300 bg-gray-100 px-1.5 py-0.5 rounded">system</span>}
                            {form.subcategory === s._id && <FiCheck size={14} className="text-red-500" />}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <p className={hintCls}><FiInfo size={10} /> Fine-tune your product placement under a subcategory.</p>
              <button type="button" onClick={() => setCategoryModal(true)} className="mt-1.5 text-[10px] text-primary hover:text-red-700 transition-colors flex items-center gap-1">
                <FiPlus size={10} /> Manage categories
              </button>
            </div>
            <div>
              <label className={`${labelCls} mb-2`}><FiLayers size={14} className={iconCls} /> Sizes</label>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSize(s)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                      selectedSizes.includes(s)
                        ? "bg-red-50 border-red-200 text-red-700 shadow-sm"
                        : "bg-white border-secondary text-gray-500 hover:border-gray-300 hover:bg-secondary"
                    }`}
                  >
                    {selectedSizes.includes(s) && <FiCheck size={12} className="inline mr-1" />}
                    {s}
                  </button>
                ))}
              </div>
              <input type="hidden" name="size" value={form.size} />
              <p className={requiredHintCls}><FiInfo size={10} /> Select all available sizes. Leave empty if not applicable.</p>
            </div>
            <div>
              <label className={labelCls}><FiTag size={14} className={iconCls} /> Tags (csv)</label>
              <input className={inputCls} name="tags" placeholder="clothing,cotton" value={form.tags} onChange={handleChange} />
              <p className={requiredHintCls}><FiInfo size={10} /> Comma-separated. e.g. "cotton,summer,unisex"</p>
            </div>
            <div>
              <label className={labelCls}><FiMessageSquare size={14} className={iconCls} /> Retailer Notes</label>
              <textarea className={`${inputCls} resize-none`} name="notes" placeholder="Internal note about this product (not shown to customers)..." value={form.notes} onChange={handleChange} rows={3} />
              <p className={hintCls}><FiInfo size={10} /> Private note for your own reference.</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-ink flex items-center gap-1.5"><FiCamera size={14} className={iconCls} /> Images <span className="text-primary text-[10px] font-normal">(cover required, min 1 extra)</span></label>
                {imagesReady && <span className="text-[10px] text-emerald-600 flex items-center gap-1"><FiCheck size={10} /> {1 + extraCount}/6 uploaded</span>}
              </div>
              <div className="space-y-3">
                {/* Cover image */}
                <div className="relative">
                  {mainPreview ? (
                    <div className="relative group">
                      <img src={mainPreview} alt="" className="w-full aspect-[4/5] rounded-2xl object-cover shadow-sm" />
                      <div className="absolute inset-0 bg-black/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button type="button" onClick={() => openCropper("mainImage")} className="p-2 bg-white/90 rounded-xl text-gray-700 hover:text-primary transition-colors shadow-sm" title="Change image">
                          <FiCamera size={16} />
                        </button>
                        <button type="button" onClick={() => removeImage("mainImage")} className="p-2 bg-white/90 rounded-xl text-gray-700 hover:text-primary transition-colors shadow-sm" title="Remove">
                          <FiX size={16} />
                        </button>
                      </div>
                      <span className="absolute bottom-2 left-2 text-[10px] text-white bg-black/40 px-2.5 py-1 rounded-lg backdrop-blur-sm">Cover image</span>
                    </div>
                  ) : (
                    <button type="button" onClick={() => openCropper("mainImage")} className="flex flex-col items-center justify-center w-full aspect-[4/5] rounded-2xl bg-secondary/50 border-2 border-dashed border-gray-200 cursor-pointer hover:border-red-300 hover:bg-red-50/30 transition-all group">
                      <FiCamera size={28} className="text-gray-300 group-hover:text-red-400 transition-colors" />
                      <span className="text-xs text-gray-400 mt-2 group-hover:text-red-400 transition-colors">Upload cover image (required)</span>
                      {!images.mainImage && <span className="text-[10px] text-red-400 mt-1">Required</span>}
                    </button>
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
                              <button type="button" onClick={() => openCropper(field)} className="p-1 bg-white/90 rounded-lg text-gray-700 hover:text-primary transition-colors shadow-sm" title="Change image">
                                <FiCamera size={12} />
                              </button>
                              <button type="button" onClick={() => removeImage(field)} className="p-1 bg-white/90 rounded-lg text-gray-700 hover:text-primary transition-colors shadow-sm" title="Remove">
                                <FiX size={12} />
                              </button>
                            </div>
                            <span className="absolute bottom-1 left-1 text-[8px] text-white bg-black/40 px-1.5 py-0.5 rounded-md backdrop-blur-sm">{field.replace("image", "#")}</span>
                          </div>
                        ) : (
                          <button type="button" onClick={() => openCropper(field)} className="flex flex-col items-center justify-center w-full aspect-square rounded-xl bg-secondary/50 border-2 border-dashed border-gray-200 cursor-pointer hover:border-red-300 hover:bg-red-50/30 transition-all group">
                            <FiPlus size={14} className="text-gray-300 group-hover:text-red-400 transition-colors" />
                            <span className="text-[8px] text-gray-400 mt-0.5 group-hover:text-red-400 transition-colors">{field.replace("image", "#")}</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <p className={hintCls}><FiInfo size={10} /> Cover required + at least 1 extra (max 5). Accepted: .jpg, .png, .webp (max 5MB each)</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2.5 rounded-2xl font-medium text-sm hover:from-red-700 hover:to-red-800 disabled:opacity-50 transition-all shadow-lg shadow-red-600/20"
            disabled={isPending || !imagesReady}
          >
            <FiSave size={16} />
            {isPending ? "Saving..." : isEdit ? "Update" : "Create"}
          </motion.button>
          <Link to="/products" className="px-6 py-2.5 rounded-2xl text-sm font-medium text-gray-500 hover:bg-secondary transition-colors">Cancel</Link>
        </div>
      </motion.form>

      {categoryModal && (
        <CategoryModal
          onSelect={(sel) => {
            setForm((p) => ({ ...p, category: sel.category, subcategory: sel.subcategory || "" }));
          }}
          onClose={() => setCategoryModal(false)}
        />
      )}

      <ImageCropperModal
        open={!!cropperField}
        onClose={() => setCropperField(null)}
        onSave={handleCroppedImage}
        initialImage={cropperField ? getPreview(cropperField) : null}
        aspect={4 / 5}
      />

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
            className="relative w-full max-w-sm aspect-[4/5]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewUrl(null)}
              className="absolute -top-3 -right-3 z-10 p-2 bg-white rounded-xl shadow-lg text-gray-600 hover:text-primary transition-colors"
            >
              <FiX size={16} />
            </button>
            <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl">
              <img src={previewUrl} alt="" className="w-full h-full object-cover" />
            </div>
            <p className="text-xs text-white/60 text-center mt-2">Click outside or press Esc to close</p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
