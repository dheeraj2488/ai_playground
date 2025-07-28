import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Signup';
import PrivateRoute from './protected/PrivateRoute';
import Home from './pages/Home';

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
    </Routes>
  );
}

export default App;
