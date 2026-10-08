import fs from 'fs';

const studentDashboardPath = './frontend/src/pages/student/StudentDashboard.jsx';

const studentCode = `import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, CheckCircle, Calendar, Award, Briefcase, ChevronRight, PieChart as PieChartIcon } from 'lucide-react';
import aiService from '../../services/aiService';
import AiInsightPanel from '../../components/AiInsightPanel';
import analyticsService from '../../services/analyticsService';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
    <div className={\`p-4 rounded-lg \${colorClass}\`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
    </div>
  </div>
);

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#64748b'];

const StudentDashboard = () => {
  const [aiRec, setAiRec] = useState(null);
  const [aiRecLoading, setAiRecLoading] = useState(false);
  const [aiRecError, setAiRecError] = useState('');
  
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await analyticsService.getStudentAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to load analytics', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCareerInsights = async () => {
    setAiRecLoading(true);
    setAiRecError('');
    try {
      const res = await aiService.getCareerRecommendations();
      setAiRec(res.data || res);
    } catch (err) {
      setAiRecError(err.response?.data?.message || 'Could not generate career recommendations. Please try again later.');
    } finally {
      setAiRecLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-10">Loading dashboard...</div>;
  }

  const chartData = analytics?.applicationStatusDistribution?.map(s => ({
    name: s.status,
    value: s.count
  })) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back! \uD83D\uDC4B</h1>
        <p className="text-gray-500 mt-1">Here is what's happening with your job applications today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Applications" value={analytics?.totalApplications || 0} icon={FileText} colorClass="bg-blue-50 text-blue-600" />
        <StatCard title="Shortlisted" value={analytics?.shortlisted || 0} icon={CheckCircle} colorClass="bg-green-50 text-green-600" />
        <StatCard title="Interviews" value={analytics?.interviews || 0} icon={Calendar} colorClass="bg-purple-50 text-purple-600" />
        <StatCard title="Offers/Selected" value={analytics?.selected || 0} icon={Award} colorClass="bg-yellow-50 text-yellow-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Analytics Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Application Status Overview</h2>
          </div>
          {chartData.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={\`cell-\${index}\`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-gray-500 py-10 text-center">No applications yet. Start applying to see analytics!</p>
          )}
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          {/* Profile Completion */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
             <h2 className="text-lg font-bold text-gray-900 mb-4">Profile Overview</h2>
             <div className="space-y-4">
               <div className="flex justify-between items-center text-sm">
                 <span className="text-gray-600">Total Skills</span>
                 <span className="font-bold">{analytics?.totalSkills || 0}</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <span className="text-gray-600">Projects</span>
                 <span className="font-bold">{analytics?.totalProjects || 0}</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <span className="text-gray-600">Certifications</span>
                 <span className="font-bold">{analytics?.totalCertifications || 0}</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <span className="text-gray-600">Resume Uploaded</span>
                 <span className={\`font-bold \${analytics?.hasResume ? 'text-green-600' : 'text-red-600'}\`}>
                   {analytics?.hasResume ? 'Yes' : 'No'}
                 </span>
               </div>
             </div>
             <Link to="/student/profile" className="mt-4 block w-full text-center text-sm text-blue-600 hover:bg-blue-50 py-2 rounded-lg transition-colors">
               Update Profile
             </Link>
          </div>
        </div>
      </div>

      <AiInsightPanel
        title="AI Career Intelligence"
        loading={aiRecLoading}
        error={aiRecError}
        onGenerate={handleGenerateCareerInsights}
        hasData={!!aiRec}
      >
        {aiRec && (
          <div className="space-y-5 text-sm text-gray-700">
            {aiRec.summary && <p className="leading-relaxed">{aiRec.summary}</p>}
            {aiRec.recommendedSkills && aiRec.recommendedSkills.length > 0 && (
              <div>
                <p className="font-semibold text-gray-900 mb-2">Recommended Skills</p>
                <div className="flex flex-wrap gap-2">
                  {aiRec.recommendedSkills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-purple-50 text-purple-700 text-xs rounded-full border border-purple-100 font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {aiRec.nextSteps && aiRec.nextSteps.length > 0 && (
              <div>
                <p className="font-semibold text-gray-900 mb-2">Next Steps</p>
                <ol className="list-decimal list-inside space-y-1">
                  {aiRec.nextSteps.map((step, i) => (
                    <li key={i} className="text-gray-600">{step}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        )}
      </AiInsightPanel>
    </div>
  );
};

export default StudentDashboard;
`;

fs.writeFileSync(studentDashboardPath, studentCode);
console.log('Student dashboard updated');

