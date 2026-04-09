import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import api from '../utils/api';
import { toast } from 'react-toastify';
import AdminStats from './AdminStats'; // Import the stats we made earlier

const AdminDashboard = () => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [imgErr, setImgErr] = React.useState(false);

  const getUserProfile = async () => {
    if (localStorage.getItem("isLoggedIn") !== "true") {
        navigate("/login");
        return; 
    }
    try {
      const response = await api.get(
        "/users/user-profile",
      );
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
  }, []);

  const logout = async () => {
    try {
      await api.post("/users/logout", {}, { withCredentials: true });
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
      {/* This renders sub-pages (Users, Products) */}
      <Outlet />

      {/* Only show this content on the main dashboard route */}
      {location.pathname === "/admin-dashboard" && (
        <div className="flex flex-col gap-8 animate-in fade-in duration-500">

          {/* 1. TOP SECTION: Visual Stats & Chart */}
          {/* <AdminStats /> */}

          {/* 2. PROFILE SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left: User Card */}
            <div className="card w-full max-w-sm bg-white border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden rounded-[2rem] transition-all hover:shadow-indigo-100">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-500"></div>

        <div className="relative px-6 pb-10 flex flex-col items-center">
          {/* Avatar Area - Logic for Image vs Initial */}
          <div className="relative -mt-16 mb-4">
            <div className="w-32 h-32 rounded-full border-[6px] border-white shadow-xl overflow-hidden flex items-center justify-center bg-slate-800">
              {user?.avatar?.url && !imgErr ? (
                <img
                  src={user.avatar.url}
                  onError={() => setImgErr(true)}
                  className="w-full h-full object-cover"
                  alt="profile"
                />
              ) : (
                <span className="text-5xl font-black text-white select-none">
                  {user?.name?.[0]?.toUpperCase()}
                </span>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="text-center w-full px-4">
            <h2 className="text-2xl font-black text-gray-800 capitalize tracking-tight leading-tight">
              {user?.name}
            </h2>
            <p className="text-sm font-medium text-gray-400 break-all mt-1">
              {user?.email}
            </p>
          </div>

          {/* Role Badge */}
          <div className="mt-6">
            <span className="px-5 py-2 rounded-xl bg-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] border border-indigo-100 shadow-sm">
              {user?.role || 'Admin'}
            </span>
          </div>
        </div>
      </div>

            {/* Right: Quick Actions & Welcome */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-center h-full">
                <h3 className="text-3xl font-black text-gray-800 mb-2">
                  Good to see you, <span className="text-primary">{user?.name.split(' ')[0]}!</span>
                </h3>
                <p className="text-gray-500 mb-8 max-w-md">
                  Control your store, manage users, and keep track of your business analytics from this central hub.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link to="/update-profile" className="btn btn-outline border-black rounded-xl px-8 text-black hover:text-white">
                    Edit Profile
                  </Link>
                  <Link to="/update-password" className="btn btn-outline btn-primary rounded-xl px-8 hover:bg-blue-900 ">
                    Update Password
                  </Link>
                  <button onClick={logout} className="btn btn-outline btn-error rounded-xl px-8 hover:bg-red-800 hover:text-white ">
                    Sign Out
                  </button>
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