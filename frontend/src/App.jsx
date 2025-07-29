import { Routes, Route , Navigate} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Signup';
import PrivateRoute from './protected/PrivateRoute';
import Home from './pages/Home';
import { Toaster } from "react-hot-toast";
import { useAuth } from './context/AuthContext';
function App() {
  const { user } = useAuth();
  return (
    <><Toaster position="top-center" reverseOrder={false} />
    <Routes>
      <Route
        path="/homepage"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route path="/login" element={ user ? <Navigate to="/homepage" /> :  <Login />} />
      <Route path="/register" element={ user ? <Navigate to="/homepage" /> :  <Register />} />
      <Route path="/" element={<Navigate to="/homepage" />} />

      
    </Routes>
    </>
  );
}

export default App;
