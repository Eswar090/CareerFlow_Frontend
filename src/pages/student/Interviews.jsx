import React, { useState, useEffect } from 'react';
import interviewService from '../../services/interviewService';
import { Calendar, MapPin, Video, Building } from 'lucide-react';

const StudentInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const res = await interviewService.getStudentInterviews();
      setInterviews(res.data?.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Interviews</h1>

      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : interviews.length === 0 ? (
        <div className="text-center text-gray-500 py-10 bg-white rounded-lg border">No interviews scheduled yet.</div>
      ) : (
        <div className="grid gap-6">
          {interviews.map(inv => (
            <div key={inv.id} className="bg-white p-6 rounded-xl border flex flex-col md:flex-row gap-6 justify-between items-start">
              <div>
                <h3 className="font-bold text-lg text-gray-900">{inv.jobTitle}</h3>
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <Building className="w-4 h-4" /> {inv.companyName}
                </div>
                <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-700">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">{new Date(inv.scheduledAt).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium bg-gray-100 px-2 py-1 rounded text-xs">{inv.type}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`font-medium px-2 py-1 rounded text-xs ${inv.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-700' : inv.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {inv.status}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 text-sm text-gray-600">
                  {inv.interviewerName && <div><strong>Interviewer:</strong> {inv.interviewerName}</div>}
                  {inv.location && <div className="flex items-center gap-1 mt-1"><MapPin className="w-4 h-4"/> {inv.location}</div>}
                </div>
              </div>
              <div className="shrink-0">
                {inv.meetingLink && inv.status === 'SCHEDULED' && (
                  <a href={inv.meetingLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    <Video className="w-4 h-4" /> Join Meeting
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentInterviews;
