import { useState, useEffect } from "react";
import type { Schema } from "../amplify/data/resource";
import { 
  Plus,
  Edit2,
  Trash2,
  CheckSquare,
  Eye,
  EyeOff,
  Search,
  Calendar,
  FolderOpen,
} from "lucide-react";

interface ProjectsProps {
  projects: Array<Schema["Project"]["type"]>;
  client: any;
}

const Projects: React.FC<ProjectsProps> = ({ projects, client }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Schema["Project"]["type"] | null>(null);
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    color: "#3B82F6",
    isPublic: false,
  });

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const result = await client.models.Todo.list();
      setTodos(result.data);
    } catch (error) {
      console.error("Error loading todos:", error);
    }
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const createProject = async () => {
    if (!newProject.name.trim()) return;
    
    try {
      await client.models.Project.create({
        name: newProject.name,
        description: newProject.description || undefined,
        color: newProject.color,
        isPublic: newProject.isPublic,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      setNewProject({
        name: "",
        description: "",
        color: "#3B82F6",
        isPublic: false,
      });
      setShowCreateModal(false);
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const updateProject = async (project: Schema["Project"]["type"], updates: Partial<Schema["Project"]["type"]>) => {
    try {
      await client.models.Project.update({
        id: project.id,
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const deleteProject = async (project: Schema["Project"]["type"]) => {
    // First, delete all todos associated with this project
    const projectTodos = todos.filter(todo => todo.projectId === project.id);
    for (const todo of projectTodos) {
      await client.models.Todo.delete({ id: todo.id });
    }
    
    // Then delete the project
    try {
      await client.models.Project.delete({ id: project.id });
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const getProjectStats = (projectId: string) => {
    const projectTodos = todos.filter(todo => todo.projectId === projectId);
    const completed = projectTodos.filter(todo => todo.isDone).length;
    const total = projectTodos.length;
    return { completed, total, progress: total > 0 ? (completed / total) * 100 : 0 };
  };

  const colors = [
    "#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", 
    "#EC4899", "#14B8A6", "#F97316", "#6366F1", "#84CC16"
  ];

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projects</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Organize your tasks by project
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Project
          </button>
        </div>

        {/* Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No projects found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm
                ? "Try adjusting your search"
                : "Get started by creating your first project"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Project
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const stats = getProjectStats(project.id);
              return (
                <div
                  key={project.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: project.color }}
                        />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {project.name}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-1">
                        {project.isPublic ? (
                          <Eye className="w-4 h-4 text-gray-400" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        )}
                        <button
                          onClick={() => setEditingProject(project)}
                          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteProject(project)}
                          className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Description */}
                    {project.description && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        {project.description}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <CheckSquare className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400">
                            {stats.completed}/{stats.total} tasks
                          </span>
                        </div>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {Math.round(stats.progress)}%
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-200"
                          style={{
                            width: `${stats.progress}%`,
                            backgroundColor: project.color,
                          }}
                        />
                      </div>

                      {/* Metadata */}
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'Unknown'}
                          </div>
                        </div>
                        <div className="flex items-center">
                          {project.isPublic ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              Public
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                              Private
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingProject) && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
            
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {editingProject ? 'Edit Project' : 'Create New Project'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={editingProject ? editingProject.name : newProject.name}
                    onChange={(e) => editingProject
                      ? setEditingProject({...editingProject, name: e.target.value})
                      : setNewProject({...newProject, name: e.target.value})
                    }
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Enter project name..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={editingProject ? editingProject.description || "" : newProject.description}
                    onChange={(e) => editingProject
                      ? setEditingProject({...editingProject, description: e.target.value})
                      : setNewProject({...newProject, description: e.target.value})
                    }
                    rows={3}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Enter project description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Color
                  </label>
                  <div className="flex space-x-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => editingProject
                          ? setEditingProject({...editingProject, color})
                          : setNewProject({...newProject, color})
                        }
                        className={`w-8 h-8 rounded-full border-2 ${
                          (editingProject ? editingProject.color : newProject.color) === color
                            ? 'border-gray-900 dark:border-white'
                            : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editingProject ? editingProject.isPublic : newProject.isPublic}
                      onChange={(e) => editingProject
                        ? setEditingProject({...editingProject, isPublic: e.target.checked})
                        : setNewProject({...newProject, isPublic: e.target.checked})
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Make this project public
                    </span>
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingProject(null);
                    setNewProject({
                      name: "",
                      description: "",
                      color: "#3B82F6",
                      isPublic: false,
                    });
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (editingProject) {
                      updateProject(editingProject, editingProject);
                      setEditingProject(null);
                    } else {
                      createProject();
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingProject ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
