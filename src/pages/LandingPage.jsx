import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, Building2, ShieldCheck, ArrowRight, Sparkles, CheckCircle2, 
  Award, Calendar, Users, TrendingUp, Layers, ChevronRight, Menu, X, 
  Compass, FileCheck, Check, Star, Zap, Cpu
} from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#070b19] text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-[#070b19]/80 backdrop-blur-xl border-b border-white/10 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow">
              <div className="w-full h-full bg-[#0b1020] rounded-[11px] flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <span className="text-2xl font-black tracking-tight text-white flex items-center gap-1">
              Career<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Flow</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#placement-drives" className="hover:text-white transition-colors">Placement Drives</a>
            <a href="#ai-intelligence" className="hover:text-white transition-colors">AI Intelligence</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <Link 
              to="/login" 
              className="px-5 py-2.5 text-sm font-semibold text-slate-200 hover:text-white hover:bg-white/5 rounded-xl transition-all"
            >
              Sign In
            </Link>
            <Link 
              to="/register" 
              className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0b1020]/95 backdrop-blur-2xl border-b border-white/10 px-6 py-6 space-y-4 animate-fade-in">
            <nav className="flex flex-col space-y-3 text-base font-semibold text-slate-300">
              <a 
                href="#features" 
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-indigo-400 py-1"
              >
                Features
              </a>
              <a 
                href="#placement-drives" 
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-indigo-400 py-1"
              >
                Placement Drives
              </a>
              <a 
                href="#ai-intelligence" 
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-indigo-400 py-1"
              >
                AI Intelligence
              </a>
              <a 
                href="#how-it-works" 
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-indigo-400 py-1"
              >
                How It Works
              </a>
            </nav>
            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
              <Link 
                to="/login" 
                className="w-full py-2.5 text-center text-sm font-semibold text-slate-200 bg-white/5 rounded-xl"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="w-full py-2.5 text-center text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl shadow-lg shadow-indigo-600/30"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* =========================================================================
            HERO SECTION — HIGH IMPACT TWO-COLUMN WITH GLASSMORPHISM & DASHBOARD PREVIEW
           ========================================================================= */}
        <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden">
          {/* Ambient Lighting Spheres */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-indigo-600/20 blur-[140px] pointer-events-none rounded-full" />
          <div className="absolute top-1/3 left-10 w-[450px] h-[450px] bg-cyan-500/15 blur-[120px] pointer-events-none rounded-full" />
          <div className="absolute top-1/2 right-10 w-[500px] h-[500px] bg-purple-600/20 blur-[130px] pointer-events-none rounded-full" />

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* Left Column: Headline, Copy, CTAs, Trust Signals */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                {/* Premium Small Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-bold tracking-wide shadow-inner">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>NEXT-GEN CAMPUS PLACEMENT & RECRUITMENT SAAS</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] text-white">
                  Accelerate Your Career. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-cyan-400">
                    Your Skills. Your Future.
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  CareerFlow connects ambitious students with top enterprise recruiters. Experience automated campus placement drives, AI-powered skill gap intelligence, and real-time application pipelines.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                  <Link 
                    to="/register" 
                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-2xl shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-0.5 transition-all text-base flex items-center justify-center gap-3 group"
                  >
                    Start Your Career
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link 
                    to="/login" 
                    className="w-full sm:w-auto px-7 py-4 bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white font-bold rounded-2xl border border-white/10 hover:border-indigo-400/30 transition-all text-base flex items-center justify-center gap-2 backdrop-blur-sm"
                  >
                    <Compass className="w-5 h-5 text-indigo-400" />
                    Explore Opportunities
                  </Link>
                </div>

                {/* Trust Indicators / Badges */}
                <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-slate-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Real-Time Skill Matching</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>Automated Drive Eligibility</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                    <span>AI Career Intelligence</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Polished SaaS Dashboard Preview with Floating Glass Cards */}
              <div className="lg:col-span-5 relative mt-6 lg:mt-0">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  
                  {/* Decorative Glow Ring behind Mockup */}
                  <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 rounded-3xl blur-xl opacity-30 animate-pulse-subtle" />

                  {/* Main Dashboard Preview Card */}
                  <div className="relative bg-[#0d1527]/90 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 shadow-2xl shadow-indigo-950/60 overflow-hidden">
                    
                    {/* Window Controls & Title */}
                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                        <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                      </div>
                      <span className="text-[11px] font-mono font-medium text-slate-400 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> careerflow.portal/dashboard
                      </span>
                    </div>

                    {/* Candidate Quick Header */}
                    <div className="flex items-center justify-between bg-slate-900/60 border border-white/10 p-3.5 rounded-2xl mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 text-white font-bold flex items-center justify-center text-sm shadow-md">
                          JS
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">Alex Morgan</div>
                          <div className="text-[11px] font-medium text-slate-400">B.Tech Computer Science • CGPA: 8.9</div>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-full">
                        ACTIVE PLACEMENT
                      </span>
                    </div>

                    {/* Application Progress Timeline */}
                    <div className="bg-slate-900/60 border border-white/10 p-4 rounded-2xl mb-4">
                      <div className="flex items-center justify-between text-xs mb-3">
                        <span className="font-bold text-slate-300">Application Pipeline</span>
                        <span className="text-cyan-400 font-bold text-[11px]">Stage 3 of 4</span>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-semibold">
                        <div className="p-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-lg">
                          ✓ Applied
                        </div>
                        <div className="p-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-lg">
                          ✓ Shortlisted
                        </div>
                        <div className="p-2 bg-indigo-500/30 border border-indigo-400/50 text-indigo-300 rounded-lg animate-pulse">
                          ● Tech Round
                        </div>
                        <div className="p-2 bg-slate-800/40 text-slate-500 rounded-lg">
                          Selection
                        </div>
                      </div>
                    </div>

                    {/* Top Job Matching Meter */}
                    <div className="bg-gradient-to-br from-indigo-950/60 to-slate-900/60 border border-indigo-500/20 p-4 rounded-2xl">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-indigo-400" />
                          <span className="text-xs font-bold text-white">Full-Stack Engineer Role</span>
                        </div>
                        <span className="text-sm font-black text-indigo-400">94% MATCH</span>
                      </div>
                      
                      <div className="w-full bg-slate-800 rounded-full h-2 mb-3 overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 h-full rounded-full w-[94%]" />
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-[10px] font-semibold rounded-md border border-indigo-500/30">Java</span>
                        <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-[10px] font-semibold rounded-md border border-indigo-500/30">Spring Boot</span>
                        <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-[10px] font-semibold rounded-md border border-indigo-500/30">React</span>
                        <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-[10px] font-semibold rounded-md border border-indigo-500/30">MySQL</span>
                      </div>
                    </div>
                  </div>

                  {/* Floating Glass Card 1: Top-Right (Placement Drive Notification) */}
                  <div className="absolute -top-6 -right-6 hidden sm:flex items-center gap-3 bg-slate-900/90 backdrop-blur-xl border border-emerald-500/30 p-3.5 rounded-2xl shadow-xl shadow-black/50 animate-float">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center flex-shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Shortlisted
                      </div>
                      <div className="text-xs font-bold text-white">Amazon Campus Drive</div>
                    </div>
                  </div>

                  {/* Floating Glass Card 2: Bottom-Left (AI Career Intelligence) */}
                  <div className="absolute -bottom-6 -left-6 hidden sm:flex items-center gap-3 bg-slate-900/90 backdrop-blur-xl border border-indigo-500/30 p-3.5 rounded-2xl shadow-xl shadow-black/50 animate-float-reverse">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-indigo-400 uppercase">AI Recommendation</div>
                      <div className="text-xs font-bold text-white">Eligible for 12 Top Drives</div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* =========================================================================
            PLATFORM PILLARS & CORE CAPABILITIES
           ========================================================================= */}
        <section id="features" className="py-24 bg-[#0a0f24] relative border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-indigo-500/10 border border-indigo-400/20 text-indigo-400">
                End-To-End Architecture
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Designed for Students, Built for Recruiters, Governed by Colleges
              </h2>
              <p className="text-slate-400 text-base">
                Everything required to conduct transparent campus recruitments and personalized student career trajectories in one connected platform.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Pillar 1: Students */}
              <div className="bg-[#0f172a]/70 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-indigo-500/40 hover:-translate-y-1 transition-all group shadow-xl">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                  <Briefcase className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">For Students & Graduates</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Build verified academic profiles, calculate live skill match scores for open vacancies, and verify placement drive eligibility automatically.
                </p>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> Automated CGPA & Backlog compliance check
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> AI Resume parsing and gap analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> One-click campus drive registration
                  </li>
                </ul>
              </div>

              {/* Pillar 2: Recruiters */}
              <div className="bg-[#0f172a]/70 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-cyan-500/40 hover:-translate-y-1 transition-all group shadow-xl">
                <div className="w-14 h-14 rounded-2xl bg-cyan-600/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                  <Building2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">For Recruiters & Enterprise</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Post targeted job openings, conduct structured recruitment drives, evaluate candidate pipelines, and shortlist qualified candidates with remarks.
                </p>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-400" /> Company drive pipeline management
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-400" /> Shortlist, select, or reject with feedback
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-400" /> Integrated interview scheduling
                  </li>
                </ul>
              </div>

              {/* Pillar 3: Admins */}
              <div className="bg-[#0f172a]/70 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-violet-500/40 hover:-translate-y-1 transition-all group shadow-xl">
                <div className="w-14 h-14 rounded-2xl bg-violet-600/10 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-6 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">For Placement Officers & Admins</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Create campus placement drives with branch and CGPA thresholds, oversee applicant distribution, and monitor placement statistics across the institute.
                </p>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-violet-400" /> Institutional drive configuration
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-violet-400" /> Platform-wide recruitment analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-violet-400" /> User and company account governance
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </section>

        {/* =========================================================================
            CAMPUS PLACEMENT DRIVES SPOTLIGHT
           ========================================================================= */}
        <section id="placement-drives" className="py-24 bg-[#070b19] relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-gradient-to-br from-indigo-950/60 via-slate-900/80 to-[#0b1020] border border-indigo-500/20 rounded-3xl p-8 md:p-14 shadow-2xl relative overflow-hidden">
              
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[100px] pointer-events-none rounded-full" />

              <div className="grid lg:grid-cols-2 gap-10 items-center">
                <div className="space-y-6">
                  <span className="px-3 py-1 rounded-md text-xs font-bold tracking-wider uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Automated Eligibility Engine
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    Smart Campus Placement Drive Management
                  </h2>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    Say goodbye to manual Excel filtering and paper eligibility checks. CareerFlow's eligibility engine evaluates candidate credentials against drive prerequisites before registration.
                  </p>

                  <div className="grid sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <div className="text-indigo-400 font-bold text-sm mb-1">Branch Matching</div>
                      <p className="text-xs text-slate-400">Intelligent synonym & acronym filtering (CSE, ECE, IT, AI/DS, or ALL).</p>
                    </div>

                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <div className="text-cyan-400 font-bold text-sm mb-1">CGPA Threshold</div>
                      <p className="text-xs text-slate-400">Instant verification against minimum grade point average criteria.</p>
                    </div>

                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <div className="text-emerald-400 font-bold text-sm mb-1">Backlog Restriction</div>
                      <p className="text-xs text-slate-400">Zero or capped active backlog restrictions enforced automatically.</p>
                    </div>

                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <div className="text-rose-400 font-bold text-sm mb-1">Deadline Enforcement</div>
                      <p className="text-xs text-slate-400">Automated registration window closure and candidate withdrawal controls.</p>
                    </div>
                  </div>
                </div>

                {/* Interactive Drive Card Preview */}
                <div className="bg-[#0f172a] border border-white/15 rounded-3xl p-6 shadow-2xl space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                        Campus Drive Preview
                      </span>
                      <h4 className="text-lg font-bold text-white mt-1">Google Enterprise Drive 2025</h4>
                      <p className="text-xs text-slate-400">Google Inc. • Campus Auditorium & Virtual</p>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/30">
                      PUBLISHED
                    </span>
                  </div>

                  {/* Criteria Bar */}
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 bg-slate-800 text-slate-200 rounded-lg font-semibold">
                      Min CGPA: 7.5
                    </span>
                    <span className="px-2.5 py-1 bg-slate-800 text-slate-200 rounded-lg font-semibold">
                      Max Backlogs: 0
                    </span>
                    <span className="px-2.5 py-1 bg-slate-800 text-indigo-300 rounded-lg font-semibold">
                      CSE, IT, ECE
                    </span>
                  </div>

                  {/* Verification Banner */}
                  <div className="bg-emerald-500/10 border border-emerald-500/30 p-3.5 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      <span className="text-xs font-bold text-emerald-300">You are eligible to register!</span>
                    </div>
                    <span className="px-3 py-1 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow-md">
                      Register Now
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            AI CAREER INTELLIGENCE SECTION
           ========================================================================= */}
        <section id="ai-intelligence" className="py-24 bg-[#0a0f24] relative border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-cyan-500/10 border border-cyan-400/20 text-cyan-400">
                Gemini AI In Java
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                AI-Powered Career Intelligence
              </h2>
              <p className="text-slate-400 text-base">
                Actionable feedback, resume gap analysis, and tailored learning roadmaps calculated right inside CareerFlow.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-[#0f172a]/70 border border-white/10 rounded-3xl p-8 hover:border-indigo-400/30 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6">
                  <FileCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Resume Intelligence</h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Extracts text and projects from PDF resumes using Apache PDFBox to evaluate relevance against industry criteria.
                </p>
              </div>

              <div className="bg-[#0f172a]/70 border border-white/10 rounded-3xl p-8 hover:border-violet-400/30 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mb-6">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Skill Gap Diagnosis</h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Identifies missing technical and soft skills for your target job roles with personalized recommendation steps.
                </p>
              </div>

              <div className="bg-[#0f172a]/70 border border-white/10 rounded-3xl p-8 hover:border-cyan-400/30 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-6">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Learning Roadmaps</h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Generates customized step-by-step milestones to help candidates acquire missing competencies before interview rounds.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            HOW CAREERFLOW WORKS — 4-STEP PROGRESSION
           ========================================================================= */}
        <section id="how-it-works" className="py-24 bg-[#070b19] relative border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-violet-500/10 border border-violet-400/20 text-violet-400">
                Simple & Transparent
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                How CareerFlow Works
              </h2>
              <p className="text-slate-400 text-base">
                Four streamlined steps from onboarding to offer letter.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {/* Step 1 */}
              <div className="bg-[#0f172a]/60 border border-white/10 rounded-3xl p-6 relative">
                <div className="text-3xl font-black text-indigo-500/30 mb-3">01</div>
                <h4 className="text-base font-bold text-white mb-2">Create Profile</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Add your degree, branch, CGPA, backlogs, projects, certifications, and skills to form your master credential.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-[#0f172a]/60 border border-white/10 rounded-3xl p-6 relative">
                <div className="text-3xl font-black text-cyan-500/30 mb-3">02</div>
                <h4 className="text-base font-bold text-white mb-2">Discover Drives</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Browse campus placement drives and job vacancies with automatic real-time eligibility screening.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-[#0f172a]/60 border border-white/10 rounded-3xl p-6 relative">
                <div className="text-3xl font-black text-violet-500/30 mb-3">03</div>
                <h4 className="text-base font-bold text-white mb-2">Track Pipeline</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Follow application stages from Shortlisting to Interview schedules with instant notification dispatch.
                </p>
              </div>

              {/* Step 4 */}
              <div className="bg-[#0f172a]/60 border border-white/10 rounded-3xl p-6 relative">
                <div className="text-3xl font-black text-emerald-500/30 mb-3">04</div>
                <h4 className="text-base font-bold text-white mb-2">Secure Offers</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Receive verified offer updates and celebrate your career progression with clear institutional records.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            FINAL PRE-FOOTER CTA SECTION
           ========================================================================= */}
        <section className="py-20 relative">
          <div className="max-w-6xl mx-auto px-6">
            <div className="bg-gradient-to-r from-indigo-900 via-indigo-600 to-violet-700 rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                  Ready to Transform Your Campus Placements?
                </h2>
                <p className="text-indigo-100 text-sm sm:text-base leading-relaxed">
                  Join CareerFlow today. Whether you are a student preparing for campus recruitment or a recruiter seeking top talent, we have you covered.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                  <Link 
                    to="/register" 
                    className="w-full sm:w-auto px-8 py-3.5 bg-white text-indigo-700 hover:bg-slate-100 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    Create Free Account <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link 
                    to="/login" 
                    className="w-full sm:w-auto px-8 py-3.5 bg-indigo-800/60 hover:bg-indigo-800 text-white font-bold rounded-xl border border-white/20 transition-all flex items-center justify-center"
                  >
                    Sign In to Portal
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =========================================================================
          COMPLETE PROFESSIONAL 4-COLUMN FOOTER
         ========================================================================= */}
      <footer className="bg-[#050814] border-t border-white/10 py-16 text-slate-400 text-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
            
            {/* Col 1: Brand & Status (spans 2 cols) */}
            <div className="lg:col-span-2 space-y-4">
              <Link to="/" className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                  <Briefcase className="w-4 h-4" />
                </div>
                <span className="text-xl font-black text-white tracking-tight">
                  Career<span className="text-indigo-400">Flow</span>
                </span>
              </Link>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Smart campus recruitment and career intelligence platform. Powering automated placement drives, AI skill matching, and transparent hiring pipelines.
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 pt-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>All CareerFlow Services Operational</span>
              </div>
            </div>

            {/* Col 2: Platform Features */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Platform</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/student/jobs" className="hover:text-white transition-colors">Job Search</Link></li>
                <li><Link to="/student/placement-drives" className="hover:text-white transition-colors">Campus Placement Drives</Link></li>
                <li><Link to="/student/skills" className="hover:text-white transition-colors">Skill Match Engine</Link></li>
                <li><Link to="/student/dashboard" className="hover:text-white transition-colors">AI Career Guidance</Link></li>
              </ul>
            </div>

            {/* Col 3: Portals */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Portals</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/student/dashboard" className="hover:text-white transition-colors">Student Portal</Link></li>
                <li><Link to="/recruiter/dashboard" className="hover:text-white transition-colors">Recruiter Center</Link></li>
                <li><Link to="/admin/dashboard" className="hover:text-white transition-colors">Placement Admin</Link></li>
                <li><Link to="/student/applications" className="hover:text-white transition-colors">Application Tracker</Link></li>
              </ul>
            </div>

            {/* Col 4: Account & Auth */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Account</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/login" className="hover:text-white transition-colors">Student Login</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Recruiter Sign In</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Create Free Account</Link></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">Platform Workflow</a></li>
              </ul>
            </div>

          </div>

          {/* Bottom Copyright Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} CareerFlow Platform. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span>Enterprise Placement SaaS</span>
              <span>•</span>
              <span>Java 21 & React</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
