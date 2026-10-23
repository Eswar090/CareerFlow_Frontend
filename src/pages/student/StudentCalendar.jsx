import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin, 
  Building2, Video, CheckCircle2, AlertCircle, ArrowUpRight, Filter, 
  Sparkles, Layers, ListFilter, Compass
} from 'lucide-react';
import calendarService from '../../services/calendarService';

const EVENT_TYPE_CONFIG = {
  INTERVIEW: {
    label: 'Interview',
    badgeClass: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60',
    dotClass: 'bg-indigo-600 dark:bg-indigo-400',
    icon: Video
  },
  PLACEMENT_DRIVE: {
    label: 'Placement Drive',
    badgeClass: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
    dotClass: 'bg-emerald-600 dark:bg-emerald-400',
    icon: Building2
  },
  JOB_APPLICATION: {
    label: 'Job Application',
    badgeClass: 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800/60',
    dotClass: 'bg-cyan-600 dark:bg-cyan-400',
    icon: Layers
  },
  ROADMAP_TASK: {
    label: 'Roadmap Milestone',
    badgeClass: 'bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800/60',
    dotClass: 'bg-violet-600 dark:bg-violet-400',
    icon: Compass
  }
};

const StudentCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // View controls
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filterType, setFilterType] = useState('ALL');
  const [filterTimeframe, setFilterTimeframe] = useState('UPCOMING'); // UPCOMING, ALL, PAST
  const [selectedDayEvents, setSelectedDayEvents] = useState(null);

  useEffect(() => {
    fetchCalendarEvents();
  }, []);

  const fetchCalendarEvents = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await calendarService.getStudentCalendarEvents();
      setEvents(res.data || []);
    } catch (err) {
      console.error('Failed to load placement calendar events', err);
      setError('Unable to load calendar events. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    setSelectedDayEvents(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    setSelectedDayEvents(null);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
    setSelectedDayEvents(null);
  };

  // Calendar matrix calculation
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Filter events
  const filteredEvents = events.filter(e => {
    if (filterType !== 'ALL' && e.eventType !== filterType) return false;
    if (filterTimeframe === 'UPCOMING' && e.urgency === 'PAST') return false;
    if (filterTimeframe === 'PAST' && e.urgency !== 'PAST') return false;
    return true;
  });

  const getEventsForDate = (day) => {
    return events.filter(e => {
      if (!e.eventDate) return false;
      const d = new Date(e.eventDate);
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth && d.getDate() === day;
    });
  };

  const formatEventDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const now = new Date();

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
            <CalendarIcon className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            Placement Schedule
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Placement & Career Calendar</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
            Aggregated timeline of upcoming interviews, placement drive deadlines, application milestones, and roadmap tasks.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleToday}
            className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition cursor-pointer shadow-xs"
          >
            Today
          </button>
          <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 shadow-xs">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-black text-slate-900 dark:text-white min-w-[130px] text-center">
              {monthName}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1">Event Type:</span>
          {['ALL', 'INTERVIEW', 'PLACEMENT_DRIVE', 'JOB_APPLICATION', 'ROADMAP_TASK'].map((type) => {
            const isActive = filterType === type;
            const label = type === 'ALL' ? 'All Events' : EVENT_TYPE_CONFIG[type]?.label || type;
            return (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Timeframe:</span>
          <select
            value={filterTimeframe}
            onChange={(e) => setFilterTimeframe(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-hidden cursor-pointer"
          >
            <option value="UPCOMING">Upcoming & Today</option>
            <option value="ALL">All Time</option>
            <option value="PAST">Past Events</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Calendar Matrix & Agenda List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Month Grid */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              {monthName}
            </h2>
            <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-400">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-600" /> Interview</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Drive</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-violet-500" /> Milestone</span>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-black text-slate-400 dark:text-slate-500">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="py-2">{d}</div>
            ))}
          </div>

          {/* Days Matrix */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty slots before day 1 */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="h-20 sm:h-24 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 border border-transparent" />
            ))}

            {/* Month Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayEvents = getEventsForDate(day);
              const isToday = now.getFullYear() === currentYear && now.getMonth() === currentMonth && now.getDate() === day;
              const isSelected = selectedDayEvents && selectedDayEvents.day === day;

              return (
                <div
                  key={`day-${day}`}
                  onClick={() => dayEvents.length > 0 && setSelectedDayEvents({ day, events: dayEvents })}
                  className={`h-20 sm:h-24 p-2 rounded-2xl border transition-all flex flex-col justify-between ${
                    dayEvents.length > 0 ? 'cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md' : ''
                  } ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40'
                      : isToday
                      ? 'border-indigo-400 dark:border-indigo-500/80 bg-indigo-50/20 dark:bg-indigo-950/20'
                      : 'border-slate-100 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-black ${
                      isToday
                        ? 'w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}>
                      {day}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        {dayEvents.length}
                      </span>
                    )}
                  </div>

                  {/* Event Dots */}
                  <div className="flex flex-wrap gap-1 mt-auto">
                    {dayEvents.slice(0, 3).map(ev => {
                      const cfg = EVENT_TYPE_CONFIG[ev.eventType] || EVENT_TYPE_CONFIG.INTERVIEW;
                      return (
                        <span
                          key={ev.id}
                          title={ev.title}
                          className={`w-2 h-2 rounded-full ${cfg.dotClass}`}
                        />
                      );
                    })}
                    {dayEvents.length > 3 && (
                      <span className="text-[9px] font-bold text-slate-400 leading-none">+{dayEvents.length - 3}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Agenda & Event Details */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              {selectedDayEvents ? `Events on ${monthName.split(' ')[0]} ${selectedDayEvents.day}` : 'Schedule Agenda'}
            </h2>
            {selectedDayEvents && (
              <button
                onClick={() => setSelectedDayEvents(null)}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                Show All Month
              </button>
            )}
          </div>

          {loading ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800/80">
              <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-bold text-slate-400">Loading schedule timeline...</p>
            </div>
          ) : (selectedDayEvents ? selectedDayEvents.events : filteredEvents).length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800/80">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3">
                <CalendarIcon className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">No scheduled events found</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                No active placement drives, interviews, or roadmap milestones match your current filters.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
              {(selectedDayEvents ? selectedDayEvents.events : filteredEvents).map(ev => {
                const cfg = EVENT_TYPE_CONFIG[ev.eventType] || EVENT_TYPE_CONFIG.INTERVIEW;
                const IconComponent = cfg.icon;

                return (
                  <div
                    key={ev.id}
                    className="p-5 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700/80 transition space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black border ${cfg.badgeClass}`}>
                          <IconComponent className="w-3 h-3" />
                          {cfg.label}
                        </span>
                        {ev.urgency === 'DEADLINE' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60">
                            Urgent Deadline
                          </span>
                        )}
                        {ev.urgency === 'TODAY' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                            Happening Today
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-bold text-slate-400">
                        {ev.status}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white leading-snug">
                        {ev.title}
                      </h3>
                      {ev.companyName && (
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          {ev.companyName}
                        </p>
                      )}
                    </div>

                    {ev.description && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-medium line-clamp-2">
                        {ev.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                        <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                        {formatEventDate(ev.eventDate)}
                      </div>

                      {ev.link && (
                        <Link
                          to={ev.link}
                          className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 cursor-pointer"
                        >
                          View Details <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentCalendar;

