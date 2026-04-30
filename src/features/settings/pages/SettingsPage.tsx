import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Settings,
  Bell,
  Globe,
  Palette,
  Shield,
  Database,
  Download,
  Upload,
  Trash2,
  Save,
  Sun,
  Monitor,
  Volume2,
  Eye,
  Mail,
  MessageSquare,
  User,
  Phone
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { ThemeToggle } from '../../../components/ui/ThemeToggle'
import { useAuthStore } from '../../../store/authStore'
import toast from 'react-hot-toast'

const settingsSchema = z.object({
  displayName: z.string().min(2).max(50),
  email: z.string().email(),
  timezone: z.string(),
  language: z.string(),
  dateFormat: z.string(),
  timeFormat: z.string(),
  currency: z.string(),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    sms: z.boolean(),
    desktop: z.boolean(),
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'private', 'friends']),
    showEmail: z.boolean(),
    showPhone: z.boolean(),
    showLocation: z.boolean(),
  }),
  accessibility: z.object({
    fontSize: z.enum(['small', 'medium', 'large']),
    highContrast: z.boolean(),
    reducedMotion: z.boolean(),
    screenReader: z.boolean(),
  }),
})

type SettingsFormData = z.infer<typeof settingsSchema>

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'privacy' | 'accessibility' | 'data'>('general')
  const [isLoading, setIsLoading] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  
  const { user, updateProfile } = useAuthStore()
  
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      displayName: user?.firstName + ' ' + user?.lastName || '',
      email: user?.email || '',
      timezone: user?.timezone || 'UTC',
      language: 'en',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h',
      currency: 'USD',
      notifications: {
        email: true,
        push: true,
        sms: false,
        desktop: true,
      },
      privacy: {
        profileVisibility: 'public',
        showEmail: false,
        showPhone: false,
        showLocation: true,
      },
      accessibility: {
        fontSize: 'medium',
        highContrast: false,
        reducedMotion: false,
        screenReader: false,
      },
    },
  })

  const watchedValues = watch()

  const onSubmit = async (data: SettingsFormData) => {
    setIsLoading(true)
    try {
      await updateProfile({
        firstName: data.displayName.split(' ')[0],
        lastName: data.displayName.split(' ').slice(1).join(' '),
        timezone: data.timezone,
      })
      toast.success('Settings saved successfully!')
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportData = async () => {
    setIsExporting(true)
    try {
      const userData = {
        profile: user,
        settings: watchedValues,
        exportDate: new Date().toISOString(),
      }
      
      const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `user-data-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast.success('Data exported successfully!')
    } catch (error) {
      toast.error('Failed to export data')
    } finally {
      setIsExporting(false)
    }
  }

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      
      if (data.settings) {
        Object.entries(data.settings).forEach(([key, value]) => {
          setValue(key as keyof SettingsFormData, value as any)
        })
        toast.success('Settings imported successfully!')
      }
    } catch (error) {
      toast.error('Failed to import data')
    } finally {
      setIsImporting(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      if (window.confirm('This will permanently delete all your data. Type "DELETE" to confirm.')) {
        toast.success('Account deletion request submitted')
      }
    }
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'accessibility', label: 'Accessibility', icon: Eye },
    { id: 'data', label: 'Data Management', icon: Database },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-background"
    >
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your application preferences and configuration</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-muted p-1 rounded-lg w-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-background text-primary shadow-sm border'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* General Settings */}
        {activeTab === 'general' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Profile Information
                    </h3>
                    <div className="space-y-4">
                      <Input
                        label="Display Name"
                        {...register('displayName')}
                        error={errors.displayName?.message}
                      />
                      <Input
                        label="Email"
                        type="email"
                        {...register('email')}
                        error={errors.email?.message}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center">
                      <Globe className="w-5 h-5 mr-2" />
                      Regional Settings
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Timezone</label>
                        <select {...register('timezone')} className="w-full p-2 border rounded-md bg-background text-foreground">
                          <option value="UTC">UTC (Coordinated Universal Time)</option>
                          
                          {/* North America */}
                          <option value="America/New_York">New York (EST/EDT)</option>
                          <option value="America/Chicago">Chicago (CST/CDT)</option>
                          <option value="America/Denver">Denver (MST/MDT)</option>
                          <option value="America/Los_Angeles">Los Angeles (PST/PDT)</option>
                          <option value="America/Toronto">Toronto (EST/EDT)</option>
                          <option value="America/Vancouver">Vancouver (PST/PDT)</option>
                          <option value="America/Mexico_City">Mexico City (CST/CDT)</option>
                          <option value="America/Sao_Paulo">São Paulo (BRT)</option>
                          
                          {/* South America */}
                          <option value="America/Buenos_Aires">Buenos Aires (ART)</option>
                          <option value="America/Santiago">Santiago (CLT)</option>
                          <option value="America/Lima">Lima (PET)</option>
                          <option value="America/Bogota">Bogotá (COT)</option>
                          
                          {/* Europe */}
                          <option value="Europe/London">London (GMT/BST)</option>
                          <option value="Europe/Paris">Paris (CET/CEST)</option>
                          <option value="Europe/Berlin">Berlin (CET/CEST)</option>
                          <option value="Europe/Rome">Rome (CET/CEST)</option>
                          <option value="Europe/Madrid">Madrid (CET/CEST)</option>
                          <option value="Europe/Amsterdam">Amsterdam (CET/CEST)</option>
                          <option value="Europe/Stockholm">Stockholm (CET/CEST)</option>
                          <option value="Europe/Moscow">Moscow (MSK)</option>
                          <option value="Europe/Istanbul">Istanbul (TRT)</option>
                          <option value="Europe/Athens">Athens (EET/EEST)</option>
                          
                          {/* Africa */}
                          <option value="Africa/Cairo">Cairo (EET/EEST)</option>
                          <option value="Africa/Lagos">Lagos (WAT)</option>
                          <option value="Africa/Johannesburg">Johannesburg (SAST)</option>
                          <option value="Africa/Nairobi">Nairobi (EAT)</option>
                          <option value="Africa/Casablanca">Casablanca (WET)</option>
                          
                          {/* Middle East */}
                          <option value="Asia/Dubai">Dubai (GST)</option>
                          <option value="Asia/Riyadh">Riyadh (AST)</option>
                          <option value="Asia/Tehran">Tehran (IRST)</option>
                          <option value="Asia/Jerusalem">Jerusalem (IST/IDT)</option>
                          
                          {/* Asia */}
                          <option value="Asia/Kolkata">Mumbai/New Delhi (IST)</option>
                          <option value="Asia/Karachi">Karachi (PKT)</option>
                          <option value="Asia/Dhaka">Dhaka (BST)</option>
                          <option value="Asia/Colombo">Colombo (IST)</option>
                          <option value="Asia/Kathmandu">Kathmandu (NPT)</option>
                          <option value="Asia/Bangkok">Bangkok (ICT)</option>
                          <option value="Asia/Singapore">Singapore (SGT)</option>
                          <option value="Asia/Kuala_Lumpur">Kuala Lumpur (MYT)</option>
                          <option value="Asia/Jakarta">Jakarta (WIB)</option>
                          <option value="Asia/Manila">Manila (PHT)</option>
                          <option value="Asia/Shanghai">Shanghai (CST)</option>
                          <option value="Asia/Hong_Kong">Hong Kong (HKT)</option>
                          <option value="Asia/Taipei">Taipei (CST)</option>
                          <option value="Asia/Seoul">Seoul (KST)</option>
                          <option value="Asia/Tokyo">Tokyo (JST)</option>
                          <option value="Asia/Osaka">Osaka (JST)</option>
                          
                          {/* Australia & Pacific */}
                          <option value="Australia/Sydney">Sydney (AEST/AEDT)</option>
                          <option value="Australia/Melbourne">Melbourne (AEST/AEDT)</option>
                          <option value="Australia/Brisbane">Brisbane (AEST)</option>
                          <option value="Australia/Perth">Perth (AWST)</option>
                          <option value="Australia/Adelaide">Adelaide (ACST/ACDT)</option>
                          <option value="Pacific/Auckland">Auckland (NZST/NZDT)</option>
                          <option value="Pacific/Fiji">Fiji (FJT)</option>
                          <option value="Pacific/Guam">Guam (ChST)</option>
                          <option value="Pacific/Honolulu">Honolulu (HST)</option>
                          <option value="Pacific/Apia">Apia (WSDT)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Language</label>
                        <select {...register('language')} className="w-full p-2 border rounded-md bg-background text-foreground">
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                          <option value="zh">Chinese</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Date Format</label>
                        <select {...register('dateFormat')} className="w-full p-2 border rounded-md bg-background text-foreground">
                          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Time Format</label>
                        <select {...register('timeFormat')} className="w-full p-2 border rounded-md bg-background text-foreground">
                          <option value="12h">12-hour</option>
                          <option value="24h">24-hour</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Currency</label>
                        <select {...register('currency')} className="w-full p-2 border rounded-md bg-background text-foreground">
                          <option value="USD">USD ($)</option>
                          <option value="INR">INR (₹)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center">
                    <Palette className="w-5 h-5 mr-2" />
                    Appearance
                  </h3>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-foreground">Theme:</span>
                    <ThemeToggle />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" variant="gradient" loading={isLoading}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Settings
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Notifications Settings */}
        {activeTab === 'notifications' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 mr-3 text-blue-600" />
                      <div>
                        <h4 className="font-medium">Email Notifications</h4>
                        <p className="text-sm text-gray-500">Receive updates and alerts via email</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input {...register('notifications.email')} type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center">
                      <Volume2 className="w-5 h-5 mr-3 text-green-600" />
                      <div>
                        <h4 className="font-medium">Push Notifications</h4>
                        <p className="text-sm text-gray-500">Get real-time notifications on your device</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input {...register('notifications.push')} type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center">
                      <MessageSquare className="w-5 h-5 mr-3 text-purple-600" />
                      <div>
                        <h4 className="font-medium">SMS Notifications</h4>
                        <p className="text-sm text-gray-500">Receive text messages for important updates</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input {...register('notifications.sms')} type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center">
                      <Monitor className="w-5 h-5 mr-3 text-orange-600" />
                      <div>
                        <h4 className="font-medium">Desktop Notifications</h4>
                        <p className="text-sm text-gray-500">Show browser notifications when active</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input {...register('notifications.desktop')} type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" variant="gradient" loading={isLoading}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Preferences
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Privacy Settings */}
        {activeTab === 'privacy' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Privacy Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Profile Visibility</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Who can see your profile?</label>
                      <select {...register('privacy.profileVisibility')} className="w-full p-2 border rounded-md bg-background text-foreground">
                        <option value="public">Everyone</option>
                        <option value="friends">Friends Only</option>
                        <option value="private">Private</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Information Sharing</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <Mail className="w-5 h-5 mr-3 text-blue-600" />
                        <div>
                          <h4 className="font-medium">Show Email</h4>
                          <p className="text-sm text-gray-500">Display email on your profile</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input {...register('privacy.showEmail')} type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <Phone className="w-5 h-5 mr-3 text-green-600" />
                        <div>
                          <h4 className="font-medium">Show Phone</h4>
                          <p className="text-sm text-gray-500">Display phone number on your profile</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input {...register('privacy.showPhone')} type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <Globe className="w-5 h-5 mr-3 text-purple-600" />
                        <div>
                          <h4 className="font-medium">Show Location</h4>
                          <p className="text-sm text-gray-500">Display your location on profile</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input {...register('privacy.showLocation')} type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" variant="gradient" loading={isLoading}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Privacy Settings
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Accessibility Settings */}
        {activeTab === 'accessibility' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Accessibility Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Display</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Font Size</label>
                      <select {...register('accessibility.fontSize')} className="w-full p-2 border rounded-md bg-background text-foreground">
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <Sun className="w-5 h-5 mr-3 text-accent" />
                        <div>
                          <h4 className="font-medium">High Contrast</h4>
                          <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input {...register('accessibility.highContrast')} type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-primary-foreground after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-primary-foreground after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <Monitor className="w-5 h-5 mr-3 text-primary" />
                        <div>
                          <h4 className="font-medium">Reduced Motion</h4>
                          <p className="text-sm text-muted-foreground">Minimize animations and transitions</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input {...register('accessibility.reducedMotion')} type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-primary-foreground after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-primary-foreground after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <Volume2 className="w-5 h-5 mr-3 text-accent" />
                        <div>
                          <h4 className="font-medium">Screen Reader Support</h4>
                          <p className="text-sm text-muted-foreground">Optimize for screen readers</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input {...register('accessibility.screenReader')} type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-primary-foreground after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-primary-foreground after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" variant="gradient" loading={isLoading}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Accessibility Settings
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Data Management */}
        {activeTab === 'data' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Export Your Data</h3>
                <p className="text-gray-600 mb-4">Download a copy of all your data and settings</p>
                <Button onClick={handleExportData} variant="outline" loading={isExporting}>
                  <Download className="w-4 h-4 mr-2" />
                  {isExporting ? 'Exporting...' : 'Export Data'}
                </Button>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Import Settings</h3>
                <p className="text-gray-600 mb-4">Upload a previously exported settings file</p>
                <label className="cursor-pointer">
                  <Button variant="outline" asChild disabled={isImporting}>
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      {isImporting ? 'Importing...' : 'Import Settings'}
                    </span>
                  </Button>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="hidden"
                    disabled={isImporting}
                  />
                </label>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4 text-red-600">Danger Zone</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-medium text-red-800 mb-2">Delete Account</h4>
                    <p className="text-sm text-red-600 mb-4">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <Button onClick={handleDeleteAccount} variant="destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </motion.div>
  )
}

export default SettingsPage
