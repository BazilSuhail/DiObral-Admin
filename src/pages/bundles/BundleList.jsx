import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useApiQuery, useApiMutation } from "../../api/adapter";
import { FiLayers, FiPlus, FiEdit2, FiTrash2, FiPercent, FiPackage, FiClock } from "react-icons/fi";

export default function BundleList() {
  const { data: bundles, isLoading } = useApiQuery("/bundles");
  const { mutate: deleteBundle } = useApiMutation(null, "DELETE", {
    mutationFn: (id) => import("../../api/client").then((m) => m.del(`/bundles/${id}`)),
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-5">
        <div className="h-8 w-48 bg-gray-200 rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-32 bg-gray-200 rounded-2xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bundles</h1>
          <p className="text-sm text-gray-500 mt-0.5">{bundles?.length || 0} product bundles</p>
        </div>
        <Link to="/bundles/new" className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-5 py-2.5 rounded-2xl font-medium text-sm hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-600/20">
          <FiPlus size={16} />
          New Bundle
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
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
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-md shadow-black/5 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-50/30 to-transparent rounded-bl-full" />
              <div className="flex items-start justify-between relative">
                <div className="flex items-center gap-4">
                  <motion.div
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center shadow-sm"
                  >
                    <FiLayers size={20} className="text-red-600" />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-lg text-gray-900 truncate">{b.name}</p>
                      {savings > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 flex items-center gap-0.5">
                          <FiPercent size={10} />
                          {savingsPercent}%
                        </span>
                      )}
                      {b.isExpired && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600">Expired</span>}
                      {!b.isActive && !b.isExpired && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">Off</span>}
                    </div>
                    <div className="flex items-center gap-2 text-sm mt-0.5">
                      <span className="font-semibold text-gray-900">${b.price}</span>
                      {b.originalTotal > b.price && (
                        <span className="text-gray-400 line-through">${b.originalTotal}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Link to={`/bundles/${b._id}/edit`} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-red-600 transition-colors">
                    <FiEdit2 size={15} />
                  </Link>
                  <button onClick={() => deleteBundle(b._id)} className="p-2 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors">
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
