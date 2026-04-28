import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <span className="ml-3 text-3xl font-bold">TodoPro</span>
          </div>
          
          <h1 className="text-4xl font-bold mb-4 text-center">
            Transform Your Workflow
          </h1>
          <p className="text-xl text-white/90 mb-8 text-center max-w-md">
            Experience the next generation of project management with AI-powered insights and real-time collaboration.
          </p>
          
          <div className="space-y-4 w-full max-w-md">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-white/90">AI-powered task prioritization</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-white/90">Real-time team collaboration</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-white/90">Advanced analytics & insights</span>
            </div>
          </div>
        </div>
        
        {/* Background Elements */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      </div>
      
      {/* Right Side - Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
              <Sparkles className="w-6 h-6 mr-2" />
              <span className="text-xl font-bold">TodoPro</span>
            </Link>
          </div>
          
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
