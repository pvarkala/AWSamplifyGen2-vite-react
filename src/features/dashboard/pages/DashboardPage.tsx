import React from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Users, 
  FolderOpen, 
  CheckSquare, 
  Clock, 
  Calendar,
  Target,
  BarChart3,
  Plus,
  ArrowRight,
  Star
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { useAuthStore } from '../../../store/authStore'

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore()

  const stats = [
    {
      title: 'Active Projects',
      value: '12',
      change: '+2 from last month',
      trend: 'up',
      icon: FolderOpen,
      color: 'from-blue-600 to-blue-700',
      bgGradient: 'from-blue-50 to-blue-100'
    },
    {
      title: 'Tasks Completed',
      value: '89',
      change: '+15% from last week',
      trend: 'up',
      icon: CheckSquare,
      color: 'from-green-600 to-green-700',
      bgGradient: 'from-green-50 to-green-100'
    },
    {
      title: 'Team Members',
      value: '24',
      change: '+3 new this month',
      trend: 'up',
      icon: Users,
      color: 'from-purple-600 to-purple-700',
      bgGradient: 'from-purple-50 to-purple-100'
    },
    {
      title: 'Hours Tracked',
      value: '342',
      change: '+8% from last week',
      trend: 'up',
      icon: Clock,
      color: 'from-orange-600 to-orange-700',
      bgGradient: 'from-orange-50 to-orange-100'
    }
  ]

  const recentProjects = [
    {
      id: 1,
      name: 'Website Redesign',
      progress: 75,
      status: 'on-track',
      dueDate: '2024-02-15',
      team: ['JD', 'AS', 'MK'],
      color: 'bg-blue-500'
    },
    {
      id: 2,
      name: 'Mobile App Development',
      progress: 45,
      status: 'at-risk',
      dueDate: '2024-03-01',
      team: ['JD', 'RK', 'TL', 'SM'],
      color: 'bg-purple-500'
    },
    {
      id: 3,
      name: 'Marketing Campaign',
      progress: 90,
      status: 'on-track',
      dueDate: '2024-01-30',
      team: ['AS', 'MK'],
      color: 'bg-green-500'
    }
  ]

  const upcomingTasks = [
    {
      id: 1,
      title: 'Complete wireframes for landing page',
      project: 'Website Redesign',
      priority: 'high',
      dueDate: 'Today',
      assignee: 'JD'
    },
    {
      id: 2,
      title: 'Review API documentation',
      project: 'Mobile App Development',
      priority: 'medium',
      dueDate: 'Tomorrow',
      assignee: 'RK'
    },
    {
      id: 3,
      title: 'Finalize campaign assets',
      project: 'Marketing Campaign',
      priority: 'high',
      dueDate: 'In 2 days',
      assignee: 'AS'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-muted-foreground mt-2">
            Here's what's happening with your projects today.
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            View Calendar
          </Button>
          <Button variant="gradient">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                    <p className="text-sm text-muted-foreground mt-1 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1 text-primary" />
                      {stat.change}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center text-primary-foreground">
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <FolderOpen className="w-5 h-5 mr-2" />
                Recent Projects
              </CardTitle>
              <Button variant="ghost" size="sm">
                View all
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentProjects.map((project) => (
                <div key={project.id} className="border rounded-lg p-4 hover:border-primary/50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 ${project.color} rounded-full`}></div>
                      <h3 className="font-medium text-foreground">{project.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        project.status === 'on-track' 
                          ? 'bg-primary/20 text-primary' 
                          : 'bg-accent/20 text-accent'
                      }`}>
                        {project.status === 'on-track' ? 'On Track' : 'At Risk'}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">{project.dueDate}</span>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Progress</span>
                      <span className="text-sm font-medium text-foreground">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          project.status === 'on-track' ? 'bg-primary' : 'bg-accent'
                        }`}
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {project.team.map((member, index) => (
                        <div key={index} className="w-6 h-6 bg-muted rounded-full border-2 border-background flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">{member}</span>
                        </div>
                      ))}
                    </div>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Upcoming Tasks
              </CardTitle>
              <Button variant="ghost" size="sm">
                View all
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="border rounded-lg p-4 hover:border-primary/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-foreground text-sm leading-tight">
                      {task.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      task.priority === 'high' 
                        ? 'bg-destructive/20 text-destructive' 
                        : 'bg-accent/20 text-accent'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-2">{task.project}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{task.dueDate}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 bg-muted rounded-full flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">{task.assignee}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Create New Task
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Invite Team Member
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Clock className="w-4 h-4 mr-2" />
                Start Time Tracking
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Performance Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="w-5 h-5 mr-2" />
                Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Productivity Score</span>
                  <span className="text-sm font-medium text-gray-900">92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Team Collaboration</span>
                  <span className="text-sm font-medium text-gray-900">87%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '87%' }}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Project Delivery</span>
                  <span className="text-sm font-medium text-gray-900">95%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default DashboardPage
