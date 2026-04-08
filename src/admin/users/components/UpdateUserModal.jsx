import React from 'react';
import ReactDOM from 'react-dom'; // Required for Portal

const UpdateUserModal = ({ isOpen, onClose, user }) => {
    if (!isOpen || !user) return null;


    // We use ReactDOM.createPortal to render the modal at the very top of the HTML tree
    return ReactDOM.createPortal(
        <div
            className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            style={{ zIndex: 99999 }} // Extremely high z-index to be above everything
            onClick={onClose} // Click on backdrop to close
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all flex flex-col"
                onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside
            >
                {/* Modal Header */}
                <div className="bg-blue-600 p-6 text-white text-center relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl font-bold leading-none"
                    >
                        &times;
                    </button>

                    <div className="w-20 h-20 bg-white text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-3 shadow-lg border-4 border-blue-500/20">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                    <p className="text-blue-100 text-xs uppercase tracking-widest font-semibold mt-1">
                        Role: {user.role}
                    </p>
                </div>

                {/* Modal Body */}
                <div className="p-8 space-y-5 bg-white">
                    <div className="flex flex-col space-y-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Full Name</span>
                        <span className="text-gray-800 font-semibold text-lg">{user.name}</span>
                    </div>

                    <div className="flex flex-col space-y-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Email Address</span>
                        <span className="text-gray-800 font-medium">{user.email}</span>
                    </div>

                    <div className="flex flex-col space-y-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Current Status</span>
                        <div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                                }`}>
                                {user.role || 'user'}
                            </span>
                        </div>
                    </div>
                </div>                                
                {/* Modal Footer */}
                <div className="bg-gray-50 p-4 flex justify-center">
                    <button
                        onClick={onClose}
                        className="cursor-pointer w-full sm:w-auto px-10 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-black transition-all font-bold text-sm shadow-md active:scale-95"
                    >
                        Close Profile
                    </button>
                </div>
            </div>
        </div>,
        document.body // This renders the modal at the end of <body>
    );
};

export default UpdateUserModal;