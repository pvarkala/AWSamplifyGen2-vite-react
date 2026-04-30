import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Save,
  Shield,
  Bell,
  Globe,
  Palette,
  Upload,
  Camera,
  Calendar,
  CreditCard,
  Settings,
  Users,
  Clock,
  Star,
  Award,
  TrendingUp,
  Download,
  Trash2,
  Edit2,
  CheckSquare,
  FolderOpen,
  MessageSquare,
  Video,
  Phone
} from 'lucide-react'
import { useAuthStore } from '../../../store/authStore'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { ThemeToggle } from '../../../components/ui/ThemeToggle'
import toast from 'react-hot-toast'

/* ---------------- schemas ---------------- */

const profileSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
  website: z.string().url().optional().or(z.literal('')),
  phone: z.string().max(20).optional(),
  timezone: z.string().max(50).optional(),
  language: z.string().max(10).optional(),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
  confirmPassword: z.string().min(6),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

const emailSchema = z.object({
  newEmail: z.string().email(),
  password: z.string().min(6),
})

const deleteAccountSchema = z.object({
  confirmation: z.string().min(1),
})

type ProfileFormData = z.infer<typeof profileSchema>
type PasswordFormData = z.infer<typeof passwordSchema>
type EmailFormData = z.infer<typeof emailSchema>
type DeleteAccountFormData = z.infer<typeof deleteAccountSchema>

const ProfileManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'personal' | 'security' | 'notifications' | 'privacy' | 'activity' | 'billing'
  >('overview')

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showEmailPassword, setShowEmailPassword] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const navigate = useNavigate()
  const { user, isAuthenticated, updateProfile, logout, connectGoogleCalendar, disconnectGoogleCalendar } =
    useAuthStore()

  const { register: registerProfile, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors }, reset: resetProfile } =
    useForm<ProfileFormData>({ resolver: zodResolver(profileSchema) })

  const { register: registerPassword, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors }, reset: resetPassword } =
    useForm<PasswordFormData>({ resolver: zodResolver(passwordSchema) })

  const { register: registerEmail, handleSubmit: handleEmailSubmit, formState: { errors: emailErrors }, reset: resetEmail } =
    useForm<EmailFormData>({ resolver: zodResolver(emailSchema) })

  const { register: registerDelete, handleSubmit: handleDeleteSubmit, formState: { errors: deleteErrors } } =
    useForm<DeleteAccountFormData>({ resolver: zodResolver(deleteAccountSchema) })

  useEffect(() => {
    if (!isAuthenticated) navigate('/auth/login')
  }, [isAuthenticated, navigate])

  /* ---------------- handlers ---------------- */

  const onProfileSubmit = async (data: ProfileFormData) => {
    setIsLoading(true)
    try {
      await updateProfile(data)
      toast.success('Profile updated successfully!')
      resetProfile()
    } finally {
      setIsLoading(false)
    }
  }

  const onPasswordSubmit = async (_data: PasswordFormData) => {
    setIsLoading(true)
    try {
      // Mock password change - replace with actual implementation
      toast.success('Password updated successfully!')
      resetPassword()
      setShowCurrentPassword(false)
      setShowNewPassword(false)
      setShowConfirmPassword(false)
    } finally {
      setIsLoading(false)
    }
  }

  const onEmailSubmit = async (_data: EmailFormData) => {
    setIsLoading(true)
    try {
      // Mock email change - replace with actual implementation
      toast.success('Email updated successfully!')
      resetEmail()
      setShowEmailPassword(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnectCalendar = async () => {
    setIsLoading(true)
    try {
      await connectGoogleCalendar()
      toast.success('Redirecting to Google Calendar authorization...')
    } catch (error) {
      toast.error('Failed to connect Google Calendar')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisconnectCalendar = async () => {
    setIsLoading(true)
    try {
      await disconnectGoogleCalendar()
      toast.success('Google Calendar disconnected successfully!')
    } catch (error) {
      toast.error('Failed to disconnect Google Calendar')
    } finally {
      setIsLoading(false)
    }
  }

  const onDeleteSubmit = async (data: DeleteAccountFormData) => {
    setIsLoading(true)
    try {
      if (data.confirmation === 'DELETE') {
        logout()
        navigate('/auth/login')
      } else {
        toast.error('Type DELETE to confirm')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Image size must be less than 5MB')
      return
    }

    setIsUploading(true)
    try {
      // Create preview
      const reader = new FileReader()
      reader.onload = async (e) => {
        const imageData = e.target?.result as string
        
        // Update profile with new avatar
        await updateProfile({ avatar: imageData })
        toast.success('Avatar updated successfully!')
      }
      reader.readAsDataURL(file)
    } catch (error) {
      toast.error('Failed to upload avatar')
    } finally {
      setIsUploading(false)
    }
  }

  const handleAvatarRemove = async () => {
    setIsUploading(true)
    try {
      await updateProfile({ avatar: undefined })
      toast.success('Avatar removed successfully!')
    } catch (error) {
      toast.error('Failed to remove avatar')
    } finally {
      setIsUploading(false)
    }
  }

  if (!user) return <div className="p-10">Loading...</div>

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-12">

        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

          <h1 className="text-3xl font-bold mt-4 text-foreground">Profile Management</h1>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-1 mt-6 p-1 bg-muted rounded-lg">
            {[
              { id: 'overview', label: 'Overview', icon: Users },
              { id: 'personal', label: 'Personal Info', icon: User },
              { id: 'security', label: 'Security', icon: Shield },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'privacy', label: 'Privacy', icon: Globe },
              { id: 'activity', label: 'Activity', icon: Clock },
              { id: 'billing', label: 'Billing', icon: CreditCard },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === id
                    ? 'bg-background text-primary shadow-sm border border-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ================= OVERVIEW ================= */}
        {activeTab === 'overview' && (
          <Card>
            <CardHeader>
              <CardTitle>Profile Overview</CardTitle>
            </CardHeader>

            <CardContent>

              {/* FIXED WRAPPER STRUCTURE */}
              <div className="flex items-center space-x-6 mb-6">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center relative">
                    {user.avatar ? <img src={user.avatar} className="rounded-full" /> : <User className="text-primary-foreground" />}
                    <div className="absolute -top-1 -right-1">
                      <Star className="w-6 h-6 text-accent fill-accent" />
                    </div>
                  </div>
                  <p className="mt-2 font-bold text-foreground">{user.firstName} {user.lastName}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>

              {/* STATS */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center"><Calendar /><div>{user.stats?.projects || 0}</div></div>
                <div className="text-center"><CheckSquare /><div>{user.stats?.tasks || 0}</div></div>
              </div>

              {/* RECENT ACTIVITY (FIXED STRUCTURE) */}
              <div className="mt-8 pt-6 border-t">
                <h4 className="font-semibold mb-4">Recent Activity</h4>

                <div className="space-y-3">

                  <div className="flex justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      <div>
                        <div className="font-medium">Video Call</div>
                        <div className="text-sm text-muted-foreground">2 hours ago</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      <div>
                        <div className="font-medium">Achievement</div>
                        <div className="text-sm text-muted-foreground">100 tasks completed</div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </CardContent>
          </Card>
        )}

        {/* ================= SECURITY TAB ================= */}
        {activeTab === 'security' && (
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme Settings */}
              <div>
                <h4 className="text-lg font-semibold mb-4 text-foreground flex items-center">
                  <Palette className="w-5 h-5 mr-2" />
                  Appearance
                </h4>
                <div className="space-y-2">
                  <ThemeToggle />
                </div>
              </div>

              {/* Calendar Integration */}
              <div>
                <h4 className="text-lg font-semibold mb-4 text-foreground">Calendar Integration</h4>
                <div className="space-y-4">
                  {user?.calendarConnected ? (
                    <div className="flex items-center justify-between p-4 bg-primary/10 border border-primary/20 rounded-lg">
                      <div>
                        <div className="font-medium text-primary">Google Calendar Connected</div>
                        <div className="text-sm text-muted-foreground">Provider: {user.calendarProvider}</div>
                      </div>
                      <Button variant="outline" onClick={handleDisconnectCalendar}>
                        Disconnect
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-4 bg-muted border border rounded-lg">
                      <div>
                        <div className="font-medium">Connect Google Calendar</div>
                        <div className="text-sm text-muted-foreground">Sync your tasks and events</div>
                      </div>
                      <Button variant="gradient" onClick={handleConnectCalendar}>
                        Connect
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Password Change */}
              <div>
                <h4 className="text-lg font-semibold mb-4 text-foreground">Change Password</h4>
                <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
                  <div className="relative">
                    <Input
                      type={showCurrentPassword ? "text" : "password"}
                      label="Current Password"
                      {...registerPassword('currentPassword')}
                      error={passwordErrors.currentPassword?.message}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-9 text-muted-foreground hover:text-foreground"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      label="New Password"
                      {...registerPassword('newPassword')}
                      error={passwordErrors.newPassword?.message}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-9 text-muted-foreground hover:text-foreground"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      label="Confirm New Password"
                      {...registerPassword('confirmPassword')}
                      error={passwordErrors.confirmPassword?.message}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-9 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <Button type="submit" variant="gradient" loading={isLoading}>
                    <Lock className="w-4 h-4 mr-2" />
                    Update Password
                  </Button>
                </form>
              </div>

              {/* Email Change */}
              <div>
                <h4 className="text-lg font-semibold mb-4 text-foreground">Change Email</h4>
                <form onSubmit={handleEmailSubmit(onEmailSubmit)} className="space-y-4">
                  <div className="relative">
                    <Input
                      type={showEmailPassword ? "text" : "password"}
                      label="New Email"
                      {...registerEmail('newEmail')}
                      error={emailErrors.newEmail?.message}
                    />
                  </div>
                  <div className="relative">
                    <Input
                      type={showEmailPassword ? "text" : "password"}
                      label="Current Password"
                      {...registerEmail('password')}
                      error={emailErrors.password?.message}
                    />
                    <button
                      type="button"
                      onClick={() => setShowEmailPassword(!showEmailPassword)}
                      className="absolute right-3 top-9 text-muted-foreground hover:text-foreground"
                    >
                      {showEmailPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <Button type="submit" variant="gradient" loading={isLoading}>
                    <Mail className="w-4 h-4 mr-2" />
                    Update Email
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ================= PERSONAL INFO TAB ================= */}
        {activeTab === 'personal' && (
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Avatar Upload */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-4 text-foreground">Profile Picture</h4>
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border">
                      {user.avatar ? (
                        <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-12 h-12 text-muted-foreground" />
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90 cursor-pointer">
                      <Camera className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                  <div>
                    <p className="font-medium">Upload a new avatar</p>
                    <p className="text-sm text-muted-foreground mb-3">JPG, PNG or GIF. Max 5MB.</p>
                    <div className="flex gap-2">
                      <label className="cursor-pointer">
                        <Button variant="outline" size="sm" asChild disabled={isUploading}>
                          <span>
                            <Upload className="w-4 h-4 mr-2" />
                            {isUploading ? 'Uploading...' : 'Upload'}
                          </span>
                        </Button>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                          disabled={isUploading}
                        />
                      </label>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleAvatarRemove}
                        disabled={isUploading || !user.avatar}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    {...registerProfile('firstName')}
                    error={profileErrors.firstName?.message}
                    disabled={isLoading}
                  />
                  <Input
                    label="Last Name"
                    {...registerProfile('lastName')}
                    error={profileErrors.lastName?.message}
                    disabled={isLoading}
                  />
                </div>
                
                <Input
                  label="Email"
                  type="email"
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
                    placeholder="San Francisco, CA"
                    {...registerProfile('location')}
                    error={profileErrors.location?.message}
                    disabled={isLoading}
                  />
                  <Input
                    label="Phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    {...registerProfile('phone')}
                    error={profileErrors.phone?.message}
                    disabled={isLoading}
                  />
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Phone className="w-4 h-4 mr-1" />
                    Include country code for international numbers
                  </div>
                </div>

                <Input
                  label="Website"
                  type="url"
                  placeholder="https://yourwebsite.com"
                  {...registerProfile('website')}
                  error={profileErrors.website?.message}
                  disabled={isLoading}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Timezone"
                    {...registerProfile('timezone')}
                    error={profileErrors.timezone?.message}
                    disabled={isLoading}
                  />
                  <Input
                    label="Language"
                    {...registerProfile('language')}
                    error={profileErrors.language?.message}
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-center gap-4">
                  <Button type="submit" variant="gradient" loading={isLoading}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button type="button" variant="outline" onClick={() => resetProfile()}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* ================= NOTIFICATIONS TAB ================= */}
        {activeTab === 'notifications' && (
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold mb-4 text-foreground flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Email Notifications
                </h4>
                <div className="space-y-3">
                  {[
                    { label: 'Task assignments', description: 'Get notified when tasks are assigned to you' },
                    { label: 'Task completions', description: 'Get notified when tasks are completed' },
                    { label: 'Project updates', description: 'Get notified about project changes' },
                    { label: 'Team messages', description: 'Get notified about new team messages' },
                    { label: 'Weekly reports', description: 'Get weekly summary reports' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{item.label}</div>
                        <div className="text-sm text-muted-foreground">{item.description}</div>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4 text-foreground flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Push Notifications
                </h4>
                <div className="space-y-3">
                  {[
                    { label: 'Enable push notifications', description: 'Receive notifications in your browser' },
                    { label: 'Desktop notifications', description: 'Show notifications on your desktop' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{item.label}</div>
                        <div className="text-sm text-muted-foreground">{item.description}</div>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h4 className="text-lg font-semibold mb-4 text-foreground flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Advanced Settings
                </h4>
                <div className="space-y-3">
                  {[
                    { label: 'Email digest frequency', description: 'Choose how often to receive email summaries' },
                    { label: 'Do not disturb hours', description: 'Set quiet hours for notifications' },
                    { label: 'Notification sound', description: 'Enable sound for notifications' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{item.label}</div>
                        <div className="text-sm text-muted-foreground">{item.description}</div>
                      </div>
                      <select className="px-3 py-1 border rounded text-sm bg-background text-foreground">
                        <option>Daily</option>
                        <option>Weekly</option>
                        <option>Never</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              <Button variant="gradient" loading={isLoading}>
                Save Notification Preferences
              </Button>
            </CardContent>
          </Card>
        )}

        {/* ================= PRIVACY TAB ================= */}
        {activeTab === 'privacy' && (
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold mb-4 text-foreground flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Profile Visibility
                </h4>
                <div className="space-y-3">
                  {[
                    { value: 'public', label: 'Public', description: 'Anyone can view your profile' },
                    { value: 'team', label: 'Team Only', description: 'Only team members can view your profile' },
                    { value: 'private', label: 'Private', description: 'Only you can view your profile' },
                  ].map((item) => (
                    <div key={item.value} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{item.label}</div>
                        <div className="text-sm text-muted-foreground">{item.description}</div>
                      </div>
                      <input type="radio" name="visibility" value={item.value} className="w-4 h-4" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4 text-foreground">Activity Settings</h4>
                <div className="space-y-3">
                  {[
                    { label: 'Show online status', description: 'Let others see when you\'re online' },
                    { label: 'Show activity history', description: 'Display your recent activity' },
                    { label: 'Allow direct messages', description: 'Let others send you messages' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{item.label}</div>
                        <div className="text-sm text-muted-foreground">{item.description}</div>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                    </div>
                  ))}
                </div>
              </div>

              <Button variant="gradient" loading={isLoading}>
                Save Privacy Settings
              </Button>
            </CardContent>
          </Card>
        )}

        {/* ================= ACTIVITY TAB ================= */}
        {activeTab === 'activity' && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { icon: Video, title: 'Video Call', desc: 'Team standup meeting', time: '2 hours ago', color: 'bg-blue-100 text-blue-600' },
                  { icon: MessageSquare, title: 'New Message', desc: 'From Sarah Chen', time: '4 hours ago', color: 'bg-green-100 text-green-600' },
                  { icon: CheckSquare, title: 'Task Completed', desc: 'Fixed login bug', time: '6 hours ago', color: 'bg-purple-100 text-purple-600' },
                  { icon: FolderOpen, title: 'Project Created', desc: 'Mobile App Redesign', time: '1 day ago', color: 'bg-orange-100 text-orange-600' },
                  { icon: Users, title: 'Team Member Added', desc: 'John Doe joined the team', time: '2 days ago', color: 'bg-pink-100 text-pink-600' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activity.color}`}>
                      <activity.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{activity.title}</div>
                      <div className="text-sm text-muted-foreground">{activity.desc}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">{activity.time}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ================= BILLING TAB ================= */}
        {activeTab === 'billing' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Billing & Subscription
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-bold">Current Plan: Pro</h4>
                  <div className="flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Popular Choice
                  </div>
                </div>
                <p className="mb-4">$29/month • Billed monthly</p>
                <div className="flex gap-3">
                  <Button variant="secondary" className="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground border-primary-foreground/30">
                    Upgrade Plan
                  </Button>
                  <Button variant="secondary" className="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground border-primary-foreground/30">
                    Manage Billing
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4 text-foreground">Payment Method</h4>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="font-medium">•••• •••• •••• 4242</div>
                    <div className="text-sm text-muted-foreground">Expires 12/24</div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Edit2 className="w-4 h-4 mr-2" />
                    Update
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4 text-foreground">Billing History</h4>
                <div className="space-y-3">
                  {[
                    { date: 'Mar 15, 2024', amount: '$29.00', status: 'Paid', plan: 'Pro Plan' },
                    { date: 'Feb 15, 2024', amount: '$29.00', status: 'Paid', plan: 'Pro Plan' },
                    { date: 'Jan 15, 2024', amount: '$29.00', status: 'Paid', plan: 'Pro Plan' },
                  ].map((invoice, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{invoice.plan}</div>
                        <div className="text-sm text-muted-foreground">{invoice.date}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{invoice.amount}</span>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">{invoice.status}</span>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ================= DANGER ZONE (FIXED FORM) ================= */}
        <div className="mt-8">
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleDeleteSubmit(onDeleteSubmit)} className="space-y-4">
                <Input
                  label="Type DELETE to confirm"
                  {...registerDelete('confirmation')}
                  error={deleteErrors.confirmation?.message}
                />

                <Button type="submit" variant="destructive" loading={isLoading}>
                  Delete Account
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}

export default ProfileManagement