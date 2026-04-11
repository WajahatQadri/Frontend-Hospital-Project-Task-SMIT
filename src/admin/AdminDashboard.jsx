import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import api from '../utils/api';
import { toast } from 'react-toastify';
import AdminStats from './AdminStats';

const AdminDashboard = () => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [imgErr, setImgErr] = React.useState(false);
  const [lastHandled, setLastHandled] = useState(null);

  const [requests, setRequests] = useState([]);
  // --- NEW STATE: Stores messages for each specific request ID ---
  const [adminMessages, setAdminMessages] = useState({});

  const fetchInbox = async () => {
    try {
      const { data } = await api.get("/categories/admin/inbox");
      if (data.success) {
        setRequests(data.requests);
      }
    } catch (error) {
      console.log("Error fetching inbox");
    }
  };

  const handleAction = async (id, action) => {
    try {
      const message = adminMessages[id] || "";
      const { data } = await api.put(`/categories/admin/${action}/${id}`, { message });

      if (data.success) {
        toast.success(data.message);

        // IF APPROVED: Save the link to their profile
        if (action === 'approve-request' && data.profileId) {
          setLastHandled({
            type: data.profileType,
            id: data.profileId,
            name: requests.find(r => r._id === id).requesterName
          });
        }

        setRequests(requests.filter(req => req._id !== id));
      }
    } catch (error) { toast.error("Action failed"); }
  };

  const getUserProfile = async () => {
    if (localStorage.getItem("isLoggedIn") !== "true") {
      navigate("/login");
      return;
    }
    try {
      const response = await api.get("/users/user-profile");
      if (response.data.user.role !== "ADMIN") {
        toast.error("Access Denied! only ADMINS");
        return navigate("/profile");
      }
      setUser(response.data.user);
      setLoading(false);
    } catch (error) {
      navigate("/profile");
    }
  };

  useEffect(() => {
    getUserProfile();
    fetchInbox();
  }, []);

  const logout = async () => {
    try {
      await api.post("/users/logout");
      localStorage.removeItem("isLoggedIn");
      navigate("/");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  if (loading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-gray-50">
      <span className="loading loading-spinner loading-lg text-primary"></span>
      <p className="text-gray-500 animate-pulse font-medium">Loading Dashboard...</p>
    </div>
  );

  return (
    <AdminLayout>

      {lastHandled && (
        <div className="bg-blue-600 p-4 rounded-2xl mb-6 flex justify-between items-center shadow-lg animate-bounce-slow">
          <p className="text-white font-bold text-sm">
            Category added! Want to update <span className="underline uppercase">{lastHandled.name}'s</span> record now?
          </p>
          <div className="flex gap-2">
            <Link
              to={lastHandled.type === 'doctor' ? `/admin-dashboard/view-all-doctors` : `/admin-dashboard/patient-details/${lastHandled.id}`}
              className="btn btn-sm bg-white text-blue-600 border-none font-black"
              onClick={() => setLastHandled(null)}
            >
              YES, UPDATE RECORD
            </Link>
            <button onClick={() => setLastHandled(null)} className="text-white text-xs font-bold">Dismiss</button>
          </div>
        </div>
      )}

      {/* --- ADMIN INBOX NOTIFICATIONS --- */}
      {requests.length > 0 && (
        <div className="mb-10 space-y-3">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2 mb-4">Pending User Requests</h4>
          {requests.map((req) => (
            <div key={req._id} className="flex flex-col items-stretch p-5 bg-white rounded-3xl border-2 border-blue-50 shadow-sm gap-4 transition-all hover:border-blue-200">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-blue-100">
                    {req.requesterName?.[0]}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                      {req.requesterRole} : {req.requesterName}
                    </p>
                    <p className="font-black text-slate-800 text-sm">
                      Wants to add <span className="text-blue-600 underline italic">"{req.requestedName}"</span> to <span className="badge badge-ghost badge-sm font-bold">{req.label}</span>
                    </p>
                  </div>
                </div>

                {/* --- NEW LOGIC: MESSAGE INPUT FOR ADMIN --- */}
                <div className="w-full md:w-1/3">
                  <input
                    type="text"
                    placeholder="Add response message..."
                    className="input input-bordered input-sm w-full bg-slate-50 text-black font-bold text-xs rounded-xl"
                    value={adminMessages[req._id] || ""}
                    onChange={(e) => setAdminMessages({ ...adminMessages, [req._id]: e.target.value })}
                  />
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                  <button
                    onClick={() => handleAction(req._id, 'approve-request')}
                    className="btn btn-success btn-sm flex-1 md:px-6 rounded-xl text-white font-bold"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(req._id, 'reject-request')}
                    className="btn btn-ghost btn-sm flex-1 md:px-6 rounded-xl text-red-500 font-bold hover:bg-red-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Renders sub-pages */}
      <Outlet />

      {location.pathname === "/admin-dashboard" && (
        <div className="flex flex-col gap-8 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="card w-full max-w-sm bg-white border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden rounded-[2rem] transition-all hover:shadow-indigo-100 text-black">
              <div className="h-32 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-500"></div>
              <div className="relative px-6 pb-10 flex flex-col items-center">
                <div className="relative -mt-16 mb-4 text-black">
                  <div className="w-32 h-32 rounded-full border-[6px] border-white shadow-xl overflow-hidden flex items-center justify-center bg-slate-800">
                    {user?.avatar?.url && !imgErr ? (
                      <img src={user.avatar.url} onError={() => setImgErr(true)} className="w-full h-full object-cover" alt="profile" />
                    ) : (
                      <span className="text-5xl font-black text-white select-none">
                        {user?.name?.[0]?.toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-center w-full px-4 font-bold text-black">
                  <h2 className="text-2xl font-black text-gray-800 capitalize tracking-tight leading-tight">{user?.name}</h2>
                  <p className="text-sm font-medium text-gray-400 break-all mt-1">{user?.email}</p>
                </div>
                <div className="mt-6">
                  <span className="px-5 py-2 rounded-xl bg-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] border border-indigo-100 shadow-sm">{user?.role || 'Admin'}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-center h-full text-black">
                <h3 className="text-3xl font-black text-gray-800 mb-2">
                  Good to see you, <span className="text-primary">{user?.name.split(' ')[0]}!</span>
                </h3>
                <p className="text-gray-500 mb-8 max-w-md font-bold">
                  Control your store, manage users, and keep track of your business analytics from this central hub.
                </p>
                <div className="flex flex-wrap gap-4 font-bold">
                  <Link to="/update-profile" className="btn btn-outline border-black rounded-xl px-8 text-black hover:text-white">Edit Profile</Link>
                  <Link to="/update-password" id="btn-update-password" className="btn btn-outline btn-primary rounded-xl px-8 hover:bg-blue-900 ">Update Password</Link>
                  <button onClick={logout} className="btn btn-outline btn-error rounded-xl px-8 hover:bg-red-800 hover:text-white ">Sign Out</button>
                  <Link to="/" className="btn btn-outline btn-success rounded-xl px-8 hover:text-white hover:bg-green-800 ">Go to Home Page</Link>
                </div>
              </div>
            </div>
          </div>
          <AdminStats />
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;