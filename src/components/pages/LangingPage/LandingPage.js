// import React, { useState, useEffect } from 'react';
// import { Sidebar } from 'primereact/sidebar';
// import { Button } from 'primereact/button';
// import { Ripple } from 'primereact/ripple';
// import { Avatar } from 'primereact/avatar';
// import 'primereact/resources/themes/lara-light-indigo/theme.css';
// import 'primereact/resources/primereact.min.css';
// import 'primeicons/primeicons.css';
// import 'primeflex/primeflex.css';
// import Logo from '../../../assets/Logo1.jpeg';
// import TiextLogo from '../../../assets/Text_logo1.jpg';

// import Home from '../Home/Home';
// import Bookings from '../Bookings/Bookings';
// import Tickets from '../Tickets/Tickets';
// import Profile from '../Profile/Profile';
// import PackageExplorer from './Packages/Packages';
// import { CgProfile } from "react-icons/cg";
// import { BiLogOut } from "react-icons/bi";
// import './LandingPage.css';

// // Cookie utility functions
// const getCookie = (name) => {
//   const nameEQ = name + "=";
//   const ca = document.cookie.split(';');
//   for(let i = 0; i < ca.length; i++) {
//     let c = ca[i];
//     while (c.charAt(0) === ' ') c = c.substring(1, c.length);
//     if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
//   }
//   return null;
// };

// const deleteCookie = (name) => {
//   document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
// };

// const LandingPage = () => {
//   const [visible, setVisible] = useState(false);
//   const [activeComponent, setActiveComponent] = useState('home');
//   const [userInfo, setUserInfo] = useState({
//     name: 'User',
//     email: '',
//     role: 'User'
//   });

//   useEffect(() => {
//     // Load user info from cookies on component mount
//     const userEmail = getCookie('userEmail');
//     const userName = getCookie('userName');
//     const isLoggedIn = getCookie('isLoggedIn');

//     if (isLoggedIn === 'true' && userEmail) {
//       setUserInfo({
//         name: userEmail || 'User',
//         email: userEmail,
//         role: 'User'
//       });
//     } else {
//       // If no valid session, redirect to auth
//       window.location.href = '/auth';
//     }
//   }, []);

//   const components = {
//     home: <Home />,
//     bookings: <Bookings />,
//     tickets: <Tickets />,
//     profile: <Profile />
//   };

//   const handleMenuClick = (componentKey) => {
//     setActiveComponent(componentKey);
//     setVisible(false);
//   };

//   const handleLogout = () => {
//     // Show confirmation dialog
//     const confirmLogout = window.confirm('Are you sure you want to logout?');
    
//     if (confirmLogout) {
//       // Clear all cookies
//       deleteCookie('userEmail');
//       deleteCookie('isLoggedIn');
//       deleteCookie('userName');
//       deleteCookie('rememberMe');
      
//       // Clear any other session data if needed
//       sessionStorage.clear();
      
//       // Redirect to auth page
//       window.location.href = '/auth';
//     }
//   };

//   return (
//     <div className="app-container">
//       {/* Top Header */}
//       <div className="app-header">
//         <div className="header-left">
//           <Button 
//             icon="pi pi-bars" 
//             onClick={() => setVisible(true)}
//             outlined
//             className="menu-button"
//           />
//           <div style={{ width: 160, height: 50 }}>
//             <img 
//               src={TiextLogo} 
//               alt="Logo" 
//               style={{ width: '100%', height: '100%', cursor: 'pointer' }} 
//               onClick={() => handleMenuClick('home')} 
//             />
//           </div>
//         </div>
//         <div className="header-right">
//           <div className="user-info">
//             <span className="user-name">{userInfo.name}</span>
//           </div>
//           <CgProfile 
//             style={{height: '30px', width: '30px', cursor: 'pointer', marginRight: '10px'}} 
//             onClick={() => handleMenuClick('profile')}
//           />
//           <BiLogOut 
//             style={{height: '28px', width: '28px', cursor: 'pointer', color: '#e74c3c'}} 
//             onClick={handleLogout}
//             title="Logout"
//           />
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="main-content">
//         {components[activeComponent]}
//       </div>

