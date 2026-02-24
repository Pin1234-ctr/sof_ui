import React from 'react'
import { Award, BookOpen, Trophy, TrendingUp, Users, Target } from 'lucide-react';
import { useAuth } from '../common/helper/AuthContext';

function Home() {
  const { openLoginModal } = useAuth();

  return (
    <div className="bg-gradient-to-br from-blue-50 via-green-50 to-blue-50">
      {/* Hero Section */}
      <section className="  mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-6">
            <Award className="size-4" />
            <span className="text-sm">Trusted by 10,000+ Students</span>
          </div>
          <h2 className="text-4xl md:text-6xl mb-6 text-blue-900">
            Master Your SOF Olympiad Preparation
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Comprehensive preparation platform for IMO, NSO, IEO, and other Science Olympiad Foundation exams. Smart learning, personalized practice, and detailed analytics.
          </p>
          <button onClick={openLoginModal} className="bg-blue-600 hover:bg-blue-700 text-lg text-white px-4 py-3 rounded-lg cursor-pointer">
            Get Started Today
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="  mx-auto px-4 py-16">
        <h3 className="text-center text-blue-900 mb-12">Why Choose SOF Prep Excellence?</h3>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="size-6 text-blue-600" />
            </div>
            <h4 className="text-blue-900 mb-2">Extensive Resource Library</h4>
            <p className="text-gray-600">
              Upload and organize study materials, books, and question sets. Easy access for students anytime.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-green-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Target className="size-6 text-green-600" />
            </div>
            <h4 className="text-blue-900 mb-2">Smart Study Analytics</h4>
            <p className="text-gray-600">
              AI-driven insights identify weak areas and provide personalized improvement tips for each student.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="size-6 text-blue-600" />
            </div>
            <h4 className="text-blue-900 mb-2">Performance Tracking</h4>
            <p className="text-gray-600">
              Monitor progress with detailed charts and graphs. Track improvement over time with comprehensive analytics.
            </p>
          </div>
        </div>
      </section>

      {/* For Parents Section */}
      <section className="bg-white py-16">
        <div className="  mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Users className="size-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-blue-900 mb-4">For Parents</h3>
              <p className="text-xl text-gray-600">
                Complete control and visibility into your child's learning journey
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600">✓</span>
                </div>
                <div>
                  <h5 className="text-blue-900 mb-1">Manage Multiple Children</h5>
                  <p className="text-gray-600 text-sm">Create and manage accounts for all your children from one dashboard</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600">✓</span>
                </div>
                <div>
                  <h5 className="text-blue-900 mb-1">Custom Test Generation</h5>
                  <p className="text-gray-600 text-sm">Assign specific topics and difficulty levels for targeted practice</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600">✓</span>
                </div>
                <div>
                  <h5 className="text-blue-900 mb-1">Upload Study Materials</h5>
                  <p className="text-gray-600 text-sm">Drag-and-drop interface for books, PDFs, and question sets</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600">✓</span>
                </div>
                <div>
                  <h5 className="text-blue-900 mb-1">Real-time Progress Reports</h5>
                  <p className="text-gray-600 text-sm">Track performance metrics and improvement trends</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="  mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Trophy className="size-6" />
            <span>SOF Prep Excellence</span>
          </div>
          <p className="text-blue-200 text-sm">
            Empowering students to excel in Science Olympiad Foundation exams
          </p>
          <p className="text-blue-300 text-xs mt-4">
            © 2025 Aiinhome Technologies Private Limited.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Home