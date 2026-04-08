import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const ExpertsSection = () => {
    const [doctors, setDoctors] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchCategories = async () => {
        try {
            const { data } = await api.get("/categories/get-all/SPECIALIZATION");
            if (data.success) {
                setCategories(data.categories);
                if (data.categories.length > 0) setSelectedCategory(data.categories[0].name);
            }
        } catch (error) {
            console.error("Error fetching categories", error);
        }
    };

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const url = selectedCategory
                ? `/doctors/get-all-doctors?keyword=${selectedCategory}&limit=4`
                : `/doctors/get-all-doctors?limit=4`;
            const { data } = await api.get(url);
            if (data.success) setDoctors(data.doctors);
        } catch (error) {
            console.error("Error fetching doctors", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCategories(); }, []);
    useEffect(() => { if (selectedCategory) fetchDoctors(); }, [selectedCategory]);

    const getInitial = (name) => name ? name.charAt(0).toUpperCase() : "?";

    // Component for the Banner to avoid repetition
    const Banner = () => (
        <div className="bg-[#f1ede4] p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-between shadow-sm border border-black/5">
            <div className="flex items-center gap-4 md:gap-6">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl md:text-2xl shadow-lg">
                    🔍
                </div>
                <div>
                    <h4 className="font-black text-slate-800 uppercase tracking-wider text-[10px] md:text-sm">See More Specialists</h4>
                    <Link to={`doctors?specialization=${selectedCategory}`} className="text-slate-600 text-[10px] md:text-xs mt-1">Explore all <span className="font-bold text-blue-600">{selectedCategory}</span> doctors.</Link>
                </div>
            </div>
            <Link
                to={`/doctors?specialization=${selectedCategory}`}
                className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl hover:bg-slate-900 transition-all hover:scale-110 shadow-md"
            >
                →
            </Link>
        </div>
    );

    return (
        <section className="container mx-auto px-6 md:px-12 py-12 md:py-20 bg-white">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

                {/* 1. TOP SECTION (Mobile) / RIGHT SIDE (Desktop): CONTENT & FILTERS */}
                <div className="lg:w-1/2 space-y-6 md:space-y-8 lg:order-2">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight">
                        Our Experts Doctors For <br className="hidden md:block" /> The Patients
                    </h2>
                    <p className="text-slate-500 leading-relaxed max-w-md text-sm md:text-base">
                        Embrace a world of comprehensive healthcare where your well-being takes center stage. Our verified specialists are ready to help you.
                    </p>

                    <div className="flex flex-wrap gap-2 md:gap-3">
                        {categories.map((cat) => (
                            <button
                                key={cat._id}
                                onClick={() => setSelectedCategory(cat.name)}
                                className={`px-4 py-1.5 md:px-6 md:py-2 rounded-full border transition-all font-bold text-[10px] md:text-xs uppercase tracking-widest ${selectedCategory === cat.name
                                        ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100"
                                        : "bg-white text-slate-400 border-slate-200 hover:border-blue-400"
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Banner only visible here on Desktop */}
                    <div className="hidden lg:block pt-4">
                        <Banner />
                    </div>
                </div>

                {/* 2. DOCTOR GRID (Moves below content on mobile) */}
                <div className="lg:w-1/2 lg:order-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                        {loading ? (
                            <div className="col-span-full flex justify-center py-10">
                                <span className="loading loading-spinner loading-lg text-primary"></span>
                            </div>
                        ) : doctors.length > 0 ? (
                            doctors.map((doc) => (
                                <div key={doc._id} className="group flex flex-col items-center lg:items-start bg-slate-50/50 p-4 rounded-[2rem] border border-transparent hover:border-blue-100 hover:bg-white hover:shadow-xl transition-all duration-300">
                                    <div className="relative w-full aspect-square mb-4 overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100">
                                        {doc.user?.avatar?.url ? (
                                            <img
                                                src={doc.user.avatar.url}
                                                alt={doc.user.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-600 text-5xl font-black">
                                                {getInitial(doc.user?.name)}
                                            </div>
                                        )}
                                        <Link to={`/doctor/${doc._id}`} className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[90%] py-2 bg-white/90 backdrop-blur-sm text-blue-600 rounded-xl text-xs font-bold text-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                            Quick Book
                                        </Link>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">{doc.user?.name}</h3>
                                    <p className="text-blue-500 text-[10px] font-bold uppercase tracking-widest mt-1">{doc.specialization}</p>
                                    <p className="text-xs text-slate-400 font-medium italic">
                                        Experience: {doc.experience}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center text-slate-400 py-10 bg-slate-50 rounded-2xl">
                                No doctors found.
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. BOTTOM BANNER (Mobile View Only - Appears after doctors) */}
                <div className="lg:hidden">
                    <Banner />
                </div>

            </div>
        </section>
    );
};

export default ExpertsSection;
