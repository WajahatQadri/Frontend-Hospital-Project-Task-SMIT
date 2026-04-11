import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';

const ViewAllMedicines = () => {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMedId, setEditingMedId] = useState(null);

    // Initial Form State matching your Mongoose Model
    const [formData, setFormData] = useState({
        name: "",
        company: "",
        category: "",
        purpose: "", // We will convert this to array on submit
        price: "",
        stock: "",
        expiryDate: "",
        potency: "",
        status: "Available"
    });

    const fetchMedicines = async () => {
        try {
            const { data } = await api.get("/medicines/get-all");
            setMedicines(data.medicines);
        } catch (error) {
            toast.error("Failed to load pharmacy stock");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchMedicines(); }, []);

    const handleOpenModal = (med = null) => {
        if (med) {
            setEditingMedId(med._id);
            setFormData({
                name: med.name,
                company: med.company,
                category: med.category,
                purpose: med.purpose.join(", "), // Convert array to string for input
                price: med.price,
                stock: med.stock,
                expiryDate: med.expiryDate ? med.expiryDate.split('T')[0] : "",
                potency: med.potency,
                status: med.status
            });
        } else {
            setEditingMedId(null);
            setFormData({ name: "", company: "", category: "", purpose: "", price: "", stock: "", expiryDate: "", potency: "", status: "Available" });
        }
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // Prepare data: Convert purpose string to Array
        const finalData = {
            ...formData,
            purpose: formData.purpose.split(",").map(p => p.trim())
        };

        try {
            if (editingMedId) {
                await api.put(`/medicines/admin/update/${editingMedId}`, finalData);
                toast.success("Stock updated");
            } else {
                await api.post("/medicines/admin/new", finalData);
                toast.success("Medicine added to inventory");
            }
            setIsModalOpen(false);
            fetchMedicines();
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Remove this medicine from inventory permanently?")) return;
        try {
            await api.delete(`/medicines/admin/delete/${id}`);
            toast.success("Medicine deleted");
            fetchMedicines();
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    const getStatusColor = (status, stock) => {
        if (stock <= 0 || status === "Out of Stock") return "bg-red-100 text-red-600 border-red-200";
        if (status === "Discontinued") return "bg-slate-100 text-slate-500 border-slate-200";
        return "bg-emerald-100 text-emerald-600 border-emerald-200";
    };

    if (loading) return <div className="p-10 text-center"><span className="loading loading-spinner loading-lg text-primary"></span></div>;

    return (
        <div className="p-4 md:p-8 bg-slate-50 min-h-screen text-black">

            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-2xl">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.823.362 2.25 2.25 0 00-1.983 2.224v1.844a2.25 2.25 0 002.25 2.25h15a2.25 2.25 0 002.25-2.25v-1.844a2.25 2.25 0 00-2.319-2.224zM8.903 4.125a3.375 3.375 0 116.194 0 3.375 3.375 0 01-6.194 0z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-slate-800 uppercase italic tracking-tighter">Pharmacy Stock</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Hospital Inventory Control</p>
                    </div>
                </div>
                <button onClick={() => handleOpenModal()} className="btn btn-primary px-8 rounded-2xl text-white font-black uppercase tracking-widest shadow-lg shadow-blue-100 border-none h-14">
                    + Register Medicine
                </button>
            </div>

            {/* --- TABLE --- */}
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table w-full border-separate border-spacing-y-2 px-6">
                        <thead>
                            <tr className="text-slate-400 text-[10px] uppercase font-black tracking-widest border-none">
                                <th className="bg-transparent">Medicine Detail</th>
                                <th className="bg-transparent">Category & Usage</th>
                                <th className="bg-transparent text-center">Inventory</th>
                                <th className="bg-transparent">Status</th>
                                <th className="bg-transparent">Price</th>
                                <th className="bg-transparent text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {medicines.map((med) => (
                                <tr key={med._id} className="bg-white hover:bg-slate-50 transition-all border-none">
                                    <td className="rounded-l-2xl border-y border-l border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex flex-col items-center justify-center text-white">
                                                <span className="text-[8px] font-bold opacity-60">EXP</span>
                                                <span className="text-[10px] font-black">{new Date(med.expiryDate).toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })}</span>
                                            </div>
                                            <div>
                                                <div className="font-black text-slate-800 uppercase italic leading-tight">{med.name}</div>
                                                <div className="text-[10px] font-bold text-slate-400 uppercase">{med.company} • {med.potency}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="border-y border-slate-100">
                                        <div className="badge badge-ghost font-black text-[9px] uppercase mb-1">{med.category}</div>
                                        <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{med.purpose.join(", ")}</div>
                                    </td>
                                    <td className="text-center border-y border-slate-100">
                                        <div className={`text-lg font-black ${med.stock < 10 ? 'text-red-500' : 'text-slate-700'}`}>{med.stock}</div>
                                        <div className="text-[9px] font-bold text-slate-400 uppercase">Units Left</div>
                                    </td>
                                    <td className="border-y border-slate-100">
                                        <span className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase ${getStatusColor(med.status, med.stock)}`}>
                                            {med.stock <= 0 ? "Out of Stock" : med.status}
                                        </span>
                                    </td>
                                    <td className="border-y border-slate-100">
                                        <div className="font-black text-slate-800 uppercase">PKR {med.price}</div>
                                        <div className="text-[8px] text-slate-400 uppercase font-bold">Per Unit</div>
                                    </td>
                                    <td className="rounded-r-2xl border-y border-r border-slate-100 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleOpenModal(med)} className="btn btn-square btn-ghost btn-sm text-primary">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                            </button>
                                            <button onClick={() => handleDelete(med._id)} className="btn btn-square btn-ghost btn-sm text-red-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- MODAL --- */}
            <div className={`modal ${isModalOpen ? 'modal-open' : ''} pointer-events-auto px-4`}>
    <div className="modal-box p-0 bg-white rounded-[2rem] max-w-3xl border-none shadow-2xl transition-all duration-500 max-h-[95vh] overflow-y-auto no-scrollbar">
        
        {/* --- COMPACT HEADER --- */}
        <div className="bg-slate-900 px-8 py-6 text-white sticky top-0 z-50 flex justify-between items-center border-b border-white/10">
            <div>
                <h3 className="font-black text-xl md:text-2xl uppercase italic tracking-tight flex items-center gap-3">
                    <span className="w-2 h-8 bg-primary rounded-full"></span>
                    {editingMedId ? "Edit Medicine" : "Register Stock"}
                </h3>
                <p className="text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em] opacity-70">Inventory Management</p>
            </div>
            <button 
                type="button"
                onClick={() => setIsModalOpen(false)} 
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <form onSubmit={handleFormSubmit} className="p-8 space-y-8">
            
            {/* SECTION 1: IDENTITY */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-md">Step 01</span>
                    <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">General Information</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                        <label className="label-text text-[10px] font-bold text-slate-500 uppercase mb-1 ml-1">Medicine Name</label>
                        <input type="text" className="input input-bordered bg-slate-50/50 border-slate-200 font-bold rounded-xl h-11 text-sm focus:ring-0" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Panadol" required />
                    </div>
                    <div className="form-control">
                        <label className="label-text text-[10px] font-bold text-slate-500 uppercase mb-1 ml-1">Manufacturer</label>
                        <input type="text" className="input input-bordered bg-slate-50/50 border-slate-200 font-bold rounded-xl h-11 text-sm" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} placeholder="e.g. GSK" required />
                    </div>
                    <div className="form-control">
                        <label className="label-text text-[10px] font-bold text-slate-500 uppercase mb-1 ml-1">Category</label>
                        <select className="select select-bordered bg-slate-50/50 border-slate-200 font-bold rounded-xl h-11 text-sm" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required>
                            <option value="">Select Type</option>
                            <option value="Tablet">Tablet</option>
                            <option value="Syrup">Syrup</option>
                            <option value="Injection">Injection</option>
                            <option value="Capsule">Capsule</option>
                        </select>
                    </div>
                    <div className="form-control">
                        <label className="label-text text-[10px] font-bold text-slate-500 uppercase mb-1 ml-1">Strength</label>
                        <input type="text" placeholder="e.g. 500mg" className="input input-bordered bg-slate-50/50 border-slate-200 font-bold rounded-xl h-11 text-sm" value={formData.potency} onChange={(e) => setFormData({...formData, potency: e.target.value})} required />
                    </div>
                    <div className="form-control md:col-span-2">
                        <label className="label-text text-[10px] font-bold text-slate-500 uppercase mb-1 ml-1">Primary Usage</label>
                        <input type="text" placeholder="e.g. Fever, Pain Relief (Comma separated)" className="input input-bordered bg-slate-50/50 border-slate-200 font-bold rounded-xl h-11 text-sm" value={formData.purpose} onChange={(e) => setFormData({...formData, purpose: e.target.value})} required />
                    </div>
                </div>
            </div>

            {/* SECTION 2: INVENTORY & STATUS */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-md">Step 02</span>
                    <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Inventory & Compliance</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="form-control">
                        <label className="label-text text-[10px] font-bold text-slate-500 uppercase mb-1 ml-1">Price (PKR)</label>
                        <input type="number" className="input input-bordered bg-emerald-50/30 border-emerald-100 text-emerald-700 font-black rounded-xl h-11 text-sm" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
                    </div>
                    <div className="form-control">
                        <label className="label-text text-[10px] font-bold text-slate-500 uppercase mb-1 ml-1">Stock Qty</label>
                        <input type="number" className="input input-bordered bg-slate-50/50 border-slate-200 font-bold rounded-xl h-11 text-sm" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} required />
                    </div>
                    <div className="form-control">
                        <label className="label-text text-[10px] font-bold text-slate-500 uppercase mb-1 ml-1">Market Status</label>
                        <select className="select select-bordered bg-slate-50/50 border-slate-200 font-bold rounded-xl h-11 text-[11px] uppercase" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} required>
                            <option value="Available">Available</option>
                            <option value="Out of Stock">Out of Stock</option>
                            <option value="Discontinued">Discontinued</option>
                        </select>
                    </div>
                </div>

                <div className="bg-slate-900 rounded-2xl p-5 flex items-center justify-between">
                    <div>
                        <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Strict Requirement</p>
                        <h5 className="text-white font-bold text-xs">Medical Expiry Date</h5>
                    </div>
                    <input type="date" className="input input-bordered bg-white border-none font-black rounded-xl h-11 text-sm text-red-600 w-44" value={formData.expiryDate} onChange={(e) => setFormData({...formData, expiryDate: e.target.value})} required />
                </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3 pt-4">
                <button 
                    type="button" 
                    className="flex-1 h-12 rounded-xl font-black uppercase text-[11px] tracking-widest bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all cursor-pointer" 
                    onClick={() => setIsModalOpen(false)}
                >
                    Cancel
                </button>
                <button 
                    type="submit" 
                    className="flex-[2] h-12 rounded-xl bg-primary text-white font-black uppercase text-[11px] tracking-widest shadow-lg shadow-blue-100 hover:opacity-90 transition-all cursor-pointer"
                >
                    {editingMedId ? "Update Inventory" : "Confirm Stock"}
                </button>
            </div>
        </form>
    </div>
    <div className="modal-backdrop bg-slate-900/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
</div>
        </div>
    );
};

export default ViewAllMedicines;