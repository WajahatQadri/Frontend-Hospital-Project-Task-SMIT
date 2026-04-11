import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';
import ViewPendingDoctors from '../admin/ViewPendingDoctors';
import { useNavigate } from 'react-router-dom';

const AllDoctorsList = () => {
    const [doctors, setDoctors] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isCheckingAdmin, setIsCheckingAdmin] = useState(true); // New loading state
    const Navigate = useNavigate();

    const checkAdminStatus = async () => {
        try {
            const { data } = await api.get("/users/user-profile");
            if (data.user?.role === "ADMIN") {
                setIsAdmin(true);
            }
        } catch (error) {
            console.error("Auth check failed", error);
        } finally {
            setIsCheckingAdmin(false); // Stop the specific admin loader
        }
    };

    const fetchData = async () => {
    try {
        const { data } = await api.get("/doctors/get-all-doctors");
        
        const approvedOnly = data.doctors.filter(doc => doc.isApproved === true);
        
        setDoctors(approvedOnly);
    } catch (error) { 
        toast.error("Error loading doctors"); 
    }
};

    const handleDelete = async (id) => {
        if (!window.confirm("Remove this doctor and their user account?")) return;
        try {
            await api.delete(`/users/admin/delete-user/${id}`);
            toast.success("Doctor removed");
            fetchData();
        } catch (error) { 
            toast.error("Action failed"); 
        }
    };

    useEffect(() => { 
        fetchData(); 
        checkAdminStatus(); 
    }, []);

    return (
        <div className="p-4 bg-slate-50 min-h-screen">
            {/* LOGIC: Show nothing if admin, show loader if not yet verified, show component if verified */}
            {isCheckingAdmin ? (
                <div className="w-full flex flex-col items-center justify-center py-10 gap-4 bg-white rounded-3xl border border-dashed border-slate-200 mb-6">
                    <span className="loading loading-spinner loading-md text-primary"></span>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Verifying Admin Access...</p>
                </div>
            ) : (
                isAdmin && <ViewPendingDoctors onActionSuccess={fetchData} />
            )}
            
            <h2 className="text-2xl font-black text-slate-800 my-6 italic uppercase tracking-tighter">
                Verified Doctors
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {doctors.map(doc => (
                    <div key={doc._id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex justify-between items-center">
                        <div className='cursor-pointer' onClick={() => Navigate(`/admin-dashboard/doctor-details/${doc._id}`)}>
                            <h3 className="font-black text-slate-800 uppercase">
                                Dr. {doc.user?.name || "Unknown"}
                            </h3>
                            <div className="flex gap-2 mt-1">
                                <span className="badge badge-primary badge-sm font-bold text-[9px]">
                                    {doc.specialization}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase">
                                    FEES: {doc.fees}
                                </span>
                                <p className="text-xs text-slate-400 font-medium italic">
                                    Experience: {doc.experience}
                                </p>
                            </div>
                        </div>

                        {isAdmin && (
                            <button 
                                onClick={() => handleDelete(doc.user?._id)} 
                                className="btn btn-error btn-outline rounded-lg btn-sm transition-all hover:scale-105"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {doctors.length === 0 && (
                <p className="text-center py-10 text-slate-400">No active doctors found.</p>
            )}
        </div>
    );
};

export default AllDoctorsList;