//       {/* Sidebar */}
//       <Sidebar
//         style={{width: "17rem"}}
//         visible={visible}
//         onHide={() => setVisible(false)}
//         content={({ closeIconRef, hide }) => (
//           <div className="sidebar-container">
//             <div className="sidebar-content">
//               <div className="sidebar-header">
//                 <span className="logo-containers">
//                   <div style={{ width: 80, height: 80 }}>
//                     <img src={Logo} alt="Logo" style={{ width: '100%', height: '100%' }} />
//                   </div>
//                 </span>
//                 <Button 
//                   type="button" 
//                   ref={closeIconRef} 
//                   onClick={(e) => hide(e)} 
//                   icon="pi pi-times" 
//                   rounded 
//                   outlined 
//                   className="close-button" 
//                 />
//               </div>
              
//               <div className="sidebar-menu">
//                 <ul className="menu-list">
//                   <li>
//                     <ul className="menu-items">
//                       <li>
//                         <a 
//                           onClick={() => handleMenuClick('home')} 
//                           className={`menu-item ${activeComponent === 'home' ? 'active' : ''}`}
//                         >
//                           <i className="pi pi-home menu-icon"></i>
//                           <span className="menu-text">Home</span>
//                           <Ripple />
//                         </a>
//                       </li>
//                       <li>
//                         <a 
//                           onClick={() => handleMenuClick('bookings')} 
//                           className={`menu-item ${activeComponent === 'bookings' ? 'active' : ''}`}
//                         >
//                           <i className="pi pi-calendar menu-icon"></i>
//                           <span className="menu-text">Bookings</span>
//                           <Ripple />
//                         </a>
//                       </li>
//                       <li>
//                         <a 
//                           onClick={() => handleMenuClick('tickets')} 
//                           className={`menu-item ${activeComponent === 'tickets' ? 'active' : ''}`}
//                         >
//                           <i className="pi pi-ticket menu-icon"></i>
//                           <span className="menu-text">Tickets</span>
//                           <Ripple />
//                         </a>
//                       </li>
//                     </ul>
//                   </li>
//                 </ul>
//               </div>
              
//               {/* Profile Section at Bottom */}
//               <div className="sidebar-profile">
//                 <hr className="profile-divider" />
//                 <a 
//                   onClick={() => handleMenuClick('profile')} 
//                   className={`profile-item ${activeComponent === 'profile' ? 'active' : ''}`}
//                 >
//                   <CgProfile style={{height: '30px', width: '30px'}}/>
//                   <div className="profile-info">
//                     <div className="profile-name">{userInfo.name}</div>
//                     <div className="profile-role">{userInfo.role}</div>
//                   </div>
//                   <Ripple />
//                 </a>
                
//                 {/* Logout Button in Sidebar */}
//                 <a 
//                   onClick={handleLogout}
//                   className="logout-item"
//                 >
//                   <BiLogOut style={{height: '28px', width: '28px'}}/>
//                   <div className="logout-info">
//                     <div className="logout-text">Logout</div>
//                     <div className="logout-subtitle">Sign out of your account</div>
//                   </div>
//                   <Ripple />
//                 </a>
//               </div>
//             </div>
//           </div>
//         )}
//       />
//     </div>
//   );
// };

