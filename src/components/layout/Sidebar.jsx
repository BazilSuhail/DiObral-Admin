import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useGlobalStore } from "../../store/globalStore";
import {
  FiGrid, FiPackage, FiShoppingCart, FiTag, FiLayers,
  FiSettings, FiLogOut, FiChevronLeft, FiChevronRight,
  FiBell, FiSearch,
} from "react-icons/fi";

const links = [
  { to: "/", label: "Dashboard", icon: FiGrid },
  { to: "/products", label: "Products", icon: FiPackage },
  { to: "/orders", label: "Orders", icon: FiShoppingCart },
  { to: "/coupons", label: "Coupons", icon: FiTag },
  { to: "/bundles", label: "Bundles", icon: FiLayers },
  { to: "/store", label: "Store", icon: FiSettings },
];

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar, logout } = useGlobalStore();
  const location = useLocation();
  const user = useGlobalStore((s) => s.user);

  return (
    <motion.aside
      layout
      className="bg-white h-screen flex flex-col relative shadow-md shadow-black/5"
      animate={{ width: sidebarOpen ? 256 : 72 }}
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="h-16 flex items-center px-4 overflow-hidden border-b border-gray-100">
        <motion.div layout className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-red-800 p-1.5 flex-shrink-0 shadow-md shadow-red-600/20">
            <img src="/diobral.png" alt="" className="w-full h-full object-contain" />
          </div>
          <AnimatePresence mode="wait">
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.12 }}
                className="font-bold text-base text-gray-800"
              >
                DiObral
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden px-3 pt-3"
          >
            <div className="relative">
              <FiSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-100 text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="flex-1 p-2.5 space-y-0.5 overflow-hidden overflow-y-auto mt-1">
        {links.map(({ to, label, icon: Icon }) => {
          const isActive = to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
          return (
            <NavLink key={to} to={to} end={to === "/"} className="relative block group">
              <motion.div
                layout
                className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-red-50 to-red-100/80 text-red-700 shadow-sm shadow-red-600/5"
                    : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                }`}
              >
                <div className="relative flex-shrink-0">
                  <Icon size={19} />
                  {isActive && (
                    <motion.span
                      layoutId="activeDot"
                      className="absolute -right-1 -top-0.5 w-2 h-2 rounded-full bg-red-600"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                </div>
                <AnimatePresence mode="wait">
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.1 }}
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
              {!sidebarOpen && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-900 text-white text-xs rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-lg">
                  {label}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-2.5 border-t border-gray-100 space-y-1.5">
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-gray-50"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white text-xs font-semibold shadow-sm flex-shrink-0">
                {user?.fullName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-gray-700 truncate">{user?.fullName || "User"}</p>
                <p className="text-[10px] text-gray-400 truncate">{user?.email || ""}</p>
              </div>
              <div className="relative">
                <FiBell size={15} className="text-gray-400" />
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-600 rounded-full" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-1">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={logout}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all duration-200 ${sidebarOpen ? "flex-1" : "w-full"}`}
          >
            <FiLogOut size={19} className="flex-shrink-0" />
            <AnimatePresence mode="wait">
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.1 }}
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {sidebarOpen && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleSidebar}
              className="p-2.5 rounded-2xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
            >
              <FiChevronLeft size={16} />
            </motion.button>
          )}
        </div>

        {!sidebarOpen && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleSidebar}
            className="w-full p-2.5 rounded-2xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all flex items-center justify-center"
          >
            <FiChevronRight size={16} />
          </motion.button>
        )}
      </div>
    </motion.aside>
  );
}
