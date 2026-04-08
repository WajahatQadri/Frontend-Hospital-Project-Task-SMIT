import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';

const SpecificCategoryDocs = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const specialization = searchParams.get("specialization"); 
    
    const [categories, setCategories] = useState([]);    
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Fetch Categories on mount
    const fetchCategories = async () => {
        try {
            const { data } = await api.get("/categories/get-all/SPECIALIZATION");
            if (data.success) {
                setCategories(data.categories);
            }
        } catch (error) {
            console.error("Error fetching categories", error);
        }
    };

    // 2. Fetch Doctors based on the specialization in URL
    const fetchFilteredDoctors = async () => {
        setLoading(true);
        try {
            // Using keyword search from backend
            const { data } = await api.get(`/doctors/get-all-doctors?keyword=${specialization || ""}&isApproved=true`);
            if (data.success) {
                setDoctors(data.doctors);
            }
        } catch (error) {
            toast.error("Could not load doctors");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchFilteredDoctors();
    }, [specialization]);

    // Handle category click: Update the URL param
    const handleCategoryClick = (name) => {
        setSearchParams({ specialization: name });
    };

    const getInitial = (name) => name ? name.charAt(0).toUpperCase() : "?";

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Category Navigation */}
            <div className="container mx-auto px-6 py-8">
                <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
                    {categories.map((cat) => (
                        <button
                            key={cat._id}
                            onClick={() => handleCategoryClick(cat.name)}
                            className={`cursor-pointer px-4 py-1.5 md:px-6 md:py-2 rounded-full border transition-all font-bold text-[10px] md:text-xs uppercase tracking-widest ${
                                specialization === cat.name
                                    ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100"
                                    : "bg-white text-slate-400 border-slate-200 hover:border-blue-400"
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Header Area */}
            <div className="bg-slate-50 border-b border-slate-100 py-12 mb-12">
                <div className="container mx-auto px-6">
                    <div className="badge badge-primary font-bold uppercase tracking-widest p-3 mb-4 text-white">Department</div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-800 uppercase tracking-tighter italic">
                        {specialization || "All Specialists"}
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">
                        Showing our verified team of {specialization?.toLowerCase() || "medical"} professionals.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-6">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                ) : doctors.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                        {doctors.map((doc) => (
                            <Link to={`/doctor/${doc._id}`} key={doc._id} className="group flex flex-col cursor-pointer">
                                <div className="relative aspect-square mb-5 overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-100">
                                    {doc.user?.avatar?.url ? (
                                        <img 
                                            src={doc.user.avatar.url} 
                                            alt={doc.user.name} 
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-600 text-6xl font-black">
                                            {getInitial(doc.user?.name)}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <h3 className="text-xl font-black text-slate-800 group-hover:text-primary transition-colors uppercase leading-none">
                                        Dr. {doc.user?.name}
                                    </h3>
                                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                                        {doc.specialization}
                                    </p>
                                    <div className="pt-2">
                                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase">
                                            Fees: PKR {doc.fees}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                        <p className="text-slate-400 font-black uppercase tracking-widest italic">No doctors found in this department yet.</p>
                        <Link to="/" className="btn btn-primary btn-sm mt-6 rounded-xl text-white">Back to Home</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SpecificCategoryDocs;
