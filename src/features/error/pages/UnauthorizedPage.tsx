import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, ArrowLeft, Home } from 'lucide-react'
import { Button } from '../../../components/ui/Button'

const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md w-full"
      >
        <div className="mb-8">
          <div className="w-32 h-32 bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-16 h-16 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          
          <p className="text-gray-600 mb-8">
            You don't have permission to access this page. Please contact your administrator if you think this is an error.
          </p>
        </div>

        <div className="space-y-4">
          <Link to="/app/dashboard">
            <Button className="w-full" variant="outline">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <Link to="/">
            <Button className="w-full" variant="gradient">
              <Home className="w-5 h-5 mr-2" />
              Go to Homepage
            </Button>
          </Link>
        </div>

        <div className="mt-12">
          <p className="text-sm text-gray-500">
            Need help? Contact your team administrator or support team.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default UnauthorizedPage
