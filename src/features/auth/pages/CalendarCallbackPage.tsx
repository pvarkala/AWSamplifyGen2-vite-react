import React, { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { useAuthStore } from '../../../store/authStore'
import { calendarService } from '../../../lib/calendar-service'
import toast from 'react-hot-toast'

const CalendarCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user, updateProfile } = useAuthStore()

  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  useEffect(() => {
    const handleCalendarCallback = async () => {
      if (error) {
        toast.error('Calendar connection failed: ' + error)
        navigate('/app/profile?tab=security')
        return
      }

      if (!code || !state) {
        toast.error('Invalid calendar callback parameters')
        navigate('/app/profile?tab=security')
        return
      }

      try {
        // Exchange authorization code for access token
        const tokenResponse = await calendarService.exchangeCodeForToken(code, state)
        
        // Get user profile information
        // const userProfile = await calendarService.getUserProfile(tokenResponse.access_token)
        console.log('User profile retrieved (temporarily disabled)')

        // Update user with calendar connection info
        if (user) {
          await updateProfile({
            calendarConnected: true,
            calendarProvider: 'google',
            calendarAccessToken: tokenResponse.access_token,
            updatedAt: new Date()
          })
          
          toast.success('Google Calendar connected successfully!')
          navigate('/app/profile?tab=security')
        }
      } catch (error) {
        console.error('Calendar connection error:', error)
        toast.error('Failed to connect Google Calendar')
        navigate('/app/profile?tab=security')
      }
    }

    handleCalendarCallback()
  }, [code, state, error, user, updateProfile, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full mx-4"
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          {error ? (
            <>
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Connection Failed
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                There was an error connecting your Google Calendar.
              </p>
              <button
                onClick={() => navigate('/app/profile?tab=security')}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Profile
              </button>
            </>
          ) : (
            <>
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <CheckCircle className="w-8 h-8 text-green-500 absolute top-0 right-0" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Connecting Calendar
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Please wait while we connect your Google Calendar...
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default CalendarCallbackPage
