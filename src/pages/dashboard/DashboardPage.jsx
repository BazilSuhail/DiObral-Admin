import { motion } from "motion/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import { useApiQuery } from "../../api/adapter";
import PageBanner from "../../components/shared/PageBanner";
import StatCard from "../../components/shared/StatCard";
import { useGlobalStore } from "../../store/globalStore";
import {
  FiPackage, FiClock, FiDollarSign, FiStar, FiTrendingUp,
  FiShoppingCart, FiGrid, FiPieChart,
} from "react-icons/fi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

const PRIMARY = "#DC2626";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

const statusPill = {
  pending: "bg-amber-50 text-amber-600",
  processing: "bg-primary/10 text-primary",
  shipped: "bg-blue-50 text-blue-600",
  delivered: "bg-emerald-50 text-emerald-600",
  cancelled: "bg-red-50 text-red-500",
  default: "bg-secondary text-gray-500",
};

export default function DashboardPage() {
  const { data, isLoading } = useApiQuery("/retailer/dashboard");
  const user = useGlobalStore((s) => s.user);
  const firstName = user?.fullName?.split(" ")[0] || user?.fullName || "there";

  if (isLoading) {
    return (
      <div className="px-2 lg:px-6 py-6 space-y-6">
        <div className="h-24 bg-secondary rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-secondary rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const { products, orders, revenue, topProducts, ratings, trends } = data || {};

  const monthlyTrend = Array.isArray(trends?.monthly) ? trends.monthly : [];
  const trendLabels = monthlyTrend.map((t) => t?.month ?? "");
  const trendValues = monthlyTrend.map((t) => Number(t?.revenue ?? 0));

  const hasTrend = trendValues.length > 0;

  const orderBreakdown = [
    { label: "Pending", value: orders?.pending || 0, color: "#F87171" },
    { label: "Processing", value: orders?.processing || 0, color: "#F43F5E" },
    { label: "Shipped", value: orders?.shipped || 0, color: "#E11D48" },
    { label: "Delivered", value: orders?.delivered || 0, color: "#DC2626" },
    { label: "Cancelled", value: orders?.cancelled || 0, color: "#FECACA" },
  ];
  const orderTotal = orderBreakdown.reduce((s, o) => s + (o.value || 0), 0);

  const revenueChart = {
    labels: trendLabels,
    datasets: [
      {
        label: "Revenue",
        data: trendValues,
        borderColor: PRIMARY,
        backgroundColor: (context) => {
          const { ctx, chartArea } = context.chart;
          if (!chartArea) return "rgba(220,38,38,0.12)";
          const g = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          g.addColorStop(0, "rgba(220,38,38,0.22)");
          g.addColorStop(1, "rgba(220,38,38,0)");
          return g;
        },
        fill: true,
        tension: 0.4,
        borderWidth: 2.5,
        pointBackgroundColor: "#FFFFFF",
        pointBorderColor: PRIMARY,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const revenueOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#202124",
        padding: 10,
        cornerRadius: 10,
        titleFont: { family: "Poppins", size: 12 },
        bodyFont: { family: "Poppins", size: 12 },
        callbacks: { label: (c) => ` $${c.parsed.y.toLocaleString()}` },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#9AA0A6", font: { family: "Poppins", size: 11 }, maxTicksLimit: 8 },
      },
      y: {
        grid: { color: "rgba(241,243,244,0.9)" },
        border: { display: false },
        ticks: {
          color: "#9AA0A6",
          font: { family: "Poppins", size: 11 },
          callback: (v) => `$${v.toLocaleString()}`,
        },
      },
    },
  };

  const statusChart = {
    labels: orderBreakdown.map((o) => o.label),
    datasets: [
      {
        data: orderBreakdown.map((o) => o.value),
        backgroundColor: orderBreakdown.map((o) => o.color),
        borderWidth: 0,
        hoverOffset: 6,
      },
    ],
  };

  const statusOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#202124",
        padding: 10,
        cornerRadius: 10,
        titleFont: { family: "Poppins", size: 12 },
        bodyFont: { family: "Poppins", size: 12 },
      },
    },
  };

  return (
    <div className="px-2 lg:px-6 py-6 space-y-6 max-w-[1400px] mx-auto">
      <PageBanner
        title="Dashboard"
        subtitle={`Welcome back, ${firstName}!`}
        icon={FiGrid}
      />

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
          delay={0}
        />
        <StatCard
          icon={FiClock}
          label="Pending Orders"
          value={orders?.pending}
          change={`${orders?.processing || 0} processing`}
          trend="neutral"
          delay={0.05}
        />
        <StatCard
          icon={FiDollarSign}
          label="30d Revenue"
          value={`$${revenue?.total30d?.toFixed(2) || "0.00"}`}
          change={`${revenue?.orders30d || 0} orders`}
          trend="up"
          delay={0.1}
        />
        <StatCard
          icon={FiStar}
          label="Avg Rating"
          value={ratings?.average?.toFixed(1) || "—"}
          change={`${ratings?.total || 0} reviews`}
          trend={ratings?.average >= 4 ? "up" : "neutral"}
          delay={0.15}
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-secondary shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-ink flex items-center gap-2">
              <FiTrendingUp size={16} className="text-primary" />
              Revenue Trend
            </h2>
            <span className="text-xs text-gray-400 bg-secondary px-2.5 py-1 rounded-full">12 months</span>
          </div>
          <div className="h-72">
            {hasTrend ? (
              <Line data={revenueChart} options={revenueOptions} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                <FiTrendingUp size={28} className="opacity-40" />
                <p className="text-sm">No revenue data yet</p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl border border-secondary shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-ink flex items-center gap-2">
              <FiPieChart size={16} className="text-primary" />
              Order Status
            </h2>
            <span className="text-xs text-gray-400 bg-secondary px-2.5 py-1 rounded-full">{orderTotal} total</span>
          </div>
          {orderTotal > 0 ? (
            <div className="flex items-center gap-6">
              <div className="relative h-44 w-44 flex-shrink-0">
                <Doughnut data={statusChart} options={statusOptions} />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-bold text-ink">{orderTotal}</span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider">Orders</span>
                </div>
              </div>
              <div className="flex-1 space-y-2.5 min-w-0">
                {orderBreakdown.map((o) => (
                  <div key={o.label} className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: o.color }} />
                    <span className="text-sm text-gray-600 flex-1 capitalize">{o.label}</span>
                    <span className="text-sm font-semibold text-ink">{o.value || 0}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-44 flex flex-col items-center justify-center text-gray-400 gap-2">
              <FiPieChart size={28} className="opacity-40" />
              <p className="text-sm">No orders yet</p>
            </div>
          )}
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-secondary shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-ink flex items-center gap-2">
              <FiShoppingCart size={16} className="text-primary" />
              Recent Orders
            </h2>
            <span className="text-xs text-gray-400 bg-secondary px-2.5 py-1 rounded-full">Last 5</span>
          </div>
          <div className="space-y-1">
            {orders?.recent?.slice(0, 5).map((o, i) => (
              <motion.div
                key={o._id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.32 + i * 0.05 }}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary/60 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 8 }}
                    className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0"
                  >
                    <FiShoppingCart size={15} className="text-primary" />
                  </motion.div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{o.customer?.fullName || "Guest"}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(o.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-sm font-semibold text-ink">${o.total}</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${statusPill[o.status] || statusPill.default}`}>
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
          transition={{ delay: 0.35 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-2xl border border-secondary shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-ink flex items-center gap-2">
                <FiTrendingUp size={16} className="text-primary" />
                Top Products
              </h2>
            </div>
            <div className="space-y-4">
              {topProducts?.slice(0, 4).map((p, i) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.38 + i * 0.06 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-md bg-secondary overflow-hidden flex-shrink-0 shadow-sm">
                    {p.image ? (
                      <img src={`${import.meta.env.VITE_API_BASE_URL}/uploads/${p.image}`} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-bold">#{i + 1}</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{p.name}</p>
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

          <div className="bg-white rounded-2xl border border-secondary shadow-sm p-6">
            <h2 className="font-semibold text-ink mb-3 flex items-center gap-2">
              <FiPackage size={16} className="text-primary" />
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
                    <span className="text-sm font-semibold text-primary">{item.stock}</span>
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
