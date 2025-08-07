import logo from './logo.svg';
import './App.css';
import AuthPages from './components/pages/Auth/Auth';
import LandingPage from './components/pages/LangingPage/LandingPage';
import AppRoutes from './Routes';
import SideBar from './components/pages/SideBar/SideBar';

function App() {
  return (
    <>
      <div className="App">
        <AppRoutes />
      </div>
    </>  
  );
}

export default App;
