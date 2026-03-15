import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { useApiQuery, useApiMutation } from "../../api/adapter";
import { FiArrowLeft, FiPackage, FiTruck, FiMapPin, FiCreditCard, FiUser, FiCalendar } from "react-icons/fi";
import { statusBadge } from "../../lib/utils";

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: order, isLoading } = useApiQuery(`/retailer/orders/${id}`);
  const [newStatus, setNewStatus] = useState("");
  const [tracking, setTracking] = useState("");

  const { mutate: updateStatus, isPending } = useApiMutation(`/retailer/orders/${id}/status`, "PATCH", {
    onSuccess: () => navigate("/orders"),
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-5">
        <div className="h-8 w-48 bg-gray-200 rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-gray-200 rounded-2xl animate-pulse" />
          <div className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!order) return <div className="p-6 text-gray-500">Order not found</div>;

  const handleUpdate = () => {
    if (!newStatus) return;
    updateStatus({ status: newStatus, trackingNumber: tracking || undefined });
  };

  return (
    <div className="p-6 max-w-5xl space-y-6">
      <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}>
        <Link to="/orders" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-600 transition-colors">
          <FiArrowLeft size={14} />
          Back to Orders
        </Link>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order #{order._id.slice(-8).toUpperCase()}</h1>
          <p className="text-sm text-gray-400 mt-0.5 flex items-center gap-1.5">
            <FiCalendar size={13} />
            {new Date(order.createdAt).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
        <span className={`inline-flex items-center px-3.5 py-1.5 rounded-xl text-sm font-medium capitalize shadow-sm ${statusBadge(order.status)}`}>
          {order.status}
        </span>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-md shadow-black/5"
          >
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiPackage size={16} className="text-red-600" />
              Items
            </h2>
            <div className="space-y-3">
              {order.items?.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.04 }}
                  className="flex items-center gap-4 p-3 rounded-2xl bg-gray-50/50"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white overflow-hidden shadow-sm flex-shrink-0">
                    {item.image ? (
                      <img src={`http://localhost:5000/uploads/${item.image}`} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300"><FiPackage size={22} /></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity} {item.size && `· ${item.size}`}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">${(item.discountedPrice * item.quantity).toFixed(2)}</p>
                    {item.discountedPrice < item.price && (
                      <p className="text-xs text-gray-400 line-through">${(item.price * item.quantity).toFixed(2)}</p>
                    )}
                  </div>
                </motion.div>
              ))}
              <div className="flex justify-between items-center pt-4">
                <span className="text-sm text-gray-500">Total</span>
                <div className="text-right">
                  <span className="text-xl font-bold text-gray-900">${order.total}</span>
                  {order.totalSavings > 0 && (
                    <p className="text-xs text-emerald-600">Saved ${order.totalSavings.toFixed(2)}</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-md shadow-black/5"
          >
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiTruck size={16} className="text-red-600" />
              Update Status
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full rounded-2xl px-4 py-2.5 text-sm bg-gray-50/50 shadow-sm shadow-black/5 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
              >
                <option value="">Select status</option>
                {["pending", "processing", "shipped", "delivered", "cancelled"].map((s) => (
                  <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
              <input
                className="w-full rounded-2xl px-4 py-2.5 text-sm bg-gray-50/50 shadow-sm shadow-black/5 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                placeholder="Tracking number"
                value={tracking}
                onChange={(e) => setTracking(e.target.value)}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleUpdate}
              disabled={!newStatus || isPending}
              className="mt-3 w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-2.5 rounded-2xl font-medium text-sm hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-red-600/20"
            >
              {isPending ? "Updating..." : "Update Status"}
            </motion.button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-md shadow-black/5">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiUser size={16} className="text-red-600" />
              Customer
            </h2>
            <div className="space-y-3">
              {[
                { label: "Name", value: order.customer?.fullName },
                { label: "Email", value: order.customer?.email },
                { label: "Contact", value: order.customer?.contact },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="text-sm font-medium text-gray-900">{value || "—"}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-md shadow-black/5">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiMapPin size={16} className="text-red-600" />
              Shipping
            </h2>
            {order.shippingAddress ? (
              <div className="text-sm text-gray-600 space-y-1">
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-400">Not provided</p>
            )}
          </div>

          {order.trackingNumber && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-md shadow-black/5">
              <h2 className="font-semibold text-gray-900 mb-2">Tracking</h2>
              <p className="text-sm font-mono bg-gray-50 rounded-xl px-3 py-2 text-gray-700">{order.trackingNumber}</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
