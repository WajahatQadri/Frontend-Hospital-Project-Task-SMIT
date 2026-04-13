import React, { useEffect, useState } from 'react'
import api from '../utils/api';
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const updateProfile = () => {
    const [ name , setName ] = useState("")
    const [ email, setEmail ] = useState("")
    const navigate = useNavigate();

    const getUserProfile = async () => {
        try {
            const response = await api.get(`/users/user-profile`, {
                withCredentials : true,
            })
            setName(response.data.user.name);
            setEmail(response.data.user.email);  

            
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong")   
        }
    }

    const updateUserProfile = async () => {
        try {
            const response = await api.put("/users/update-profile",
                {name , email},{
                    withCredentials : true,
                }
            )
            toast.success("User profile updated successfully");     
            navigate("/profile");

        } catch (error) {
            toast.error("Something went wrong")   
            console.log(error);
            
        }
    }

    useEffect(() => {
        getUserProfile()
    },[])
  return (
        <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                <div className='mx-auto h-10 w-auto text-center'>
                    <span className="text-5xl font-black text-slate-800 tracking-tighter">
                        Medi<span className="text-blue-600 font-serif italic">Link.</span>
                    </span>
                </div>
                <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-700">Update Profile</h2>
            </div>

            <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form action="" onSubmit={(e) => e.preventDefault()} class="space-y-6">
                    <div>
                        <label htmlFor="name" class="block text-sm/6 font-medium text-gray-700">Name</label>
                        <div class="mt-2">
                            <input id="name" type="text" value={name} name="name" onChange={(e) => setName(e.target.value)} required autoComplete="email" class="block w-full rounded-md bg-white border border-gray-300 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm/6" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email" class="block text-sm/6 font-medium text-gray-700">Email address</label>
                        <div class="mt-2">
                            <input id="email" type="email" value={email} name="email" onChange={(e) => setEmail(e.target.value)} required autoComplete="email" class="block w-full rounded-md bg-white border border-gray-300 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm/6" />
                        </div>
                    </div>
                    <div>
                        <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 cursor-pointer" onClick={updateUserProfile}>Update Profile</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default updateProfile
