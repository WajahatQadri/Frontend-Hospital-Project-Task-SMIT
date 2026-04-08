import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

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
    const timeOptions = ["08:00 AM - 10:00 AM", "10:00 AM - 12:00 PM", "12:00 PM - 02:00 PM", "02:00 PM - 04:00 PM", "04:00 PM - 06:00 PM", "06:00 PM - 08:00 PM", "08:00 PM - 10:00 PM", "10:00 PM - 12:00 AM"];
    const [selectedTimings, setSelectedTimings] = useState([]);
    const [selectedDays, setSelectedDays] = useState([]);

    // Lists for dropdowns
    const [specializationList, setSpecializationList] = useState([]);
    const daysOptions = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

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
                hospital
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
        <div className="min-h-screen bg-slate-50 py-12 px-4">
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
                                    onChange={(e) => setSpecialization(e.target.value)}
                                    required
                                >
                                    <option value="">Select Specialization</option>
                                    {specializationList.map(cat => (
                                        <option key={cat._id} value={cat.name}>{cat.name}</option>
                                    ))}
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
                                    placeholder="e.g. 5 Years"
                                    className="block w-full rounded-md bg-white border border-gray-300 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm/6"
                                    value={experience}
                                    onChange={(e) => setExperience(e.target.value)}
                                    required
                                />
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
        </div>
    );
};

export default ApplyDoctor;