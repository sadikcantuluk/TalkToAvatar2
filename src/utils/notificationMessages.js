// Centralized notification messages for better UX

export const NotificationMessages = {
  // Authentication
  auth: {
    loginSuccess: 'Welcome back! Login successful',
    loginFailed: 'Login failed. Please check your credentials',
    registerSuccess: 'Account created successfully! Please verify your email',
    registerFailed: 'Registration failed. Please try again',
    logoutSuccess: 'You have been logged out successfully',
    emailVerified: 'Email verified successfully!',
    emailVerificationFailed: 'Email verification failed. Please try again',
    passwordChanged: 'Password changed successfully',
    passwordChangeFailed: 'Failed to change password',
    passwordResetSent: 'Password reset link sent to your email',
    passwordResetFailed: 'Failed to send password reset link',
    accountDeleted: 'Your account has been deleted',
    accountDeletionFailed: 'Failed to delete account',
  },

  // Video Creation
  video: {
    creationStarted: 'Video creation started. This may take a few minutes',
    creationSuccess: 'Your video is ready!',
    creationFailed: 'Video creation failed. Please try again',
    downloadStarted: 'Downloading video...',
    downloadSuccess: 'Video downloaded successfully',
    downloadFailed: 'Failed to download video',
    deleteSuccess: 'Video deleted successfully',
    deleteFailed: 'Failed to delete video',
  },

  // Avatar
  avatar: {
    customCreated: 'Custom avatar created successfully!',
    customCreationFailed: 'Failed to create custom avatar',
    usingOriginal: 'Using your original image as avatar',
    aiUnavailable: 'AI generation is temporarily unavailable',
    deleteSuccess: 'Avatar deleted successfully',
    deleteFailed: 'Failed to delete avatar',
  },

  // Audio/Recording
  audio: {
    recordingStarted: 'Recording started',
    recordingSaved: 'Recording saved successfully',
    recordingFailed: 'Recording failed. Please try again',
    ttsSuccess: 'Text-to-speech conversion completed',
    ttsFailed: 'Text-to-speech conversion failed',
    deleteSuccess: 'Audio deleted successfully',
    deleteFailed: 'Failed to delete audio',
  },

  // Recording (Sualingo)
  recording: {
    evaluationStarted: 'Evaluating your pronunciation...',
    evaluationSuccess: 'Evaluation completed!',
    evaluationFailed: 'Evaluation failed. Please try again',
    saveSuccess: 'Recording saved successfully',
    saveFailed: 'Failed to save recording',
    deleteSuccess: 'Recording deleted successfully',
    deleteFailed: 'Failed to delete recording',
  },

  // Translation
  translation: {
    success: 'Translation completed',
    failed: 'Translation failed. Please try again',
  },

  // Conversation
  conversation: {
    saveSuccess: 'Conversation saved',
    saveFailed: 'Failed to save conversation',
    deleteSuccess: 'Conversation deleted',
    deleteFailed: 'Failed to delete conversation',
  },

  // Permissions
  permissions: {
    cameraNeeded: 'Camera permission is required to take photos',
    microphoneNeeded: 'Microphone permission is required for recording',
    storageNeeded: 'Storage permission is required to save files',
    permissionDenied: 'Permission denied. Please enable it in settings',
  },

  // Network
  network: {
    offline: 'No internet connection. Please check your network',
    timeout: 'Request timeout. Please try again',
    serverError: 'Server error. Please try again later',
  },

  // General
  general: {
    saveSuccess: 'Saved successfully',
    saveFailed: 'Save failed',
    deleteSuccess: 'Deleted successfully',
    deleteFailed: 'Delete failed',
    updateSuccess: 'Updated successfully',
    updateFailed: 'Update failed',
    loadSuccess: 'Loaded successfully',
    loadFailed: 'Load failed',
    processing: 'Processing... Please wait',
    completed: 'Completed successfully',
    cancelled: 'Operation cancelled',
  },

  // Validation
  validation: {
    requiredField: 'This field is required',
    invalidEmail: 'Please enter a valid email address',
    passwordTooShort: 'Password must be at least 8 characters',
    passwordMismatch: 'Passwords do not match',
    usernameTooShort: 'Username must be at least 3 characters',
    invalidInput: 'Invalid input. Please check and try again',
  },
};

// Helper function to get message with customization
export const getMessage = (category, key, customText = null) => {
  if (customText) return customText;
  
  try {
    return NotificationMessages[category][key] || 'Operation completed';
  } catch (error) {
    return 'Operation completed';
  }
};

// Helper function to format error messages
export const formatErrorMessage = (error) => {
  // Check if it's a network error
  if (!error) return NotificationMessages.general.saveFailed;
  
  if (error.message === 'Network Error' || error.code === 'ECONNABORTED') {
    return NotificationMessages.network.offline;
  }
  
  if (error.code === 'ETIMEDOUT') {
    return NotificationMessages.network.timeout;
  }
  
  if (error.response?.status >= 500) {
    return NotificationMessages.network.serverError;
  }
  
  // Return custom error message if available
  if (error.error) return error.error;
  if (error.message && !error.message.includes('status code')) {
    return error.message;
  }
  
  // Join error array if present
  if (error.errors && Array.isArray(error.errors)) {
    return error.errors.join(', ');
  }
  
  return NotificationMessages.general.saveFailed;
};

export default NotificationMessages;

