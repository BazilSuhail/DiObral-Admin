import { useState } from "react";
import { motion } from "motion/react";
import { useQueryClient } from "@tanstack/react-query";
import { useApiQuery, useApiMutation } from "../../api/adapter";
import {
  FiFolder, FiPlus, FiChevronDown, FiChevronRight, FiHash, FiFileText,
  FiLayers, FiList,
} from "react-icons/fi";

export default function CategoryList() {
  const queryClient = useQueryClient();
  const { data: categories, isLoading } = useApiQuery("/categories");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [parent, setParent] = useState("");
  const [expanded, setExpanded] = useState({});

  const { mutate, isPending } = useApiMutation("/categories", "POST", {
    onSuccess: (data) => {
      const newCat = data.category;
      queryClient.setQueryData(["/categories"], (old) => {
        if (!old) return old;
        if (!newCat.parent) return [...old, { ...newCat, children: [] }];
        const addToParent = (items) =>
          items.map((c) => {
            if (c._id === newCat.parent) return { ...c, children: [...(c.children || []), { ...newCat, children: [] }] };
            if (c.children?.length) return { ...c, children: addToParent(c.children) };
            return c;
          });
        return addToParent(old);
      });
      setName(""); setDesc(""); setParent("");
    },
  });

  const flattenAll = (items) => {
    let result = [];
    items?.forEach((c) => { result.push(c); if (c.children?.length) result = result.concat(flattenAll(c.children)); });
    return result;
  };

  const allCategories = flattenAll(categories);
  const topLevel = categories?.length || 0;
  const total = allCategories.length;
  const subCategories = total - topLevel;

  const toggleExpand = (id) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

  const renderTree = (items, depth = 0) =>
    items?.map((cat) => (
      <div key={cat._id}>
        <div
          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer group ${
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
          <span className="text-sm font-medium text-gray-800">{cat.name}</span>
          {cat.slug && <span className="text-[10px] text-gray-300">/{cat.slug}</span>}
          {cat.description && (
            <span className="text-xs text-gray-400 truncate hidden sm:inline max-w-[200px]">— {cat.description}</span>
          )}
          {cat.children?.length > 0 && (
            <span className="ml-auto text-[10px] text-gray-300 bg-gray-100 px-2 py-0.5 rounded-lg">{cat.children.length}</span>
          )}
        </div>
        {expanded[cat._id] && cat.children?.length > 0 && renderTree(cat.children, depth + 1)}
      </div>
    ));

  const flattenForSelect = (items, depth = 0) => {
    let result = [];
    items?.forEach((cat) => {
      result.push({ ...cat, depth });
      if (cat.children?.length) result = result.concat(flattenForSelect(cat.children, depth + 1));
    });
    return result;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({ name, description: desc, parent: parent || null });
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <p className="text-sm text-gray-500 mt-0.5">Organize your products with categories and subcategories</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-3 gap-4"
      >
        <div className="bg-white rounded-2xl p-4 shadow-sm shadow-black/5 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-md flex-shrink-0">
            <FiFolder size={17} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-400 font-medium">Total Categories</p>
            <p className="text-lg font-bold text-gray-900 mt-0.5">{total}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm shadow-black/5 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md flex-shrink-0">
            <FiLayers size={17} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-400 font-medium">Top-Level</p>
            <p className="text-lg font-bold text-gray-900 mt-0.5">{topLevel}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm shadow-black/5 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-md flex-shrink-0">
            <FiList size={17} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-400 font-medium">Subcategories</p>
            <p className="text-lg font-bold text-gray-900 mt-0.5">{subCategories}</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md shadow-black/5 p-5"
          >
            <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FiFolder size={15} className="text-amber-500" />
              Category Tree
            </h2>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-9 bg-gray-100 rounded-2xl animate-pulse" />
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
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md shadow-black/5 p-5"
          >
            <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FiPlus size={15} className="text-red-500" />
              New Category
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5"><FiHash size={14} className="text-gray-400" /> Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Electronics"
                  required
                  className="w-full rounded-2xl px-4 py-2.5 text-sm bg-gray-50/50 shadow-sm shadow-black/5 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5"><FiFileText size={14} className="text-gray-400" /> Description</label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Gadgets and devices"
                  rows={2}
                  className="w-full rounded-2xl px-4 py-2.5 text-sm bg-gray-50/50 shadow-sm shadow-black/5 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5"><FiFolder size={14} className="text-gray-400" /> Parent</label>
                <select
                  value={parent}
                  onChange={(e) => setParent(e.target.value)}
                  className="w-full rounded-2xl px-4 py-2.5 text-sm bg-gray-50/50 shadow-sm shadow-black/5 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                >
                  <option value="">None (top-level)</option>
                  {flattenForSelect(categories).map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {"—".repeat(cat.depth)} {cat.name}
                    </option>
                  ))}
                </select>
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
