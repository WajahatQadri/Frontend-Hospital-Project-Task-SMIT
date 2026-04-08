import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';

const AllPatientsList = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [targetId, setTargetId] = useState(null);

    const fetchData = async () => {
        try {
            const { data } = await api.get("/patients/admin/all");
            setPatients(data.patients);
        } catch (error) { 
            toast.error("Error loading patients"); 
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`/users/admin/delete-user/${targetId}`);
            toast.success("Patient record and user account removed");
            fetchData();
        } catch (error) { 
            toast.error("Deletion failed"); 
        } finally { 
            setShowDeleteModal(false); 
        }
    };

    useEffect(() => { fetchData(); }, []);

    if (loading) return (
        <div className="p-20 text-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
    );

    return (
        <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
            
            {/* --- HEADER SECTION --- */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="bg-slate-900 p-3 rounded-2xl">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-slate-800 uppercase italic tracking-tighter leading-none">Patient Database</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Manage medical records and accounts</p>
                    </div>
                </div>
                <div className="bg-blue-50 px-6 py-3 rounded-2xl border border-blue-100">
                    <span className="text-primary font-black text-xl">{patients.length}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase ml-2 tracking-widest">Total Registered</span>
                </div>
            </div>

            {/* --- DATA TABLE --- */}
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table w-full border-separate border-spacing-y-3 px-6">
                        <thead>
                            <tr className="text-slate-400 text-[10px] uppercase font-black tracking-widest border-none">
                                <th className="bg-transparent">Identity</th>
                                <th className="bg-transparent">Medical Vitals</th>
                                <th className="bg-transparent">Registration</th>
                                <th className="bg-transparent text-right">Administrative Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.map((p) => (
                                <tr key={p._id} className="group hover:bg-slate-50 transition-all border-none">
                                    {/* Name & Avatar */}
                                    <td className="bg-white group-hover:bg-slate-50 rounded-l-2xl border-y border-l border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white font-black text-xl italic shadow-inner">
                                                {p.user?.name?.[0]}
                                            </div>
                                            <div>
                                                <div className="font-black text-slate-800 uppercase italic leading-tight">{p.user?.name}</div>
                                                <div className="text-[10px] font-bold text-slate-400">{p.user?.email}</div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Age, Gender, Blood Group */}
                                    <td className="bg-white group-hover:bg-slate-50 border-y border-slate-100">
                                        <div className="flex gap-2">
                                            <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-[9px] font-black uppercase">{p.age} Yrs</span>
                                            <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-[9px] font-black uppercase">{p.gender}</span>
                                            <span className="px-2 py-1 bg-red-50 text-red-600 rounded-lg text-[9px] font-black uppercase border border-red-100">{p.bloodgroup}</span>
                                        </div>
                                    </td>

                                    {/* Created Date */}
                                    <td className="bg-white group-hover:bg-slate-50 border-y border-slate-100">
                                        <div className="text-[10px] font-black text-slate-800 uppercase tracking-tighter">
                                            {new Date(p.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </div>
                                        <div className="text-[9px] font-bold text-slate-400 uppercase italic">System Joined</div>
                                    </td>

                                    {/* Actions */}
                                    <td className="bg-white group-hover:bg-slate-50 rounded-r-2xl border-y border-r border-slate-100 text-right">
                                        <div className="flex justify-end gap-3 px-2">
                                            <Link 
                                                to={`/admin-dashboard/patient-details/${p._id}`} 
                                                className="btn btn-ghost btn-sm font-black text-primary text-[10px] uppercase tracking-widest hover:bg-blue-50"
                                            >
                                                Details
                                            </Link>
                                            <button 
                                                onClick={() => { setTargetId(p.user?._id); setShowDeleteModal(true); }} 
                                                className="btn btn-ghost btn-sm font-black text-red-400 text-[10px] uppercase tracking-widest hover:bg-red-50"
                                            >
                                                Purge
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {patients.length === 0 && (
                    <div className="p-20 text-center">
                        <p className="text-slate-300 font-black uppercase italic tracking-widest">No patient records found in database.</p>
                    </div>
                )}
            </div>

            {/* --- PREMIUM DELETE MODAL --- */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowDeleteModal(false)}></div>
                    
                    {/* Modal Box */}
                    <div className="relative bg-white p-10 rounded-[3rem] max-w-md w-full border border-slate-200 shadow-2xl animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-6 mx-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        
                        <h3 className="text-3xl font-black mb-2 text-slate-800 text-center uppercase tracking-tighter italic">Delete Profile?</h3>
                        <p className="text-slate-400 text-center text-sm font-medium mb-8 leading-relaxed px-4">
                            You are about to permanently remove this patient record and their account credentials. <span className="text-red-500 font-bold underline">This action is irreversible.</span>
                        </p>
                        
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setShowDeleteModal(false)} 
                                className="btn flex-1 h-14 bg-slate-100 border-none rounded-2xl font-black uppercase text-slate-500 hover:bg-slate-200"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmDelete} 
                                className="btn btn-error flex-1 h-14 rounded-2xl text-white font-black uppercase tracking-widest shadow-lg shadow-red-100 border-none"
                            >
                                Purge Record
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllPatientsList;