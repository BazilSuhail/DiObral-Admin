import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
                const res = await axios.get('http://localhost:3001/api/subcategories'); // Update the URL to your API endpoint for subcategories
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
            const response = await axios.post('http://localhost:3001/api/products/add', formDataToSend, {
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
        <div className='ml-[10px] xsx:ml-[285px] mr-[12px] flex flex-col'>
            <h2 className='text-xl font-semibold mb-4'>Add Product</h2>
            <form onSubmit={handleSubmit} className='space-y-4'>
                <div className='flex flex-col'>
                    <label className='font-medium'>Name:</label>
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
                    <label className='font-medium'>Description:</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className='border border-gray-300 p-2 rounded'
                        required
                    />
                </div>
                <div className='flex flex-col'>
                    <label className='font-medium'>Category:</label>
                    <div className='p-2 border border-gray-300 rounded'>{formData.category || 'Select a subcategory to set category'}</div>
                </div>

                <div className='flex flex-col'>
                    <label className='font-medium'>Subcategory:</label>
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
                    <label className='font-medium'>Size (comma separated):</label>
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
                    <label className='font-medium'>Stock:</label>
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
                    <label className='font-medium'>Price:</label>
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
                    <label className='font-medium'>Sale (% off):</label>
                    <input
                        type="number"
                        required
                        name="sale"
                        value={formData.sale}
                        onChange={handleChange}
                        className='border border-gray-300 p-2 rounded'
                    />
                </div>
                <div className='flex flex-col'>
                    <label className='font-medium'>Main Image:</label>
                    <input
                        type="file"
                        name="mainImage"
                        onChange={handleImageChange}
                        className='border border-gray-300 p-2 rounded'
                        required
                    />
                </div>
                {[...Array(5)].map((_, index) => (
                    <div key={index} className='flex flex-col'>
                        <label className='font-medium'>Image {index + 1}:</label>
                        <input
                            type="file"
                            name={`image${index + 1}`}
                            onChange={handleImageChange}
                            className='border border-gray-300 p-2 rounded'
                            required
                        />
                    </div>
                ))}
                <button type="submit" className='bg-blue-500 text-white p-2 rounded hover:bg-blue-600'>
                    Add Product
                </button>
            </form>
        </div>
    );
};

export default AddProductForm;
