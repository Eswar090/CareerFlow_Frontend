import React, { useState, useEffect } from 'react';
import { Loader2, Search, Building2, ShieldCheck, MapPin, CheckCircle2, XCircle } from 'lucide-react';
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
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> Corporate Network
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Company Management</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Audit participating employer organizations, industry domains, and partner status.
          </p>
        </div>
        <div className="text-sm font-semibold text-slate-500 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs self-start sm:self-auto">
          Registered: <strong className="text-indigo-600">{companies.length}</strong>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap gap-4">
        <form onSubmit={handleSearch} className="flex-1 relative flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input 
              type="text" 
              placeholder="Search companies by name, industry sector, or headquarters..." 
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
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-72 bg-white rounded-3xl border border-slate-200/80">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-3" />
          <p className="text-sm font-semibold text-slate-500">Querying corporate partners...</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="p-5">Company</th>
                  <th className="p-5">Industry Sector</th>
                  <th className="p-5">Headquarters</th>
                  <th className="p-5">Verification</th>
                  <th className="p-5">Onboarded</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {companies.map(company => (
                  <tr key={company.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{company.name}</span>
                      </div>
                    </td>
                    <td className="p-5 text-slate-600 text-xs font-medium">{company.industry || 'Technology'}</td>
                    <td className="p-5 text-slate-500 text-xs font-medium">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> {company.location || 'Remote'}
                      </span>
                    </td>
                    <td className="p-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full border ${
                        company.active 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {company.active ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {company.active ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="p-5 text-slate-400 text-xs font-medium">
                      {new Date(company.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
                {companies.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-12 text-center text-slate-400 text-sm font-medium">
                      No registered companies found.
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

export default AdminCompanies;
