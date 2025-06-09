import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MdClose,
  MdEdit,
  MdImage,
  MdInventory, 
  MdDescription,
  MdSave,
  MdCancel,
} from "react-icons/md"
import axios from "axios"

export default function ProductEditModal({ isOpen, onClose, product, onSave }) {
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
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  }

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <MdEdit className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Edit Product</h2>
                    <p className="text-red-100">Update product information and images</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
                >
                  <MdClose className="w-6 h-6" />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Basic Info */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <MdDescription className="text-red-600" />
                      Basic Information
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter product name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 resize-none"
                          placeholder="Enter product description"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                          <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-800 font-medium">
                            {formData.category || "Select subcategory first"}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory</label>
                          <select
                            name="subcategory"
                            value={subcategories.find((sub) => sub.name === formData.subcategory)?._id || ""}
                            onChange={handleSubcategoryChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                          >
                            <option value="">Select subcategory</option>
                            {subcategories.map((subcat) => (
                              <option key={subcat._id} value={subcat._id}>
                                {subcat.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <MdInventory className="text-red-600" />
                      Inventory & Pricing
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
                        <input
                          type="number"
                          name="stock"
                          value={formData.stock}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          step="0.01"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                          placeholder="0.00"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sale (% off)</label>
                        <input
                          type="number"
                          name="sale"
                          value={formData.sale}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sizes (comma separated)</label>
                        <input
                          type="text"
                          name="size"
                          value={formData.size}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                          placeholder="S, M, L, XL"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Images */}
                <div className="space-y-7">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <MdImage className="text-red-600" />
                      Main Product Image
                    </h3>

                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-400 transition-colors duration-200">
                        <input
                          type="file"
                          name="mainImage"
                          onChange={handleImageChange}
                          accept="image/*"
                          className="hidden"
                          id="mainImage"
                        />
                        <label htmlFor="mainImage" className="cursor-pointer">
                          <MdImage className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600">Click to upload main image</p>
                          <p className="text-sm text-gray-400">PNG, JPG up to 10MB</p>
                        </label>
                      </div>

                      {existingImages.mainImage && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-sm text-blue-800">
                            <strong>Current:</strong> {existingImages.mainImage}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl py-8 px-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
                      <MdImage className="text-red-600" />
                      Additional Images
                    </h3>

                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5].map((index) => (
                        <div key={index} className="space-y-2 pb-3 pt-1 px-2 border-[2px] border-gray-200 rounded-lg bg-white flex items-center">
                          <label className="block text-sm font-medium text-gray-700">Image {index}</label>
                          <div className="">
                            <input
                              type="file"
                              name={`image${index}`}
                              onChange={handleImageChange}
                              accept="image/*"
                              className="w-full text-sm ml-[15px] text-gray-600 file:mr-4 file:py-1 file:text-[12px] file:px-4 file:rounded-lg file:border-0 file:bg-red-100 file:text-red-700 hover:file:bg-red-100"
                            />
                          </div>
                          {existingImages[`image${index}`] && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                              <p className="text-xs text-blue-800">
                                <strong>Current:</strong> {existingImages[`image${index}`]}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 pr-4 flex justify-end gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="flex items-center gap-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <MdCancel className="w-4 h-4" />
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200"
              >
                <MdSave className="w-4 h-4" />
                Save Changes
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
