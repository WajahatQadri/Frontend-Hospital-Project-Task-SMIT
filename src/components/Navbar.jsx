import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from "react-router-dom"
import { toast } from "react-toastify";
import api from '../utils/api';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null)

  // Check if we are on ANY dashboard page to show the sidebar toggle
  const isDashboardPage = location.pathname.startsWith('/admin-dashboard') || location.pathname.startsWith('/doctor-dashboard');

  const fetchUser = async () => {
    if (localStorage.getItem("isLoggedIn") !== "true") {
      setUser(null);
      return
    }
    try {
      const { data } = await api.get("/users/user-profile");
      setUser(data.user);
      localStorage.setItem("isLoggedIn", "true");
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message;

        if (status === 401 || message === "Please Login First") {
          localStorage.removeItem("isLoggedIn");
          setUser(null);
          console.error("Session expired - cleared local storage");
        }
      } else {
        console.error("Server is unreachable or network is slow...");
      
      }
      console.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchUser()
  }, [location]);

  const logout = async () => {
    try {
      await api.post("/users/logout", {})
    } catch (error) {
      console.log("API logout failed, but clearing local session anyway");
    } finally {
      localStorage.removeItem("isLoggedIn");
      setUser(null);
      navigate("/");
      toast.success("Logged out successfully");
    }
  };
  
  return (
    <div className="navbar bg-white border-b border-slate-100 px-4 md:px-12 h-16 sticky top-0 z-[110]">
      <div className="flex-1 flex items-center gap-2">
        {isDashboardPage && (
          <label htmlFor="my-drawer" className="btn btn-ghost btn-sm btn-square lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 stroke-primary">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </label>
        )}

        <Link to="/" className="flex items-center no-underline">
          <span className="text-xl md:text-2xl font-black text-slate-800 tracking-tighter">
            Medi<span className="text-blue-600 italic">Link.</span>
          </span>
        </Link>
      </div>

      <div className="flex-none gap-3">
        {/* User Dropdown */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar border-2 border-blue-100">
            <div className="w-10 rounded-full">
              <img alt="User profile" src={"https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"} />
            </div>
          </div>
          <ul tabIndex="-1" className="menu menu-sm dropdown-content bg-white rounded-2xl z-1 mt-3 w-60 p-2 shadow-2xl border border-slate-100">
            {user ? (
              <>
                <li className="p-3 border-b border-slate-50 mb-1 pointer-events-none flex flex-col items-start">
                  <span className="font-black text-slate-800 text-sm uppercase">{user.name}</span>
                  <span className="text-[10px] uppercase font-bold text-blue-600 tracking-widest">{user.role}</span>
                </li>

                {user.role === "ADMIN" && <li><Link to="/admin-dashboard" className="font-bold text-blue-600 py-3">Admin Dashboard</Link></li>}
                {user.role === "DOCTOR" && <li><Link to="/doctor-dashboard" className="font-bold text-blue-600 py-3">Doctor Dashboard</Link></li>}
                {user.role === "PATIENT" && <li><Link to="/patient-profile" className="font-bold py-3 text-blue-600">My Medical History</Link></li>}
                {user.role === "USER" && <li><Link to="/profile" className="font-bold py-3 text-blue-600">profile</Link></li>}

                <div className="divider my-0 opacity-50"></div>
                <li><button onClick={logout} className="text-red-500 font-bold py-3">Logout</button></li>
              </>
            ) : (
              <li><Link to="/login" onClick={() => document.activeElement.blur()} className="btn btn-primary text-white rounded-xl mx-2 my-2 btn-sm h-10">Login</Link></li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar;
