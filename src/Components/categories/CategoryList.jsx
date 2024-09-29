import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { MdDeleteOutline } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaClipboardList } from 'react-icons/fa';


const CategoryForm = ({ category, onClose, onUpdate, onCreate }) => {
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
    } else {
      setFormData({ name: '', description: '' });
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (category) {
      try {
        const response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/category/${category._id}`, formData);
        onUpdate(response.data.category);
      } catch (error) {
        console.error('Error updating category:', error);
      }
    } else {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/category/add-category`, formData);
        onCreate(response.data.category);
      } catch (error) {
        console.error('Error creating category:', error);
      }
    }
    onClose();
  };

  const handleDelete = async () => {
    if (category && window.confirm('Are you sure you want to delete this category?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/category/${category._id}`);
        onClose();
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-red-50 shadow-custom-dark bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className='text-2xl underline text-red-800 font-bold text-center mb-4'>
          {category ? 'Edit Category Details' : 'Add New Category'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <div className="flex space-x-2">
            <button
              type="submit"
              className="bg-blue-500 text-white rounded px-4 py-2"
            >
              {category ? 'Update Category' : 'Add Category'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white rounded px-4 py-2"
            >
              Cancel
            </button>
            {category && (
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-500 text-white rounded px-4 py-2"
              >
                Delete
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};



const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/category`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleEdit = async (id) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/category/${id}`);
      setSelectedCategory(response.data);
    } catch (error) {
      console.error('Error fetching category:', error);
    }
  };

  const handleCreate = (newCategory) => {
    setCategories([...categories, newCategory]);
    setShowCreateForm(false);
  };

  const handleUpdate = (updatedCategory) => {
    setCategories(categories.map(category =>
      category._id === updatedCategory._id ? updatedCategory : category
    ));
    setSelectedCategory(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/category/${id}`);
        setCategories(categories.filter(category => category._id !== id));
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  return (
    <div className='ml-[10px] min-h-screen  bg-gray-100 xsx:ml-[260px] xsx:px-[20px] pb-[35px] pr-[12px] flex flex-col'>

      <h2 className='text-[28px] mt-[25px] underline underline-offset-2 mb-[5px] text-red-900 font-bold flex items-center'>
        <FaClipboardList className='mr-2' />
        Category Details
      </h2>

      <div className='my-[8px] flex flex-col w-[100%] pb-[35px] px-[15px] justify-center rounded-xl overflow-x-auto'>

        <div className='flex items-center mb-[12px] justify-between w-full'>
          <p className='text-lg font-[600] text-red-700'>Create,edit and Manage Categories</p>
          <button onClick={() => setShowCreateForm(true)} className="scale-[0.7] lg:scale-[0.85] bg-red-900 hover:text-red-900 hover:bg-red-100 text-red-100  flex items-center rounded-[25px] px-[15px] py-[8px]">
            <IoMdAddCircleOutline className='text-[30px]' />
            <div className='ml-[5px] mb-[2px] font-medium text-[20px]'>Add Category</div>
          </button>
        </div>

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">

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
                <tr key={category._id} className='text-center bg-white border-b-[3px] border-gray-300 text-[#2d0d0d]'>
                  <th scope="row" className="px-6 py-4 font-bold whitespace-nowrap">{category.name}</th>
                  <td className="whitespace-nowrap text-center px-6 py-4">{category.description}</td>
                  <td className="whitespace-nowrap text-center px-6 py-4 flex justify-center space-x-4">
                    <button
                      onClick={() => handleEdit(category._id)}
                      className="text-blue-100 bg-blue-500 rounded-full p-2 hover:bg-blue-600 transition-colors"
                    >
                      <FiEdit size={24} />
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="text-red-600 bg-red-200 rounded-full p-2 hover:bg-red-200 transition-colors"
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
      {(showCreateForm || selectedCategory) && (
        <CategoryForm
          category={selectedCategory}
          onClose={() => {
            setSelectedCategory(null);
            setShowCreateForm(false);
          }}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default CategoriesList;
