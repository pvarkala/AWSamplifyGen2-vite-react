import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const ProfilePage: React.FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect to the actual profile management page
    navigate('/app/profile/management', { replace: true })
  }, [navigate])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading profile...</p>
      </div>
    </div>
  )
}

export default ProfilePage
