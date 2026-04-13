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
                    Your request for <span className="uppercase italic">"{n.requestedName}"</span> has been <span className="underline">{n.status}</span>.
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="card w-full max-w-md mx-auto bg-white border border-gray-100 shadow-2xl rounded-[2.5rem] overflow-hidden transition-all duration-300 hover:shadow-cyan-100/50 hover:-translate-y-1">
          {/* Header Pattern/Gradient */}
          <div className="h-32 bg-gradient-to-r from-slate-800 to-slate-900 relative">
            <div className="absolute inset-0 opacity-10 pattern-dots"></div>
          </div>

          <div className="relative px-6 pb-8 flex flex-col items-center">
            {/* Avatar with Ring */}
            <div className="relative -mt-16 mb-4">
              <div className="w-32 h-32 rounded-full border-[6px] border-white shadow-2xl overflow-hidden bg-primary flex items-center justify-center text-white text-5xl font-black italic ring-1 ring-slate-100">
                {user?.name?.[0]}
              </div>
              {/* Verified Badge Placeholder */}
            </div>

            {/* Identity Section */}
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter italic">
                Dr. {user?.name}
              </h2>
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/5 py-1 px-3 rounded-full inline-block">
                {doctorProfile?.specialization}
              </p>
            </div>

            {/* Workplace Info */}
            <div className="flex items-center gap-2 mt-4">
              <span className="px-3 py-1.5 bg-slate-800 text-white rounded-lg font-bold uppercase text-[10px] tracking-widest shadow-lg">
                {doctorProfile?.hospital} Hospital
              </span>
              <div className="badge badge-outline border-slate-300 font-black text-[10px] uppercase h-7">
                Role: {user?.role}
              </div>
            </div>

            {/* Location - Better Spacing */}
            <div className="w-full mt-6 pt-6 border-t border-gray-50 text-center">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Clinic Location</p>
              <p className="text-sm font-semibold text-gray-700 leading-relaxed">
                {doctorProfile?.address}
              </p>
            </div>

            {/* Contact Info - Responsive Flex/Grid */}
            <div className="flex flex-col sm:flex-row gap-3 w-full mt-6">
              <div className="flex-1 bg-slate-50 p-3 rounded-2xl flex flex-col items-center justify-center border border-slate-100 hover:bg-white transition-colors">
                <span className="text-[9px] font-bold text-slate-400 uppercase mb-1">Email Address</span>
                <p className="text-[11px] font-bold text-gray-800 truncate w-full text-center">
                  {doctorProfile?.user?.email}
                </p>
              </div>

              <div className="flex-1 bg-slate-50 p-3 rounded-2xl flex flex-col items-center justify-center border border-slate-100 hover:bg-white transition-colors">
                <span className="text-[9px] font-bold text-slate-400 uppercase mb-1">Contact No</span>
                <p className="text-[11px] font-bold text-gray-800">
                  {doctorProfile?.contact}
                </p>
              </div>
            </div>
          </div>
        </div>


        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-center h-full">
            <h3 className="text-3xl font-black text-gray-800 mb-10">
              Good to see you, <span className="text-primary">{user?.name?.split(' ')[0]}!</span>
            </h3>
            <div className="flex flex-wrap gap-4">
              <Link to="/update-doctor" className="btn btn-outline border-black rounded-xl px-8 text-black hover:text-white">Edit Profile</Link>
              <Link to="/update-password" id="btn-update-password" className="btn btn-outline btn-primary rounded-xl px-8 hover:bg-blue-900 ">Update Password</Link>
              <button onClick={logout} className="btn btn-outline btn-error rounded-xl px-8 hover:bg-red-800 hover:text-white ">Sign Out</button>
              {user?.role !== "ADMIN" && (
                <button onClick={() => setShowDeleteModal(true)} className="btn btn-outline btn-error rounded-xl px-8 hover:bg-red-900 hover:text-white ">
                  Delete ID
                </button>
              )}
              <button onClick={deleteSelfDoctorMedicalProfile} className="btn btn-outline btn-error rounded-xl px-8 hover:bg-red-900 hover:text-white ">
                Remove yourself as a doctor
              </button>
              <button className="btn btn-outline btn-primary rounded-xl px-8 hover:bg-blue-900 hover:text-white ">
                <Link to="/doctors">Explore Doctors</Link>
              </button>
              <Link to="/" className="btn btn-outline btn-success rounded-xl px-8 hover:text-white hover:bg-green-800 ">Go to Home Page</Link>
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
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
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