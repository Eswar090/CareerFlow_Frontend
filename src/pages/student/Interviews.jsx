import React, { useState, useEffect } from 'react';
import interviewService from '../../services/interviewService';
import { Calendar, MapPin, Video, Building2, Clock, CheckCircle2, AlertCircle, Sparkles, UserCheck } from 'lucide-react';

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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return (
          <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 rounded-full text-xs font-bold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Scheduled
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 rounded-full text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="px-3 py-1 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 rounded-full text-xs font-bold flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-xs font-bold border border-slate-200 dark:border-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> Technical & HR Rounds
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Interview Schedule</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
          Keep track of upcoming video calls, campus technical rounds, and recruiter discussions.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-72 bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="w-8 h-8 border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin mb-3"></div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Checking scheduled sessions...</p>
        </div>
      ) : interviews.length === 0 ? (
        <div className="bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs dark:shadow-black/40 p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4 border border-indigo-100 dark:border-indigo-800/60">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">No upcoming interviews scheduled</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            When recruiters shortlist your profile for technical or behavioral rounds, the time and meeting links will show up here.
          </p>
        </div>
      ) : (
        <div className="grid gap-5">
          {interviews.map(inv => (
            <div 
              key={inv.id} 
              className="bg-white dark:bg-slate-900/80 p-6 md:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs dark:shadow-black/40 hover:shadow-md transition-all flex flex-col md:flex-row gap-6 justify-between items-start md:items-center group"
            >
              <div className="space-y-3 flex-1">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg md:text-xl text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {inv.jobTitle}
                    </h3>
                    <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">{inv.companyName}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    {new Date(inv.scheduledAt).toLocaleString(undefined, { 
                      month: 'short', day: 'numeric', year: 'numeric', 
                      hour: '2-digit', minute: '2-digit' 
                    })}
                  </span>
                  <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-bold uppercase tracking-wider text-[11px]">
                    {inv.type || 'INTERVIEW'}
                  </span>
                  {getStatusBadge(inv.status)}
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium pt-1">
                  {inv.interviewerName && (
                    <span className="flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                      Interviewer: <strong className="text-slate-700 dark:text-slate-200">{inv.interviewerName}</strong>
                    </span>
                  )}
                  {inv.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400"/> {inv.location}
                    </span>
                  )}
                </div>
              </div>

              <div className="shrink-0 self-stretch md:self-auto flex md:flex-col justify-end">
                {inv.meetingLink && inv.status === 'SCHEDULED' ? (
                  <a 
                    href={inv.meetingLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl text-xs transition shadow-md shadow-indigo-600/20 active:scale-95 cursor-pointer"
                  >
                    <Video className="w-4 h-4" /> Join Virtual Room
                  </a>
                ) : (
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-medium italic">
                    {inv.status === 'COMPLETED' ? 'Session completed' : 'No link needed'}
                  </span>
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
