import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useGlobalStore } from "../../store/globalStore";
import {
  FiGrid, FiPackage, FiShoppingCart, FiTag, FiLayers,
  FiSettings, FiLogOut, FiChevronLeft, FiChevronRight, FiSearch,
} from "react-icons/fi";
import SearchModal from "./SearchModal";

const sections = [
  {
    label: "Main",
    links: [{ to: "/", label: "Dashboard", icon: FiGrid }],
  },
  {
    label: "Management",
    links: [
      { to: "/products", label: "Products", icon: FiPackage },
      { to: "/orders", label: "Orders", icon: FiShoppingCart },
    ],
  },
  {
    label: "Marketing",
    links: [
      { to: "/coupons", label: "Coupons", icon: FiTag },
      { to: "/bundles", label: "Bundles", icon: FiLayers },
    ],
  },
  {
    label: "Settings",
    links: [{ to: "/store", label: "Store", icon: FiSettings }],
  },
];

const navItem = {
  hidden: { opacity: 0, x: -12 },
  visible: (i) => ({
    opacity: 1, x: 0,
    transition: { delay: i * 0.03, duration: 0.2 },
  }),
};

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar, logout } = useGlobalStore();
  const location = useLocation();
  const user = useGlobalStore((s) => s.user);
  const [searchOpen, setSearchOpen] = useState(false);

  let linkIndex = 0;

  return (
    <>
      <motion.aside
        layout
        className="bg-white h-screen flex flex-col relative shadow-md shadow-black/5"
        animate={{ width: sidebarOpen ? 256 : 72 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <motion.button
          layout
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={toggleSidebar}
          className="absolute -right-3 top-6 z-20 w-6 h-6 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-400 hover:text-gray-700 hover:border-gray-300 transition-all"
        >
          {sidebarOpen ? <FiChevronLeft size={12} /> : <FiChevronRight size={12} />}
        </motion.button>

        <div className="h-16 flex items-center px-4 overflow-hidden border-b border-gray-100">
          <motion.div layout className="flex items-center gap-3 min-w-0">
            <img src="/diobral.png" alt="" className="w-8 h-8 object-contain flex-shrink-0" />
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

        <div className="flex-shrink-0">
          {sidebarOpen ? (
            <div className="px-3 pt-3">
              <div className="relative">
                <FiSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  onFocus={() => setSearchOpen(true)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-100 text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all cursor-pointer"
                />
              </div>
            </div>
          ) : (
            <div className="flex justify-center pt-4 pb-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-all"
              >
                <FiSearch size={16} />
              </button>
            </div>
          )}
        </div>

        <div className="flex-shrink-0 px-2.5 pt-2 pb-1">
          {sidebarOpen ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2.5 px-3 py-2 rounded-2xl bg-gray-50"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white text-xs font-semibold shadow-sm flex-shrink-0">
                {user?.fullName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-gray-700 truncate">{user?.fullName || "User"}</p>
                <p className="text-[10px] text-gray-400 truncate">{user?.email || ""}</p>
              </div>
            </motion.div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white text-xs font-semibold shadow-sm">
                {user?.fullName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U"}
              </div>
            </div>
          )}
        </div>

        <nav className="flex-1 p-2.5 overflow-y-auto scrollbar-none mt-1">
          {sections.map((section) => (
            <div key={section.label} className={sidebarOpen ? "mb-4" : "mb-3"}>
              <AnimatePresence mode="wait">
                {sidebarOpen && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-300"
                  >
                    {section.label}
                  </motion.p>
                )}
              </AnimatePresence>
              <div className={sidebarOpen ? "space-y-0.5" : "flex flex-col items-center gap-1"}>
                {section.links.map(({ to, label, icon: Icon }) => {
                  const idx = linkIndex++;
                  const isActive = to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
                  return (
                    <NavLink key={to} to={to} end={to === "/"} className="relative block group w-full">
                      <motion.div
                        layout
                        variants={sidebarOpen ? navItem : undefined}
                        initial={sidebarOpen ? "hidden" : false}
                        animate={sidebarOpen ? "visible" : undefined}
                        custom={idx}
                        className={`flex items-center rounded-2xl text-sm font-medium transition-all duration-200 ${
                          sidebarOpen
                            ? "gap-3 px-3 py-2.5"
                            : "justify-center w-10 h-10"
                        } ${
                          isActive
                            ? "bg-gradient-to-r from-red-50 to-red-100/80 text-red-700 shadow-sm shadow-red-600/5"
                            : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        }`}
                      >
                        <div className="relative flex-shrink-0">
                          <Icon size={sidebarOpen ? 19 : 18} />
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
                              initial={{ opacity: 0, x: -6 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -6 }}
                              transition={{ duration: 0.12 }}
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
              </div>
            </div>
          ))}
        </nav>

        <div className="flex-shrink-0 p-2.5 border-t border-gray-100">
          <motion.button
            layout
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={logout}
            className={`flex items-center rounded-2xl text-sm font-medium text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all duration-200 ${
              sidebarOpen ? "gap-3 px-3 py-2.5 w-full" : "justify-center w-full py-2.5"
            }`}
          >
            <FiLogOut size={sidebarOpen ? 19 : 18} className="flex-shrink-0" />
            <AnimatePresence mode="wait">
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.12 }}
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.aside>

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </>
  );
}
