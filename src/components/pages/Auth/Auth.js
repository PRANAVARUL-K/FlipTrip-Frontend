import React, { useState } from 'react';
import { MapPin, Mail, Lock, Eye, EyeOff, Phone, User, CheckCircle } from 'lucide-react';
import './Authentication.css';
import OTPFlow from 'raj-otp';

// Cookie utility functions
const setCookie = (name, value, days = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

const getCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

const Authentication = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState({});
  const [verificationStatus, setVerificationStatus] = useState({
    email: '',
    phone: ''
  });

  const backendUrl = process.env.REACT_APP_TOUR_PACKAGE_BACKEND_URL;
  const emailServiceUrl = process.env.REACT_APP_EMAIL_SERVICE_URL;
  const phoneServiceUrl = process.env.REACT_APP_PHONE_SERVICE_URL;

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // For phone number, only allow digits
    if (name === 'phoneNumber') {
      const numericValue = value.replace(/\D/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Reset email verification if email changes
    if (name === 'email' && isEmailVerified) {
      setIsEmailVerified(false);
      setVerificationStatus(prev => ({ ...prev, email: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!isLogin) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      }
      if (!formData.phoneNumber) {
        newErrors.phoneNumber = 'Phone number is required';
      } else if (!validatePhone(formData.phoneNumber)) {
        newErrors.phoneNumber = 'Phone number must be 10 digits';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      // Check if email is verified for signup
      if (!isEmailVerified) {
        newErrors.emailVerification = 'Please verify your email before creating account';
      }
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const url = isLogin 
        ?  `${backendUrl}/trip_package/login_user`
        : `${backendUrl}/trip_package/register_user`;
      
      const payload = isLogin 
        ? {
            email: formData.email,
            password: formData.password
          }
        : {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone_number: formData.phoneNumber,
            password: formData.password
          };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      console.log('Response from Login API: ',data)
      if (response.ok) {
        if (isLogin) {
          // Store user session data in cookies
          const cookieExpiry = formData.rememberMe ? 30 : 7; // 30 days if remember me, else 7 days
          
          setCookie('userEmail', formData.email, cookieExpiry);
          setCookie('isLoggedIn', 'true', cookieExpiry);
          setCookie('userId', data.user.user_id, cookieExpiry);
          
          if (formData.rememberMe) {
            setCookie('rememberMe', 'true', cookieExpiry);
          }

          alert('Login successful!');
          
          // Call the callback to notify parent component
          if (onLoginSuccess) {
            onLoginSuccess({
              email: formData.email,
              name: data.name || `${formData.firstName} ${formData.lastName}`,
              isLoggedIn: true
            });
          }
          
          // Redirect to landing page
          window.location.href = '/landing';
        } else {
          alert('Registration successful! Please login to continue.');
          setIsLogin(true);
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            password: '',
            confirmPassword: '',
            rememberMe: false
          });
        }
        
        console.log('Success:', data);
      } else {
        alert('Error: ' + (data.message || data.detail || 'Something went wrong'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailVerification = async () => {
    if (!formData.email || !validateEmail(formData.email)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email first' }));
      return;
    }
    
    setIsVerifyingEmail(true);
    setVerificationStatus(prev => ({ ...prev, email: 'Verifying email...' }));
    
    try {
      const response = await fetch(`${emailServiceUrl}/service/verify_email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email
        })
      });

      const data = await response.json();
      console.log('Email verification response:', data);

      if (response.ok) {
        if (data.verified === true) {
          setIsEmailVerified(true);
          setVerificationStatus(prev => ({ ...prev, email: 'Email verified successfully!' }));
          // Clear any email verification errors
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.emailVerification;
            return newErrors;
          });
        } else {
          setIsEmailVerified(false);
          if (data.exists === false) {
            setVerificationStatus(prev => ({ ...prev, email: 'Email not found in our system' }));
          } else {
            setVerificationStatus(prev => ({ ...prev, email: 'Email verification failed' }));
          }
        }
      } else {
        setVerificationStatus(prev => ({ ...prev, email: 'Verification failed. Please try again.' }));
      }
    } catch (error) {
      console.error('Email verification error:', error);
      setVerificationStatus(prev => ({ ...prev, email: 'Network error. Please try again.' }));
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  const handlePhoneVerification = () => {
    if (!formData.phoneNumber || !validatePhone(formData.phoneNumber)) {
      setErrors(prev => ({ ...prev, phoneNumber: 'Please enter a valid 10-digit phone number first' }));
      return;
    }
    
    setVerificationStatus(prev => ({ ...prev, phone: 'Verification SMS sent!' }));
    setTimeout(() => {
      setIsPhoneVerified(true);
      setVerificationStatus(prev => ({ ...prev, phone: 'Phone verified!' }));
    }, 2000);
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);
  
  const switchForm = () => {
    setIsLogin(!isLogin);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      rememberMe: false
    });
    setErrors({});
    setIsEmailVerified(false);
    setIsPhoneVerified(false);
    setVerificationStatus({ email: '', phone: '' });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Left Side - Welcome Content */}
        <div className="welcome-section">
          <div className="welcome-content">
            <MapPin size={48} className="welcome-icon" />
            <h2 className="welcome-title">
              {isLogin ? 'Welcome Back!' : 'Join Our Journey!'}
            </h2>
            <p className="welcome-description">
              {isLogin 
                ? 'Discover amazing destinations and create unforgettable memories with our curated tour packages.'
                : 'Start your adventure today! Sign up to explore exclusive tour packages and amazing destinations.'
              }
            </p>
          </div>
          <div className="welcome-pattern" />
        </div>

        {/* Right Side - Form */}
        <div className="form-section">
          <div className="form-header">
            <h1 className="form-title">
              {isLogin ? 'Sign In' : 'Create Account'}
            </h1>
            <p className="form-subtitle">
              {isLogin 
                ? 'Enter your credentials to access your account'
                : 'Fill in your details to get started'
              }
            </p>
          </div>

          <div className="form-content">
            {!isLogin && (
              <>
                <div className="form-row">
                  <div className="form-group half-width">
                    <label className="form-label">First Name</label>
                    <div className="input-container">
                      <User size={20} className="input-icon" />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`form-input input-with-icon ${errors.firstName ? 'error' : ''}`}
                        placeholder="First name"
                        required
                        disabled={isLoading}
                      />
                    </div>
                    {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                  </div>

                  <div className="form-group half-width">
                    <label className="form-label">Last Name</label>
                    <div className="input-container">
                      <User size={20} className="input-icon" />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`form-input input-with-icon ${errors.lastName ? 'error' : ''}`}
                        placeholder="Last name"
                        required
                        disabled={isLoading}
                      />
                    </div>
                    {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                  </div>
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-container">
                <Mail size={20} className="input-icon" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`form-input input-with-icon ${errors.email ? 'error' : ''} ${isEmailVerified ? 'verified' : ''}`}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                />
                {isEmailVerified && <CheckCircle size={20} className="verified-icon" />}
              </div>
              {errors.email && <span className="error-text">{errors.email}</span>}
              {!isLogin && (
                <div className="verification-section">
                  <button
                    type="button"
                    onClick={handleEmailVerification}
                    className="verify-button"
                    disabled={isEmailVerified || isLoading || isVerifyingEmail}
                  >
                    {isVerifyingEmail ? 'Verifying...' : isEmailVerified ? 'Email Verified' : 'Verify Email'}
                  </button>
                  {verificationStatus.email && (
                    <span className={`verification-status ${isEmailVerified ? 'success' : 'error'}`}>
                      {verificationStatus.email}
                    </span>
                  )}
                </div>
              )}
              {errors.emailVerification && <span className="error-text">{errors.emailVerification}</span>}
            </div>

            {!isLogin && (
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div className="input-container">
                  <Phone size={20} className="input-icon" />
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className={`form-input input-with-icon ${errors.phoneNumber ? 'error' : ''} ${isPhoneVerified ? 'verified' : ''}`}
                    placeholder="Enter 10-digit phone number"
                    maxLength="10"
                    required
                    disabled={isLoading}
                  />
                  {isPhoneVerified && <CheckCircle size={20} className="verified-icon" />}
                </div>
                <OTPFlow
                  secretKey="9D941AF69FAA5E041172D29A8B459BB4"
                  apiEndpoint={`${phoneServiceUrl}/api/check-otp-availability`}
                  initialTheme="light" // or "dark"
                  onComplete={(data) => {
                    console.log("Flow update:", data);
                    if (data.stage === 'verified') {
                      console.log("Mobile:", data.mobile);
                      console.log("OTP Verified!");
                    } else if (data.stage === 'submitted') {
                      console.log("User entered mobile:", data.mobile);
                    } else if (data.stage === 'error') {
                      console.log("OTP error:", data.error);
                    }
                  }}
                  phoneNumber={formData.phoneNumber}
                  // customTheme={myCustomTheme} // optional custom theme object
                  // containerStyle={{ maxWidth: '600px' }} // optional custom container styles
                />
                {errors.phoneNumber && <span className="error-text">{errors.phoneNumber}</span>}
                {/* <div className="verification-section">
                  <button
                    type="button"
                    onClick={handlePhoneVerification}
                    className="verify-button"
                    disabled={isPhoneVerified || isLoading}
                  >
                    {isPhoneVerified ? 'Phone Verified' : 'Verify Phone'}
                  </button>
                  {verificationStatus.phone && (
                    <span className="verification-status">{verificationStatus.phone}</span>
                  )}
                </div> */}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-container">
                <Lock size={20} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`form-input input-with-icon input-with-toggle ${errors.password ? 'error' : ''}`}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="password-toggle"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            {!isLogin && (
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div className="input-container">
                  <Lock size={20} className="input-icon" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`form-input input-with-icon input-with-toggle ${errors.confirmPassword ? 'error' : ''}`}
                    placeholder="Confirm your password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="password-toggle"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
              </div>
            )}

            {isLogin && (
              <div className="form-options">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                  <span className="checkbox-text">Remember me</span>
                </label>
                <a href="#" className="forgot-link">Forgot password?</a>
              </div>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <span>
                  <i className="loading-spinner"></i>
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </span>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>

            <p className="switch-form">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={switchForm} 
                className="switch-button"
                disabled={isLoading}
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authentication;