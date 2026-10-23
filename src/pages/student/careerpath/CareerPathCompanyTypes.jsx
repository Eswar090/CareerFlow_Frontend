import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, CheckCircle2, HelpCircle, Layers, Sparkles, 
  ArrowRight, RefreshCw, Award, Target, Zap
} from 'lucide-react';
import CareerPathNav from './CareerPathNav';

const CareerPathCompanyTypes = () => {
  const comparisonData = [
    {
      criterion: 'Core Business Model',
      service: 'Delivers IT consulting, custom software development, cloud migration, and maintenance services to enterprise global clients.',
      product: 'Designs, develops, and sells proprietary consumer or B2B software products (SaaS, platforms, developer tools, hardware ecosystems).'
    },
    {
      criterion: 'Fresher Hiring Volume',
      service: 'Mass recruitment across hundreds of universities (often 10,000 to 50,000+ graduates annually per firm).',
      product: 'Selective, specialized hiring targeting specific engineering squads (usually 5 to 100 freshers per batch or team).'
    },
    {
      criterion: 'Typical Fresher CTC Band',
      service: '₹3.5 LPA to ₹9.0 LPA (differentiated tracks like Ninja vs Digital vs Prime).',
      product: '₹14 LPA to ₹45+ LPA (includes base salary, performance bonus, and stock grants/RSUs).'
    },
    {
      criterion: 'Interview & Evaluation Focus',
      service: 'Quantitative Aptitude, Logical Reasoning, Verbal Ability, Core CS basics (OOPs, DBMS, SQL), and communication clarity.',
      product: 'Deep Data Structures & Algorithms (Trees, Graphs, DP), System Design fundamentals, clean code, and challenging technical interviews.'
    },
    {
      criterion: 'Project Allocation & Work',
      service: 'Trained in corporate academies then assigned to client accounts based on billable demand. May switch domains.',
      product: 'Directly embedded into a product team maintaining and shipping features for millions of active users.'
    },
    {
      criterion: 'Career Progression & Velocity',
      service: 'Structured annual grade promotions (e.g., Trainee &rarr; Systems Engineer &rarr; Senior Engineer &rarr; Tech Lead).',
      product: 'Impact-driven career tracks (e.g., SDE-1 &rarr; SDE-2 &rarr; Senior SDE &rarr; Staff Engineer / Architect).'
    }
  ];

  // 6-Question Self-Assessment
  const questions = [
    {
      id: 1,
      prompt: 'Which type of preparation excites you the most?',
      options: [
        { label: 'Mastering DSA, LeetCode mediums/hards, and optimizing space-time complexity', points: 'PRODUCT' },
        { label: 'Building well-rounded fundamentals in Aptitude, Java/Python basics, and SQL', points: 'SERVICE' }
      ]
    },
    {
      id: 2,
      prompt: 'What is your primary initial career priority as a fresher?',
      options: [
        { label: 'High compensation and equity with high technical rigor from Day 1', points: 'PRODUCT' },
        { label: 'Structured enterprise training, job security, and global consulting exposure', points: 'SERVICE' }
      ]
    },
    {
      id: 3,
      prompt: 'How do you prefer to work on projects?',
      options: [
        { label: 'Iterating on a single product with deep architecture, scalability, and code reviews', points: 'PRODUCT' },
        { label: 'Working on varied client requirements across different technologies and industries', points: 'SERVICE' }
      ]
    },
    {
      id: 4,
      prompt: 'Where are you currently most confident?',
      options: [
        { label: 'Competitive programming, trees, graphs, dynamic programming, and systems', points: 'PRODUCT' },
        { label: 'Aptitude tests, core CS concepts (OS, DBMS, OOP), and verbal communication', points: 'SERVICE' }
      ]
    },
    {
      id: 5,
      prompt: 'How much time can you commit daily to coding and problem-solving?',
      options: [
        { label: '3 to 5 hours daily focused on DSA practice and building full-stack projects', points: 'PRODUCT' },
        { label: '1 to 2 hours daily balancing aptitude, resume preparation, and core concepts', points: 'SERVICE' }
      ]
    },
    {
      id: 6,
      prompt: 'How do you view company training programs?',
      options: [
        { label: 'I prefer minimal onboarding and jumping straight into production repositories', points: 'PRODUCT' },
        { label: 'I value formal 3-6 month corporate training academies (e.g., TCS ILP, Infosys Mysore)', points: 'SERVICE' }
      ]
    }
  ];

  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const handleSelect = (qId, type) => {
    setAnswers(prev => ({ ...prev, [qId]: type }));
  };

  const calculateResult = () => {
    let productCount = 0;
    let serviceCount = 0;
    Object.values(answers).forEach(val => {
      if (val === 'PRODUCT') productCount++;
      if (val === 'SERVICE') serviceCount++;
    });

    const total = productCount + serviceCount;
    if (total < questions.length) {
      alert(`Please answer all ${questions.length} questions to receive your tailored guidance.`);
      return;
    }

    const productPercent = Math.round((productCount / total) * 100);
    const servicePercent = 100 - productPercent;

    let verdict = '';
    let recommendation = '';
    let actionRoute = '';

    if (productPercent >= 65) {
      verdict = 'High Product & Tech Alignment';
      recommendation = `You show strong alignment (${productPercent}%) with product engineering companies. Prioritize deep DSA (LeetCode 150), clean system design, and building non-trivial portfolio projects.`;
      actionRoute = '/student/career-path/roles';
    } else if (servicePercent >= 65) {
      verdict = 'High IT Services & Consulting Alignment';
      recommendation = `You show strong alignment (${servicePercent}%) with IT service and enterprise consulting firms. Focus on quantitative aptitude speed, core CS fundamentals (OOPs, SQL, OS), and technical communication.`;
      actionRoute = '/student/career-path/companies?category=SERVICE_ORIENTED';
    } else {
      verdict = 'Balanced Hybrid Target';
      recommendation = `You have a balanced appetite (Product ${productPercent}% / Service ${servicePercent}%). A dual-track strategy works best: prepare aptitude and core skills as a baseline safety net while systematically leveling up your DSA for product drives.`;
      actionRoute = '/student/career-path/roadmaps';
    }

    setResult({
      productPercent,
      servicePercent,
      verdict,
      recommendation,
      actionRoute
    });
  };

  const resetQuiz = () => {
    setAnswers({});
    setResult(null);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto space-y-8">
      <CareerPathNav />

      {/* Guide Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          Educational Placement Guide
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Service-Based vs Product-Based Companies
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          Understanding the fundamental differences between IT Services & Consulting firms and Product & Tech companies helps you align your preparation, focus on the right skills, and make informed placement decisions.
        </p>
      </div>

      {/* Comparison Matrix Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0d132b] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-500" />
          Side-by-Side Architectural Comparison
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10">
                <th className="py-3 px-4 font-bold text-slate-400 uppercase text-[11px] w-1/4">Evaluation Criterion</th>
                <th className="py-3 px-4 font-bold text-blue-600 dark:text-blue-400 uppercase text-[11px] w-[37.5%] bg-blue-50/50 dark:bg-blue-950/20 rounded-tl-xl">
                  IT Services & Consulting
                </th>
                <th className="py-3 px-4 font-bold text-violet-600 dark:text-violet-400 uppercase text-[11px] w-[37.5%] bg-violet-50/50 dark:bg-violet-950/20 rounded-tr-xl">
                  Product & Technology
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {comparisonData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.01]">
                  <td className="py-4 px-4 font-bold text-slate-900 dark:text-white align-top">
                    {row.criterion}
                  </td>
                  <td className="py-4 px-4 text-slate-600 dark:text-slate-300 bg-blue-50/30 dark:bg-blue-950/10 leading-relaxed align-top">
                    {row.service}
                  </td>
                  <td className="py-4 px-4 text-slate-600 dark:text-slate-300 bg-violet-50/30 dark:bg-violet-950/10 leading-relaxed align-top">
                    {row.product}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6-Question Self-Assessment Questionnaire */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0d132b] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Interactive Self-Assessment
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Which Category Best Fits Your Goals?
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Answer 6 quick questions to discover your target alignment and recommended preparation strategy.
            </p>
          </div>

          {result && (
            <button
              onClick={resetQuiz}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/5 hover:bg-slate-200"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retake Quiz</span>
            </button>
          )}
        </div>

        {/* Questionnaire List */}
        <div className="space-y-6">
          {questions.map((q) => (
            <div key={q.id} className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center">
                  {q.id}
                </span>
                {q.prompt}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-7">
                {q.options.map((opt, optIdx) => {
                  const isSelected = answers[q.id] === opt.points;
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelect(q.id, opt.points)}
                      className={`text-left p-3.5 rounded-xl text-xs font-medium transition-all flex items-start gap-3 border ${
                        isSelected
                          ? opt.points === 'PRODUCT'
                            ? 'bg-violet-500/10 border-violet-500/40 text-violet-700 dark:text-violet-300 shadow-sm'
                            : 'bg-blue-500/10 border-blue-500/40 text-blue-700 dark:text-blue-300 shadow-sm'
                          : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full mt-0.5 flex items-center justify-center border flex-shrink-0 ${
                        isSelected
                          ? opt.points === 'PRODUCT' ? 'border-violet-600 bg-violet-600 text-white' : 'border-blue-600 bg-blue-600 text-white'
                          : 'border-slate-300 dark:border-white/20'
                      }`}>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <span className="leading-relaxed">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Submit or Result */}
        {!result ? (
          <div className="pt-2">
            <button
              onClick={calculateResult}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-sm shadow-md shadow-indigo-600/30 hover:scale-[1.01] transition-transform"
            >
              Calculate My Placement Alignment
            </button>
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-[#0a0f24] text-white border border-indigo-500/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs uppercase font-bold text-indigo-400 tracking-wider">Your Recommendation</span>
                <h3 className="text-xl font-black text-white mt-0.5">{result.verdict}</h3>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold">
                <div className="px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-400/30">
                  Product Match: {result.productPercent}%
                </div>
                <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  Services Match: {result.servicePercent}%
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {result.recommendation}
            </p>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-400">Ready to take the next step?</span>
              <Link
                to={result.actionRoute}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold transition-colors"
              >
                <span>Continue Preparation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerPathCompanyTypes;

