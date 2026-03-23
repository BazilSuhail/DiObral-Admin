import { motion } from "motion/react";
import { FiArrowUp, FiArrowDown, FiMinus } from "react-icons/fi";

const trendStyles = {
  up: { icon: FiArrowUp, cls: "text-emerald-600", bg: "bg-emerald-50" },
  down: { icon: FiArrowDown, cls: "text-red-500", bg: "bg-red-50" },
  neutral: { icon: FiMinus, cls: "text-gray-400", bg: "bg-secondary" },
};

export default function StatCard({ icon: Icon, label, value, change, trend = "neutral", delay = 0 }) {
  const t = trendStyles[trend] || trendStyles.neutral;
  const TrendIcon = t.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl border border-secondary shadow-sm p-5 flex items-start justify-between gap-4 group"
    >
      <div className="space-y-1.5 min-w-0">
        <p className="text-[12px] font-medium text-gray-500 uppercase tracking-wider">{label}</p>
        <p className="text-2xl sm:text-[28px] font-bold text-ink truncate">{value ?? "—"}</p>
        {change && (
          <div className={`inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-2.5 py-1 ${t.bg} ${t.cls}`}>
            <TrendIcon size={11} />
            <span className="truncate">{change}</span>
          </div>
        )}
      </div>
      <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 transition-colors duration-200 group-hover:bg-primary group-hover:text-white">
        <Icon size={18} />
      </div>
    </motion.div>
  );
}
