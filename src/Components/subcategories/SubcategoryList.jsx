// src/components/SubcategoryList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios'; 


const SubcategoryModal = ({ selectedSubcategory, onSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch available categories
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/category'); // Update the URL to your API endpoint for categories
        setCategories(res.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedSubcategory) {
      setFormData({
        name: selectedSubcategory.name || '',
        description: selectedSubcategory.description || '',
        category: selectedSubcategory.category || '', // Ensure default value is set
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
        const response = await axios.put(`http://localhost:3001/api/subcategories/${selectedSubcategory._id}`, formData);
        onSuccess(response.data);
      } else {
        // Create new subcategory
        const response = await axios.post('http://localhost:3001/api/subcategories', formData);
        onSuccess(response.data);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleDelete = async () => {
    if (selectedSubcategory) {
      if (window.confirm('Are you sure you want to delete this subcategory?')) {
        try {
          await axios.delete(`http://localhost:3001/api/subcategories/${selectedSubcategory._id}`);
          onClose();
        } catch (error) {
          console.error('Error deleting subcategory:', error);
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">
          {selectedSubcategory ? 'Edit Subcategory' : 'Create Subcategory'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-700">Subcategory Name:</label>
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
          <div>
            <label htmlFor="category" className="block text-gray-700">Category:</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="border rounded p-2 w-full"
              required
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white rounded px-4 py-2"
          >
            {selectedSubcategory ? 'Update Subcategory' : 'Create Subcategory'}
          </button>
          {selectedSubcategory && (
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-500 text-white rounded px-4 py-2 ml-2"
            >
              Delete
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white rounded px-4 py-2 ml-2"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};


const SubcategoryList = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/subcategories');
        setSubcategories(res.data);
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      }
    };

    fetchSubcategories();
  }, []);

  const handleEdit = (subcategory) => {
    setSelectedSubcategory(subcategory);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subcategory?')) {
      try {
        await axios.delete(`http://localhost:3001/api/subcategories/${id}`);
        setSubcategories(subcategories.filter(sub => sub._id !== id));
      } catch (error) {
        console.error('Error deleting subcategory:', error);
      }
    }
  };

  const handleSuccess = () => {
    setSelectedSubcategory(null);
    // Refresh the list
    const fetchSubcategories = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/subcategories');
        setSubcategories(res.data);
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      }
    };

    fetchSubcategories();
  };

  return (
    <div className='ml-[10px] xsx:ml-[285px] mr-[12px] flex flex-col'>
      <h1 className="text-2xl font-bold mb-4">Subcategory Management</h1>
      
      {/* Display form for creating or editing a subcategory */}
      {selectedSubcategory && (
        <SubcategoryModal
          selectedSubcategory={selectedSubcategory}
          onSuccess={handleSuccess}
          onClose={() => setSelectedSubcategory(null)} // Close the form when done
        />
      )}

      {/* Table for displaying subcategories */}
      <table className="min-w-full bg-white border border-gray-300 mt-4">
        <thead>
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Description</th>
            <th className="border px-4 py-2">Category</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {subcategories.map(subcategory => (
            <tr key={subcategory._id}>
              <td className="border px-4 py-2">{subcategory.name}</td>
              <td className="border px-4 py-2">{subcategory.description}</td>
              <td className="border px-4 py-2">{subcategory.category}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleEdit(subcategory)}
                  className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(subcategory._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubcategoryList;