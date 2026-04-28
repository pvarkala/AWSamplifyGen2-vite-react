import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  CheckSquare, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  Plus,
  Calendar,
  Target,
  Users
} from "lucide-react";
import type { Schema } from "../amplify/data/resource";

interface DashboardProps {
  todos: Array<Schema["Todo"]["type"]>;
  projects: Array<Schema["Project"]["type"]>;
  user: any;
}

const Dashboard: React.FC<DashboardProps> = ({ todos, projects, user }) => {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
  });

  const [recentTodos, setRecentTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    // Calculate statistics
    const now = new Date();
    const completed = todos.filter(todo => todo.isDone).length;
    const pending = todos.filter(todo => !todo.isDone).length;
    const overdue = todos.filter(todo => 
      !todo.isDone && 
      todo.dueDate && 
      new Date(todo.dueDate) < now
    ).length;

    setStats({
      total: todos.length,
      completed,
      pending,
      overdue,
    });

    // Get recent todos (last 5)
    const recent = todos
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 5);
    setRecentTodos(recent);
  }, [todos]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getDueDateStatus = (dueDate?: string) => {
    if (!dueDate) return null;
    
    const due = new Date(dueDate);
    const now = new Date();
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: 'Overdue', color: 'text-red-600 dark:text-red-400' };
    if (diffDays === 0) return { text: 'Due today', color: 'text-orange-600 dark:text-orange-400' };
    if (diffDays === 1) return { text: 'Due tomorrow', color: 'text-yellow-600 dark:text-yellow-400' };
    if (diffDays <= 7) return { text: `Due in ${diffDays} days`, color: 'text-blue-600 dark:text-blue-400' };
    return { text: `Due in ${diffDays} days`, color: 'text-gray-600 dark:text-gray-400' };
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.username || 'User'}!
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Here's what's happening with your tasks today.
          </p>
        </div>
        <Link
          to="/todos"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Todo
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tasks</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <CheckSquare className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.completed}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-300" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-300" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Overdue</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.overdue}</p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-300" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Todos */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Tasks</h2>
          </div>
          <div className="p-6 space-y-4">
            {recentTodos.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No tasks yet. Create your first task!
              </p>
            ) : (
              recentTodos.map((todo) => {
                const dueStatus = getDueDateStatus(todo.dueDate);
                return (
                  <div key={todo.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div className="flex-shrink-0 mt-1">
                      <div className={`w-4 h-4 rounded-full border-2 ${todo.isDone ? 'bg-blue-600 border-blue-600' : 'border-gray-300 dark:border-gray-600'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${todo.isDone ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                        {todo.content}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        {todo.priority && (
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(todo.priority)}`}>
                            {todo.priority}
                          </span>
                        )}
                        {dueStatus && (
                          <span className={`text-xs ${dueStatus.color}`}>
                            {dueStatus.text}
                          </span>
                        )}
                        {todo.category && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {todo.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Projects Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Projects</h2>
          </div>
          <div className="p-6 space-y-4">
            {projects.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No projects yet. Create your first project!
              </p>
            ) : (
              projects.map((project) => {
                const projectTodos = todos.filter(todo => todo.projectId === project.id);
                const completedTodos = projectTodos.filter(todo => todo.isDone).length;
                const progress = projectTodos.length > 0 ? (completedTodos / projectTodos.length) * 100 : 0;
                
                return (
                  <Link
                    key={project.id}
                    to={`/projects`}
                    className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">{project.name}</h3>
                      {project.color && (
                        <div className={`w-4 h-4 rounded-full`} style={{ backgroundColor: project.color }} />
                      )}
                    </div>
                    {project.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{project.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {completedTodos}/{projectTodos.length} tasks
                      </span>
                      <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-200"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/todos"
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <CheckSquare className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Manage Tasks</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">View and manage all your tasks</p>
            </div>
          </div>
        </Link>

        <Link
          to="/projects"
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <FolderOpen className="w-6 h-6 text-purple-600 dark:text-purple-300" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Projects</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Organize tasks by project</p>
            </div>
          </div>
        </Link>

        <Link
          to="/analytics"
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-300" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Analytics</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Track your productivity</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
