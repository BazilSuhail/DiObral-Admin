import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { MdDeleteOutline } from "react-icons/md";
import { FiEdit } from "react-icons/fi";

const ProductEditModal = ({ isOpen, onClose, product, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        subcategory: '',
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
    const [existingImages, setExistingImages] = useState({
        mainImage: '',
        image1: '',
        image2: '',
        image3: '',
        image4: '',
        image5: '',
    });

    useEffect(() => {
        if (isOpen) {
            // Fetch available subcategories
            const fetchSubcategories = async () => {
                try {
                    const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/subcategories`); // Update URL to your API endpoint for subcategories
                    setSubcategories(res.data);

                    if (product) {
                        // Set form data with existing product details
                        setFormData({
                            name: product.name,
                            description: product.description,
                            category: product.category,
                            subcategory: product.subcategory, // Set subcategory name
                            size: product.size.join(', '), // Convert array to comma separated string
                            stock: product.stock,
                            price: product.price,
                            sale: product.sale,
                        });

                        // Fetch image names and set existing images
                        setExistingImages({
                            mainImage: product.mainImageName || '', // Assuming you have image names in the product object
                            image1: product.image1Name || '',
                            image2: product.image2Name || '',
                            image3: product.image3Name || '',
                            image4: product.image4Name || '',
                            image5: product.image5Name || '',
                        });
                    }
                } catch (error) {
                    console.error('Error fetching subcategories:', error);
                }
            };

            fetchSubcategories();
        }
    }, [isOpen, product]);

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

    const handleSave = async () => {
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
            await axios.put(`${process.env.REACT_APP_API_BASE_URL}/products/${product._id}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            onSave();
            onClose();
        } catch (error) {
            alert('Error updating product');
            console.error(error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 overflow-y-auto bg-red-50 bg-opacity-75 flex justify-center items-center'>
            <div className='bg-white p-4 shadow-custom-dark rounded-lg mt-[1050px] lg:mt-[950px] w-[90vw] lg:w-[65vw] xl:w-[55vw]'>
                <h2 className='text-3xl underline text-red-800 font-bold text-center mb-4'>Edit Product Details</h2>
                <form className='space-y-4'>
                    <div className='flex flex-col'>
                        <label className='font-medium text-red-900'>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className='border border-gray-300 p-2 rounded'
                            required
                        />
                    </div>
                    <div className='flex flex-col'>
                        <label className='font-medium text-red-900'>Description:</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className='border border-gray-300 p-2 h-[250px] rounded'
                            required
                        />
                    </div>
                    <div className='flex flex-col'>
                        <label className='font-medium text-red-900'>Category:</label>
                        <div className='p-2 border bg-red-100 text-red-800 font-semibold border-gray-300 rounded'>{formData.category || 'Select a subcategory to set category'}</div>
                    </div>

                    <div className='flex flex-col'>
                        <label className='font-medium text-red-900'>Subcategory:</label>
                        <select
                            name="subcategory"
                            value={subcategories.find(sub => sub.name === formData.subcategory)?._id || ""}
                            onChange={handleSubcategoryChange}
                            className='border border-gray-300 p-2 rounded'
                            required
                        >
                            <option value="">Select a subcategory</option>
                            {subcategories.map(subcat => (
                                <option key={subcat._id} value={subcat._id}>{subcat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className='flex flex-col'>
                        <label className='font-medium text-red-900'>Size (comma separated):</label>
                        <input
                            type="text"
                            name="size"
                            value={formData.size}
                            onChange={handleChange}
                            className='border border-gray-300 p-2 rounded'
                            required
                        />
                    </div>
                    <div className='flex flex-col'>
                        <label className='font-medium text-red-900'>Stock:</label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            className='border border-gray-300 p-2 rounded'
                            required
                        />
                    </div>
                    <div className='flex flex-col'>
                        <label className='font-medium text-red-900'>Price:</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className='border border-gray-300 p-2 rounded'
                            required
                        />
                    </div>
                    <div className='flex flex-col'>
                        <label className='font-medium text-red-900'>Sale (% off):</label>
                        <input
                            type="number"
                            name="sale"
                            value={formData.sale}
                            onChange={handleChange}
                            className='border border-gray-300 p-2 rounded'
                        />
                    </div>

                    <div className='font-bold text-lg text-red-700'><span className='underline'>Main Cover Image for Product.</span><span className='text-2xl'>*</span></div>

                    <div className='flex flex-col'>
                        <label className='font-medium text-red-900'>Main Image:</label>
                        <input
                            type="file"
                            name="mainImage"
                            onChange={handleImageChange}
                            className='border border-gray-300 p-2 bg-red-100 file:bg-red-950 file:my-[4px] file:text-red-100 file:rounded-xl file:px-[15px] file:mr-[15px] rounded'
                        />
                        {existingImages.mainImage && (
                            <div className='mt-2'>
                                <span className='font-medium text-red-900'>Current Main Image:</span>
                                <p>{existingImages.mainImage}</p>
                            </div>
                        )}
                    </div>
                    <div className='font-bold text-lg text-red-700'><span className='underline'>Slider Images for Product Description.</span><span className='text-2xl'>*</span></div>

                    {[...Array(5)].map((_, index) => (
                        <div key={index} className='flex flex-col'>
                            <label className='font-medium text-red-900'>Image {index + 1}:</label>
                            <input
                                type="file"
                                name={`image${index + 1}`}
                                onChange={handleImageChange}
                                className='border border-gray-300 p-2 bg-red-100 file:bg-red-950 file:my-[4px] file:text-red-100 file:rounded-xl file:px-[15px] file:mr-[15px] rounded'
                            />
                            {existingImages[`image${index + 1}`] && (
                                <div className='mt-2'>
                                    <span className='font-medium text-red-900'>Current Image {index + 1}:</span>
                                    <p>{existingImages[`image${index + 1}`]}</p>
                                </div>
                            )}
                        </div>
                    ))}

                    <div className='flex justify-end space-x-4 mt-4'>
                        <button type="button" onClick={handleSave} className='bg-blue-700 text-white py-2 px-4 rounded'>Save</button>
                        <button type="button" onClick={onClose} className='bg-red-500 text-white py-2 px-4 rounded'>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};



const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // Fetch products from the server
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

    return (

        <div className='ml-[10px] xsx:ml-[285px] mr-[12px] flex flex-col'>
            <div className='my-[8px] flex flex-col w-[100%] py-[35px] px-[15px] justify-center bg-red-50 rounded-xl overflow-x-auto'>

                <h2 className='text-2xl text-red-900 mb-[8px] font-bold '>Products Added</h2>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-lg text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-red-900 uppercase bg-gray-50 dark:bg-red-900  dark:text-red-200">

                            <tr>
                                <th scope="col" className="whitespace-nowrap text-center  px-6 py-3">Name</th>
                                <th scope="col" className="whitespace-nowrap text-center  px-6 py-3">Stock</th>
                                <th scope="col" className="whitespace-nowrap text-center  px-6 py-3">Subcategory</th>
                                <th scope="col" className="whitespace-nowrap text-center  px-6 py-3">Price</th>
                                <th scope="col" className="whitespace-nowrap text-center  px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
                            {products.map(product => (
                                <tr key={product._id} className='text-center odd:bg-white even:bg-red-100 text-custom-blue  border-b'>
                                    <th th scope="row" class="px-6 py-4 font-bold whitespace-nowrap">{product.name}</th>
                                    <td className="whitespace-nowrap text-center font-semibold text-red-700 px-6 py-4">{product.stock}</td>
                                    <td className="whitespace-nowrap text-center px-6 py-4">
                                        <div className=' text-white bg-red-700 py-[5px] font-medium rounded-lg'>{product.subcategory}</div>
                                    </td>
                                    <td className="whitespace-nowrap text-center px-6 py-4">${product.price}</td>
                                    <td className="whitespace-nowrap text-center px-6 py-4 flex justify-center space-x-4">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="text-blue-100 bg-blue-500 rounded-full p-2 hover:bg-blue-600 transition-colors"
                                        >
                                            <FiEdit size={24} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            className="text-red-600 bg-red-300 rounded-full p-2 hover:bg-red-200 transition-colors"
                                        >
                                            <MdDeleteOutline size={24} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>

            </div>
            {showModal && (
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
            )}

        </div>
    );
};

export default ProductList;
