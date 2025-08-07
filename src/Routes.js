import LandingPage from './components/pages/LangingPage/LandingPage';
import AuthPages from './components/pages/Auth/Auth';
import Profile from './components/pages/Profile/Profile'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Cookie utility function
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

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = getCookie('isLoggedIn');
  const userEmail = getCookie('userEmail');
  
  return (isLoggedIn === 'true' && userEmail) ? children : <Navigate to="/auth" replace />;
};

// Public Route Component (redirect to landing if already logged in)
const PublicRoute = ({ children }) => {
  const isLoggedIn = getCookie('isLoggedIn');
  const userEmail = getCookie('userEmail');
  
  return (isLoggedIn === 'true' && userEmail) ? <Navigate to="/landing" replace /> : children;
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route 
          path="/auth" 
          element={
            <PublicRoute>
              <AuthPages />
            </PublicRoute>
          } 
        />
        
        {/* Protected routes */}
        <Route 
          path="/landing" 
          element={
            <ProtectedRoute>
              <LandingPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Default route - redirect based on authentication status */}
        <Route 
          path="/" 
          element={
            getCookie('isLoggedIn') === 'true' && getCookie('userEmail') 
              ? <Navigate to="/landing" replace />
              : <Navigate to="/auth" replace />
          } 
        />
        
        {/* Catch all other routes */}
        <Route 
          path="*" 
          element={
            getCookie('isLoggedIn') === 'true' && getCookie('userEmail') 
              ? <Navigate to="/landing" replace />
              : <Navigate to="/auth" replace />
          } 
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;