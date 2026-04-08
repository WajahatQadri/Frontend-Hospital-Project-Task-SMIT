import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const closeDrawer = () => {
    const drawerCheckbox = document.getElementById('my-drawer');
    if (drawerCheckbox) drawerCheckbox.checked = false;
  };

  const links = [
    { name: 'Dashboard', path: '/admin-dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Doctors', path: 'view-all-doctors', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { name: 'Patients', path: 'view-all-patients', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { name: 'Regular Users', path: 'view-all-users', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { name: 'Medicines', path: 'view-all-medicines', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.642.316a6 6 0 01-3.86.517l-2.387-.477a2 2 0 00-1.022.547l-1.168 1.168a2 2 0 000 2.828l1.168 1.168a2 2 0 002.828 0l1.168-1.168z' },
    { name: 'Categories', path: 'categories', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
  ];

  return (
    <div className="flex flex-col w-64 min-h-full bg-white border-r border-slate-100">
      {/* Removed Redundant Header to stop overlap */}
      <div className="h-4"></div> 

      <ul className="menu p-4 space-y-2 flex-1">
        {links.map((link) => (
          <li key={link.path}>
            <NavLink 
              to={link.path} 
              onClick={closeDrawer}
              end={link.path === '/admin-dashboard'}
              className={({ isActive }) => 
                `flex gap-4 p-3 rounded-xl font-bold text-sm transition-all ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600 shadow-sm border border-blue-100' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'
                }`
              }
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={link.icon} />
              </svg>
              {link.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;