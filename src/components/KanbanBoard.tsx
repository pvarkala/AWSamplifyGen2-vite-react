import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";
import { 
  Plus, 
  MoreVertical, 
  Clock, 
  Calendar, 
  User, 
  Tag, 
  MessageSquare,
  Video,
  Phone,
  Timer,
  Target,
  GripVertical,
  X,
  Edit2,
  CheckSquare
} from "lucide-react";
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent, useSensor, useSensors, PointerSensor, KeyboardSensor } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

interface KanbanBoardProps {
  projectId: string;
  client: ReturnType<typeof generateClient<Schema>>;
}

interface Column {
  id: string;
  title: string;
  color: string;
  todos: Array<Schema["Todo"]["type"]>;
}

const SortableTodoCard: React.FC<{ todo: Schema["Todo"]["type"]; onUpdate: (todo: Schema["Todo"]["type"]) }> = ({ todo, onUpdate }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      default: return 'border-gray-300 bg-gray-50 dark:bg-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'todo': return <Target className="w-4 h-4" />;
      case 'in_progress': return <Timer className="w-4 h-4" />;
      case 'review': return <MessageSquare className="w-4 h-4" />;
      case 'done': return <CheckSquare className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border ${getPriorityColor(todo.priority || 'medium')} p-4 cursor-move hover:shadow-md transition-shadow`}
      {...attributes}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div {...listeners} className="cursor-grab active:cursor-grabbing">
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>
          {todo.status && (
            <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
              {getStatusIcon(todo.status)}
            </div>
          )}
        </div>
        <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      <h3 className="font-medium text-gray-900 dark:text-white mb-2">
        {todo.content}
      </h3>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        {todo.priority && (
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            todo.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
            todo.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
          }`}>
            {todo.priority}
          </span>
        )}
        
        {todo.category && (
          <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            <Tag className="w-3 h-3 mr-1" />
            {todo.category}
          </span>
        )}

        {todo.estimatedHours && (
          <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            <Timer className="w-3 h-3 mr-1" />
            {todo.estimatedHours}h
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-3">
          {todo.dueDate && (
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{new Date(todo.dueDate).toLocaleDateString()}</span>
            </div>
          )}
          
          {todo.assigneeId && (
            <div className="flex items-center space-x-1">
              <User className="w-3 h-3" />
              <span>Assigned</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {todo.comments && todo.comments.length > 0 && (
            <div className="flex items-center space-x-1">
              <MessageSquare className="w-3 h-3" />
              <span>{todo.comments.length}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const KanbanBoard: React.FC<KanbanBoardProps> = ({ projectId, client }) => {
  const [columns, setColumns] = useState<Column[]>([
    { id: 'todo', title: 'To Do', color: 'bg-gray-500', todos: [] },
    { id: 'in_progress', title: 'In Progress', color: 'bg-blue-500', todos: [] },
    { id: 'review', title: 'Review', color: 'bg-yellow-500', todos: [] },
    { id: 'done', title: 'Done', color: 'bg-green-500', todos: [] },
  ]);
  
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [loading, setLoading] = useState(true);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadTodos();
  }, [projectId]);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const result = await client.models.Todo.list({
        filter: { projectId: { eq: projectId } }
      });
      
      const todosData = result.data;
      setTodos(todosData);
      
      // Organize todos into columns
      const organizedColumns = columns.map(column => ({
        ...column,
        todos: todosData.filter(todo => todo.status === column.id)
      }));
      
      setColumns(organizedColumns);
    } catch (error) {
      console.error("Error loading todos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveColumnId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    const activeColumn = columns.find(col => 
      col.todos.some(todo => todo.id === activeId)
    );
    
    const overColumn = columns.find(col => 
      col.id === overId || col.todos.some(todo => todo.id === overId)
    );
    
    if (!activeColumn || !overColumn || activeColumn.id === overColumn.id) return;
    
    setColumns(prevColumns => {
      const newColumns = [...prevColumns];
      const activeColumnIndex = newColumns.findIndex(col => col.id === activeColumn.id);
      const overColumnIndex = newColumns.findIndex(col => col.id === overColumn.id);
      
      const activeTodo = activeColumn.todos.find(todo => todo.id === activeId);
      if (!activeTodo) return newColumns;
      
      // Remove from active column
      newColumns[activeColumnIndex] = {
        ...newColumns[activeColumnIndex],
        todos: newColumns[activeColumnIndex].todos.filter(todo => todo.id !== activeId)
      };
      
      // Add to over column
      newColumns[overColumnIndex] = {
        ...newColumns[overColumnIndex],
        todos: [...newColumns[overColumnIndex].todos, activeTodo]
      };
      
      return newColumns;
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveColumnId(null);
      return;
    }
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    const activeColumn = columns.find(col => 
      col.todos.some(todo => todo.id === activeId)
    );
    
    const overColumn = columns.find(col => 
      col.id === overId || col.todos.some(todo => todo.id === overId)
    );
    
    if (!activeColumn || !overColumn) {
      setActiveColumnId(null);
      return;
    }
    
    const activeTodo = activeColumn.todos.find(todo => todo.id === activeId);
    if (!activeTodo) {
      setActiveColumnId(null);
      return;
    }
    
    // Update todo status in database
    try {
      await client.models.Todo.update({
        id: activeTodo.id,
        status: overColumn.id as any,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error updating todo status:", error);
      // Revert the change if update fails
      await loadTodos();
    }
    
    setActiveColumnId(null);
  };

  const addTodo = (columnId: string) => {
    // This would open a modal to create a new todo
    console.log("Add todo to column:", columnId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Kanban Board</h2>
          <p className="text-gray-600 dark:text-gray-400">Drag and drop tasks to update their status</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            <Video className="w-4 h-4 mr-2" />
            Start Meeting
          </button>
          <button className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map((column) => (
            <div key={column.id} className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${column.color}`} />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {column.title}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {column.todos.length}
                  </span>
                </div>
                <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 min-h-0">
                <SortableContext
                  items={column.todos.map(todo => todo.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {column.todos.map((todo) => (
                      <SortableTodoCard
                        key={todo.id}
                        todo={todo}
                        onUpdate={(updatedTodo) => {
                          // Handle todo updates
                          console.log("Update todo:", updatedTodo);
                        }}
                      />
                    ))}
                  </div>
                </SortableContext>

                <button
                  onClick={() => addTodo(column.id)}
                  className="w-full mt-3 p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <Plus className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </DndContext>
    </div>
  );
};

export default KanbanBoard;
