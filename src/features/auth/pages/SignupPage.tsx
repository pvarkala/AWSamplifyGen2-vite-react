import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Mail, Lock, User, Github, Chrome, ArrowRight } from 'lucide-react'
import { useAuthStore } from '../../../store/authStore'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Card, CardContent } from '../../../components/ui/Card'
import toast from 'react-hot-toast'

const signupSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type SignupFormData = z.infer<typeof signupSchema>

const SignupPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  
  const { register: registerUser, loginWithProvider, isAuthenticated, isOAuthConfigured } = useAuthStore()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/app/dashboard')
    }
  }, [isAuthenticated, navigate])

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true)
    try {
      await registerUser(data.email, data.password, data.firstName, data.lastName)
      toast.success('Account created successfully!')
      navigate('/app/dashboard')
    } catch (error) {
      toast.error('Failed to create account')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialSignup = async (provider: 'google' | 'github') => {
    try {
      await loginWithProvider(provider)
      toast.success(`Welcome! Signed in with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`)
      navigate('/app/profile')
    } catch (error: any) {
      toast.error(error.message || `Failed to sign in with ${provider}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-20 blur-3xl dark:opacity-10"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-pink-400 to-orange-600 rounded-full opacity-20 blur-3xl dark:opacity-10"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center gap-3 mb-6 group">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <span className="text-xl font-bold text-white">✦</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">TodoPro</span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">Create your account</h1>
          <p className="text-muted-foreground">Join thousands of productive teams</p>
        </div>

        <Card className="border-2">
          <CardContent className="pt-6">
            {/* Social Signup Buttons */}
            <div className="space-y-3 mb-6">
              {!isOAuthConfigured('google') ? (
                <Button
                  variant="social"
                  className="w-full opacity-60 cursor-not-allowed"
                  disabled={true}
                  fullWidth
                  size="lg"
                >
                  <Chrome className="w-5 h-5 mr-3" />
                  Google OAuth not configured
                </Button>
              ) : (
                <Button
                  variant="social"
                  className="w-full"
                  onClick={() => handleSocialSignup('google')}
                  disabled={isLoading}
                  fullWidth
                  size="lg"
                >
                  <Chrome className="w-5 h-5 mr-3" />
                  Sign up with Google
                </Button>
              )}
              
              {!isOAuthConfigured('github') ? (
                <Button
                  variant="social"
                  className="w-full opacity-60 cursor-not-allowed"
                  disabled={true}
                  fullWidth
                  size="lg"
                >
                  <Github className="w-5 h-5 mr-3" />
                  GitHub OAuth not configured
                </Button>
              ) : (
                <Button
                  variant="social"
                  className="w-full"
                  onClick={() => handleSocialSignup('github')}
                  disabled={isLoading}
                  fullWidth
                  size="lg"
                >
                  <Github className="w-5 h-5 mr-3" />
                  Sign up with GitHub
                </Button>
              )}
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-card text-muted-foreground font-medium">Or sign up with email</span>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="First name"
                  type="text"
                  placeholder="John"
                  leftIcon={<User className="w-5 h-5" />}
                  error={errors.firstName?.message}
                  {...register('firstName')}
                  disabled={isLoading}
                />
                
                <Input
                  label="Last name"
                  type="text"
                  placeholder="Doe"
                  leftIcon={<User className="w-5 h-5" />}
                  error={errors.lastName?.message}
                  {...register('lastName')}
                  disabled={isLoading}
                />
              </div>

              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                leftIcon={<Mail className="w-5 h-5" />}
                error={errors.email?.message}
                {...register('email')}
                disabled={isLoading}
              />

              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                leftIcon={<Lock className="w-5 h-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                }
                error={errors.password?.message}
                {...register('password')}
                disabled={isLoading}
              />

              <Input
                label="Confirm password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                leftIcon={<Lock className="w-5 h-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                }
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
                disabled={isLoading}
              />

              <div className="flex items-start gap-3 pt-2">
                <input
                  id="terms"
                  type="checkbox"
                  className="h-5 w-5 rounded border-2 border-border accent-primary cursor-pointer mt-0.5"
                  required
                />
                <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                  I agree to the{' '}
                  <Link to="/terms" className="font-semibold text-primary hover:text-primary/80 underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="font-semibold text-primary hover:text-primary/80 underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                fullWidth
                size="lg"
                variant="default"
                loading={isLoading}
                disabled={isLoading}
                className="mt-6"
              >
                Create account <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link
                  to="/auth/login"
                  className="font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          By signing up, you agree to our{' '}
          <Link to="#" className="underline hover:text-foreground">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="#" className="underline hover:text-foreground">
            Privacy Policy
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

export default SignupPage
