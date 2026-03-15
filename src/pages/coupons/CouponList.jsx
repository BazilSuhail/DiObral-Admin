import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useApiQuery, useApiMutation } from "../../api/adapter";
import { FiTag, FiPlus, FiEdit2, FiTrash2, FiPercent, FiDollarSign, FiUsers, FiToggleRight, FiAlertCircle } from "react-icons/fi";

const statCards = [
  { key: "total", label: "Total Coupons", icon: FiTag, color: "from-blue-500 to-blue-600" },
  { key: "active", label: "Active", icon: FiToggleRight, color: "from-emerald-500 to-emerald-600" },
  { key: "expired", label: "Expired", icon: FiAlertCircle, color: "from-red-500 to-red-600" },
  { key: "exhausted", label: "Exhausted", icon: FiUsers, color: "from-amber-500 to-amber-600" },
  { key: "percentage", label: "Percentage", icon: FiPercent, color: "from-violet-500 to-violet-600" },
  { key: "fixed", label: "Fixed Amount", icon: FiDollarSign, color: "from-cyan-500 to-cyan-600" },
];

export default function CouponList() {
  const { data: coupons, isLoading } = useApiQuery("/coupons");
  const { mutate: deleteCoupon } = useApiMutation(null, "DELETE", {
    mutationFn: (id) => import("../../api/client").then((m) => m.del(`/coupons/${id}`)),
  });

  const stats = {
    total: coupons?.length || 0,
    active: coupons?.filter((c) => c.isActive).length || 0,
    expired: coupons?.filter((c) => c.isExpired).length || 0,
    exhausted: coupons?.filter((c) => c.isExhausted).length || 0,
    percentage: coupons?.filter((c) => c.type === "percentage").length || 0,
    fixed: coupons?.filter((c) => c.type === "fixed").length || 0,
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-5">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {statCards.map((s) => <div key={s.key} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
        <div className="h-8 w-48 bg-gray-200 rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-28 bg-gray-200 rounded-2xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
          <p className="text-sm text-gray-500 mt-0.5">{coupons?.length || 0} promotions</p>
        </div>
        <Link to="/coupons/new" className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-5 py-2.5 rounded-2xl font-medium text-sm hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-600/20">
          <FiPlus size={16} />
          Add Coupon
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        {statCards.map(({ key, label, icon: Icon, color }) => (
          <div key={key} className="bg-white rounded-2xl p-4 shadow-sm shadow-black/5 flex items-start gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md flex-shrink-0`}>
              <Icon size={17} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-400 font-medium">{label}</p>
              <p className="text-lg font-bold text-gray-900 mt-0.5">{stats[key]}</p>
            </div>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-5"
      >
        {coupons?.map((c, i) => (
          <motion.div
            key={c._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.07 + i * 0.04 }}
            whileHover={{ y: -3 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-md shadow-black/5 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-red-50/30 to-transparent rounded-bl-full" />
            <div className="flex items-start justify-between relative">
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center shadow-sm"
                >
                  {c.type === "percentage" ? <FiPercent size={20} className="text-red-600" /> : <FiDollarSign size={20} className="text-red-600" />}
                </motion.div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-lg text-gray-900">{c.code}</p>
                    {c.isExpired && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600">Expired</span>}
                    {c.isExhausted && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-600">Exhausted</span>}
                    {!c.isActive && !c.isExpired && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">Off</span>}
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {c.type === "percentage" ? `${c.value}% off` : `$${c.value} off`}
                    {c.minOrderAmount > 0 && ` · Min $${c.minOrderAmount}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Link to={`/coupons/${c._id}/edit`} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-red-600 transition-colors">
                  <FiEdit2 size={15} />
                </Link>
                <button onClick={() => deleteCoupon(c._id)} className="p-2 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors">
                  <FiTrash2 size={15} />
                </button>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <FiUsers size={12} />
                {c.usedCount}/{c.usageLimit || "∞"} used
              </span>
              {c.expiresAt && (
                <span>Until {new Date(c.expiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
              )}
            </div>
          </motion.div>
        ))}
        {(!coupons || coupons.length === 0) && (
          <div className="col-span-full text-center py-16 text-gray-400">
            <FiTag size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No coupons yet</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
