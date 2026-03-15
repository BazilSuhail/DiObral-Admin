import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { useApiQuery, useApiMutation } from "../../api/adapter";
import { FiArrowLeft, FiSave, FiPlus, FiX, FiPackage, FiDollarSign } from "react-icons/fi";

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
    name: "", description: "", price: "", stock: "", image: "", startsAt: "", expiresAt: "", maxPerOrder: "", tags: "",
  });
  const [items, setItems] = useState([{ product: "", quantity: 1 }]);

  useEffect(() => {
    if (bundle) {
      setForm({
        name: bundle.name || "",
        description: bundle.description || "",
        price: bundle.price || "",
        stock: bundle.stock || "",
        image: bundle.image || "",
        startsAt: bundle.startsAt ? bundle.startsAt.slice(0, 16) : "",
        expiresAt: bundle.expiresAt ? bundle.expiresAt.slice(0, 16) : "",
        maxPerOrder: bundle.maxPerOrder || "",
        tags: bundle.tags?.join(",") || "",
      });
      setItems(bundle.items?.map((i) => ({ product: i.product?._id || "", quantity: i.quantity })) || [{ product: "", quantity: 1 }]);
    }
  }, [bundle]);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const addItem = () => setItems((prev) => [...prev, { product: "", quantity: 1 }]);
  const updateItem = (i, field, value) => setItems((prev) => prev.map((item, idx) => idx === i ? { ...item, [field]: value } : item));
  const removeItem = (i) => setItems((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({ ...form, items: items.filter((i) => i.product), tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : [] });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
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

      <motion.form
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        onSubmit={handleSubmit}
        className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-md shadow-black/5 space-y-5"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
          <input className="w-full rounded-2xl px-4 py-2.5 text-sm bg-gray-50/50 shadow-sm shadow-black/5 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all placeholder:text-gray-400" name="name" placeholder="Summer Starter Pack" value={form.name} onChange={handleChange} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
          <textarea className="w-full rounded-2xl px-4 py-2.5 text-sm bg-gray-50/50 shadow-sm shadow-black/5 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all resize-none" name="description" placeholder="Describe the bundle..." value={form.description} onChange={handleChange} rows={2} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5"><FiDollarSign size={14} /> Price</label>
            <input className="w-full rounded-2xl px-4 py-2.5 text-sm bg-gray-50/50 shadow-sm shadow-black/5 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all" name="price" type="number" step="0.01" placeholder="59.99" value={form.price} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5"><FiPackage size={14} /> Stock</label>
            <input className="w-full rounded-2xl px-4 py-2.5 text-sm bg-gray-50/50 shadow-sm shadow-black/5 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all" name="stock" type="number" placeholder="10" value={form.stock} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Image URL</label>
            <input className="w-full rounded-2xl px-4 py-2.5 text-sm bg-gray-50/50 shadow-sm shadow-black/5 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all" name="image" placeholder="https://..." value={form.image} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Max Per Order</label>
            <input className="w-full rounded-2xl px-4 py-2.5 text-sm bg-gray-50/50 shadow-sm shadow-black/5 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all" name="maxPerOrder" type="number" placeholder="3" value={form.maxPerOrder} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Starts At</label>
            <input className="w-full rounded-2xl px-4 py-2.5 text-sm bg-gray-50/50 shadow-sm shadow-black/5 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all" name="startsAt" type="datetime-local" value={form.startsAt} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Expires At</label>
            <input className="w-full rounded-2xl px-4 py-2.5 text-sm bg-gray-50/50 shadow-sm shadow-black/5 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all" name="expiresAt" type="datetime-local" value={form.expiresAt} onChange={handleChange} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags</label>
          <input className="w-full rounded-2xl px-4 py-2.5 text-sm bg-gray-50/50 shadow-sm shadow-black/5 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all" name="tags" placeholder="summer,bundle" value={form.tags} onChange={handleChange} />
        </div>

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
                <input
                  className="flex-1 rounded-2xl px-4 py-2.5 text-sm bg-gray-50/50 shadow-sm shadow-black/5 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all placeholder:text-gray-400"
                  placeholder="Product ID"
                  value={item.product}
                  onChange={(e) => updateItem(i, "product", e.target.value)}
                  required
                />
                <input
                  className="w-20 rounded-2xl px-3 py-2.5 text-sm bg-gray-50/50 shadow-sm shadow-black/5 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all text-center"
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => updateItem(i, "quantity", Number(e.target.value))}
                  required
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
    </div>
  );
}
