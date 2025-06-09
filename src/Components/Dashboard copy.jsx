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
import { FaListAlt, FaMoneyBillWave, FaChartLine, FaTag, FaBoxOpen, FaStar, FaArrowUp, FaArrowDown, FaBoxes } from 'react-icons/fa';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend);

const StatisticCard = ({ title, value, icon: Icon, backgroundColor = 'bg-red-950', textColor = 'text-white' }) => {
  return (
    <div className={`${backgroundColor} rounded-2xl ${textColor} p-[15px] w-full flex flex-row xsx:w-[90%]`}>
      <Icon className='mr-[5px] text-[44px] text-gray-100 bg-red-700 border-red-200 border-[2px] p-[9px] rounded-full' />
      <div className='ml-[15px]'>
        <p className='font-bold text-gray-300 text-[12px]'>{title}</p>
        <p className='font-medium text-gray-200 text-[22px]'>{value}</p>
      </div>
    </div>
  );
};

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

  const totalStock = products.reduce((acc, product) => acc + product.stock, 0);
  const totalPrice = products.reduce((acc, product) => acc + product.price, 0);
  const totalValue = totalStock * totalPrice;

  const averageStock = totalStock / products.length || 0;
  const averagePrice = totalPrice / products.length || 0;
  const maxPrice = Math.max(...products.map(product => product.price), 0); 

  const stockData = {
    labels: products.map((_, index) => `${index + 1}`),
    datasets: [
      {
        label: 'Stock',
        data: products.map(product => product.stock),
        backgroundColor: 'rgba(255, 0, 0, 0.6)',
      },
    ],
  };

  const priceData = {
    labels: products.map((_, index) => `${index + 1}`),
    datasets: [
      {
        label: 'Prices',
        data: products.map(product => product.price),
        borderColor: 'rgba(183, 28, 28, 1)',
        backgroundColor: 'rgba(183, 28, 28, 0.2)',
        fill: true,
        tension: 0.1,
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
            return `${product.name}: $${product.price}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Product Number',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Price ($)',
        },
      },
    },
  };

  return (
    <div className='ml-[10px]   bg-gray-100 xsx:ml-[260px] xsx:px-[20px] pb-[35px] pr-[12px] flex flex-col'>
      <h2 className='text-red-900 font-[700] my-[12px] justify-center text-2xl flex items-center text-center mt-[10px]'> <FaBoxes className="mr-2" /> Product Dashboard</h2>
      <div className='w-[95%] mb-[15px] mx-auto h-[3px] bg-red-900'></div>

      <div className='grid w-full grid-cols-1 xsx:grid-cols-3 gap-y-[8px] mx-auto bg-white rounded-xl xl:px-[25px] py-[18px]'>
        <StatisticCard title="Total Stock" value={totalStock} icon={FaListAlt} />
        <StatisticCard title="Total Price Of All Products" value={`$${parseInt(totalPrice)}`} icon={FaMoneyBillWave} />
        <StatisticCard title="Total Stock Price" value={`$${parseInt(totalValue)}`} icon={FaTag} />
        <StatisticCard title="Total Categories" value={categories.length} icon={FaBoxOpen}   />
        <StatisticCard title="Total Products" value={products.length} icon={FaStar}  />
        <StatisticCard title="Average Stock" value={averageStock.toFixed(2)}  icon={FaChartLine} />
        <StatisticCard title="Maximum Price" value={`$${maxPrice.toFixed(2)}`} icon={FaArrowUp} />
        <StatisticCard title="Average Product Price" value={`$${averagePrice.toFixed(2)}`} icon={FaArrowDown} />

      </div>

      <div className="flex flex-col lg:flex-row gap-x-[15px] my-6 ">
        <div className="lg:w-1/2 p-4 bg-white rounded-xl">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <FaChartLine className="mr-2" />
            Product Prices
          </h3>
          <Line data={priceData} options={chartOptions} />
        </div>

        <div className="lg:w-1/2 p-4 bg-white rounded-xl">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <FaListAlt className="mr-2" />
            Product Categories
          </h3>
          <div className='rounded-xl overflow-hidden border border-gray-300'>
            <table className="min-w-full text-gray-800 bg-white">
              <thead className="bg-red-800 text-white">
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
      <div className="flex flex-col mb-6">
        <div className="md:w-full p-4 bg-white rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <FaListAlt className="mr-2" />
            Product Stock
          </h3>
          <Bar data={stockData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
