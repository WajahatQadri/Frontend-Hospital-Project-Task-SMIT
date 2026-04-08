import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const PatientProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [imgErr, setImgErr] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAllHistory, setShowAllHistory] = useState(false);


    const fetchProfile = async () => {
        if (localStorage.getItem("isLoggedIn") !== "true") {
            navigate("/login")
            setUser(null);                       
            return
        }
        try {
            // Backend must populate: user, assigned_doctors, medicines.medicine, medicines.givenBy
            const { data } = await api.get("/patients/me");
            setProfile(data.patient);
        } catch (error) {
            navigate("/profile");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const logout = async () => {
        try {
            await api.get("/users/logout-user");
            localStorage.removeItem("isLoggedIn");
            navigate("/");
            toast.success("Logged out");
        } catch (error) { toast.error("Logout failed"); }
    };

    const deletePatientSelf = async () => {
        if (!window.confirm("Remove your medical profile?")) return;
        try {
            await api.delete("/patients/delete-profile");
            toast.success("Medical profile removed");
            navigate("/profile");
        } catch (error) { toast.error("Action failed"); }
    };

    if (loading) return <div className="h-screen flex items-center justify-center"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
    if (!profile) return <div className="text-center p-20 font-bold text-2xl">No medical profile found.</div>;

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            <div className="max-w-6xl mx-auto py-10 px-4">

                {/* --- TOP SECTION: IDENTITY & ACTIONS --- */}
                <div className="max-w-5xl mx-auto py-10 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: User Card */}
                    <div className="card w-full max-w-sm bg-white border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden rounded-[2rem] transition-all hover:shadow-indigo-100">
                        <div className="h-32 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-500"></div>
                        <div className="relative px-6 pb-10 flex flex-col items-center">
                            <div className="relative -mt-16 mb-4">
                                <div className="w-32 h-32 rounded-full border-[6px] border-white shadow-xl overflow-hidden flex items-center justify-center bg-slate-800">
                                    {profile?.avatar?.url && !imgErr ? (
                                        <img src={profile.user.avatar.url} onError={() => setImgErr(true)} className="w-full h-full object-cover" alt="profile" />
                                    ) : (
                                        <span className="text-5xl font-black text-white select-none">{profile.user?.name?.[0]?.toUpperCase()}</span>
                                    )}
                                </div>
                            </div>
                            <div className="text-center w-full px-4">
                                <h2 className="text-2xl font-black text-gray-800 capitalize tracking-tight leading-tight">{profile.user?.name}</h2>
                                <p className="text-sm font-medium text-gray-400 break-all mt-1">{profile.user?.email}</p>

                            </div>
                            <div className="mt-6">
                                <span className="px-5 py-2 rounded-xl bg-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] border border-indigo-100 shadow-sm">
                                    {profile?.role}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Quick Actions */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-center h-full">
                            <h3 className="text-3xl font-black text-gray-800 mb-10">
                                Good to see you, <span className="text-primary">{profile?.user.name?.split(' ')[0]}!</span>
                            </h3>
                            <div className="flex flex-wrap gap-4">
                                <Link to="/update-profile" className="btn btn-outline border-black rounded-xl px-8 text-black hover:text-white">Edit Profile</Link>
                                <Link to="/update-password" className="btn btn-outline btn-primary rounded-xl px-8 hover:bg-blue-900 ">Update Password</Link>
                                <button onClick={logout} className="btn btn-outline btn-error rounded-xl px-8 hover:bg-red-800 hover:text-white ">Sign Out</button>
                                {profile?.role !== "ADMIN" ? (
                                    <button onClick={() => setShowDeleteModal(true)} className="btn btn-outline btn-error rounded-xl px-8 hover:bg-red-900 hover:text-white ">
                                        Delete ID
                                    </button>
                                ) : (null)}
                                {profile?.role === "PATIENT" ? (
                                    <button onClick={deletePatientSelf} className="btn btn-outline btn-error rounded-xl px-8 hover:bg-red-900 hover:text-white ">
                                        Remove you self as a patient
                                    </button>
                                ) : (null)}
                                <button className="btn btn-outline btn-primary rounded-xl px-8 hover:bg-blue-900 hover:text-white ">
                                    <Link to="/doctors">Explore Doctors</Link>
                                </button>

                                <Link to="/" className="btn btn-outline btn-success rounded-xl px-8 hover:text-white hover:bg-green-800 ">Go to Home Page</Link>
                            </div>
                        </div>
                    </div>

                    {/* 4. Custom Modal UI Logic */}
                    {showDeleteModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                            <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full mx-4 border border-gray-100">
                                <h3 className="text-2xl font-black text-gray-800 mb-2">Are you absolutely sure?</h3>
                                <p className="text-gray-500 mb-8 font-medium">This action cannot be undone. This will permanently delete your account and remove your data from our servers.</p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setShowDeleteModal(false)}
                                        className="cursor-pointer flex-1 py-3 rounded-xl font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmDelete}
                                        className="cursor-pointer flex-1 py-3 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                                    >
                                        Yes, Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* --- MIDDLE SECTION: MEDICAL DATA --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* 1. Personal Medical Info */}
                    <div className="space-y-6">
                        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                            <h4 className="text-blue-600 font-black text-xs uppercase tracking-[0.2em] mb-6">Vital Information</h4>
                            <div className="grid grid-cols-2 gap-y-6">
                                <div><p className="text-[10px] font-bold text-slate-400 uppercase">Age</p><p className="font-bold text-slate-800">{profile.age} Years</p></div>
                                <div><p className="text-[10px] font-bold text-slate-400 uppercase">Gender</p><p className="font-bold text-slate-800">{profile.gender}</p></div>
                                <div><p className="text-[10px] font-bold text-slate-400 uppercase">Blood Group</p><p className="text-red-600 font-black">{profile.bloodgroup}</p></div>
                                <div><p className="text-[10px] font-bold text-slate-400 uppercase">Contact</p><p className="font-bold text-slate-800">{profile.contact}</p></div>
                                <div className="col-span-2"><p className="text-[10px] font-bold text-slate-400 uppercase">Registered Address</p><p className="font-bold text-slate-800">{profile.address || "Not Provided"}</p></div>
                            </div>
                        </div>

                        {/* 2. Assigned Doctors */}
                        <div className="bg-white px-5 pt-2 pb-5 rounded-[2.5rem] border border-slate-200 shadow-sm">
                            <div className='pb-2 ps-2'>
                                <Link to="/doctors" className="justify-self-end textarea-xs font-black text-emerald-600 uppercase tracking-tighter hover:underline">
                                    + Explore Doctors
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {profile.assigned_doctors?.length > 0 ? profile.assigned_doctors.map((doc, i) => (
                                    <div key={i} className="group relative flex items-center justify-between p-4 bg-slate-50 hover:bg-emerald-50 rounded-[1.5rem] border border-slate-100 hover:border-emerald-200 transition-all duration-300">

                                        {/* WRAPPING LINK: Redirects to doctor profile */}
                                        <Link to={`/doctor/${doc._id}`} className="flex items-center gap-3 flex-1 cursor-pointer">
                                            <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 text-emerald-600 flex items-center justify-center font-black text-sm group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                                {doc.user?.name?.[0] || "D"}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-800 text-sm leading-none">Dr. {doc.user?.name}</p>
                                                <p className="text-[9px] uppercase font-bold text-slate-400 group-hover:text-emerald-600 mt-1.5 tracking-wider">
                                                    {doc.specialization || "General Physician"}
                                                </p>
                                            </div>
                                        </Link>

                                        {/* ACTION BUTTON: e.stopPropagation() prevents redirecting when clicking 'Cancel' */}
                                        <button
                                            onClick={async (e) => {
                                                e.stopPropagation(); // Prevents the Link from being triggered
                                                const docId = doc._id;
                                                const patId = profile._id;
                                                if (!docId) return toast.error("Doctor ID missing");
                                                if (window.confirm("Cancel this medical appointment?")) {
                                                    try {
                                                        await api.delete(`/patients/delete-appointment/${docId}/${patId}`);
                                                        toast.success("Appointment Removed");
                                                        fetchProfile();
                                                    } catch (err) {
                                                        toast.error("Error cancelling");
                                                    }
                                                }
                                            }}
                                            className="cursor-pointer ml-4 p-2 rounded-xl bg-white border border-slate-100 text-slate-300 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all z-10"
                                            title="Cancel Appointment"
                                        >
                                            <svg xmlns="http://w3.org" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                )) : (
                                    <div className="col-span-full py-8 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                                        <p className="text-slate-400 italic text-sm font-medium">No doctors assigned to your care team yet.</p>
                                    </div>
                                )}
                            </div>

                        </div>

                    </div>

                    {/* 3. Medical Visit History */}
                    <div className="bg-slate-800 text-white p-8 rounded-[2rem] shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-blue-400 font-black text-xs uppercase tracking-[0.2em]">Visit History</h4>
                            {profile.history?.length > 3 && (
                                <button
                                    onClick={() => setShowAllHistory(!showAllHistory)}
                                    className="cursor-pointer text-xs font-black text-blue-400 hover:text-white hover:underline uppercase tracking-wider transition-colors"
                                >
                                    {showAllHistory ? "Show Less" : `View All (${profile.history.length})`}
                                </button>
                            )}
                        </div>

                        <div className="space-y-6">
                            {profile.history?.length > 0 ? (
                                // 1. Sort by date (latest first) 
                                // 2. Slice based on state (3 or all)
                                [...profile.history]
                                    .sort((a, b) => new Date(b.treatment) - new Date(a.treatment))
                                    .slice(0, showAllHistory ? profile.history.length : 3)
                                    .map((h, i) => (
                                        <div key={i} className="group border-l-2 border-slate-700 hover:border-blue-500 pl-4 py-1 transition-colors">
                                            <div className="flex items-center gap-2">
                                                <p className="text-[10px] font-bold text-blue-400 uppercase">
                                                    {new Date(h.treatment).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </p>
                                                {i === 0 && (
                                                    <span className="bg-blue-500/10 text-blue-400 text-[8px] px-2 py-0.5 rounded-full font-black border border-blue-500/20 uppercase">Latest</span>
                                                )}
                                            </div>
                                            <h5 className="font-black text-lg text-slate-100 group-hover:text-white transition-colors">{h.disease}</h5>
                                            <p className="text-sm text-slate-400 mt-1 leading-relaxed">{h.notes}</p>
                                        </div>
                                    ))
                            ) : (
                                <p className="text-slate-500 italic">No previous visits recorded.</p>
                            )}
                        </div>
                    </div>


                </div>

                {/* --- BOTTOM SECTION: PRESCRIPTIONS --- */}
                <div className="mt-12 bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
                    <div className="bg-slate-100 p-6 border-b border-slate-200">
                        <h4 className="text-slate-800 font-black text-xs uppercase tracking-[0.2em]">Prescriptions</h4>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead className="bg-slate-50/50">
                                <tr className="text-slate-400 text-[10px] uppercase">
                                    <th>Medicine</th>
                                    <th>Dosage</th>
                                    <th>Issued By</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-700 font-bold">
                                {profile.medicines?.map((item, index) => (
                                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                                        <td className="text-blue-600">
                                            {item.medicine?.name}
                                            <span className="block text-[10px] text-slate-400 uppercase">{item.medicine?.potency}</span>
                                        </td>
                                        <td><span className="badge badge-ghost font-bold">{item.dosage}</span></td>
                                        <td className="text-slate-500 text-xs">Dr. {item.givenBy?.name || "Hospital Staff"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {profile.medicines?.length === 0 && <p className="text-center py-10 text-slate-400 italic">No prescriptions.</p>}
                </div>

            </div>
        </div>
    );
};

export default PatientProfile;