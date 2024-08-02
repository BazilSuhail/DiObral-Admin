import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ShowOrders = () => {
    const { documentId } = useParams();
    const { userId } = useParams();
    //console.log(userId);
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
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    const handleViewDetails = (orderItem) => {
        navigate(`/${userId}/order-details`, { state: { orderItem } });
    };

    return (
        <div className='ml-[10px] xsx:ml-[285px] mr-[12px] flex flex-col'>  
            <h1 className="text-2xl font-bold mb-4">Order Details</h1>
            {order ? (
                <div>
                    <h2 className="text-xl font-semibold">Order ID: {order._id.$oid}</h2>
                    {order.orders.map((orderItem, index) => (
                        <div key={orderItem._id.$oid} className="mb-4 border p-4 rounded-md shadow-md">
                            <h3 className="text-lg font-semibold">Order {index + 1}</h3>
                            <p><strong>Items Count:</strong> {orderItem.items.length}</p>
                            <p><strong>Order Date:</strong> {new Date(orderItem.orderDate.$date).toLocaleDateString()}</p>
                            <p><strong>Total:</strong> ${orderItem.total}</p>
                            <p><strong>Order ID:</strong> {orderItem._id.$oid}</p>
                            <p><strong>Order Number:</strong> {index}</p>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                                onClick={() => handleViewDetails(orderItem)}
                            >
                                View Order Details
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No order details found.</p>
            )}
        </div>
    );
};

export default ShowOrders;
