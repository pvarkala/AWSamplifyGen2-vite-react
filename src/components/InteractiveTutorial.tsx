import { useState } from "react";
import { Joyride, Step } from "react-joyride";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  X, 
  CheckCircle, 
  Lightbulb,
  Target,
} from "lucide-react";

interface InteractiveTutorialProps {
  onComplete?: () => void;
  userRole?: 'beginner' | 'intermediate' | 'advanced';
}

const InteractiveTutorial: React.FC<InteractiveTutorialProps> = ({ 
  onComplete, 
  userRole = 'beginner' 
}) => {
  const [runTour, setRunTour] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [tourProgress, setTourProgress] = useState(0);
  const [selectedRole, setSelectedRole] = useState(userRole);
  const [showWelcome, setShowWelcome] = useState(true);

  const getTutorialSteps = (role: string): Step[] => {
    const commonSteps: Step[] = [
      {
        target: '.dashboard-overview',
        content: 'Welcome to TodoPro! This is your dashboard where you can see an overview of all your tasks and projects.',
        placement: 'bottom',
        title: 'Dashboard Overview',
      },
      {
        target: '.sidebar-navigation',
        content: 'Use the sidebar to navigate between different sections of the app.',
        placement: 'right',
        title: 'Navigation',
      },
      {
        target: '.create-task-button',
        content: 'Click here to create a new task. You can add priority, due dates, and assign team members.',
        placement: 'bottom',
        title: 'Creating Tasks',
      },
      {
        target: '.kanban-board',
        content: 'This is your Kanban board. Drag and drop tasks between columns to update their status.',
        placement: 'top',
        title: 'Kanban Board',
      },
      {
        target: '.team-chat',
        content: 'Communicate with your team in real-time. Use @mentions to notify specific team members.',
        placement: 'left',
        title: 'Team Chat',
      },
      {
        target: '.time-tracking',
        content: 'Track time spent on tasks and projects. Start the timer or add manual entries.',
        placement: 'top',
        title: 'Time Tracking',
      },
      {
        target: '.analytics-dashboard',
        content: 'View detailed analytics about your productivity, team performance, and project progress.',
        placement: 'bottom',
        title: 'Analytics',
      },
    ];

    const beginnerSteps: Step[] = [
      ...commonSteps,
      {
        target: '.profile-settings',
        content: 'Customize your profile, set your preferences, and manage your account settings.',
        placement: 'left',
        title: 'Profile Settings',
      },
      {
        target: '.help-center',
        content: 'Need help? Check out our help center for guides and documentation.',
        placement: 'top',
        title: 'Help Center',
      },
    ];

    const intermediateSteps: Step[] = [
      ...commonSteps,
      {
        target: '.project-management',
        content: 'Advanced project management features including milestones, dependencies, and resource allocation.',
        placement: 'bottom',
        title: 'Project Management',
      },
      {
        target: '.collaboration-tools',
        content: 'Real-time collaboration tools including document editing and video calls.',
        placement: 'left',
        title: 'Collaboration Tools',
      },
    ];

    const advancedSteps: Step[] = [
      ...commonSteps,
      {
        target: '.advanced-analytics',
        content: 'Advanced analytics with custom reports, forecasting, and team performance metrics.',
        placement: 'bottom',
        title: 'Advanced Analytics',
      },
      {
        target: '.automation-settings',
        content: 'Set up automation rules, workflows, and integrations with other tools.',
        placement: 'left',
        title: 'Automation & Integrations',
      },
    ];

    switch (role) {
      case 'beginner':
        return beginnerSteps;
      case 'intermediate':
        return intermediateSteps;
      case 'advanced':
        return advancedSteps;
      default:
        return commonSteps;
    }
  };

  const steps = getTutorialSteps(selectedRole);

  
  const startTour = () => {
    setShowWelcome(false);
    setRunTour(true);
    setStepIndex(0);
    setTourProgress(0);
  };

  const restartTour = () => {
    setStepIndex(0);
    setTourProgress(0);
    setRunTour(true);
  };

  const pauseTour = () => {
    setRunTour(false);
  };

  const resumeTour = () => {
    setRunTour(true);
  };

  const skipTour = () => {
    setRunTour(false);
    if (onComplete) onComplete();
  };

  if (showWelcome) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="w-8 h-8 text-blue-600 dark:text-blue-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome to TodoPro!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Let's get you started with a quick tour of the platform.
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              What's your experience level?
            </label>
            <div className="space-y-2">
              {[
                { value: 'beginner', label: 'Beginner', description: 'New to project management tools' },
                { value: 'intermediate', label: 'Intermediate', description: 'Familiar with basic concepts' },
                { value: 'advanced', label: 'Advanced', description: 'Experienced with complex workflows' },
              ].map((role) => (
                <button
                  key={role.value}
                  onClick={() => setSelectedRole(role.value as any)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedRole === role.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="font-medium text-gray-900 dark:text-white">
                    {role.label}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {role.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setShowWelcome(false)}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
            >
              Skip Tour
            </button>
            <button
              onClick={startTour}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Tour
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Joyride
        steps={steps}
        run={runTour}
        stepIndex={stepIndex}
        continuous={true}
      />

      {/* Tour Controls */}
      {(runTour || stepIndex > 0) && (
        <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-40">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${tourProgress}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {stepIndex + 1}/{steps.length}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              {runTour ? (
                <button
                  onClick={pauseTour}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  title="Pause Tour"
                >
                  <Pause className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={resumeTour}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  title="Resume Tour"
                >
                  <Play className="w-4 h-4" />
                </button>
              )}
              
              <button
                onClick={restartTour}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                title="Restart Tour"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              
              <button
                onClick={skipTour}
                className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                title="Skip Tour"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Start Guide */}
      <div className="fixed bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-40 max-w-xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900 dark:text-white">Quick Start</h3>
          <Target className="w-4 h-4 text-blue-600" />
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <CheckCircle className="w-3 h-3 text-green-500" />
            <span>Create your first task</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <div className="w-3 h-3 border-2 border-gray-300 rounded-full" />
            <span>Set up your profile</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <div className="w-3 h-3 border-2 border-gray-300 rounded-full" />
            <span>Invite team members</span>
          </div>
        </div>
        
        <button
          onClick={() => setShowWelcome(true)}
          className="mt-3 w-full px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
        >
          Restart Tutorial
        </button>
      </div>
    </>
  );
};

export default InteractiveTutorial;
