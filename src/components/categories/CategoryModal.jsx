import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useApiQuery, useApiMutation } from "../../api/adapter";
import {
  FiFolder, FiSearch, FiX, FiChevronRight, FiChevronDown,
  FiCheck, FiPlus, FiTrash2,
} from "react-icons/fi";

export default function CategoryModal({ onSelect, onClose }) {
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState({});
  const [adding, setAdding] = useState(null);
  const [newName, setNewName] = useState("");

  const { data: rootCategories } = useApiQuery("/categories");
  const { data: retailerCats } = useApiQuery("/retailer/categories");

  const { mutate: createCat, isPending: creating } = useApiMutation(
    "/retailer/categories", "POST",
    { onSuccess: () => { setAdding(null); setNewName(""); } }
  );

  const { mutate: deleteCat } = useApiMutation(null, "DELETE", {
    mutationFn: (id) => import("../../api/client").then((m) => m.del(`/retailer/categories/${id}`)),
  });

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

  const toggle = (id) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

  const retailerByParent = {};
  retailerCats?.forEach((c) => {
    if (!retailerByParent[c.parent]) retailerByParent[c.parent] = [];
    retailerByParent[c.parent].push(c);
  });

  const allSubs = (rootId) => {
    const system = rootCategories?.find((r) => r._id === rootId)?.children || [];
    const retailer = retailerByParent[rootId] || [];
    return [...system, ...retailer];
  };

  const filterRoots = query.trim()
    ? rootCategories?.filter((r) => r.name?.toLowerCase().includes(query.toLowerCase()))
    : rootCategories;

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

          <div className="max-h-80 overflow-y-auto p-2">
            {(!filterRoots || filterRoots.length === 0) && (
              <p className="text-center text-sm text-gray-400 py-8">No categories found</p>
            )}
            {filterRoots?.map((root) => (
              <div key={root._id}>
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-all group">
                  <button
                    onClick={() => toggle(root._id)}
                    className="p-0.5 rounded hover:bg-gray-200 transition-colors"
                  >
                    {expanded[root._id]
                      ? <FiChevronDown size={14} className="text-gray-400" />
                      : <FiChevronRight size={14} className="text-gray-400" />}
                  </button>
                  <button
                    onClick={() => { onSelect({ category: root._id, subcategory: null, name: root.name }); onClose(); }}
                    className="flex items-center gap-2 flex-1 text-left"
                  >
                    <FiFolder size={15} className="text-amber-500" />
                    <span className="text-sm font-medium text-gray-700">{root.name}</span>
                    {root.slug && <span className="text-[10px] text-gray-300">/{root.slug}</span>}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setAdding(adding === root._id ? null : root._id); setNewName(""); }}
                    className="p-1 rounded-lg text-gray-300 hover:text-red-600 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                    title="Add subcategory"
                  >
                    <FiPlus size={14} />
                  </button>
                </div>

                {expanded[root._id] && (
                  <div className="ml-6 pl-2 border-l-2 border-gray-100 space-y-0.5">
                    {allSubs(root._id).map((sub) => (
                      <div key={sub._id} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all group">
                        <button
                          onClick={() => {
                            onSelect({
                              category: root._id,
                              subcategory: sub._id,
                              name: `${root.name} › ${sub.name}`,
                            });
                            onClose();
                          }}
                          className="flex items-center gap-2 flex-1 text-left"
                        >
                          <FiFolder size={13} className="text-gray-400" />
                          <span className="text-sm text-gray-600">{sub.name}</span>
                          {sub.isSystem && <span className="text-[9px] text-gray-300 bg-gray-100 px-1.5 py-0.5 rounded">system</span>}
                        </button>
                        {!sub.isSystem && (
                          <button
                            onClick={() => deleteCat(sub._id)}
                            className="p-1 rounded-lg text-gray-300 hover:text-red-600 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                            title="Delete"
                          >
                            <FiTrash2 size={12} />
                          </button>
                        )}
                      </div>
                    ))}

                    {adding === root._id && (
                      <div className="flex items-center gap-2 px-3 py-2">
                        <input
                          autoFocus
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && newName.trim()) {
                              createCat({ name: newName.trim(), parent: root._id });
                            }
                            if (e.key === "Escape") { setAdding(null); setNewName(""); }
                          }}
                          placeholder="Subcategory name..."
                          className="flex-1 text-sm px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                        />
                        <button
                          onClick={() => { if (newName.trim()) createCat({ name: newName.trim(), parent: root._id }); }}
                          disabled={!newName.trim() || creating}
                          className="px-3 py-1.5 rounded-xl bg-red-600 text-white text-xs font-medium hover:bg-red-700 disabled:opacity-50 transition-all"
                        >
                          Create
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
