import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useApiQuery, useApiMutation } from "../../api/adapter";
import { API_BASE_URL } from "../../api/client";
import PageBanner from "../../components/shared/PageBanner";
import StatCard from "../../components/shared/StatCard";
import {
  FiPackage, FiPlus, FiEdit2, FiTrash2, FiSearch, FiDollarSign,
  FiAlertCircle, FiTag, FiToggleLeft, FiToggleRight,
} from "react-icons/fi";

export default function ProductList() {
  const [search, setSearch] = useState("");
  const { data: products, isLoading } = useApiQuery("/retailer/products");
  const { mutate: deleteProduct } = useApiMutation(null, "DELETE", {
    mutationFn: (id) => import("../../api/client").then((m) => m.del(`/retailer/products/${id}`)),
  });

  const filtered = products?.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: products?.length || 0,
    active: products?.filter((p) => p.isActive).length || 0,
    inactive: products?.filter((p) => !p.isActive).length || 0,
    lowStock: products?.filter((p) => p.stock <= 5).length || 0,
    onSale: products?.filter((p) => p.sale && p.sale > 0).length || 0,
    value: products?.reduce((sum, p) => sum + (p.price || 0) * (p.stock || 0), 0) || 0,
  };

  const uploadUrl = (filename) => filename ? `${API_BASE_URL}/uploads/${filename}` : null;

  if (isLoading) {
    return (
      <div className="px-2 lg:px-6 py-6 space-y-6">
        <div className="h-24 bg-secondary rounded-2xl animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-28 bg-secondary rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-48 bg-secondary rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-2 lg:px-6 py-6 space-y-6 max-w-[1400px] mx-auto">
      <PageBanner
        title="Products"
        subtitle={`${filtered?.length || 0} products in your store`}
        routes={[{ label: "Products" }]}
        icon={FiPackage}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard icon={FiPackage} label="Total Products" value={stats.total} />
        <StatCard icon={FiToggleRight} label="Active" value={stats.active} />
        <StatCard icon={FiToggleLeft} label="Inactive" value={stats.inactive} />
        <StatCard icon={FiAlertCircle} label="Low Stock" value={stats.lowStock} trend={stats.lowStock > 0 ? "down" : "neutral"} />
        <StatCard icon={FiTag} label="On Sale" value={stats.onSale} />
        <StatCard icon={FiDollarSign} label="Inventory Value" value={`$${stats.value.toLocaleString()}`} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="flex flex-col sm:flex-row sm:items-center gap-3"
      >
        <div className="relative w-full sm:max-w-xs">
          <FiSearch size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-secondary shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <Link
          to="/products/new"
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-5 py-2.5 rounded-2xl font-medium text-sm hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-600/20 flex-shrink-0"
        >
          <FiPlus size={16} />
          New Product
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-5"
      >
        {filtered?.map((p, i) => (
          <motion.div
            key={p._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 + i * 0.04 }}
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl border border-secondary shadow-sm overflow-hidden group"
          >
            <div className="px-4 pt-4">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-sm">
                {p.image ? (
                  <img src={uploadUrl(p.image)} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FiPackage size={28} className="text-gray-300" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0">
                  <Link
                    to={`/products/${p._id}/edit`}
                    className="p-1.5 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm text-gray-500 hover:text-primary transition-colors"
                  >
                    <FiEdit2 size={12} />
                  </Link>
                  <button
                    onClick={() => deleteProduct(p._id)}
                    className="p-1.5 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm text-gray-500 hover:text-primary transition-colors"
                  >
                    <FiTrash2 size={12} />
                  </button>
                </div>
                <div className="absolute bottom-2 left-2 flex gap-1">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium shadow-sm ${
                    p.isActive ? "bg-emerald-50/90 text-emerald-700" : "bg-gray-100/90 text-gray-500"
                  }`}>
                    {p.isActive ? "Active" : "Inactive"}
                  </span>
                  {p.sale && p.sale > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium shadow-sm bg-red-50/90 text-red-600">
                      Sale
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="p-4 space-y-2">
              <div>
                <p className="font-medium text-ink truncate">{p.name}</p>
                {p.category && <p className="text-xs text-gray-400">{p.category?.name || p.category}</p>}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <FiDollarSign size={14} className="text-gray-400" />
                  <span className="text-sm font-semibold text-ink">${p.price?.toFixed(2)}</span>
                  {p.sale && p.sale > 0 && (
                    <span className="text-xs text-red-500 line-through">${p.sale?.toFixed(2)}</span>
                  )}
                </div>
                <span className={`text-xs font-medium ${p.stock <= 5 ? "text-primary" : "text-gray-500"}`}>
                  {p.stock} left
                </span>
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
