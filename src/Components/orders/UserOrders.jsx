import React, { useEffect, useState } from 'react';
import axios from 'axios';
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

    const handleViewOrders = (documentId) => {
        navigate(`/admin-orders-list/orders/${documentId}`);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Users with Orders</h1>
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                <thead>
                    <tr className="bg-gray-100 border-b">
                        <th className="py-2 px-4 text-left">User ID</th>
                        <th className="py-2 px-4 text-left">Full Name</th>
                        <th className="py-2 px-4 text-left">Orders Placed</th>
                        <th className="py-2 px-4 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.documentId} className="border-b">
                            <td className="py-2 px-4">{user.userId}</td>
                            <td className="py-2 px-4">{user.fullName}</td>
                            <td className="py-2 px-4">{user.orderCount}</td>
                            <td className="py-2 px-4">
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                    onClick={() => handleViewOrders(user.documentId)}
                                >
                                    View Orders
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UsersOrders;
