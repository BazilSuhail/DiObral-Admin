import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaShoppingCart, FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';

const ShowOrders = () => {
    const { documentId } = useParams();
    const { userId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/completeorder/orders/${documentId}`);
                setOrder(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [documentId]);

    if (loading) {
        return <p className="text-red-300 font-semibold">Loading...</p>;
    }

    if (error) {
        return <p className="text-red-300 font-semibold">Error: {error}</p>;
    }

    const handleViewDetails = (orderItem) => {
        navigate(`/${userId}/order-details`, { state: { orderItem } });
    };

    return (
        <div className='ml-[10px] xsx:ml-[285px] mr-[12px] flex flex-col'>
            <h1 className="text-3xl font-bold mt-[25px] mb-[15px] text-red-600 flex items-center">
                <FaShoppingCart className="text-red-400 mr-2" />
                Order Details
            </h1>
            {order ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {order.orders.map((orderItem, index) => (
                        <div key={orderItem._id.$oid} className="border border-red-800 bg-gradient-to-tr from-custom-red via-red-900 to-red-950 p-4 rounded-lg shadow-lg">
                            <h3 className="text-[30px] mb-[15px] font-semibold text-red-100 flex items-center">
                                <FaInfoCircle className="text-red-400 mr-2" />
                                <span className='underline underline-offset-4'>Order {index + 1}</span>
                            </h3>
                            <p className="mt-1 text-red-200 flex items-center">
                                <FaShoppingCart className="text-red-400 mr-2" />
                                <strong className='mr-[8px]'>Items Count:</strong> {orderItem.items.length}
                            </p>
                            <p className="mt-1 text-red-200 flex items-center">
                                <FaCalendarAlt className="text-red-400 mr-2" />
                                <strong className='mr-[8px]'>Order Date:</strong> {new Date(orderItem.orderDate).toLocaleDateString()}
                            </p>
                            <p className="mt-1 text-red-200 flex items-center">
                                <FaShoppingCart className="text-red-400 mr-2" />
                                <strong className='mr-[8px]'>Total:</strong> ${orderItem.total.toFixed(2)}
                            </p>
                            <button
                                className="bg-red-700 mt-[20px] text-white px-4 py-2 rounded-lg hover:bg-red-800 transition duration-300 flex items-center"
                                onClick={() => handleViewDetails(orderItem)}
                            >
                                <FaInfoCircle className="text-white mr-2" />
                                View Order Details
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-red-300 font-semibold">No order details found.</p>
            )}
        </div>
    );
};

export default ShowOrders;
