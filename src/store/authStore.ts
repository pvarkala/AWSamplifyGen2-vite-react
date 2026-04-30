import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import { User, Subscription } from '../types'
import { calendarService } from '../lib/calendar-service'
import toast from 'react-hot-toast'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  subscription: Subscription | null
  login: (email: string, password: string) => Promise<void>
  loginWithProvider: (provider: 'google' | 'github' | 'microsoft') => Promise<void>
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>
  logout: () => void
  updateProfile: (updates: Partial<User>) => Promise<void>
  updatePreferences: (preferences: Partial<User['preferences']>) => void
  refreshUser: () => Promise<void>
  verifyOTP: (email: string, code: string) => Promise<void>
  loginWithOTP: (email: string, otp: string) => Promise<void>
  isOAuthConfigured: (provider: 'google' | 'github') => boolean
  connectGoogleCalendar: () => Promise<void>
  disconnectGoogleCalendar: () => Promise<void>
  getCalendarEvents: (timeMin?: Date, timeMax?: Date) => Promise<any[]>
  createCalendarEvent: (event: any) => Promise<any>
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        subscription: null,

        login: async (email: string, _password: string) => {
          set({ isLoading: true })
          try {
            // Mock API call - replace with actual auth service
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            const mockUser: User = {
              id: '1',
              email,
              username: email.split('@')[0],
              firstName: 'John',
              lastName: 'Doe',
              avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
              bio: 'Product manager passionate about building great products',
              role: 'admin',
              isActive: true,
              isOnline: true,
              lastSeen: new Date(),
              createdAt: new Date(),
              updatedAt: new Date(),
              preferences: {
                theme: 'light',
                language: 'en',
                timezone: 'UTC',
                notifications: {
                  email: true,
                  push: true,
                  taskAssigned: true,
                  taskCompleted: true,
                  projectUpdates: true,
                  teamMessages: true,
                  weeklyReports: false,
                },
                privacy: {
                  profileVisibility: 'public',
                  showOnlineStatus: true,
                  showActivityHistory: true,
                  allowDirectMessages: true,
                },
              },
              subscription: {
                plan: 'pro',
                status: 'active',
                currentPeriodStart: new Date(),
                currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                cancelAtPeriodEnd: false,
              },
              timezone: 'UTC',
              calendarConnected: false,
              calendarProvider: null,
              stats: {
                projects: 12,
                tasks: 48,
                completed: 36,
              },
            }

            set({ 
              user: mockUser, 
              isAuthenticated: true, 
              subscription: mockUser.subscription,
              isLoading: false 
            })
          } catch (error) {
            set({ isLoading: false })
            throw error
          }
        },

        loginWithProvider: async (provider: string) => {
          set({ isLoading: true })
          try {
            // Check if OAuth is properly configured
            const isConfigured = get().isOAuthConfigured(provider as 'google' | 'github')
            if (!isConfigured) {
              throw new Error(`${provider.charAt(0).toUpperCase() + provider.slice(1)} OAuth is not configured. Please use "Sign up with email" instead.`)
            }

            // Mock OAuth login with realistic user data
            await new Promise(resolve => setTimeout(resolve, 1500))
            
            // Generate realistic user data based on provider
            const providerData = {
              google: {
                email: 'john.doe@gmail.com',
                username: 'johndoe',
                firstName: 'John',
                lastName: 'Doe',
                avatar: 'https://lh3.googleusercontent.com/a/default-user',
              },
              github: {
                email: 'johndoe@users.noreply.github.com',
                username: 'johndoe',
                firstName: 'John',
                lastName: 'Doe',
                avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
              }
            }
            
            const data = providerData[provider as keyof typeof providerData]
            
            const mockUser: User = {
              id: Math.random().toString(36).substr(2, 9),
              email: data.email,
              username: data.username,
              firstName: data.firstName,
              lastName: data.lastName,
              avatar: data.avatar,
              role: 'admin',
              isActive: true,
              isOnline: true,
              lastSeen: new Date(),
              createdAt: new Date(),
              updatedAt: new Date(),
              preferences: {
                theme: 'light',
                language: 'en',
                timezone: 'UTC',
                notifications: {
                  email: true,
                  push: true,
                  taskAssigned: true,
                  taskCompleted: true,
                  projectUpdates: true,
                  teamMessages: true,
                  weeklyReports: false,
                },
                privacy: {
                  profileVisibility: 'public',
                  showOnlineStatus: true,
                  showActivityHistory: true,
                  allowDirectMessages: true,
                },
              },
              subscription: {
                plan: 'pro',
                status: 'active',
                currentPeriodStart: new Date(),
                currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                cancelAtPeriodEnd: false,
              },
              timezone: 'UTC',
              calendarConnected: false,
              calendarProvider: null,
              stats: {
                projects: 12,
                tasks: 48,
                completed: 36,
              },
            }

            set({ 
              user: mockUser, 
              isAuthenticated: true, 
              subscription: mockUser.subscription,
              isLoading: false 
            })
          } catch (error) {
            set({ isLoading: false })
            throw error
          }
        },

        register: async (email: string, _password: string, firstName: string, lastName: string) => {
          set({ isLoading: true })
          try {
            // Mock registration
            await new Promise(resolve => setTimeout(resolve, 1200))
            
            const mockUser: User = {
              id: '1',
              email,
              username: email.split('@')[0],
              firstName,
              lastName,
              role: 'member',
              isActive: true,
              isOnline: true,
              lastSeen: new Date(),
              createdAt: new Date(),
              updatedAt: new Date(),
              preferences: {
                theme: 'light',
                language: 'en',
                timezone: 'UTC',
                notifications: {
                  email: true,
                  push: true,
                  taskAssigned: true,
                  taskCompleted: true,
                  projectUpdates: true,
                  teamMessages: true,
                  weeklyReports: true,
                },
                privacy: {
                  profileVisibility: 'public',
                  showOnlineStatus: true,
                  showActivityHistory: true,
                  allowDirectMessages: true,
                },
              },
              subscription: {
                plan: 'free',
                status: 'active',
                currentPeriodStart: new Date(),
                currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                cancelAtPeriodEnd: false,
              },
              timezone: 'UTC',
              calendarConnected: false,
              calendarProvider: null,
              stats: {
                projects: 5,
                tasks: 15,
                completed: 8,
              },
            }

            set({ 
              user: mockUser, 
              isAuthenticated: true, 
              subscription: mockUser.subscription,
              isLoading: false 
            })
          } catch (error) {
            set({ isLoading: false })
            throw error
          }
        },

        logout: () => {
          set({ 
            user: null, 
            isAuthenticated: false, 
            subscription: null 
          })
        },

        updateProfile: async (updates: Partial<User>) => {
          const { user } = get()
          if (!user) return

          try {
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 500))
            
            const updatedUser = { ...user, ...updates, updatedAt: new Date() }
            set({ user: updatedUser })
          } catch (error) {
            throw error
          }
        },

        updatePreferences: (preferences: Partial<User['preferences']>) => {
          const { user } = get()
          if (!user) return

          const updatedUser = {
            ...user,
            preferences: { ...user.preferences, ...preferences },
            updatedAt: new Date()
          }
          set({ user: updatedUser })
        },

        refreshUser: async () => {
          const { user } = get()
          if (!user) return

          try {
            // Mock API call to refresh user data
            await new Promise(resolve => setTimeout(resolve, 300))
            
            const refreshedUser = { 
              ...user, 
              lastSeen: new Date(),
              isOnline: true 
            }
            set({ user: refreshedUser })
          } catch (error) {
            throw error
          }
        },

        isOAuthConfigured: (provider: 'google' | 'github') => {
          const clientIdEnv = `REACT_APP_${provider.toUpperCase()}_CLIENT_ID`
          const clientSecretEnv = `REACT_APP_${provider.toUpperCase()}_CLIENT_SECRET`
          
          const clientId = import.meta.env[clientIdEnv]
          const clientSecret = import.meta.env[clientSecretEnv]
          
          // Check if both client ID and client secret are configured and not placeholder values
          return !!(clientId && 
                  clientSecret && 
                  clientId !== `your-${provider}-client-id` && 
                  clientSecret !== `your-${provider}-client-secret`)
        },

        connectGoogleCalendar: async () => {
          const { user } = get()
          if (!user) {
            throw new Error('User must be authenticated to connect calendar')
          }

          try {
            // Initiate Google OAuth flow for calendar access
            calendarService.initiateGoogleAuth()
          } catch (error) {
            throw new Error('Failed to connect Google Calendar')
          }
        },

        disconnectGoogleCalendar: async () => {
          const { user } = get()
          if (!user) return

          try {
            // Revoke calendar access token
            if (user.calendarAccessToken) {
              await calendarService.revokeToken(user.calendarAccessToken)
            }

            // Update user to remove calendar connection
            const updatedUser = {
              ...user,
              calendarConnected: false,
              calendarProvider: null,
              calendarAccessToken: undefined,
              updatedAt: new Date()
            }
            set({ user: updatedUser })
          } catch (error) {
            throw new Error('Failed to disconnect Google Calendar')
          }
        },

        getCalendarEvents: async (timeMin?: Date, timeMax?: Date) => {
          const { user } = get()
          if (!user || !user.calendarConnected || !user.calendarAccessToken) {
            throw new Error('Calendar not connected')
          }

          try {
            return await calendarService.getCalendarEvents(user.calendarAccessToken, timeMin, timeMax)
          } catch (error) {
            throw new Error('Failed to fetch calendar events')
          }
        },

        createCalendarEvent: async (event: any) => {
          const { user } = get()
          if (!user || !user.calendarConnected || !user.calendarAccessToken) {
            throw new Error('Calendar not connected')
          }

          try {
            return await calendarService.createCalendarEvent(user.calendarAccessToken, event)
          } catch (error) {
            throw new Error('Failed to create calendar event')
          }
        },

        verifyOTP: async (email: string, code: string) => {
          set({ isLoading: true })
          try {
            // Mock OTP verification - replace with actual implementation
            console.log('Verifying OTP for:', email, 'with code:', code)
            toast.success('OTP verified successfully!')
          } catch (error) {
            toast.error('Failed to verify OTP')
            throw error
          } finally {
            set({ isLoading: false })
          }
        },

        loginWithOTP: async (email: string, otp: string) => {
          set({ isLoading: true })
          try {
            // Mock OTP login - replace with actual implementation
            console.log('Logging in with OTP for:', email, 'with OTP:', otp)
            
            const mockUser: User = {
              id: Math.random().toString(36).substr(2, 9),
              email: email,
              username: email.split('@')[0],
              firstName: 'OTP',
              lastName: 'User',
              role: 'member',
              isActive: true,
              isOnline: true,
              lastSeen: new Date(),
              createdAt: new Date(),
              updatedAt: new Date(),
              preferences: {
                theme: 'light',
                language: 'en',
                timezone: 'UTC',
                notifications: {
                  email: true,
                  push: true,
                  taskAssigned: true,
                  taskCompleted: true,
                  projectUpdates: true,
                  teamMessages: true,
                  weeklyReports: false,
                },
                privacy: {
                  profileVisibility: 'public',
                  showOnlineStatus: true,
                  showActivityHistory: true,
                  allowDirectMessages: true,
                },
              },
              subscription: {
                plan: 'free',
                status: 'active',
                currentPeriodStart: new Date(),
                currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                cancelAtPeriodEnd: false,
              },
              timezone: 'UTC',
              calendarConnected: false,
              calendarProvider: null,
              stats: {
                projects: 0,
                tasks: 0,
                completed: 0,
              },
            }

            set({ 
              user: mockUser, 
              isAuthenticated: true, 
              subscription: mockUser.subscription,
              isLoading: false 
            })
            toast.success('Logged in successfully!')
          } catch (error) {
            toast.error('Failed to login with OTP')
            set({ isLoading: false })
            throw error
          }
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          subscription: state.subscription,
        }),
      }
    )
  )
)
