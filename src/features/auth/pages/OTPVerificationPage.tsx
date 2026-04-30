import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, ArrowLeft, Shield, CheckCircle } from 'lucide-react'
import { useAuthStore } from '../../../store/authStore'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import toast from 'react-hot-toast'

const otpSchema = z.object({
  code: z.string().length(6, 'OTP must be 6 digits'),
})

type OTPFormData = z.infer<typeof otpSchema>

const OTPVerificationPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300)
  const [isResending, setIsResending] = useState(false)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  const email = searchParams.get('email')
  const { verifyOTP, loginWithOTP } = useAuthStore()

  const {
    register,
    handleSubmit: handleOTPSubmit,
    formState: { errors },
  } = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
  })

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => Math.max(0, prev - 1))
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  useEffect(() => {
    if (timeLeft === 0) {
      setTimeLeft(0)
    }
  }, [timeLeft])

  const onResendOTP = async () => {
    if (!email) {
      toast.error('Email address is required')
      return
    }

    setIsResending(true)
    try {
      // Mock OTP resend - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('OTP sent to your email!')
      setTimeLeft(300)
    } catch (error) {
      toast.error('Failed to resend OTP')
    } finally {
      setIsResending(false)
    }
  }

  const onSubmit = async (data: OTPFormData) => {
    setIsLoading(true)
    try {
      await verifyOTP(email!, data.code)
      toast.success('Email verified successfully!')
      navigate('/app/dashboard')
    } catch (error) {
      toast.error('Invalid or expired code')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoginWithOTP = async () => {
    setIsLoading(true)
    try {
      await loginWithOTP(email!, '123456') // Mock OTP for demo
      toast.success('Logged in successfully!')
      navigate('/app/dashboard')
    } catch (error) {
      toast.error('Failed to login with OTP')
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Request</h1>
          <p className="text-gray-600">Email address is required for OTP verification</p>
          <Button onClick={() => navigate('/auth/login')} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
            <p className="text-gray-600">
              We've sent a 6-digit code to <span className="font-medium">{email}</span>
            </p>
            <p className="text-sm text-gray-500 mt-2">
              The code will expire in {formatTime(timeLeft)}
            </p>
          </div>

          <form onSubmit={handleOTPSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Enter 6-digit code"
              type="text"
              placeholder="000000"
              maxLength={6}
              {...register('code')}
              error={errors.code?.message}
              disabled={isLoading}
              className="text-center text-2xl tracking-widest"
            />

            <Button
              type="submit"
              className="w-full"
              variant="gradient"
              loading={isLoading}
              disabled={isLoading || timeLeft === 0}
            >
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </Button>

            <div className="text-center mt-6">
              <button
                type="button"
                onClick={onResendOTP}
                disabled={isResending || timeLeft > 240}
                className="text-sm text-blue-600 hover:text-blue-500 font-medium disabled:text-gray-400"
              >
                {isResending ? 'Sending...' : timeLeft > 240 ? `Resend in ${formatTime(timeLeft - 240)}` : 'Resend Code'}
              </button>
            </div>
          </form>

          <div className="text-center mt-8">
            <Button
              variant="gradient"
              onClick={handleLoginWithOTP}
              loading={isLoading}
              className="w-full mb-3"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Quick Login with Demo OTP
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate('/auth/login')}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default OTPVerificationPage
