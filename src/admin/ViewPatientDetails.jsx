import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';

const AdminPatientDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDetails = async () => {
        try {
            const { data } = await api.get(`/patients/admin/all`);
            const found = data.patients.find(item => item._id === id);
            setProfile(found);
        } catch (error) {
            toast.error("Error fetching patient details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const handleDeletePatient = async () => {
        if (!window.confirm("CRITICAL: Are you sure you want to permanently delete this patient record? This cannot be undone.")) return;
        try {
            // Adjust endpoint based on your backend
            await api.delete(`/patients/admin/delete-patient/${id}`);
            toast.success("Patient record deleted from system");
            navigate("/admin-dashboard/view-all-patients");
        } catch (error) {
            toast.error("Failed to delete patient");
        }
    };

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-slate-50">
            <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
    );

    if (!profile) return (
        <div className="text-center py-20 bg-slate-50 min-h-screen">
            <h2 className="text-2xl font-black text-slate-400 uppercase italic">Patient not found</h2>
            <Link to="/admin-dashboard/view-all-patients" className="btn btn-primary mt-4">Return to List</Link>
        </div>
    );

    return (
        <div className="bg-slate-50 min-h-screen pb-20 text-black px-4 md:px-8 lg:px-12">
            <div className="max-w-6xl mx-auto py-10">

                {/* --- NAVIGATION & ADMIN ACTIONS --- */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <Link
                            to="/admin-dashboard/view-all-patients"
                            className="btn btn-ghost btn-sm text-slate-500 font-black hover:bg-slate-100 rounded-xl transition-all"
                        >
                            ← BACK TO LIST
                        </Link>
                        <div className="h-6 w-[1px] bg-slate-200 hidden md:block"></div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                                Administrative View
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => window.print()}
                            className="btn btn-ghost btn-sm font-black text-slate-500"
                        >
                            PRINT FILE
                        </button>
                        <button
                            onClick={handleDeletePatient}
                            className="btn btn-error btn-sm px-6 text-white font-black rounded-2xl shadow-lg shadow-red-100"
                        >
                            DELETE RECORD
                        </button>
                    </div>
                </div>

                {/* --- TOP SECTION: PATIENT IDENTITY --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">

                    {/* --- IDENTITY CARD: REDESIGNED --- */}
                    <div className="relative group bg-white border border-slate-200 shadow-xl rounded-[2.5rem] overflow-hidden transition-all hover:shadow-2xl">
                        {/* Decorative Header with Gradient */}
                        <div className="h-32 bg-gradient-to-br from-slate-900 via-slate-800 to-primary/20 p-6 flex justify-between items-start">
                            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full backdrop-blur-md border border-emerald-500/30">
                                Active Patient
                            </span>
                            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                        </div>

                        {/* Profile Content */}
                        <div className="px-8 pb-10 flex flex-col items-center -mt-14">
                            <div className="relative">
                                <div className="w-28 h-28 rounded-[2rem] border-[6px] border-white shadow-2xl overflow-hidden bg-primary flex items-center justify-center text-white text-5xl font-black italic transform transition-transform group-hover:scale-105 duration-500">
                                    {profile.user?.name?.[0]}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 border-4 border-white rounded-full"></div>
                            </div>

                            <h2 className="mt-6 text-2xl font-black text-slate-800 uppercase text-center italic tracking-tight">
                                {profile.user?.name}
                            </h2>

                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Member ID:</span>
                                <span className="text-[10px] font-black text-primary uppercase">#{profile._id.slice(-8)}</span>
                            </div>

                            <div className="mt-6 w-full py-3 px-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                                <div className="p-2 bg-white rounded-xl shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <span className="text-[11px] font-bold text-slate-500 truncate">{profile.user?.email}</span>
                            </div>
                        </div>
                    </div>

                    {/* --- VITALS SUMMARY CARD: ICON GRID --- */}
                    <div className="lg:col-span-2 bg-white p-2 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col">
                        <div className="p-8 pb-4">
                            <h4 className="text-slate-800 font-black text-xs uppercase tracking-[0.2em] italic">Medical Vitals Overview</h4>
                            <p className="text-slate-400 text-[10px] font-bold uppercase mt-1">Verified biological data from patient profile</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 pt-2">

                            {/* Age Item */}
                            <div className="bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100/50 flex flex-col items-center text-center">
                                <div className="w-10 h-10 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Age</p>
                                <p className="font-black text-2xl text-slate-800 italic">{profile.age} <span className="text-xs font-bold text-slate-400 lowercase italic">yrs</span></p>
                            </div>

                            {/* Gender Item */}
                            <div className="bg-purple-50/50 p-6 rounded-[2rem] border border-purple-100/50 flex flex-col items-center text-center">
                                <div className="w-10 h-10 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Gender</p>
                                <p className="font-black text-2xl text-slate-800 italic uppercase">{profile.gender}</p>
                            </div>

                            {/* Blood Group Item */}
                            <div className="bg-red-50/50 p-6 rounded-[2rem] border border-red-100/50 flex flex-col items-center text-center">
                                <div className="w-10 h-10 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Blood Type</p>
                                <p className="font-black text-3xl text-red-600 italic leading-none">{profile.bloodgroup}</p>
                            </div>

                            {/* Contact Item */}
                            <div className="bg-emerald-50/50 p-6 rounded-[2rem] border border-emerald-100/50 flex flex-col items-center text-center">
                                <div className="w-10 h-10 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Contact</p>
                                <p className="font-black text-sm text-slate-800 italic break-all leading-tight">{profile.contact}</p>
                            </div>

                        </div>
                    </div>
                </div>

                {/* --- CONTENT GRID: HISTORY & MEDICINES --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Medical Visit History */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <h4 className="text-slate-800 font-black text-xs uppercase tracking-widest italic">Visit History logs</h4>
                            <span className="badge badge-primary badge-sm font-bold">{profile.history?.length || 0} Visits</span>
                        </div>

                        <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {profile.history?.length > 0 ? profile.history.map((h, i) => (
                                <div key={i} className="relative pl-8 pb-6 border-l-2 border-slate-100 last:border-0">
                                    {/* Timeline Dot */}
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500 border-4 border-white shadow-sm"></div>

                                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                        <div className="flex justify-between items-start mb-2">
                                            <h5 className="font-black text-slate-800 uppercase italic leading-tight">{h.disease}</h5>
                                            <span className="text-[9px] font-bold text-slate-400 bg-white px-2 py-1 rounded-md border">
                                                {new Date(h.treatment || h.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 font-medium leading-relaxed">{h.notes}</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-10">
                                    <p className="text-slate-300 italic font-medium">No previous medical history found.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Prescribed Medications */}
                    <div className="flex flex-col gap-8">
                        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden">
                            <h4 className="text-blue-400 font-black text-xs uppercase tracking-widest mb-6 relative z-10">Active Prescriptions</h4>

                            <div className="space-y-4 relative z-10">
                                {profile.medicines?.length > 0 ? profile.medicines.map((m, i) => (
                                    <div key={i} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/10">
                                        <div>
                                            <p className="font-black text-sm uppercase italic">{m.medicine?.name}</p>
                                            <p className="text-[10px] text-blue-300 font-bold uppercase tracking-tighter">{m.dosage}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] text-slate-500 font-bold">QTY: 1 Unit</p>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-slate-500 text-sm italic">No medications currently assigned.</p>
                                )}
                            </div>

                            {/* Decorative Background Element */}
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
                        </div>

                        {/* System Metadata */}
                        <div className="bg-emerald-50 p-8 rounded-[2.5rem] border border-emerald-100">
                            <h4 className="text-emerald-700 font-black text-[10px] uppercase tracking-widest mb-4">Registration Metadata</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-emerald-600/60 font-bold uppercase">Profile Created</span>
                                    <span className="text-emerald-700 font-black">{new Date(profile.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-emerald-600/60 font-bold uppercase">Last System Update</span>
                                    <span className="text-emerald-700 font-black">{new Date(profile.updatedAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminPatientDetails;
