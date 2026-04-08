import api from '../utils/api';
import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';


const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const formData = { email, password }
    const submitForm = async () => {
        if (localStorage.getItem("isLoggedIn") === "true") {
            toast.info("You are alreay logged in");
            navigate("/profile");
        }
        try {
            const response = await api.post("/users/login", formData);
            toast.success("Login successful");
            localStorage.setItem("isLoggedIn", "true");

            if (response.data.user.role === "ADMIN") {
                navigate("/admin-dashboard")
                localStorage.setItem("isLoggedIn", "true");
            }
            else if (response.data.user.role === "DOCTOR") {
                navigate("/doctor-dashboard")
                localStorage.setItem("isLoggedIn", "true");
            }
            else if (response.data.user.role === "PATIENT") {
                navigate("/patient-profile")
                localStorage.setItem("isLoggedIn", "true");
            }
            else {
                navigate("/profile")
                localStorage.setItem("isLoggedIn", "true");
            }
            // if (response.data.success) {
            //     localStorage.setItem("isLoggedIn", "true"); // ADD THIS
            //     toast.success("Welcome!");
            // }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message);
        }
    }


    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <div className='mx-auto h-10 w-auto text-center'>
                    <span className="text-5xl font-black text-slate-800 tracking-tighter">
                        Medi<span className="text-blue-600 font-serif italic">Link.</span>
                    </span>
                </div>
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-700">Log in to your account</h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form action="" onSubmit={(e) => e.preventDefault()} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left">
                            Email address
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                type="email"
                                value={email}
                                name="email"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                                className="block w-full rounded-md bg-white border border-gray-300 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-700">Password</label>
                            <div className="text-sm">
                                <Link to="/forgot-password" className="font-semibold text-indigo-400 hover:text-indigo-300">Forgot password?</Link>
                            </div>
                        </div>
                        <div className="mt-2">
                            <input id="password" type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" className="block w-full rounded-md bg-white border border-gray-300 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm/6" />
                        </div>
                    </div>

                    <div>
                        <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500" onClick={submitForm}>Sign in</button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm/6 text-gray-400">
                    Dont have an account ?
                    <Link to="/signup" className="font-semibold text-indigo-400 hover:text-indigo-300">Signup</Link>
                </p>
            </div>
        </div>
    )
}

export default Login
