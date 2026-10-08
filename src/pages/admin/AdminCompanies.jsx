import React, { useState, useEffect } from 'react';
import { Loader2, Search } from 'lucide-react';
import adminService from '../../services/adminService';

const AdminCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await adminService.getCompanies(0, 50, search);
      setCompanies(res.data.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCompanies();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Company Management</h1>
      
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-4">
        <form onSubmit={handleSearch} className="flex-1 min-w-[300px] flex gap-2">
          <input 
            type="text" placeholder="Search by name, industry, location..." 
            className="flex-1 border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            value={search} onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <Search className="w-5 h-5" />
          </button>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b text-sm font-medium text-gray-500">
                <th className="p-4">Company Name</th>
                <th className="p-4">Industry</th>
                <th className="p-4">Location</th>
                <th className="p-4">Status</th>
                <th className="p-4">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {companies.map(company => (
                <tr key={company.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">{company.name}</td>
                  <td className="p-4 text-gray-600 text-sm">{company.industry}</td>
                  <td className="p-4 text-gray-600 text-sm">{company.location}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${company.active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                      {company.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500 text-sm">{new Date(company.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {companies.length === 0 && <div className="p-8 text-center text-gray-500">No companies found.</div>}
        </div>
      )}
    </div>
  );
};

export default AdminCompanies;

