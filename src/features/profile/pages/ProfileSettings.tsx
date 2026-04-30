import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft, Shield, Bell, Globe, Palette } from 'lucide-react'
import { useAuthStore } from '../../../store/authStore'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import toast from 'react-hot-toast'

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  location: z.string().max(100, 'Location must be less than 100 characters').optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password confirmation is required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

const emailSchema = z.object({
  newEmail: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password is required to change email'),
})

type ProfileFormData = z.infer<typeof profileSchema>
type PasswordFormData = z.infer<typeof passwordSchema>
type EmailFormData = z.infer<typeof emailSchema>

const ProfileSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences'>('profile')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showEmailPassword, setShowEmailPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  
  const { user, isAuthenticated, updateProfile, logout } = useAuthStore()

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      bio: user?.bio || '',
      location: user?.location || '',
      website: user?.website || '',
    },
  })

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  })

  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  })

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login')
    }
  }, [isAuthenticated, navigate])

  const onProfileSubmit = async (data: ProfileFormData) => {
    setIsLoading(true)
    try {
      await updateProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        bio: data.bio,
        location: data.location,
        website: data.website,
      })
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const onPasswordSubmit = async (_data: PasswordFormData) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Password changed successfully!')
      setShowCurrentPassword(false)
      setShowNewPassword(false)
      setShowConfirmPassword(false)
    } catch (error) {
      toast.error('Failed to change password')
    } finally {
      setIsLoading(false)
    }
  }

  const onEmailSubmit = async (_data: EmailFormData) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Email updated successfully!')
      setShowEmailPassword(false)
    } catch (error) {
      toast.error('Failed to update email')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/auth/login')
    toast.success('Logged out successfully')
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <Button
              variant="outline"
              onClick={() => navigate('/app/dashboard')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
          </div>

          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'profile'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'security'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Security
                </button>
                <button
                  onClick={() => setActiveTab('preferences')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'preferences'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Preferences
                </button>
              </nav>
            </div>
          </div>

          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="First name"
                      type="text"
                      placeholder="John"
                      {...registerProfile('firstName')}
                      error={profileErrors.firstName?.message}
                      disabled={isLoading}
                    />
                    <Input
                      label="Last name"
                      type="text"
                      placeholder="Doe"
                      {...registerProfile('lastName')}
                      error={profileErrors.lastName?.message}
                      disabled={isLoading}
                    />
                  </div>

                  <Input
                    label="Email address"
                    type="email"
                    placeholder="john@example.com"
                    {...registerProfile('email')}
                    error={profileErrors.email?.message}
                    disabled={isLoading}
                  />

                  <Input
                    label="Bio"
                    type="textarea"
                    placeholder="Tell us about yourself..."
                    {...registerProfile('bio')}
                    error={profileErrors.bio?.message}
                    disabled={isLoading}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Location"
                      type="text"
                      placeholder="San Francisco, CA"
                      {...registerProfile('location')}
                      error={profileErrors.location?.message}
                      disabled={isLoading}
                    />
                    <Input
                      label="Website"
                      type="text"
                      placeholder="https://yourwebsite.com"
                      {...registerProfile('website')}
                      error={profileErrors.website?.message}
                      disabled={isLoading}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    variant="gradient"
                    loading={isLoading}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save Profile'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lock className="w-5 h-5 mr-2" />
                    Change Password
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-6">
                    <Input
                      label="Current password"
                      type={showCurrentPassword ? 'text' : 'password'}
                      placeholder="Enter current password"
                      {...registerPassword('currentPassword')}
                      error={passwordErrors.currentPassword?.message}
                      disabled={isLoading}
                      rightIcon={
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      }
                    />

                    <Input
                      label="New password"
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      {...registerPassword('newPassword')}
                      error={passwordErrors.newPassword?.message}
                      disabled={isLoading}
                      rightIcon={
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      }
                    />

                    <Input
                      label="Confirm new password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm new password"
                      {...registerPassword('confirmPassword')}
                      error={passwordErrors.confirmPassword?.message}
                      disabled={isLoading}
                      rightIcon={
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      }
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      variant="gradient"
                      loading={isLoading}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Changing...' : 'Change Password'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="w-5 h-5 mr-2" />
                    Change Email Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleEmailSubmit(onEmailSubmit)} className="space-y-6">
                    <Input
                      label="New email address"
                      type="email"
                      placeholder="Enter new email address"
                      {...registerEmail('newEmail')}
                      error={emailErrors.newEmail?.message}
                      disabled={isLoading}
                    />

                    <Input
                      label="Current password"
                      type={showEmailPassword ? 'text' : 'password'}
                      placeholder="Enter your password to confirm"
                      {...registerEmail('password')}
                      error={emailErrors.password?.message}
                      disabled={isLoading}
                      rightIcon={
                        <button
                          type="button"
                          onClick={() => setShowEmailPassword(!showEmailPassword)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {showEmailPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      }
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      variant="gradient"
                      loading={isLoading}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Sending...' : 'Change Email'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'preferences' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="w-5 h-5 mr-2" />
                  Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Bell className="w-5 h-5 mr-2 text-gray-400" />
                      <span className="text-sm font-medium">Email Notifications</span>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                      <span className="sr-only">Toggle email notifications</span>
                      <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition"></span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Globe className="w-5 h-5 mr-2 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">Language</span>
                    </div>
                    <select className="block w-32 rounded-md border shadow-sm focus:ring-2 focus:ring-primary focus:border-primary text-sm bg-background text-foreground">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">Profile Visibility</span>
                    </div>
                    <select className="block w-32 rounded-md border shadow-sm focus:ring-2 focus:ring-primary focus:border-primary text-sm bg-background text-foreground">
                      <option>Public</option>
                      <option>Private</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="w-full"
                  >
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default ProfileSettings
