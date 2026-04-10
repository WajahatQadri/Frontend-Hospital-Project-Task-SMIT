import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const ViewPendingDoctors = ({ onActionSuccess }) => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchPending = async () => {
        setLoading(true);
        try {
            const { data } = await api.get("/doctors/admin/doctors/pending");
            setDoctors(data.pendingDoctors);
        } catch (error) {
            toast.error("Error fetching applications");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await api.put(`/doctors/admin/doctor/approve/${id}`);
            toast.success("Doctor Approved Successfully!");
            fetchPending();
            if (onActionSuccess) onActionSuccess();
        } catch (error) {
            toast.error("Approval failed");
        }
    };

    const handleGetDetails = async (id) => {
        try {
            const data = await api.get(`/doctors/doctor/${id}`);
            if(data){
                navigate(`/admin-dashboard/pending-doctor-details/${id}`)
            }
            else{
                toast.error("doctor Id not found");
            }
        } catch (error) {
            toast.error(error.response?.data?.message)
        }
    }

    const getInitial = (name) => name ? name.charAt(0) : "?";

    useEffect(() => { fetchPending(); }, []);
    // ... existing imports
    const handleReject = async (id) => {
        if (!window.confirm("Reject this doctor?")) return; // You can add the custom modal here too
        try {
            await api.delete(`/doctors/admin/doctor/reject/${id}`);
            toast.error("Application Rejected");
            fetchPending();
        } catch (error) { toast.error("Error"); }
    };


    return (
        <div className="p-6">
            <h2 className="text-2xl font-black text-slate-800 mb-6 italic uppercase tracking-tighter">
                Pending Applications
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    // Loading State Skeletons
                    [1, 2, 3, 4].map((n) => (
                        <div key={n} className="flex flex-col gap-4 w-full">
                            <div className="skeleton h-64 w-full rounded-2xl"></div>
                            <div className="skeleton h-4 w-28"></div>
                            <div className="skeleton h-4 w-full"></div>
                        </div>
                    ))
                ) : doctors.length > 0 ? (
                    doctors.map((doc) => (
                        <div key={doc._id} className="group flex flex-col bg-white p-4 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">

                            {/* Image / Avatar Box */}
                            <div className="relative aspect-square mb-5 overflow-hidden rounded-2xl bg-slate-50 border border-slate-100">
                                {doc.user?.avatar?.url ? (
                                    <img
                                        src={doc.user.avatar.url}
                                        alt={doc.user.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-600 text-6xl font-black">
                                        {getInitial(doc.user?.name)}
                                    </div>
                                )}
                            </div>

                            {/* Info Section - Bold Black Text */}

                            <div
                                className="block p-6 bg-white border border-slate-200 rounded-3xl shadow-xl hover:shadow-2xl transition-all no-underline group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="space-y-2 flex-grow">
                                        <h3 className="text-xl font-black text-slate-900 uppercase leading-none group-hover:text-primary transition-colors">
                                            Dr. {doc.user?.name || "N/A"}
                                        </h3>
                                        <p className="text-slate-600 font-bold text-sm uppercase tracking-widest">
                                            {doc.specialization}
                                        </p>
                                        <p className="text-xs text-slate-400 font-medium italic">
                                            Experience: {doc.experience}
                                        </p>
                                    </div>
                                    
                                </div>
                            </div>

                            {/* Action Button */}
                            <div className="mt-6">
                                <div className="flex gap-2 mt-4">
                                    <button onClick={() => handleGetDetails(doc._id)} className="btn btn-primary btn-outline flex-1 font-bold rounded-xl">Details</button>
                                </div>
                            </div>
                            <div className="">
                                <div className="flex gap-2 mt-4">
                                    <button onClick={() => handleApprove(doc._id)} className="btn btn-success btn-outline flex-1 font-bold rounded-xl">Approve</button>
                                </div>
                            </div>
                            <div className="">
                                <div className="flex gap-2 mt-4">
                                    <button onClick={() => handleReject(doc._id)} className="btn btn-error btn-outline flex-1 font-bold rounded-xl">Reject</button>
                                </div>
                            </div>
                        </div>

                    ))
                ) : (
                    <div className="col-span-full text-center py-20 text-slate-400 font-bold italic border-2 border-dashed border-slate-100 rounded-3xl">
                        No pending specialist requests found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewPendingDoctors;
