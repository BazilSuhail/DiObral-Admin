import axios from "axios"
import { motion } from "framer-motion"
import {
    MdReceipt,
    MdCalendarToday,
    MdAttachMoney,
    MdInventory,
    MdLocalOffer,
    MdPercent,
    MdShoppingCart,
    MdCheckCircle,
} from "react-icons/md"
import { useLocation, useParams } from "react-router-dom"

export default function OrderDetails() {
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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    }

    //   const completeOrder = () => {
    //     // Implementation to be added
    //     console.log("Complete order clicked")
    //   }

    return (
        <main className="ml-4 xsx:ml-[230px] bg-gray-100 min-h-screen py-6">
            <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div variants={itemVariants} className="mb-8">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Order Details</h1>
                    <div className="w-20 h-1 bg-red-600 rounded-full"></div>
                </motion.div>

                {/* Order Summary Card */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8"
                >
                    {/* Order ID */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-50 rounded-lg">
                                <MdReceipt className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Order ID</p>
                                <p className="text-lg font-bold text-gray-900">{orderItem._id}</p>
                            </div>
                        </div>
                    </div>

                    {/* Order Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <MdCalendarToday className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Order Date</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {new Date(orderItem.orderDate).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <MdAttachMoney className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Total Amount</p>
                                <p className="text-2xl font-bold text-green-600">${orderItem.total.toFixed(2)}</p>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Items Section */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-red-50 rounded-lg">
                            <MdInventory className="w-6 h-6 text-red-600" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900">Items Ordered ({orderItem.items.length})</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {orderItem.items.map((item, index) => (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="flex gap-4 mb-4">
                                    <img
                                        src={`${process.env.REACT_APP_API_BASE_URL}/uploads/${item.image}`}
                                        alt={item.name}
                                        className="w-16 h-16 rounded-lg object-cover bg-gray-200"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 text-lg mb-1">{item.name}</h3>
                                        <p className="text-sm text-gray-500">Size: {item.size}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <MdLocalOffer className="w-4 h-4 text-red-500" />
                                            <span className="text-sm text-gray-600">Original Price</span>
                                        </div>
                                        <span className="line-through text-red-500 font-medium">${item.price.toFixed(2)}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <MdPercent className="w-4 h-4 text-green-600" />
                                            <span className="text-sm text-gray-600">Discounted Price</span>
                                        </div>
                                        <span className="text-green-600 font-bold text-lg">${item.discountedPrice.toFixed(2)}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <MdShoppingCart className="w-4 h-4 text-blue-600" />
                                            <span className="text-sm text-gray-600">Quantity</span>
                                        </div>
                                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                            {item.quantity}
                                        </span>
                                    </div>

                                    <div className="pt-2 border-t border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-700">Subtotal</span>
                                            <span className="font-bold text-gray-900">
                                                ${(item.discountedPrice * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Action Button */}
                <motion.div variants={itemVariants} className="flex justify-center md:justify-end">
                    <motion.button
                        onClick={completeOrder}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-3 bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        <MdCheckCircle className="w-6 h-6" />
                        Complete Order
                    </motion.button>
                </motion.div>
            </motion.div>
        </main>
    )
}

// import React from 'react';
// import { useLocation, useParams } from 'react-router-dom';
// import axios from 'axios';
// import { FaReceipt, FaCalendarAlt, FaDollarSign, FaTag, FaPercentage, FaBox, FaShoppingCart, FaRulerCombined } from 'react-icons/fa';

// const OrderDetails = () => {
//     const location = useLocation();
//     const { orderItem } = location.state || {};
//     const { userId } = useParams();

//     if (!orderItem) {
//         return <p className="text-red-600 font-semibold">No order details found.</p>;
//     }

//     const completeOrder = async () => {
//         try {
//             await axios.post(`${process.env.REACT_APP_API_BASE_URL}/completeorder/${userId}/${orderItem._id}`);
//             alert('Order completed successfully');
//         } catch (error) {
//             alert('Error completing order');
//         }
//     };

//     return (
//         <main className='ml-4 xsx:ml-72 mr-3 min-h-screen flex flex-col'>
//             <h1 className="text-3xl font-bold mt-6 mb-[10px] text-red-700">Order Details</h1>
//             <section className="mb-6 p-4 rounded-md">
//                 <h2 className="md:text-lg text-[20px] lg:text-2xl font-semibold text-gray-900 mb-4">
//                     <FaReceipt className='inline-block text-red-600 mr-2' />
//                     <span className='text-black font-[700]'>Order ID:</span>
//                     <span className='underline ml-[4px] md:text-lg text-[16px] lg:text-2xl underline-offset-2'>{orderItem._id}</span>
//                 </h2>
//                 <p className="text-gray-800 text-xl">
//                     <FaCalendarAlt className='inline-block text-red-600 mr-2' />
//                     <strong>Order Date:</strong> {new Date(orderItem.orderDate).toLocaleDateString()}
//                 </p>
//                 <p className="text-gray-800 mt-[15px] text-xl">
//                     <FaDollarSign className='inline-block text-red-600 mr-2' />
//                     <strong>Total:</strong>
//                     <span className='px-[15px] py-[1px] text-white font-bold ml-[15px] rounded-md bg-red-600'>
//                         ${orderItem.total.toFixed(2)}
//                     </span>
//                 </p>
//                 <div className='bg-gray-300 w-full h-[2px] my-[25px]'></div>
//                 <h3 className="text-xl font-bold text-gray-700 mb-[8px]">Items Ordered:</h3>
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//                     {orderItem.items.map((item) => (
//                         <div key={item._id} className="mb-4 border border-gray-300 bg-gray-100 p-4 rounded-lg transition duration-400 hover:bg-red-50 shadow-md">
//                             <p className="text-gray-900 text-lg">
//                                 <FaBox className='inline-block text-red-600 mr-2' />
//                                 <span className='mr-[8px] font-medium text-gray-700'>Name:</span> {item.name}
//                             </p>
//                             <p className="text-gray-900 text-lg">
//                                 <FaTag className='inline-block text-red-500 mr-2' />
//                                 <span className='mr-[8px] font-medium text-gray-700'>Price:</span>
//                                 <span className='line-through text-red-500'>${item.price.toFixed(2)}</span>
//                             </p>
//                             <p className="text-gray-900 text-lg">
//                                 <FaPercentage className='inline-block text-green-700 mr-2' />
//                                 <span className='mr-[8px] font-medium text-gray-700'>Discounted Price:</span>
//                                 <span className='text-green-600 font-bold'>${item.discountedPrice.toFixed(2)}</span>
//                             </p>
//                             <p className="text-gray-900 text-lg">
//                                 <FaShoppingCart className='inline-block text-red-600 mr-2' />
//                                 <span className='mr-[8px] font-medium text-gray-700'>Quantity:</span> {item.quantity}
//                             </p>
//                             <p className="text-gray-900 text-lg">
//                                 <FaRulerCombined className='inline-block text-red-600 mr-2' />
//                                 <span className='mr-[8px] font-medium text-gray-700'>Selected Size:</span> {item.size}
//                             </p>
//                         </div>
//                     ))}
//                 </div>

//                 <button
//                     className="bg-red-700 text-white px-4 py-2 rounded mt-4 hover:bg-red-600 transition duration-300"
//                     onClick={completeOrder}
//                 >
//                     Complete Order
//                 </button>
//             </section>
//         </main>

//     );
// };

// export default OrderDetails;
