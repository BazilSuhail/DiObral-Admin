import React from 'react';
import { useLocation,useParams } from 'react-router-dom';
import axios from 'axios';

const OrderDetails = () => {
    const location = useLocation();
    const { orderItem } = location.state || {};
    const { userId } = useParams();
    //console.log(userId);
    //console.log(orderItem);

    if (!orderItem) {
        return <p>No order details found.</p>;
    }

    const completeOrder = async () => {
        try {
            await axios.post(`http://localhost:3001/api/completeorder/${userId}/${orderItem._id}`);
            alert('Order completed successfully');
            // Optionally, redirect or update state
        } catch (error) {
            alert('Error completing order');
        }
    };

    return (
        <div className='ml-[10px] xsx:ml-[285px] mr-[12px] flex flex-col'>
            <h1 className="text-2xl font-bold mb-4">Order Details</h1>
            <div className="mb-4 border p-4 rounded-md shadow-md">
                <h2 className="text-xl font-semibold">Order ID: {orderItem._id}</h2>
                <p><strong>Order Date:</strong> {new Date(orderItem.orderDate).toLocaleDateString()}</p>
                <p><strong>Total:</strong> ${orderItem.total}</p>
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Items:</h3>
                    {orderItem.items.map((item) => (
                        <div key={item._id} className="mb-4 border p-4 rounded-md shadow-md">
                            <p><strong>Name:</strong> {item.name}</p>
                            <p><strong>Price:</strong> ${item.price}</p>
                            <p><strong>Discounted Price:</strong> ${item.discountedPrice}</p>
                            <p><strong>Quantity:</strong> {item.quantity}</p>
                        </div>
                    ))}
                </div>
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded mt-4"
                    onClick={completeOrder}
                >
                    Complete Order
                </button>
            </div>
        </div>
    );
};

export default OrderDetails;
