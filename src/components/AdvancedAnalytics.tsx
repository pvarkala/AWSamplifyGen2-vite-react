import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area,
  ResponsiveContainer
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Users, 
  Target, 
  Calendar, 
  Download, 
  Filter,
  RefreshCw,
  FileText,
  Mail,
  Share2,
  Settings
} from "lucide-react";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

interface AdvancedAnalyticsProps {
  projectId: string;
  client: ReturnType<typeof generateClient<Schema>>;
}

const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ projectId, client }) => {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [timeEntries, setTimeEntries] = useState<Array<Schema["TimeEntry"]["type"]>>([]);
  const [projects, setProjects] = useState<Array<Schema["Project"]["type"]>>([]);
  const [milestones, setMilestones] = useState<Array<Schema["Milestone"]["type"]>>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30days');
  const [activeReport, setActiveReport] = useState('overview');

  useEffect(() => {
    loadData();
  }, [projectId, dateRange]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [todosResult, timeResult, projectsResult, milestonesResult] = await Promise.all([
        client.models.Todo.list(),
        client.models.TimeEntry.list(),
        client.models.Project.list(),
        client.models.Milestone.list(),
      ]);
      
      setTodos(todosResult.data);
      setTimeEntries(timeResult.data);
      setProjects(projectsResult.data);
      setMilestones(milestonesResult.data);
    } catch (error) {
      console.error("Error loading analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredData = () => {
    const now = new Date();
    const daysAgo = dateRange === '7days' ? 7 : dateRange === '30days' ? 30 : 90;
    const cutoffDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
    
    return {
      todos: todos.filter(todo => new Date(todo.createdAt || 0) >= cutoffDate),
      timeEntries: timeEntries.filter(entry => new Date(entry.createdAt || 0) >= cutoffDate),
      milestones: milestones.filter(milestone => new Date(milestone.createdAt || 0) >= cutoffDate),
    };
  };

  const filteredData = getFilteredData();

  // Calculate metrics
  const totalTasks = filteredData.todos.length;
  const completedTasks = filteredData.todos.filter(todo => todo.isDone).length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  const totalHours = filteredData.timeEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0);
  const billableHours = filteredData.timeEntries
    .filter(entry => entry.isBillable)
    .reduce((sum, entry) => sum + (entry.duration || 0), 0);
  const totalRevenue = filteredData.timeEntries
    .filter(entry => entry.isBillable)
    .reduce((sum, entry) => sum + (entry.duration || 0) * (entry.hourlyRate || 0), 0);

  // Chart data
  const dailyCompletionData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toLocaleDateString();
    
    const dayTodos = filteredData.todos.filter(todo => 
      new Date(todo.createdAt || 0).toLocaleDateString() === dateStr
    );
    const dayCompleted = dayTodos.filter(todo => todo.isDone).length;
    
    return {
      date: date.toLocaleDateString('en', { weekday: 'short' }),
      created: dayTodos.length,
      completed: dayCompleted,
    };
  });

  const priorityData = [
    { name: 'High', value: filteredData.todos.filter(todo => todo.priority === 'high').length, color: '#ef4444' },
    { name: 'Medium', value: filteredData.todos.filter(todo => todo.priority === 'medium').length, color: '#eab308' },
    { name: 'Low', value: filteredData.todos.filter(todo => todo.priority === 'low').length, color: '#22c55e' },
  ];

  const categoryData = Array.from(
    new Set(filteredData.todos.map(todo => todo.category).filter(Boolean))
  ).map(category => ({
    category,
    count: filteredData.todos.filter(todo => todo.category === category).length,
    completed: filteredData.todos.filter(todo => todo.category === category && todo.isDone).length,
  }));

  const productivityTrend = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const dateStr = date.toLocaleDateString();
    
    const dayEntries = filteredData.timeEntries.filter(entry => 
      new Date(entry.createdAt || 0).toLocaleDateString() === dateStr
    );
    const hours = dayEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0);
    
    return {
      date: date.toLocaleDateString('en', { month: 'short', day: 'numeric' }),
      hours,
      tasks: filteredData.todos.filter(todo => 
        new Date(todo.createdAt || 0).toLocaleDateString() === dateStr
      ).length,
    };
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Analytics Report', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Date Range: ${dateRange}`, 20, 30);
    doc.text(`Total Tasks: ${totalTasks}`, 20, 40);
    doc.text(`Completed: ${completedTasks}`, 20, 50);
    doc.text(`Completion Rate: ${completionRate.toFixed(1)}%`, 20, 60);
    doc.text(`Total Hours: ${totalHours.toFixed(2)}`, 20, 70);
    doc.text(`Revenue: $${totalRevenue.toFixed(2)}`, 20, 80);
    
    doc.save('analytics-report.pdf');
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet([
      { Metric: 'Total Tasks', Value: totalTasks },
      { Metric: 'Completed Tasks', Value: completedTasks },
      { Metric: 'Completion Rate', Value: `${completionRate.toFixed(1)}%` },
      { Metric: 'Total Hours', Value: totalHours.toFixed(2) },
      { Metric: 'Billable Hours', Value: billableHours.toFixed(2) },
      { Metric: 'Total Revenue', Value: `$${totalRevenue.toFixed(2)}` },
      ...dailyCompletionData.map(item => ({
        Date: item.date,
        'Tasks Created': item.created,
        'Tasks Completed': item.completed,
      })),
    ]);
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Analytics Report');
    XLSX.writeFile(wb, 'analytics-report.xlsx');
  };

  const sendReport = () => {
    // Implementation for sending report via email
    console.log('Sending analytics report...');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Advanced Analytics</h1>
            <p className="text-gray-600 dark:text-gray-400">Comprehensive insights and performance metrics</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
            </select>
            
            <button
              onClick={loadData}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Completion Rate</span>
              <div className={`flex items-center ${completionRate >= 70 ? 'text-green-600' : 'text-yellow-600'}`}>
                {completionRate >= 70 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {completionRate.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {completedTasks} of {totalTasks} tasks
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Hours</span>
              <Clock className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {totalHours.toFixed(1)}h
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {billableHours.toFixed(1)}h billable
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenue</span>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              ${totalRevenue.toFixed(0)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              From billable hours
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Projects</span>
              <Target className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {projects.filter(p => p.status === 'active').length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {milestones.filter(m => !m.isCompleted).length} milestones pending
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Completion Trend */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Daily Completion Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyCompletionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="created" fill="#3b82f6" name="Created" />
                <Bar dataKey="completed" fill="#10b981" name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Priority Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Priority Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Productivity Trend */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Productivity Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={productivityTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="hours" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" name="Hours" />
                <Area type="monotone" dataKey="tasks" stackId="2" stroke="#f59e0b" fill="#f59e0b" name="Tasks" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Category Performance */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Category Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="category" type="category" />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3b82f6" name="Total" />
                <Bar dataKey="completed" fill="#10b981" name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Export Options */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Export Reports</h3>
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <Settings className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={exportToPDF}
              className="flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <FileText className="w-4 h-4 mr-2" />
              Export as PDF
            </button>
            
            <button
              onClick={exportToExcel}
              className="flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export as Excel
            </button>
            
            <button
              onClick={sendReport}
              className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Mail className="w-4 h-4 mr-2" />
              Email Report
            </button>
          </div>
        </div>

        {/* Forecasting */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Forecasting & Predictions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {Math.round(totalHours * 1.2)}h
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Projected hours next month</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {Math.round(completionRate * 1.1)}%
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Predicted completion rate</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                ${Math.round(totalRevenue * 1.15)}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Expected revenue</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;
