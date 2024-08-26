import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';

const OrderDetails = () => {
    const location = useLocation();
    const { orderItem } = location.state || {};
    const { userId } = useParams();

    if (!orderItem) {
        return <p className="text-red-600 font-semibold">No order details found.</p>;
    }

    const completeOrder = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/completeorder/${userId}/${orderItem._id}`);
            alert('Order completed successfully');
            // Optionally, redirect or update state
        } catch (error) {
            alert('Error completing order');
        }
    };

    return (
        <div className='ml-4 xsx:ml-72 mr-3 flex flex-col'>
            <h1 className="text-3xl font-bold mt-6 mb-[10px] text-red-700">Order Details</h1>
            <div className="mb-6 border border-red-800 bg-gradient-to-br from-custom-red via-red-900 to-red-950 p-4 rounded-md shadow-lg">
                <h2 className="text-2xl font-semibold text-red-100 mb-4"><span className='text-red-400'>Order ID:</span> <span className='underline underline-offset-2'>{orderItem._id}</span></h2>
                <p className="text-white text-xl"><strong>Order Date:</strong> {new Date(orderItem.orderDate).toLocaleDateString()}</p>
                <p className="text-white mt-[15px] text-xl"><strong>Total:</strong> <span className='px-[15px] py-[1px] text-red-800 font-bold ml-[15px] rounded-md bg-red-300'> ${orderItem.total.toFixed(2)}</span></p>
                <div className="mt-4">
                    <h3 className="text-xl font-bold text-red-200 mb-[8px]">Items Orded:</h3>
                    {orderItem.items.map((item) => (
                        <div key={item._id} className="mb-4 border border-red-100 bg-red-900 p-4 rounded-lg hover:scale-95 transition duration-400 shadow-md">
                            <p className="text-red-100 text-lg"><span className='mr-[8px] font-medium text-red-300'>Name:</span> {item.name}</p>
                            <p className="text-red-100 text-lg"><span className='mr-[8px] font-medium text-red-300'>Price:</span> ${item.price.toFixed(2)}</p>
                            <p className="text-red-100 text-lg"><span className='mr-[8px] font-medium text-red-300'>Discounted Price:</span> ${item.discountedPrice.toFixed(2)}</p>
                            <p className="text-red-100 text-lg"><span className='mr-[8px] font-medium text-red-300'>Quantity:</span> {item.quantity}</p>
                            <p className="text-red-100 text-lg"><span className='mr-[8px] font-medium text-red-300'>Selected:</span> {item.size}</p>
                        </div>
                    ))}
                </div>
                <button
                    className="bg-red-600 text-white px-4 py-2 rounded mt-4 hover:bg-red-700 transition duration-300"
                    onClick={completeOrder}
                >
                    Complete Order
                </button>
            </div>
        </div>
    );
};

export default OrderDetails;