// export default LandingPage;

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
  const [bookingLoading, setBookingLoading] = useState(false);

  // Backend URL for booking creation
  const backendUrl = process.env.REACT_APP_TOUR_PACKAGE_BACKEND_URL;
  const mailApiKey = process.env.REACT_APP_EMAIL_SERVICE_KEY;

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
      return;
    }

    // Check for payment success and handle booking creation
    handlePaymentReturn();
  }, []);

  // Handle payment return and booking creation
  const handlePaymentReturn = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentSuccess = urlParams.get('paymentSuccess');
    const viewParam = urlParams.get('view');
    const bookingData = localStorage.getItem('pendingBookingData');
    
    console.log("LandingPage - Payment return check:", { 
      paymentSuccess, 
      viewParam, 
      bookingDataExists: !!bookingData 
    });
    
    if (paymentSuccess === 'true' && bookingData) {
      try {
        const parsedBookingData = JSON.parse(bookingData);
        console.log("Found pending booking data after payment:", parsedBookingData);
        
        // Create the booking
        await handleCreateBookingAfterPayment(parsedBookingData);
        
        // Clear the stored booking data
        localStorage.removeItem('pendingBookingData');
        
      } catch (error) {
        console.error("Error processing payment return:", error);
        alert('Payment was successful, but there was an error creating your booking. Please contact support.');
      }
    } else if (paymentSuccess === 'true' && !bookingData) {
      console.log("Payment success detected but no booking data found");
      alert('Payment was successful, but booking data was not found. Please try booking again.');
    }
    
    // Set the view based on URL parameter
    if (viewParam && ['home', 'bookings', 'tickets', 'profile'].includes(viewParam)) {
      console.log("Setting active component to:", viewParam);
      setActiveComponent(viewParam);
    }
    
    // Clean up URL parameters
    if (viewParam || paymentSuccess) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  // Create booking after successful payment
  const normalizeBookingPayload = (rawPayload) => {
  // Helper function to normalize date format
  const normalizeDateFormat = (dateString) => {
  if (!dateString) return dateString;
  
  // If already in correct ISO format (YYYY-MM-DDTHH:MM:SS), return as is
  if (dateString.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)) {
    return dateString;
  }
  
  // If in format "YYYY-MM-DD HH:MM", convert to "YYYY-MM-DDTHH:MM:00"
  if (dateString.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/)) {
    return dateString.replace(' ', 'T') + ':00';
  }
  
  // If in format "YYYY-MM-DD HH:MM:SS", convert to "YYYY-MM-DDTHH:MM:SS"
  if (dateString.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)) {
    return dateString.replace(' ', 'T');
  }
  
  // If just date format "YYYY-MM-DD", add default time
  if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dateString + 'T00:00:00';
  }
  
  // If date with different separators, normalize to ISO format
  // Handle formats like "DD/MM/YYYY" or "MM-DD-YYYY" etc.
  const dateObj = new Date(dateString);
  if (!isNaN(dateObj.getTime())) {
    return dateObj.toISOString().slice(0, 19); // Removes milliseconds and Z
  }
  
  // Return original if no pattern matches
  return dateString;
};

  // Normalize the payload structure
  const normalizedPayload = {
    package_id: rawPayload.package_id,
    head_count: rawPayload.head_count,
    
    // Fix passengers structure - remove nested "passengers" key
    passengers: rawPayload.passengers.passengers || rawPayload.passengers,
    
    // Normalize date formats
    booking_date: rawPayload.booking_date, // Keep as is for booking_date if it's just date
    end_date: rawPayload.end_date, // Keep as is for end_date if it's just date
    
    // Add other fields
    src_to_first_arrival_time: normalizeDateFormat(rawPayload.src_to_first_arrival_time),
    
    // Normalize flights array
    flights: rawPayload.flights.map(flight => ({
      flight_id: flight.flight_id,
      airline_name: flight.airline_name,
      flight_number: flight.flight_number,
      source_airport: flight.source_airport,
      destination_airport: flight.destination_airport,
      source_city: flight.source_city,
      destination_city: flight.destination_city,
      departure_time: normalizeDateFormat(flight.departure_time),
      arrival_time: normalizeDateFormat(flight.arrival_time),
      duration_minutes: flight.duration_minutes,
      base_price: flight.base_price,
      available_seats: flight.available_seats,
      flight_type: flight.flight_type,
      
      // Ensure all flights have total_price and total_duration_minutes
      total_price: flight.total_price || flight.base_price,
      total_duration_minutes: flight.total_duration_minutes || flight.duration_minutes
    })),
    
    user_id: rawPayload.user_id,
    flight_total: rawPayload.flight_total,
    source_place: rawPayload.source_place
  };

  return normalizedPayload;
};

