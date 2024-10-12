import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { FaBoxes, FaChartLine, FaListAlt, FaMoneyBillWave } from 'react-icons/fa';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend);

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/fetchproducts/products`);
        const categoryResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/category`);

        setProducts(productResponse.data);
        setCategories(categoryResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Calculate total stock, total price, and total value
  const totalStock = products.reduce((acc, product) => acc + product.stock, 0);
  const totalPrice = products.reduce((acc, product) => acc + product.price, 0);
  const totalValue = totalStock * totalPrice;

  // Prepare data for the bar chart (stock)
  const stockData = {
    labels: products.map((_, index) => `${index + 1}`), // Product numbers for the x-axis
    datasets: [
      {
        label: 'Stock',
        data: products.map(product => product.stock),
        backgroundColor: 'rgba(255, 0, 0, 0.6)',
      },
    ],
  };

  // Prepare data for the line chart (prices)
  const priceData = {
    labels: products.map((_, index) => `${index + 1}`), // Use product numbers for the x-axis
    datasets: [
      {
        label: 'Prices',
        data: products.map(product => product.price),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true, // Fill under the line
        tension: 0.1, // Smooth curve
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const product = products[tooltipItem.dataIndex];
            return `${product.name}: $${product.price}`; // Show name and price in tooltip
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Product Number', // Label for the x-axis
        },
      },
      y: {
        title: {
          display: true,
          text: 'Price ($)', // Label for the y-axis
        },
      },
    },
  };

  return (
    <div className='ml-[10px] min-h-screen bg-gray-100 xsx:ml-[260px] xsx:px-[20px] pb-[35px] pr-[12px] flex flex-col'>
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <FaBoxes className="mr-2" />
        Product Dashboard
      </h2>

      {/* Stock Information Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <FaListAlt className="text-2xl mr-2" />
          <div>
            <h4 className="font-semibold">Total Stock</h4>
            <p className="text-lg">{totalStock}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <FaMoneyBillWave className="text-2xl mr-2" />
          <div>
            <h4 className="font-semibold">Total Sum of Prices</h4>
            <p className="text-lg">${totalPrice.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <FaChartLine className="text-2xl mr-2" />
          <div>
            <h4 className="font-semibold">Total Value of Products</h4>
            <p className="text-lg">${totalValue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col mb-6">
        <div className="md:w-full p-4">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <FaListAlt className="mr-2" />
            Product Stock
          </h3>
          <Bar data={stockData} options={chartOptions} />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row mb-6">
        <div className="lg:w-1/2 p-4">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <FaChartLine className="mr-2" />
            Product Prices
          </h3>
          <Line data={priceData} options={chartOptions} /> {/* Line chart */}
        </div>

        <div className="lg:w-1/2 p-4">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <FaListAlt className="mr-2" />
            Product Categories
          </h3>
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 border-b">No.</th>
                <th className="py-2 px-4 border-b">Category Name</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category, index) => (
                <tr key={index} className="hover:bg-gray-100 transition">
                  <td className="py-2 px-4 border-b">{index + 1}</td>
                  <td className="py-2 px-4 border-b">{category.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
