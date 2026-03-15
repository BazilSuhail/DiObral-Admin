import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useApiQuery } from "../../api/adapter";
import { FiSearch, FiPackage, FiX } from "react-icons/fi";

export default function SearchModal({ onClose }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");

  const { data, isLoading } = useApiQuery("/products", {}, { enabled: true });

  useEffect(() => {
    inputRef.current?.focus();
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const products = data?.products || [];
  const filtered = query.trim()
    ? products.filter((p) => p.name?.toLowerCase().includes(query.toLowerCase()))
    : products.slice(0, 10);

  const handleSelect = (name) => {
    navigate(`/products?search=${encodeURIComponent(name)}`);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.97 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg bg-white rounded-2xl shadow-2xl shadow-black/10 border border-gray-100 overflow-hidden"
        >
          <div className="relative border-b border-gray-100">
            <FiSearch size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
            />
            <button onClick={onClose} className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all">
              <FiX size={15} />
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto p-2">
            {isLoading && (
              <div className="space-y-2 p-2">
                {[1,2,3].map((i) => (
                  <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />
                ))}
              </div>
            )}

            {!isLoading && filtered.length === 0 && (
              <p className="text-center text-sm text-gray-400 py-8">No products found</p>
            )}

            {!isLoading && filtered.map((product) => (
              <button
                key={product._id}
                onClick={() => handleSelect(product.name)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center flex-shrink-0 group-hover:from-red-100 group-hover:to-red-200 transition-all">
                  <FiPackage size={14} className="text-red-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-700 truncate">{product.name}</p>
                  {product.price && (
                    <p className="text-xs text-gray-400">${product.price?.toFixed(2)}</p>
                  )}
                </div>
                <span className="text-[10px] text-gray-300 uppercase tracking-wider">Jump</span>
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
