import api from "../utils/api";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Profile = () => {
  const navigate = useNavigate();
  const [imgErr, setImgErr] = React.useState(false);
  const [user, setUser] = useState();
  // 1. Added state for modal visibility
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const getUserProfile = async () => {
    if (localStorage.getItem("isLoggedIn") !== "true") {
       setUser(null);
       navigate("/login");
       return;
    }
    try {
      const response = await api.get(
        "/users/user-profile",
      );
      if(response.data.user.role === "DOCTOR"){
        navigate("/doctor-dashboard")
      }
      if(response.data.user.role === "PATIENT"){
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
      await api.delete("/users/delete-profile", {
      });
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
      await api.post("/users/logout", {}, { withCredentials: true });
      navigate("/");
      toast.success("Logged out successfully");
      localStorage.removeItem("isLoggedIn");
    } catch (error) {
      toast.error(error.response?.data?.message);
      console.log(error);
      localStorage.removeItem("isLoggedIn");
    }
  };

  const deletePatientSelf = async () => {
    try {
      const response = await api.delete("/patients/delete-patient",{});
      toast.success("You are no longer as a patient");
      localStorage.removeItem("isLoggedIn");
      getUserProfile()
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    getUserProfile();
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left: User Card */}
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
          <div className="text-center w-full px-4">
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

      {/* Right: Quick Actions */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-center h-full">
          <h3 className="text-3xl font-black text-gray-800 mb-10">
            Good to see you, <span className="text-primary">{user?.name?.split(' ')[0]}!</span>
          </h3>
          <div className="flex flex-wrap gap-4">
            <Link to="/update-profile" className="btn btn-outline border-black rounded-xl px-8 text-black hover:text-white">Edit Profile</Link>
            <Link to="/update-password" className="btn btn-outline btn-primary rounded-xl px-8 hover:bg-blue-900 ">Update Password</Link>
            <button onClick={logout} className="btn btn-outline btn-error rounded-xl px-8 hover:bg-red-800 hover:text-white ">Sign Out</button>            
            {user?.role !== "ADMIN" ? (
              <button onClick={() => setShowDeleteModal(true)} className="btn btn-outline btn-error rounded-xl px-8 hover:bg-red-900 hover:text-white ">
              Delete ID
            </button>
            ) : (null)}
            {user?.role === "USER" ? (
              <button className="btn btn-outline btn-primary rounded-xl px-8 hover:bg-blue-900 hover:text-white ">
              <Link to="/doctor/apply">Apply To Be A Doctor</Link>
            </button>
            ) : (null)}
            {user?.role === "USER" ? (
              <button className="btn btn-outline btn-primary rounded-xl px-8 hover:bg-blue-900 hover:text-white ">
              <Link to="/patient/register">Register as Patient</Link>
            </button>
            ) : (null)}
            <button className="btn btn-outline btn-primary rounded-xl px-8 hover:bg-blue-900 hover:text-white ">
              <Link to="/doctors">Explore Doctors</Link>
            </button>
            {/* {user?.role === "PATIENT" ? (
              <button onClick={deletePatientSelf} className="btn btn-outline btn-error rounded-xl px-8 hover:bg-red-900 hover:text-white ">
                Remove you self as a patient
            </button>
            ) : (null)} */}
            
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
  );
};

export default Profile;
