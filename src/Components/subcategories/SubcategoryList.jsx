import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MdCategory,
  MdEdit,
  MdDelete,
  MdAdd,
  MdSearch, 
  MdDescription,
  MdClose,
  MdSave,
  MdCancel,
} from "react-icons/md"
import axios from "axios"


export default function SubcategoryManager() {
 
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("")
  //const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
  });
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/subcategories`);
        setSubcategories(res.data);
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/category`);
        setCategories(res.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchSubcategories();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedSubcategory) {
      setFormData({
        name: selectedSubcategory.name || '',
        description: selectedSubcategory.description || '',
        category: selectedSubcategory.category || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        category: '',
      });
    }
  }, [selectedSubcategory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedSubcategory) {
        // Update existing subcategory
        await axios.put(`${process.env.REACT_APP_API_BASE_URL}/subcategories/${selectedSubcategory._id}`, formData);
      } else {
        // Create new subcategory
        await axios.post(`${process.env.REACT_APP_API_BASE_URL}/subcategories`, formData);
      }
      setFormData({ name: '', description: '', category: '' });
      setSelectedSubcategory(null);
      setModalOpen(false);
      // Refresh the list
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/subcategories`);
      setSubcategories(res.data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subcategory?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/subcategories/${id}`);
        setSubcategories(subcategories.filter(sub => sub._id !== id));
      } catch (error) {
        console.error('Error deleting subcategory:', error);
      }
    }
  };

  const handleEdit = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedSubcategory(null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedSubcategory(null);
    setFormData({ name: '', description: '', category: '' });
  };


