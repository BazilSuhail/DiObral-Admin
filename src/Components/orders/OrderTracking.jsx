import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { MdPerson } from 'react-icons/md';
import { motion } from 'framer-motion';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PaginatedBarChart = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;

    useEffect(() => {
        const fetchUsersWithOrders = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/completeorder/users-with-orders`);
                setUsers(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsersWithOrders();
    }, []);

    if (loading) {
        return <p></p>;
    }

    if (error) {
        return <p className='ml-[10px] min-h-screen bg-gray-100 xsx:ml-[260px] xsx:px-[20px] pb-[35px] pr-[12px] flex flex-col'>Error: {error}</p>;
    }

    // Pagination logic
    const totalPages = Math.ceil(users.length / usersPerPage);
    const startIndex = (currentPage - 1) * usersPerPage;
    const selectedUsers = users.slice(startIndex, startIndex + usersPerPage);

    // Data for Bar Chart
    const data = {
        labels: selectedUsers.map(user => user.fullName),
        datasets: [
            {
                label: 'Orders Placed',
                data: selectedUsers.map(user => parseInt(user.orderCount, 10)),
                backgroundColor: 'rgba(220, 38, 38, 0.6)',
                borderColor: 'rgba(220, 38, 38, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0,
                },
            },
        },
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
        },
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="ml-[10px] min-h-screen bg-gray-100 xsx:ml-[260px] xsx:px-[20px] pt-[15px] pb-[35px] pr-[12px] flex flex-col">
            <div className='my-[8px] flex flex-col w-[100%] pb-[35px] px-[15px] justify-center rounded-xl overflow-x-auto'>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-8"
                >
                    <h1 className="text-2xl md:text-2xl font-bold text-gray-900 mb-2 flex items-center">
                        <MdPerson className="mr-3 text-red-600" />
                        Orders/ User
                    </h1>
                    <div className="w-20 h-1 bg-red-600 rounded-full"></div>
                </motion.div>

                <div className="mb-4 p-4 bg-white rounded-lg shadow-md">
                    <Bar data={data} options={options} />
                </div>

                <div className="flex justify-center space-x-4 mt-4">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            className={`px-4 py-2 rounded-md ${currentPage === index + 1 ? 'bg-red-900 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-red-700`}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PaginatedBarChart;
