import api from "../utils/api";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Profile = () => {
  const navigate = useNavigate();
  const [imgErr, setImgErr] = React.useState(false);
  const [user, setUser] = useState();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // --- LOGIC FOR PERMANENT NOTIFICATIONS ---
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get("/categories/my-requests");
      if (data.success && data.requests) {
        // Filter to only show Approved or Rejected notifications
        setNotifications(data.requests.filter(r => r.status !== "PENDING"));
      }
    } catch (error) {
      console.error("Notification fetch error:", error);
    }
  };

  const handleDismissNotification = async (id) => {
    try {
      await api.delete(`/categories/request/delete/${id}`);
      // Remove from UI instantly
      setNotifications(notifications.filter(n => n._id !== id));
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const getUserProfile = async () => {
    if (localStorage.getItem("isLoggedIn") !== "true") {
      setUser(null);
      navigate("/login");
      return;
    }
    try {
      const response = await api.get("/users/user-profile");

      if (response.data.user.role === "DOCTOR") {
        navigate("/doctor-dashboard")
      }
      if (response.data.user.role === "PATIENT") {
        navigate("/patient-profile")
      }
      setUser(response.data.user);
    } catch (error) {
      localStorage.removeItem("isLoggedIn");
      navigate("/")
    }
  };

  const confirmDelete = async () => {
    try {
      await api.delete("/users/delete-profile");
      toast.success("Profile deleted successfully");
      localStorage.removeItem("isLoggedIn");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Deletion failed");
    } finally {
      setShowDeleteModal(false);
    }
  };

  const logout = async () => {
    try {
      await api.post("/users/logout");
      localStorage.removeItem("isLoggedIn");
      navigate("/");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  useEffect(() => {
    getUserProfile();
    fetchNotifications(); // Logic added to load notifications on mount
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen text-black">

      {/* --- NOTIFICATION BANNERS LOGIC ADDED --- */}
      {notifications.length > 0 && (
        <div className="container mx-auto px-4 pt-6 space-y-3">
          {notifications.map((n) => (
            <div key={n._id} className={`flex items-center justify-between p-4 rounded-2xl border shadow-sm ${n.status === 'APPROVED' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${n.status === 'APPROVED' ? 'bg-emerald-500' : 'bg-red-500'}`}>
                  {n.status === 'APPROVED' ? '✓' : '✕'}
                </div>
                <div>
                  <p className="font-bold text-sm">
                    Your request for <span className="uppercase italic">"{n.requestedName}"</span> has been <span className="underline">{n.status}</span>.
                  </p>
                  {/* Admin message displayed if present */}
                  {n.adminMessage && (
                    <p className="text-xs mt-1 opacity-70 italic font-medium">Message: {n.adminMessage}</p>
                  )}
                </div>
              </div>
              <button onClick={() => handleDismissNotification(n._id)} className="btn btn-ghost btn-circle btn-sm hover:bg-black/5 cursor-pointer text-black">✕</button>
            </div>
          ))}
        </div>
      )}

      {/* --- EXISTING UI CONTENT --- */}
      <div className="max-w-5xl mx-auto py-10 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="card w-full max-w-sm bg-white border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden rounded-[2rem] transition-all hover:shadow-indigo-100">
          <div className="h-32 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-500"></div>
          <div className="relative px-6 pb-10 flex flex-col items-center">
            <div className="relative -mt-16 mb-4">
              <div className="w-32 h-32 rounded-full border-[6px] border-white shadow-xl overflow-hidden flex items-center justify-center bg-slate-800">
                {user?.avatar?.url && !imgErr ? (
                  <img src={user.avatar.url} onError={() => setImgErr(true)} className="w-full h-full object-cover" alt="profile" />
                ) : (
                  <span className="text-5xl font-black text-white select-none">{user?.name?.[0]?.toUpperCase()}</span>
                )}
              </div>
            </div>
            <div className="text-center w-full px-4 text-black">
              <h2 className="text-2xl font-black text-gray-800 capitalize tracking-tight leading-tight">{user?.name}</h2>
              <p className="text-sm font-medium text-gray-400 break-all mt-1">{user?.email}</p>
            </div>
            <div className="mt-6">
              <span className="px-5 py-2 rounded-xl bg-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] border border-indigo-100 shadow-sm">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-center h-full">
            <h3 className="text-3xl font-black text-gray-800 mb-10">
              Good to see you, <span className="text-primary">{user?.name?.split(' ')[0]}!</span>
            </h3>
            <div className="flex flex-wrap gap-4">
              <Link to="/update-profile" className="btn btn-outline border-black rounded-xl px-8 text-black hover:text-white">Edit Profile</Link>
              <Link to="/update-password" id="btn-update-password" className="btn btn-outline btn-primary rounded-xl px-8 hover:bg-blue-900 ">Update Password</Link>
              <button onClick={logout} className="btn btn-outline btn-error rounded-xl px-8 hover:bg-red-800 hover:text-white ">Sign Out</button>
              {user?.role !== "ADMIN" && (
                <button onClick={() => setShowDeleteModal(true)} className="btn btn-outline btn-error rounded-xl px-8 hover:bg-red-900 hover:text-white ">
                  Delete ID
                </button>
              )}
              {user?.role === "USER" && (
                <>
                  <Link to="/doctor/apply" className="btn btn-outline btn-primary rounded-xl px-8 hover:bg-blue-900 hover:text-white">Apply To Be A Doctor</Link>
                  <Link to="/patient/register" className="btn btn-outline btn-primary rounded-xl px-8 hover:bg-blue-900 hover:text-white">Register as Patient</Link>
                </>
              )}
              {user?.role === "ADMIN" ? (
                <Link to="/admin-dashboard" className="btn btn-outline btn-success rounded-xl px-8 hover:text-white hover:bg-green-800 ">
                  Admin Dashboard
                </Link>
                ) :
                (null)}
              <Link to="/doctors" className="btn btn-outline btn-primary rounded-xl px-8 hover:bg-blue-900 hover:text-white ">Explore Doctors</Link>
              <Link to="/" className="btn btn-outline btn-success rounded-xl px-8 hover:text-white hover:bg-green-800 ">Go to Home Page</Link>
            </div>
          </div>
        </div>

        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full mx-4 border border-gray-100">
              <h3 className="text-2xl font-black text-gray-800 mb-2 text-black">Are you absolutely sure?</h3>
              <p className="text-gray-500 mb-8 font-medium text-black">This action cannot be undone.</p>
              <div className="flex gap-4">
                <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3 rounded-xl font-bold bg-gray-100 text-gray-600">Cancel</button>
                <button onClick={confirmDelete} className="flex-1 py-3 rounded-xl font-bold bg-red-600 text-white shadow-lg">Yes, Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;