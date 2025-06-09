import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { MdPerson, MdEmail, MdPhone, MdShoppingBag, MdVisibility, MdSearch } from "react-icons/md"
import { useNavigate } from "react-router-dom"
import axios from "axios"


export default function UsersOrders() {
  //const [users] = useState(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")

  const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsersWithOrders = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/completeorder/users-with-orders`);
                const fetchedUsers = response.data;
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


//   const handleViewOrders = (documentId, userId) => {
//     // Implementation to be added
//     console.log(`View orders for user: ${documentId}, ${userId}`)
//   }

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="ml-[10px] min-h-screen bg-gray-50 xsx:ml-[280px] xsx:px-[20px] pb-[35px] pr-[12px] flex flex-col"
    >
      <div className="my-[20px] flex flex-col w-full pb-[35px] px-[15px] justify-center rounded-xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <MdPerson className="mr-3 text-red-600" />
            User Orders
          </h1>
          <div className="w-20 h-1 bg-red-600 rounded-full"></div>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4 mb-6"
        >
          <div className="relative flex-grow">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            />
          </div>
         
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* Table Header */}
              <thead>
                <tr className="bg-gradient-to-r from-red-700 to-red-800 text-white">
                  <th className="px-6 py-4 text-left font-medium">
                    <div className="flex items-center">
                      <MdPerson className="mr-2" />
                      Full Name
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left font-medium">
                    <div className="flex items-center">
                      <MdEmail className="mr-2" />
                      Email
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left font-medium">
                    <div className="flex items-center">
                      <MdPhone className="mr-2" />
                      Contact
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left font-medium">
                    <div className="flex items-center">
                      <MdShoppingBag className="mr-2" />
                      Orders
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left font-medium">Actions</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user.documentId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      className="border-b border-gray-100 hover:bg-red-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{user.fullName}</div>
                        <div className="text-xs text-gray-500">ID: {user.userId}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-blue-600 hover:underline">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{user.contact}</td>
                      <td className="px-6 py-4">
                        <div className="inline-flex items-center justify-center px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                          {user.orderCount}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleViewOrders(user.documentId, user.userId)}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200"
                        >
                          <MdVisibility />
                          <span>View</span>
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      No users found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Pagination */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-between items-center mt-6"
        >
          <div className="text-sm text-gray-600">
            Showing {filteredUsers.length} of {users.length} users
          </div>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Previous
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Next
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { GrFormView } from "react-icons/gr";
// import { useNavigate } from 'react-router-dom';
// import { FaClipboardList } from 'react-icons/fa';

// const UsersOrders = () => {
//     const [users, setUsers] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchUsersWithOrders = async () => {
//             try {
//                 const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/completeorder/users-with-orders`);
//                 const fetchedUsers = response.data;
//                 fetchedUsers.forEach(user => {
//                     console.log(`Document ID: ${user.documentId}, Orders Count: ${user.orderCount}`);
//                 });

//                 setUsers(fetchedUsers);
//             } catch (err) {
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchUsersWithOrders();
//     }, []);

//     if (loading) {
//         return <p>Loading...</p>;
//     }

//     if (error) {
//         return <p>Error: {error}</p>;
//     }

//     const handleViewOrders = (documentId, userId) => {
//         navigate(`/admin-orders-list/${userId}/${documentId}`);
//     };

//     return (
//         <div className='ml-[10px] min-h-screen bg-gray-100 xsx:ml-[260px] xsx:px-[20px] pb-[35px] pr-[12px] flex flex-col'>
//             <div className='my-[8px] flex flex-col w-[100%] pb-[35px] px-[15px] justify-center rounded-xl overflow-x-auto'>

//                 <h2 className='text-[28px] my-[20px] underline underline-offset-2  text-red-900 font-bold flex items-center'>
//                     <FaClipboardList className='mr-2' />
//                     User's Orders   
//                 </h2>
//                 <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
//                     <table className="w-full text-lg text-left text-gray-500 dark:text-gray-400">
//                         <thead className="text-sm text-red-900 uppercase bg-gray-50 dark:bg-red-900 dark:text-red-200"></thead>

//                         <thead className="text-sm text-red-900 uppercase bg-gray-50 dark:bg-red-900 dark:text-red-100">
//                             <tr>
//                                 <th scope="col" className="whitespace-nowrap text-center px-6 py-3">Full Name</th>
//                                 <th scope="col" className="whitespace-nowrap text-center px-6 py-3">Email</th>
//                                 <th scope="col" className="whitespace-nowrap text-center px-6 py-3">Contact</th>
//                                 <th scope="col" className="whitespace-nowrap text-center px-6 py-3">Orders Placed</th>
//                                 <th scope="col" className="whitespace-nowrap pl-[52px] py-3">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {users.map(user => (
//                                 <tr key={user.documentId} className='text-center odd:bg-white even:bg-red-100 text-custom-blue border-b'>
//                                     <td className="py-2 px-4 whitespace-nowrap font-bold text-red-900">{user.fullName}</td>
//                                     <td className="whitespace-nowrap font-medium text-red-700 underline text-center px-6 py-4">{user.email}</td>
//                                     <td className="whitespace-nowrap text-center px-6 py-4">{user.contact}</td>
//                                     <td className="whitespace-nowrap text-center px-6 py-4">{user.orderCount}</td>
//                                     <td className="py-2 px-4 mx-auto">
//                                         <button
//                                             className="bg-red-900 whitespace-nowrap text-red-100 text-[15px] font-semibold rounded-[25px] flex items-center pl-[5px] pr-[16px] py-[2px] hover:bg-red-600"
//                                             onClick={() => handleViewOrders(user.documentId, user.userId)}
//                                         >
//                                             <GrFormView size={30} />
//                                             View Orders
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default UsersOrders;
