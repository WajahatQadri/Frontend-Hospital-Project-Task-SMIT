import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import api from '../../../utils/api';
import { toast } from 'react-toastify';

const UpdateProductModal = ({ isOpen, onClose, product, fetchProducts }) => {
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        category: '',
        stocks: '',
        description: '',
    });
    const [ categories, setCategories ] = useState([]);
    const [ newCategoryInput, setNewCategoryInput ] = useState("");
    const fetchCategories =  async () => {
        try {
            const response = await api.get("/medicines/get-all")
            // console.log(response.data.categories);
            setCategories(response.data.categories);
            
        } catch (error) {
            
        }
    }

    useEffect(()=> {
        fetchCategories()
    },[isOpen])

    // Fill form when product prop changes
    useEffect(() => {
        if (product && isOpen) {
            setFormData({
                title: product.title || '',
                price: product.price || '',
                category: product.category || '',
                stocks: product.stocks || '',
                description: product.description || ''
            });
        }
    }, [product,isOpen]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
        const handleAddNewCategory = async () => {
        if (!newCategoryInput.trim()) return toast.warn("Category cannot be empty");
        try {
            const response = await api.post("/medicines/admin/new", 
                { name: newCategoryInput }, 
                { withCredentials: true }
            );
            setCategories([...categories, response.data.category]);
            setFormData({ ...formData, category: response.data.category.name });
            setNewCategoryInput("");
            toast.success("Category added!");
        } catch (error) {
            toast.error(error.response?.data?.message);
            console.log(error);
            
        }
    };
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            // Ensure your backend route is: /update-product/:id
            await api.put(
                `/medicines/admin/update/${product._id}`,
                formData,
                { withCredentials: true }
            );
            toast.success("Product updated successfully");
            fetchProducts(); 
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Update failed");
        }
    };
    const handleModalClose = () => {
    setNewCategoryInput(""); // Clear the add category box
    // Re-fill the form with the original product data to "undo" changes
    if (product) {
        setFormData({
            title: product.title || '',
            price: product.price || '',
            category: product.category || '',
            stocks: product.stocks || '',
            description: product.description || ''
        });
    }
    onClose();
};

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div 
            className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            style={{ zIndex: 9999 }}
            onClick={handleModalClose}
        >
            <div 
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-gray-800 p-4 text-white flex justify-between items-center">
                    <h2 className="text-lg font-bold">Edit Product</h2>
                    <button onClick={handleModalClose} className="text-2xl">&times;</button>
                </div>

                <form onSubmit={handleUpdate} className="p-6 space-y-4 text-black bg-white">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase">Product Name</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-500"
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
                                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase">Stock Quantity</label>
                            <input
                                type="number"
                                name="stocks"
                                value={formData.stocks}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-500"
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
                            <option  className='text-black' value="">-- Select Category --</option>
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
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-500"
                        ></textarea>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleModalClose}
                            className=" cursor-pointer flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-bold transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="cursor-pointer flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold transition-all shadow-lg shadow-blue-200"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default UpdateProductModal;