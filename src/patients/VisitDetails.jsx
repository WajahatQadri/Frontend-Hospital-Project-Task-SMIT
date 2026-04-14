import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useReactToPrint } from 'react-to-print';

const VisitDetails = () => {
    const { patientId, visitIndex } = useParams(); // visitIndex here is actually the timestamp we passed
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const componentRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const { data } = await api.get("/patients/me");
                setPatient(data.patient);
                console.log(data);
                
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchPatient();
    }, []);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `Prescription_${patient?.user?.name}`,
    });

    if (loading) return <div className="h-screen flex items-center justify-center bg-slate-900 text-white">Loading...</div>;

    // --- LOGIC: FIND DATA FOR THIS SPECIFIC DAY ---
    const targetDate = new Date(visitIndex).toDateString();

    // 1. Find the Diagnosis (The history entry that is NOT "APPOINTMENT BOOKED" on that day)
    const diagnosis = patient?.history?.find(h =>
        new Date(h.treatment).toDateString() === targetDate && h.disease !== "APPOINTMENT BOOKED"
    );

    // 2. Find the Medicines prescribed on that day
    const medicines = patient?.medicines?.filter(m =>
        new Date(m.createdAt).toDateString() === targetDate
    );

    const doctor = patient?.assigned_doctors?.[0];

    return (
        <div className="min-h-screen bg-slate-100 py-10 font-sans">
            <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center px-4">
                <button onClick={() => navigate(-1)} className="btn btn-ghost border-slate-300 font-bold text-black">← Back</button>
                <button onClick={handlePrint} className="btn btn-primary px-8 font-black shadow-lg text-white">PRINT PRESCRIPTION</button>
            </div>

            <div ref={componentRef} className="bg-white mx-auto shadow-2xl relative overflow-hidden text-black"
                style={{ width: '210mm', minHeight: '297mm', padding: '0' }}>

                {/* Visual Letterhead Borders */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-blue-600" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-600" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}></div>

                <div className="p-16">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-12 border-b-2 border-slate-100 pb-8">
                        <div>
                            <h1 className="text-3xl font-black text-blue-600 uppercase italic">Dr. {doctor?.user?.name || "Wajahat"}</h1>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">{doctor?.specialization || "Specialist Physician"}</p>
                            <p className="text-[10px] font-medium text-slate-400 uppercase mt-1">{doctor?.hospital} hospital</p>
                        </div>
                        <div className="">
                            <span className="text-2xl font-black text-slate-800 tracking-tighter">
                                Medi<span className="text-blue-600 italic">Link.</span>
                            </span>                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Medical Record System</p>
                        </div>
                    </div>

                    {/* Patient Details */}
                    <div className="grid grid-cols-2 gap-y-6 border-b border-slate-100 pb-8 mb-10 text-sm">
                        <div className="flex gap-2"><span className="font-bold text-slate-400 uppercase text-[10px]">Patient:</span> <span className="font-black uppercase border-b border-slate-100 flex-1">{patient?.user?.name}</span></div>
                        <div className="flex gap-2 pl-10"><span className="font-bold text-slate-400 uppercase text-[10px]">Age:</span> <span className="font-black border-b border-slate-100 flex-1">{patient?.age} Years</span></div>
                        <div className="flex gap-2"><span className="font-bold text-slate-400 uppercase text-[10px]">Date:</span> <span className="font-black border-b border-slate-100 flex-1">{targetDate}</span></div>
                        <div className="flex gap-2 pl-10"><span className="font-bold text-slate-400 uppercase text-[10px]">Blood:</span> <span className="font-black border-b border-slate-100 flex-1">{patient?.bloodgroup}</span></div>
                    </div>


                    {/* Diagnosis Area */}
                    <div className="mb-12">
                        <h3 className="text-[10px] font-black text-blue-600 uppercase mb-3 tracking-[0.2em]">Diagnosis & Observations</h3>
                        <div className="p-6 bg-slate-50 rounded-2xl border-l-4 border-blue-500">
                            <h4 className="font-black text-lg text-slate-800 uppercase mb-2">{diagnosis?.disease || "GENERAL CHECKUP"}</h4>
                            <p className="text-slate-600 italic font-medium leading-relaxed">
                                {diagnosis?.notes || "No clinical notes provided for this visit."}
                            </p>
                        </div>
                    </div>

                    {/* Medications Table */}
                    <div>
                        <h3 className="text-[10px] font-black text-blue-600 uppercase mb-4 tracking-[0.2em]">Prescribed Medication</h3>
                        <table className="table w-full">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr className="text-left text-slate-400 text-[10px] uppercase font-black">
                                    <th className="py-4 pl-4">Medicine Name</th>
                                    <th>Dosage Instruction</th>
                                </tr>
                            </thead>
                            <tbody>
                                {medicines?.length > 0 ? medicines.map((m, idx) => (
                                    <tr key={idx} className="border-b border-slate-50">
                                        <td className="py-5 pl-4">
                                            <div className="font-black text-slate-800 uppercase italic">{m.medicine?.name}</div>
                                            <div className="text-[9px] text-slate-400 font-bold uppercase">{m.medicine?.potency}</div>
                                        </td>
                                        <td className="font-bold text-blue-600">{m.dosage}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="2" className="py-10 text-center text-slate-400 italic">No medication was prescribed during this visit.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    <div className="absolute bottom-16 left-16 right-16 border-t border-slate-100 pt-8 flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        <p>Contact: {doctor?.contact}</p>
                        <p>Authorized Medical Prescription</p>
                        <p>Email: {doctor?.user?.email}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VisitDetails;