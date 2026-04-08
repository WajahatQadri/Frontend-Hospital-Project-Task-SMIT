import React, {useEffect, useState} from 'react'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const updatePassword = () => {
    const [ oldPassword, setOldPassword] = useState("");
    const [ newPassword, setNewPassword ] = useState("");
    const [ confirmPassword, setConfirmPassword ] = useState("");
    const navigate =  useNavigate();

    const submitForm = async ()=> {
        try {
            const response = await api.post("/users/update-password",{
                oldPassword,
                newPassword,
                confirmPassword
            },{
                withCredentials: true,
            })            
            toast.success("password updated successfully")
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
    useEffect(()=>{

    },[])
  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <div className='mx-auto h-10 w-auto text-center'>
                    <span className="text-5xl font-black text-slate-800 tracking-tighter">
                        Medi<span className="text-blue-600 font-serif italic">Link.</span>
                    </span>
                </div>
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-700">Update Password</h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form action="" onSubmit={(e) => e.preventDefault()} className="space-y-6">
                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="oldPassword" className="block text-sm/6 font-medium text-gray-700">old Password</label>
                        </div>
                        <div className="mt-2">
                            <input id="oldPassword" type="password" name="oldPassword" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required autoComplete="current-password" className="block w-full rounded-md bg-white border border-gray-300 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm/6" />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="newPassword" className="block text-sm/6 font-medium text-gray-700">New Password</label>
                        </div>
                        <div className="mt-2">
                            <input id="newPassword" type="password" name="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required autoComplete="current-password" className="block w-full rounded-md bg-white border border-gray-300 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm/6" />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="confirmPassword" className="block text-sm/6 font-medium text-gray-700">Confirm New Password</label>
                        </div>
                        <div className="mt-2">
                            <input id="confirmPassword" type="password" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required autoComplete="current-password" className="block w-full rounded-md bg-white border border-gray-300 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm/6" />
                        </div>
                    </div>
                    
                    <div>
                        <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500" onClick={submitForm}>Update Password</button>
                    </div>
                </form>
            </div>
        </div>
  )
}

export default updatePassword
