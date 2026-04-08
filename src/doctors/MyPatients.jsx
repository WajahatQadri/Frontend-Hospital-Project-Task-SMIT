import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';

const MyPatients = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyPatients = async () => {
        try {
            // 1. Get Doctor's own profile to get their ID
            const docProfile = await api.get("/doctors/doctor/my-profile");
            const doctorId = docProfile.data.doctor._id;

            // 2. Get All Patients and filter those assigned to this doctor
            const { data } = await api.get("/patients/admin/all");
            const filtered = data.patients.filter(p => 
                p.assigned_doctors.some(docId => docId === doctorId)
            );
            setPatients(filtered);
        } catch (error) {
            toast.error("Failed to load patients");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchMyPatients(); }, []);

    if (loading) return <span className="loading loading-spinner text-primary"></span>;

    return (
        <div className="p-4">
            <h2 className="text-3xl font-black text-slate-800 uppercase italic mb-8">My Assigned Patients</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {patients.map(p => (
                    <div key={p._id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl flex justify-between items-center">
                        <div>
                            <h3 className="font-black text-slate-800 uppercase">Patient: {p.user?.name}</h3>
                            <p className="text-xs font-bold text-red-500 uppercase">{p.disease}</p>
                            <p className="text-[10px] text-slate-400 mt-1">{p.gender} | {p.age} Years</p>
                        </div>
                        <Link to={`/doctor-dashboard/manage-patient/${p._id}`} className="btn btn-primary btn-sm rounded-xl text-white">Manage File</Link>
                    </div>
                ))}
            </div>
            {patients.length === 0 && <p className="text-center py-20 text-slate-400 italic">No patients assigned to you yet.</p>}
        </div>
    );
};

export default MyPatients;