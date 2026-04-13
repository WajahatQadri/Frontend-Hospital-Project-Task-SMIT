import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const UpdatePatientProfile = () => {
    const navigate = useNavigate();

    // States for User Info
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    // Lists for Dropdowns
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

    // Modal Logic
    const [showReqModal, setShowReqModal] = useState(false);
    const [reqLabel, setReqLabel] = useState("");
    const [reqName, setReqName] = useState("");

    const handleSelectChange = (e, label, setter) => {
        if (e.target.value === "REQUEST_NEW") {
            setReqLabel(label);
            setShowReqModal(true);
        } else {
            setter(e.target.value);
        }
    };

    const handleRequestSubmit = async () => {
        if (!reqName) return toast.warn("Please type a name");
        try {
            await api.post("/categories/request", { name: reqName, label: reqLabel });
            toast.info(`Request sent! Admin will review '${reqName}' soon.`);
            setShowReqModal(false);
            setReqName("");
        } catch (error) {
            toast.error("Request failed");
        }
    };

    const fetchData = async () => {
        try {
            // Fetch User, Categories, and Patient data in parallel
            const [userRes, genRes, bgRes, disRes, patientRes] = await Promise.all([
                api.get("/users/user-profile"),
                api.get("/categories/get-all/GENDER"),
                api.get("/categories/get-all/BLOOD_GROUP"),
                api.get("/categories/get-all/DISEASE_TYPE"),
                api.get("/patients/me")
            ]);
            // console.log(patientRes);

            // Set User Identity
            setName(userRes.data.user.name || "");
            setEmail(userRes.data.user.email || "");

            // Set Lists
            setGenderList(genRes.data.categories);
            setBloodGroupList(bgRes.data.categories);
            setDiseaseList(disRes.data.categories);

            // Set Patient Medical Data
            if (patientRes.data.success) {
                const p = patientRes.data.patient;
                setAge(p.age || "");
                setGender(p.gender || "");
                setBloodgroup(p.bloodgroup || "");
                setContact(p.contact || "");
                setAddress(p.address || "");
                setDisease(p.disease || "");
                setNotes(p.notes || "");
            }
        } catch (error) {
            toast.error("Failed to load profile data");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const nameEmailData = { name, email };
            const medicalData = {
                age: Number(age),
                gender,
                bloodgroup,
                contact,
                address,
                disease,
                notes
            };

            // Call both update APIs
            const { data: userUpdateRes } = await api.put("/users/update-profile", nameEmailData);
            const { data: patientUpdateRes } = await api.put("/patients/patient/update", medicalData);

            if (userUpdateRes.success && patientUpdateRes.success) {
                toast.success("Medical Profile Updated!");
                navigate("/profile");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Update failed");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4 text-black">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                <Link to="/patient-profile" className="btn btn-link text-slate-400 no-underline font-bold">← Back</Link>

                {/* Header */}
                <div className="bg-slate-800 p-6 text-center">
                    <h1 className="text-2xl font-black text-white uppercase tracking-tight italic">Update Medical Record</h1>
                    <p className="text-slate-400 text-sm font-bold">Manage your identity and health information</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8">

                    {/* SECTION 1: Identity */}
                    <div className="space-y-4">
                        <h2 className="text-md font-bold text-slate-700 border-b border-slate-100 pb-2 uppercase tracking-wide">Identity Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="form-control">
                                <label className="label text-[11px] font-bold text-slate-400 uppercase">Patient Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="block w-full rounded-md bg-white border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-slate-800 outline-none font-bold"
                                />
                            </div>
                            <div className="form-control">
                                <label className="label text-[11px] font-bold text-slate-400 uppercase">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="block w-full rounded-md bg-white border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-slate-800 outline-none font-bold"
                                />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: Medical Details */}
                    <div className="space-y-4 pt-2">
                        <h2 className="text-md font-bold text-slate-700 border-b border-slate-100 pb-2 uppercase tracking-wide">Medical Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <div className="form-control">
                                <label className="label text-[11px] font-bold text-slate-400 uppercase">Age</label>
                                <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required className="block w-full rounded-md bg-white border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-slate-800 outline-none" />
                            </div>

                            <div className="form-control">
                                <label className="label text-[11px] font-bold text-slate-400 uppercase">Gender</label>
                                <select value={gender} onChange={(e) => setGender(e.target.value)} required className="block w-full rounded-md bg-white border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-slate-800 outline-none">
                                    <option value="">Select Gender</option>
                                    {genderList.map(g => <option key={g._id} value={g.name}>{g.name}</option>)}
                                </select>
                            </div>

                            <div className="form-control">
                                <label className="label text-[11px] font-bold text-slate-400 uppercase">Blood Group</label>
                                <select value={bloodgroup} onChange={(e) => handleSelectChange(e, "BLOOD_GROUP", setBloodgroup)} required className="block w-full rounded-md bg-white border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-slate-800 outline-none">
                                    <option value="">Select Blood Group</option>
                                    {bloodGroupList.map(bg => <option key={bg._id} value={bg.name}>{bg.name}</option>)}
                                    <option value="REQUEST_NEW" className="text-blue-600 font-bold">+ Request New</option>
                                </select>
                            </div>

                            <div className="form-control">
                                <label className="label text-[11px] font-bold text-slate-400 uppercase">Contact Number</label>
                                <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} required className="block w-full rounded-md bg-white border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-slate-800 outline-none" />
                            </div>

                            <div className="form-control md:col-span-2">
                                <label className="label text-[11px] font-bold text-slate-400 uppercase">Primary Health Category</label>
                                <select value={disease} onChange={(e) => handleSelectChange(e, "DISEASE_TYPE", setDisease)} required className="block w-full rounded-md bg-white border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-slate-800 outline-none">
                                    <option value="">Select Category</option>
                                    {diseaseList.map(d => <option key={d._id} value={d.name}>{d.name}</option>)}
                                    <option value="REQUEST_NEW" className="text-blue-600 font-bold">+ Request New</option>
                                </select>
                            </div>

                            <div className="form-control md:col-span-2">
                                <label className="label text-[11px] font-bold text-slate-400 uppercase">Home Address</label>
                                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="block w-full rounded-md bg-white border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-slate-800 outline-none" />
                            </div>

                            <div className="form-control md:col-span-2">
                                <label className="label text-[11px] font-bold text-slate-400 uppercase">Symptoms / Medical Notes</label>
                                <textarea rows="3" value={notes} onChange={(e) => setNotes(e.target.value)} required className="block w-full rounded-md bg-white border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-slate-800 outline-none"></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6">
                        <button type="submit" className="w-full bg-slate-800 text-white font-black py-4 rounded-xl hover:bg-slate-900 transition-all shadow-lg uppercase tracking-widest cursor-pointer">
                            Update Everything
                        </button>
                    </div>

                </form>
            </div>

            {/* --- REQUEST MODAL --- */}
            {showReqModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white p-8 rounded-[2.5rem] max-w-sm w-full shadow-2xl text-black">
                        <h3 className="text-xl font-black text-slate-800 uppercase italic">Request {reqLabel.replace("_", " ")}</h3>
                        <p className="text-[10px] font-bold text-slate-400 mb-6 uppercase tracking-widest mt-2">Submit to admin for approval</p>

                        <input
                            type="text"
                            className="w-full h-14 rounded-2xl font-bold mb-6 bg-white border-2 border-slate-200 px-4 focus:ring-2 focus:ring-slate-800 outline-none"
                            placeholder={`Type here...`}
                            value={reqName}
                            onChange={(e) => setReqName(e.target.value)}
                        />

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

export default UpdatePatientProfile;