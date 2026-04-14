import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';

const ManagePatientFile = () => {
    const { patientId } = useParams();
    const navigate = useNavigate();

    const [patient, setPatient] = useState(null);
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [myDoctorId, setMyDoctorId] = useState("");
    const [diseaseList, setDiseaseList] = useState([]);
    const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");

    const [showReqModal, setShowReqModal] = useState(false);
    const [reqLabel, setReqLabel] = useState("");
    const [reqName, setReqName] = useState("");

    const [historyData, setHistoryData] = useState({ disease: "", notes: "" });
    const [prescribeData, setPrescribeData] = useState({ medicineId: "", dosage: "" });

    const loadData = async () => {
        try {
            const pRes = await api.get(`/patients/admin/all`);
            const found = pRes.data.patients.find(item => item._id === patientId);
            setPatient(found);

            const mRes = await api.get("/medicines/get-all");
            setMedicines(mRes.data.medicines);

            const disRes = await api.get("/categories/get-all/DISEASE_TYPE");
            setDiseaseList(disRes.data.categories);

            const docRes = await api.get("/doctors/doctor/my-profile");
            setMyDoctorId(docRes.data.doctor._id);
        } catch (error) {
            toast.error("Failed to load patient data");
        } finally {
            setLoading(false);
        }
    };

    // Generic handler for Disease select
    const handleDiseaseChange = (e) => {
        if (e.target.value === "REQUEST_NEW") {
            setReqLabel("DISEASE_TYPE");
            setShowReqModal(true);
        } else {
            setHistoryData(prev => ({ ...prev, disease: e.target.value }));
        }
    };

    // Specific handler for Medicine Request
    const handleMedicineChange = (e) => {
        if (e.target.value === "REQUEST_NEW") {
            setReqLabel("MEDICINE_TYPE");
            setShowReqModal(true);
        } else {
            setPrescribeData({ ...prescribeData, medicineId: e.target.value });
        }
    };

    // Specific handler for Dosage Request
    const handleDosageChange = (e) => {
        if (e.target.value === "REQUEST_NEW") {
            setReqLabel("DOSAGE_TYPE");
            setShowReqModal(true);
        } else {
            setPrescribeData({ ...prescribeData, dosage: e.target.value });
        }
    };

    const handleRequestSubmit = async () => {
        if (!reqName) return toast.warn("Please type a name");
        try {
            await api.post("/categories/request", { name: reqName, label: reqLabel });
            toast.info(`Request for ${reqName} sent.`);
            setShowReqModal(false);
            setReqName("");
        } catch (error) { toast.error("Request failed"); }
    };

    useEffect(() => { loadData(); }, [patientId]);

    const handleAddHistory = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/patients/add-history/${patientId}`, historyData);
            toast.success("Medical history updated");
            setHistoryData({ disease: "", notes: "" });
            loadData();
        } catch (error) { toast.error("Update failed"); }
    };

    const handlePrescribe = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/patients/prescribe/${patientId}`, prescribeData);
            toast.success("Medicine added to record");
            setPrescribeData({ medicineId: "", dosage: "" });
            loadData();
        } catch (error) { toast.error("Stock empty or error occurred"); }
    };

    const handleUndo = async (presId) => {
        if (!window.confirm("Remove this medicine and return to pharmacy?")) return;
        try {
            await api.put(`/patients/undo-prescribe/${patientId}/${presId}`);
            toast.warn("Prescription removed");
            loadData();
        } catch (error) { toast.error("Error"); }
    };

    const handleDischarge = async () => {
        if (!window.confirm("Discharge this patient?")) return;
        try {
            await api.delete(`/patients/delete-appointment/${myDoctorId}/${patientId}`);
            toast.success("Patient Discharged");
            navigate("/doctor-dashboard");
        } catch (error) { toast.error("Discharge failed"); }
    };

    const handleAddNewCategory = async () => {
        if (!newCategoryName.trim()) return toast.error("Enter a name");
        try {
            await api.post("/categories/add", { name: newCategoryName, label: "DISEASE_TYPE" });
            toast.success("Disease added!");
            const disRes = await api.get("/categories/get-all/DISEASE_TYPE");
            setDiseaseList(disRes.data.categories);
            setHistoryData({ ...historyData, disease: newCategoryName });
            setIsAddingNewCategory(false);
            setNewCategoryName("");
        } catch (error) { toast.error("Failed to add category"); }
    };

    if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50"><span className="loading loading-spinner loading-lg text-indigo-600"></span></div>;

    return (
        <div className="bg-[#f8fafc] min-h-screen pb-20 text-slate-900 font-sans">
            <div className="max-w-7xl mx-auto py-8 px-4">
                
                {/* --- TOP NAV --- */}
                <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-4">
                        <Link to="/doctor-dashboard" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </Link>
                        <div>
                            <h1 className="text-xl font-black tracking-tight text-slate-800">PATIENT FILE: <span className="text-indigo-600 uppercase">#{patient._id.slice(-6)}</span></h1>
                            <div className="flex items-center gap-2 mt-0.5">
                                <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Case File</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={handleDischarge} className="btn bg-rose-50 border-rose-100 text-rose-600 hover:bg-rose-600 hover:text-white btn-sm px-6 rounded-xl font-black transition-all">
                        DISCHARGE PATIENT
                    </button>
                </div>

                {/* --- PATIENT PROFILE HERO --- */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                    <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-black shadow-lg mb-4">
                            {patient.user?.name?.[0]}
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight leading-none">{patient.user?.name}</h2>
                        <p className="text-sm font-medium text-slate-400 mt-2">{patient.user?.email}</p>
                        <div className="mt-4 px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                            Patient Record
                        </div>
                    </div>

                    <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: "Age", value: `${patient.age} Yrs`, color: "blue" },
                            { label: "Gender", value: patient.gender, color: "purple" },
                            { label: "Blood Group", value: patient.bloodgroup, color: "red" },
                            { label: "Contact", value: patient.contact, color: "slate" }
                        ].map((stat, i) => (
                            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-indigo-200 transition-all group">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 group-hover:text-indigo-500">{stat.label}</p>
                                <p className={`text-2xl font-black ${stat.color === 'red' ? 'text-rose-600' : 'text-slate-800'}`}>{stat.value}</p>
                            </div>
                        ))}
                        <div className="col-span-2 md:col-span-4 bg-slate-50 shadow-xl p-4 rounded-2xl border border-indigo-100">
                             <p className="text-[10px] font-black text-indigo-400 uppercase mb-1">Registered Address</p>
                             <p className="text-sm font-bold text-indigo-900">{patient.address || "Address not provided in profile."}</p>
                        </div>
                    </div>
                </div>

                {/* --- MAIN ACTION AREA --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-black text-slate-800 uppercase tracking-tight text-lg italic">Clinical Update</h3>
                            <button type="button" onClick={() => setIsAddingNewCategory(!isAddingNewCategory)} className="cursor-pointer text-[10px] font-black text-indigo-600 hover:underline uppercase">
                                {isAddingNewCategory ? "View List" : "+ New Category"}
                            </button>
                        </div>
                        <form onSubmit={handleAddHistory} className="space-y-5">
                            {isAddingNewCategory ? (
                                <div className="flex gap-2">
                                    <input type="text" placeholder="Category Name..." className="input input-bordered flex-1 rounded-2xl font-bold bg-slate-50 border-indigo-100" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
                                    <button type="button" onClick={handleAddNewCategory} className="btn btn-primary rounded-2xl px-6">Add</button>
                                </div>
                            ) : (
                                <select className="cursor-pointer select select-bordered w-full rounded-2xl font-bold bg-slate-50 border-slate-200" value={historyData.disease} onChange={handleDiseaseChange} required>
                                    <option value="">Select Diagnosis</option>
                                    {diseaseList.map(d => <option key={d._id} value={d.name}>{d.name}</option>)}
                                    <option value="REQUEST_NEW" className="text-indigo-600 font-black">+ Request from Admin</option>
                                </select>
                            )}
                            <textarea placeholder="Write clinical notes..." className="textarea textarea-bordered w-full rounded-2xl font-medium bg-slate-50 min-h-[120px]" value={historyData.notes} onChange={e => setHistoryData({ ...historyData, notes: e.target.value })} required></textarea>
                            <button className="btn btn-primary w-full h-14 rounded-2xl text-white font-black uppercase tracking-widest shadow-lg shadow-indigo-100">Update Medical History</button>
                        </form>
                    </div>

                    <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-emerald-500/20 rounded-xl">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                            </div>
                            <h3 className="font-black text-white uppercase tracking-tight text-lg italic">Pharmacy Control</h3>
                        </div>
                        <form onSubmit={handlePrescribe} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Select Medication</label>
                                <select className="cursor-pointer select select-bordered w-full rounded-2xl font-bold bg-slate-800 border-slate-700 text-white" value={prescribeData.medicineId} onChange={handleMedicineChange} required>
                                    <option value="">Search Inventory...</option>
                                    {medicines.map(m => (
                                        <option key={m._id} value={m._id} disabled={m.stock <= 0} className={m.stock < 5 ? 'text-amber-400' : ''}>
                                            {m.name} {m.stock < 5 ? `(Low: ${m.stock})` : `(${m.stock} left)`}
                                        </option>
                                    ))}
                                    <option value="REQUEST_NEW" className="text-indigo-400 font-black">+ Request New Medicine</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Dosage</label>
                                <select className="cursor-pointer select select-bordered w-full rounded-2xl font-bold bg-slate-800 border-slate-700 text-white" value={prescribeData.dosage} onChange={handleDosageChange} required>
                                    <option value="">Select Potency/Frequency</option>
                                    {medicines.map(m => <option key={m.potency} value={m.potency}>{m.potency}</option>)}
                                    <option value="REQUEST_NEW" className="text-indigo-400 font-black">+ Request New Dosage</option>
                                </select>
                            </div>
                            <button className="btn btn-success w-full h-14 rounded-2xl text-white font-black uppercase tracking-widest shadow-xl shadow-emerald-900/20 border-none mt-4">Issue Medication</button>
                        </form>
                    </div>
                </div>

                {/* --- FOOTER CONTENT --- */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-3 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                        <h4 className="text-slate-800 font-black text-xs uppercase tracking-[0.2em] mb-8 border-b border-slate-50 pb-4 flex items-center gap-2">
                             Visit History Timeline
                             <span className="badge badge-ghost font-bold">{patient.history?.length || 0}</span>
                        </h4>
                        <div className="space-y-8 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                            {patient.history?.length > 0 ? [...patient.history].reverse().map((h, i) => (
                                <div key={i} className="relative pl-8 border-l-2 border-slate-100 pb-2">
                                    <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-white border-4 border-indigo-500"></div>
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-1">
                                        <h5 className="font-black text-slate-800 text-lg leading-none uppercase italic">{h.disease}</h5>
                                        <p className="text-[10px] font-black text-slate-400 uppercase bg-slate-50 px-3 py-1 rounded-full">
                                            {new Date(h.treatment).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <p className="text-sm font-medium text-slate-500 leading-relaxed bg-slate-50/50 p-4 rounded-2xl mt-2 border border-slate-50">{h.notes}</p>
                                </div>
                            )) : (
                                <div className="text-center py-10">
                                    <p className="text-slate-400 font-bold italic">No visit history found.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
                            <div className="bg-slate-50 p-6 border-b border-slate-100">
                                <h4 className="text-slate-800 font-black text-xs uppercase tracking-[0.2em]">Issued Prescriptions</h4>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="table w-full">
                                    <thead>
                                        <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black">
                                            <th className="py-4">Medication</th>
                                            <th>Dosage</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-slate-700">
                                        {patient.medicines?.map((item, index) => (
                                            <tr key={index} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                                <td className="py-4">
                                                    <div className="font-black text-indigo-600 uppercase italic text-xs">{item.medicine?.name}</div>
                                                </td>
                                                <td><span className="badge bg-slate-100 border-none text-slate-600 font-bold text-[10px] px-3">{item.dosage}</span></td>
                                                <td>
                                                    <button onClick={() => handleUndo(item._id)} className="p-2 hover:bg-rose-50 text-rose-400 hover:text-rose-600 rounded-lg transition-all">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- REQUEST MODAL --- */}
            {showReqModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white p-8 rounded-[2.5rem] max-w-sm w-full shadow-2xl border border-slate-100">
                        <h3 className="text-xl font-black text-slate-800 uppercase italic">Request: {reqLabel.replace("_", " ")}</h3>
                        <p className="text-[10px] font-black text-slate-400 mb-6 uppercase tracking-widest mt-2">The Admin will review this entry.</p>
                        <input type="text" className="w-full h-14 rounded-2xl font-bold mb-6 bg-slate-50 border-2 border-slate-200 px-4 focus:border-indigo-500 outline-none" placeholder={`Type ${reqLabel.toLowerCase().replace("_", " ")} name...`} value={reqName} onChange={(e) => setReqName(e.target.value)} />
                        <div className="flex gap-3">
                            <button onClick={() => setShowReqModal(false)} className="flex-1 py-4 rounded-2xl font-black text-slate-500 hover:bg-slate-50 transition-colors uppercase text-xs">Cancel</button>
                            <button className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase shadow-lg shadow-indigo-200 text-xs" onClick={handleRequestSubmit}>Send Request</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagePatientFile;