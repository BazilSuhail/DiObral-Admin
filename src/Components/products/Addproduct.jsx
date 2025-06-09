import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from "framer-motion"
import { MdDescription, MdImage, MdAttachMoney, MdInventory, MdAdd } from 'react-icons/md';

const AddProductForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        subcategory: '', // Store subcategory name instead of ID
        size: '',
        stock: '',
        price: '',
        sale: '',
    });
    const [mainImage, setMainImage] = useState(null);
    const [images, setImages] = useState({
        image1: null,
        image2: null,
        image3: null,
        image4: null,
        image5: null,
    });
    const [subcategories, setSubcategories] = useState([]);

    useEffect(() => {
        // Fetch available subcategories
        const fetchSubcategories = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/subcategories`); // Update the URL to your API endpoint for subcategories
                setSubcategories(res.data);
            } catch (error) {
                console.error('Error fetching subcategories:', error);
            }
        };

        fetchSubcategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const { name, files } = e.target;
        if (name === 'mainImage') {
            setMainImage(files[0]);
        } else {
            setImages(prevImages => ({
                ...prevImages,
                [name]: files[0]
            }));
        }
    };

    const handleSubcategoryChange = (e) => {
        const selectedSubcategoryId = e.target.value;
        const selectedSubcategory = subcategories.find(sub => sub._id === selectedSubcategoryId);

        setFormData({
            ...formData,
            subcategory: selectedSubcategory ? selectedSubcategory.name : '', // Set subcategory name
            category: selectedSubcategory ? selectedSubcategory.category : '' // Set category based on selected subcategory
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();

        formDataToSend.append('name', formData.name);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('category', formData.category);
        formDataToSend.append('subcategory', formData.subcategory); // Send subcategory name
        formDataToSend.append('size', formData.size);
        formDataToSend.append('stock', formData.stock);
        formDataToSend.append('price', formData.price);
        formDataToSend.append('sale', formData.sale);
        if (mainImage) formDataToSend.append('mainImage', mainImage);
        Object.keys(images).forEach((key) => {
            if (images[key]) formDataToSend.append(key, images[key]);
        });

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/products/add`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert(response.data.message);

            // Reset form fields after successful submission
            setFormData({
                name: '',
                description: '',
                category: '',
                subcategory: '',
                size: '',
                stock: '',
                price: '',
                sale: '',
            });
            setMainImage(null);
            setImages({
                image1: null,
                image2: null,
                image3: null,
                image4: null,
                image5: null,
            });

            // Reset file inputs by forcing a change in their keys
            document.querySelector('input[name="mainImage"]').value = '';
            [...Array(5)].forEach((_, index) => {
                document.querySelector(`input[name="image${index + 1}"]`).value = '';
            });

        } catch (error) {
            alert('Error adding product');
            console.error(error);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className='m-[10px] xsx:ml-[300px] pt-[15px] lg:mr-[25px] flex flex-col'
        >
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
            >
                <h2 className='text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center'>
                    <MdAdd className="mr-3 text-red-600" />
                    Add Product
                </h2>
                <div className="w-20 h-1 bg-red-600 rounded-full"></div>
                <p className="text-gray-600 mt-2">Fill in the details to add a new product to your inventory</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className='bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden'
            >
                {/* Form Header */}
                <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <MdInventory className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Product Information</h3>
                            <p className="text-red-100 text-sm">Enter all the required product details</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className='p-8 space-y-8'>
                    {/* Basic Information Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-red-50 rounded-lg">
                                <MdDescription className="w-5 h-5 text-red-600" />
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900">Basic Information</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Product Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200'
                                    placeholder="Enter product name"
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Description *</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 resize-none'
                                    placeholder="Enter detailed product description"
                                    required
                                />
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Category</label>
                                <div className='w-full px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-800 font-medium'>
                                    {formData.category || 'Select a subcategory to set category'}
                                </div>
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Subcategory *</label>
                                <select
                                    name="subcategory"
                                    value={subcategories.find(sub => sub.name === formData.subcategory)?._id || ""}
                                    onChange={handleSubcategoryChange}
                                    className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200'
                                    required
                                >
                                    <option value="">Select a subcategory</option>
                                    {subcategories.map(subcat => (
                                        <option key={subcat._id} value={subcat._id}>{subcat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </motion.div>

                    {/* Inventory & Pricing Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-red-50 rounded-lg">
                                <MdAttachMoney className="w-5 h-5 text-red-600" />
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900">Inventory & Pricing</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Available Sizes *</label>
                                <input
                                    type="text"
                                    name="size"
                                    value={formData.size}
                                    onChange={handleChange}
                                    className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200'
                                    placeholder="S, M, L, XL"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">Separate sizes with commas</p>
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Stock Quantity *</label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200'
                                    placeholder="0"
                                    required
                                />
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Price ($) *</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    step="0.01"
                                    className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200'
                                    placeholder="0.00"
                                    required
                                />
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Sale (% off)</label>
                                <input
                                    type="number"
                                    name="sale"
                                    value={formData.sale}
                                    onChange={handleChange}
                                    className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200'
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Image Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-red-50 rounded-lg">
                                <MdImage className="w-5 h-5 text-red-600" />
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900">Main Product Image</h4>
                            <span className="text-red-500 text-sm">*Required</span>
                        </div>

                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-red-400 transition-colors duration-200">
                            <input
                                type="file"
                                name="mainImage"
                                onChange={handleImageChange}
                                className="hidden"
                                id="mainImage"
                            />
                            <label htmlFor="mainImage" className="cursor-pointer">
                                <MdImage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600 font-medium">Click to upload main product image</p>
                                <p className="text-sm text-gray-400 mt-1">PNG, JPG up to 10MB</p>
                            </label>
                        </div>
                    </motion.div>

                    {/* Additional Images Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-red-50 rounded-lg">
                                <MdImage className="w-5 h-5 text-red-600" />
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900">Additional Images</h4>
                            <span className="text-gray-500 text-sm">For product gallery</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[...Array(5)].map((_, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.7 + index * 0.1 }}
                                    className="space-y-2"
                                >
                                    <label className='block text-sm font-medium text-gray-700'>Image {index + 1}</label>
                                    <div className="border border-gray-200 rounded-lg p-3 hover:border-red-300 transition-colors duration-200">
                                        <input
                                            type="file"
                                            name={`image${index + 1}`}
                                            onChange={handleImageChange}
                                            className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-red-50 file:text-red-700 hover:file:bg-red-100 transition-colors duration-200"
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="flex justify-end pt-6 border-t border-gray-200"
                    >
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className='flex items-center gap-3 bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:from-red-700 hover:to-red-800 transition-all duration-300'
                        >
                            <MdAdd className="w-5 h-5" />
                            Add Product
                        </motion.button>
                    </motion.div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default AddProductForm;
