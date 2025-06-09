import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  MdShoppingCart,
  MdInfo,
  MdCalendarToday,
  MdAttachMoney,
  MdInventory,
  MdVisibility,
  MdArrowBack, 
} from "react-icons/md"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"

export default function ShowOrders() {
    const { documentId } = useParams();
    const { userId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/completeorder/orders/${documentId}`);
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
 

  const handleGoBack = () => {
      navigate(-1);
   
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="ml-[10px] bg-gray-100 xsx:ml-[280px] xsx:px-[20px] min-h-screen pb-[35px] pr-[12px] flex flex-col"
    >
      {/* Header */}
      <motion.div variants={cardVariants} className="my-[20px]">
        <div className="flex items-center gap-4 mb-6">
          <motion.button
            onClick={handleGoBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
          >
            <MdArrowBack className="w-5 h-5 text-gray-600" />
          </motion.button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center">
              <MdShoppingCart className="mr-3 text-red-600" />
              Order History
            </h1>
            <div className="w-20 h-1 bg-red-600 rounded-full mt-2"></div>
          </div>
        </div>

      
      </motion.div>

{/* Summary Stats */}
      {order && (
        <motion.div variants={cardVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {order.orders.reduce((sum, order) => sum + order.items.length, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Items</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              ${order.orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Total Spent</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              ${(order.orders.reduce((sum, order) => sum + order.total, 0) / order.orders.length).toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Average Order</div>
          </div>
        </motion.div>
      )}


      {/* Orders Grid */}
      {order ? (
        <motion.div variants={containerVariants} className="grid grid-cols-1 mt-6 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {order.orders.map((orderItem, index) => (
            <motion.div
              key={orderItem._id}
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300"
            >
              {/* Order Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-red-50 rounded-lg">
                    <MdInfo className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Order {index + 1}</h3>
                    <p className="text-sm text-gray-500">{orderItem._id}</p>
                  </div>
                </div>
                
              </div>

              {/* Order Info Row */}
<div className="grid grid-cols-3 gap-4 mb-6">
  {/* Items */}
  <div className="col-span-1 bg-gray-100 rounded-lg py-2 px-4">
    <div className="flex items-center gap-2 mb-2">
      <MdInventory className="w-4 h-4 text-gray-500" />
      <span className="text-sm text-gray-600">Items:</span>
    <span className="text-md font-bold text-gray-900">{orderItem.items.length}</span>
    </div>
  </div>

  {/* Total */}
  <div className="col-span-2 bg-gray-100 rounded-lg py-2 px-4">
    <div className="flex items-center gap-2 mb-2">
      <MdAttachMoney className="w-4 h-4 text-gray-500" />
      <span className="text-sm text-gray-600">Total:</span>
    <span className="text-md font-bold ml-auto text-green-600">${orderItem.total.toFixed(2)}</span>
    </div>
  </div>
</div>


              {/* Order Date */}
              <div className="flex items-center gap-3 mb-6 p-3 bg-blue-50 rounded-lg">
                <MdCalendarToday className="w-4 h-4 text-blue-600" />
                <div>
                  <span className="text-[12px] text-blue-600 font-medium">Order Date</span>
                  <p className="font-semibold text-blue-800">
                    {new Date(orderItem.orderDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Items List */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Order Items
                </h4>
                <div className="space-y-2">
                  {orderItem.items.slice(0, 1).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                  {orderItem.items.length > 1 ? (
                    <div className="text-center py-2">
                      <span className="text-xs text-red-500 bg-red-100 px-3 py-1 rounded-full">
                        +{orderItem.items.length - 1} more items
                      </span>
                    </div>
                  ):
                   (
                    <div className="text-center py-2">
                      <span className="text-xs text-green-500 bg-green-100 px-3 py-1 rounded-full">
                        No more items
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">${(orderItem.total * 0.9).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-gray-600">Tax & Fees</span>
                  <span className="font-medium text-gray-900">${(orderItem.total * 0.1).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-lg text-green-600">${orderItem.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Button */}
              <motion.button
                onClick={() => handleViewDetails(orderItem)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 font-medium"
              >
                <MdVisibility className="w-4 h-4" />
                View Full Details
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          variants={cardVariants}
          className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-gray-200"
        >
          <MdShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium text-lg">No order details found.</p>
          <p className="text-gray-400 text-sm">This user hasn't placed any orders yet.</p>
        </motion.div>
      )}

          </motion.div>
  )
}


// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { FaShoppingCart, FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';

// const ShowOrders = () => {
//     const { documentId } = useParams();
//     const { userId } = useParams();
//     const [order, setOrder] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchOrder = async () => {
//             try {
//                 const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/completeorder/orders/${documentId}`);
//                 setOrder(response.data);
//             } catch (err) {
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchOrder();
//     }, [documentId]);

//     if (loading) {
//         return <p className="text-red-300 font-semibold">Loading...</p>;
//     }

//     if (error) {
//         return <p className="text-red-300 font-semibold">Error: {error}</p>;
//     }

//     const handleViewDetails = (orderItem) => {
//         navigate(`/${userId}/order-details`, { state: { orderItem } });
//     };

//     return (
//         <div className='ml-[10px] bg-gray-100 xsx:ml-[260px] xsx:px-[20px] min-h-screen pb-[35px] pr-[12px] flex flex-col'>
//             <h1 className='text-[28px] my-[20px] underline underline-offset-2  text-red-900 font-bold flex items-center'>
//                     <FaShoppingCart className='mr-2' />
//                     Order Details
//                 </h1>

//             {order ? (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {order.orders.map((orderItem, index) => (
//                         <div key={orderItem._id} className="bg-white p-4 rounded-lg shadow-lg">
//                             <h3 className="text-[30px] mb-[15px] font-semibold text-red-900 flex items-center">
//                                 <FaInfoCircle className="text-red-800 mr-2" />
//                                 <span className='underline underline-offset-4'>Order {index + 1}</span>
//                             </h3>
//                             <p className="mt-1 flex items-center">
//                                 <FaShoppingCart className="text-red-800 mr-2" />
//                                 <strong className='mr-[8px] text-red-700 fomt-[500]'>Items Count:</strong> {orderItem.items.length}
//                             </p>
//                             <p className="mt-1 flex items-center">
//                                 <FaCalendarAlt className="text-red-800 mr-2" />
//                                 <strong className='mr-[8px] text-red-700 fomt-[500]'>Order Date:</strong> {new Date(orderItem.orderDate).toLocaleDateString()}
//                             </p>
//                             <p className="mt-1 flex items-center">
//                                 <FaShoppingCart className="text-red-800 mr-2" />
//                                 <strong className='mr-[8px] text-red-700 fomt-[500]'>Total:</strong> ${orderItem.total.toFixed(2)}
//                             </p>
//                             <button
//                                 className="bg-red-700 mt-[20px] text-white px-4 text-[14px] py-[5px] rounded-lg hover:bg-red-900 transition duration-300 flex items-center"
//                                 onClick={() => handleViewDetails(orderItem)}
//                             >
//                                 <FaInfoCircle className="text-white mr-2" />
//                                 View Order Details
//                             </button>
//                         </div>
//                     ))}
//                 </div>
//             ) : (
//                 <p className="text-red-300 font-semibold">No order details found.</p>
//             )}
//         </div>
//     );
// };

// export default ShowOrders;
