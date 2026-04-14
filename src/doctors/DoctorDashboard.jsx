import api from "../utils/api";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [imgErr, setImgErr] = useState(false);
  const [user, setUser] = useState(null);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // --- NEW LOGIC FOR NOTIFICATION BANNERS ---
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get("/categories/my-requests");
      if (data.success && data.requests) {
        // Only show requests that the Admin has already Approved or Rejected
        setNotifications(data.requests.filter(r => r.status !== "PENDING"));
      }
    } catch (error) {
      console.log("Notification fetch error");
    }
  };

  const handleDismissNotification = async (id) => {
    try {
      await api.delete(`/categories/request/delete/${id}`);
      setNotifications(notifications.filter(n => n._id !== id));
    } catch (err) {
      toast.error("Action failed");
    }
  };

  const fetchData = async () => {
    if (localStorage.getItem("isLoggedIn") !== "true") {
      return navigate("/login");
    }
    try {
      const userRes = await api.get("/users/user-profile");
      if (userRes.data.user.role !== "DOCTOR") {
        return navigate("/profile");
      }
      setUser(userRes.data.user);

      const docRes = await api.get("/doctors/doctor/my-profile");
      setDoctorProfile(docRes.data.doctor);
      // console.log(docRes);


    } catch (error) {
      localStorage.removeItem("isLoggedIn");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchNotifications(); // Added: check for approved/rejected requests
  }, []);

  const logout = async () => {
    try {
      await api.post("/users/logout"); // Using GET as per our backend update
      localStorage.removeItem("isLoggedIn");
      navigate("/");
      toast.success("Logged out");
    } catch (error) { toast.error("Logout failed"); }
  };

  const confirmDelete = async () => {
    try {
      await api.delete("/users/delete-profile");
      localStorage.removeItem("isLoggedIn");
      toast.success("Account deleted");
      navigate("/");
    } catch (error) { toast.error("Delete failed"); }
  };

  const deleteSelfDoctorMedicalProfile = async () => {
    if (!window.confirm("Remove your medical profile?")) return;
    try {
      await api.delete("/doctors/doctor/delete");
      toast.success("Medical profile removed");
      navigate("/profile");
    } catch (error) { toast.error("Action failed"); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><span className="loading loading-spinner loading-lg text-primary"></span></div>;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-10 text-black">

      {/* --- NOTIFICATION BANNERS (Takes space at the top) --- */}
      {notifications.length > 0 && (
        <div className="mb-6 space-y-3">
          {notifications.map((n) => (
            <div key={n._id} className={`flex items-center justify-between p-4 rounded-2xl border shadow-sm transition-all ${n.status === 'APPROVED' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${n.status === 'APPROVED' ? 'bg-emerald-500' : 'bg-red-500'}`}>
                  {n.status === 'APPROVED' ? '✓' : '✕'}
                </div>
                <div>
                  <p className="font-bold text-sm">
                    Your request for <span className="uppercase italic">"{n.requestedName}"</span> to add in {n.label} has been {n.status}.
                  </p>
                  {n.adminMessage && (
                    <p className="text-xs mt-1 opacity-70 italic font-medium">Admin: {n.adminMessage}</p>
                  )}
                </div>
              </div>
              <button onClick={() => handleDismissNotification(n._id)} className="btn btn-ghost btn-circle btn-sm hover:bg-black/5 cursor-pointer text-black">✕</button>
            </div>
          ))}
        </div>
      )}

      {/* --- TOP SECTION: PROFILE & ACTIONS --- */}
      <div>
        <Link to="/" className="btn btn-link text-slate-400 no-underline font-bold">← Back to Home</Link>
        <h3 className="text-3xl font-black text-gray-800 italic">Doctor Workspace</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
  
  {/* SECTION 1: TALL LEFT COLUMN (Doctor Profile) */}
  <div className="lg:col-span-1 h-full">
    <div className="card w-full bg-white border border-slate-100 shadow-2xl rounded-[2.5rem] overflow-hidden h-full transition-all duration-300 hover:shadow-cyan-100/50 flex flex-col">
      <div className="h-28 bg-gradient-to-br from-slate-800 to-slate-950 relative flex-shrink-0">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      </div>

      <div className="relative px-6 pb-8 flex flex-col items-center flex-grow">
        <div className="relative -mt-14 mb-4">
          <div className="w-28 h-28 rounded-full border-[5px] border-white shadow-xl overflow-hidden bg-primary flex items-center justify-center text-white text-4xl font-black italic">
            {user?.name?.[0]}
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter italic leading-tight">
            Dr. {user?.name}
          </h2>
          <span className="mt-2 inline-block px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">
            {doctorProfile?.specialization}
          </span>
        </div>

        <div className="w-full mt-6 space-y-3">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Workplace</p>
            <p className="text-xs font-black text-slate-700">{doctorProfile?.hospital} Hospital</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Clinic Address</p>
            <p className="text-xs font-bold text-slate-600 leading-tight">{doctorProfile?.address}</p>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <div className="flex flex-col bg-blue-50/50 p-3 rounded-xl border border-blue-100">
              <span className="text-[8px] font-black text-blue-400 uppercase">Direct Email</span>
              <span className="text-[11px] font-bold text-slate-700 truncate">{user?.email}</span>
            </div>
            <div className="flex flex-col bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
              <span className="text-[8px] font-black text-emerald-500 uppercase">Contact No</span>
              <span className="text-[11px] font-bold text-slate-700">{doctorProfile?.contact}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* SECTION 2: RIGHT COLUMN STACK (Greetings + Schedule) */}
  <div className="lg:col-span-2 flex flex-col gap-8">
    
    {/* UP: GREETINGS & QUICK ACTIONS */}
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl flex flex-col">
      <div className="mb-8">
        <h3 className="text-3xl font-black text-slate-800 tracking-tighter">
          Welcome back, <br />
          <span className="text-primary italic">Dr. {user?.name?.split(' ')[0]}</span>
        </h3>
        <p className="text-slate-400 text-sm font-medium mt-2">Manage your practice and profile from here.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/update-doctor" className="group flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-primary transition-all border border-slate-100">
          <span className="font-bold text-sm text-slate-700 group-hover:text-white">Edit Professional Profile</span>
          <span className="text-slate-400 group-hover:text-white">→</span>
        </Link>

        <Link to="/update-password" id="btn-update-password" className="group flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-800 transition-all border border-slate-100">
          <span className="font-bold text-sm text-slate-700 group-hover:text-white">Security & Password</span>
          <span className="text-slate-400 group-hover:text-white">→</span>
        </Link>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mt-4">
        <button onClick={logout} className="cursor-pointer p-4 bg-red-50 text-red-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">
          Sign Out
        </button>
        <button onClick={() => setShowDeleteModal(true)} className="cursor-pointer p-4 bg-slate-100 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-900 hover:text-white transition-all">
          Delete ID
        </button>
      </div>
    </div>

    {/* DOWN: SCHEDULE SUMMARY */}
    <div className="flex flex-col bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex-grow">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl"></div>
      <div className="relative z-10">
        <h2 className="font-black uppercase text-blue-400 tracking-[0.2em] text-xs mb-6">Schedule Summary</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase mb-4 tracking-widest">Consultation Days</p>
            <div className="flex flex-wrap gap-2">
              {doctorProfile?.days?.map((day) => (
                <span key={day} className="px-4 py-2 bg-slate-800 text-blue-100 rounded-xl font-bold text-[10px] border border-slate-700">
                  {day}
                </span>
              ))}
            </div>
          </div>

          <div className="p-5 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
            <p className="text-[10px] uppercase font-black text-blue-400 mb-4 tracking-widest">Active Timings</p>
            <div className="flex flex-col gap-3">
              {doctorProfile?.timing?.map((time) => (
                <div key={time} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  <span className="text-white font-bold text-xs">{time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</div>

      <div className="grid grid-cols-1">
        <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
          <h2 className=" font-black uppercase text-blue-600 tracking-widest">Schedule Summary</h2>
          <div className="flex flex-wrap gap-2">
            {doctorProfile?.days?.map((day) => <span key={day} className="px-4 py-2 bg-slate-50 text-black rounded-xl font-bold text-xs border border-slate-200">{day}</span>)}
          </div>
          <div className="p-4 bg-white rounded-2xl border border-blue-100">
            <p className="text-[13px] uppercase font-black text-slate-900 mb-1">Standard Timings</p>
            <div className="flex flex-wrap gap-2">
              {doctorProfile?.timing?.map((day) => <span key={day} className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs border border-slate-200">{day}</span>)}
            </div>
          </div>
        </div>
      </div>

      {/* --- BOTTOM SECTION: ASSIGNED PATIENTS --- */}
      <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-slate-50 to-white p-5 sm:p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-black text-xl sm:text-2xl uppercase tracking-tighter italic text-slate-800">
              My Assigned Patients
            </h3>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 mt-1">Hospital Management System</p>
          </div>
          <div className="badge badge-primary badge-lg font-black italic px-5 py-4 shadow-lg shadow-primary/20">
            {doctorProfile?.patients?.length || 0} Total
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full border-separate border-spacing-y-2 px-4 sm:px-6">
            {/* Table Head - Hidden on Mobile */}
            <thead className="hidden sm:table-header-group">
              <tr className="text-slate-400 uppercase text-[11px] tracking-[0.15em] border-none">
                <th className="bg-transparent pb-4">Patient Identity</th>
                <th className="bg-transparent pb-4">Demographics</th>
                <th className="bg-transparent pb-4">Diagnosis</th>
                <th className="bg-transparent pb-4 text-right">Operations</th>
              </tr>
            </thead>

            <tbody className="text-slate-700">
              {doctorProfile?.patients?.map((patient) => (
                <tr key={patient._id} className="group transition-all duration-300">
                  {/* Name Column */}
                  <td className="bg-slate-50/50 group-hover:bg-blue-50/50 rounded-l-2xl border-y border-l border-slate-50 group-hover:border-blue-100 py-4">
                    <div className="flex flex-col">
                      <span className="text-blue-600 uppercase font-black tracking-tight text-sm">
                        {patient.user?.name || "Loading..."}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold lowercase opacity-70 group-hover:text-blue-400">
                        {patient.user?.email}
                      </span>
                    </div>
                  </td>

                  {/* Age/Gender */}
                  <td className="bg-slate-50/50 group-hover:bg-blue-50/50 border-y border-slate-50 group-hover:border-blue-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black px-2 py-1 bg-white rounded-md shadow-sm">{patient.age}Y</span>
                      <span className="text-[10px] uppercase font-bold text-slate-400 italic">{patient.gender}</span>
                    </div>
                  </td>

                  {/* Disease Badge */}
                  <td className="bg-slate-50/50 group-hover:bg-blue-50/50 border-y border-slate-50 group-hover:border-blue-100">
                    <span className="px-3 py-1 rounded-full bg-red-50 text-red-500 text-[10px] font-black uppercase tracking-wider border border-red-100">
                      {patient.disease}
                    </span>
                  </td>

                  {/* Action Button */}
                  <td className="bg-slate-50/50 group-hover:bg-blue-50/50 rounded-r-2xl border-y border-r border-slate-50 group-hover:border-blue-100 text-right">
                    <Link
                      to={`/doctor/manage-patient/${patient._id}`}
                      className="btn btn-primary btn-sm rounded-xl text-white font-black uppercase tracking-tighter italic border-none shadow-md shadow-primary/30 hover:scale-105 transition-transform"
                    >
                      Manage Patient
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {(!doctorProfile?.patients || doctorProfile?.patients.length === 0) && (
          <div className="text-center py-24">
            <div className="inline-block p-6 rounded-full bg-slate-50 mb-4">🩺</div>
            <p className="text-slate-400 font-bold italic uppercase tracking-widest text-xs">
              No patients currently assigned.
            </p>
          </div>
        )}
      </div>


      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full mx-4 border border-gray-100">
            <h3 className="text-2xl font-black text-gray-800 mb-2">Are you absolutely sure?</h3>
            <p className="text-gray-500 mb-8 font-medium">This action cannot be undone. This will permanently delete your account and remove your data from our servers.</p>
            <div className="flex gap-4">
              <button onClick={() => setShowDeleteModal(false)} className="cursor-pointer flex-1 py-3 rounded-xl font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">Cancel</button>
              <button onClick={confirmDelete} className="cursor-pointer flex-1 py-3 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 transition-colors shadow-lg shadow-red-200">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;