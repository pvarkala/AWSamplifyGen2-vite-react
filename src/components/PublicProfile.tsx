import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { generateClient } from "../lib/mock-amplify-client";
import type { Schema } from "../amplify/data/resource";
import { 
  User, 
  Calendar, 
  MapPin, 
  Mail, 
  Globe as GlobeIcon,
  CheckSquare,
  FolderOpen,
  MessageSquare,
  Eye,
  EyeOff,
  Share2,
  Heart,
  ExternalLink,
  Sparkles,
  Trophy,
  Target,
  Clock,
  Star,
  Award,
  TrendingUp,
  Users,
  BarChart3,
  ArrowRight,
  Twitter,
  Linkedin,
  Github,
  Link2,
  Briefcase,
  Map
} from "lucide-react";

const PublicProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<Schema["User"]["type"] | null>(null);
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [projects, setProjects] = useState<Array<Schema["Project"]["type"]>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const client = generateClient();

  useEffect(() => {
    loadUserProfile();
  }, [username]);

  const loadUserProfile = async () => {
    if (!username) return;
    
    try {
      setLoading(true);
      setError(null);

      // Find user by username
      const users = await client.models.User.list();
      const userProfile = users.data.find(u => u.username === username);
      
      if (!userProfile) {
        setError("User not found");
        return;
      }

      // Check if profile is public
      if (!userProfile.isPublic) {
        setError("This profile is private");
        return;
      }

      setProfile(userProfile);

      // Load public todos and projects
      const [todosResult, projectsResult] = await Promise.all([
        client.models.Todo.list({ filter: { owner: { eq: userProfile.id } } }),
        client.models.Project.list({ filter: { owner: { eq: userProfile.id }, isPublic: { eq: true } } })
      ]);

      setTodos(todosResult.data);
      setProjects(projectsResult.data);
    } catch (err) {
      console.error("Error loading profile:", err);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const shareProfile = () => {
    if (profile) {
      const url = window.location.href;
      navigator.clipboard.writeText(url);
      // You could add a toast notification here
    }
  };

  const getProjectStats = (projectId: string) => {
    const projectTodos = todos.filter(todo => todo.projectId === projectId);
    const completed = projectTodos.filter(todo => todo.isDone).length;
    const total = projectTodos.length;
    return { completed, total, progress: total > 0 ? (completed / total) * 100 : 0 };
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center overflow-hidden">
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400 to-orange-600 rounded-full opacity-20 blur-3xl"></div>
        </div>
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-white animate-pulse" />
          </div>
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600 mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center overflow-hidden">
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-400 to-pink-600 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-orange-400 to-red-600 rounded-full opacity-20 blur-3xl"></div>
        </div>
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-12 shadow-2xl max-w-md w-full mx-4">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            {error}
          </h1>
          <p className="text-gray-600 mb-8 text-center">
            {error === "User not found" 
              ? "The user you're looking for doesn't exist or has changed their username."
              : "This user has set their profile to private."}
          </p>
          <Link
            to="/"
            className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
          >
            <ArrowRight className="w-5 h-5 mr-2" />
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const completedTodos = todos.filter(todo => todo.isDone).length;
  const totalTodos = todos.length;
  const completionRate = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400 to-orange-600 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-gradient-to-br from-green-400 to-blue-600 rounded-full opacity-10 blur-3xl"></div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <Link to="/" className="flex items-center group">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">TodoPro</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={shareProfile}
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                title="Share profile"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <Link
                to="/auth"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Join TodoPro
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Profile Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden">
            {/* Cover Banner */}
            <div className="relative h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute -bottom-16 left-8">
                <div className="relative">
                  <div className="w-32 h-32 rounded-2xl overflow-hidden bg-white/20 backdrop-blur-sm border-4 border-white shadow-2xl">
                    {profile.profilePicture ? (
                      <img
                        src={profile.profilePicture}
                        alt={profile.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500">
                        <User className="w-16 h-16 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="px-8 pb-8 pt-20">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <h1 className="text-4xl font-bold text-gray-900">
                      {profile.username}
                    </h1>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 font-medium">
                        <Eye className="w-4 h-4 mr-1" />
                        Public Profile
                      </span>
                      {profile.commentsEnabled && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 font-medium">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Comments Open
                        </span>
                      )}
                    </div>
                  </div>

                  {profile.bio && (
                    <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                      {profile.bio}
                    </p>
                  )}

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-blue-900">{totalTodos}</div>
                      <div className="text-blue-700 text-sm font-medium">Total Tasks</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Trophy className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-green-900">{completedTodos}</div>
                      <div className="text-green-700 text-sm font-medium">Completed</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <FolderOpen className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-purple-900">{projects.length}</div>
                      <div className="text-purple-700 text-sm font-medium">Public Projects</div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-orange-900">{Math.round(completionRate)}%</div>
                      <div className="text-orange-700 text-sm font-medium">Success Rate</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={shareProfile}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
                    >
                      <Share2 className="w-5 h-5 mr-2" />
                      Share Profile
                    </button>
                    {profile.email && (
                      <a
                        href={`mailto:${profile.email}`}
                        className="inline-flex items-center px-6 py-3 bg-white text-gray-700 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all hover:shadow-lg"
                      >
                        <Mail className="w-5 h-5 mr-2" />
                        Contact
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Tasks */}
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden">
              <div className="p-8 border-b border-gray-200/50">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                    <CheckSquare className="w-5 h-5 text-white" />
                  </div>
                  Recent Tasks
                </h2>
              </div>
              <div className="p-8">
                {todos.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <CheckSquare className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No public tasks</h3>
                    <p className="text-gray-600">This user hasn't shared any public tasks yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {todos.slice(0, 10).map((todo) => (
                      <div key={todo.id} className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0 mt-1">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              todo.isDone
                                ? 'bg-gradient-to-r from-green-500 to-green-600 border-green-600'
                                : 'border-gray-300 hover:border-blue-500 transition-colors'
                            }`}>
                              {todo.isDone && (
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              )}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-lg font-medium mb-2 ${
                              todo.isDone
                                ? 'line-through text-gray-500'
                                : 'text-gray-900'
                            }`}>
                              {todo.content}
                            </p>
                            <div className="flex items-center space-x-3">
                              {todo.priority && (
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(todo.priority)}`}>
                                  {todo.priority}
                                </span>
                              )}
                              {todo.category && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                                  <FolderOpen className="w-3 h-3 mr-1" />
                                  {todo.category}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {todos.length > 10 && (
                      <div className="text-center pt-6">
                        <p className="text-gray-600 font-medium">
                          And {todos.length - 10} more tasks...
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Public Projects */}
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden">
              <div className="p-8 border-b border-gray-200/50">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mr-3">
                    <FolderOpen className="w-5 h-5 text-white" />
                  </div>
                  Public Projects
                </h2>
              </div>
              <div className="p-8">
                {projects.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <FolderOpen className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No public projects</h3>
                    <p className="text-gray-600">This user hasn't shared any public projects yet.</p>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {projects.map((project) => {
                      const stats = getProjectStats(project.id);
                      return (
                        <div
                          key={project.id}
                          className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-gray-900">
                              {project.name}
                            </h3>
                            {project.color && (
                              <div
                                className="w-6 h-6 rounded-full shadow-sm"
                                style={{ backgroundColor: project.color }}
                              />
                            )}
                          </div>
                          {project.description && (
                            <p className="text-gray-600 mb-4 leading-relaxed">
                              {project.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500 font-medium">
                              {stats.completed} of {stats.total} tasks completed
                            </span>
                            <div className="flex items-center space-x-3">
                              <div className="w-32 bg-gray-200 rounded-full h-3">
                                <div
                                  className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all duration-300"
                                  style={{ width: `${stats.progress}%` }}
                                />
                              </div>
                              <span className="text-sm font-semibold text-purple-600">
                                {Math.round(stats.progress)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Profile Details */}
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Profile Details</h3>
              <div className="space-y-6">
                {profile.email && (
                  <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">{profile.email}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-xl">
                  <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="font-medium text-gray-900">
                      {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }) : 'Unknown'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl">
                  <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                    <GlobeIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Profile Status</p>
                    <p className="font-medium text-gray-900">Public Profile</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
              <div className="space-y-4">
                <button
                  onClick={shareProfile}
                  className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Share Profile
                </button>
                <Link
                  to="/auth"
                  className="w-full flex items-center justify-center px-6 py-4 bg-white text-gray-700 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all hover:shadow-lg"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Join TodoPro
                </Link>
              </div>
            </div>

            {/* Achievement Badge */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-8 border border-yellow-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Productivity Master</h3>
                <p className="text-gray-600">This user has completed over 100 tasks with excellent performance!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
