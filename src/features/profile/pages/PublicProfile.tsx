import React from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Mail, Globe as GlobeIcon, Eye, Share2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'

const PublicProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>()

  // Mock user data
  const user = {
    username: username || 'johndoe',
    firstName: 'John',
    lastName: 'Doe',
    bio: 'Product manager passionate about building great products and helping teams succeed.',
    email: 'john@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
    joinedDate: 'January 2024',
    location: 'San Francisco, CA',
    website: 'johndoe.com',
    stats: {
      projects: 12,
      tasks: 89,
      completed: 76,
      completionRate: 85
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Profile Header */}
          <Card className="mb-8 overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600"></div>
            <div className="px-8 pb-8">
              <div className="flex items-end -mt-16 mb-6">
                <div className="w-32 h-32 bg-white rounded-2xl p-2 shadow-lg">
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-full h-full rounded-xl object-cover"
                  />
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-gray-600 mb-4">@{user.username}</p>
                  <p className="text-gray-700 leading-relaxed mb-6">{user.bio}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      {user.email}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {user.location}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Joined {user.joinedDate}
                    </div>
                    <div className="flex items-center">
                      <GlobeIcon className="w-4 h-4 mr-2" />
                      {user.website}
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Button variant="gradient">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Profile
                  </Button>
                  <Button variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    Contact
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Projects', value: user.stats.projects, icon: '📁' },
              { label: 'Tasks', value: user.stats.tasks, icon: '✅' },
              { label: 'Completed', value: user.stats.completed, icon: '🎯' },
              { label: 'Success Rate', value: `${user.stats.completionRate}%`, icon: '📈' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center">
                  <CardContent className="p-6">
                    <div className="text-3xl mb-2">{stat.icon}</div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center py-8">
                This user's public activity will be displayed here.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default PublicProfile
