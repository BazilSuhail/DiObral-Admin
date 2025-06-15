"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Bar, Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js"

import StatCard from "../utilities/StatCard"
import ChartCard from "../utilities/ChartCard"
import TableCard from "../utilities/TableCard"
import Badge from "../utilities/Badge"
import LoadingSpinner from "../utilities/LoadingSpinner"
import axios from "axios"

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend)

// Icons as React components
const PackageIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
    />
  </svg>
)

const DollarIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
    />
  </svg>
)

const TrendingUpIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
)

const TagIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
    />
  </svg>
)

const ArchiveIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
    />
  </svg>
)

const StarIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
    />
  </svg>
)

const LayersIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
    />
  </svg>
)

const BarChartIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
)

const Dashboard = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       // Simulated data - replace with your actual API calls
  //       const mockProducts = [
  //         { id: 1, name: "Wireless Headphones", price: 299.99, stock: 45, category: "Electronics" },
  //         { id: 2, name: "Smart Watch", price: 199.99, stock: 32, category: "Electronics" },
  //         { id: 3, name: "Programming Book", price: 49.99, stock: 28, category: "Books" },
  //         { id: 4, name: "Gaming Laptop", price: 1299.99, stock: 15, category: "Electronics" },
  //         { id: 5, name: "Coffee Maker", price: 89.99, stock: 67, category: "Home" },
  //         { id: 6, name: "Running Shoes", price: 129.99, stock: 23, category: "Clothing" },
  //         { id: 7, name: "Desk Lamp", price: 39.99, stock: 41, category: "Home" },
  //         { id: 8, name: "Bluetooth Speaker", price: 79.99, stock: 38, category: "Electronics" },
  //       ]

  //       const mockCategories = [
  //         { id: 1, name: "Electronics" },
  //         { id: 2, name: "Clothing" },
  //         { id: 3, name: "Books" },
  //         { id: 4, name: "Home" },
  //       ]

  //       // Simulate API delay
  //       await new Promise((resolve) => setTimeout(resolve, 1500))

  //       setProducts(mockProducts)
  //       setCategories(mockCategories)
  //     } catch (error) {
  //       console.error("Error fetching data:", error)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   fetchData()
  // }, []) 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/fetchproducts/products`);
        const categoryResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/category`);

        setProducts(productResponse.data);
        setCategories(categoryResponse.data);
        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
 

  const totalStock = products.reduce((acc, product) => acc + product.stock, 0)
  const totalPrice = products.reduce((acc, product) => acc + product.price, 0)
  const totalValue = products.reduce((acc, product) => acc + product.price * product.stock, 0)
  const averageStock = totalStock / products.length || 0
  const averagePrice = totalPrice / products.length || 0
  const maxPrice = Math.max(...products.map((product) => product.price), 0)

  const stockData = {
    labels: products.map((product) => product.name.split(" ").slice(0, 2).join(" ")),
    datasets: [
      {
        label: "Stock Quantity",
        data: products.map((product) => product.stock),
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  }

  const priceData = {
    labels: products.map((product) => product.name.split(" ").slice(0, 2).join(" ")),
    datasets: [
      {
        label: "Price ($)",
        data: products.map((product) => product.price),
        borderColor: "rgba(147, 51, 234, 1)",
        backgroundColor: "rgba(147, 51, 234, 0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "rgba(147, 51, 234, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#6B7280",
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: "rgba(107, 114, 128, 0.1)",
        },
        ticks: {
          color: "#6B7280",
          font: {
            size: 12,
          },
        },
      },
    },
  }

  const getBadgeVariant = (stock) => {
    if (stock > 40) return "success"
    if (stock > 20) return "warning"
    return "danger"
  }

  return (
    <div className="pl-4 xsx:ml-[250px] min-h-screen bg-gray-100">
      {loading ?
    <div className="flex justify-center items-center w-full h-screen"><LoadingSpinner /></div>
    :
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 text-red-700  bg-gradient-to-br from-red-200 to-rose-100 rounded-xl">
              <BarChartIcon className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-red-700">Product Dashboard</h1>
              <p className="text-gray-400 text-[14px] font-[600] mt-1">Monitor your inventory and sales performance</p>
            </div>
          </div>
        </motion.div>

        {/* Primary Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Products"
            value={products.length.toLocaleString()}
            icon={PackageIcon}
            trend="up"
            delay={0.1}
          />
          <StatCard title="Total Stock" value={totalStock.toLocaleString()} icon={ArchiveIcon} trend="up" delay={0.2} />
          <StatCard
            title="Total Value"
            value={`$${totalValue.toLocaleString()}`}
            icon={DollarIcon}
            trend="up"
            delay={0.3}
          />
          <StatCard title="Categories" value={categories.length} icon={LayersIcon} trend="neutral" delay={0.4} />
        </div>

        {/* Secondary Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Average Stock" value={Math.round(averageStock)} icon={TrendingUpIcon} delay={0.5} />
          <StatCard title="Average Price" value={`$${averagePrice.toFixed(2)}`} icon={TagIcon} delay={0.6} />
          <StatCard title="Highest Price" value={`$${maxPrice.toFixed(2)}`} icon={StarIcon} delay={0.7} />
          <StatCard title="Total Revenue" value={`$${totalPrice.toLocaleString()}`} icon={DollarIcon} delay={0.8} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ChartCard title="Product Prices" icon={TrendingUpIcon} delay={0.9}>
            <Line data={priceData} options={chartOptions} />
          </ChartCard>

          <ChartCard title="Stock Levels" icon={ArchiveIcon} delay={1.0}>
            <Bar data={stockData} options={chartOptions} />
          </ChartCard>
        </div>

        {/* Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TableCard title="Categories" icon={LayersIcon} delay={1.1}>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category Name
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Products
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category, index) => {
                  const productCount = products.filter((p) => p.category === category.name).length
                  return (
                    <motion.tr
                      key={category.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 1.2 + index * 0.1 }}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{category.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Badge variant="secondary">{productCount}</Badge>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </TableCard>

          <TableCard title="Top Products" icon={PackageIcon} delay={1.2}>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products
                  .sort((a, b) => b.price - a.price)
                  .slice(0, 5)
                  .map((product, index) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 1.3 + index * 0.1 }}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                        ${product.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Badge variant={getBadgeVariant(product.stock)}>{product.stock}</Badge>
                      </td>
                    </motion.tr>
                  ))}
              </tbody>
            </table>
          </TableCard>
        </div>
      </div>
      }
    </div>
  )
}

export default Dashboard
