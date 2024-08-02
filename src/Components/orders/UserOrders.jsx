import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GrFormView } from "react-icons/gr";
import { useNavigate } from 'react-router-dom';

const UsersOrders = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch user data from the server
        const fetchUsersWithOrders = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/completeorder/users-with-orders'); // Adjust the endpoint as necessary
                const fetchedUsers = response.data;

                // Log each documentId and their associated orders
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
        <div className='ml-[10px] xsx:ml-[285px] mr-[12px] flex flex-col'>

            <div className='my-[8px] flex flex-col w-[100%] pb-[35px] px-[15px] justify-center border border-red-200 bg-red-50 rounded-xl overflow-x-auto'>

            <h2 className='text-[24px] mt-[25px] mb-[5px] text-red-900 font-bold '>User's Orders</h2>

                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-lg text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-sm text-red-900 uppercase bg-gray-50 dark:bg-red-900 dark:text-red-200"></thead>

                        <thead className="text-sm text-red-900 uppercase bg-gray-50 dark:bg-red-900 dark:text-red-200">
                            <tr>
                                <th scope="col" className="whitespace-nowrap text-center px-6 py-3">Full Name</th>
                                <th scope="col" className="whitespace-nowrap text-center px-6 py-3">Email</th>
                                <th scope="col" className="whitespace-nowrap text-center px-6 py-3">Contact</th>
                                <th scope="col" className="whitespace-nowrap text-center px-6 py-3">Orders Placed</th>
                                <th scope="col" className="whitespace-nowrap text-center px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.documentId} className='text-center odd:bg-white even:bg-red-100 text-custom-blue border-b'>
                                    <td className="py-2 px-4 font-bold text-red-900">{user.fullName}</td>
                                    <td className="whitespace-nowrap font-medium text-red-700 underline text-center px-6 py-4">{user.email}</td>
                                    <td className="whitespace-nowrap text-center px-6 py-4">{user.contact}</td>
                                    <td className="whitespace-nowrap text-center px-6 py-4">{user.orderCount}</td>
                                    <td className="py-2 px-4  text-center">
                                        <button
                                            className="bg-red-900 text-red-100 text-[15px] font-semibold rounded-[25px] flex items-center pl-[5px] pr-[16px] py-[2px] hover:bg-red-600"
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
