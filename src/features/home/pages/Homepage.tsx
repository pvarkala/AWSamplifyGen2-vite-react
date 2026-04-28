import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Sparkles, 
  CheckSquare, 
  Users, 
  ArrowRight,
  Star,
  BarChart3,
  Rocket,
  Brain,
  MessageSquare,
  Calendar,
  Video,
  Shield,
  Clock,
  Target,
  Twitter,
  Linkedin,
  Github
} from 'lucide-react'
import { Button } from '../../../components/ui/Button'

const Homepage: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Intelligence",
      description: "Smart task prioritization, predictive analytics, and automated workflow suggestions",
      color: "from-purple-600 to-pink-600",
      bgGradient: "from-purple-50 to-pink-50"
    },
    {
      icon: Users,
      title: "Real-Time Collaboration",
      description: "Live video calls, instant messaging, and simultaneous document editing",
      color: "from-blue-600 to-cyan-600",
      bgGradient: "from-blue-50 to-cyan-50"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level encryption, SSO integration, and comprehensive audit trails",
      color: "from-green-600 to-emerald-600",
      bgGradient: "from-green-50 to-emerald-50"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Custom dashboards, performance metrics, and predictive forecasting",
      color: "from-orange-600 to-red-600",
      bgGradient: "from-orange-50 to-red-50"
    },
    {
      icon: Clock,
      title: "Smart Time Tracking",
      description: "Automatic time capture, productivity insights, and resource optimization",
      color: "from-indigo-600 to-blue-600",
      bgGradient: "from-indigo-50 to-blue-50"
    },
    {
      icon: Target,
      title: "Goal Management",
      description: "Milestone tracking, progress visualization, and achievement celebrations",
      color: "from-teal-600 to-green-600",
      bgGradient: "from-teal-50 to-green-50"
    }
  ]

  const stats = [
    { value: "50K+", label: "Active Users", icon: Users },
    { value: "1,200+", label: "Companies", icon: BarChart3 },
    { value: "5M+", label: "Tasks Completed", icon: CheckSquare },
    { value: "99.9%", label: "Uptime", icon: Shield }
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CEO at TechCorp",
      content: "TodoPro has completely transformed how our team operates. The AI insights and real-time collaboration features have increased our productivity by 40% in just 3 months.",
      rating: 5,
      avatar: "SJ",
      company: "Fortune 500 Company"
    },
    {
      name: "Michael Chen",
      role: "Product Manager at StartupXYZ",
      content: "The analytics and reporting capabilities are incredible. We can now make data-driven decisions and track our team's performance in real-time. It's a game-changer!",
      rating: 5,
      avatar: "MC",
      company: "Y Combinator Startup"
    },
    {
      name: "Emily Davis",
      role: "CTO at Digital Agency",
      content: "Best project management tool we've ever used. The interface is intuitive, features are powerful, and customer support is exceptional. Highly recommended!",
      rating: 5,
      avatar: "ED",
      company: "Award-Winning Agency"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400 to-orange-600 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-green-400 to-blue-600 rounded-full opacity-10 blur-3xl"></div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center group">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">TodoPro</span>
              </div>
              
              <div className="hidden md:ml-10 md:flex md:space-x-1">
                <a href="#features" className="text-gray-700 hover:text-blue-600 px-4 py-2 text-sm font-medium transition-all hover:bg-blue-50 rounded-lg">
                  Features
                </a>
                <a href="#testimonials" className="text-gray-700 hover:text-blue-600 px-4 py-2 text-sm font-medium transition-all hover:bg-blue-50 rounded-lg">
                  Testimonials
                </a>
                <a href="#pricing" className="text-gray-700 hover:text-blue-600 px-4 py-2 text-sm font-medium transition-all hover:bg-blue-50 rounded-lg">
                  Pricing
                </a>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
                to="/auth/login" 
                className="text-gray-700 hover:text-blue-600 px-4 py-2 text-sm font-medium transition-all hover:bg-blue-50 rounded-lg"
              >
                Sign In
              </Link>
              <Link 
                to="/auth/signup" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full">
                  <Sparkles className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-blue-800">AI-Powered Productivity Platform</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                  Transform Your
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    Workflow Today
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Experience the next generation of project management with AI-powered insights, 
                  real-time collaboration, and intelligent automation that adapts to your team's needs.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/auth/signup" 
                  className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-xl flex items-center justify-center"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/auth/login" 
                  className="bg-white text-gray-700 px-8 py-4 rounded-xl text-lg font-medium border-2 border-gray-200 hover:border-gray-300 transition-all hover:shadow-lg flex items-center justify-center"
                >
                  <Rocket className="w-5 h-5 mr-2" />
                  Watch Demo
                </Link>
              </div>
              
              <div className="flex items-center space-x-8">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{String.fromCharCode(65 + i)}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Trusted by 50,000+ teams worldwide</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative z-10"
              >
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-1 shadow-2xl">
                  <div className="bg-white rounded-2xl p-8">
                    <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Rocket className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Interactive Dashboard</h3>
                        <p className="text-gray-600">See your productivity soar with real-time insights</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl opacity-20 blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-r from-green-400 to-blue-400 rounded-2xl opacity-20 blur-xl"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-full mb-4">
              <Brain className="w-4 h-4 text-purple-600 mr-2" />
              <span className="text-sm font-medium text-purple-800">Powerful Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need to
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                Succeed Together
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From AI-powered insights to real-time collaboration, TodoPro provides all the tools your team needs to achieve exceptional results.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`group relative bg-gradient-to-br ${feature.bgGradient} p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer`}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-white mb-6 transform group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                <div className="mt-6 flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                  Learn more
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white">
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white">{stat.value}</div>
                <div className="text-blue-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-full mb-4">
              <Star className="w-4 h-4 text-yellow-600 mr-2" />
              <span className="text-sm font-medium text-yellow-800">Customer Success</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Loved by Teams
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600">
                Worldwide
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what industry leaders and innovative teams have to say about their experience with TodoPro.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="flex items-center mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div className="ml-4">
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Transform Your Team's
              <span className="block">Productivity Today</span>
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of teams already using TodoPro to achieve their goals faster, collaborate better, and deliver exceptional results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/auth/signup" 
                className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-medium hover:bg-gray-50 transition-all transform hover:scale-105 shadow-xl"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </Link>
              <button className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl text-lg font-medium border-2 border-white/30 hover:bg-white/30 transition-all">
                Schedule Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold">TodoPro</span>
              </div>
              <p className="text-gray-400">
                The future of project management and team collaboration. 
                Powered by AI and built for modern teams.
              </p>
              <div className="flex space-x-4">
                <Twitter className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
                <Linkedin className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
                <Github className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Roadmap</a></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">&copy; 2024 TodoPro. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Homepage
