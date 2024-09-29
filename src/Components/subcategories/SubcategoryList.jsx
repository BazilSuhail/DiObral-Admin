// src/components/SubcategoryManager.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';


import { MdDeleteOutline } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaClipboardList } from 'react-icons/fa';

const SubcategoryManager = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
  });
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/subcategories`);
        setSubcategories(res.data);
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/category`);
        setCategories(res.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchSubcategories();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedSubcategory) {
      setFormData({
        name: selectedSubcategory.name || '',
        description: selectedSubcategory.description || '',
        category: selectedSubcategory.category || '',
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
        await axios.put(`${process.env.REACT_APP_API_BASE_URL}/subcategories/${selectedSubcategory._id}`, formData);
      } else {
        // Create new subcategory
        await axios.post(`${process.env.REACT_APP_API_BASE_URL}/subcategories`, formData);
      }
      setFormData({ name: '', description: '', category: '' });
      setSelectedSubcategory(null);
      setModalOpen(false);
      // Refresh the list
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/subcategories`);
      setSubcategories(res.data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subcategory?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/subcategories/${id}`);
        setSubcategories(subcategories.filter(sub => sub._id !== id));
      } catch (error) {
        console.error('Error deleting subcategory:', error);
      }
    }
  };

  const handleEdit = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedSubcategory(null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedSubcategory(null);
    setFormData({ name: '', description: '', category: '' });
  };

  return (
    <div className='ml-[10px] min-h-screen  bg-gray-100 xsx:ml-[260px] xsx:px-[20px] pb-[35px] pr-[12px] flex flex-col'>
      <h2 className='text-[28px] mt-[25px] underline underline-offset-2 mb-[5px] text-red-900 font-bold flex items-center'>
        <FaClipboardList className='mr-2' />
        Sub-Category Details
      </h2>
      <div className='flex flex-col w-[100%] justify-center rounded-xl overflow-x-auto'>

        <div className='flex lg:items-center mb-[12px] lg:flex-row flex-col lg:justify-between w-full'>
          <p className='text-lg font-[600] text-red-700'>Create,edit and Manage sub-categories</p>
          <button onClick={handleCreate} className="scale-[0.7] lg:scale-[0.85] bg-red-900 hover:text-red-900 hover:bg-red-100 text-red-100  flex items-center rounded-[25px] px-[15px] py-[8px]">
            <IoMdAddCircleOutline className='text-[30px]' />
            <div className='ml-[5px] mb-[2px] font-medium text-[20px]'>Add Sub-Category</div>
          </button>
        </div>

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-lg text-left text-gray-500 dark:text-gray-400">
            <thead className="text-sm text-red-900 uppercase bg-gray-50 dark:bg-red-900 dark:text-red-100">
              <tr>
                <th scope="col" className="whitespace-nowrap text-center px-6 py-3">Name</th>
                <th scope="col" className="whitespace-nowrap text-center px-6 py-3">Description</th>
                <th scope="col" className="whitespace-nowrap text-center px-6 py-3">Category</th>
                <th scope="col" className="whitespace-nowrap text-center px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subcategories.map(subcategory => (
                <tr key={subcategory._id} className='text-center bg-white border-b-[3px] border-gray-300 text-[#2d0d0d]'>
                  <th scope="row" className="px-6 py-4 font-bold whitespace-nowrap">{subcategory.name}</th>
                  <td className="whitespace-nowrap text-center px-6 py-4">{subcategory.description}</td>
                  <td className="whitespace-nowrap text-center px-6 py-4">
                    <div className=' text-red-700 scale-[0.9] bg-red-100 py-[5px] font-medium rounded-[25px]'>{subcategory.category}</div>
                  </td>
                  <td className="whitespace-nowrap text-center px-6 py-4 flex justify-center space-x-4">
                    <button
                      onClick={() => handleEdit(subcategory)}
                      className="text-blue-100 bg-blue-500 rounded-full p-2 hover:bg-blue-600 transition-colors"
                    >
                      <FiEdit size={24} />
                    </button>
                    <button
                      onClick={() => handleDelete(subcategory._id)}
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

      {modalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className='text-2xl underline text-red-800 font-bold text-center mb-4'>
              {selectedSubcategory ? 'Edit Subcategory' : 'Create Subcategory'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block font-medium text-red-700">Subcategory Name:</label>
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
                <label htmlFor="description" className="block font-medium text-red-700">Description:</label>
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
                <label htmlFor="category" className="block font-medium text-red-700">Category:</label>
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
              <button
                type="button"
                onClick={handleCloseModal}
                className="bg-gray-500 text-white rounded px-4 py-2 ml-2"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubcategoryManager;
