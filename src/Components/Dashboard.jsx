import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend, ArcElement } from 'chart.js';
import { FaBoxes, FaChartPie, FaListAlt } from 'react-icons/fa';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ArcElement);

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

  // Prepare data for the bar chart (stock)
  const stockData = {
    labels: products.map(product => product.name),
    datasets: [
      {
        label: 'Stock',
        data: products.map(product => product.stock),
        backgroundColor: 'rgba(255, 0, 0, 0.6)',
      },
    ],
  };

  // Prepare data for the pie chart (prices)
  const priceData = {
    labels: products.map(product => product.name),
    datasets: [
      {
        label: 'Prices',
        data: products.map(product => product.price),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
      },
    ],
  };

  return (
    <div className='ml-[10px] min-h-screen bg-gray-100 xsx:ml-[260px] xsx:px-[20px] pb-[35px] pr-[12px] flex flex-col'>
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <FaBoxes className="mr-2" />
        Product Dashboard
      </h2>

      <div className="flex flex-col mb-6">
        <div className="md:w-full p-4">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <FaListAlt className="mr-2" />
            Product Stock
          </h3>
          <Bar data={stockData} options={{ responsive: true }} />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row mb-6">
        <div className="lg:w-1/2 p-4">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <FaChartPie className="mr-2" />
            Product Prices
          </h3>
          <Pie data={priceData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
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
                <tr key={category.id} className="hover:bg-gray-100 transition">
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
