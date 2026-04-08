import api from "../utils/api";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [imgErr, setImgErr] = useState(false);
  const [user, setUser] = useState(null);
  const [doctorProfile, setDoctorProfile] = useState(null); // To get doctor's ID and patients
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchData = async () => {
    if (localStorage.getItem("isLoggedIn") !== "true") {
       return navigate("/login");
    }
    try {
      // 1. Get User Data
      const userRes = await api.get("/users/user-profile");
      if(userRes.data.user.role !== "DOCTOR"){
        return navigate("/profile");
      }
      setUser(userRes.data.user);

      // 2. Get Doctor's Specific Profile (to see assigned patients)
      // Note: Backend must populate 'patients' and then 'user' inside patients
      const docRes = await api.get("/doctors/doctor/my-profile");
      setDoctorProfile(docRes.data.doctor);

    } catch (error) {
      localStorage.removeItem("isLoggedIn");
      navigate("/login");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const logout = async () => {
    try {
      await api.get("/users/logout-user");
      localStorage.removeItem("isLoggedIn");
      navigate("/");
      toast.success("Logged out");
    } catch (error) { toast.error("Logout failed"); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><span className="loading loading-spinner loading-lg text-primary"></span></div>;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-10">
      
      {/* --- TOP SECTION: PROFILE & ACTIONS --- */}
      <div>
        <Link to="/" className="btn btn-link text-slate-400 no-underline font-bold">← Back to Home</Link>
      <h3 className="text-3xl font-black text-gray-800 italic">Doctor Workspace</h3>
      </div>
      
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-black">
        {/* Left: Doctor Identity Card */}
        <div className="card w-full bg-white border border-gray-100 shadow-2xl rounded-[2rem] overflow-hidden">
          <div className="h-32 bg-slate-800"></div>
          <div className="relative px-6 pb-10 flex flex-col items-center">
            <div className="relative -mt-16 mb-4">
              <div className="w-32 h-32 rounded-full border-[6px] border-white shadow-xl overflow-hidden bg-primary flex items-center justify-center text-white text-5xl font-black italic">
                {user?.name?.[0]}
              </div>
            </div>
            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter italic">Dr. {user?.name}</h2>
            <p className="text-xs font-bold text-primary uppercase mt-1 tracking-widest">{doctorProfile?.specialization}</p>
            <div className="mt-4 badge badge-outline font-black text-[10px] uppercase">{user?.role}</div>
          </div>
        </div>

        {/* Right: Quick Actions */}
        <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-center h-full">
          <h3 className="text-3xl font-black text-gray-800 mb-10">
            Good to see you, <span className="text-primary">{user?.name?.split(' ')[0]}!</span>
          </h3>
          <div className="flex flex-wrap gap-4">
            <Link to="/update-doctor" className="btn btn-outline border-black rounded-xl px-8 text-black hover:text-white">Edit Profile</Link>
            <Link to="/update-password" className="btn btn-outline btn-primary rounded-xl px-8 hover:bg-blue-900 ">Update Password</Link>
            <button onClick={logout} className="btn btn-outline btn-error rounded-xl px-8 hover:bg-red-800 hover:text-white ">Sign Out</button>            
            {user?.role !== "ADMIN" ? (
              <button onClick={() => setShowDeleteModal(true)} className="btn btn-outline btn-error rounded-xl px-8 hover:bg-red-900 hover:text-white ">
              Delete ID
            </button>
            ) : (null)}
            <button className="btn btn-outline btn-primary rounded-xl px-8 hover:bg-blue-900 hover:text-white ">
              <Link to="/doctors">Explore Doctors</Link>
            </button>           
            <Link to="/" className="btn btn-outline btn-success rounded-xl px-8 hover:text-white hover:bg-green-800 ">Go to Home Page</Link>
          </div>
        </div>
      </div>
      </div>

      {/* --- BOTTOM SECTION: ASSIGNED PATIENTS --- */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden text-black">
        <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-black text-xl uppercase tracking-tighter italic text-slate-700">My Assigned Patients</h3>
            <div className="badge badge-primary font-bold">{doctorProfile?.patients?.length || 0} Total</div>
        </div>
        
        <div className="overflow-x-auto">
            <table className="table w-full">
                <thead className="bg-slate-50/50">
                    <tr className="text-slate-400 uppercase text-[10px] tracking-widest">
                        <th>Patient Name</th>
                        <th>Age / Gender</th>
                        <th>Initial Disease</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody className="font-bold text-slate-700">
                    {doctorProfile?.patients?.map((patient) => (
                        <tr key={patient._id} className="hover:bg-blue-50/30 transition-colors">
                            <td>
                                <div className="text-blue-600 uppercase font-black">{patient.user?.name || "Loading..."}</div>
                                <div className="text-[10px] text-slate-400 font-medium lowercase italic">{patient.user?.email}</div>
                            </td>
                            <td>{patient.age} Y / {patient.gender}</td>
                            <td><span className="text-red-500 text-xs uppercase">{patient.disease}</span></td>
                            <td>
                                <Link to={`/doctor/manage-patient/${patient._id}`} className="btn btn-primary btn-xs rounded-lg text-white font-bold px-4">Manage File</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        {(!doctorProfile?.patients || doctorProfile?.patients.length === 0) && (
            <div className="text-center py-20 text-slate-400 italic">No patients are currently assigned to you.</div>
        )}
      </div>

    </div>
  );
};

export default DoctorDashboard;