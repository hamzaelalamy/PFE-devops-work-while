/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Save, User, Lock, Briefcase, Bell, LogOut } from 'lucide-react';
import { logoutUser } from '../slices/authSlice';

const ProfileSettingsPage = () => {
  const { user, loading } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // State for all user profile fields
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    // Personal info
    name: '',
    email: '',
    username: '',
    location: '',
    phoneNumber: '',
    bio: '',
    // Career info
    title: '',
    experience: '',
    skills: '',
    education: '',
    resume: null,
    // Security
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    // Notifications
    emailNotifications: true,
    applicationUpdates: true,
    jobRecommendations: true,
    marketingEmails: false
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setFormData(prevData => ({
        ...prevData,
        name: user.name || '',
        email: user.email || '',
        username: user.username || user.email?.split('@')[0] || '',
        // Add other fields from user object if available
      }));
    }
  }, [user]);
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prevData => ({
        ...prevData,
        resume: e.target.files[0]
      }));
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    // Validate based on active tab
    if (activeTab === 'personal') {
      if (!formData.name.trim()) errors.name = 'Name is required';
      if (!formData.email.trim()) errors.email = 'Email is required';
      else if (!/^\S+@\S+\.\S+$/.test(formData.email)) errors.email = 'Email is invalid';
      if (!formData.username.trim()) errors.username = 'Username is required';
    } 
    else if (activeTab === 'security') {
      if (formData.newPassword && !formData.currentPassword) {
        errors.currentPassword = 'Current password is required to set a new password';
      }
      if (formData.newPassword && formData.newPassword.length < 6) {
        errors.newPassword = 'Password must be at least 6 characters';
      }
      if (formData.newPassword !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSaving(true);
    
    // Simulate API call with timeout
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Show success message
      setSuccessMessage('Profile updated successfully!');
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      setFormErrors({ submit: 'Failed to update profile. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };
  
  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Here you would add the actual account deletion logic
      alert('Account deletion would happen here. Redirecting to homepage...');
      dispatch(logoutUser());
      navigate('/');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="md:grid md:grid-cols-12">
            {/* Sidebar */}
            <div className="md:col-span-3 bg-gray-50 rounded-l-lg">
              <nav className="px-4 py-6 space-y-1">
                <button
                  onClick={() => setActiveTab('personal')}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-md w-full text-left ${
                    activeTab === 'personal' 
                      ? 'bg-white text-blue-600 shadow' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <User size={16} className="mr-3" />
                  Personal Information
                </button>
                
                <button
                  onClick={() => setActiveTab('career')}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-md w-full text-left ${
                    activeTab === 'career' 
                      ? 'bg-white text-blue-600 shadow' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Briefcase size={16} className="mr-3" />
                  Career Profile
                </button>
                
                <button
                  onClick={() => setActiveTab('security')}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-md w-full text-left ${
                    activeTab === 'security' 
                      ? 'bg-white text-blue-600 shadow' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Lock size={16} className="mr-3" />
                  Security
                </button>
                
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-md w-full text-left ${
                    activeTab === 'notifications' 
                      ? 'bg-white text-blue-600 shadow' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Bell size={16} className="mr-3" />
                  Notifications
                </button>
                
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-3 text-sm font-medium text-red-600 rounded-md w-full text-left hover:bg-red-50"
                  >
                    <LogOut size={16} className="mr-3" />
                    Sign Out
                  </button>
                </div>
              </nav>
            </div>
            
            {/* Main content */}
            <div className="md:col-span-9 px-4 py-6 sm:p-6">
              <form onSubmit={handleSubmit}>
                {/* Success message */}
                {successMessage && (
                  <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                    {successMessage}
                  </div>
                )}
                
                {/* Form error */}
                {formErrors.submit && (
                  <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {formErrors.submit}
                  </div>
                )}
                
                {/* Personal Information Tab */}
                {activeTab === 'personal' && (
                  <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-6">Personal Information</h3>
                    
                    <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Full Name
                        </label>
                        <div className="mt-1">
                          <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={`appearance-none block w-full px-3 py-2 border ${
                              formErrors.name ? 'border-red-300' : 'border-gray-300'
                            } rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                          />
                          {formErrors.name && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                          Username
                        </label>
                        <div className="mt-1">
                          <input
                            id="username"
                            name="username"
                            type="text"
                            value={formData.username}
                            onChange={handleInputChange}
                            className={`appearance-none block w-full px-3 py-2 border ${
                              formErrors.username ? 'border-red-300' : 'border-gray-300'
                            } rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                          />
                          {formErrors.username && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.username}</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email Address
                        </label>
                        <div className="mt-1">
                          <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`appearance-none block w-full px-3 py-2 border ${
                              formErrors.email ? 'border-red-300' : 'border-gray-300'
                            } rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                          />
                          {formErrors.email && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                          Phone Number
                        </label>
                        <div className="mt-1">
                          <input
                            id="phoneNumber"
                            name="phoneNumber"
                            type="tel"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-2">
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                          Location (City, Country)
                        </label>
                        <div className="mt-1">
                          <input
                            id="location"
                            name="location"
                            type="text"
                            value={formData.location}
                            onChange={handleInputChange}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="e.g. San Francisco, USA"
                          />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-2">
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                          Bio
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="bio"
                            name="bio"
                            rows={4}
                            value={formData.bio}
                            onChange={handleInputChange}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Brief description about yourself"
                          />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Write a short introduction about yourself. This will appear on your profile.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Career Profile Tab */}
                {activeTab === 'career' && (
                  <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-6">Career Profile</h3>
                    
                    <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                          Job Title
                        </label>
                        <div className="mt-1">
                          <input
                            id="title"
                            name="title"
                            type="text"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="e.g. Frontend Developer"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                          Years of Experience
                        </label>
                        <div className="mt-1">
                          <select
                            id="experience"
                            name="experience"
                            value={formData.experience}
                            onChange={handleInputChange}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          >
                            <option value="">Select years of experience</option>
                            <option value="entry">Entry Level (0-2 years)</option>
                            <option value="mid">Mid Level (3-5 years)</option>
                            <option value="senior">Senior (6-10 years)</option>
                            <option value="expert">Expert (10+ years)</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="sm:col-span-2">
                        <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                          Skills
                        </label>
                        <div className="mt-1">
                          <input
                            id="skills"
                            name="skills"
                            type="text"
                            value={formData.skills}
                            onChange={handleInputChange}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="e.g. JavaScript, React, Node.js"
                          />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Separate skills with commas
                        </p>
                      </div>
                      
                      <div className="sm:col-span-2">
                        <label htmlFor="education" className="block text-sm font-medium text-gray-700">
                          Education
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="education"
                            name="education"
                            rows={3}
                            value={formData.education}
                            onChange={handleInputChange}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="e.g. Bachelor's in Computer Science, University of XYZ (2015-2019)"
                          />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-2">
                        <label htmlFor="resume" className="block text-sm font-medium text-gray-700">
                          Resume/CV
                        </label>
                        <div className="mt-1">
                          <input
                            id="resume"
                            name="resume"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Accepted formats: PDF, DOC, DOCX. Max size: 5MB
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-6">Security Settings</h3>
                    
                    <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                      <div className="sm:col-span-2">
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                          Current Password
                        </label>
                        <div className="mt-1">
                          <input
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                            className={`appearance-none block w-full px-3 py-2 border ${
                              formErrors.currentPassword ? 'border-red-300' : 'border-gray-300'
                            } rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                          />
                          {formErrors.currentPassword && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.currentPassword}</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                          New Password
                        </label>
                        <div className="mt-1">
                          <input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            className={`appearance-none block w-full px-3 py-2 border ${
                              formErrors.newPassword ? 'border-red-300' : 'border-gray-300'
                            } rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                          />
                          {formErrors.newPassword && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.newPassword}</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                          Confirm New Password
                        </label>
                        <div className="mt-1">
                          <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className={`appearance-none block w-full px-3 py-2 border ${
                              formErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                            } rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                          />
                          {formErrors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="sm:col-span-2 mt-6 pt-6 border-t border-gray-200">
                        <h4 className="text-md font-medium text-gray-900 mb-4">Account Deletion</h4>
                        <p className="text-sm text-gray-600 mb-4">
                          Once you delete your account, all of your data will be permanently removed.
                          This action cannot be undone.
                        </p>
                        <button
                          type="button"
                          onClick={handleDeleteAccount}
                          className="px-4 py-2 border border-red-300 text-red-700 rounded-full hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 text-sm"
                        >
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-6">Notification Preferences</h3>
                    
                    <div className="space-y-6">
                      <div className="relative flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="emailNotifications"
                            name="emailNotifications"
                            type="checkbox"
                            checked={formData.emailNotifications}
                            onChange={handleInputChange}
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="emailNotifications" className="font-medium text-gray-700">
                            Email Notifications
                          </label>
                          <p className="text-gray-500">Receive email notifications about your account activity</p>
                        </div>
                      </div>
                      
                      <div className="relative flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="applicationUpdates"
                            name="applicationUpdates"
                            type="checkbox"
                            checked={formData.applicationUpdates}
                            onChange={handleInputChange}
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="applicationUpdates" className="font-medium text-gray-700">
                            Application Updates
                          </label>
                          <p className="text-gray-500">Receive updates about your job applications</p>
                        </div>
                      </div>
                      
                      <div className="relative flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="jobRecommendations"
                            name="jobRecommendations"
                            type="checkbox"
                            checked={formData.jobRecommendations}
                            onChange={handleInputChange}
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="jobRecommendations" className="font-medium text-gray-700">
                            Job Recommendations
                          </label>
                          <p className="text-gray-500">Receive personalized job recommendations based on your profile</p>
                        </div>
                      </div>
                      
                      <div className="relative flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="marketingEmails"
                            name="marketingEmails"
                            type="checkbox"
                            checked={formData.marketingEmails}
                            onChange={handleInputChange}
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="marketingEmails" className="font-medium text-gray-700">
                            Marketing Emails
                          </label>
                          <p className="text-gray-500">Receive marketing emails about our services and offers</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Save button - appears in all tabs */}
                <div className="mt-8 pt-5 border-t border-gray-200">
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        isSaving ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {isSaving ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={16} className="mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;