import api from '../utils/api';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Signup = () => {
    const navigate = useNavigate()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const formData = { name, email, password }
    const submitForm = async () => {
        if(localStorage.getItem("isLoggedIn") === "true"){
                        toast.info("You are alreay logged in");
                        navigate("/profile");
                    }
        try {
            console.log(name, email, password);
            const response = await api.post("/users/register-user", formData);
            toast.success("user registered successfully")
            navigate("/profile");
            localStorage.setItem("isLoggedIn", "true");
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }

    return (
        <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                <div className='mx-auto h-10 w-auto text-center'>
                    <span className="text-5xl font-black text-slate-800 tracking-tighter">
                        Medi<span className="text-blue-600 font-serif italic">Link.</span>
                    </span>
                </div>
                <h2 class="mt-10 text-center text-4xl font-bold tracking-tight text-gray-700">Signup</h2>
            </div>

            <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form action="" onSubmit={(e) => e.preventDefault()} class="space-y-6">
                    <div>
                        <label htmlFor="name" class="block text-sm/6 font-medium text-gray-700">Name</label>
                        <div class="mt-2">
                            <input id="name" type="text" value={name} name="name" onChange={(e) => setName(e.target.value)} required autoComplete="email" className="block w-full rounded-md bg-white border border-gray-300 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm/6" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email" class="block text-sm/6 font-medium text-gray-700">Email address</label>
                        <div class="mt-2">
                            <input id="email" type="email" value={email} name="email" onChange={(e) => setEmail(e.target.value)} required autoComplete="email" className="block w-full rounded-md bg-white border border-gray-300 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm/6" />
                        </div>
                    </div>

                    <div>
                        <div class="flex items-center justify-between">
                            <label htmlFor="password" class="block text-sm/6 font-medium text-gray-700">Password</label>
                        </div>
                        <div class="mt-2">
                            <input id="password" type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" className="block w-full rounded-md bg-white border border-gray-300 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm/6" />
                        </div>
                    </div>

                    <div>
                        <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500" onClick={submitForm}>Sign in</button>
                    </div>
                </form>

                <p class="mt-10 text-center text-sm/6 text-gray-400">
                    Already have an account ?
                    <Link to="/login" class="font-semibold text-indigo-400 hover:text-indigo-300">Login</Link>
                </p>
            </div>
        </div>
    )
}

export default Signup
