import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { useApiQuery, useApiMutation } from "../../api/adapter";
import { API_BASE_URL } from "../../api/client";
import { FiArrowLeft, FiSave, FiPlus, FiX, FiPackage, FiDollarSign, FiType, FiFileText, FiGrid, FiCalendar, FiTag, FiSearch, FiCamera, FiMessageSquare } from "react-icons/fi";
import ProductSelectModal from "../../components/bundles/ProductSelectModal";
import DateTimePicker from "../../components/shared/DateTimePicker";

const inputCls = "w-full rounded-2xl px-4 py-2.5 text-sm bg-white border border-secondary shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400";
const labelCls = "block text-sm font-medium text-ink mb-1.5 flex items-center gap-1.5";
const iconCls = "text-primary";

export default function BundleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { data: bundle } = useApiQuery(isEdit ? `/bundles/${id}` : null);

  const { mutate, isPending } = useApiMutation(
    isEdit ? `/bundles/${id}` : "/bundles",
    isEdit ? "PUT" : "POST",
    { onSuccess: () => navigate("/bundles") }
  );

  const [form, setForm] = useState({
    name: "", description: "", price: "", stock: "", startsAt: "", expiresAt: "", maxPerOrder: "", tags: "", notes: "",
  });
  const [items, setItems] = useState([{ product: "", quantity: 1, _name: "", _price: "", _image: "" }]);
  const [productPicker, setProductPicker] = useState(null);
  const [dupError, setDupError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showGuide, setShowGuide] = useState(true);

  useEffect(() => {
    if (bundle) {
      setForm({
        name: bundle.name || "",
        description: bundle.description || "",
        price: bundle.price || "",
        stock: bundle.stock || "",
        startsAt: bundle.startsAt ? bundle.startsAt.slice(0, 16) : "",
        expiresAt: bundle.expiresAt ? bundle.expiresAt.slice(0, 16) : "",
        maxPerOrder: bundle.maxPerOrder || "",
        tags: bundle.tags?.join(",") || "",
        notes: bundle.notes || "",
      });
      if (bundle.image) setImagePreview(`${API_BASE_URL}/uploads/${bundle.image}`);
      setItems(bundle.items?.map((i) => ({
        product: i.product?._id || "",
        quantity: i.quantity,
        _name: i.product?.name || "",
        _price: i.product?.price || "",
        _image: i.product?.image || "",
      })) || [{ product: "", quantity: 1, _name: "", _price: "", _image: "" }]);
    }
  }, [bundle]);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const addItem = () => setItems((prev) => [...prev, { product: "", quantity: 1, _name: "", _price: "", _image: "" }]);
  const updateItem = (i, field, value) => setItems((prev) => prev.map((item, idx) => idx === i ? { ...item, [field]: value } : item));
  const removeItem = (i) => setItems((prev) => prev.filter((_, idx) => idx !== i));

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    fd.append("items", JSON.stringify(items.filter((i) => i.product).map(({ _name, _price, _image, ...rest }) => rest)));
    fd.append("tags", JSON.stringify(form.tags ? form.tags.split(",").map((t) => t.trim()) : []));
    if (imageFile) fd.append("image", imageFile);
    if (!imageFile && !imagePreview) fd.append("image", "");
    mutate(fd);
  };

  return (
    <div className="px-2 lg:px-6 py-6 space-y-6 max-w-[1400px] mx-auto">
      <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}>
        <Link to="/bundles" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-primary transition-colors">
          <FiArrowLeft size={14} />
          Back to Bundles
        </Link>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <h1 className="text-2xl font-bold text-ink">{isEdit ? "Edit Bundle" : "New Bundle"}</h1>
        <p className="text-sm text-gray-500 mt-0.5">{isEdit ? "Update your bundle" : "Create a product bundle"}</p>
      </motion.div>

      {showGuide && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-secondary/60 border border-secondary rounded-2xl p-4 flex items-start gap-3 shadow-sm"
        >
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <FiFileText size={16} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0 text-sm text-ink space-y-1">
            <p className="font-medium">Bundle guide</p>
            <ul className="list-disc list-inside space-y-0.5 text-gray-500 text-xs">
              <li>Fill in the Name, Price, and Stock — these are required.</li>
              <li>Add at least 2 products from the Items panel. The bundle price should be lower than the sum of item prices.</li>
              <li>Set a Start/End date if this is a time-limited offer.</li>
              <li>Upload an image or paste a URL to show the bundle in listings.</li>
            </ul>
          </div>
          <button type="button" onClick={() => setShowGuide(false)} className="p-1 rounded-lg hover:bg-secondary transition-colors flex-shrink-0">
            <FiX size={16} className="text-gray-400" />
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
              <input className={inputCls} name="name" placeholder="Summer Starter Pack" value={form.name} onChange={handleChange} required />
            </div>
            <div>
              <label className={labelCls}><FiFileText size={14} className={iconCls} /> Description</label>
              <textarea className={`${inputCls} resize-none`} name="description" placeholder="Describe the bundle..." value={form.description} onChange={handleChange} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}><FiDollarSign size={14} className={iconCls} /> Price</label>
                <input className={inputCls} name="price" type="number" step="0.01" placeholder="59.99" value={form.price} onChange={handleChange} required />
              </div>
              <div>
                <label className={labelCls}><FiPackage size={14} className={iconCls} /> Stock</label>
                <input className={inputCls} name="stock" type="number" placeholder="10" value={form.stock} onChange={handleChange} required />
              </div>
            </div>
            <div>
              <label className={labelCls}><FiTag size={14} className={iconCls} /> Tags</label>
              <input className={inputCls} name="tags" placeholder="summer,bundle" value={form.tags} onChange={handleChange} />
            </div>
            <div>
              <label className={labelCls}><FiMessageSquare size={14} className={iconCls} /> Retailer Notes</label>
              <textarea className={`${inputCls} resize-none`} name="notes" placeholder="Internal note about this bundle (not shown to customers)..." value={form.notes} onChange={handleChange} rows={3} />
              <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1"><FiMessageSquare size={10} /> Private note for your own reference.</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-ink flex items-center gap-2"><FiPackage size={16} className={iconCls} /> Items</h2>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={addItem}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-red-700 transition-colors"
                >
                  <FiPlus size={14} /> Add
                </motion.button>
              </div>
              <div className="space-y-2.5">
                {items.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2.5"
                  >
                    {item._name ? (
                      <div className="flex-1 flex items-center gap-3 px-3 py-2 rounded-2xl bg-white border border-secondary shadow-sm">
                        <div className="w-9 h-9 rounded-xl bg-secondary overflow-hidden flex-shrink-0 shadow-sm">
                          {item._image ? (
                            <img src={`${API_BASE_URL}/uploads/${item._image}`} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center"><FiPackage size={14} className="text-gray-300" /></div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-ink truncate">{item._name}</p>
                          <p className="text-xs text-gray-400">${parseFloat(item._price).toFixed(2)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setProductPicker(i)}
                          className="text-[10px] text-primary hover:text-red-600 font-medium transition-colors flex-shrink-0"
                        >
                          Change
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setProductPicker(i)}
                        className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-secondary shadow-sm text-sm text-gray-400 hover:text-gray-600 hover:bg-secondary/60 transition-all text-left"
                      >
                        <FiSearch size={15} />
                        Select product...
                      </button>
                    )}
                    <input
                      className="w-20 rounded-2xl px-3 py-2.5 text-sm bg-white border border-secondary shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-center"
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => updateItem(i, "quantity", Number(e.target.value))}
                      required
                      min={1}
                    />
                    {items.length > 1 && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        type="button"
                        onClick={() => removeItem(i)}
                        className="p-2 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <FiX size={16} />
                      </motion.button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <label className={`${labelCls} mb-1.5`}><FiCamera size={14} className={iconCls} /> Image</label>
              <div className="relative">
                {imagePreview ? (
                  <div className="relative group">
                    <img src={imagePreview} alt="" className="w-full aspect-video rounded-2xl object-cover shadow-sm" />
                    <div className="absolute inset-0 bg-black/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button type="button" onClick={removeImage} className="p-2 bg-white/90 rounded-xl text-gray-700 hover:text-primary transition-colors shadow-sm">
                        <FiX size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full aspect-video rounded-2xl bg-secondary/50 border-2 border-dashed border-gray-200 cursor-pointer hover:border-red-300 hover:bg-red-50/30 transition-all group">
                    <FiCamera size={24} className="text-gray-300 group-hover:text-red-400 transition-colors" />
                    <span className="text-xs text-gray-400 mt-2 group-hover:text-red-400 transition-colors">Upload bundle image</span>
                    <input type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handleImage} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}><FiGrid size={14} className={iconCls} /> Max Per Order</label>
                <input className={inputCls} name="maxPerOrder" type="number" placeholder="3" value={form.maxPerOrder} onChange={handleChange} />
              </div>
              <div>
                <label className={labelCls}><FiCalendar size={14} className={iconCls} /> Starts At</label>
                <DateTimePicker value={form.startsAt} onChange={(v) => setForm((p) => ({ ...p, startsAt: v }))} placeholder="Start date & time" />
              </div>
              <div>
                <label className={labelCls}><FiCalendar size={14} className={iconCls} /> Expires At</label>
                <DateTimePicker value={form.expiresAt} onChange={(v) => setForm((p) => ({ ...p, expiresAt: v }))} placeholder="Expiry date & time" />
              </div>
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
          <Link to="/bundles" className="px-6 py-2.5 rounded-2xl text-sm font-medium text-gray-500 hover:bg-secondary transition-colors">Cancel</Link>
        </div>
      </motion.form>

      {dupError && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 right-6 bg-red-600 text-white text-sm px-5 py-3 rounded-2xl shadow-lg shadow-red-600/30 z-50 flex items-center gap-2"
        >
          <FiX size={14} />
          {dupError}
          <button onClick={() => setDupError("")} className="ml-2 p-0.5 rounded hover:bg-red-500 transition-colors"><FiX size={12} /></button>
        </motion.div>
      )}

      {productPicker !== null && (
        <ProductSelectModal
          onSelect={(product) => {
            const already = items.some((item, idx) => idx !== productPicker && item.product === product._id);
            if (already) {
              setDupError(`"${product.name}" is already in the bundle`);
              return;
            }
            setDupError("");
            updateItem(productPicker, "product", product._id);
            updateItem(productPicker, "_name", product.name);
            updateItem(productPicker, "_price", product.price);
            updateItem(productPicker, "_image", product.image || "");
            setProductPicker(null);
          }}
          onClose={() => setProductPicker(null)}
        />
      )}
    </div>
  );
}