// Updated handleCreateBookingAfterPayment function with payload normalization
const handleCreateBookingAfterPayment = async (bookingPayload) => {
  try {
    setBookingLoading(true);
    console.log("Raw booking payload:", bookingPayload);
    
    // Normalize the payload structure
    const normalizedPayload = normalizeBookingPayload(bookingPayload);
    console.log("Normalized booking payload:", normalizedPayload);
    
    // Validate required fields
    const requiredFields = ['package_id', 'head_count', 'passengers', 'booking_date', 'flights', 'user_id', 'flight_total'];
    const missingFields = requiredFields.filter(field => !normalizedPayload[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    // Validate passengers array
    if (!Array.isArray(normalizedPayload.passengers) || normalizedPayload.passengers.length === 0) {
      throw new Error('Passengers must be a non-empty array');
    }
    
    // Validate flights array
    if (!Array.isArray(normalizedPayload.flights) || normalizedPayload.flights.length === 0) {
      throw new Error('Flights must be a non-empty array');
    }

    const response = await fetch(`${backendUrl}/trip_package/create_booking`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(normalizedPayload),
    });

    if (response.ok) {
      const bookingResult = await response.json();
      console.log('Booking created successfully after payment:', bookingResult);

      // Send confirmation mail with normalized data
      await sendConfirmationMail(
        bookingResult, 
        normalizedPayload.booking_date, 
        normalizedPayload.end_date, 
        normalizedPayload.source_place
      );

      // Show success message and navigate to bookings
      alert('🎉 Booking was successful! Your trip has been confirmed.');
      setActiveComponent('bookings');
      
    } else {
      const errorData = await response.json();
      console.error('Booking failed after payment:', errorData);
      throw new Error(errorData.message || 'Failed to create booking');
    }
  } catch (error) {
    console.error('Error creating booking after payment:', error);
    alert(`Payment was successful, but there was an error creating your booking: ${error.message}. Please contact support with your payment details.`);
  } finally {
    setBookingLoading(false);
  }
};
  // Send confirmation email
  const sendConfirmationMail = async (bookingResult, departureTime, arrivalTime, sourceName) => {
    try {
      const userEmail = getCookie('userEmail');

      const mailPayload = {
        from: "fliptrip1025@gmail.com",
        to: userEmail,
        subject: "Booking Confirmation - FlipTrip",
        body: `
          Dear Customer, 

          Your package booking (ID: ${bookingResult?.booking_id || "N/A"}) 
          has been successfully created. 🎉

          Package: ${bookingResult?.package?.package_name || "Selected Package"}
          Head Count: ${bookingResult?.head_count || 1}
          Booking Date: ${departureTime || ""}
          Source Location: ${sourceName || ""}
          End Date: ${arrivalTime || ""}

          Thank you for choosing FlipTrip!
      `,
        attachment: ""
      };

      console.log("[Mail] Sending payload to backend:", mailPayload);

      const response = await fetch(`${backendUrl}/trip_package/proxy_send_email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": mailApiKey
        },
        body: JSON.stringify(mailPayload),
      });

      if (response.ok) {
        const resData = await response.json();
        console.log("[Mail] Confirmation mail sent successfully!", resData);
      } else {
        const errorData = await response.json();
        console.error("[Mail] Failed to send mail:", errorData);
      }
    } catch (error) {
      console.error("[Mail] Unexpected error:", error);
    }
  };

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
      localStorage.clear(); // Also clear localStorage to remove any pending booking data
      
      // Redirect to auth page
      window.location.href = '/auth';
    }
  };

  return (
    <div className="app-container">
      {/* Loading overlay for booking creation */}
      {bookingLoading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          color: 'white',
          fontSize: '18px'
        }}>
          Creating your booking...
        </div>
      )}

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