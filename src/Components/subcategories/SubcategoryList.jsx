// src/components/SubcategoryManager.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';


import { MdDeleteOutline } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { IoMdAddCircleOutline } from "react-icons/io";


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
        const res = await axios.get('http://localhost:3001/api/subcategories');
        setSubcategories(res.data);
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/category');
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
        await axios.put(`http://localhost:3001/api/subcategories/${selectedSubcategory._id}`, formData);
      } else {
        // Create new subcategory
        await axios.post('http://localhost:3001/api/subcategories', formData);
      }
      setFormData({ name: '', description: '', category: '' });
      setSelectedSubcategory(null);
      setModalOpen(false);
      // Refresh the list
      const res = await axios.get('http://localhost:3001/api/subcategories');
      setSubcategories(res.data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
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
    <div className='ml-[10px] xsx:ml-[285px] mr-[12px] flex flex-col'>

      <h2 className='text-[32px] mt-[25px] underline underline-offset-2 mb-[5px] text-red-900 font-bold '>SUB-CATEGORY DETAILS</h2>


      {/* Table for displaying subcategories */}
      <div className='my-[8px] flex flex-col w-[100%] pb-[35px] px-[15px] justify-center border border-red-200 bg-red-50 rounded-xl overflow-x-auto'>
        <button onClick={handleCreate} className="ml-auto mt-[15px] bg-red-900 hover:text-red-900 hover:bg-red-100 text-red-100 mb-[8px] flex items-center rounded-[25px] px-[15px] py-[8px]">
          <IoMdAddCircleOutline className='text-[30px]' />
          <div className='ml-[5px] mb-[2px] font-medium text-[20px]'>Add Sub-Category</div>
        </button>

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-lg text-left text-gray-500 dark:text-gray-400">
            <thead className="text-sm text-red-900 uppercase bg-gray-50 dark:bg-red-900 dark:text-red-200">
              <tr>
                <th scope="col" className="whitespace-nowrap text-center px-6 py-3">Name</th>
                <th scope="col" className="whitespace-nowrap text-center px-6 py-3">Description</th>
                <th scope="col" className="whitespace-nowrap text-center px-6 py-3">Category</th>
                <th scope="col" className="whitespace-nowrap text-center px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subcategories.map(subcategory => (
                <tr key={subcategory._id} className='text-center odd:bg-white even:bg-red-100 text-custom-blue border-b'>
                  <th scope="row" className="px-6 py-4 font-bold whitespace-nowrap">{subcategory.name}</th>
                  <td className="whitespace-nowrap text-center px-6 py-4">{subcategory.description}</td>
                  <td className="whitespace-nowrap text-center px-6 py-4">
                    <div className=' text-white bg-red-700 py-[5px] font-medium rounded-lg'>{subcategory.category}</div>
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

      {/* Modal for creating or editing a subcategory */}
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
