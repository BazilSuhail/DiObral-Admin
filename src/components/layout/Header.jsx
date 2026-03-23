import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useGlobalStore } from "../../store/globalStore";
import { FiMenu, FiShoppingBag } from "react-icons/fi";

export default function Header({ navHidden, onMenuClick }) {
  const user = useGlobalStore((s) => s.user);

  return (
    <motion.header
      animate={{ y: navHidden ? "-100%" : "0%" }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-secondary lg:hidden"
    >
      <div className="flex items-center justify-between h-14 px-3">
        <div className="flex items-center gap-2">
          <img src="/diobral.webp" alt="" className="w-7 h-7 object-contain" />
          <span className="font-bold text-ink">DiObral</span>
        </div>

        <div className="flex items-center gap-1">
          <Link
            to="/store"
            className="p-2 rounded-xl hover:bg-secondary text-gray-500 hover:text-primary transition-colors"
            aria-label="Store"
          >
            <FiShoppingBag size={18} />
          </Link>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={onMenuClick}
            className="p-2 rounded-xl hover:bg-secondary text-ink transition-colors"
            aria-label="Open menu"
          >
            <FiMenu size={20} />
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
