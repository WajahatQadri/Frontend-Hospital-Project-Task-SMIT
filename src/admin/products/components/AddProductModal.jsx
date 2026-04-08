import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import api from '../../../utils/api';
import { toast } from 'react-toastify';


const initialFormState = {
    title: '',
    description: '',
    price: '',
    category: '',
    stocks: '',
};

const AddProductModal = ({ isOpen, onClose, fetchProducts }) => {
    const [formData, setFormData] = useState(initialFormState);
    const [ categories, setCategories ] = useState([]);
    const [ newCategoryInput, setNewCategoryInput ] = useState("");
    const fetchCategories = async () => {
        try {
            const res = await api.get(`/categories/get-all${labelName}`, { withCredentials: true });
            setCategories(res.data.categories);
        } catch (error) {
            console.error("Error fetching categories", error);
        }
    };

    useEffect(() => {
        if (isOpen) fetchCategories();
    }, [isOpen]);

    const handleAddNewCategory = async () => {
        if (!newCategoryInput.trim()) return toast.warn("Category cannot be empty");
        try {
            // 1. Save string to Category Model
            const res = await api.post("/categories/add", 
                { name: newCategoryInput }, 
                { withCredentials: true }
            );
            // 2. Update local list and select it
            setCategories([...categories, res.data.category]);
            setFormData({ ...formData, category: res.data.category.name });
            setNewCategoryInput("");
            toast.success("Category added to database");
        } catch (error) {
            toast.error(error.response?.data?.message || "Error adding category");
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response =await api.post(
                "/medicines/admin/new",
                formData,
                { withCredentials: true }
            );
            toast.success("Product added successfully");
            const savedProduct = response.data.product
            fetchProducts((prevProducts) => [...prevProducts, savedProduct]) // Optimistically update UI without refetching entire list
            setFormData(initialFormState); // Reset form
            onClose();       // Close modal
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add product");
        }
    };

    const handleModalClose = () => {
    setFormData(initialFormState);
    setNewCategoryInput(""); // Reset the category text box too
    onClose();
    }
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div 
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={handleModalClose}
        >
            <div 
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-primary p-4 text-white flex justify-between items-center">
                    <h2 className="text-lg font-bold">Add New Product</h2>
                    <button onClick={handleModalClose} className="text-2xl hover:text-gray-200">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-black bg-white">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase">Product Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-700"
                            placeholder="e.g. iPhone 15 Pro"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase">Price ($)</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-700"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase">Stock Count</label>
                            <input
                                type="number"
                                name="stocks"
                                value={formData.stocks}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-700"
                                required
                            />
                        </div>
                    </div>

                    <div className='bg-gray-200 px-4 pt-1 pb-4 border-gray-50 rounded-xl'>
                        <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                        <select 
                            name="category" 
                            value={formData.category} 
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                            className="w-full p-2 border rounded-lg bg-white mb-3 outline-none text-gray-700 border-gray-300"
                            required
                        >
                            <option value="">-- Select Category --</option>
                            {categories.map((cat) => (
                                // VALUE IS NOW THE NAME (STRING)
                                <option  className='text-grya-700' key={cat._id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={newCategoryInput} 
                                onChange={(e) => setNewCategoryInput(e.target.value)}
                                className="flex-1 p-2 border rounded-lg text-sm bg-white outline-none border-gray-300 text-gray-700"
                                placeholder="Add new..."
                            />
                            <button type="button" onClick={handleAddNewCategory} className="cursor-pointer px-4 py-2 bg-gray-800 text-white rounded-lg text-xs">Add</button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-700"
                            required
                        ></textarea>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleModalClose}
                            className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-bold transition-all cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold transition-all shadow-lg cursor-pointer"
                        >
                            Create Product
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default AddProductModal;