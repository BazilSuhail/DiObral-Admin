import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { useApiQuery, useApiMutation } from "../../api/adapter";
import { API_BASE_URL } from "../../api/client";
import { FiArrowLeft, FiSave, FiPlus, FiX, FiPackage, FiDollarSign, FiType, FiFileText, FiImage, FiGrid, FiCalendar, FiTag, FiSearch, FiCamera } from "react-icons/fi";
import ProductSelectModal from "../../components/bundles/ProductSelectModal";
import DateTimePicker from "../../components/shared/DateTimePicker";

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
    name: "", description: "", price: "", stock: "", startsAt: "", expiresAt: "", maxPerOrder: "", tags: "",
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
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}>
        <Link to="/bundles" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-600 transition-colors">
          <FiArrowLeft size={14} />
          Back to Bundles
        </Link>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <h1 className="text-2xl font-bold text-gray-900">{isEdit ? "Edit Bundle" : "New Bundle"}</h1>
        <p className="text-sm text-gray-500 mt-0.5">{isEdit ? "Update your bundle" : "Create a product bundle"}</p>
      </motion.div>

      {showGuide && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 shadow-sm"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <FiFileText size={16} className="text-amber-600" />
          </div>
          <div className="flex-1 min-w-0 text-sm text-amber-800 space-y-1">
            <p className="font-medium">Bundle guide</p>
            <ul className="list-disc list-inside space-y-0.5 text-amber-700 text-xs">
              <li>Fill in the Name, Price, and Stock — these are required.</li>
              <li>Add at least 2 products from the Items panel. The bundle price should be lower than the sum of item prices.</li>
              <li>Set a Start/End date if this is a time-limited offer.</li>
              <li>Upload an image or paste a URL to show the bundle in listings.</li>
            </ul>
          </div>
          <button type="button" onClick={() => setShowGuide(false)} className="p-1 rounded-lg hover:bg-amber-100 transition-colors flex-shrink-0">
            <FiX size={16} className="text-amber-400" />
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
              <input className="w-full rounded-2xl px-4 py-2.5 text-sm bg-gray-50/50 shadow-sm shadow-black/5 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all placeholder:text-gray-400" name="name" placeholder="Summer Starter Pack" value={form.name} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5"><FiFileText size={14} className="text-gray-400" /> Description</label>
              <textarea className="w-full rounded-2xl px-4 py-2.5 text-sm bg-gray-50/50 shadow-sm shadow-black/5 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all resize-none" name="description" placeholder="Describe the bundle..." value={form.description} onChange={handleChange} rows={3} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5"><FiDollarSign size={14} className="text-gray-400" /> Price</label>
              <input className="w-full rounded-2xl px-4 py-2.5 text-sm bg-gray-50/50 shadow-sm shadow-black/5 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all" name="price" type="number" step="0.01" placeholder="59.99" value={form.price} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5"><FiPackage size={14} className="text-gray-400" /> Stock</label>
              <input className="w-full rounded-2xl px-4 py-2.5 text-sm bg-gray-50/50 shadow-sm shadow-black/5 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all" name="stock" type="number" placeholder="10" value={form.stock} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5"><FiTag size={14} className="text-gray-400" /> Tags</label>
              <input className="w-full rounded-2xl px-4 py-2.5 text-sm bg-gray-50/50 shadow-sm shadow-black/5 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all" name="tags" placeholder="summer,bundle" value={form.tags} onChange={handleChange} />
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2"><FiPackage size={16} className="text-red-600" /> Items</h2>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={addItem}
              className="inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
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
                  <div className="flex-1 flex items-center gap-3 px-3 py-2 rounded-2xl bg-gray-50/50 shadow-sm shadow-black/5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden flex-shrink-0 shadow-sm">
                      {item._image ? (
                        <img src={`${API_BASE_URL}/uploads/${item._image}`} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><FiPackage size={14} className="text-gray-300" /></div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-800 truncate">{item._name}</p>
                      <p className="text-xs text-gray-400">${parseFloat(item._price).toFixed(2)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setProductPicker(i)}
                      className="text-[10px] text-red-500 hover:text-red-600 font-medium transition-colors flex-shrink-0"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setProductPicker(i)}
                    className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gray-50/50 shadow-sm shadow-black/5 text-sm text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all text-left"
                  >
                    <FiSearch size={15} />
                    Select product...
                  </button>
                )}
                <input
                  className="w-20 rounded-2xl px-3 py-2.5 text-sm bg-gray-50/50 shadow-sm shadow-black/5 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all text-center"
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
          <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5"><FiCamera size={14} className="text-gray-400" /> Image</label>
          <div className="relative">
            {imagePreview ? (
              <div className="relative group">
                <img src={imagePreview} alt="" className="w-full aspect-video rounded-2xl object-cover shadow-sm" />
                <div className="absolute inset-0 bg-black/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button type="button" onClick={removeImage} className="p-2 bg-white/90 rounded-xl text-gray-700 hover:text-red-600 transition-colors shadow-sm">
                    <FiX size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full aspect-video rounded-2xl bg-gray-50/50 border-2 border-dashed border-gray-200 cursor-pointer hover:border-red-300 hover:bg-red-50/30 transition-all group">
                <FiCamera size={24} className="text-gray-300 group-hover:text-red-400 transition-colors" />
                <span className="text-xs text-gray-400 mt-2 group-hover:text-red-400 transition-colors">Upload bundle image</span>
                <input type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handleImage} className="hidden" />
              </label>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5"><FiGrid size={14} className="text-gray-400" /> Max Per Order</label>
            <input className="w-full rounded-2xl px-4 py-2.5 text-sm bg-gray-50/50 shadow-sm shadow-black/5 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all" name="maxPerOrder" type="number" placeholder="3" value={form.maxPerOrder} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5"><FiCalendar size={14} className="text-gray-400" /> Starts At</label>
            <DateTimePicker value={form.startsAt} onChange={(v) => setForm((p) => ({ ...p, startsAt: v }))} placeholder="Start date & time" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5"><FiCalendar size={14} className="text-gray-400" /> Expires At</label>
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
          <Link to="/bundles" className="px-6 py-2.5 rounded-2xl text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors">Cancel</Link>
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
