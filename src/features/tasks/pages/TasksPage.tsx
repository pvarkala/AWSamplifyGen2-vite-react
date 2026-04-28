import React from 'react'
import { motion } from 'framer-motion'
import { CheckSquare } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card'

const TasksPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600 mt-2">Manage and track all your tasks</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckSquare className="w-5 h-5 mr-2" />
            All Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-center py-8">
            Tasks page with filtering and management will be implemented here.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default TasksPage
