import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const UpdateDoctorProfile = () => {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [specialization, setSpecialization] = useState("");
    const [hospital, setHospital] = useState("");
    const [contact, setContact] = useState("");
    const [fees, setFees] = useState("");
    const [address, setAddress] = useState("");
    const [experience, setExperience] = useState("");
    const [selectedTimings, setSelectedTimings] = useState([]);
    const [selectedDays, setSelectedDays] = useState([]);
    const [specializationList, setSpecializationList] = useState([]);

    const [showReqModal, setShowReqModal] = useState(false);
    const [reqLabel, setReqLabel] = useState("");
    const [reqName, setReqName] = useState("");

    const daysOptions = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const timeOptions = ["08:00 AM - 10:00 AM", "10:00 AM - 12:00 PM", "12:00 PM - 02:00 PM", "02:00 PM - 04:00 PM", "04:00 PM - 06:00 PM", "06:00 PM - 08:00 PM", "08:00 PM - 10:00 PM", "10:00 PM - 12:00 AM"];

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
            toast.info(`Request for ${reqName} sent.`);
            setShowReqModal(false);
            setReqName("");
        } catch (error) {
            toast.error("Request failed");
        }
    };

    const fetchDoctorData = async () => {
        try {
            // Fetch categories and profile in parallel for speed
            const [catRes, userRes, docRes] = await Promise.all([
                api.get("/categories/get-all/SPECIALIZATION"),
                api.get("/users/user-profile"),
                api.get("/doctors/doctor/my-profile")
            ]);

            setSpecializationList(catRes.data.categories);

            if (userRes.data.success) {
                setName(userRes.data.user.name || "");
                setEmail(userRes.data.user.email || "");
            }

            if (docRes.data.success) {
                const d = docRes.data.doctor;
                setSpecialization(d.specialization || "");
                setHospital(d.hospital || "");
                setContact(d.contact || "");
                setFees(d.fees || "");
                setExperience(d.experience || "");
                setAddress(d.address || "");
                setSelectedDays(d.days || []);
                setSelectedTimings(d.timing || []);
            }
        } catch (error) {
            toast.error("Error loading profile data");
        }
    };

    useEffect(() => { fetchDoctorData(); }, []);

    const handleToggle = (item, currentList, setList) => {
        if (currentList.some(i => i.toLowerCase() === item.toLowerCase())) {
            setList(currentList.filter(i => i.toLowerCase() !== item.toLowerCase()));
        } else {
            setList([...currentList, item]);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (selectedDays.length === 0 || selectedTimings.length === 0) {
            return toast.warn("Please select at least one day and one time slot");
        }

        try {
            const nameEmailData = { name, email };
            const doctorData = {
                specialization, hospital, contact,
                fees: Number(fees),
                experience,
                address,
                days: selectedDays,
                timing: selectedTimings
            };

            // FIX: Correct destructuring for two separate API calls
            const { data: userUpdateRes } = await api.put("/users/update-profile", nameEmailData);
            const { data: doctorUpdateRes } = await api.put("/doctors/doctor/update", doctorData);

            if (userUpdateRes.success && doctorUpdateRes.success) {
                toast.success("Profile Updated!");
                navigate("/profile");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Update failed");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 text-black">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                <Link to="/doctor-dashboard" className="btn btn-link text-slate-400 no-underline font-bold">← Back</Link>

                <div className="bg-indigo-600 p-8 text-center text-white">
                    <h1 className="text-3xl font-black uppercase tracking-tight">Doctor Profile Update</h1>
                </div>

                <form onSubmit={handleUpdate} className="p-8 md:p-12 space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-slate-700 border-b pb-2">Account & Medical Info</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="form-control">
                                <label className="label text-xs font-bold text-slate-400 uppercase">Full Name</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-600 outline-none" />
                            </div>

                            <div className="form-control">
                                <label className="label text-xs font-bold text-slate-400 uppercase">Email Address</label>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-600 outline-none" />
                            </div>

                            <div className="form-control">
                                <label className="label text-xs font-bold text-slate-400 uppercase">Specialization</label>
                                <select
                                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-600 outline-none"
                                    value={specialization}
                                    onChange={(e) => handleSelectChange(e, "SPECIALIZATION", setSpecialization)}
                                    required
                                >
                                    <option value="">Select Specialization</option>
                                    {specializationList.map(cat => (
                                        <option key={cat._id} value={cat.name}>{cat.name}</option>
                                    ))}
                                    <option value="REQUEST_NEW" className="text-blue-600 font-bold">+ Request New</option>
                                </select>
                            </div>

                            <div className="form-control">
                                <label className="label text-xs font-bold text-slate-400 uppercase">Hospital</label>
                                <input type="text" className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-600 outline-none" value={hospital} onChange={(e) => setHospital(e.target.value)} required />
                            </div>

                            <div className="form-control">
                                <label className="label text-xs font-bold text-slate-400 uppercase">Contact</label>
                                <input type="text" className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-600 outline-none" value={contact} onChange={(e) => setContact(e.target.value)} required />
                            </div>

                            <div className="form-control">
                                <label className="label text-xs font-bold text-slate-400 uppercase">Fees (PKR)</label>
                                <input type="number" className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-600 outline-none" value={fees} onChange={(e) => setFees(e.target.value)} required />
                            </div>

                            <div className="form-control">
                                <label className="label text-xs font-bold text-slate-400 uppercase">Experience</label>
                                <input type="text" className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-600 outline-none" value={experience} onChange={(e) => setExperience(e.target.value)} required />
                            </div>

                            <div className="form-control md:col-span-2">
                                <label className="label text-[11px] font-bold text-slate-400 uppercase">Home Address</label>
                                <input type="text" placeholder="Full residential address" value={address} onChange={(e) => setAddress(e.target.value)} className="block w-full rounded-md bg-white border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-600 outline-none" />
                            </div>
                        </div>
                    </div>

                    {/* Days Selection */}
                    <div className="space-y-4 pt-4">
                        <label className="label text-xs font-bold text-slate-400 uppercase">Available Days</label>
                        <div className="flex flex-wrap gap-2">
                            {daysOptions.map(day => (
                                <button
                                    key={day}
                                    type="button"
                                    onClick={() => handleToggle(day, selectedDays, setSelectedDays)}
                                    className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${selectedDays.includes(day) ? "bg-indigo-600 text-white shadow-md" : "bg-white text-slate-500 hover:border-indigo-600"}`}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Time Selection */}
                    <div className="space-y-4 pt-4">
                        <label className="label text-xs font-bold text-slate-400 uppercase">Available Slots</label>
                        <div className="flex flex-wrap gap-2">
                            {timeOptions.map(time => (
                                <button
                                    key={time}
                                    type="button"
                                    onClick={() => handleToggle(time, selectedTimings, setSelectedTimings)}
                                    className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${selectedTimings.includes(time) ? "bg-indigo-600 text-white shadow-md" : "bg-white text-slate-500 hover:border-indigo-600"}`}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-8">
                        <button type="submit" className="w-full h-14 bg-indigo-600 rounded-2xl text-white font-black uppercase tracking-widest hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 cursor-pointer">
                            Save Profile Changes
                        </button>
                    </div>
                </form>
            </div>

            {/* Request Modal */}
            {showReqModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white p-8 rounded-[2.5rem] max-w-sm w-full shadow-2xl text-black">
                        <h3 className="text-xl font-black text-slate-800 uppercase italic">Request {reqLabel}</h3>
                        <input
                            type="text"
                            className="w-full h-14 rounded-2xl font-bold my-6 bg-white border-2 border-slate-200 px-4 focus:ring-2 focus:ring-indigo-600 outline-none"
                            placeholder={`Type here...`}
                            value={reqName}
                            onChange={(e) => setReqName(e.target.value)}
                        />
                        <div className="flex gap-3">
                            <button onClick={() => setShowReqModal(false)} className="flex-1 py-3 rounded-xl font-bold bg-slate-100">Cancel</button>
                            <button className="flex-[2] py-3 bg-indigo-600 text-white rounded-xl font-black uppercase" onClick={handleRequestSubmit}>Send</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpdateDoctorProfile;