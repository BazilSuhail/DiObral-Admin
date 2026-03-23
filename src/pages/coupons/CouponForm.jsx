import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { useApiQuery, useApiMutation } from "../../api/adapter";
import { FiArrowLeft, FiSave, FiPercent, FiDollarSign, FiHash, FiGrid, FiCalendar, FiTag, FiX, FiMessageSquare, FiRefreshCw } from "react-icons/fi";
import DateTimePicker from "../../components/shared/DateTimePicker";

const inputCls = "w-full rounded-2xl px-4 py-2.5 text-sm bg-white border border-secondary shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400";
const labelCls = "block text-sm font-medium text-ink mb-1.5 flex items-center gap-1.5";
const iconCls = "text-primary";

export default function CouponForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { data: coupon } = useApiQuery(isEdit ? `/coupons/${id}` : null);
  const { data: store } = useApiQuery("/retailer/store");

  const { mutate, isPending } = useApiMutation(
    isEdit ? `/coupons/${id}` : "/coupons",
    isEdit ? "PUT" : "POST",
    { onSuccess: () => navigate("/coupons") }
  );

  const [showGuide, setShowGuide] = useState(true);
  const [form, setForm] = useState({
    code: "", type: "percentage", value: "", minOrderAmount: "", maxDiscount: "", usageLimit: "", expiresAt: "", isActive: true, notes: "",
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
        notes: coupon.notes || "",
      });
    }
  }, [coupon]);

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [e.target.name]: value }));
  };

  const randomGroup = (len) => {
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
    return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  };

  const generateCode = () => {
    const prefix = (store?.storeName || "STORE").toUpperCase().replace(/[^A-Z0-9]+/g, "").slice(0, 8) || "STORE";
    setForm((prev) => ({ ...prev, code: `${prefix}-${randomGroup(4)}-${randomGroup(4)}` }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (!payload.code) delete payload.code;
    if (!payload.minOrderAmount) delete payload.minOrderAmount;
    if (!payload.maxDiscount) delete payload.maxDiscount;
    if (!payload.usageLimit) delete payload.usageLimit;
    if (!payload.expiresAt) delete payload.expiresAt;
    if (!payload.notes) delete payload.notes;
    mutate(payload);
  };

  return (
    <div className="px-2 lg:px-6 py-6 space-y-6 max-w-[1400px] mx-auto">
      <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}>
        <Link to="/coupons" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-primary transition-colors">
          <FiArrowLeft size={14} />
          Back to Coupons
        </Link>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <h1 className="text-2xl font-bold text-ink">{isEdit ? "Edit Coupon" : "New Coupon"}</h1>
        <p className="text-sm text-gray-500 mt-0.5">{isEdit ? "Update your discount coupon" : "Create a promotion for your customers"}</p>
      </motion.div>

      {showGuide && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-secondary/60 border border-secondary rounded-2xl p-4 flex items-start gap-3 shadow-sm"
        >
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <FiTag size={16} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0 text-sm text-ink space-y-1">
            <p className="font-medium">Coupon guide</p>
            <ul className="list-disc list-inside space-y-0.5 text-gray-500 text-xs">
              <li>Pick a Discount Type — <strong>Percentage</strong> (% off) or <strong>Fixed</strong> ($ off).</li>
              <li>The code is auto-generated if you leave it empty.</li>
              <li>Set a Usage Limit to control how many times it can be used.</li>
              <li>Use Min Order / Max Discount to add purchase conditions.</li>
              <li>Deactivate the toggle if the coupon should not be live yet.</li>
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
            {!isEdit && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className={labelCls.replace(" mb-1.5", "")}><FiHash size={14} className={iconCls} /> Coupon Code</label>
                  <button
                    type="button"
                    onClick={generateCode}
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-red-700 transition-colors"
                  >
                    <FiRefreshCw size={11} />
                    Generate
                  </button>
                </div>
                <input className={`${inputCls} font-mono uppercase`} name="code" placeholder={`${(store?.storeName || "STORE").toUpperCase().replace(/[^A-Z0-9]+/g, "").slice(0, 8) || "STORE"}-XXXX-XXXX`} value={form.code} onChange={handleChange} />
                <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1"><FiHash size={10} /> Store-based code with dashes, e.g. {`${(store?.storeName || "STORE").toUpperCase().replace(/[^A-Z0-9]+/g, "").slice(0, 8) || "STORE"}-X7K2-9QPL`}</p>
              </div>
            )}

            <div>
              <label className={`${labelCls} mb-2`}><FiTag size={14} className={iconCls} /> Discount Type</label>
              <div className="flex gap-3">
                {["percentage", "fixed"].map((t) => (
                  <label key={t} className={`flex-1 flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-medium cursor-pointer transition-all shadow-sm ${form.type === t ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md shadow-red-600/20" : "bg-white border border-secondary text-gray-500 hover:bg-secondary"}`}>
                    <input type="radio" name="type" value={t} checked={form.type === t} onChange={handleChange} className="hidden" />
                    {t === "percentage" ? <><FiPercent size={16} /> Percentage</> : <><FiDollarSign size={16} /> Fixed</>}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className={labelCls}><FiDollarSign size={14} className={iconCls} /> {form.type === "percentage" ? "Discount % (1-100)" : "Discount Amount ($)"}</label>
              <input className={inputCls} name="value" type="number" step="0.01" placeholder={form.type === "percentage" ? "20" : "10.00"} value={form.value} onChange={handleChange} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}><FiDollarSign size={14} className={iconCls} /> Min Order ($)</label>
                <input className={inputCls} name="minOrderAmount" type="number" step="0.01" placeholder="50" value={form.minOrderAmount} onChange={handleChange} />
              </div>
              <div>
                <label className={labelCls}><FiDollarSign size={14} className={iconCls} /> Max Discount ($)</label>
                <input className={inputCls} name="maxDiscount" type="number" step="0.01" placeholder="30" value={form.maxDiscount} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className={labelCls}><FiGrid size={14} className={iconCls} /> Usage Limit</label>
              <input className={inputCls} name="usageLimit" type="number" placeholder="100" value={form.usageLimit} onChange={handleChange} />
            </div>
            <div>
              <label className={labelCls}><FiCalendar size={14} className={iconCls} /> Expires At</label>
              <DateTimePicker value={form.expiresAt} onChange={(v) => setForm((p) => ({ ...p, expiresAt: v }))} placeholder="Expiry date & time" />
            </div>
            <label className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-secondary shadow-sm cursor-pointer hover:bg-secondary/60 transition-colors">
              <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="w-4 h-4 rounded text-red-600 focus:ring-red-500" />
              <div>
                <span className="text-sm font-medium text-ink">Active</span>
                <p className="text-xs text-gray-400">Coupon will be available for customers</p>
              </div>
            </label>
            <div>
              <label className={labelCls}><FiMessageSquare size={14} className={iconCls} /> Retailer Notes</label>
              <textarea className={`${inputCls} resize-none`} name="notes" placeholder="Internal note about this coupon (not shown to customers)..." value={form.notes} onChange={handleChange} rows={3} />
              <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1"><FiMessageSquare size={10} /> Private note for your own reference.</p>
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
            {isPending ? "Saving..." : isEdit ? "Update Coupon" : "Create Coupon"}
          </motion.button>
          <Link to="/coupons" className="px-6 py-2.5 rounded-2xl text-sm font-medium text-gray-500 hover:bg-secondary transition-colors">Cancel</Link>
        </div>
      </motion.form>
    </div>
  );
}
