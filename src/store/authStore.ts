import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { User, Subscription } from '../types'

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
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        subscription: null,

        login: async (email: string, password: string) => {
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
            // Mock OAuth login
            await new Promise(resolve => setTimeout(resolve, 1500))
            
            const mockUser: User = {
              id: '1',
              email: `user@${provider}.com`,
              username: `${provider}user`,
              firstName: 'OAuth',
              lastName: 'User',
              avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face`,
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
                  push: false,
                  taskAssigned: true,
                  taskCompleted: false,
                  projectUpdates: true,
                  teamMessages: true,
                  weeklyReports: false,
                },
                privacy: {
                  profileVisibility: 'team',
                  showOnlineStatus: true,
                  showActivityHistory: false,
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

        register: async (email: string, password: string, firstName: string, lastName: string) => {
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
