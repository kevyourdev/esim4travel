import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginModal({ isOpen, onClose }) {
  const [mode, setMode] = useState('login'); // 'login', 'register', 'forgot', 'reset'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    resetToken: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [resetToken, setResetToken] = useState(''); // For demo purposes
  const { login, register, forgotPassword, resetPassword } = useAuth();

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateLoginForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    return newErrors;
  };

  const validateRegisterForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    return newErrors;
  };

  const validateForgotForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    return newErrors;
  };

  const validateResetForm = () => {
    const newErrors = {};

    if (!formData.resetToken) {
      newErrors.resetToken = 'Reset code is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (formData.newPassword !== formData.confirmNewPassword) {
      newErrors.confirmNewPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    let validationErrors = {};
    if (mode === 'login') {
      validationErrors = validateLoginForm();
    } else if (mode === 'register') {
      validationErrors = validateRegisterForm();
    } else if (mode === 'forgot') {
      validationErrors = validateForgotForm();
    } else if (mode === 'reset') {
      validationErrors = validateResetForm();
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
        onClose();
        resetForm();
      } else if (mode === 'register') {
        await register(formData.email, formData.password, formData.firstName, formData.lastName);
        onClose();
        resetForm();
      } else if (mode === 'forgot') {
        const result = await forgotPassword(formData.email);
        // In development, show the token for demo purposes
        if (result.resetToken) {
          setResetToken(result.resetToken);
        }
        setSuccessMessage('If an account exists with this email, a reset code has been sent. Check your console (development mode shows the code below).');
        setMode('reset');
      } else if (mode === 'reset') {
        await resetPassword(formData.email, formData.resetToken, formData.newPassword);
        setSuccessMessage('Password reset successfully! You can now login with your new password.');
        setTimeout(() => {
          setMode('login');
          setSuccessMessage('');
          setResetToken('');
        }, 2000);
      }
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      resetToken: '',
      newPassword: '',
      confirmNewPassword: ''
    });
    setSuccessMessage('');
    setResetToken('');
  };

  const switchMode = (newMode) => {
    if (typeof newMode === 'string') {
      setMode(newMode);
    } else {
      setMode(mode === 'login' ? 'register' : 'login');
    }
    setErrors({});
    setSuccessMessage('');
    if (newMode !== 'reset') {
      resetForm();
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'login': return 'Login';
      case 'register': return 'Create Account';
      case 'forgot': return 'Forgot Password';
      case 'reset': return 'Reset Password';
      default: return 'Login';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {getTitle()}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <>
              <div className="mb-4">
                <label htmlFor="firstName" className="block text-xs font-bold uppercase tracking-wide text-foreground mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 bg-input border-2 rounded-lg text-foreground focus:outline-none transition-all duration-300 ${
                    errors.firstName
                      ? 'border-red-500 shadow-[4px_4px_0px_0px_rgb(239,68,68)]'
                      : 'border-slate-300 shadow-[4px_4px_0px_0px_transparent] focus:border-accent focus:shadow-[4px_4px_0px_0px_#8B5CF6]'
                  }`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="lastName" className="block text-xs font-bold uppercase tracking-wide text-foreground mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 bg-input border-2 rounded-lg text-foreground focus:outline-none transition-all duration-300 ${
                    errors.lastName
                      ? 'border-red-500 shadow-[4px_4px_0px_0px_rgb(239,68,68)]'
                      : 'border-slate-300 shadow-[4px_4px_0px_0px_transparent] focus:border-accent focus:shadow-[4px_4px_0px_0px_#8B5CF6]'
                  }`}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>
            </>
          )}

          <div className="mb-4">
            <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wide text-foreground mb-2">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-input border-2 rounded-lg text-foreground focus:outline-none transition-all duration-300 ${
                errors.email
                  ? 'border-red-500 shadow-[4px_4px_0px_0px_rgb(239,68,68)]'
                  : 'border-slate-300 shadow-[4px_4px_0px_0px_transparent] focus:border-accent focus:shadow-[4px_4px_0px_0px_#8B5CF6]'
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password field - only for login mode */}
          {mode === 'login' && (
            <div className="mb-4">
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wide text-foreground mb-2">
                Password *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 bg-input border-2 rounded-lg text-foreground focus:outline-none transition-all duration-300 ${
                  errors.password
                    ? 'border-red-500 shadow-[4px_4px_0px_0px_rgb(239,68,68)]'
                    : 'border-slate-300 shadow-[4px_4px_0px_0px_transparent] focus:border-accent focus:shadow-[4px_4px_0px_0px_#8B5CF6]'
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
          )}

          {/* Register mode password fields */}
          {mode === 'register' && (
            <>
              <div className="mb-4">
                <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wide text-foreground mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 bg-input border-2 rounded-lg text-foreground focus:outline-none transition-all duration-300 ${
                    errors.password
                      ? 'border-red-500 shadow-[4px_4px_0px_0px_rgb(239,68,68)]'
                      : 'border-slate-300 shadow-[4px_4px_0px_0px_transparent] focus:border-accent focus:shadow-[4px_4px_0px_0px_#8B5CF6]'
                  }`}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-xs font-bold uppercase tracking-wide text-foreground mb-2">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 bg-input border-2 rounded-lg text-foreground focus:outline-none transition-all duration-300 ${
                    errors.confirmPassword
                      ? 'border-red-500 shadow-[4px_4px_0px_0px_rgb(239,68,68)]'
                      : 'border-slate-300 shadow-[4px_4px_0px_0px_transparent] focus:border-accent focus:shadow-[4px_4px_0px_0px_#8B5CF6]'
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </>
          )}

          {/* Reset password mode fields */}
          {mode === 'reset' && (
            <>
              {/* Show demo token in development */}
              {resetToken && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm font-medium">Demo Mode: Your reset code is <span className="font-mono font-bold">{resetToken}</span></p>
                </div>
              )}
              <div className="mb-4">
                <label htmlFor="resetToken" className="block text-xs font-bold uppercase tracking-wide text-foreground mb-2">
                  Reset Code *
                </label>
                <input
                  type="text"
                  id="resetToken"
                  name="resetToken"
                  value={formData.resetToken}
                  onChange={handleChange}
                  placeholder="Enter 6-digit code"
                  className={`w-full px-4 py-2 bg-input border-2 rounded-lg text-foreground focus:outline-none transition-all duration-300 ${
                    errors.resetToken
                      ? 'border-red-500 shadow-[4px_4px_0px_0px_rgb(239,68,68)]'
                      : 'border-slate-300 shadow-[4px_4px_0px_0px_transparent] focus:border-accent focus:shadow-[4px_4px_0px_0px_#8B5CF6]'
                  }`}
                />
                {errors.resetToken && (
                  <p className="text-red-500 text-sm mt-1">{errors.resetToken}</p>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="newPassword" className="block text-xs font-bold uppercase tracking-wide text-foreground mb-2">
                  New Password *
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 bg-input border-2 rounded-lg text-foreground focus:outline-none transition-all duration-300 ${
                    errors.newPassword
                      ? 'border-red-500 shadow-[4px_4px_0px_0px_rgb(239,68,68)]'
                      : 'border-slate-300 shadow-[4px_4px_0px_0px_transparent] focus:border-accent focus:shadow-[4px_4px_0px_0px_#8B5CF6]'
                  }`}
                />
                {errors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="confirmNewPassword" className="block text-xs font-bold uppercase tracking-wide text-foreground mb-2">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  value={formData.confirmNewPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 bg-input border-2 rounded-lg text-foreground focus:outline-none transition-all duration-300 ${
                    errors.confirmNewPassword
                      ? 'border-red-500 shadow-[4px_4px_0px_0px_rgb(239,68,68)]'
                      : 'border-slate-300 shadow-[4px_4px_0px_0px_transparent] focus:border-accent focus:shadow-[4px_4px_0px_0px_#8B5CF6]'
                  }`}
                />
                {errors.confirmNewPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmNewPassword}</p>
                )}
              </div>
            </>
          )}

          {/* Success message */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-sm">{successMessage}</p>
            </div>
          )}

          {errors.submit && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-teal-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Processing...' : (
              mode === 'login' ? 'Login' :
              mode === 'register' ? 'Create Account' :
              mode === 'forgot' ? 'Send Reset Code' :
              'Reset Password'
            )}
          </button>
        </form>

        {/* Forgot password link - only show in login mode */}
        {mode === 'login' && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => switchMode('forgot')}
              className="text-sm text-gray-500 hover:text-teal-600 transition-colors"
            >
              Forgot your password?
            </button>
          </div>
        )}

        {/* Switch mode */}
        <div className="mt-6 text-center">
          {(mode === 'login' || mode === 'register') && (
            <p className="text-sm text-gray-600">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
              {' '}
              <button
                type="button"
                onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
                className="text-teal-600 font-semibold hover:text-teal-700 transition-colors"
              >
                {mode === 'login' ? 'Sign Up' : 'Login'}
              </button>
            </p>
          )}
          {(mode === 'forgot' || mode === 'reset') && (
            <button
              type="button"
              onClick={() => switchMode('login')}
              className="text-sm text-teal-600 font-semibold hover:text-teal-700 transition-colors"
            >
              Back to Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
