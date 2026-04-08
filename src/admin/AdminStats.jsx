import React, { useEffect, useState } from 'react'
import api from '../utils/api';

const AdminStats = () => {
    const [users, setUsers] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [medicines, setMedicines] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    const getDetails = async () => {
        try {
            // Fetching data based on your specific models
            const [uRes, mRes, pRes, dRes] = await Promise.all([
                api.get("/users/admin/get-all-users"),
                api.get("/medicines/get-all"),
                api.get("/patients/admin/all"),
                api.get("/doctors/get-all-doctors") // Assuming this endpoint exists to get doctor list
            ]);

            setUsers(uRes.data.users || []);
            setMedicines(mRes.data.medicines || []); 
            setPatients(pRes.data.patients || []);
            setDoctors(dRes.data.doctors || []);

        } catch (error) {
            console.error("Error fetching admin stats:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getDetails();
    }, [])

    const maxVal = React.useMemo(() => {
        const currentMax = Math.max(
            doctors.length || 0, 
            medicines.length || 0, 
            patients.length || 0
        );
        const initialBaseline = 50;

        if (currentMax <= initialBaseline * 0.8) return initialBaseline;

        let dynamicBaseline = initialBaseline;
        while (currentMax > dynamicBaseline * 0.8) {
            dynamicBaseline += initialBaseline * 0.5;
        }
        return dynamicBaseline;
    }, [doctors, medicines, patients]);

    if (loading) return <div className="p-10 text-center"><span className="loading loading-spinner loading-lg text-primary"></span></div>;

    return (
        <div className="flex flex-col gap-6 w-full animate-in fade-in duration-700">
            
            {/* 1. TOP STATS CARDS - Healthcare Styled */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Total Doctors</p>
                    <h2 className="text-4xl font-black text-indigo-600 mt-1 italic">{doctors.length}</h2>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Total Patients</p>
                    <h2 className="text-4xl font-black text-emerald-500 mt-1 italic">{patients.length}</h2>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Pharmacy Stock</p>
                    <h2 className="text-4xl font-black text-rose-500 mt-1 italic">{medicines.length}</h2>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">System Users</p>
                    <h2 className="text-4xl font-black text-slate-400 mt-1 italic">{users.length}</h2>
                </div>
            </div>

            {/* 2. MEDICAL GROWTH CHART */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h3 className="text-xl font-black text-slate-800 uppercase italic">Hospital Growth</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Platform capacity: {maxVal} active records</p>
                    </div>
                    <div className="hidden sm:flex gap-6">
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-tighter">
                            <span className="w-3 h-3 bg-indigo-600 rounded-full"></span> Doctors
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-tighter">
                            <span className="w-3 h-3 bg-emerald-500 rounded-full"></span> Patients
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-tighter">
                            <span className="w-3 h-3 bg-rose-500 rounded-full"></span> Medicines
                        </div>
                    </div>
                </div>

                <div className="flex gap-6 h-72">
                    {/* Y-Axis */}
                    <div className="flex flex-col justify-between h-full py-1 text-[10px] font-black text-gray-300 text-right w-8">
                        <span>{maxVal}</span>
                        <span>{Math.round(maxVal * 0.5)}</span>
                        <span>0</span>
                    </div>

                    {/* Chart Area */}
                    <div className="relative flex-1 h-full border-b-2 border-slate-100">
                        {/* Grid Lines */}
                        <div className="absolute inset-0 pointer-events-none">
                            {[0, 25, 50, 75].map((pos) => (
                                <div key={pos} className="absolute w-full border-t border-slate-50" style={{ top: `${pos}%` }}></div>
                            ))}
                        </div>

                        <div className="relative h-full flex items-end justify-around px-10 gap-8">
                            {/* Doctors Bar */}
                            <BarItem label="Doctors" value={doctors.length} max={maxVal} color="from-indigo-600 to-indigo-400" />
                            {/* Patients Bar */}
                            <BarItem label="Patients" value={patients.length} max={maxVal} color="from-emerald-600 to-emerald-400" />
                            {/* Medicines Bar */}
                            <BarItem label="Medicines" value={medicines.length} max={maxVal} color="from-rose-600 to-rose-400" />
                        </div>
                    </div>
                </div>
            </div>

            
        </div>
    );
}

// Sub-component for cleaner Bar rendering
const BarItem = ({ label, value, max, color }) => (
    <div 
        className="w-full max-w-[80px] group relative flex flex-col justify-end transition-all duration-1000 ease-out"
        style={{ height: `${(value / max) * 100}%` }}
    >
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-all bg-slate-900 text-white text-[10px] font-black px-3 py-1 rounded-lg shadow-xl whitespace-nowrap z-20">
            {label}: {value}
        </div>
        <div className={`w-full h-full bg-gradient-to-t ${color} rounded-t-2xl shadow-lg transition-transform hover:scale-x-105 cursor-pointer`}></div>
    </div>
);

export default AdminStats;