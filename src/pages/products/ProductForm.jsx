import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { useApiQuery, useApiMutation } from "../../api/adapter";
import { FiArrowLeft, FiSave, FiImage, FiDollarSign, FiGrid, FiHash } from "react-icons/fi";

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { data: product } = useApiQuery(isEdit ? `/retailer/products/${id}` : null);

  const { mutate, isPending } = useApiMutation(
    isEdit ? `/retailer/products/${id}` : "/retailer/products",
    isEdit ? "PUT" : "POST",
    { onSuccess: () => navigate("/products") }
  );

  const [form, setForm] = useState({
    name: "", description: "", price: "", sale: "", stock: "", category: "", size: "", tags: "",
  });
  const [mainImage, setMainImage] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        sale: product.sale || "",
        stock: product.stock || "",
        category: product.category?._id || "",
        size: product.size?.join(",") || "",
        tags: product.tags?.join(",") || "",
      });
    }
  }, [product]);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleImage = (e) => {
    const file = e.target.files[0];
    setMainImage(file);
    if (file) { const r = new FileReader(); r.onload = () => setPreview(r.result); r.readAsDataURL(file); }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (mainImage) fd.append("mainImage", mainImage);
    mutate(fd);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}>
        <Link to="/products" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-600 transition-colors">
          <FiArrowLeft size={14} />
          Back to Products
        </Link>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <h1 className="text-2xl font-bold text-gray-900">{isEdit ? "Edit Product" : "New Product"}</h1>
        <p className="text-sm text-gray-500 mt-0.5">{isEdit ? "Update your product" : "Add a product to your store"}</p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        onSubmit={handleSubmit}
        className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-md shadow-black/5 space-y-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
            <input className="w-full rounded-2xl px-4 py-2.5 text-sm bg-gray-50/50 shadow-sm shadow-black/5 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all placeholder:text-gray-400" name="name" placeholder="Cool T-Shirt" value={form.name} onChange={handleChange} required />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea className="w-full rounded-2xl px-4 py-2.5 text-sm bg-gray-50/50 shadow-sm shadow-black/5 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all resize-none" name="description" placeholder="Describe your product..." value={form.description} onChange={handleChange} rows={3} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5"><FiDollarSign size={14} /> Price</label>
            <input className="w-full rounded-2xl px-4 py-2.5 text-sm bg-gray-50/50 shadow-sm shadow-black/5 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all" name="price" type="number" step="0.01" placeholder="29.99" value={form.price} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5"><FiDollarSign size={14} /> Sale Price</label>
            <input className="w-full rounded-2xl px-4 py-2.5 text-sm bg-gray-50/50 shadow-sm shadow-black/5 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all" name="sale" type="number" step="0.01" placeholder="19.99" value={form.sale} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5"><FiGrid size={14} /> Stock</label>
            <input className="w-full rounded-2xl px-4 py-2.5 text-sm bg-gray-50/50 shadow-sm shadow-black/5 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all" name="stock" type="number" placeholder="50" value={form.stock} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5"><FiHash size={14} /> Category ID</label>
            <input className="w-full rounded-2xl px-4 py-2.5 text-sm bg-gray-50/50 shadow-sm shadow-black/5 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all" name="category" placeholder="64d..." value={form.category} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Sizes (csv)</label>
            <input className="w-full rounded-2xl px-4 py-2.5 text-sm bg-gray-50/50 shadow-sm shadow-black/5 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all" name="size" placeholder="S,M,L,XL" value={form.size} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags (csv)</label>
            <input className="w-full rounded-2xl px-4 py-2.5 text-sm bg-gray-50/50 shadow-sm shadow-black/5 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all" name="tags" placeholder="clothing,cotton" value={form.tags} onChange={handleChange} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5"><FiImage size={14} /> Image</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gray-50/50 shadow-sm shadow-black/5 cursor-pointer hover:bg-gray-100 transition-colors text-sm text-gray-500">
                <FiImage size={16} />
                Choose
                <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
              </label>
              {preview && <img src={preview} alt="" className="w-12 h-12 rounded-xl object-cover shadow-sm" />}
              {!preview && product?.image && <img src={`http://localhost:5000/uploads/${product.image}`} alt="" className="w-12 h-12 rounded-xl object-cover shadow-sm" />}
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
    </div>
  );
}
