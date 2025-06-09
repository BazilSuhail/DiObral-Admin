
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
    MdInventory,
    MdEdit,
    MdDelete,
    MdSearch,
    MdAttachMoney,
    MdCategory,
    MdStorage,
} from "react-icons/md"
import ProductEditModal from "./EditProductModal"
import axios from "axios"


export default function ProductsTable() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                console.log(process.env.REACT_APP_API_BASE_URL)
                const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/products`);
                setProducts(res.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/products/${id}`); // Update with your endpoint
            setProducts(products.filter(product => product._id !== id));
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };


    //   const handleEdit = (product) => {
    //     setSelectedProduct(product)
    //     setShowModal(true)
    //   }

    //   const handleDelete = (productId) => {
    //     console.log("Delete product:", productId)
    //   }

    // const handleModalSave = () => {
    //     // Refresh products data here
    //     console.log("Product updated successfully")
    //     setShowModal(false)
    // }

    const getStockStatus = (stock) => {
        if (stock === 0) return { color: "bg-red-100 text-red-800", label: "Out of Stock" }
        if (stock <= 10) return { color: "bg-yellow-100 text-yellow-800", label: "Low Stock" }
        return { color: "bg-green-100 text-green-800", label: "In Stock" }
    }

    const filteredProducts = products.filter(
        (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.subcategory.toLowerCase().includes(searchTerm.toLowerCase()),
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
                        <MdInventory className="mr-3 text-red-600" />
                        Products Added
                    </h1>
                    <div className="w-20 h-1 bg-red-600 rounded-full"></div>
                </motion.div>

                {/* Summary Stats */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
                        <div className="text-2xl font-bold text-blue-600 mb-1">{products.length}</div>
                        <div className="text-sm text-gray-600">Total Products</div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
                        <div className="text-2xl font-bold text-green-600 mb-1">{products.filter((p) => p.stock > 10).length}</div>
                        <div className="text-sm text-gray-600">In Stock</div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
                        <div className="text-2xl font-bold text-yellow-600 mb-1">
                            {products.filter((p) => p.stock <= 10 && p.stock > 0).length}
                        </div>
                        <div className="text-sm text-gray-600">Low Stock</div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
                        <div className="text-2xl font-bold text-red-600 mb-1">{products.filter((p) => p.stock === 0).length}</div>
                        <div className="text-sm text-gray-600">Out of Stock</div>
                    </div>
                </motion.div>

                {/* Search and Filter Bar */}
                <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4 my-6">
                    <div className="relative flex-grow">
                        <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                        />
                    </div>
                </motion.div>

                {/* Pagination */}
                <motion.div variants={itemVariants} className="flex justify-between text-sm text-gray-600 items-center mb-6">
                    Showing {filteredProducts.length} of {products.length} products
                </motion.div>

                {/* Products Grid for Mobile */}
                <div className="block md:hidden space-y-4 mb-6">
                    {filteredProducts.map((product, index) => (
                        <motion.div
                            key={product._id}
                            variants={itemVariants}
                            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-semibold text-gray-900 text-lg">{product.name}</h3>
                                    <p className="text-sm text-gray-500">ID: {product._id}</p>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStockStatus(product.stock).color}`}>
                                    {getStockStatus(product.stock).label}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="text-sm text-gray-500">Stock</p>
                                    <p className="font-semibold text-gray-900">{product.stock}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Price</p>
                                    <p className="font-semibold text-green-600">${product.price}</p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <p className="text-sm text-gray-500">Category</p>
                                <span className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                                    {product.subcategory}
                                </span>
                            </div>

                            <div className="flex gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleEdit(product)}
                                    className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                                >
                                    <MdEdit className="w-4 h-4" />
                                    Edit
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleDelete(product._id)}
                                    className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
                                >
                                    <MdDelete className="w-4 h-4" />
                                    Delete
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Table for Desktop */}
                <motion.div
                    variants={itemVariants}
                    className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            {/* Table Header */}
                            <thead>
                                <tr className="bg-gradient-to-r from-red-700 to-red-800 text-white">
                                    <th className="px-6 py-4 text-left font-medium">
                                        <div className="flex items-center">
                                            <MdInventory className="mr-2" />
                                            Product Name
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left font-medium">
                                        <div className="flex items-center">
                                            <MdStorage className="mr-2" />
                                            Stock
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left font-medium">
                                        <div className="flex items-center">
                                            <MdCategory className="mr-2" />
                                            Category
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left font-medium">
                                        <div className="flex items-center">
                                            <MdAttachMoney className="mr-2" />
                                            Price
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left font-medium">Actions</th>
                                </tr>
                            </thead>

                            {/* Table Body */}
                            <tbody>
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((product, index) => (
                                        <motion.tr
                                            key={product._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 + index * 0.05 }}
                                            className="border-b border-gray-100 hover:bg-red-50 transition-colors duration-150"
                                        >
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="font-medium text-gray-900">{product.name}</div>
                                                    <div className="text-xs text-gray-500">ID: {product._id}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-gray-900">{product.stock}</span>
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatus(product.stock).color}`}
                                                    >
                                                        {getStockStatus(product.stock).label}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                                                    {product.subcategory}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-semibold text-green-600 text-lg">${product.price}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleEdit(product)}
                                                        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                                                    >
                                                        <MdEdit className="w-4 h-4" />
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleDelete(product._id)}
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
                                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                            No products found matching your search.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>


            </div>

            {/* Product Edit Modal */}
            <ProductEditModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                product={selectedProduct}
                onSave={async () => {
                        try {
                            const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/products`);
                            setProducts(res.data);
                        } catch (error) {
                            console.error('Error fetching updated products:', error);
                        }
                        setShowModal(false); // Close the modal after saving
                    }}
            />
        </motion.div>
    )
}

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// import { MdDeleteOutline } from "react-icons/md";
// import { FiEdit } from "react-icons/fi";
// import { FaClipboardList } from 'react-icons/fa';

// const ProductEditModal = ({ isOpen, onClose, product, onSave }) => {
//     const [formData, setFormData] = useState({
//         name: '',
//         description: '',
//         category: '',
//         subcategory: '',
//         size: '',
//         stock: '',
//         price: '',
//         sale: '',
//     });
//     const [mainImage, setMainImage] = useState(null);
//     const [images, setImages] = useState({
//         image1: null,
//         image2: null,
//         image3: null,
//         image4: null,
//         image5: null,
//     });

//     const [subcategories, setSubcategories] = useState([]);
//     const [existingImages, setExistingImages] = useState({
//         mainImage: '',
//         image1: '',
//         image2: '',
//         image3: '',
//         image4: '',
//         image5: '',
//     });

//     useEffect(() => {
//         if (isOpen) {
//             // Fetch available subcategories
//             const fetchSubcategories = async () => {
//                 try {
//                     const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/subcategories`); // Update URL to your API endpoint for subcategories
//                     setSubcategories(res.data);

//                     if (product) {
//                         // Set form data with existing product details
//                         setFormData({
//                             name: product.name,
//                             description: product.description,
//                             category: product.category,
//                             subcategory: product.subcategory, // Set subcategory name
//                             size: product.size.join(', '), // Convert array to comma separated string
//                             stock: product.stock,
//                             price: product.price,
//                             sale: product.sale,
//                         });

//                         // Fetch image names and set existing images
//                         setExistingImages({
//                             mainImage: product.mainImageName || '', // Assuming you have image names in the product object
//                             image1: product.image1Name || '',
//                             image2: product.image2Name || '',
//                             image3: product.image3Name || '',
//                             image4: product.image4Name || '',
//                             image5: product.image5Name || '',
//                         });
//                     }
//                 } catch (error) {
//                     console.error('Error fetching subcategories:', error);
//                 }
//             };

//             fetchSubcategories();
//         }
//     }, [isOpen, product]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     const handleImageChange = (e) => {
//         const { name, files } = e.target;
//         if (name === 'mainImage') {
//             setMainImage(files[0]);
//         } else {
//             setImages(prevImages => ({
//                 ...prevImages,
//                 [name]: files[0]
//             }));
//         }
//     };

//     const handleSubcategoryChange = (e) => {
//         const selectedSubcategoryId = e.target.value;
//         const selectedSubcategory = subcategories.find(sub => sub._id === selectedSubcategoryId);

//         setFormData({
//             ...formData,
//             subcategory: selectedSubcategory ? selectedSubcategory.name : '', // Set subcategory name
//             category: selectedSubcategory ? selectedSubcategory.category : '' // Set category based on selected subcategory
//         });
//     };

//     const handleSave = async () => {
//         const formDataToSend = new FormData();

//         formDataToSend.append('name', formData.name);
//         formDataToSend.append('description', formData.description);
//         formDataToSend.append('category', formData.category);
//         formDataToSend.append('subcategory', formData.subcategory); // Send subcategory name
//         formDataToSend.append('size', formData.size);
//         formDataToSend.append('stock', formData.stock);
//         formDataToSend.append('price', formData.price);
//         formDataToSend.append('sale', formData.sale);
//         if (mainImage) formDataToSend.append('mainImage', mainImage);
//         Object.keys(images).forEach((key) => {
//             if (images[key]) formDataToSend.append(key, images[key]);
//         });

//         try {
//             await axios.put(`${process.env.REACT_APP_API_BASE_URL}/products/${product._id}`, formDataToSend, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });
//             onSave();
//             onClose();
//         } catch (error) {
//             alert('Error updating product');
//             console.error(error);
//         }
//     };

//     if (!isOpen) return null;

//     return (
//         <div className='fixed inset-0 overflow-y-auto bg-red-50 bg-opacity-75 flex justify-center items-center'>
//             <div className='bg-white p-4 shadow-custom-dark rounded-lg mt-[1050px] lg:mt-[950px] w-[90vw] lg:w-[65vw] xl:w-[55vw]'>
//                 <h2 className='text-3xl underline text-red-800 font-bold text-center mb-4'>Edit Product Details</h2>
//                 <form className='space-y-4'>
//                     <div className='flex flex-col'>
//                         <label className='font-medium text-red-900'>Name:</label>
//                         <input
//                             type="text"
//                             name="name"
//                             value={formData.name}
//                             onChange={handleChange}
//                             className='border border-gray-300 p-2 rounded'
//                             required
//                         />
//                     </div>
//                     <div className='flex flex-col'>
//                         <label className='font-medium text-red-900'>Description:</label>
//                         <textarea
//                             name="description"
//                             value={formData.description}
//                             onChange={handleChange}
//                             className='border border-gray-300 p-2 h-[250px] rounded'
//                             required
//                         />
//                     </div>
//                     <div className='flex flex-col'>
//                         <label className='font-medium text-red-900'>Category:</label>
//                         <div className='p-2 border bg-red-100 text-red-800 font-semibold border-gray-300 rounded'>{formData.category || 'Select a subcategory to set category'}</div>
//                     </div>

//                     <div className='flex flex-col'>
//                         <label className='font-medium text-red-900'>Subcategory:</label>
//                         <select
//                             name="subcategory"
//                             value={subcategories.find(sub => sub.name === formData.subcategory)?._id || ""}
//                             onChange={handleSubcategoryChange}
//                             className='border border-gray-300 p-2 rounded'
//                             required
//                         >
//                             <option value="">Select a subcategory</option>
//                             {subcategories.map(subcat => (
//                                 <option key={subcat._id} value={subcat._id}>{subcat.name}</option>
//                             ))}
//                         </select>
//                     </div>

//                     <div className='flex flex-col'>
//                         <label className='font-medium text-red-900'>Size (comma separated):</label>
//                         <input
//                             type="text"
//                             name="size"
//                             value={formData.size}
//                             onChange={handleChange}
//                             className='border border-gray-300 p-2 rounded'
//                             required
//                         />
//                     </div>
//                     <div className='flex flex-col'>
//                         <label className='font-medium text-red-900'>Stock:</label>
//                         <input
//                             type="number"
//                             name="stock"
//                             value={formData.stock}
//                             onChange={handleChange}
//                             className='border border-gray-300 p-2 rounded'
//                             required
//                         />
//                     </div>
//                     <div className='flex flex-col'>
//                         <label className='font-medium text-red-900'>Price:</label>
//                         <input
//                             type="number"
//                             name="price"
//                             value={formData.price}
//                             onChange={handleChange}
//                             className='border border-gray-300 p-2 rounded'
//                             required
//                         />
//                     </div>
//                     <div className='flex flex-col'>
//                         <label className='font-medium text-red-900'>Sale (% off):</label>
//                         <input
//                             type="number"
//                             name="sale"
//                             value={formData.sale}
//                             onChange={handleChange}
//                             className='border border-gray-300 p-2 rounded'
//                         />
//                     </div>

//                     <div className='font-bold text-lg text-red-700'><span className='underline'>Main Cover Image for Product.</span><span className='text-2xl'>*</span></div>

//                     <div className='flex flex-col'>
//                         <label className='font-medium text-red-900'>Main Image:</label>
//                         <input
//                             type="file"
//                             name="mainImage"
//                             onChange={handleImageChange}
//                             className='border border-gray-300 p-2 bg-red-100 file:bg-red-950 file:my-[4px] file:text-red-100 file:rounded-xl file:px-[15px] file:mr-[15px] rounded'
//                         />
//                         {existingImages.mainImage && (
//                             <div className='mt-2'>
//                                 <span className='font-medium text-red-900'>Current Main Image:</span>
//                                 <p>{existingImages.mainImage}</p>
//                             </div>
//                         )}
//                     </div>
//                     <div className='font-bold text-lg text-red-700'><span className='underline'>Slider Images for Product Description.</span><span className='text-2xl'>*</span></div>

//                     {[...Array(5)].map((_, index) => (
//                         <div key={index} className='flex flex-col'>
//                             <label className='font-medium text-red-900'>Image {index + 1}:</label>
//                             <input
//                                 type="file"
//                                 name={`image${index + 1}`}
//                                 onChange={handleImageChange}
//                                 className='border border-gray-300 p-2 bg-red-100 file:bg-red-950 file:my-[4px] file:text-red-100 file:rounded-xl file:px-[15px] file:mr-[15px] rounded'
//                             />
//                             {existingImages[`image${index + 1}`] && (
//                                 <div className='mt-2'>
//                                     <span className='font-medium text-red-900'>Current Image {index + 1}:</span>
//                                     <p>{existingImages[`image${index + 1}`]}</p>
//                                 </div>
//                             )}
//                         </div>
//                     ))}

//                     <div className='flex justify-end space-x-4 mt-4'>
//                         <button type="button" onClick={handleSave} className='bg-blue-700 text-white py-2 px-4 rounded'>Save</button>
//                         <button type="button" onClick={onClose} className='bg-red-500 text-white py-2 px-4 rounded'>Cancel</button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };



// const ProductList = () => {
//     const [products, setProducts] = useState([]);
//     const [selectedProduct, setSelectedProduct] = useState(null);
//     const [showModal, setShowModal] = useState(false);

//     useEffect(() => {
//         const fetchProducts = async () => {
//             try {
//                 console.log(process.env.REACT_APP_API_BASE_URL)
//                 const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/products`);
//                 setProducts(res.data);
//             } catch (error) {
//                 console.error('Error fetching products:', error);
//             }
//         };

//         fetchProducts();
//     }, []);

//     const handleEdit = (product) => {
//         setSelectedProduct(product);
//         setShowModal(true);
//     };

//     const handleDelete = async (id) => {
//         try {
//             await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/products/${id}`); // Update with your endpoint
//             setProducts(products.filter(product => product._id !== id));
//         } catch (error) {
//             console.error('Error deleting product:', error);
//         }
//     };

//     return (
//         <div className='ml-[10px] min-h-screen bg-gray-100 xsx:ml-[260px] xsx:px-[20px] pb-[35px] pr-[12px] flex flex-col'>

//             <h2 className='text-[28px] my-[25px] underline underline-offset-2 mb-[5px] text-red-900 font-bold flex items-center'>
//                 <FaClipboardList className='mr-2' />
//                 Products Added
//             </h2>

//             <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
//                 <table className="w-full text-lg text-left text-gray-500 dark:text-gray-400">
//                     <thead className="text-xs text-red-900 uppercase bg-gray-50 dark:bg-red-900  dark:text-red-100">
//                         <tr>
//                             <th scope="col" className="whitespace-nowrap text-center  px-6 py-3">Name</th>
//                             <th scope="col" className="whitespace-nowrap text-center  px-6 py-3">Stock</th>
//                             <th scope="col" className="whitespace-nowrap text-center  px-6 py-3">Subcategory</th>
//                             <th scope="col" className="whitespace-nowrap text-center  px-6 py-3">Price</th>
//                             <th scope="col" className="whitespace-nowrap text-center  px-6 py-3">Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody className='bg-white divide-y divide-gray-200'>
//                         {products.map(product => (
//                             <tr key={product._id} className='text-center bg-white border-b-[3px] border-gray-300 text-[#2d0d0d]'>
//                                 <th th scope="row" class="px-6 py-4 font-bold whitespace-nowrap">{product.name}</th>
//                                 <td className="whitespace-nowrap text-center font-semibold text-red-700 px-6 py-4">{product.stock}</td>
//                                 <td className="whitespace-nowrap text-center px-6 py-4">
//                                     <div className=' text-red-700 scale-[0.9] bg-red-100 py-[5px] font-medium rounded-[25px]'>{product.subcategory}</div>
//                                 </td>
//                                 <td className="whitespace-nowrap text-center px-6 py-4">${product.price}</td>
//                                 <td className="whitespace-nowrap text-center px-6 py-4 flex justify-center space-x-4">
//                                     <button
//                                         onClick={() => handleEdit(product)}
//                                         className="text-blue-100 bg-blue-500 rounded-full p-2 hover:bg-blue-600 transition-colors"
//                                     >
//                                         <FiEdit size={24} />
//                                     </button>
//                                     <button
//                                         onClick={() => handleDelete(product._id)}
//                                         className="text-red-600 bg-red-300 rounded-full p-2 hover:bg-red-200 transition-colors"
//                                     >
//                                         <MdDeleteOutline size={24} />
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>

//             </div>

//             {showModal && (
//                 <ProductEditModal
//                     isOpen={showModal}
//                     onClose={() => setShowModal(false)}
//                     product={selectedProduct}
//                     onSave={async () => {
//                         try {
//                             const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/products`);
//                             setProducts(res.data);
//                         } catch (error) {
//                             console.error('Error fetching updated products:', error);
//                         }
//                         setShowModal(false); // Close the modal after saving
//                     }}
//                 />
//             )}

//         </div>
//     );
// };

// export default ProductList;
