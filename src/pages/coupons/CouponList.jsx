import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useApiQuery, useApiMutation } from "../../api/adapter";
import PageBanner from "../../components/shared/PageBanner";
import StatCard from "../../components/shared/StatCard";
import {
  FiTag, FiPlus, FiEdit2, FiTrash2, FiPercent, FiDollarSign,
  FiUsers, FiToggleRight, FiAlertCircle,
} from "react-icons/fi";

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
      <div className="px-2 lg:px-6 py-6 space-y-6">
        <div className="h-24 bg-secondary rounded-2xl animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-28 bg-secondary rounded-2xl animate-pulse" />)}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-28 bg-secondary rounded-2xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="px-2 lg:px-6 py-6 space-y-6 max-w-[1400px] mx-auto">
      <PageBanner
        title="Coupons"
        subtitle={`${coupons?.length || 0} promotions`}
        routes={[{ label: "Coupons" }]}
        icon={FiTag}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard icon={FiTag} label="Total Coupons" value={stats.total} />
        <StatCard icon={FiToggleRight} label="Active" value={stats.active} />
        <StatCard icon={FiAlertCircle} label="Expired" value={stats.expired} trend={stats.expired > 0 ? "down" : "neutral"} />
        <StatCard icon={FiUsers} label="Exhausted" value={stats.exhausted} />
        <StatCard icon={FiPercent} label="Percentage" value={stats.percentage} />
        <StatCard icon={FiDollarSign} label="Fixed Amount" value={stats.fixed} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="flex justify-end"
      >
        <Link
          to="/coupons/new"
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-5 py-2.5 rounded-2xl font-medium text-sm hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-600/20"
        >
          <FiPlus size={16} />
          Add Coupon
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-5"
      >
        {coupons?.map((c, i) => (
          <motion.div
            key={c._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.07 + i * 0.04 }}
            whileHover={{ y: -3 }}
            className="bg-white rounded-2xl border border-secondary shadow-sm p-5 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-red-50/40 to-transparent rounded-bl-full" />
            <div className="flex items-start justify-between relative">
              <div className="flex items-center gap-4 min-w-0">
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0"
                >
                  {c.type === "percentage" ? <FiPercent size={20} className="text-primary" /> : <FiDollarSign size={20} className="text-primary" />}
                </motion.div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-lg text-ink truncate">{c.code}</p>
                    {c.isExpired && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600">Expired</span>}
                    {c.isExhausted && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-600">Exhausted</span>}
                    {!c.isActive && !c.isExpired && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-gray-500">Off</span>}
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {c.type === "percentage" ? `${c.value}% off` : `$${c.value} off`}
                    {c.minOrderAmount > 0 && ` · Min $${c.minOrderAmount}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Link to={`/coupons/${c._id}/edit`} className="p-2 rounded-xl hover:bg-secondary text-gray-400 hover:text-primary transition-colors" title="Edit">
                  <FiEdit2 size={15} />
                </Link>
                <button onClick={() => deleteCoupon(c._id)} className="p-2 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors" title="Delete">
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
