import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';

const AllUsersList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const { data } = await api.get("/users/admin/get-all-users");
            // Filter: Only show people whose role is strictly "USER"
            const filtered = data.users.filter(u => u.role === "USER");
            setUsers(filtered);
            // console.log(filtered);
            
        } catch (error)
         { toast.error("Error loading users"); }
        finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure? This will delete the user account.")) return;
        try {
            await api.delete(`/users/admin/delete-user/${id}`);
            toast.success("User deleted");
            fetchData();
        } catch (error) { toast.error("Delete failed"); }
    };

    useEffect(() => { fetchData(); }, []);

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic">Regular Users</h2>
                <div className="badge badge-primary font-bold">{users.length} Total</div>
            </div>

            <div className="overflow-x-auto bg-white rounded-2xl border border-slate-100 shadow-sm">
                <table className="table w-full">
                    <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] tracking-widest">
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Joined Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm font-bold text-slate-600">
                        {users.map(u => (
                            <tr key={u._id}>
                                <td className="text-slate-900 uppercase">{u.name}</td>
                                <td className="lowercase text-xs">{u.email}</td>
                                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <button onClick={() => handleDelete(u._id)} className="btn btn-error btn-outline rounded-lg btn-xs transition-all hover:scale-105">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && !loading && <p className="text-center py-10 text-slate-400 font-medium">No basic users found.</p>}
            </div>
        </div>
    );
};

export default AllUsersList;
