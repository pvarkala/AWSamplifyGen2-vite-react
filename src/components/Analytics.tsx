import { useState, useEffect } from "react";
import type { Schema } from "../amplify/data/resource";
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Clock, 
  CheckSquare, 
  Target,
  Award,
  Activity,
  PieChart
} from "lucide-react";

interface AnalyticsProps {
  todos: Array<Schema["Todo"]["type"]>;
  projects: Array<Schema["Project"]["type"]>;
}

const Analytics: React.FC<AnalyticsProps> = ({ todos, projects }) => {
  const [stats, setStats] = useState({
    totalTodos: 0,
    completedTodos: 0,
    pendingTodos: 0,
    overdueTodos: 0,
    totalProjects: 0,
    completedProjects: 0,
    averageCompletionTime: 0,
    productivityScore: 0,
  });

  const [priorityStats, setPriorityStats] = useState({
    high: { total: 0, completed: 0 },
    medium: { total: 0, completed: 0 },
    low: { total: 0, completed: 0 },
  });

  const [categoryStats, setCategoryStats] = useState<Array<{category: string, count: number, completed: number}>>([]);
  const [weeklyData, setWeeklyData] = useState<Array<{week: string, completed: number, created: number}>>([]);

  useEffect(() => {
    calculateStats();
  }, [todos, projects]);

  const calculateStats = () => {
    const now = new Date();
    const completedTodos = todos.filter(todo => todo.isDone);
    const pendingTodos = todos.filter(todo => !todo.isDone);
    const overdueTodos = todos.filter(todo => 
      !todo.isDone && 
      todo.dueDate && 
      new Date(todo.dueDate) < now
    );

    // Calculate project stats
    const completedProjects = projects.filter(project => {
      const projectTodos = todos.filter(todo => todo.projectId === project.id);
      return projectTodos.length > 0 && projectTodos.every(todo => todo.isDone);
    });

    // Calculate priority stats
    const highPriority = todos.filter(todo => todo.priority === 'high');
    const mediumPriority = todos.filter(todo => todo.priority === 'medium');
    const lowPriority = todos.filter(todo => todo.priority === 'low');

    setPriorityStats({
      high: { total: highPriority.length, completed: highPriority.filter(t => t.isDone).length },
      medium: { total: mediumPriority.length, completed: mediumPriority.filter(t => t.isDone).length },
      low: { total: lowPriority.length, completed: lowPriority.filter(t => t.isDone).length },
    });

    // Calculate category stats
    const categoryMap = new Map<string, {count: number, completed: number}>();
    todos.forEach(todo => {
      if (todo.category) {
        const existing = categoryMap.get(todo.category) || {count: 0, completed: 0};
        categoryMap.set(todo.category, {
          count: existing.count + 1,
          completed: existing.completed + (todo.isDone ? 1 : 0)
        });
      }
    });
    setCategoryStats(Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      count: data.count,
      completed: data.completed
    })));

    // Calculate weekly data (last 4 weeks)
    const weeklyMap = new Map<string, {completed: number, created: number}>();
    for (let i = 0; i < 4; i++) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (i * 7));
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);
      
      const weekKey = `Week ${4 - i}`;
      weeklyMap.set(weekKey, {completed: 0, created: 0});
      
      todos.forEach(todo => {
        if (todo.createdAt) {
          const createdDate = new Date(todo.createdAt);
          if (createdDate >= weekStart && createdDate <= weekEnd) {
            const week = weeklyMap.get(weekKey)!;
            week.created++;
          }
        }
        
        if (todo.isDone && todo.updatedAt) {
          const updatedDate = new Date(todo.updatedAt);
          if (updatedDate >= weekStart && updatedDate <= weekEnd) {
            const week = weeklyMap.get(weekKey)!;
            week.completed++;
          }
        }
      });
    }
    setWeeklyData(Array.from(weeklyMap.entries()).map(([week, data]) => ({week, ...data})));

    // Calculate average completion time
    const completedTimes = completedTodos
      .filter(todo => todo.createdAt && todo.updatedAt)
      .map(todo => {
        const created = new Date(todo.createdAt!).getTime();
        const completed = new Date(todo.updatedAt!).getTime();
        return (completed - created) / (1000 * 60 * 60 * 24); // days
      });
    
    const avgCompletionTime = completedTimes.length > 0 
      ? completedTimes.reduce((a, b) => a + b, 0) / completedTimes.length 
      : 0;

    // Calculate productivity score (0-100)
    const completionRate = todos.length > 0 ? (completedTodos.length / todos.length) * 100 : 0;
    const onTimeRate = completedTodos.length > 0 
      ? (completedTodos.filter(todo => 
          !todo.dueDate || new Date(todo.updatedAt || 0) <= new Date(todo.dueDate)
        ).length / completedTodos.length) * 100 
      : 0;
    const productivityScore = (completionRate * 0.6 + onTimeRate * 0.4);

    setStats({
      totalTodos: todos.length,
      completedTodos: completedTodos.length,
      pendingTodos: pendingTodos.length,
      overdueTodos: overdueTodos.length,
      totalProjects: projects.length,
      completedProjects: completedProjects.length,
      averageCompletionTime: Math.round(avgCompletionTime * 10) / 10,
      productivityScore: Math.round(productivityScore * 10) / 10,
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900';
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900';
    return 'bg-red-100 dark:bg-red-900';
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Track your productivity and performance metrics
          </p>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Productivity Score</p>
                <p className={`text-3xl font-bold ${getScoreColor(stats.productivityScore)}`}>
                  {stats.productivityScore}%
                </p>
              </div>
              <div className={`p-3 rounded-lg ${getScoreBackground(stats.productivityScore)}`}>
                <Award className="w-6 h-6 text-blue-600 dark:text-blue-300" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completion Rate</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.totalTodos > 0 ? Math.round((stats.completedTodos / stats.totalTodos) * 100) : 0}%
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <Target className="w-6 h-6 text-green-600 dark:text-green-300" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Completion Time</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.averageCompletionTime}d
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600 dark:text-purple-300" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Projects</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.totalProjects - stats.completedProjects}
                </p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Activity className="w-6 h-6 text-orange-600 dark:text-orange-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Priority Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Priority Breakdown
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {Object.entries(priorityStats).map(([priority, data]) => {
                const completionRate = data.total > 0 ? (data.completed / data.total) * 100 : 0;
                const priorityColors = {
                  high: 'bg-red-500',
                  medium: 'bg-yellow-500',
                  low: 'bg-green-500'
                };
                
                return (
                  <div key={priority}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                        {priority} Priority
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {data.completed}/{data.total} completed
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-200 ${priorityColors[priority as keyof typeof priorityColors]}`}
                        style={{ width: `${completionRate}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <PieChart className="w-5 h-5 mr-2" />
                Category Breakdown
              </h2>
            </div>
            <div className="p-6">
              {categoryStats.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No categories assigned yet
                </p>
              ) : (
                <div className="space-y-3">
                  {categoryStats.map((category) => {
                    const completionRate = category.count > 0 ? (category.completed / category.count) * 100 : 0;
                    return (
                      <div key={category.category}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {category.category}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {category.completed}/{category.count} completed
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-200"
                            style={{ width: `${completionRate}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Weekly Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Weekly Activity (Last 4 Weeks)
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {weeklyData.map((week) => (
                <div key={week.week}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {week.week}
                    </span>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-blue-600 dark:text-blue-400">
                        {week.created} created
                      </span>
                      <span className="text-green-600 dark:text-green-400">
                        {week.completed} completed
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-200"
                        style={{ width: `${Math.min((week.created / 10) * 100, 100)}%` }}
                      />
                    </div>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-200"
                        style={{ width: `${Math.min((week.completed / 10) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <CheckSquare className="w-6 h-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Total Tasks</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalTodos}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {stats.completedTodos} completed, {stats.pendingTodos} pending
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                <TrendingUp className="w-6 h-6 text-red-600 dark:text-red-300" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Overdue Tasks</h3>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.overdueTodos}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Need immediate attention
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <Target className="w-6 h-6 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Projects</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalProjects}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {stats.completedProjects} completed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
