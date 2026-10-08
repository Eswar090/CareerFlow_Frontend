import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Building, ShieldCheck, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <header className="border-b px-6 py-4 flex items-center justify-between">
        <div className="text-2xl font-bold text-blue-600 flex items-center gap-2">
          <Briefcase className="w-8 h-8" /> CareerFlow
        </div>
        <nav className="hidden md:flex gap-6 text-gray-600 font-medium">
          <a href="#features" className="hover:text-blue-600">Features</a>
          <a href="#how-it-works" className="hover:text-blue-600">How it Works</a>
        </nav>
        <div className="flex gap-4">
          <Link to="/login" className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg">Login</Link>
          <Link to="/register" className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">Get Started</Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-20 px-6 max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6">Build Your Career. <br className="hidden md:block"/> Discover Better Opportunities.</h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">CareerFlow is the smart recruitment and career management platform helping you manage your profile, discover jobs, track applications, and improve your skills.</p>
          <div className="flex justify-center gap-4">
             <Link to="/register" className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 text-lg flex items-center gap-2">Get Started <ArrowRight className="w-5 h-5"/></Link>
             <Link to="/login" className="px-8 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 text-lg">Login</Link>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 bg-gray-50 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Who is it for?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <Briefcase className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-3">For Job Seekers</h3>
                <p className="text-gray-600">Manage your career profile, track job applications, discover relevant roles, and analyze skill gaps.</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <Building className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-3">For Recruiters</h3>
                <p className="text-gray-600">Post jobs, manage applicants, schedule interviews, and find the perfect candidates easily.</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <ShieldCheck className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-3">For Administrators</h3>
                <p className="text-gray-600">Monitor platform usage, manage users, and analyze recruitment metrics globally.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} CareerFlow. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