// =========

  // const [subcategories, setSubcategories] = useState(mockSubcategories)
  // const [categories] = useState(mockCategories)
  // const [searchTerm, setSearchTerm] = useState("")
  // const [modalOpen, setModalOpen] = useState(false)
  // const [selectedSubcategory, setSelectedSubcategory] = useState(null)
  // const [formData, setFormData] = useState({
  //   name: "",
  //   description: "",
  //   category: "",
  // })

  useEffect(() => {
    if (selectedSubcategory) {
      setFormData({
        name: selectedSubcategory.name || "",
        description: selectedSubcategory.description || "",
        category: selectedSubcategory.category || "",
      })
    } else {
      setFormData({
        name: "",
        description: "",
        category: "",
      })
    }
  }, [selectedSubcategory])

  // const handleChange = (e) => {
  //   const { name, value } = e.target
  //   setFormData({ ...formData, [name]: value })
  // }

  // const handleSubmit = async (e) => {
  //   e.preventDefault()
  //   try {
  //     if (selectedSubcategory) {
  //       // Update existing subcategory
  //       const updatedSubcategories = subcategories.map((sub) =>
  //         sub._id === selectedSubcategory._id ? { ...sub, ...formData } : sub,
  //       )
  //       setSubcategories(updatedSubcategories)
  //     } else {
  //       // Create new subcategory
  //       const newSubcategory = {
  //         _id: `sub${Date.now()}`,
  //         ...formData,
  //       }
  //       setSubcategories([...subcategories, newSubcategory])
  //     }
  //     handleCloseModal()
  //   } catch (error) {
  //     console.error("Error submitting form:", error)
  //   }
  // }

  // const handleDelete = async (id) => {
  //   if (window.confirm("Are you sure you want to delete this subcategory?")) {
  //     try {
  //       setSubcategories(subcategories.filter((sub) => sub._id !== id))
  //     } catch (error) {
  //       console.error("Error deleting subcategory:", error)
  //     }
  //   }
  // }

  // const handleEdit = (subcategory) => {
  //   setSelectedSubcategory(subcategory)
  //   setModalOpen(true)
  // }

  // const handleCreate = () => {
  //   setSelectedSubcategory(null)
  //   setModalOpen(true)
  // }

  // const handleCloseModal = () => {
  //   setModalOpen(false)
  //   setSelectedSubcategory(null)
  //   setFormData({ name: "", description: "", category: "" })
  // }

  const filteredSubcategories = subcategories.filter(
    (subcategory) =>
      subcategory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subcategory.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subcategory.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  }

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="ml-[10px] min-h-screen bg-gray-100 xsx:ml-[280px] xsx:px-[20px] pb-[35px] pr-[12px] flex flex-col"
    >
      <div className="my-[20px] flex flex-col w-full pb-[35px] px-[15px] justify-center rounded-xl">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <MdCategory className="mr-3 text-red-600" />
            Sub-Category Details
          </h1>
          <div className="w-20 h-1 bg-red-600 rounded-full"></div>
          <p className="text-gray-600 mt-2">Create, edit and manage sub-categories</p>
        </motion.div>


        {/* Summary Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">{subcategories.length}</div>
            <div className="text-sm text-gray-600">Total Subcategories</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">{categories.length}</div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
          <div className="bg-white md:block hidden rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {(subcategories.length / categories.length).toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Avg per Category</div>
          </div>
        </motion.div>

        {/* Search and Actions Bar */}
        <motion.div variants={itemVariants} className="flex flex-col lg:flex-row gap-4 my-6">
          <div className="relative flex-grow">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Search subcategories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="flex gap-2">
           
            <motion.button
              onClick={handleCreate}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200"
            >
              <MdAdd className="text-xl" />
              <span className="font-medium">Add Sub-Category</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Mobile Cards */}
        <div className="block lg:hidden space-y-4 mb-6 overflow-x-auto">
          {filteredSubcategories.map((subcategory, index) => (
            <motion.div
              key={subcategory._id}
              variants={itemVariants}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 min-w-[300px]"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{subcategory.name}</h3>
                  <p className="text-sm text-gray-500">ID: {subcategory._id}</p>
                </div>
                <span className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                  {subcategory.category}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Description</p>
                <p className="text-gray-700">{subcategory.description}</p>
              </div>

              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEdit(subcategory)}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                >
                  <MdEdit className="w-4 h-4" />
                  Edit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(subcategory._id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
                >
                  <MdDelete className="w-4 h-4" />
                  Delete
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Desktop Table */}
        <motion.div
          variants={itemVariants}
          className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* Table Header */}
              <thead>
                <tr className="bg-gradient-to-r from-red-700 to-red-800 text-white">
                  <th className="px-6 py-4 text-left font-medium">
                    <div className="flex items-center">
                      <MdCategory className="mr-2" />
                      Name
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left font-medium">
                    <div className="flex items-center">
                      <MdDescription className="mr-2" />
                      Description
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left font-medium">
                    <div className="flex items-center">
                      <MdCategory className="mr-2" />
                      Category
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left font-medium">Actions</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {filteredSubcategories.length > 0 ? (
                  filteredSubcategories.map((subcategory, index) => (
                    <motion.tr
                      key={subcategory._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      className="border-b border-gray-100 hover:bg-red-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{subcategory.name}</div>
                          <div className="text-xs text-gray-500">ID: {subcategory._id}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-700 max-w-xs truncate">{subcategory.description}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                          {subcategory.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleEdit(subcategory)}
                            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                          >
                            <MdEdit className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(subcategory._id)}
                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                          >
                            <MdDelete className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                      No subcategories found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={handleCloseModal}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <MdCategory className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">
                        {selectedSubcategory ? "Edit Subcategory" : "Create Subcategory"}
                      </h2>
                      <p className="text-red-100 text-sm">
                        {selectedSubcategory ? "Update subcategory details" : "Add a new subcategory"}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleCloseModal}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
                  >
                    <MdClose className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Subcategory Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter subcategory name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Enter description"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-4 pt-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCloseModal}
                    className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <MdCancel className="w-4 h-4" />
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200"
                  >
                    <MdSave className="w-4 h-4" />
                    {selectedSubcategory ? "Update" : "Create"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// // src/components/SubcategoryManager.js
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';


// import { MdDeleteOutline } from "react-icons/md";
// import { FiEdit } from "react-icons/fi";
// import { IoMdAddCircleOutline } from "react-icons/io";
// import { FaClipboardList } from 'react-icons/fa';

// const SubcategoryManager = () => {
//   const [subcategories, setSubcategories] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     category: '',
//   });
//   const [selectedSubcategory, setSelectedSubcategory] = useState(null);
//   const [modalOpen, setModalOpen] = useState(false);

//   useEffect(() => {
//     const fetchSubcategories = async () => {
//       try {
//         const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/subcategories`);
//         setSubcategories(res.data);
//       } catch (error) {
//         console.error('Error fetching subcategories:', error);
//       }
//     };

//     const fetchCategories = async () => {
//       try {
//         const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/category`);
//         setCategories(res.data);
//       } catch (error) {
//         console.error('Error fetching categories:', error);
//       }
//     };

//     fetchSubcategories();
//     fetchCategories();
//   }, []);

//   useEffect(() => {
//     if (selectedSubcategory) {
//       setFormData({
//         name: selectedSubcategory.name || '',
//         description: selectedSubcategory.description || '',
//         category: selectedSubcategory.category || '',
//       });
//     } else {
//       setFormData({
//         name: '',
//         description: '',
//         category: '',
//       });
//     }
//   }, [selectedSubcategory]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (selectedSubcategory) {
//         // Update existing subcategory
//         await axios.put(`${process.env.REACT_APP_API_BASE_URL}/subcategories/${selectedSubcategory._id}`, formData);
//       } else {
//         // Create new subcategory
//         await axios.post(`${process.env.REACT_APP_API_BASE_URL}/subcategories`, formData);
//       }
//       setFormData({ name: '', description: '', category: '' });
//       setSelectedSubcategory(null);
//       setModalOpen(false);
//       // Refresh the list
//       const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/subcategories`);
//       setSubcategories(res.data);
//     } catch (error) {
//       console.error('Error submitting form:', error);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this subcategory?')) {
//       try {
//         await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/subcategories/${id}`);
//         setSubcategories(subcategories.filter(sub => sub._id !== id));
//       } catch (error) {
//         console.error('Error deleting subcategory:', error);
//       }
//     }
//   };

//   const handleEdit = (subcategory) => {
//     setSelectedSubcategory(subcategory);
//     setModalOpen(true);
//   };

//   const handleCreate = () => {
//     setSelectedSubcategory(null);
//     setModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setModalOpen(false);
//     setSelectedSubcategory(null);
//     setFormData({ name: '', description: '', category: '' });
//   };

//   return (
//     <div className='ml-[10px] min-h-screen  bg-gray-100 xsx:ml-[260px] xsx:px-[20px] pb-[35px] pr-[12px] flex flex-col'>
//       <h2 className='text-[28px] mt-[25px] underline underline-offset-2 mb-[5px] text-red-900 font-bold flex items-center'>
//         <FaClipboardList className='mr-2' />
//         Sub-Category Details
//       </h2>
//       <div className='flex flex-col w-[100%] justify-center rounded-xl overflow-x-auto'>

//         <div className='flex lg:items-center mb-[12px] lg:flex-row flex-col lg:justify-between w-full'>
//           <p className='text-lg font-[600] text-red-700'>Create,edit and Manage sub-categories</p>
//           <button onClick={handleCreate} className="scale-[0.7] lg:scale-[0.85] bg-red-900 hover:text-red-900 hover:bg-red-100 text-red-100  flex items-center rounded-[25px] px-[15px] py-[8px]">
//             <IoMdAddCircleOutline className='text-[30px]' />
//             <div className='ml-[5px] mb-[2px] font-medium text-[20px]'>Add Sub-Category</div>
//           </button>
//         </div>

//         <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
//           <table className="w-full text-lg text-left text-gray-500 dark:text-gray-400">
//             <thead className="text-sm text-red-900 uppercase bg-gray-50 dark:bg-red-900 dark:text-red-100">
//               <tr>
//                 <th scope="col" className="whitespace-nowrap text-center px-6 py-3">Name</th>
//                 <th scope="col" className="whitespace-nowrap text-center px-6 py-3">Description</th>
//                 <th scope="col" className="whitespace-nowrap text-center px-6 py-3">Category</th>
//                 <th scope="col" className="whitespace-nowrap text-center px-6 py-3">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {subcategories.map(subcategory => (
//                 <tr key={subcategory._id} className='text-center bg-white border-b-[3px] border-gray-300 text-[#2d0d0d]'>
//                   <th scope="row" className="px-6 py-4 font-bold whitespace-nowrap">{subcategory.name}</th>
//                   <td className="whitespace-nowrap text-center px-6 py-4">{subcategory.description}</td>
//                   <td className="whitespace-nowrap text-center px-6 py-4">
//                     <div className=' text-red-700 scale-[0.9] bg-red-100 py-[5px] font-medium rounded-[25px]'>{subcategory.category}</div>
//                   </td>
//                   <td className="whitespace-nowrap text-center px-6 py-4 flex justify-center space-x-4">
//                     <button
//                       onClick={() => handleEdit(subcategory)}
//                       className="text-blue-100 bg-blue-500 rounded-full p-2 hover:bg-blue-600 transition-colors"
//                     >
//                       <FiEdit size={24} />
//                     </button>
//                     <button
//                       onClick={() => handleDelete(subcategory._id)}
//                       className="text-red-600 bg-red-200 rounded-full p-2 hover:bg-red-200 transition-colors"
//                     >
//                       <MdDeleteOutline size={24} />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {modalOpen && (
//         <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
//             <h2 className='text-2xl underline text-red-800 font-bold text-center mb-4'>
//               {selectedSubcategory ? 'Edit Subcategory' : 'Create Subcategory'}
//             </h2>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label htmlFor="name" className="block font-medium text-red-700">Subcategory Name:</label>
//                 <input
//                   type="text"
//                   id="name"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   className="border rounded p-2 w-full"
//                   required
//                 />
//               </div>
//               <div>
//                 <label htmlFor="description" className="block font-medium text-red-700">Description:</label>
//                 <textarea
//                   id="description"
//                   name="description"
//                   value={formData.description}
//                   onChange={handleChange}
//                   className="border rounded p-2 w-full"
//                   rows="4"
//                   required
//                 ></textarea>
//               </div>
//               <div>
//                 <label htmlFor="category" className="block font-medium text-red-700">Category:</label>
//                 <select
//                   id="category"
//                   name="category"
//                   value={formData.category}
//                   onChange={handleChange}
//                   className="border rounded p-2 w-full"
//                   required
//                 >
//                   <option value="">Select a category</option>
//                   {categories.map(cat => (
//                     <option key={cat._id} value={cat.name}>
//                       {cat.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <button
//                 type="submit"
//                 className="bg-blue-500 text-white rounded px-4 py-2"
//               >
//                 {selectedSubcategory ? 'Update Subcategory' : 'Create Subcategory'}
//               </button>
//               <button
//                 type="button"
//                 onClick={handleCloseModal}
//                 className="bg-gray-500 text-white rounded px-4 py-2 ml-2"
//               >
//                 Cancel
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SubcategoryManager;
