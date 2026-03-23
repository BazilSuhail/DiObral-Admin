import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useApiQuery, useApiMutation } from "../../api/adapter";
import PageBanner from "../../components/shared/PageBanner";
import StatCard from "../../components/shared/StatCard";
import {
  FiLayers, FiPlus, FiEdit2, FiTrash2, FiPercent, FiPackage,
  FiClock, FiToggleRight, FiToggleLeft, FiAlertCircle,
} from "react-icons/fi";

export default function BundleList() {
  const { data: bundles, isLoading } = useApiQuery("/bundles");
  const { mutate: deleteBundle } = useApiMutation(null, "DELETE", {
    mutationFn: (id) => import("../../api/client").then((m) => m.del(`/bundles/${id}`)),
  });

  const stats = {
    total: bundles?.length || 0,
    active: bundles?.filter((b) => b.isActive).length || 0,
    inactive: bundles?.filter((b) => !b.isActive && !b.isExpired).length || 0,
    expired: bundles?.filter((b) => b.isExpired).length || 0,
    scheduled: bundles?.filter((b) => b.isScheduled).length || 0,
    totalItems: bundles?.reduce((sum, b) => sum + (b.items?.length || 0), 0) || 0,
  };

  if (isLoading) {
    return (
      <div className="px-2 lg:px-6 py-6 space-y-6">
        <div className="h-24 bg-secondary rounded-2xl animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-28 bg-secondary rounded-2xl animate-pulse" />)}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-32 bg-secondary rounded-2xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="px-2 lg:px-6 py-6 space-y-6 max-w-[1400px] mx-auto">
      <PageBanner
        title="Bundles"
        subtitle={`${bundles?.length || 0} product bundles`}
        routes={[{ label: "Bundles" }]}
        icon={FiLayers}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard icon={FiLayers} label="Total Bundles" value={stats.total} />
        <StatCard icon={FiToggleRight} label="Active" value={stats.active} />
        <StatCard icon={FiToggleLeft} label="Inactive" value={stats.inactive} />
        <StatCard icon={FiAlertCircle} label="Expired" value={stats.expired} trend={stats.expired > 0 ? "down" : "neutral"} />
        <StatCard icon={FiClock} label="Scheduled" value={stats.scheduled} />
        <StatCard icon={FiPackage} label="Total Items" value={stats.totalItems} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="flex justify-end"
      >
        <Link
          to="/bundles/new"
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-5 py-2.5 rounded-2xl font-medium text-sm hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-600/20"
        >
          <FiPlus size={16} />
          New Bundle
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-5"
      >
        {bundles?.map((b, i) => {
          const savings = b.originalTotal - b.price;
          const savingsPercent = b.originalTotal > 0 ? Math.round((savings / b.originalTotal) * 100) : 0;

          return (
            <motion.div
              key={b._id}
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
                    <FiLayers size={20} className="text-primary" />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-lg text-ink truncate">{b.name}</p>
                      {savings > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 flex items-center gap-0.5">
                          <FiPercent size={10} />
                          {savingsPercent}%
                        </span>
                      )}
                      {b.isExpired && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600">Expired</span>}
                      {!b.isActive && !b.isExpired && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-gray-500">Off</span>}
                    </div>
                    <div className="flex items-center gap-2 text-sm mt-0.5">
                      <span className="font-semibold text-ink">${b.price}</span>
                      {b.originalTotal > b.price && (
                        <span className="text-gray-400 line-through">${b.originalTotal}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Link to={`/bundles/${b._id}/edit`} className="p-2 rounded-xl hover:bg-secondary text-gray-400 hover:text-primary transition-colors" title="Edit">
                    <FiEdit2 size={15} />
                  </Link>
                  <button onClick={() => deleteBundle(b._id)} className="p-2 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors" title="Delete">
                    <FiTrash2 size={15} />
                  </button>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <FiPackage size={12} />
                  {b.items?.length} items
                </span>
                <span>Stock: {b.stock}</span>
                {b.isScheduled && (
                  <span className="flex items-center gap-1">
                    <FiClock size={12} />
                    {new Date(b.startsAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
        {(!bundles || bundles.length === 0) && (
          <div className="col-span-full text-center py-16 text-gray-400">
            <FiLayers size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No bundles yet</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
