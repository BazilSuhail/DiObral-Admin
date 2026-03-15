import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { useApiQuery, useApiMutation } from "../../api/adapter";
import { FiArrowLeft, FiSave, FiPercent, FiDollarSign } from "react-icons/fi";

export default function CouponForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { data: coupon } = useApiQuery(isEdit ? `/coupons/${id}` : null);

  const { mutate, isPending } = useApiMutation(
    isEdit ? `/coupons/${id}` : "/coupons",
    isEdit ? "PUT" : "POST",
    { onSuccess: () => navigate("/coupons") }
  );

  const [form, setForm] = useState({
    code: "", type: "percentage", value: "", minOrderAmount: "", maxDiscount: "", usageLimit: "", expiresAt: "", isActive: true,
  });

  useEffect(() => {
    if (coupon) {
      setForm({
        code: coupon.code || "",
        type: coupon.type || "percentage",
        value: coupon.value || "",
        minOrderAmount: coupon.minOrderAmount || "",
        maxDiscount: coupon.maxDiscount || "",
        usageLimit: coupon.usageLimit || "",
        expiresAt: coupon.expiresAt ? coupon.expiresAt.slice(0, 16) : "",
        isActive: coupon.isActive,
      });
    }
  }, [coupon]);

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [e.target.name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (!payload.code) delete payload.code;
    if (!payload.minOrderAmount) delete payload.minOrderAmount;
    if (!payload.maxDiscount) delete payload.maxDiscount;
    if (!payload.usageLimit) delete payload.usageLimit;
    if (!payload.expiresAt) delete payload.expiresAt;
    mutate(payload);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}>
        <Link to="/coupons" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-600 transition-colors">
          <FiArrowLeft size={14} />
          Back to Coupons
        </Link>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <h1 className="text-2xl font-bold text-gray-900">{isEdit ? "Edit Coupon" : "New Coupon"}</h1>
        <p className="text-sm text-gray-500 mt-0.5">{isEdit ? "Update your discount coupon" : "Create a promotion for your customers"}</p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        onSubmit={handleSubmit}
        className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-md shadow-black/5 space-y-6"
      >
        {!isEdit && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Coupon Code</label>
            <input className="w-full rounded-2xl px-4 py-2.5 text-sm bg-gray-50/50 shadow-sm shadow-black/5 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all placeholder:text-gray-400" name="code" placeholder="SAVE20 (auto if empty)" value={form.code} onChange={handleChange} />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Discount Type</label>
          <div className="flex gap-3">
            {["percentage", "fixed"].map((t) => (
              <label key={t} className={`flex-1 flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-medium cursor-pointer transition-all shadow-sm ${form.type === t ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md shadow-red-600/20" : "bg-gray-50/50 text-gray-500 hover:bg-gray-100"}`}>
                <input type="radio" name="type" value={t} checked={form.type === t} onChange={handleChange} className="hidden" />
                {t === "percentage" ? <><FiPercent size={16} /> Percentage</> : <><FiDollarSign size={16} /> Fixed</>}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{form.type === "percentage" ? "Discount % (1-100)" : "Discount Amount ($)"}</label>
          <input className="w-full rounded-2xl px-4 py-2.5 text-sm bg-gray-50/50 shadow-sm shadow-black/5 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all" name="value" type="number" step="0.01" placeholder={form.type === "percentage" ? "20" : "10.00"} value={form.value} onChange={handleChange} required />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Min Order ($)</label>
            <input className="w-full rounded-2xl px-4 py-2.5 text-sm bg-gray-50/50 shadow-sm shadow-black/5 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all" name="minOrderAmount" type="number" step="0.01" placeholder="50" value={form.minOrderAmount} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Max Discount ($)</label>
            <input className="w-full rounded-2xl px-4 py-2.5 text-sm bg-gray-50/50 shadow-sm shadow-black/5 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all" name="maxDiscount" type="number" step="0.01" placeholder="30" value={form.maxDiscount} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Usage Limit</label>
            <input className="w-full rounded-2xl px-4 py-2.5 text-sm bg-gray-50/50 shadow-sm shadow-black/5 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all" name="usageLimit" type="number" placeholder="100" value={form.usageLimit} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Expires At</label>
            <input className="w-full rounded-2xl px-4 py-2.5 text-sm bg-gray-50/50 shadow-sm shadow-black/5 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all" name="expiresAt" type="datetime-local" value={form.expiresAt} onChange={handleChange} />
          </div>
        </div>

        <label className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50/50 shadow-sm shadow-black/5 cursor-pointer hover:bg-gray-100/50 transition-colors">
          <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="w-4 h-4 rounded text-red-600 focus:ring-red-500" />
          <div>
            <span className="text-sm font-medium text-gray-700">Active</span>
            <p className="text-xs text-gray-400">Coupon will be available for customers</p>
          </div>
        </label>

        <div className="flex items-center gap-3 pt-2">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2.5 rounded-2xl font-medium text-sm hover:from-red-700 hover:to-red-800 disabled:opacity-50 transition-all shadow-lg shadow-red-600/20"
            disabled={isPending}
          >
            <FiSave size={16} />
            {isPending ? "Saving..." : isEdit ? "Update Coupon" : "Create Coupon"}
          </motion.button>
          <Link to="/coupons" className="px-6 py-2.5 rounded-2xl text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors">Cancel</Link>
        </div>
      </motion.form>
    </div>
  );
}
