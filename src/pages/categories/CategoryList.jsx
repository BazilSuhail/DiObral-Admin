import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useQueryClient } from "@tanstack/react-query";
import { useApiQuery, useApiMutation } from "../../api/adapter";
import PageBanner from "../../components/shared/PageBanner";
import StatCard from "../../components/shared/StatCard";
import {
  FiFolder, FiPlus, FiChevronDown, FiChevronRight, FiHash, FiFileText,
  FiLayers, FiList, FiCheck,
} from "react-icons/fi";

const inputCls = "w-full rounded-2xl px-4 py-2.5 text-sm bg-white border border-secondary shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400";
const labelCls = "block text-sm font-medium text-ink mb-1.5 flex items-center gap-1.5";
const iconCls = "text-primary";

export default function CategoryList() {
  const queryClient = useQueryClient();
  const { data: categories, isLoading } = useApiQuery("/categories");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [parent, setParent] = useState("");
  const [expanded, setExpanded] = useState({});
  const [parentOpen, setParentOpen] = useState(false);
  const parentRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (parentRef.current && !parentRef.current.contains(e.target)) setParentOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const flattenAll = (items) => {
    let result = [];
    items?.forEach((c) => { result.push(c); if (c.children?.length) result = result.concat(flattenAll(c.children)); });
    return result;
  };

  const flattenForSelect = (items, depth = 0) => {
    let result = [];
    items?.forEach((cat) => {
      result.push({ ...cat, depth });
      if (cat.children?.length) result = result.concat(flattenForSelect(cat.children, depth + 1));
    });
    return result;
  };

  const systemParents = flattenForSelect(categories).filter((c) => c.isSystem);

  const { mutate, isPending } = useApiMutation("/retailer/categories", "POST", {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/categories"] });
      queryClient.invalidateQueries({ queryKey: ["/retailer/categories"] });
      setName(""); setDesc(""); setParent("");
    },
  });

  const allCategories = flattenAll(categories);
  const topLevel = categories?.length || 0;
  const total = allCategories.length;
  const subCategories = total - topLevel;

  const toggleExpand = (id) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

  const renderTree = (items, depth = 0) =>
    items?.map((cat) => (
      <div key={cat._id}>
        <div
          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-2xl hover:bg-secondary/60 transition-all cursor-pointer group ${
            depth > 0 ? "ml-6" : ""
          }`}
          onClick={() => toggleExpand(cat._id)}
        >
          <button className="w-4 h-4 flex items-center justify-center text-gray-400 flex-shrink-0">
            {cat.children?.length > 0 ? (
              expanded[cat._id] ? <FiChevronDown size={12} /> : <FiChevronRight size={12} />
            ) : null}
          </button>
          <FiFolder size={16} className="text-amber-500 flex-shrink-0" />
          <span className="text-sm font-medium text-ink">{cat.name}</span>
          {cat.slug && <span className="text-[10px] text-gray-300">/{cat.slug}</span>}
          {cat.description && (
            <span className="text-xs text-gray-400 truncate hidden sm:inline max-w-[200px]">— {cat.description}</span>
          )}
          {cat.children?.length > 0 && (
            <span className="ml-auto text-[10px] text-gray-300 bg-secondary px-2 py-0.5 rounded-lg">{cat.children.length}</span>
          )}
        </div>
        {expanded[cat._id] && cat.children?.length > 0 && renderTree(cat.children, depth + 1)}
      </div>
    ));

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({ name, description: desc, parent: parent || null });
  };

  return (
    <div className="px-2 lg:px-6 py-6 space-y-6 max-w-[1400px] mx-auto">
      <PageBanner
        title="Categories"
        subtitle="Organize your products with categories and subcategories"
        routes={[{ label: "Categories" }]}
        icon={FiFolder}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={FiFolder} label="Total Categories" value={total} />
        <StatCard icon={FiLayers} label="Top-Level" value={topLevel} />
        <StatCard icon={FiList} label="Subcategories" value={subCategories} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="bg-white rounded-2xl border border-secondary shadow-sm p-5"
          >
            <h2 className="text-sm font-semibold text-ink mb-3 flex items-center gap-2">
              <FiFolder size={15} className={iconCls} />
              Category Tree
            </h2>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-9 bg-secondary rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : total === 0 ? (
              <p className="text-sm text-gray-400 py-8 text-center">No categories yet. Create your first one.</p>
            ) : (
              <div className="space-y-0.5">{renderTree(categories)}</div>
            )}
          </motion.div>
        </div>

        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-secondary shadow-sm p-5"
          >
            <h2 className="text-sm font-semibold text-ink mb-3 flex items-center gap-2">
              <FiPlus size={15} className={iconCls} />
              New Category
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={labelCls}><FiHash size={14} className={iconCls} /> Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Gym Hoodie"
                  required
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}><FiFileText size={14} className={iconCls} /> Description</label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Cotton fleece hoodie for workouts"
                  rows={2}
                  className={`${inputCls} resize-none`}
                />
              </div>
              <div ref={parentRef} className="relative">
                <label className={labelCls}><FiFolder size={14} className={iconCls} /> Parent <span className="text-primary text-[10px]">(required)</span></label>
                <button
                  type="button"
                  onClick={() => setParentOpen((p) => !p)}
                  className="w-full rounded-2xl px-4 py-2.5 text-sm bg-white border border-secondary shadow-sm transition-all text-left flex items-center justify-between group hover:bg-secondary/60"
                >
                  <span className={parent ? "text-ink" : "text-gray-400"}>
                    {parent ? systemParents.find((c) => c._id === parent)?.name || "Select a parent category..." : "Select a parent category..."}
                  </span>
                  <FiChevronDown size={14} className={`text-gray-400 transition-transform ${parentOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {parentOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute z-20 mt-1 w-full bg-white rounded-2xl shadow-xl shadow-black/10 border border-secondary overflow-hidden"
                    >
                      <div className="max-h-52 overflow-y-auto p-1.5">
                        {systemParents.length === 0 && (
                          <p className="text-center text-sm text-gray-400 py-4">No system categories available</p>
                        )}
                        {systemParents.map((cat) => (
                          <button
                            key={cat._id}
                            type="button"
                            onClick={() => { setParent(cat._id); setParentOpen(false); }}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-all ${
                              parent === cat._id
                                ? "bg-red-50 text-red-700"
                                : "text-gray-700 hover:bg-secondary"
                            }`}
                          >
                            <FiFolder size={14} className={parent === cat._id ? "text-red-400" : "text-amber-500"} />
                            <span className="text-sm font-medium flex-1">{cat.name}</span>
                            {parent === cat._id && <FiCheck size={14} className="text-red-500" />}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <input type="hidden" name="parent" value={parent} required />
                <p className="mt-1 flex items-center gap-1 text-[10px] text-amber-600 bg-amber-50 px-2 py-1 rounded-lg"><span className="text-[10px]">⚠️</span> Parent is mandatory. Subcategories must belong to a root category.</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                disabled={isPending}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-2.5 rounded-2xl font-medium text-sm hover:from-red-700 hover:to-red-800 disabled:opacity-50 transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2"
              >
                <FiPlus size={15} />
                {isPending ? "Creating..." : "Create Category"}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
