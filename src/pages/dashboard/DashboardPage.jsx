import { motion } from "motion/react";
import { useApiQuery } from "../../api/adapter";
import {
  FiPackage, FiClock, FiDollarSign, FiStar, FiTrendingUp,
  FiShoppingCart, FiArrowUp, FiArrowDown, FiUsers,
} from "react-icons/fi";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const { data, isLoading } = useApiQuery("/retailer/dashboard");

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const { products, orders, revenue, topProducts, ratings, trends } = data || {};

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Your store at a glance</p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        <StatCard
          icon={FiPackage}
          label="Products"
          value={products?.total}
          change="+3 this month"
          trend="up"
          gradient="from-red-500 to-red-600"
          shadow="shadow-red-600/20"
        />
        <StatCard
          icon={FiClock}
          label="Pending Orders"
          value={orders?.pending}
          change={`${orders?.processing || 0} processing`}
          trend="neutral"
          gradient="from-amber-500 to-amber-600"
          shadow="shadow-amber-600/20"
        />
        <StatCard
          icon={FiDollarSign}
          label="30d Revenue"
          value={`$${revenue?.total30d?.toFixed(2) || "0.00"}`}
          change={`${revenue?.orders30d || 0} orders`}
          trend="up"
          gradient="from-emerald-500 to-emerald-600"
          shadow="shadow-emerald-600/20"
        />
        <StatCard
          icon={FiStar}
          label="Avg Rating"
          value={ratings?.average?.toFixed(1) || "—"}
          change={`${ratings?.total || 0} reviews`}
          trend={ratings?.average >= 4 ? "up" : "neutral"}
          gradient="from-violet-500 to-violet-600"
          shadow="shadow-violet-600/20"
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-md shadow-black/5"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <FiShoppingCart size={16} className="text-red-600" />
              Recent Orders
            </h2>
            <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">Last 5</span>
          </div>
          <div className="space-y-2">
            {orders?.recent?.slice(0, 5).map((o, i) => (
              <motion.div
                key={o._id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.05 }}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center"
                  >
                    <FiShoppingCart size={15} className="text-red-600" />
                  </motion.div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">{o.customer?.fullName || "Guest"}</p>
                    <p className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-900">${o.total}</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${
                    o.status === "delivered" ? "bg-emerald-50 text-emerald-600" :
                    o.status === "pending" ? "bg-amber-50 text-amber-600" :
                    o.status === "shipped" ? "bg-blue-50 text-blue-600" :
                    o.status === "processing" ? "bg-purple-50 text-purple-600" :
                    "bg-gray-100 text-gray-600"
                  }`}>
                    {o.status}
                  </span>
                </div>
              </motion.div>
            ))}
            {(!orders?.recent || orders.recent.length === 0) && (
              <p className="text-sm text-gray-400 text-center py-8">No orders yet</p>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="space-y-6"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-md shadow-black/5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <FiTrendingUp size={16} className="text-red-600" />
                Top Products
              </h2>
            </div>
            <div className="space-y-4">
              {topProducts?.slice(0, 4).map((p, i) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.06 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden flex-shrink-0 shadow-sm">
                    {p.image ? (
                      <img src={`http://localhost:5000/uploads/${p.image}`} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-bold">#{i + 1}</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">{p.name}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>{p.quantitySold} sold</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      <span>${p.revenue?.toFixed?.(0) || p.revenue}</span>
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-gray-400">#{i + 1}</div>
                </motion.div>
              ))}
              {(!topProducts || topProducts.length === 0) && (
                <p className="text-sm text-gray-400 text-center py-4">No sales yet</p>
              )}
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-md shadow-black/5">
            <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FiPackage size={16} className="text-red-600" />
              Low Stock
            </h2>
            {products?.lowStockItems?.length > 0 ? (
              <div className="space-y-2.5">
                {products.lowStockItems.map((item, i) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-600 truncate">{item.name}</span>
                    <motion.span
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
                      className="text-sm font-semibold text-red-600"
                    >
                      {item.stock}
                    </motion.span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">All stocked up</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, change, trend, gradient, shadow }) {
  return (
    <motion.div
      variants={item}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-md shadow-black/5 border border-white/50 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gray-50/50 to-transparent rounded-bl-full" />
      <div className="flex items-start justify-between relative">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value ?? "—"}</p>
          {change && (
            <div className="flex items-center gap-1 text-xs">
              {trend === "up" && <FiArrowUp size={11} className="text-emerald-500" />}
              {trend === "down" && <FiArrowDown size={11} className="text-red-500" />}
              <span className={trend === "up" ? "text-emerald-600" : trend === "down" ? "text-red-600" : "text-gray-400"}>
                {change}
              </span>
            </div>
          )}
        </div>
        <motion.div
          whileHover={{ rotate: 15, scale: 1.1 }}
          className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg ${shadow}`}
        >
          <Icon size={18} className="text-white" />
        </motion.div>
      </div>
    </motion.div>
  );
}
