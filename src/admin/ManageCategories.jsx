import React, { useState, useEffect, useMemo } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const ManageCategories = () => {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedLabels, setExpandedLabels] = useState([]);
    const [viewingLinksId, setViewingLinksId] = useState(null); // Track which row is showing names

    const [name, setName] = useState("");
    const [label, setLabel] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    const fetchStats = async () => {
        try {
            const { data } = await api.get("/categories/stats");
            setStats(data.stats);
        } catch (error) { toast.error("Error loading categories"); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchStats(); }, []);

    const groupedData = useMemo(() => {
        return stats.reduce((acc, cat) => {
            if (!acc[cat.label]) acc[cat.label] = [];
            acc[cat.label].push(cat);
            return acc;
        }, {});
    }, [stats]);

    const toggleAccordion = (labelName) => {
        setExpandedLabels(prev => prev.includes(labelName) ? prev.filter(l => l !== labelName) : [...prev, labelName]);
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        try {
            await api.post("/categories/add", { name, label });
            toast.success("Category added");
            setName("");
            fetchStats();
        } catch (error) { toast.error(error.response?.data?.message || "Error"); }
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`/categories/delete/${categoryToDelete._id}`);
            toast.success("Category removed");
            fetchStats();
            setShowDeleteModal(false);
        } catch (error) { toast.error("Delete failed"); }
    };

    if (loading) return <div className="p-20 text-center"><span className="loading loading-spinner text-primary"></span></div>;

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-10">

            {/* ADD FORM */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
                <h2 className="text-xl font-black text-slate-800 uppercase italic mb-6">Register Master Item</h2>
                <form onSubmit={handleAddCategory} className="flex flex-col md:flex-row items-center gap-3 w-full">
    {/* Input Field - Slimmer height and consistent rounding */}
    <input 
        type="text" 
        placeholder="NAME (E.G. SURGEON)" 
        className="w-full md:flex-1 input input-bordered bg-slate-50 text-slate-600 text-sm font-medium h-12 rounded-xl border-slate-200 focus:outline-none focus:border-indigo-500" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        required 
    />

    {/* Select Dropdown - Removed DaisyUI extra padding conflicts */}
    <select
        className="w-full md:w-48 select select-bordered bg-slate-50 text-slate-700 text-sm font-bold h-12 rounded-xl border-slate-200 uppercase focus:outline-none focus:border-indigo-500"
        value={label} 
        onChange={(e) => setLabel(e.target.value)} 
        required
    >
        <option value="" disabled>GROUP</option>
        <option value="SPECIALIZATION">SPECIALIZATION</option>
        <option value="MEDICINE_TYPE">MEDICINE</option>
        <option value="DISEASE_TYPE">DISEASE</option>
        <option value="GENDER">GENDER</option>
        <option value="BLOOD_GROUP">BLOOD</option>
    </select>

    {/* Submit Button - Matches height exactly */}
    <button 
        type="submit" 
        className="btn btn-primary w-full md:w-auto px-8 h-12 min-h-0 rounded-xl text-white text-sm font-bold uppercase border-none"
    >
        Add
    </button>
</form>

            </div>

            {/* ACCORDION LIST */}
            <div className="space-y-4">
                {Object.keys(groupedData).map((labelName) => (
                    <div key={labelName} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">

                        <button onClick={() => toggleAccordion(labelName)} className={`w-full p-6 flex justify-between items-center ${expandedLabels.includes(labelName) ? "bg-slate-900 text-white" : "hover:bg-slate-50 text-slate-800"}`}>
                            <span className="font-black uppercase italic tracking-widest">{labelName.replace("_", " ")}</span>
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-bold opacity-60">{groupedData[labelName].length} ITEMS</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${expandedLabels.includes(labelName) ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </button>

                        <div className={`${expandedLabels.includes(labelName) ? "p-6 pt-0 block" : "hidden"}`}>
                            <div className="overflow-x-auto">
                                <table className="table w-full border-separate border-spacing-y-2">
                                    <thead>
                                        <tr className="text-[10px] uppercase font-black text-slate-400">
                                            <th>Sub-Category</th>
                                            <th className="text-center">Connections</th>
                                            <th className="text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {groupedData[labelName].map((cat) => (
                                            <React.Fragment key={cat._id}>
                                                <tr className="bg-slate-50">
                                                    <td className="rounded-l-2xl py-4">
                                                        <span className="font-black text-slate-800 uppercase italic text-sm">{cat.name}</span>
                                                    </td>
                                                    <td className="text-center">
                                                        <button
                                                            onClick={() => setViewingLinksId(viewingLinksId === cat._id ? null : cat._id)}
                                                            className={`cursor-pointer px-4 py-1 rounded-full font-black text-[10px] transition-all ${cat.usageCount > 0 ? "bg-primary text-white" : "bg-slate-200 text-slate-400"}`}
                                                        >
                                                            {cat.usageCount} LINKS {viewingLinksId === cat._id ? "▲" : "▼"}
                                                        </button>
                                                    </td>
                                                    <td className="rounded-r-2xl text-right">
                                                        <button onClick={() => { if (cat.usageCount > 0) return; setCategoryToDelete(cat); setShowDeleteModal(true); }} className={`btn btn-ghost btn-xs font-black uppercase ${cat.usageCount > 0 ? "text-slate-200" : "text-red-400"}`}>Remove</button>
                                                    </td>
                                                </tr>

                                                {/* NESTED LINKED ITEMS LIST */}
                                                {/* ... inside your table mapping where viewingLinksId === cat._id ... */}

                                                {viewingLinksId === cat._id && (
                                                    <tr>
                                                        <td colSpan="3" className="p-4 bg-blue-50/50 rounded-2xl border-2 border-blue-100/20 animate-in slide-in-from-top-2">
                                                            <p className="text-[10px] font-black text-primary uppercase mb-3 px-2">Click to View Profile:</p>
                                                            <div className="flex flex-wrap gap-2 px-2">
                                                                {cat.linkedItems.length > 0 ? cat.linkedItems.map((item, i) => {
                                                                    // Logic to determine the correct link based on the category label
                                                                    let targetLink = "#";
                                                                    if (cat.label === "SPECIALIZATION") {
                                                                        targetLink = `/doctor/${item.id}`;
                                                                    } else if (cat.label === "GENDER" || cat.label === "BLOOD_GROUP" || cat.label === "DISEASE_TYPE") {
                                                                        targetLink = `/admin-dashboard/patient-details/${item.id}`;
                                                                    } else if (cat.label === "MEDICINE_TYPE") {
                                                                        targetLink = `/admin-dashboard/view-all-medicines`;
                                                                    }

                                                                    return (
                                                                        <Link
                                                                            key={i}
                                                                            to={targetLink}
                                                                            className="px-3 py-1 bg-white border border-blue-100 rounded-lg text-[11px] font-bold text-slate-600 shadow-sm capitalize hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 cursor-pointer"
                                                                        >
                                                                            {item.name}
                                                                        </Link>
                                                                    );
                                                                }) : (
                                                                    <span className="text-xs text-slate-400 italic px-2">No active connections found.</span>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* DELETE MODAL (Kept the same) */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowDeleteModal(false)}></div>
                    <div className="relative bg-white p-10 rounded-[3rem] shadow-2xl max-w-md w-full text-center">
                        <h3 className="text-3xl font-black text-slate-800 mb-2 uppercase italic tracking-tighter">Remove Item?</h3>
                        <p className="text-slate-400 mb-8 text-sm">Deleting "{categoryToDelete?.name}" is permanent.</p>
                        <div className="flex gap-4">
                            <button onClick={() => setShowDeleteModal(false)} className="btn flex-1 h-14 rounded-2xl font-black bg-slate-100 border-none text-slate-500">Cancel</button>
                            <button onClick={confirmDelete} className="btn btn-error flex-1 h-14 rounded-2xl font-black text-white border-none shadow-lg shadow-red-100">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageCategories;