import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const RegisterPatient = () => {
    const navigate = useNavigate();

    // States for User Info & Lists
    const [userData, setUserData] = useState({ name: "", email: "" });
    const [genderList, setGenderList] = useState([]);
    const [bloodGroupList, setBloodGroupList] = useState([]);
    const [diseaseList, setDiseaseList] = useState([]);

    // Form States
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [bloodgroup, setBloodgroup] = useState("");
    const [contact, setContact] = useState("");
    const [address, setAddress] = useState("");
    const [disease, setDisease] = useState("");
    const [notes, setNotes] = useState("");

    // --- NEW LOGIC STATES ---
    const [showReqModal, setShowReqModal] = useState(false);
    const [reqLabel, setReqLabel] = useState("");
    const [reqName, setReqName] = useState("");

    // --- DYNAMIC SELECT HANDLER ---
    const handleSelectChange = (e, label, setter) => {
        if (e.target.value === "REQUEST_NEW") {
            setReqLabel(label);
            setShowReqModal(true);
        } else {
            setter(e.target.value);
        }
    };

    // --- REQUEST SUBMIT LOGIC ---
    const handleRequestSubmit = async () => {
        if (!reqName) return toast.warn("Please type a name");
        try {
            await api.post("/categories/request", { name: reqName, label: reqLabel });
            toast.info(`Request for ${reqName} sent. Please wait & keep checking your profile; Admin will update you soon.`);
            setShowReqModal(false);
            setReqName("");
        } catch (error) {
            toast.error("Request failed");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRes = await api.get("/users/user-profile");
                setUserData({ name: userRes.data.user.name, email: userRes.data.user.email });
            } catch (error) {
                navigate("/login");
                return;
            }

            try {
                const genRes = await api.get("/categories/get-all/GENDER");
                setGenderList(genRes.data.categories);

                const bgRes = await api.get("/categories/get-all/BLOOD_GROUP");
                setBloodGroupList(bgRes.data.categories);

                const disRes = await api.get("/categories/get-all/DISEASE_TYPE");
                setDiseaseList(disRes.data.categories);
            } catch (error) {
                toast.error("Error loading medical lists");
            }
        };
        fetchData();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = {
                age: Number(age),
                gender,
                bloodgroup,
                contact,
                address,
                disease,
                notes
            };

            const { data } = await api.post("/patients/register", formData);

            if (data.success) {
                toast.success("Medical Profile Created Successfully!");
                navigate("/profile");
                window.location.reload();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden text-black">
                <Link to="/profile" className="btn btn-link text-slate-400 no-underline font-bold">← Back</Link>

                {/* Header */}
                <div className="bg-blue-600 p-6 text-center">
                    <h1 className="text-2xl font-black text-white uppercase tracking-tight">Patient Medical Registration</h1>
                    <p className="text-blue-100 text-sm">Complete your profile to access medical services</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8">

                    {/* SECTION 1: Identity (Read Only) */}
                    <div className="space-y-4">
                        <h2 className="text-md font-bold text-slate-700 border-b border-slate-100 pb-2">Account Identity</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="form-control">
                                <label className="label text-[11px] font-bold text-slate-400 uppercase">Patient Name</label>
                                <input type="text" value={userData.name} readOnly className="block w-full rounded-md bg-slate-100 border border-gray-200 px-3 py-2 text-slate-500 cursor-not-allowed" />
                            </div>
                            <div className="form-control">
                                <label className="label text-[11px] font-bold text-slate-400 uppercase">Email Address</label>
                                <input type="email" value={userData.email} readOnly className="block w-full rounded-md bg-slate-100 border border-gray-200 px-3 py-2 text-slate-500 cursor-not-allowed" />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: Medical Details */}
                    <div className="space-y-4 pt-2">
                        <h2 className="text-md font-bold text-slate-700 border-b border-slate-100 pb-2">Medical Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <div className="form-control">
                                <label className="label text-[11px] font-bold text-slate-400 uppercase">Age</label>
                                <input type="number" placeholder="Enter age" value={age} onChange={(e) => setAge(e.target.value)} required className="block w-full rounded-md bg-white border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-600 outline-none" />
                            </div>

                            <div className="form-control">
                                <label className="label text-[11px] font-bold text-slate-400 uppercase">Gender</label>
                                <select value={gender} onChange={(e) => setGender(e.target.value)} required className="block w-full rounded-md bg-white border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-600 outline-none">
                                    <option value="">Select Gender</option>
                                    {genderList.map(g => <option key={g._id} value={g.name}>{g.name}</option>)}
                                </select>
                            </div>

                            <div className="form-control">
                                <label className="label text-[11px] font-bold text-slate-400 uppercase">Blood Group</label>
                                <select value={bloodgroup} onChange={(e) => handleSelectChange(e, "BLOOD_GROUP", setBloodgroup)} required className="block w-full rounded-md bg-white border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-600 outline-none">
                                    <option value="">Select Blood Group</option>
                                    {bloodGroupList.map(bg => <option key={bg._id} value={bg.name}>{bg.name}</option>)}
                                    <option value="REQUEST_NEW" className="text-blue-600 font-bold">+ Not in list? Request New</option>
                                </select>
                            </div>

                            <div className="form-control">
                                <label className="label text-[11px] font-bold text-slate-400 uppercase">Contact Number</label>
                                <input type="text" placeholder="e.g. 03XXXXXXXXX" value={contact} onChange={(e) => setContact(e.target.value)} required className="block w-full rounded-md bg-white border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-600 outline-none" />
                            </div>

                            <div className="form-control md:col-span-2">
                                <label className="label text-[11px] font-bold text-slate-400 uppercase">Primary Health Category</label>
                                <select value={disease} onChange={(e) => handleSelectChange(e, "DISEASE_TYPE", setDisease)} required className="block w-full rounded-md bg-white border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-600 outline-none">
                                    <option value="">Select Category (e.g. Fever, Infection)</option>
                                    {diseaseList.map(d => <option key={d._id} value={d.name}>{d.name}</option>)}
                                    <option value="REQUEST_NEW" className="text-blue-600 font-bold">+ Not in list? Request New</option>
                                </select>
                            </div>

                            <div className="form-control md:col-span-2">
                                <label className="label text-[11px] font-bold text-slate-400 uppercase">Home Address</label>
                                <input type="text" placeholder="Full residential address" value={address} onChange={(e) => setAddress(e.target.value)} className="block w-full rounded-md bg-white border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-600 outline-none" />
                            </div>

                            <div className="form-control md:col-span-2">
                                <label className="label text-[11px] font-bold text-slate-400 uppercase">Current Symptoms / Notes</label>
                                <textarea rows="3" placeholder="Describe your issue in detail..." value={notes} onChange={(e) => setNotes(e.target.value)} required className="block w-full rounded-md bg-white border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-600 outline-none"></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6">
                        <button type="submit" className="cursor-pointer w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100">
                            Register Medical Profile
                        </button>
                    </div>

                </form>
            </div>

            {/* --- NEW REQUEST MODAL --- */}
            {showReqModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white p-8 rounded-[2.5rem] max-w-sm w-full shadow-2xl border-4 border-blue-50 text-black">
                        <h3 className="text-xl font-black text-slate-800 uppercase italic">Request New {reqLabel}</h3>
                        <p className="text-[10px] font-bold text-slate-400 mb-6 uppercase tracking-widest leading-tight">Your request will be sent to Admin for approval.</p>

                        <input
                            type="text"
                            className="input input-bordered w-full h-14 rounded-2xl font-bold mb-6 bg-white border-2 border-slate-200"
                            placeholder={`Type missing ${reqLabel.toLowerCase()} here...`}
                            onChange={(e) => setReqName(e.target.value)}
                        />

                        <div className="flex gap-3">
                            <button onClick={() => setShowReqModal(false)} className="btn flex-1 rounded-xl font-bold">Cancel</button>
                            <button
                                className="btn btn-primary flex-[2] text-white rounded-xl font-black uppercase"
                                onClick={handleRequestSubmit}
                            >
                                Send Request
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RegisterPatient;