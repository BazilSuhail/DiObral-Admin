// frontend/src/components/CategoriesList.js

import React, { useEffect, useState } from 'react';
import axios from 'axios'; 

const CategoryForm = ({ category, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
      name: '',
      description: '',
    });
  
    useEffect(() => {
      if (category) {
        setFormData({
          name: category.name,
          description: category.description,
        });
      }
    }, [category]);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleUpdate = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.put(`http://localhost:3001/api/category/${category._id}`, formData);
        onUpdate(response.data.category);
      } catch (error) {
        console.error('Error updating category:', error);
      }
    };
  
    const handleDelete = async () => {
      if (window.confirm('Are you sure you want to delete this category?')) {
        try {
          await axios.delete(`http://localhost:3001/api/category/${category._id}`);
          onClose();
        } catch (error) {
          console.error('Error deleting category:', error);
        }
      }
    };
  
    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4">Edit Category</h2>
          <form onSubmit={handleUpdate} className="space-y-4">
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
              Update Category
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-500 text-white rounded px-4 py-2 ml-2"
            >
              Delete
            </button>
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
  

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/category');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleEdit = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/category/${id}`);
      setSelectedCategory(response.data);
    } catch (error) {
      console.error('Error fetching category:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await axios.delete(`http://localhost:3001/api/category/${id}`);
        setCategories(categories.filter(category => category._id !== id));
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  return (
    <div className='ml-[10px] xsx:ml-[285px] mr-[12px] flex flex-col'>
      <h2 className="text-2xl font-bold mb-4">Categories</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Description</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(category => (
            <tr key={category._id}>
              <td className="border px-4 py-2">{category.name}</td>
              <td className="border px-4 py-2">{category.description}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleEdit(category._id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(category._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedCategory && (
        <CategoryForm
          category={selectedCategory}
          onClose={() => setSelectedCategory(null)}
          onUpdate={(updatedCategory) => {
            setCategories(categories.map(category => 
              category._id === updatedCategory._id ? updatedCategory : category
            ));
            setSelectedCategory(null);
          }}
        />
      )}
    </div>
  );
};

export default CategoriesList;
