import React, { useState, useEffect } from 'react';
import { CgProfile } from "react-icons/cg";

const Profile = () => {
  const [userDetails, setUserDetails] = useState({
    user_id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    created_at: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const backendUrl = process.env.REACT_APP_TOUR_PACKAGE_BACKEND_URL;

  // Get cookie value
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  // Set cookie value
  const setCookie = (name, value, days = 30) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  };

  // Fetch user details
  const fetchUserDetails = async () => {
    try {
      const userId = getCookie('userId');
      if (!userId) {
        setMessage('User ID not found in cookies');
        setMessageType('error');
        return;
      }

      const response = await fetch(`${backendUrl}/trip_package/get_user_details?user_id=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUserDetails(data);
      } else {
        setMessage('Failed to fetch user details');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Error fetching user details');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  // Update user details
  const updateUserDetails = async () => {
    const confirmed = window.confirm("Are you sure you want to update the profile?");
    if (!confirmed) {
      return; // User cancelled, abort the process
    }
    setIsUpdating(true);
    try {
      const response = await fetch(`${backendUrl}/trip_package/update_user_details`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userDetails.user_id,
          email: userDetails.email,
          first_name: userDetails.first_name,
          last_name: userDetails.last_name,
          phone_number: userDetails.phone_number
        })
      });

      if (response.ok) {
        const data = await response.json();
        setUserDetails(data.user);
        
        // Update email in cookies if changed
        const currentEmail = getCookie('userEmail');
        if (currentEmail !== data.user.email) {
          setCookie('userEmail', data.user.email);
        }
        
        setMessage('Profile updated successfully');
        setMessageType('success');
      } else {
        setMessage('Failed to update profile');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Error updating profile');
      setMessageType('error');
    } finally {
      setIsUpdating(false);
    }
  };

  // Change password
  const changePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage('New passwords do not match');
      alert('New passwords do not match')
      setMessageType('error');
      return;
    }
    
    const confirmed = window.confirm("Are you sure you want to update the profile?");
    if (!confirmed) {
      return; // User cancelled, abort the process
    }

    try {
      const response = await fetch(`${backendUrl}/trip_package/change_password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userDetails.user_id,
          old_password: passwordData.old_password,
          new_password: passwordData.new_password
        })
      });

      if (response.ok) {
        setMessage('Password changed successfully');
        setMessageType('success');
        setShowPasswordForm(false);
        setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Failed to change password');
        alert('Incorrect Old Password\nFailed to change password')
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Error changing password');
      setMessageType('error');
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c8 100%)'
      }}>
        <div style={{ color: '#2d5a2d', fontSize: '18px' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c8 100%)',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '15px',
        boxShadow: '0 10px 30px rgba(45, 90, 45, 0.1)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #4a7c59 0%, #2d5a2d 100%)',
          color: 'white',
          padding: '30px',
          textAlign: 'center'
        }}>
          <h1 style={{ margin: '0', fontSize: '32px', fontWeight: '600' }}>Profile</h1>
        </div>

        {/* Message */}
        {message && (
          <div style={{
            padding: '15px 30px',
            background: messageType === 'success' ? '#d4edda' : '#f8d7da',
            color: messageType === 'success' ? '#155724' : '#721c24',
            borderLeft: `4px solid ${messageType === 'success' ? '#28a745' : '#dc3545'}`
          }}>
            {message}
          </div>
        )}

        <div style={{ padding: '40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '40px' }}>
            {/* Avatar Section */}
            <div style={{
              textAlign: 'center',
              background: 'linear-gradient(135deg, #f8fdf8 0%, #e8f5e8 100%)',
              padding: '30px',
              borderRadius: '15px',
              border: '2px solid #c8e6c8'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '15px'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #4a7c59 0%, #2d5a2d 100%)',
                  borderRadius: '50%',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <CgProfile style={{ height: "70px", width: "70px", color: 'white' }} />
                </div>
                <h3 style={{ 
                  margin: '0', 
                  color: '#2d5a2d', 
                  fontSize: '24px',
                  fontWeight: '600'
                }}>
                  {userDetails.first_name} {userDetails.last_name}
                </h3>
              </div>
            </div>
            
            {/* Form Section */}
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      color: '#2d5a2d',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}>
                      First Name
                    </label>
                    <input 
                      type="text" 
                      value={userDetails.first_name}
                      onChange={(e) => setUserDetails({...userDetails, first_name: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px 15px',
                        border: '2px solid #c8e6c8',
                        borderRadius: '8px',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'border-color 0.3s',
                        backgroundColor: '#fafffe'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#4a7c59'}
                      onBlur={(e) => e.target.style.borderColor = '#c8e6c8'}
                    />
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      color: '#2d5a2d',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}>
                      Email
                    </label>
                    <input 
                      type="email" 
                      value={userDetails.email}
                      onChange={(e) => setUserDetails({...userDetails, email: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px 15px',
                        border: '2px solid #c8e6c8',
                        borderRadius: '8px',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'border-color 0.3s',
                        backgroundColor: '#fafffe'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#4a7c59'}
                      onBlur={(e) => e.target.style.borderColor = '#c8e6c8'}
                    />
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      color: '#2d5a2d',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}>
                      Phone
                    </label>
                    <input 
                      type="tel" 
                      value={userDetails.phone_number}
                      onChange={(e) => setUserDetails({...userDetails, phone_number: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px 15px',
                        border: '2px solid #c8e6c8',
                        borderRadius: '8px',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'border-color 0.3s',
                        backgroundColor: '#fafffe'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#4a7c59'}
                      onBlur={(e) => e.target.style.borderColor = '#c8e6c8'}
                    />
                  </div>
                </div>
                
                <div>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      color: '#2d5a2d',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}>
                      Last Name
                    </label>
                    <input 
                      type="text" 
                      value={userDetails.last_name}
                      onChange={(e) => setUserDetails({...userDetails, last_name: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px 15px',
                        border: '2px solid #c8e6c8',
                        borderRadius: '8px',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'border-color 0.3s',
                        backgroundColor: '#fafffe'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#4a7c59'}
                      onBlur={(e) => e.target.style.borderColor = '#c8e6c8'}
                    />
                  </div>
                  {/* <div style={{ marginBottom: '20px' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      color: '#2d5a2d',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}>
                      User ID
                    </label>
                    <input 
                      type="text" 
                      value={userDetails.user_id}
                      disabled
                      style={{
                        width: '100%',
                        padding: '12px 15px',
                        border: '2px solid #e0e0e0',
                        borderRadius: '8px',
                        fontSize: '16px',
                        backgroundColor: '#f5f5f5',
                        color: '#666'
                      }}
                    />
                  </div> */}
                  {/* <div style={{ marginBottom: '20px' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      color: '#2d5a2d',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}>
                      Member Since
                    </label>
                    <input 
                      type="text" 
                      value={new Date(userDetails.created_at).toLocaleDateString()}
                      disabled
                      style={{
                        width: '100%',
                        padding: '12px 15px',
                        border: '2px solid #e0e0e0',
                        borderRadius: '8px',
                        fontSize: '16px',
                        backgroundColor: '#f5f5f5',
                        color: '#666'
                      }}
                    />
                  </div> */}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div style={{ 
                display: 'flex', 
                gap: '15px', 
                marginTop: '30px',
                flexWrap: 'wrap'
              }}>
                <button 
                  onClick={updateUserDetails}
                  disabled={isUpdating}
                  style={{
                    background: 'linear-gradient(135deg, #4a7c59 0%, #2d5a2d 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 25px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: isUpdating ? 'not-allowed' : 'pointer',
                    opacity: isUpdating ? 0.7 : 1,
                    transition: 'all 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseOver={(e) => !isUpdating && (e.target.style.transform = 'translateY(-2px)')}
                  onMouseOut={(e) => !isUpdating && (e.target.style.transform = 'translateY(0)')}
                >
                  ✓ {isUpdating ? 'Updating...' : 'Update Profile'}
                </button>
                <button 
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  style={{
                    background: 'transparent',
                    color: '#4a7c59',
                    border: '2px solid #4a7c59',
                    padding: '12px 25px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = '#4a7c59';
                    e.target.style.color = 'white';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.color = '#4a7c59';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  🔐 Change Password
                </button>
              </div>

              {/* Password Change Form */}
              {showPasswordForm && (
                <div style={{
                  marginTop: '30px',
                  padding: '25px',
                  background: 'linear-gradient(135deg, #f8fdf8 0%, #e8f5e8 100%)',
                  borderRadius: '12px',
                  border: '2px solid #c8e6c8'
                }}>
                  <h3 style={{ 
                    margin: '0 0 20px 0', 
                    color: '#2d5a2d',
                    fontSize: '20px',
                    fontWeight: '600'
                  }}>
                    Change Password
                  </h3>
                  <div style={{ display: 'grid', gap: '15px' }}>
                    <div>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '8px', 
                        color: '#2d5a2d',
                        fontWeight: '600',
                        fontSize: '14px'
                      }}>
                        Old Password
                      </label>
                      <input 
                        type="password" 
                        value={passwordData.old_password}
                        onChange={(e) => setPasswordData({...passwordData, old_password: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '12px 15px',
                          border: '2px solid #c8e6c8',
                          borderRadius: '8px',
                          fontSize: '16px',
                          outline: 'none',
                          transition: 'border-color 0.3s',
                          backgroundColor: 'white'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#4a7c59'}
                        onBlur={(e) => e.target.style.borderColor = '#c8e6c8'}
                      />
                    </div>
                    <div>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '8px', 
                        color: '#2d5a2d',
                        fontWeight: '600',
                        fontSize: '14px'
                      }}>
                        New Password
                      </label>
                      <input 
                        type="password" 
                        value={passwordData.new_password}
                        onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '12px 15px',
                          border: '2px solid #c8e6c8',
                          borderRadius: '8px',
                          fontSize: '16px',
                          outline: 'none',
                          transition: 'border-color 0.3s',
                          backgroundColor: 'white'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#4a7c59'}
                        onBlur={(e) => e.target.style.borderColor = '#c8e6c8'}
                      />
                    </div>
                    <div>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '8px', 
                        color: '#2d5a2d',
                        fontWeight: '600',
                        fontSize: '14px'
                      }}>
                        Confirm New Password
                      </label>
                      <input 
                        type="password" 
                        value={passwordData.confirm_password}
                        onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '12px 15px',
                          border: '2px solid #c8e6c8',
                          borderRadius: '8px',
                          fontSize: '16px',
                          outline: 'none',
                          transition: 'border-color 0.3s',
                          backgroundColor: 'white'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#4a7c59'}
                        onBlur={(e) => e.target.style.borderColor = '#c8e6c8'}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                      <button 
                        onClick={changePassword}
                        style={{
                          background: 'linear-gradient(135deg, #4a7c59 0%, #2d5a2d 100%)',
                          color: 'white',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s'
                        }}
                        onMouseOver={(e) => e.target.style.transform = 'translateY(-1px)'}
                        onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                      >
                        Update Password
                      </button>
                      <button 
                        onClick={() => {
                          setShowPasswordForm(false);
                          setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
                        }}
                        style={{
                          background: 'transparent',
                          color: '#666',
                          border: '2px solid #ccc',
                          padding: '10px 20px',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.background = '#f5f5f5';
                          e.target.style.transform = 'translateY(-1px)';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background = 'transparent';
                          e.target.style.transform = 'translateY(0)';
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;