import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const ApplyDoctor = () => {
    const navigate = useNavigate();

    // User Info (Pre-filled)
    const [userData, setUserData] = useState({ name: "", email: "" });

    // Doctor Details (To be filled)
    const [specialization, setSpecialization] = useState("");
    const [hospital, setHospital] = useState("");
    const [contact, setContact] = useState("");
    const [fees, setFees] = useState("");
    const [experience, setExperience] = useState("")
    const [address, setAddress] = useState("");
    const timeOptions = ["08:00 AM - 10:00 AM", "10:00 AM - 12:00 PM", "12:00 PM - 02:00 PM", "02:00 PM - 04:00 PM", "04:00 PM - 06:00 PM", "06:00 PM - 08:00 PM", "08:00 PM - 10:00 PM", "10:00 PM - 12:00 AM"];
    const [selectedTimings, setSelectedTimings] = useState([]);
    const [selectedDays, setSelectedDays] = useState([]);

    // Lists for dropdowns
    const [specializationList, setSpecializationList] = useState([]);
    const daysOptions = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

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
        if(!reqName) return toast.warn("Please type a specialization name");
        try {
            await api.post("/categories/request", { name: reqName, label: reqLabel });
            toast.info(`Request for ${reqName} sent. Please wait & keep checking your profile; Admin will update you soon.`);
            setShowReqModal(false);
            setReqName("");
        } catch (error) {
            toast.error("Request failed");
        }
    };

    // 1. Fetch User Data and Categories on Mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get User Profile
                const userRes = await api.get("/users/user-profile");
                setUserData({ name: userRes.data.user.name, email: userRes.data.user.email });

                // Get Specializations from your Category API
                const catRes = await api.get("/categories/get-all/SPECIALIZATION");
                setSpecializationList(catRes.data.categories);
            } catch (error) {
                toast.error("Please login to apply");
                navigate("/login");
            }
        };
        fetchData();
    }, [navigate]);

    // Handle Checkbox for Days
    const handleDayChange = (day) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter(d => d !== day));
        } else {
            setSelectedDays([...selectedDays, day]);
        }
    };

    const handleTimeChange = (time) => {
        if (selectedTimings.includes(time)) {
            setSelectedTimings(selectedTimings.filter(t => t !== time));
        } else {
            setSelectedTimings([...selectedTimings, time]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedDays.length === 0 || selectedTimings.length === 0) return toast.error("Please select days and timings");
 
        try {
            const formData = {
                specialization,
                contact,
                fees: Number(fees),
                days: selectedDays,
                timing: selectedTimings,
                experience,
                hospital,
                address
            };

            const { data } = await api.post("/doctors/doctor/apply", formData);

            if (data.success) {
                toast.success(data.message);
                navigate("/profile");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Application failed");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 text-black">
            <Link to="/profile" className="btn btn-link text-slate-400 no-underline font-bold">← Back</Link>
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                <div className="bg-primary p-8 text-center">
                    <h1 className="text-3xl font-black text-white uppercase tracking-tight">Doctor Application</h1>
                    <p className="text-blue-100 mt-2">Join our team of professional specialists</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">

                    {/* SECTION 1: Personal Info (Read Only) */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-slate-700 border-b pb-2">Personal Information</h2>
                    </div>

                    {/* SECTION 2: Professional Details */}
                    <div className="space-y-6">

                        {/* Grid: 1 column on mobile (default), 2 columns on medium screens (md:) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                            <div className="form-control">
                                <label className="label text-xs font-bold text-slate-400 uppercase">Full Name</label><br />
                                <input type="text" value={userData.name} readOnly className="input input-bordered bg-slate-50 text-slate-500 font-medium cursor-not-allowed" />
                            </div>

                            <div className="form-control">
                                <label className="label text-xs font-bold text-slate-400 uppercase">Email Address</label><br />
                                <input type="email" value={userData.email} readOnly className="input input-bordered bg-slate-50 text-slate-500 font-medium cursor-not-allowed" />
                            </div>
                            {/* Specialization */}
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-bold text-slate-500 dark:text-slate-400 uppercase text-[11px] tracking-widest">Specialization</span>
                                </label>
                                <select
                                    className="block w-full rounded-md bg-white border border-gray-300 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm/6"
                                    value={specialization}
                                    onChange={(e) => handleSelectChange(e, "SPECIALIZATION", setSpecialization)}
                                    required
                                >
                                    <option value="">Select Specialization</option>
                                    {specializationList.map(cat => (
                                        <option key={cat._id} value={cat.name}>{cat.name}</option>
                                    ))}
                                    <option value="REQUEST_NEW" className="text-blue-600 font-bold">+ Not in list? Request New</option>
                                </select>
                            </div>
                            <div className="form-control">
                                <label className="label-text font-bold text-slate-500 dark:text-slate-400 uppercase text-[11px] tracking-widest">Hospital Name</label>
                                <input type="text" placeholder="e.g. City General Hospital" className="block w-full rounded-md bg-white border border-gray-300 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm/6" onChange={(e) => setHospital(e.target.value)} required />
                            </div>

                            {/* Contact Number */}
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-bold text-slate-500 dark:text-slate-400 uppercase text-[11px] tracking-widest">Contact Number</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. 03001234567"
                                    className="block w-full rounded-md bg-white border border-gray-300 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm/6"
                                    value={contact}
                                    onChange={(e) => setContact(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Fees */}
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-bold text-slate-500 dark:text-slate-400 uppercase text-[11px] tracking-widest"> Fees (PKR)</span>
                                </label>
                                <input
                                    type="number"
                                    placeholder="e.g. 1500"
                                    className="block w-full rounded-md bg-white border border-gray-300 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm/6"
                                    value={fees}
                                    onChange={(e) => setFees(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-bold text-slate-500 dark:text-slate-400 uppercase text-[11px] tracking-widest">Experience</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. 5 Years/Months"
                                    className="block w-full rounded-md bg-white border border-gray-300 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm/6"
                                    value={experience}
                                    onChange={(e) => setExperience(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-control md:col-span-2">
                                <label className="label text-[11px] font-bold text-slate-400 uppercase">Home Address</label>
                                <input type="text" placeholder="Full residential address" value={address} onChange={(e) => setAddress(e.target.value)} className="block w-full rounded-md bg-white border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-600 outline-none" />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3: Availability (Days) */}
                    <div className="space-y-4 pt-4">
                        <label className="label text-xs font-bold text-slate-400 uppercase">Select Available Days</label>
                        <div className="flex flex-wrap gap-3">
                            {daysOptions.map(day => (
                                <button
                                    key={day}
                                    type="button"
                                    onClick={() => handleDayChange(day)}
                                    className={`cursor-pointer px-4 py-2 rounded-xl border text-sm font-bold transition-all ${selectedDays.includes(day)
                                        ? "bg-primary text-white border-primary shadow-md"
                                        : "bg-white text-slate-500 border-slate-200 hover:border-primary"
                                        }`}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4 pt-4">
                        <label className="label text-xs font-bold text-slate-400 uppercase">Available Time Slots</label>
                        <div className="flex flex-wrap gap-3">
                            {timeOptions.map(time => (
                                <button
                                    key={time}
                                    type="button"
                                    onClick={() => handleTimeChange(time)}
                                    className={`cursor-pointer px-4 py-2 rounded-xl border text-sm font-bold transition-all ${selectedTimings.includes(time)
                                            ? "bg-primary text-white border-primary shadow-md"
                                            : "bg-white text-slate-500 border-slate-200 hover:border-primary"
                                        }`}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    </div>


                    {/* Submit Button */}
                    <div className="pt-8">
                        <button type="submit" className="btn btn-primary w-full h-14 rounded-2xl text-white font-black text-lg shadow-lg shadow-blue-200 uppercase tracking-widest border-none">
                            Submit Application
                        </button>
                        <p className="text-center text-xs text-slate-400 mt-4 font-medium">
                            Your application will be reviewed by the hospital administration. You will receive an email once approved.
                        </p>
                    </div>

                </form>
            </div>

            {/* --- NEW REQUEST MODAL --- */}
            {showReqModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white p-8 rounded-[2.5rem] max-w-sm w-full shadow-2xl border-4 border-blue-50 text-black">
                        <h3 className="text-xl font-black text-slate-800 uppercase italic">Request New {reqLabel}</h3>
                        <p className="text-[10px] font-bold text-slate-400 mb-6 uppercase tracking-widest leading-tight">Admin will review and add your specialty to the database.</p>
                        
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

export default ApplyDoctor;