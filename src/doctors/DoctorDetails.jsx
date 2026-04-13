import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';

const DoctorDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [selectedDate, setSelectedDate] = useState("");
    const [selectedSlot, setSelectedSlot] = useState("");

    const fetchData = async () => {
        try {
            const { data } = await api.get(`/doctors/doctor/${id}`);
            // console.log(data);

            if (data.success) setDoctor(data.doctor);
            if (localStorage.getItem("isLoggedIn") === "true") {
                const userRes = await api.get("/users/user-profile");
                setUser(userRes.data.user);
            }

        } catch (error) {
            toast.error("Doctor not found");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    // Helper to close modal and reset selections
    const closeModal = () => {
        setSelectedDate("");
        setSelectedSlot("");
        setIsModalOpen(false); // Use state instead of .close()
    };

    // Toggle Date selection
    const handleDateSelect = (date) => {
        setSelectedDate(prev => prev === date ? "" : date);
    };

    // Toggle Slot selection
    const handleSlotSelect = (slot) => {
        setSelectedSlot(prev => prev === slot ? "" : slot);
    };

    const availableDates = useMemo(() => {
        if (!doctor || !doctor.days) return [];
        const dates = [];
        const today = new Date();
        const doctorWorkingDays = doctor.days.map(d => d.toLowerCase());

        for (let i = 0; i < 30; i++) {
            const date = new Date();
            date.setDate(today.getDate() + i);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

            if (doctorWorkingDays.includes(dayName)) {
                dates.push({
                    fullDate: date.toISOString().split('T')[0],
                    dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
                    dayNumber: date.getDate(),
                    month: date.toLocaleDateString('en-US', { month: 'short' }),
                });
            }
        }
        return dates;
    }, [doctor]);

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.info("Please login first");
            return navigate("/login");
        }
        if (!selectedDate || !selectedSlot) return toast.warn("Please select both date and time");

        try {
            const { data } = await api.put(`/patients/book-appointment/${doctor._id}`, {
                appointmentDate: selectedDate,
                appointmentTime: selectedSlot
            });
            if (data.success) {
                toast.success("Appointment Booked!"); // Show toast first
                closeModal();
                setTimeout(() => {
                    navigate("/patient-profile");
                }, 1000);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error");
        }
    };

    const getInitial = (name) => name ? name.charAt(0).toUpperCase() : "?";

    if (loading) return <div className="min-h-screen flex items-center justify-center"><span className="loading loading-spinner loading-lg text-primary"></span></div>;

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-12">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Profile Card */}
                <div className="max-w-5xl mx-auto px-4 sm:px-0 space-y-8">
                    {/* Profile Card */}
                    <div className="bg-white shadow-2xl rounded-[2rem] sm:rounded-[3rem] border border-slate-100 overflow-hidden flex flex-col lg:flex-row">

                        {/* Image Section: Fixed height on mobile, square on desktop */}
                        <div className="w-full lg:w-1/3 h-72 sm:h-96 lg:h-auto bg-slate-100 relative">
                            {doctor?.user?.avatar?.url ? (
                                <img src={doctor.user.avatar.url} alt={doctor.user.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-primary bg-blue-50 text-7xl sm:text-8xl font-black italic">
                                    {getInitial(doctor?.user?.name)}
                                </div>
                            )}
                        </div>

                        {/* Content Section */}
                        <div className="p-6 sm:p-10 lg:p-12 lg:w-2/3 flex flex-col justify-center">
                            {/* Desktop-only badge */}
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-4 py-1 bg-primary text-white rounded-full font-bold uppercase text-[9px] tracking-[0.2em] shadow-lg shadow-primary/20">
                                    {doctor?.specialization}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verified Specialist</span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-800 uppercase tracking-tight mb-3 italic leading-tight">
                                Dr. {doctor?.user?.name}
                            </h1>

                            {/* Contact Info: Stacks on mobile, row on tablet+ */}
                            <div className="flex flex-wrap gap-3 mb-6">
                                <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-2xl border border-slate-200/50">
                                    <span className="text-[11px] font-bold text-slate-600">{doctor?.user.email}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100/50">
                                    <span className="text-[11px] font-bold text-primary">📍 {doctor.address}</span>
                                </div>
                            </div>

                            {/* Stats Grid: 2 columns on mobile, 4 on desktop */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-2 pt-8 border-t border-slate-100 mt-2">
                                <div className="text-center sm:text-left">
                                    <p className="text-2xl font-black text-primary italic leading-none">{doctor?.experience}</p>
                                    <p className="text-[9px] uppercase font-black text-slate-400 tracking-tighter mt-1">Experience</p>
                                </div>

                                <div className="text-center sm:text-left sm:border-l sm:pl-6 border-slate-100">
                                    <p className="text-2xl font-black text-slate-800 leading-none">Rs.{doctor?.fees}</p>
                                    <p className="text-[9px] uppercase font-black text-slate-400 tracking-tighter mt-1">Fees</p>
                                </div>

                                <div className="text-center sm:text-left sm:border-l sm:pl-6 border-slate-100">
                                    <p className="text-lg font-black text-slate-800 leading-none uppercase truncate px-2 sm:px-0">
                                        {doctor?.hospital}
                                    </p>
                                    <p className="text-[9px] uppercase font-black text-slate-400 tracking-tighter mt-1">Hospital</p>
                                </div>

                                <div className="text-center sm:text-left sm:border-l sm:pl-6 border-slate-100">
                                    <p className="text-2xl font-black text-emerald-600 leading-none">
                                        {doctor?.patients?.length || 0}
                                    </p>
                                    <p className="text-[9px] uppercase font-black text-slate-400 tracking-tighter mt-1">Patients</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                        <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest">Schedule Summary</h3>
                        <div className="flex flex-wrap gap-2">
                            {doctor?.days?.map((day) => <span key={day} className="px-4 py-2 bg-slate-50 text-slate-500 rounded-xl font-bold text-xs border border-slate-200">{day}</span>)}
                        </div>
                        <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                            <p className="text-[10px] uppercase font-black text-primary mb-1">Standard Timings</p>
                            <div className="flex flex-wrap gap-2">
                                {doctor?.timing?.map((day) => <span key={day} className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs border border-slate-200">{day}</span>)}
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 p-8 rounded-[2rem] shadow-2xl flex flex-col justify-center text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-xs font-black uppercase text-blue-400 tracking-widest mb-4">Appointments</h3>
                            <p className="text-3xl font-bold mb-6">Ready to book?</p>
                            <button onClick={() => setIsModalOpen(true)} className="btn btn-primary w-full h-16 rounded-2xl text-white font-black uppercase tracking-widest text-lg shadow-lg border-none">Select Date & Time</button>
                        </div>
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <div id="booking_modal" className={`modal ${isModalOpen ? "modal-open" : ""} pointer-events-auto`}>
                <div className="modal-box p-0 bg-white rounded-[2.5rem] max-w-2xl overflow-hidden border-none shadow-2xl">
                    <div className="bg-primary p-8 text-center text-white">
                        <h3 className="font-black text-2xl uppercase italic">Choose your Slot</h3>
                        <p className="text-blue-100 text-[10px] mt-1 font-bold uppercase tracking-widest opacity-80">Booking with Dr. {doctor?.user?.name}</p>
                    </div>

                    <form onSubmit={handleBookingSubmit} className="p-8 space-y-8">
                        <div>
                            <label className="label text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex justify-between">
                                <span>1. Select Available Date</span>
                                <span className="text-primary">Next 30 Days</span>
                            </label>
                            <div className="flex overflow-x-auto gap-3 py-2 text-black bg-white">
                                {availableDates.map((item) => (
                                    <button
                                        key={item.fullDate}
                                        type="button"
                                        onClick={() => handleDateSelect(item.fullDate)}
                                        className={`cursor-pointer flex-shrink-0 w-20 h-24 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-1 ${selectedDate === item.fullDate
                                            ? "bg-primary border-primary text-white shadow-lg -translate-y-1"
                                            : "bg-slate-50 border-slate-100 text-slate-500"
                                            }`}
                                    >
                                        <span className="text-[10px] font-black uppercase">{item.dayName}</span>
                                        <span className="text-2xl font-black leading-none">{item.dayNumber}</span>
                                        <span className="text-[10px] font-bold uppercase">{item.month}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="label text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">2. Select Appointment Time</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {doctor?.timing?.map((slot, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => handleSlotSelect(slot)}
                                        className={`cursor-pointer px-4 py-4 rounded-2xl border-2 text-sm font-black transition-all text-center uppercase tracking-tighter ${selectedSlot === slot
                                            ? "bg-primary text-white border-primary shadow-md"
                                            : "bg-white text-slate-500 border-slate-200 hover:border-primary"
                                            }`}
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 flex flex-col sm:flex-row gap-4">
                            <button type="button" className="btn flex-1 px-4 py-2 rounded-xl border text-sm font-bold" onClick={closeModal}>Discard</button>
                            <button type="submit" className="btn btn-primary flex-2 px-4 py-2 rounded-xl border text-sm font-bold">Confirm Appointment</button>
                        </div>
                    </form>
                </div>
                <div
                    className="modal-backdrop bg-slate-900/60 backdrop-blur-md cursor-pointer"
                    onClick={closeModal}
                >
                    <button className="cursor-default">close</button>
                </div>
            </div>
        </div>
    );
};

export default DoctorDetails;