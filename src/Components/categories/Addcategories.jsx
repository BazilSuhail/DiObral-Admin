// frontend/src/components/CategoryForm.js

import React, { useState } from 'react';
import axios from 'axios';

const CategoryForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:3001/api/category/add-category', formData);
      alert(response.data.message);
      setFormData({ name: '', description: '' }); // Clear form after submission
    } catch (error) {
      alert('Error creating category');
      console.error(error);
    }
  };

    return (
      
    <div className='ml-[10px] xsx:ml-[285px] mr-[12px] flex flex-col'>
      <h2 className="text-2xl font-bold mb-4">Add New Category</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-gray-700">Category Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border rounded p-2 w-full"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-gray-700">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="border rounded p-2 w-full"
            rows="4"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white rounded px-4 py-2"
        >
          Add Category
        </button>
      </form>
    </div>
  );
};

export default CategoryForm;
