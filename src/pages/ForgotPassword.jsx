import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../utils/api';
const ForgotPassword = () => {
    const [email, setEmail] = useState("");    
    const navigate = useNavigate();
    const submitForm = async () => {
        try {
            const response = await api.post("/users/forgot-password", { email });
            console.log(response);
            toast.success("Email sent successfully Please check your Gmail inbox");
            navigate("/login")
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
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
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-700">Enter Your Email To Get Reset Password Email</h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form action="" onSubmit={(e) => e.preventDefault()} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm/6 font-medium text-gray-700">Email address</label>
                        <div class="mt-2">
                            <input id="email" type="email" value={email} name="email" onChange={(e) => setEmail(e.target.value)} required autoComplete="email" class="block w-full rounded-md bg-white border border-gray-300 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm/6" />
                        </div>
                    </div>
                    <div>
                        <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500" onClick={submitForm}>Submit</button>
                    </div>
                </form>
            </div>
        </div>
  )
}

export default ForgotPassword
