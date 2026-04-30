import { Amplify } from 'aws-amplify'
import { Hub } from '@aws-amplify/core'
import { signInWithRedirect, signOut, getCurrentUser, signIn, signUp, resetPassword, confirmResetPassword, updatePassword } from '@aws-amplify/auth'

// Configure Amplify with Cognito
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.REACT_APP_USER_POOL_ID || '',
      userPoolClientId: process.env.REACT_APP_USER_POOL_WEB_CLIENT_ID || '',
      identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID || '',
    },
  },
})

export const awsAuthService = {
  signInWithGoogle: async () => {
    try {
      await signInWithRedirect({ provider: 'Google' })
    } catch (error) {
      console.error('Google sign in error:', error)
      throw error
    }
  },
  signInWithMicrosoft: async () => {
    try {
      await signInWithRedirect({ provider: { custom: 'Microsoft' } })
    } catch (error) {
      console.error('Microsoft sign in error:', error)
      throw error
    }
  },
  signIn: async (email: string, password: string) => {
    try {
      const { isSignedIn, nextStep } = await signIn({
        username: email,
        password,
      })
      return { isSignedIn, nextStep }
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  },
  signUp: async (email: string, password: string, attributes: any) => {
    try {
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username: email,
        password,
        options: {
          userAttributes: attributes,
        },
      })
      return { isSignUpComplete, userId, nextStep }
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    }
  },
  signOut: async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  },
  getCurrentUser: async () => {
    try {
      const user = await getCurrentUser()
      return user
    } catch (error) {
      console.error('Get current user error:', error)
      throw error
    }
  },
  forgotPassword: async (email: string) => {
    try {
      const { nextStep } = await resetPassword({ username: email })
      return nextStep
    } catch (error) {
      console.error('Forgot password error:', error)
      throw error
    }
  },
  forgotPasswordSubmit: async (email: string, code: string, newPassword: string) => {
    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword,
      })
      return true
    } catch (error) {
      console.error('Forgot password submit error:', error)
      throw error
    }
  },
  changePassword: async (oldPassword: string, newPassword: string) => {
    try {
      await updatePassword({
        oldPassword,
        newPassword,
      })
      return true
    } catch (error) {
      console.error('Change password error:', error)
      throw error
    }
  },
  updateUserAttributes: async (attributes: any) => {
    try {
      // Note: updateUserAttributes functionality would need to be implemented
      // based on the specific AWS Amplify v6 API
      console.log('Update user attributes:', attributes)
      throw new Error('Update user attributes not yet implemented in v6')
    } catch (error) {
      console.error('Update user attributes error:', error)
      throw error
    }
  },
  onAuthStateChange: (callback: (authState: any) => void) => {
    Hub.listen('auth', (data) => {
      const { payload } = data
      callback(payload.event)
    })
  }
}
export default awsAuthService
