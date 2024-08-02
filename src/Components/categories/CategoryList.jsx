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
    <div className="fixed inset-0 bg-red-50 shadow-custom-dark bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">

        <h2 className='text-2xl underline text-red-800 font-bold text-center mb-4'>Edit Category Details</h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label htmlFor="name" className="block font-medium text-red-700">Category Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border border-red-700 rounded p-2 w-full"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block font-medium text-red-700">Description:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="border border-red-700 rounded p-2 w-full"
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
      <div className='my-[8px] flex flex-col w-[100%] py-[35px] px-[15px] justify-center border border-red-200 bg-red-50 rounded-xl overflow-x-auto'>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <h2 className='text-3xl underline mb-[17px] text-red-900 font-bold '>Categories</h2>
          <table className="w-full text-lg text-left text-gray-500 dark:text-gray-400">
            <thead className="text-sm text-red-900 uppercase bg-gray-50 dark:bg-red-900  dark:text-red-200">
              <tr>
                <th scope="col" className="whitespace-nowrap text-center  px-6 py-3">Name</th>
                <th scope="col" className="whitespace-nowrap text-center  px-6 py-3">Description</th>
                <th scope="col" className="whitespace-nowrap text-center  px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(category => (
                <tr key={category._id}  className='text-center odd:bg-white even:bg-red-100 text-custom-blue  border-b'>
                  <th th scope="row" class="px-6 py-4 font-bold whitespace-nowrap">{category.name}</th>
                  <td className="whitespace-nowrap text-center px-6 py-4">{category.description}</td>
                  <td className="whitespace-nowrap text-center px-6 py-4">
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

        </div>

      </div>
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
