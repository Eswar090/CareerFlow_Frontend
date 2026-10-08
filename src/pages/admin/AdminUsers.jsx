import React, { useState, useEffect } from 'react';
import { Loader2, Search, Filter } from 'lucide-react';
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
    if (!window.confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this user?`)) return;
    try {
      await adminService.updateUserStatus(id, !currentStatus);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user status');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-1">Manage platform users, students, and recruiters.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-4">
        <form onSubmit={handleSearch} className="flex-1 min-w-[300px] flex gap-2">
          <input 
            type="text" placeholder="Search by name or email..." 
            className="flex-1 border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            value={search} onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <Search className="w-5 h-5" />
          </button>
        </form>
        <select 
          className="border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          value={role} onChange={(e) => setRole(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="STUDENT">Student</option>
          <option value="RECRUITER">Recruiter</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b text-sm font-medium text-gray-500">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Joined</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">{user.name}</td>
                  <td className="p-4 text-gray-600 text-sm">{user.email}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{user.role}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${user.active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                      {user.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500 text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => toggleStatus(user.id, user.active)}
                      className={`text-sm px-3 py-1 rounded ${user.active ? 'text-red-600 bg-red-50 hover:bg-red-100' : 'text-green-600 bg-green-50 hover:bg-green-100'}`}
                    >
                      {user.active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && <div className="p-8 text-center text-gray-500">No users found.</div>}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;

