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

    // --- NEW LOGIC STATES FOR REQUESTS ---
    const [showReqModal, setShowReqModal] = useState(false);
    const [reqLabel, setReqLabel] = useState("");
    const [reqName, setReqName] = useState("");

    // Form States
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

    // --- DYNAMIC SELECT HANDLER ---
    const handleSelectChange = (e, label, setter) => {
        if (e.target.value === "REQUEST_NEW") {
            setReqLabel(label);
            setShowReqModal(true);
        } else {
            setter(prev => ({ ...prev, disease: e.target.value }));
        }
    };

    // --- REQUEST SUBMIT LOGIC ---
    const handleRequestSubmit = async () => {
        if(!reqName) return toast.warn("Please type a name");
        try {
            await api.post("/categories/request", { name: reqName, label: reqLabel });
            toast.info(`Request for ${reqName} sent to Admin.`);
            setShowReqModal(false);
            setReqName("");
        } catch (error) {
            toast.error("Request failed");
        }
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
        if (!window.confirm("Are you sure you want to discharge this patient?")) return;
        try {
            await api.delete(`/patients/delete-appointment/${myDoctorId}/${patientId}`);
            toast.success("Patient Discharged Successfully");
            navigate("/doctor-dashboard"); 
        } catch (error) {
            toast.error("Failed to discharge patient");
        }
    };

    const handleAddNewCategory = async () => {
        if (!newCategoryName.trim()) return toast.error("Enter a category name");
        try {
            await api.post("/categories/add", {
                name: newCategoryName,
                label: "DISEASE_TYPE"
            });
            toast.success("New disease category added!");
            const disRes = await api.get("/categories/get-all/DISEASE_TYPE");
            setDiseaseList(disRes.data.categories);
            setHistoryData({ ...historyData, disease: newCategoryName.toUpperCase() });
            setIsAddingNewCategory(false);
            setNewCategoryName("");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add category");
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
    if (!patient) return <div className="text-center p-20 font-bold">Patient file not found.</div>;

    return (
        <div className="bg-slate-50 min-h-screen pb-20 text-black">
            <div className="max-w-6xl mx-auto py-10 px-4">

                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 bg-white/50 p-4 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <Link to="/doctor-dashboard" className="btn btn-ghost btn-sm text-slate-500 font-black rounded-xl transition-all uppercase">DASHBOARD</Link>
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Medical Control Active</span>
                        </div>
                    </div>
                    <button onClick={handleDischarge} className="btn btn-error btn-sm px-6 text-white font-black rounded-2xl">DISCHARGE PATIENT</button>
                </div>

                {/* --- IDENTITY --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    <div className="card bg-white border border-slate-200 shadow-xl rounded-[2rem] overflow-hidden">
                        <div className="h-20 bg-slate-800"></div>
                        <div className="px-6 pb-8 flex flex-col items-center -mt-10">
                            <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg overflow-hidden bg-primary flex items-center justify-center text-white text-3xl font-black italic">{patient.user?.name?.[0]}</div>
                            <h2 className="mt-4 text-xl font-black text-slate-800 uppercase text-center">{patient.user?.name}</h2>
                        </div>
                    </div>
                    <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-6 text-black">
                        <div><p className="text-[9px] font-black text-slate-400 uppercase">Age</p><p className="font-bold text-lg">{patient.age} Yrs</p></div>
                        <div><p className="text-[9px] font-black text-slate-400 uppercase">Gender</p><p className="font-bold text-lg">{patient.gender}</p></div>
                        <div><p className="text-[9px] font-black text-slate-400 uppercase">Blood Group</p><p className="font-black text-red-600 text-lg">{patient.bloodgroup}</p></div>
                        <div><p className="text-[9px] font-black text-slate-400 uppercase">Contact</p><p className="font-bold text-lg">{patient.contact}</p></div>
                    </div>
                </div>

                {/* --- FORMS --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    <div className="bg-white p-8 rounded-[2.5rem] border-2 border-blue-50 shadow-sm space-y-6">
                        <form onSubmit={handleAddHistory} className="space-y-4">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="text-blue-600 font-black text-sm mb-3 uppercase tracking-[0.2em]">Add Visit Diagnosis</h4>
                                    <button type="button" onClick={() => setIsAddingNewCategory(!isAddingNewCategory)} className="text-sm mb-3 font-bold text-primary hover:underline uppercase cursor-pointer">{isAddingNewCategory ? "Back to List" : "+ Add Directly"}</button>
                                </div>
                                {isAddingNewCategory ? (
                                    <div className="flex gap-2">
                                        <input type="text" placeholder="New Category Name" className="input input-bordered w-full font-bold h-14 rounded-2xl bg-white border-primary" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
                                        <button type="button" onClick={handleAddNewCategory} className="btn btn-primary h-14 rounded-2xl px-6">Add</button>
                                    </div>
                                ) : (
                                    <select
                                        className="bg-white border-slate-700 input input-bordered w-full font-bold h-14 rounded-2xl"
                                        value={historyData.disease}
                                        onChange={e => handleSelectChange(e, "DISEASE_TYPE", setHistoryData)}
                                        required
                                    >
                                        <option value="">Select Diagnosis Category</option>
                                        {diseaseList.map(d => <option key={d._id} value={d.name}>{d.name}</option>)}
                                        <option value="REQUEST_NEW" className="text-primary font-bold">+ Not in list? Request New</option>
                                    </select>
                                )}
                            </div>
                            <textarea placeholder="Medical Notes" className="bg-white textarea textarea-bordered w-full font-medium rounded-2xl h-24 border-slate-700" value={historyData.notes} onChange={e => setHistoryData({ ...historyData, notes: e.target.value })} required></textarea>
                            <button className="btn btn-primary w-full h-14 rounded-2xl text-white font-black uppercase shadow-lg">Update History</button>
                        </form>
                    </div>

                    <div className="bg-slate-800 p-8 rounded-[2.5rem] shadow-2xl space-y-6 text-white">
                        <h4 className="text-blue-400 font-black text-xs uppercase tracking-[0.2em]">Quick Prescription</h4>
                        <form onSubmit={handlePrescribe} className="space-y-4">
                            <select className="bg-white select select-bordered w-full font-bold h-14 rounded-2xl text-slate-800" value={prescribeData.medicineId} onChange={e => setPrescribeData({ ...prescribeData, medicineId: e.target.value })} required>
                                <option value="">Select Medicine</option>
                                {medicines.map(m => <option key={m._id} value={m._id} disabled={m.stock <= 0}>{m.name} ({m.stock} left)</option>)}
                            </select>
                            <input type="text" placeholder="Dosage" className="input input-bordered w-full font-bold h-14 rounded-2xl text-slate-800 bg-white" value={prescribeData.dosage} onChange={e => setPrescribeData({ ...prescribeData, dosage: e.target.value })} required />
                            <button className="btn btn-success w-full h-14 rounded-2xl text-white font-black uppercase shadow-lg border-none">Issue Medication</button>
                        </form>
                    </div>
                </div>

                {/* --- HISTORY & LISTS --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200">
                        <h4 className="text-slate-800 font-black text-xs uppercase tracking-[0.2em] mb-6 border-b pb-4">Visit Logs</h4>
                        <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
                            {patient.history?.length > 0 ? patient.history.map((h, i) => (
                                <div key={i} className="border-l-4 border-blue-500 pl-4 py-1">
                                    <p className="text-[10px] font-bold text-blue-500 uppercase">{new Date(h.treatment).toLocaleDateString()}</p>
                                    <h5 className="font-black text-slate-800 italic">{h.disease}</h5>
                                    <p className="text-xs text-slate-400 mt-1">{h.notes}</p>
                                </div>
                            )) : <p className="text-slate-400 italic">No records.</p>}
                        </div>
                    </div>
                    <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm flex flex-col">
                        <div className="bg-slate-100 p-6 border-b border-slate-200"><h4 className="text-slate-800 font-black text-xs uppercase tracking-[0.2em]">Active Medicines</h4></div>
                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <thead className="bg-slate-50"><tr className="text-slate-400 text-[10px] uppercase"><th>Medicine</th><th>Dosage</th><th>Action</th></tr></thead>
                                <tbody className="text-slate-700 font-bold">
                                    {patient.medicines?.map((item, index) => (
                                        <tr key={index}><td className="text-blue-600 uppercase italic">{item.medicine?.name}</td><td><span className="badge badge-ghost text-xs">{item.dosage}</span></td><td><button onClick={() => handleUndo(item._id)} className="text-red-400 text-xs font-black uppercase">Undo</button></td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- REQUEST MODAL --- */}
            {showReqModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white p-8 rounded-[2.5rem] max-w-sm w-full shadow-2xl border-4 border-blue-50 text-black">
                        <h3 className="text-xl font-black text-slate-800 uppercase italic">Request New {reqLabel}</h3>
                        <p className="text-[10px] font-bold text-slate-400 mb-6 uppercase tracking-widest mt-2">Submit to admin for approval</p>
                        <input type="text" className="input input-bordered w-full h-14 rounded-2xl font-bold mb-6 bg-white border-2 border-slate-200 text-black" placeholder="Type name here..." onChange={(e) => setReqName(e.target.value)} />
                        <div className="flex gap-3">
                            <button onClick={() => setShowReqModal(false)} className="btn flex-1 rounded-xl font-bold">Cancel</button>
                            <button className="btn btn-primary flex-[2] text-white rounded-xl font-black uppercase" onClick={handleRequestSubmit}>Submit</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagePatientFile;