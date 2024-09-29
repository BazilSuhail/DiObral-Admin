import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GrFormView } from "react-icons/gr";
import { useNavigate } from 'react-router-dom';
import { FaClipboardList } from 'react-icons/fa';

const UsersOrders = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsersWithOrders = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/completeorder/users-with-orders`);
                const fetchedUsers = response.data;
                fetchedUsers.forEach(user => {
                    console.log(`Document ID: ${user.documentId}, Orders Count: ${user.orderCount}`);
                });

                setUsers(fetchedUsers);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsersWithOrders();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    const handleViewOrders = (documentId, userId) => {
        navigate(`/admin-orders-list/${userId}/${documentId}`);
    };

    return (
        <div className='ml-[10px] min-h-screen bg-gray-100 xsx:ml-[260px] xsx:px-[20px] pb-[35px] pr-[12px] flex flex-col'>
            <div className='my-[8px] flex flex-col w-[100%] pb-[35px] px-[15px] justify-center rounded-xl overflow-x-auto'>

                <h2 className='text-[28px] my-[20px] underline underline-offset-2  text-red-900 font-bold flex items-center'>
                    <FaClipboardList className='mr-2' />
                    User's Orders
                </h2>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-lg text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-sm text-red-900 uppercase bg-gray-50 dark:bg-red-900 dark:text-red-200"></thead>

                        <thead className="text-sm text-red-900 uppercase bg-gray-50 dark:bg-red-900 dark:text-red-100">
                            <tr>
                                <th scope="col" className="whitespace-nowrap text-center px-6 py-3">Full Name</th>
                                <th scope="col" className="whitespace-nowrap text-center px-6 py-3">Email</th>
                                <th scope="col" className="whitespace-nowrap text-center px-6 py-3">Contact</th>
                                <th scope="col" className="whitespace-nowrap text-center px-6 py-3">Orders Placed</th>
                                <th scope="col" className="whitespace-nowrap pl-[52px] py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.documentId} className='text-center odd:bg-white even:bg-red-100 text-custom-blue border-b'>
                                    <td className="py-2 px-4 whitespace-nowrap font-bold text-red-900">{user.fullName}</td>
                                    <td className="whitespace-nowrap font-medium text-red-700 underline text-center px-6 py-4">{user.email}</td>
                                    <td className="whitespace-nowrap text-center px-6 py-4">{user.contact}</td>
                                    <td className="whitespace-nowrap text-center px-6 py-4">{user.orderCount}</td>
                                    <td className="py-2 px-4 mx-auto">
                                        <button
                                            className="bg-red-900 whitespace-nowrap text-red-100 text-[15px] font-semibold rounded-[25px] flex items-center pl-[5px] pr-[16px] py-[2px] hover:bg-red-600"
                                            onClick={() => handleViewOrders(user.documentId, user.userId)}
                                        >
                                            <GrFormView size={30} />
                                            View Orders
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UsersOrders;
