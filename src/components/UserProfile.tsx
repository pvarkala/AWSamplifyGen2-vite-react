import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";
import { uploadData } from "aws-amplify/storage";
import { 
  User, 
  Camera, 
  Edit, 
  Save, 
  X, 
  Mail, 
  Calendar,
  Shield,
  Globe,
  MessageSquare,
  Settings
} from "lucide-react";

interface UserProfileProps {
  user: any;
  client: ReturnType<typeof generateClient<Schema>>;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, client }) => {
  const [profile, setProfile] = useState<Schema["User"]["type"] | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    isPublic: false,
    commentsEnabled: true,
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profiles = await client.models.User.list();
      if (profiles.data.length > 0) {
        const userProfile = profiles.data[0];
        setProfile(userProfile);
        setFormData({
          username: userProfile.username || "",
          bio: userProfile.bio || "",
          isPublic: userProfile.isPublic || false,
          commentsEnabled: userProfile.commentsEnabled || true,
        });
      } else {
        // Create initial profile
        const newProfile = await client.models.User.create({
          username: user?.username || "",
          email: user?.attributes?.email || "",
          bio: "",
          isPublic: false,
          commentsEnabled: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        setProfile(newProfile.data);
        setFormData({
          username: newProfile.data.username || "",
          bio: newProfile.data.bio || "",
          isPublic: newProfile.data.isPublic || false,
          commentsEnabled: newProfile.data.commentsEnabled || true,
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!profile) return;
    
    try {
      await client.models.User.update({
        id: profile.id,
        username: formData.username,
        bio: formData.bio,
        isPublic: formData.isPublic,
        commentsEnabled: formData.commentsEnabled,
        updatedAt: new Date().toISOString(),
      });
      
      setProfile({
        ...profile,
        username: formData.username,
        bio: formData.bio,
        isPublic: formData.isPublic,
        commentsEnabled: formData.commentsEnabled,
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profile) return;

    setUploadingImage(true);
    try {
      const result = await uploadData({
        key: `profile-pictures/${profile.id}/${file.name}`,
        data: file,
        options: {
          accessLevel: 'guest',
        },
      }).result;

      await client.models.User.update({
        id: profile.id,
        profilePicture: result.key,
        updatedAt: new Date().toISOString(),
      });

      setProfile({
        ...profile,
        profilePicture: result.key,
      });
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploadingImage(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Manage your profile and privacy settings
            </p>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-5 h-5 mr-2" />
              Edit Profile
            </button>
          ) : (
            <div className="flex space-x-3">
              <button
                onClick={() => setIsEditing(false)}
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                <X className="w-5 h-5 mr-2" />
                Cancel
              </button>
              <button
                onClick={saveProfile}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-5 h-5 mr-2" />
                Save
              </button>
            </div>
          )}
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6">
            {/* Profile Picture and Basic Info */}
            <div className="flex items-start space-x-6">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                  {profile?.profilePicture ? (
                    <img
                      src={profile.profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 p-1 bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700">
                    <Camera className="w-4 h-4 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </label>
                )}
                {uploadingImage && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              {/* Basic Information */}
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Username
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    ) : (
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-gray-900 dark:text-white">
                          {profile?.username || "Not set"}
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">
                        {user?.attributes?.email || "Not set"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      rows={3}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">
                      {profile?.bio || "No bio yet. Add one to tell others about yourself!"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Privacy Settings
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center">
                    <Globe className="w-5 h-5 mr-2 text-gray-400" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        Public Profile
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Make your profile visible to other users
                      </p>
                    </div>
                  </div>
                </div>
                {isEditing ? (
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPublic}
                      onChange={(e) => setFormData({...formData, isPublic: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                ) : (
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    profile?.isPublic 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {profile?.isPublic ? 'Public' : 'Private'}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2 text-gray-400" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        Allow Comments
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Let other users comment on your profile
                      </p>
                    </div>
                  </div>
                </div>
                {isEditing ? (
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.commentsEnabled}
                      onChange={(e) => setFormData({...formData, commentsEnabled: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                ) : (
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    profile?.commentsEnabled 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {profile?.commentsEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Account Information
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-3 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Member Since
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Unknown'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <Shield className="w-5 h-5 mr-3 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Account Status
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Active
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center">
                  <Settings className="w-5 h-5 mr-3 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Profile ID
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {profile?.id || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
