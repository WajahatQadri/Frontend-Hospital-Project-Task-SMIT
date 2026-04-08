import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const FeaturedSpecialists = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchFeaturedDoctors = async () => {
        try {
            const { data } = await api.get("/doctors/get-all-doctors?isApproved=true&limit=8");
            if (data.success) {
                setDoctors(data.doctors);
                // console.log(data);                
            }
        } catch (error) {
            console.error("Error fetching featured doctors", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeaturedDoctors();
    }, []);

    // Helper function to get the first letter
    const getInitial = (name) => {
        return name ? name.charAt(0).toUpperCase() : "?";
    };

    return (
        <section className="container mx-auto px-6 md:px-12 lg:px-20 py-16 bg-slate-50/30">
            {/* --- HEADER --- */}
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 leading-tight">
                        Meet Our Featured <br /> Specialists
                    </h2>
                </div>
                <div onClick={() => navigate("/doctors")} className="btn btn-outline btn-primary rounded-full px-8 btn-sm md:btn-md">
                    View All
                </div>
            </div>

            {/* --- DOCTOR GRID --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {loading ? (
                    // Loading State
                    [1, 2, 3, 4].map((n) => (
                        <div key={n} className="flex flex-col gap-4 w-full">
                            <div className="skeleton h-64 w-full rounded-2xl"></div>
                            <div className="skeleton h-4 w-28"></div>
                            <div className="skeleton h-4 w-full"></div>
                        </div>
                    ))
                ) : doctors.length > 0 ? (
                    doctors.map((doc) => (
                        <Link to={`/doctor/${doc._id}`} key={doc._id} className="group flex flex-col cursor-default">
                            {/* Image / Avatar Box */}
                            <div className="relative aspect-square mb-4 overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100">
                                {doc.user?.avatar?.url ? (
                                    <img
                                        src={doc.user.avatar.url}
                                        alt={doc.user.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    /* Fallback: First Letter Avatar */
                                    <div className="w-full h-full flex items-center justify-center bg-blue-100 text-primary text-6xl font-black">
                                        {getInitial(doc.user?.name)}
                                    </div>
                                )}
                                <div onClick={() => navigate(`/doctor/${doc._id}`)} className="cursor-pointer absolute bottom-3 left-1/2 -translate-x-1/2 w-[90%] py-2 bg-white/90 backdrop-blur-sm text-blue-600 rounded-xl text-xs font-bold text-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                    Quick Book
                                </div>
                            </div>

                            {/* Info */}
                            <div className="space-y-1">
                                <h3 className="text-xl font-bold text-slate-800 group-hover:text-primary transition-colors uppercase">
                                    Dr. {doc.user?.name}
                                </h3>
                                <p className="text-slate-500 font-medium text-sm uppercase tracking-wide">
                                    {doc.specialization}
                                </p>
                                <p className="text-xs text-slate-400 font-medium italic">
                                    Experience: {doc.experience}
                                </p>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="col-span-full text-center py-20 text-slate-400 font-bold italic">
                        No featured specialists found at the moment.
                    </div>
                )}
            </div>
        </section>
    );
};

export default FeaturedSpecialists;