import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useApiQuery, useApiMutation } from "../../api/adapter";
import { FiPackage, FiPlus, FiEdit2, FiTrash2, FiSearch, FiDollarSign, FiGrid } from "react-icons/fi";

export default function ProductList() {
  const [search, setSearch] = useState("");
  const { data: products, isLoading } = useApiQuery("/retailer/products");
  const { mutate: deleteProduct } = useApiMutation(null, "DELETE", {
    mutationFn: (id) => import("../../api/client").then((m) => m.del(`/retailer/products/${id}`)),
  });

  const filtered = products?.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="p-6 space-y-5">
        <div className="h-8 w-48 bg-gray-200 rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-0.5">{products?.length || 0} products in your store</p>
        </div>
        <Link
          to="/products/new"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-5 py-2.5 rounded-2xl font-medium text-sm hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-600/20"
        >
          <FiPlus size={16} />
          New Product
        </Link>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="relative max-w-xs">
        <FiSearch size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/90 border-0 shadow-sm shadow-black/5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {filtered?.map((p, i) => (
          <motion.div
            key={p._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.04 }}
            whileHover={{ y: -4 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md shadow-black/5 overflow-hidden group"
          >
            <div className="relative h-44 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
              {p.image ? (
                <img src={`http://localhost:5000/uploads/${p.image}`} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FiPackage size={40} className="text-gray-300" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0">
                <Link
                  to={`/products/${p._id}/edit`}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-sm text-gray-500 hover:text-red-600 transition-colors"
                >
                  <FiEdit2 size={14} />
                </Link>
                <button
                  onClick={() => deleteProduct(p._id)}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-sm text-gray-500 hover:text-red-600 transition-colors"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
              <div className="absolute bottom-3 left-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium shadow-sm ${
                  p.isActive ? "bg-emerald-50/90 text-emerald-700" : "bg-gray-100/90 text-gray-500"
                }`}>
                  {p.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
            <div className="p-4 space-y-2">
              <div>
                <p className="font-medium text-gray-900 truncate">{p.name}</p>
                {p.category && <p className="text-xs text-gray-400">{p.category?.name || p.category}</p>}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <FiDollarSign size={14} className="text-gray-400" />
                  <span className="text-sm font-semibold text-gray-900">{p.price}</span>
                  {p.sale && <span className="text-xs text-red-500 line-through">${p.sale}</span>}
                </div>
                <div className="flex items-center gap-1">
                  <FiGrid size={12} className="text-gray-400" />
                  <span className={`text-xs font-medium ${p.stock <= 5 ? "text-red-600" : "text-gray-500"}`}>
                    {p.stock} left
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {(!filtered || filtered.length === 0) && (
          <div className="col-span-full text-center py-16 text-gray-400">
            <FiPackage size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="text-sm">{search ? "No matches" : "No products yet"}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
