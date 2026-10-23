import React, { useState, useEffect } from 'react';
import { Loader2, Search, Filter, ShieldCheck, Users, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import adminService from '../../services/adminService';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [role]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getUsers(0, 50, search, role);
      setUsers(res.data.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const toggleStatus = async (id, currentStatus) => {
    if (!window.confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this user account?`)) return;
    try {
      await adminService.updateUserStatus(id, !currentStatus);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user status');
    }
  };

  const getRoleBadge = (userRole) => {
    switch (userRole) {
      case 'ADMIN':
      case 'ROLE_ADMIN':
        return <span className="px-2.5 py-1 bg-violet-50 text-violet-700 text-xs font-bold rounded-lg border border-violet-200">Admin</span>;
      case 'RECRUITER':
      case 'ROLE_RECRUITER':
        return <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200">Recruiter</span>;
      case 'STUDENT':
      case 'ROLE_STUDENT':
        return <span className="px-2.5 py-1 bg-cyan-50 text-cyan-700 text-xs font-bold rounded-lg border border-cyan-200">Student</span>;
      default:
        return <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg">{userRole}</span>;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> Platform Governance
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">User Management</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Govern registered accounts across students, recruiters, and placement administrators.
          </p>
        </div>
        <div className="text-sm font-semibold text-slate-500 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs self-start sm:self-auto">
          Total Users: <strong className="text-indigo-600">{users.length}</strong>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 relative flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input 
              type="text" 
              placeholder="Search user by full name or email address..." 
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition bg-white"
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm shadow-indigo-600/20"
          >
            Search
          </button>
        </form>

        <select 
          className="border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 bg-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none cursor-pointer"
          value={role} 
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">All Platform Roles</option>
          <option value="STUDENT">Students</option>
          <option value="RECRUITER">Recruiters</option>
          <option value="ADMIN">Admins</option>
        </select>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-72 bg-white rounded-3xl border border-slate-200/80">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-3" />
          <p className="text-sm font-semibold text-slate-500">Querying platform directory...</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="p-5">User</th>
                  <th className="p-5">Email</th>
                  <th className="p-5">Role</th>
                  <th className="p-5">Account Status</th>
                  <th className="p-5">Joined</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="p-5 font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {user.name}
                    </td>
                    <td className="p-5 text-slate-500 text-xs font-medium">{user.email}</td>
                    <td className="p-5">{getRoleBadge(user.role)}</td>
                    <td className="p-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full border ${
                        user.active 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {user.active ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {user.active ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="p-5 text-slate-400 text-xs font-medium">
                      {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="p-5 text-right">
                      <button
                        onClick={() => toggleStatus(user.id, user.active)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl transition ${
                          user.active 
                            ? 'text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100' 
                            : 'text-emerald-600 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100'
                        }`}
                      >
                        {user.active ? 'Suspend' : 'Reactivate'}
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-12 text-center text-slate-400 text-sm font-medium">
                      No user accounts found matching your query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
