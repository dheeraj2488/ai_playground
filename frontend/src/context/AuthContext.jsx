import { createContext, use, useContext, useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { serverEndpoint } from "../config";
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyuser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios.get(
            `${serverEndpoint}/auth/verify`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          
          if (response.data.success) {

            setUser(response.data.user);
            
          }
        } else {
          setUser(null);
         
        }
      } catch (error) {
        console.log(error);
        if (error.response && !error.response.data.error) {
          setUser(null);
        }
      }
    };
    verifyuser();
  }, []);

  const loginUser = (user) => {
    
    setUser(user);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
