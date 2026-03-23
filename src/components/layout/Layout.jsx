import { useState, useRef, useEffect, useCallback } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function DashboardLayout() {
  const location = useLocation();
  const mainRef = useRef(null);
  const lastScroll = useRef(0);
  const [navHidden, setNavHidden] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setDrawerOpen(false);
    setNavHidden(false);
    if (mainRef.current) lastScroll.current = mainRef.current.scrollTop;
  }, [location.pathname]);

  const handleScroll = useCallback(() => {
    const el = mainRef.current;
    if (!el) return;
    const cur = el.scrollTop;
    setNavHidden(cur > lastScroll.current && cur > 80);
    lastScroll.current = cur;
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50/80">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <main ref={mainRef} onScroll={handleScroll} className="flex-1 overflow-y-auto">
        <Header navHidden={navHidden} onMenuClick={() => setDrawerOpen(true)} />
        <Outlet />
      </main>

      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px] lg:hidden"
            />
            <motion.div
              key="drawer"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden w-[280px]"
            >
              <Sidebar mobile onClose={() => setDrawerOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
