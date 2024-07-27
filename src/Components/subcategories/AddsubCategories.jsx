// src/components/SubcategoryCreationForm.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SubcategoryCreationForm = ({ selectedSubcategory, onSuccess }) => {
  const [form, setForm] = useState({ name: '', description: '', category: '' });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/category/');
        console.log('Categories fetched:', res.data); // Debug: Log fetched categories
        setCategories(res.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedSubcategory) {
      setForm({
        name: selectedSubcategory.name,
        description: selectedSubcategory.description,
        category: selectedSubcategory.category
      });
    } else {
      setForm({ name: '', description: '', category: '' });
    }
  }, [selectedSubcategory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedSubcategory) {
        // Update existing subcategory
        await axios.put(`http://localhost:3001/api/subcategories/${selectedSubcategory._id}`, form);
      } else {
        // Create new subcategory
        await axios.post('http://localhost:3001/api/subcategories', form);
      }
      alert('Subcategory has been successfully saved!'); // Alert on success
      setForm({ name: '', description: '', category: '' }); // Clear form fields
      onSuccess(); // Refresh list on success
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className='ml-[10px] xsx:ml-[285px] mr-[12px] flex flex-col'>
      <h2 className='text-lg font-bold mb-4'>{selectedSubcategory ? 'Edit Subcategory' : 'Create Subcategory'}</h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block text-sm font-medium mb-1'>Name:</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className='w-full border border-gray-300 rounded-md p-2'
          />
        </div>
        <div>
          <label className='block text-sm font-medium mb-1'>Description:</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            className='w-full border border-gray-300 rounded-md p-2'
          />
        </div>
        <div>
          <label className='block text-sm font-medium mb-1'>Category:</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className='w-full border border-gray-300 rounded-md p-2'
          >
            <option value="">Select Category</option>
            {categories.length > 0 ? (
              categories.map(cat => (
                <option key={cat._id} value={cat.name}>{cat.name}</option>
              ))
            ) : (
              <option value="">No Categories Available</option>
            )}
          </select>
        </div>
        <button type="submit" className='bg-blue-500 text-white font-bold py-2 px-4 rounded-md'>
          {selectedSubcategory ? 'Update' : 'Create'}
        </button>
      </form>
    </div>
  );
};

export default SubcategoryCreationForm;
