import React from 'react';
import Sidebar from './Sidebar';

const AdminLayout = ({ children }) => {
  return (
    // Add pt-16 to skip the Navbar height
    <div className="drawer lg:drawer-open min-h-screen bg-gray-100">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      
      <div className="drawer-content flex flex-col min-w-0">
        <main className="p-4 sm:p-6 lg:p-8">
            {children}
        </main>
      </div> 

      {/* 
          THE FIX: 
          1. Changed z-index to [100] so it's below the Navbar (z-110).
          2. Added top-16 so it starts below the Navbar.
          3. h-[calc(100vh-64px)] makes it fit perfectly to the bottom of the screen.
      */}
      <div className="drawer-side z-[100] top-16 h-[calc(100vh-64px)]">
        <label htmlFor="my-drawer" className="drawer-overlay"></label> 
        <div className="w-64 h-full bg-white">
             <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;