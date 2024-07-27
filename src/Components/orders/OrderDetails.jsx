import React from 'react';
import { useLocation } from 'react-router-dom';

const OrderDetails = () => {
    const location = useLocation();
    const { orderItem } = location.state || {};

    if (!orderItem) {
        return <p>No order details found.</p>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Order Details</h1>
            <div className="mb-4 border p-4 rounded-md shadow-md">
                <h2 className="text-xl font-semibold">Order ID: {orderItem._id.$oid}</h2>
                <p><strong>Order Date:</strong> {new Date(orderItem.orderDate.$date).toLocaleDateString()}</p>
                <p><strong>Total:</strong> ${orderItem.total}</p>
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Items:</h3>
                    {orderItem.items.map((item) => (
                        <div key={item._id.$oid} className="mb-4 border p-4 rounded-md shadow-md">
                            <p><strong>Name:</strong> {item.name}</p>
                            <p><strong>Price:</strong> ${item.price}</p>
                            <p><strong>Discounted Price:</strong> ${item.discountedPrice}</p>
                            <p><strong>Quantity:</strong> {item.quantity}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
