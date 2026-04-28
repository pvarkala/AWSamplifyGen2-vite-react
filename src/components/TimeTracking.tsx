import { useState, useEffect } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient, MockClient } from "../lib/mock-amplify-client";
import { 
  Play, 
  Pause, 
  Square, 
  Clock, 
  Calendar, 
  Timer, 
  TrendingUp,
  BarChart3,
  DollarSign,
  Target,
  Plus,
  Edit2,
  Trash2
} from "lucide-react";

interface TimeTrackingProps {
  projectId: string;
  client: MockClient;
}

interface TimeEntry {
  id: string;
  description: string;
  duration: number;
  isBillable: boolean;
  hourlyRate: number;
  todoId?: string;
  createdAt: string;
  startTime?: string;
}

const TimeTracking: React.FC<TimeTrackingProps> = ({ projectId, client }) => {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<Partial<TimeEntry> | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [newEntry, setNewEntry] = useState({
    description: "",
    duration: 0,
    isBillable: false,
    hourlyRate: 0,
  });
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    loadData();
  }, [projectId]);

  useEffect(() => {
    let interval: number;
    
    if (isTracking && currentEntry?.startTime) {
      interval = window.setInterval(() => {
        const now = new Date().getTime();
        const start = new Date(currentEntry.startTime!).getTime();
        const elapsed = Math.floor((now - start) / 1000);
        setElapsedTime(elapsed);
      }, 1000);
    }
    
    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [isTracking, currentEntry]);

  const loadData = async () => {
    try {
      const [entriesResult, todosResult] = await Promise.all([
        client.models.TimeEntry.list(),
        client.models.Todo.list()
      ]);
      
      setTimeEntries(entriesResult.data as TimeEntry[]);
      setTodos(todosResult.data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const startTracking = () => {
    setCurrentEntry({
      description: "",
      startTime: new Date().toISOString(),
      isBillable: false,
      hourlyRate: 0,
    });
    setIsTracking(true);
    setElapsedTime(0);
  };

  const stopTracking = async () => {
    if (!currentEntry?.startTime) return;
    
    try {
      const endTime = new Date();
      const startTime = new Date(currentEntry.startTime);
      const duration = (endTime.getTime() - startTime.getTime()) / 1000; // seconds
      
      await client.models.TimeEntry.create({
        description: currentEntry.description || "Time entry",
        projectId,
        startTime: currentEntry.startTime,
        endTime: endTime.toISOString(),
        duration: duration / 3600, // convert to hours
        isBillable: currentEntry.isBillable || false,
        hourlyRate: currentEntry.hourlyRate || 0,
        createdAt: new Date().toISOString(),
      });
      
      await loadData();
      setCurrentEntry(null);
      setIsTracking(false);
      setElapsedTime(0);
    } catch (error) {
      console.error("Error saving time entry:", error);
    }
  };

  const addManualEntry = async () => {
    try {
      await client.models.TimeEntry.create({
        description: newEntry.description,
        projectId,
        duration: newEntry.duration,
        isBillable: newEntry.isBillable,
        hourlyRate: newEntry.hourlyRate,
        createdAt: new Date().toISOString(),
      });
      
      await loadData();
      setShowAddEntry(false);
      setNewEntry({
        description: "",
        duration: 0,
        isBillable: false,
        hourlyRate: 0,
      });
    } catch (error) {
      console.error("Error adding time entry:", error);
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      await client.models.TimeEntry.delete();
      await loadData();
    } catch (error) {
      console.error("Error deleting time entry:", error);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatHours = (hours: number) => {
    return hours.toFixed(2);
  };

  const getTotalHours = () => {
    return timeEntries.reduce((total, entry) => total + (entry.duration || 0), 0);
  };

  const getTotalBillable = () => {
    return timeEntries
      .filter(entry => entry.isBillable)
      .reduce((total, entry) => total + (entry.duration || 0) * (entry.hourlyRate || 0), 0);
  };

  const getTodayHours = () => {
    const today = new Date().toDateString();
    return timeEntries
      .filter(entry => new Date(entry.createdAt).toDateString() === today)
      .reduce((total, entry) => total + (entry.duration || 0), 0);
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Time Tracking</h1>
            <p className="text-gray-600 dark:text-gray-400">Track time spent on tasks and projects</p>
          </div>
          <button
            onClick={() => setShowAddEntry(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Entry
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Hours</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatHours(getTotalHours())}h
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-300" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatHours(getTodayHours())}h
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600 dark:text-green-300" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Billable</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${getTotalBillable().toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-300" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Entries</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {timeEntries.length}
                </p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <BarChart3 className="w-6 h-6 text-orange-600 dark:text-orange-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Timer */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Timer</h2>
            
            {isTracking ? (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-mono font-bold text-gray-900 dark:text-white mb-4">
                    {formatTime(elapsedTime)}
                  </div>
                  
                  <input
                    type="text"
                    placeholder="What are you working on?"
                    value={currentEntry?.description || ""}
                    onChange={(e) => setCurrentEntry({...currentEntry!, description: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={stopTracking}
                    className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Square className="w-5 h-5 mr-2" />
                    Stop
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <button
                  onClick={startTracking}
                  className="flex items-center px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-lg"
                >
                  <Play className="w-6 h-6 mr-3" />
                  Start Timer
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Time Entries */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Entries</h2>
          </div>
          <div className="p-6">
            {timeEntries.length === 0 ? (
              <div className="text-center py-8">
                <Timer className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No time entries yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {timeEntries.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {entry.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                        <span>{formatHours(entry.duration)}h</span>
                        {entry.isBillable && <span className="text-green-600">Billable</span>}
                        {entry.hourlyRate > 0 && <span>${entry.hourlyRate}/hr</span>}
                        <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteEntry(entry.id)}
                        className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add Entry Modal */}
        {showAddEntry && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75" />
              
              <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Add Time Entry
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={newEntry.description}
                      onChange={(e) => setNewEntry({...newEntry, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="What did you work on?"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Duration (hours)
                    </label>
                    <input
                      type="number"
                      step="0.25"
                      value={newEntry.duration}
                      onChange={(e) => setNewEntry({...newEntry, duration: parseFloat(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isBillable"
                      checked={newEntry.isBillable}
                      onChange={(e) => setNewEntry({...newEntry, isBillable: e.target.checked})}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="isBillable" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Billable
                    </label>
                  </div>
                  
                  {newEntry.isBillable && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Hourly Rate
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={newEntry.hourlyRate}
                        onChange={(e) => setNewEntry({...newEntry, hourlyRate: parseFloat(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="0.00"
                      />
                    </div>
                  )}
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowAddEntry(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addManualEntry}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add Entry
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeTracking;
