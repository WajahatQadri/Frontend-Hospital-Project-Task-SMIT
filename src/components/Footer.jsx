import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-slate-50 pt-20 pb-10 mt-20 border-t border-slate-100">
            <div className="container mx-auto px-6 md:px-12 lg:px-20">
                
                {/* --- TOP: NEWSLETTER SECTION --- */}
                <div className="text-center mb-20">
                    <h2 className="text-4xl font-bold text-slate-800 mb-4">Got questions? We’ve got answers</h2>
                    <p className="text-slate-500 mb-8 max-w-lg mx-auto">
                        We Love! to Resolve Your Issue.
                    </p>
                    
                    {/* Newsletter Input Box */}
                    <div className="max-w-2xl mx-auto bg-blue-100/50 p-2 rounded-full flex items-center shadow-sm">
                        <input 
                            type="email" 
                            placeholder="Enter your mail" 
                            className="input bg-transparent border-none focus:outline-none flex-grow px-6 text-slate-700" 
                        />
                        <button className="btn btn-primary rounded-full px-10 text-white border-none shadow-lg">
                            Subscribe
                        </button>
                    </div>
                </div>

                {/* --- BOTTOM: FOOTER LINKS --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-slate-600">
                    
                    {/* Column 1: Brand */}
                    <div className="space-y-6">
                        <div className='mx-auto h-10 w-auto text-center'>
                    <span className="text-4xl font-black text-slate-800 tracking-tighter">
                        Medi<span className="text-blue-600 font-serif italic">Link.</span>
                    </span>
                </div>
                        <p className="text-sm leading-relaxed">
                            Providing unparalleled precision in medical results and healthcare services since 1998. Your health is our first priority.
                        </p>
                        {/* Social Icons */}
                        <div className="flex gap-4 items-center">
                            <span className="cursor-pointer hover:text-primary">f</span>
                            <span className="cursor-pointer hover:text-primary font-bold">in</span>
                            <span className="cursor-pointer hover:text-primary text-xl">▶</span>
                            <span className="cursor-pointer hover:text-primary text-xl">𝕏</span>
                            <span className="cursor-pointer hover:text-primary text-xl">🎵</span>
                            <span className="cursor-pointer hover:text-primary text-xl">📷</span>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h4 className="text-slate-900 font-bold mb-6 uppercase tracking-wider">Quick Links</h4>
                        <ul className="space-y-3 text-sm font-medium">
                            <li className="hover:text-primary"><Link to="/">❯ Home</Link></li>
                            <li className="hover:text-primary cursor-pointer">❯ Features</li>
                            <li className="hover:text-primary cursor-pointer">❯ About Us</li>
                            <li className="hover:text-primary cursor-pointer">❯ Departments</li>
                            <li className="hover:text-primary cursor-pointer">❯ Our Team</li>
                        </ul>
                    </div>

                    {/* Column 3: Useful Links */}
                    <div>
                        <h4 className="text-slate-900 font-bold mb-6 uppercase tracking-wider">Useful Links</h4>
                        <ul className="space-y-3 text-sm font-medium">
                            <li className="hover:text-primary cursor-pointer">❯ Premises</li>
                            <li className="hover:text-primary cursor-pointer">❯ FAQ's</li>
                            <li className="hover:text-primary cursor-pointer">❯ Appointment</li>
                        </ul>
                    </div>

                    {/* Column 4: Quick Contact */}
                    <div>
                        <h4 className="text-slate-900 font-bold mb-6 uppercase tracking-wider">Quick Contact</h4>
                        <ul className="space-y-4 text-sm font-medium">
                            <li className="flex items-start gap-3">
                                <span>📍</span>
                                <span>New York, NY 53502, United States</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span>✉️</span>
                                <span>Lifetrust@outlook.com</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span>📞</span>
                                <span>+1(857) 832-9806</span>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Copyright Note */}
                <div className="mt-20 pt-8 border-t border-slate-200 text-center text-xs text-slate-400 font-bold uppercase tracking-widest">
                    © 2026 Lifetrust Medical Center. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;