import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, Loader2, Building } from 'lucide-react';
import jobService from '../../services/jobService';

const StudentJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [employmentType, setEmploymentType] = useState('');

  useEffect(() => {
    fetchJobs();
  }, [location, employmentType]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await jobService.searchJobs({
        search,
        location,
        employmentType,
        page: 0,
        size: 20
      });
      setJobs(data.content || []);
    } catch (err) {
      setError('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Explore Jobs</h1>
      </div>

      {/* Search & Filters */}
      <form onSubmit={handleSearch} className="bg-white p-4 rounded-xl border shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by job title, company, or keywords" 
              className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="w-full md:w-48">
            <input 
              type="text"
              placeholder="Location"
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="w-full md:w-48">
            <select 
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
            >
              <option value="">Job Type (Any)</option>
              <option value="FULL_TIME">Full-time</option>
              <option value="PART_TIME">Part-time</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="CONTRACT">Contract</option>
            </select>
          </div>
          <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">Search</button>
        </div>
      </form>

      {/* Job List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-64 bg-white rounded-xl border">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">{error}</div>
        ) : jobs.length === 0 ? (
           <div className="text-center py-12 bg-white rounded-xl border shadow-sm">
             <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
             <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
             <p className="text-gray-500">Try adjusting your search criteria.</p>
           </div>
        ) : (
          jobs.map(job => (
            <div key={job.id} className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded bg-gray-50 border flex items-center justify-center overflow-hidden shrink-0">
                      <Building className="w-6 h-6 text-gray-300" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{job.title}</h2>
                      <div className="text-sm font-medium text-blue-600">{job.company?.name}</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> {job.location}</span>
                    <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium">{job.employmentType}</span>
                    <span className="font-medium text-gray-700">Exp: {job.experienceRequired} yrs</span>
                    {(job.salaryMin || job.salaryMax) && (
                      <span className="font-medium text-green-600">₹{job.salaryMin} - ₹{job.salaryMax}</span>
                    )}
                    <span className="text-xs text-gray-400 ml-auto">
                      Posted {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{job.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {job.skills?.map(skill => (
                      <span key={skill.id} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded border border-blue-100">
                        {skill.name} ({skill.level})
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between gap-4 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 min-w-[150px]">
                  <div className="w-full space-y-2 mt-auto">
                    <Link to={`/student/jobs/${job.id}`} className="block w-full text-center px-4 py-2 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50">View Details</Link>
                    <button disabled className="block w-full text-center px-4 py-2 bg-gray-300 text-gray-600 font-medium rounded-lg cursor-not-allowed">Apply Later</button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentJobs;
