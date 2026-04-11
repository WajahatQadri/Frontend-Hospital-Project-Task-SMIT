import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const PendingDoctorDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPendingDoctorDetails = async () => {
            try {
                // Adjust this endpoint based on your backend
                const { data } = await api.get(`/doctors/doctor/${id}`);
                // console.log(data);
                
                if (data.success) {
                    setDoctor(data.doctor);
                }
            } catch (error) {
                toast.error("Failed to fetch doctor details");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchPendingDoctorDetails();
    }, [id]);

    if (loading) return <div className="text-center py-20 font-bold">Loading...</div>;
    if (!doctor) return <div className="text-center py-20">Doctor not found.</div>;

    return (
        <div className="min-h-screen bg-slate-50 pb-8 pt-5 px-4">
            <Link to="/admin-dashboard/view-all-doctors" className="inline-flex items-center text-slate-400 font-bold hover:text-primary transition-colors text-sm uppercase tracking-widest mb-5">
                <span className="mr-2">←</span> Back
            </Link>
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                {/* Header */}

                <div className="bg-primary p-8 text-center text-white">
                    <h1 className="text-3xl font-black uppercase tracking-tight">Doctor Profile</h1>
                    <p className="text-blue-100 mt-2 italic">Full application details</p>
                </div>

                <div className="p-8 md:p-12 space-y-10">
                    {/* Section 1: Basic Info */}
                    <section>
                        <h2 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4 border-b pb-2">Personal Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Full Name</label>
                                <p className="text-lg font-bold text-slate-800">Dr. {doctor.user?.name}</p>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Email Address</label>
                                <p className="text-lg font-bold text-slate-800">{doctor.user?.email}</p>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Contact Number</label>
                                <p className="text-lg font-bold text-slate-800">{doctor.contact}</p>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Professional Info */}
                    <section>
                        <h2 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4 border-b pb-2">Professional Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-slate-50 p-4 rounded-2xl">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Specialization</label>
                                <p className="text-xl font-black text-slate-900 uppercase">{doctor.specialization}</p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-2xl">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Hospital</label>
                                <p className="text-xl font-black text-slate-900">{doctor.hospital}</p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-2xl">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Address</label>
                                <p className="text-xl font-black text-slate-900">{doctor.address}</p>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Experience</label>
                                <p className="font-bold text-slate-700">{doctor.experience}</p>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Consultation Fees</label>
                                <p className="font-black text-blue-600 text-xl">PKR {doctor.fees}</p>
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Availability */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div>
                            <h2 className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Available Days</h2>
                            <div className="flex flex-wrap gap-2">
                                {doctor.days.map((day) => (
                                    <span key={day} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100">
                                        {day}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h2 className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Time Slots</h2>
                            <div className="flex flex-wrap gap-2">
                                {doctor.timing.map((time) => (
                                    <span key={time} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold border border-slate-200">
                                        {time}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Section 4: Action (Admin logic) */}
                    <div className="pt-8 flex gap-4">
                        {/* Here you can add Approve/Reject buttons if the user is an admin */}
                        <button className={`flex-1 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all ${doctor.isApproved === true ? "bg-blue-700" : "bg-red-600"}`}>
                            Status: {doctor.isApproved === true ? ("Approved") : ("Pending")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PendingDoctorDetails;