import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useApiQuery } from "../../api/adapter";
import { FiShoppingCart, FiEye, FiFilter, FiDollarSign, FiCalendar } from "react-icons/fi";

const statusFilters = ["", "pending", "processing", "shipped", "delivered", "cancelled"];

export default function OrderList() {
  const [status, setStatus] = useState("");
  const { data: orders, isLoading } = useApiQuery("/retailer/orders", { status: status || undefined });

  if (isLoading) {
    return (
      <div className="p-6 space-y-5">
        <div className="h-8 w-48 bg-gray-200 rounded-xl animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-20 bg-gray-200 rounded-2xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500 mt-0.5">{orders?.length || 0} total orders</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <div className="flex items-center gap-2 flex-wrap">
          <FiFilter size={14} className="text-gray-400" />
          {statusFilters.map((s) => (
            <motion.button
              key={s}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setStatus(s)}
              className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all ${
                status === s
                  ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md shadow-red-600/20"
                  : "bg-white/80 text-gray-500 hover:bg-gray-100 shadow-sm shadow-black/5"
              }`}
            >
              {s ? s.charAt(0).toUpperCase() + s.slice(1) : "All"}
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="grid grid-cols-1 gap-4"
      >
        {orders?.map((o, i) => (
          <motion.div
            key={o._id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.04 }}
            whileHover={{ y: -2 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-md shadow-black/5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center"
                >
                  <FiShoppingCart size={18} className="text-red-600" />
                </motion.div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{o.customer?.fullName || "Guest"}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                    <span className="flex items-center gap-1">
                      <FiDollarSign size={11} />
                      ${o.total}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiCalendar size={11} />
                      {new Date(o.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                  o.status === "delivered" ? "bg-emerald-50 text-emerald-600" :
                  o.status === "pending" ? "bg-amber-50 text-amber-600" :
                  o.status === "shipped" ? "bg-blue-50 text-blue-600" :
                  o.status === "processing" ? "bg-purple-50 text-purple-600" :
                  o.status === "cancelled" ? "bg-red-50 text-red-600" :
                  "bg-gray-100 text-gray-600"
                }`}>
                  {o.status}
                </span>
                <Link
                  to={`/orders/${o._id}`}
                  className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <FiEye size={16} />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
        {(!orders || orders.length === 0) && (
          <div className="text-center py-16 text-gray-400">
            <FiShoppingCart size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No orders found</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
