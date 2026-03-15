import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useApiQuery } from "../../api/adapter";
import { FiFolder, FiSearch, FiX, FiChevronRight, FiCheck } from "react-icons/fi";

function flattenTree(items, depth = 0) {
  let result = [];
  items?.forEach((cat) => {
    result.push({ ...cat, depth });
    if (cat.children?.length) result = result.concat(flattenTree(cat.children, depth + 1));
  });
  return result;
}

export default function CategoryModal({ onSelect, onClose }) {
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const { data: categories } = useApiQuery("/categories");

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

  const flat = flattenTree(categories);
  const filtered = query.trim()
    ? flat.filter((cat) => cat.name?.toLowerCase().includes(query.toLowerCase()))
    : flat;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.97 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-white rounded-2xl shadow-2xl shadow-black/10 border border-gray-100 overflow-hidden"
        >
          <div className="relative border-b border-gray-100">
            <FiSearch size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search categories..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
            />
            <button onClick={onClose} className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all">
              <FiX size={15} />
            </button>
          </div>

          <div className="max-h-72 overflow-y-auto p-2">
            {filtered.length === 0 && (
              <p className="text-center text-sm text-gray-400 py-8">No categories found</p>
            )}
            {filtered.map((cat) => (
              <button
                key={cat._id}
                onClick={() => { onSelect({ _id: cat._id, name: cat.name }); onClose(); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-all text-left group"
              >
                <div className="relative">
                  {Array.from({ length: cat.depth }).map((_, i) => (
                    <span key={i} className="inline-block w-4" />
                  ))}
                  <FiFolder size={15} className="text-amber-500 inline" />
                </div>
                <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                {cat.slug && <span className="text-[10px] text-gray-300">/{cat.slug}</span>}
                <FiChevronRight size={12} className="ml-auto text-gray-300 group-hover:text-gray-500 transition-colors" />
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
