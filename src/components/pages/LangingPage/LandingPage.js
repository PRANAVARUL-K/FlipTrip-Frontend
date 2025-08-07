import React, { useState, useEffect } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { Ripple } from 'primereact/ripple';
import { Avatar } from 'primereact/avatar';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import Logo from '../../../assets/Logo1.jpeg';
import TiextLogo from '../../../assets/Text_logo1.jpg';

import Home from '../Home/Home';
import Bookings from '../Bookings/Bookings';
import Tickets from '../Tickets/Tickets';
import Profile from '../Profile/Profile';
import PackageExplorer from './Packages/Packages';
import { CgProfile } from "react-icons/cg";
import { BiLogOut } from "react-icons/bi";
import './LandingPage.css';

// Cookie utility functions
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

const LandingPage = () => {
  const [visible, setVisible] = useState(false);
  const [activeComponent, setActiveComponent] = useState('home');
  const [userInfo, setUserInfo] = useState({
    name: 'User',
    email: '',
    role: 'User'
  });

  useEffect(() => {
    // Load user info from cookies on component mount
    const userEmail = getCookie('userEmail');
    const userName = getCookie('userName');
    const isLoggedIn = getCookie('isLoggedIn');

    if (isLoggedIn === 'true' && userEmail) {
      setUserInfo({
        name: userEmail || 'User',
        email: userEmail,
        role: 'User'
      });
    } else {
      // If no valid session, redirect to auth
      window.location.href = '/auth';
    }
  }, []);

  const components = {
    home: <Home />,
    bookings: <Bookings />,
    tickets: <Tickets />,
    profile: <Profile />
  };

  const handleMenuClick = (componentKey) => {
    setActiveComponent(componentKey);
    setVisible(false);
  };

  const handleLogout = () => {
    // Show confirmation dialog
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    
    if (confirmLogout) {
      // Clear all cookies
      deleteCookie('userEmail');
      deleteCookie('isLoggedIn');
      deleteCookie('userName');
      deleteCookie('rememberMe');
      
      // Clear any other session data if needed
      sessionStorage.clear();
      
      // Redirect to auth page
      window.location.href = '/auth';
    }
  };

  return (
    <div className="app-container">
      {/* Top Header */}
      <div className="app-header">
        <div className="header-left">
          <Button 
            icon="pi pi-bars" 
            onClick={() => setVisible(true)}
            outlined
            className="menu-button"
          />
          <div style={{ width: 160, height: 50 }}>
            <img 
              src={TiextLogo} 
              alt="Logo" 
              style={{ width: '100%', height: '100%', cursor: 'pointer' }} 
              onClick={() => handleMenuClick('home')} 
            />
          </div>
        </div>
        <div className="header-right">
          <div className="user-info">
            <span className="user-name">{userInfo.name}</span>
          </div>
          <CgProfile 
            style={{height: '30px', width: '30px', cursor: 'pointer', marginRight: '10px'}} 
            onClick={() => handleMenuClick('profile')}
          />
          <BiLogOut 
            style={{height: '28px', width: '28px', cursor: 'pointer', color: '#e74c3c'}} 
            onClick={handleLogout}
            title="Logout"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {components[activeComponent]}
      </div>

      {/* Sidebar */}
      <Sidebar
        style={{width: "17rem"}}
        visible={visible}
        onHide={() => setVisible(false)}
        content={({ closeIconRef, hide }) => (
          <div className="sidebar-container">
            <div className="sidebar-content">
              <div className="sidebar-header">
                <span className="logo-containers">
                  <div style={{ width: 80, height: 80 }}>
                    <img src={Logo} alt="Logo" style={{ width: '100%', height: '100%' }} />
                  </div>
                </span>
                <Button 
                  type="button" 
                  ref={closeIconRef} 
                  onClick={(e) => hide(e)} 
                  icon="pi pi-times" 
                  rounded 
                  outlined 
                  className="close-button" 
                />
              </div>
              
              <div className="sidebar-menu">
                <ul className="menu-list">
                  <li>
                    <ul className="menu-items">
                      <li>
                        <a 
                          onClick={() => handleMenuClick('home')} 
                          className={`menu-item ${activeComponent === 'home' ? 'active' : ''}`}
                        >
                          <i className="pi pi-home menu-icon"></i>
                          <span className="menu-text">Home</span>
                          <Ripple />
                        </a>
                      </li>
                      <li>
                        <a 
                          onClick={() => handleMenuClick('bookings')} 
                          className={`menu-item ${activeComponent === 'bookings' ? 'active' : ''}`}
                        >
                          <i className="pi pi-calendar menu-icon"></i>
                          <span className="menu-text">Bookings</span>
                          <Ripple />
                        </a>
                      </li>
                      <li>
                        <a 
                          onClick={() => handleMenuClick('tickets')} 
                          className={`menu-item ${activeComponent === 'tickets' ? 'active' : ''}`}
                        >
                          <i className="pi pi-ticket menu-icon"></i>
                          <span className="menu-text">Tickets</span>
                          <Ripple />
                        </a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
              
              {/* Profile Section at Bottom */}
              <div className="sidebar-profile">
                <hr className="profile-divider" />
                <a 
                  onClick={() => handleMenuClick('profile')} 
                  className={`profile-item ${activeComponent === 'profile' ? 'active' : ''}`}
                >
                  <CgProfile style={{height: '30px', width: '30px'}}/>
                  <div className="profile-info">
                    <div className="profile-name">{userInfo.name}</div>
                    <div className="profile-role">{userInfo.role}</div>
                  </div>
                  <Ripple />
                </a>
                
                {/* Logout Button in Sidebar */}
                <a 
                  onClick={handleLogout}
                  className="logout-item"
                >
                  <BiLogOut style={{height: '28px', width: '28px'}}/>
                  <div className="logout-info">
                    <div className="logout-text">Logout</div>
                    <div className="logout-subtitle">Sign out of your account</div>
                  </div>
                  <Ripple />
                </a>
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default LandingPage;