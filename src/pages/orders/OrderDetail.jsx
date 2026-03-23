import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { useApiQuery, useApiMutation } from "../../api/adapter";
import { useGlobalStore } from "../../store/globalStore";
import {
  FiArrowLeft, FiPackage, FiTruck, FiMapPin, FiCreditCard, FiUser, FiCalendar, FiMessageSquare, FiRefreshCw,
} from "react-icons/fi";
import { statusBadge } from "../../lib/utils";

const inputCls = "w-full rounded-2xl px-4 py-2.5 text-sm bg-white border border-secondary shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400";

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useGlobalStore((s) => s.user);
  const { data: order, isLoading } = useApiQuery(`/retailer/orders/${id}`);
  const { data: store } = useApiQuery("/retailer/store");
  const [newStatus, setNewStatus] = useState("");
  const [tracking, setTracking] = useState("");

  const { mutate: updateStatus, isPending } = useApiMutation(`/retailer/orders/${id}/status`, "PATCH", {
    onSuccess: () => navigate("/orders"),
  });

  const generateTracking = () => {
    const storePart = (store?._id || user?._id || "STORE").slice(-6).toUpperCase();
    const timePart = Date.now().toString(36).toUpperCase();
    const randomPart = Math.random().toString(36).slice(2, 7).toUpperCase();
    setTracking(`TRK-${storePart}-${timePart}${randomPart}`);
  };

  if (isLoading) {
    return (
      <div className="px-2 lg:px-6 py-6 space-y-6">
        <div className="h-8 w-48 bg-secondary rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-secondary rounded-2xl animate-pulse" />
          <div className="h-64 bg-secondary rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!order) return <div className="px-2 lg:px-6 py-6 text-gray-500">Order not found</div>;

  const handleUpdate = () => {
    if (!newStatus) return;
    updateStatus({ status: newStatus, trackingNumber: tracking || undefined });
  };

  return (
    <div className="px-2 lg:px-6 py-6 space-y-6 max-w-[1400px] mx-auto">
      <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}>
        <Link to="/orders" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-primary transition-colors">
          <FiArrowLeft size={14} />
          Back to Orders
        </Link>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Order #{order._id.slice(-8).toUpperCase()}</h1>
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
            className="bg-white rounded-2xl border border-secondary shadow-sm p-6"
          >
            <h2 className="font-semibold text-ink mb-4 flex items-center gap-2">
              <FiPackage size={16} className="text-primary" />
              Items
            </h2>
            <div className="space-y-3">
              {order.items?.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.04 }}
                  className="flex items-center gap-4 p-3 rounded-2xl bg-secondary/60"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white overflow-hidden shadow-sm flex-shrink-0 border border-secondary">
                    {item.image ? (
                      <img src={`${import.meta.env.VITE_API_BASE_URL}/uploads/${item.image}`} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300"><FiPackage size={22} /></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity} {item.size && `· ${item.size}`}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-ink">${(item.discountedPrice * item.quantity).toFixed(2)}</p>
                    {item.discountedPrice < item.price && (
                      <p className="text-xs text-gray-400 line-through">${(item.price * item.quantity).toFixed(2)}</p>
                    )}
                  </div>
                </motion.div>
              ))}
              <div className="flex justify-between items-center pt-4">
                <span className="text-sm text-gray-500">Total</span>
                <div className="text-right">
                  <span className="text-xl font-bold text-ink">${order.total}</span>
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
            className="bg-white rounded-2xl border border-secondary shadow-sm p-6"
          >
            <h2 className="font-semibold text-ink mb-4 flex items-center gap-2">
              <FiTruck size={16} className="text-primary" />
              Update Status
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className={inputCls}
              >
                <option value="">Select status</option>
                {["pending", "processing", "shipped", "delivered", "cancelled"].map((s) => (
                  <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-gray-400">Tracking number</label>
                  <button
                    type="button"
                    onClick={generateTracking}
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-red-700 transition-colors"
                  >
                    <FiRefreshCw size={11} />
                    Generate
                  </button>
                </div>
                <input
                  className={inputCls}
                  placeholder="Tracking number"
                  value={tracking}
                  onChange={(e) => setTracking(e.target.value)}
                />
              </div>
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

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.11 }}
            className="bg-white rounded-2xl border border-secondary shadow-sm p-6"
          >
            <h2 className="font-semibold text-ink mb-4 flex items-center gap-2">
              <FiMessageSquare size={16} className="text-primary" />
              Notes
            </h2>
            {order.note ? (
              <div>
                <p className="text-xs text-gray-400 mb-1">Customer note</p>
                <p className="text-sm text-gray-600 bg-secondary rounded-xl px-3 py-2.5">{order.note}</p>
              </div>
            ) : null}
            {order.retailerNote ? (
              <div className={order.note ? "mt-4" : ""}>
                <p className="text-xs text-gray-400 mb-1">Retailer note</p>
                <p className="text-sm text-gray-600 bg-secondary rounded-xl px-3 py-2.5">{order.retailerNote}</p>
              </div>
            ) : null}
            {!order.note && !order.retailerNote && (
              <p className="text-sm text-gray-400">No notes for this order</p>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-2xl border border-secondary shadow-sm p-6">
            <h2 className="font-semibold text-ink mb-4 flex items-center gap-2">
              <FiUser size={16} className="text-primary" />
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
                  <p className="text-sm font-medium text-ink">{value || "—"}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-secondary shadow-sm p-6">
            <h2 className="font-semibold text-ink mb-4 flex items-center gap-2">
              <FiMapPin size={16} className="text-primary" />
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

          <div className="bg-white rounded-2xl border border-secondary shadow-sm p-6">
            <h2 className="font-semibold text-ink mb-3 flex items-center gap-2">
              <FiCreditCard size={16} className="text-primary" />
              Payment
            </h2>
            {order.paymentMethod ? (
              <p className="text-sm text-gray-600 capitalize">{order.paymentMethod}</p>
            ) : (
              <p className="text-sm text-gray-400">Not provided</p>
            )}
          </div>

          {order.trackingNumber && (
            <div className="bg-white rounded-2xl border border-secondary shadow-sm p-6">
              <h2 className="font-semibold text-ink mb-2">Tracking</h2>
              <p className="text-sm font-mono bg-secondary rounded-xl px-3 py-2 text-ink">{order.trackingNumber}</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
