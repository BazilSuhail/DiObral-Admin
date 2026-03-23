import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useApiQuery } from "../../api/adapter";
import PageBanner from "../../components/shared/PageBanner";
import StatCard from "../../components/shared/StatCard";
import {
  FiShoppingCart, FiDollarSign, FiCalendar,
  FiClock, FiCheckCircle, FiTruck, FiChevronRight,
} from "react-icons/fi";

const statusFilters = ["", "pending", "processing", "shipped", "delivered", "cancelled"];

const statusPill = {
  pending: "bg-amber-50 text-amber-600",
  processing: "bg-primary/10 text-primary",
  shipped: "bg-blue-50 text-blue-600",
  delivered: "bg-emerald-50 text-emerald-600",
  cancelled: "bg-red-50 text-red-600",
  default: "bg-secondary text-gray-500",
};

const StatSkeleton = () => <div className="h-28 bg-secondary rounded-2xl animate-pulse" />;
const TileSkeleton = () => <div className="h-32 bg-secondary rounded-2xl animate-pulse" />;

export default function OrderList() {
  const [status, setStatus] = useState("");
  const { data: orders, isLoading } = useApiQuery("/retailer/orders", { status: status || undefined });

  const totalRevenue = orders?.reduce((s, o) => s + (o.total || 0), 0) || 0;
  const pendingCount = orders?.filter((o) => o.status === "pending").length || 0;
  const deliveredCount = orders?.filter((o) => o.status === "delivered").length || 0;

  return (
    <div className="px-2 lg:px-6 py-6 space-y-6 max-w-[1400px] mx-auto">
      <PageBanner
        title="Orders"
        subtitle={`${orders?.length || 0} total orders`}
        routes={[{ label: "Orders" }]}
        icon={FiShoppingCart}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <>
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </>
        ) : (
          <>
            <StatCard icon={FiShoppingCart} label="Orders" value={orders?.length || 0} />
            <StatCard icon={FiDollarSign} label="Revenue" value={`$${totalRevenue.toLocaleString()}`} />
            <StatCard icon={FiClock} label="Pending" value={pendingCount} />
            <StatCard icon={FiCheckCircle} label="Delivered" value={deliveredCount} />
          </>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="flex items-center gap-2 flex-wrap"
      >
        {statusFilters.map((s) => (
          <motion.button
            key={s}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setStatus(s)}
            className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all ${
              status === s
                ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md shadow-red-600/20"
                : "bg-white border border-secondary text-gray-500 hover:bg-secondary shadow-sm"
            }`}
          >
            {s ? s.charAt(0).toUpperCase() + s.slice(1) : "All"}
          </motion.button>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        {isLoading ? (
          [1, 2, 3, 4, 5, 6, 7, 8].map((i) => <TileSkeleton key={i} />)
        ) : orders?.length ? (
          orders.map((o, i) => (
            <motion.div
              key={o._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 + i * 0.04 }}
              whileHover={{ y: -3 }}
              className="h-full"
            >
              <Link to={`/orders/${o._id}`} className="block h-full">
                <div className="bg-white rounded-2xl border border-secondary shadow-sm p-4 h-full flex flex-col gap-2.5 hover:border-primary/30 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-semibold text-gray-500">#{o._id.slice(-8).toUpperCase()}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium capitalize ${statusPill[o.status] || statusPill.default}`}>
                      {o.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FiShoppingCart size={14} className="text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink truncate">{o.customer?.fullName || "Guest"}</p>
                      <p className="text-[11px] text-gray-400">{o.items?.length || 0} items</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-1 border-t border-secondary">
                    <span className="text-sm font-bold text-ink">${o.total}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-gray-400 flex items-center gap-1">
                        <FiCalendar size={11} />
                        {new Date(o.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                      <FiChevronRight size={14} className="text-gray-300" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-16 text-gray-400">
            <FiTruck size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No orders found</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
