import { motion } from "motion/react";
import { useGlobalStore } from "../../store/globalStore";
import { FiBell, FiSearch } from "react-icons/fi";

export default function Header() {
  const user = useGlobalStore((s) => s.user);

  return (
    <header className="bg-white/80 backdrop-blur-md h-16 px-6 flex items-center justify-between flex-shrink-0 shadow-sm shadow-black/5">
      <div className="relative max-w-md w-full">
        <FiSearch size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search products, orders..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-gray-100/80 border-0 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:bg-white transition-all placeholder:text-gray-400"
        />
      </div>

      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2.5 hover:bg-gray-100 rounded-2xl transition-colors"
        >
          <FiBell size={18} className="text-gray-500" />
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full"
          />
        </motion.button>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-2xl hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white text-sm font-semibold shadow-sm">
            {user?.fullName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-700 leading-tight">{user?.fullName || "User"}</p>
            <p className="text-xs text-gray-400">{user?.email || ""}</p>
          </div>
        </motion.div>
      </div>
    </header>
  );
}
