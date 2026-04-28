import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Tag, 
  MoreVertical,
  Edit2,
  Trash2,
  Check,
  X,
  Clock,
  AlertCircle
} from "lucide-react";

interface TodoListProps {
  todos: Array<Schema["Todo"]["type"]>;
  client: ReturnType<typeof generateClient<Schema>>;
}

const TodoList: React.FC<TodoListProps> = ({ todos, client }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Schema["Todo"]["type"] | null>(null);
  const [newTodo, setNewTodo] = useState({
    content: "",
    priority: "medium" as const,
    category: "",
    dueDate: "",
    tags: [] as string[],
  });

  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === "all" || todo.priority === filterPriority;
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "completed" && todo.isDone) ||
      (filterStatus === "pending" && !todo.isDone);
    
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const createTodo = async () => {
    if (!newTodo.content.trim()) return;
    
    try {
      await client.models.Todo.create({
        content: newTodo.content,
        priority: newTodo.priority,
        category: newTodo.category || undefined,
        dueDate: newTodo.dueDate || undefined,
        tags: newTodo.tags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      setNewTodo({
        content: "",
        priority: "medium",
        category: "",
        dueDate: "",
        tags: [],
      });
      setShowCreateModal(false);
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  const updateTodo = async (todo: Schema["Todo"]["type"], updates: Partial<Schema["Todo"]["type"]>) => {
    try {
      await client.models.Todo.update({
        id: todo.id,
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const deleteTodo = async (todo: Schema["Todo"]["type"]) => {
    try {
      await client.models.Todo.delete({ id: todo.id });
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const toggleTodoComplete = async (todo: Schema["Todo"]["type"]) => {
    await updateTodo(todo, { isDone: !todo.isDone });
  };

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
    
    if (diffDays < 0) return { text: 'Overdue', color: 'text-red-600 dark:text-red-400', icon: AlertCircle };
    if (diffDays === 0) return { text: 'Due today', color: 'text-orange-600 dark:text-orange-400', icon: Clock };
    if (diffDays === 1) return { text: 'Due tomorrow', color: 'text-yellow-600 dark:text-yellow-400', icon: Clock };
    return { text: `Due in ${diffDays} days`, color: 'text-blue-600 dark:text-blue-400', icon: Calendar };
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tasks</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Manage your tasks and stay organized
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Task
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
            </div>

            {/* Priority Filter */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Todo List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckSquare className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No tasks found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm || filterPriority !== "all" || filterStatus !== "all"
                  ? "Try adjusting your search or filters"
                  : "Get started by creating your first task"}
              </p>
              {!searchTerm && filterPriority === "all" && filterStatus === "all" && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Task
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTodos.map((todo) => {
                const dueStatus = getDueDateStatus(todo.dueDate);
                return (
                  <div
                    key={todo.id}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      {/* Checkbox */}
                      <button
                        onClick={() => toggleTodoComplete(todo)}
                        className={`mt-1 flex-shrink-0 w-5 h-5 rounded border-2 transition-colors ${
                          todo.isDone
                            ? 'bg-blue-600 border-blue-600'
                            : 'border-gray-300 dark:border-gray-600 hover:border-blue-500'
                        }`}
                      >
                        {todo.isDone && <Check className="w-3 h-3 text-white" />}
                      </button>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-lg font-medium ${
                          todo.isDone
                            ? 'line-through text-gray-500'
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {todo.content}
                        </p>
                        
                        {/* Metadata */}
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {todo.priority && (
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(todo.priority)}`}>
                              {todo.priority}
                            </span>
                          )}
                          
                          {todo.category && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                              <Tag className="w-3 h-3 mr-1" />
                              {todo.category}
                            </span>
                          )}
                          
                          {dueStatus && (
                            <span className={`inline-flex items-center text-xs ${dueStatus.color}`}>
                              <dueStatus.icon className="w-3 h-3 mr-1" />
                              {dueStatus.text}
                            </span>
                          )}
                          
                          {todo.tags && todo.tags.length > 0 && (
                            <div className="flex gap-1">
                              {todo.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setEditingTodo(todo)}
                          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteTodo(todo)}
                          className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingTodo) && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
            
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {editingTodo ? 'Edit Task' : 'Create New Task'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Task Title
                  </label>
                  <input
                    type="text"
                    value={editingTodo ? editingTodo.content : newTodo.content}
                    onChange={(e) => editingTodo 
                      ? setEditingTodo({...editingTodo, content: e.target.value})
                      : setNewTodo({...newTodo, content: e.target.value})
                    }
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Enter task title..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={editingTodo ? editingTodo.priority : newTodo.priority}
                    onChange={(e) => editingTodo
                      ? setEditingTodo({...editingTodo, priority: e.target.value as any})
                      : setNewTodo({...newTodo, priority: e.target.value as any})
                    }
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={editingTodo ? editingTodo.category || "" : newTodo.category}
                    onChange={(e) => editingTodo
                      ? setEditingTodo({...editingTodo, category: e.target.value})
                      : setNewTodo({...newTodo, category: e.target.value})
                    }
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Enter category..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="datetime-local"
                    value={editingTodo ? editingTodo.dueDate || "" : newTodo.dueDate}
                    onChange={(e) => editingTodo
                      ? setEditingTodo({...editingTodo, dueDate: e.target.value})
                      : setNewTodo({...newTodo, dueDate: e.target.value})
                    }
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingTodo(null);
                    setNewTodo({
                      content: "",
                      priority: "medium",
                      category: "",
                      dueDate: "",
                      tags: [],
                    });
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (editingTodo) {
                      updateTodo(editingTodo, editingTodo);
                      setEditingTodo(null);
                    } else {
                      createTodo();
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingTodo ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoList;
