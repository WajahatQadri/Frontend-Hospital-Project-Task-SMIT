import { useParams } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

const PatientsConnectedWithDoctor = () => {
    const { id } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatientsConnectedWithDoctor = async () => {
            try {
                const { data } = await api.get(`/doctors/admin/doctor/${id}`);
                console.log(data);
                
                if (data.success) {
                    setDoctor(data.doctor);
                }
            } catch (error) {
                toast.error(`Failed to fetch Patients connected with this ${id}`);
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchPatientsConnectedWithDoctor();
    }, [id]);

    if (loading) return <div className="text-center py-20 font-bold">Loading...</div>;
    if (!doctor) return <div className="text-center py-20">Patients not found.</div>;
  return (
    <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-50 to-white p-5 sm:p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-black text-xl sm:text-2xl uppercase tracking-tighter italic text-slate-800">
            Dr.{doctor?.user.name}'s Assigned Patients
          </h3>
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 mt-1">Hospital Management System</p>
        </div>
        <div className="badge badge-primary badge-lg font-black italic px-5 py-4 shadow-lg shadow-primary/20">
          {doctor?.patients?.length || 0} Total
        </div>
      </div>
    
      <div className="overflow-x-auto">
        <table className="table w-full border-separate border-spacing-y-2 px-4 sm:px-6">
          {/* Table Head - Hidden on Mobile */}
          <thead className="hidden sm:table-header-group">
            <tr className="text-slate-400 uppercase text-[11px] tracking-[0.15em] border-none">
              <th className="bg-transparent pb-4">Patient Identity</th>
              <th className="bg-transparent pb-4">Demographics</th>
              <th className="bg-transparent pb-4">Diagnosis</th>
              <th className="bg-transparent pb-4 text-right">Operations</th>
            </tr>
          </thead>
    
          <tbody className="text-slate-700">
            {doctor?.patients?.map((patient) => (
              <tr key={patient._id} className="group transition-all duration-300">
                {/* Name Column */}
                <td className="bg-slate-50/50 group-hover:bg-blue-50/50 rounded-l-2xl border-y border-l border-slate-50 group-hover:border-blue-100 py-4">
                  <div className="flex flex-col">
                    <span className="text-blue-600 uppercase font-black tracking-tight text-sm">
                      {doctor?.patients?.[0]?.user?.name || "Loading..."}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold lowercase opacity-70 group-hover:text-blue-400">
                      {doctor?.patients?.[0]?.user?.email}
                    </span>
                  </div>
                </td>
    
                {/* Age/Gender */}
                <td className="bg-slate-50/50 group-hover:bg-blue-50/50 border-y border-slate-50 group-hover:border-blue-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black px-2 py-1 bg-white rounded-md shadow-sm">{doctor?.patients?.[0]?.age}Y</span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 italic">{doctor?.patients?.[0]?.gender}</span>
                  </div>
                </td>
    
                {/* Disease Badge */}
                <td className="bg-slate-50/50 group-hover:bg-blue-50/50 border-y border-slate-50 group-hover:border-blue-100">
                  <span className="px-3 py-1 rounded-full bg-red-50 text-red-500 text-[10px] font-black uppercase tracking-wider border border-red-100">
                    {doctor?.patients?.[0]?.disease}
                  </span>
                </td>
    
                {/* Action Button */}
                <td className="bg-slate-50/50 group-hover:bg-blue-50/50 rounded-r-2xl border-y border-r border-slate-50 group-hover:border-blue-100 text-right">
                  <Link 
                    to={`/admin-dashboard/patient-details/${doctor?.patients?.[0]?._id}`} 
                    className="btn btn-primary btn-sm rounded-xl text-white font-black uppercase tracking-tighter italic border-none shadow-md shadow-primary/30 hover:scale-105 transition-transform"
                  >
                    See Profile
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    
      {/* Empty State */}
      {(!doctor?.patients || doctor?.patients.length === 0) && (
        <div className="text-center py-24">
          <div className="inline-block p-6 rounded-full bg-slate-50 mb-4">🩺</div>
          <p className="text-slate-400 font-bold italic uppercase tracking-widest text-xs">
            No patients currently assigned.
          </p>
        </div>
      )}
    </div>
  )
}

export default PatientsConnectedWithDoctor
