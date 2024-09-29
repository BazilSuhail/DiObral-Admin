import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaReceipt, FaCalendarAlt, FaDollarSign, FaTag, FaPercentage, FaBox, FaShoppingCart, FaRulerCombined } from 'react-icons/fa';

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
        } catch (error) {
            alert('Error completing order');
        }
    };

    return (
        <main className='ml-4 xsx:ml-72 mr-3 min-h-screen flex flex-col'>
            <h1 className="text-3xl font-bold mt-6 mb-[10px] text-red-700">Order Details</h1>
            <section className="mb-6 p-4 rounded-md">
                <h2 className="md:text-lg text-[20px] lg:text-2xl font-semibold text-gray-900 mb-4">
                    <FaReceipt className='inline-block text-red-600 mr-2' />
                    <span className='text-black font-[700]'>Order ID:</span>
                    <span className='underline ml-[4px] md:text-lg text-[16px] lg:text-2xl underline-offset-2'>{orderItem._id}</span>
                </h2>
                <p className="text-gray-800 text-xl">
                    <FaCalendarAlt className='inline-block text-red-600 mr-2' />
                    <strong>Order Date:</strong> {new Date(orderItem.orderDate).toLocaleDateString()}
                </p>
                <p className="text-gray-800 mt-[15px] text-xl">
                    <FaDollarSign className='inline-block text-red-600 mr-2' />
                    <strong>Total:</strong>
                    <span className='px-[15px] py-[1px] text-white font-bold ml-[15px] rounded-md bg-red-600'>
                        ${orderItem.total.toFixed(2)}
                    </span>
                </p>
                <div className='bg-gray-300 w-full h-[2px] my-[25px]'></div>
                <h3 className="text-xl font-bold text-gray-700 mb-[8px]">Items Ordered:</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {orderItem.items.map((item) => (
                        <div key={item._id} className="mb-4 border border-gray-300 bg-gray-100 p-4 rounded-lg transition duration-400 hover:bg-red-50 shadow-md">
                            <p className="text-gray-900 text-lg">
                                <FaBox className='inline-block text-red-600 mr-2' />
                                <span className='mr-[8px] font-medium text-gray-700'>Name:</span> {item.name}
                            </p>
                            <p className="text-gray-900 text-lg">
                                <FaTag className='inline-block text-red-500 mr-2' />
                                <span className='mr-[8px] font-medium text-gray-700'>Price:</span>
                                <span className='line-through text-red-500'>${item.price.toFixed(2)}</span>
                            </p>
                            <p className="text-gray-900 text-lg">
                                <FaPercentage className='inline-block text-green-700 mr-2' />
                                <span className='mr-[8px] font-medium text-gray-700'>Discounted Price:</span>
                                <span className='text-green-600 font-bold'>${item.discountedPrice.toFixed(2)}</span>
                            </p>
                            <p className="text-gray-900 text-lg">
                                <FaShoppingCart className='inline-block text-red-600 mr-2' />
                                <span className='mr-[8px] font-medium text-gray-700'>Quantity:</span> {item.quantity}
                            </p>
                            <p className="text-gray-900 text-lg">
                                <FaRulerCombined className='inline-block text-red-600 mr-2' />
                                <span className='mr-[8px] font-medium text-gray-700'>Selected Size:</span> {item.size}
                            </p>
                        </div>
                    ))}
                </div>

                <button
                    className="bg-red-700 text-white px-4 py-2 rounded mt-4 hover:bg-red-600 transition duration-300"
                    onClick={completeOrder}
                >
                    Complete Order
                </button>
            </section>
        </main>

    );
};

export default OrderDetails;
