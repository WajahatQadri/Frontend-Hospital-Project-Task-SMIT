import React from 'react';
import { Link } from 'react-router-dom';
import ExpertsSection from '../components/ExpertsSection';
import FeaturedSpecialists from '../components/FeaturedSpecialist';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      
      {/* --- HERO MAIN SECTION --- */}
      <div className="container mx-auto px-6 md:px-12 lg:px-16 pt-10 pb-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* LEFT CONTENT */}
          <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
            <div className="inline-block px-4 py-1 rounded-full bg-blue-50 border border-blue-100 text-primary font-bold text-xs uppercase tracking-widest">
              Welcome to Healthcare
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight">
              Get Appointment <br />
              <span className="text-primary italic font-serif">Easy And Fast</span>
            </h1>
            
            <p className="text-slate-500 text-lg md:text-xl max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Easy access to top-rated experts, specialists, pharmacy and real-time records.You can monitor and manage your medical history with the platform we will provide. Your history with one simple click.
            </p>
            
            
          </div>

          {/* RIGHT IMAGE SECTION (Simple & Clean) */}
          <div className="lg:w-1/2 flex justify-center lg:justify-end">
            <div className="relative max-w-md md:max-w-lg">
              {/* Clean Image with Rounded Corners */}
              <img 
                src="https://images.pexels.com/photos/6050279/pexels-photo-6050279.jpeg" 
                alt="Doctor Consultation" 
                className="rounded-3xl shadow-2xl border-4 border-white"
              />
              
              {/* Simple Static Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl shadow-xl border border-slate-100 hidden md:block">
                <div className="text-primary font-black text-2xl">24/7</div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Emergency Care</div>
              </div>
            </div>
          </div>
        </div>

        {/* --- STATS SECTION (Bottom Clean Grid) --- */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 text-center sm:text-left">
            <h3 className="font-black text-slate-800 text-3xl">50k+</h3>
            <p className="text-sm text-slate-400 font-bold uppercase">Happy patients</p>
          </div>

          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 text-center sm:text-left">
            <h3 className="font-black text-slate-800 text-3xl">350+</h3>
            <p className="text-sm text-slate-400 font-bold uppercase">Specialist Doctors</p>
          </div>

          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 text-center sm:text-left">
            <h3 className="font-black text-slate-800 text-3xl">98%</h3>
            <p className="text-sm text-slate-400 font-bold uppercase">Success Rate</p>
          </div>
        </div>

      </div>
      <ExpertsSection/>
      <FeaturedSpecialists/>
    </div>
  );
};

export default Home;