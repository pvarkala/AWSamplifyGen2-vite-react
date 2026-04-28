import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Mail, Lock, User, Github, Chrome } from 'lucide-react'
import { useAuthStore } from '../../../store/authStore'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
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
  
  const { register: registerUser, loginWithProvider, isAuthenticated } = useAuthStore()
  
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

  const handleSocialSignup = async (provider: 'google' | 'github' | 'microsoft') => {
    try {
      await loginWithProvider(provider)
      toast.success(`Account created via ${provider}!`)
      navigate('/app/dashboard')
    } catch (error) {
      toast.error(`Failed to signup with ${provider}`)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
        <p className="text-gray-600">Get started with TodoPro today</p>
      </div>

      {/* Social Signup Buttons */}
      <div className="space-y-3 mb-6">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => handleSocialSignup('google')}
          disabled={isLoading}
        >
          <Chrome className="w-5 h-5 mr-2" />
          Sign up with Google
        </Button>
        
        <Button
          variant="outline"
          className="w-full"
          onClick={() => handleSocialSignup('github')}
          disabled={isLoading}
        >
          <Github className="w-5 h-5 mr-2" />
          Sign up with GitHub
        </Button>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or sign up with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First name"
            type="text"
            placeholder="John"
            leftIcon={<User className="w-5 h-5 text-gray-400" />}
            error={errors.firstName?.message}
            {...register('firstName')}
            disabled={isLoading}
          />
          
          <Input
            label="Last name"
            type="text"
            placeholder="Doe"
            leftIcon={<User className="w-5 h-5 text-gray-400" />}
            error={errors.lastName?.message}
            {...register('lastName')}
            disabled={isLoading}
          />
        </div>

        <Input
          label="Email address"
          type="email"
          placeholder="Enter your email"
          leftIcon={<Mail className="w-5 h-5 text-gray-400" />}
          error={errors.email?.message}
          {...register('email')}
          disabled={isLoading}
        />

        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Create a password"
          leftIcon={<Lock className="w-5 h-5 text-gray-400" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600"
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
          placeholder="Confirm your password"
          leftIcon={<Lock className="w-5 h-5 text-gray-400" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          }
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
          disabled={isLoading}
        />

        <div className="flex items-center">
          <input
            id="terms"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            required
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
            I agree to the{' '}
            <Link to="/terms" className="text-blue-600 hover:text-blue-500">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
              Privacy Policy
            </Link>
          </label>
        </div>

        <Button
          type="submit"
          className="w-full"
          variant="gradient"
          loading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            to="/auth/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  )
}

export default SignupPage
