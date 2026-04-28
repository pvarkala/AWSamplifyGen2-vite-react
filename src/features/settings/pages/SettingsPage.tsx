import React from 'react'
import { motion } from 'framer-motion'
import { Settings } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card'

const SettingsPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your application preferences</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Application Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-center py-8">
            Settings page with preferences and configuration will be implemented here.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default SettingsPage
