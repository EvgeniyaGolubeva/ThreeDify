/* 
Управлява auth логиката: Създава user, token, login, register, logout методи
Зарежда текущия потребител с GET /me
*/

import { createContext, useContext, useEffect, useState } from "react";
import axios from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => { //get me
    if (token) {
      axios
        .get("/me")
        .then((res) => {
          console.log("Loaded user:", res.data);
          setUser(res.data);
        })
        .catch(() => {
          console.warn("Failed to load user /me");
          setToken("");
          localStorage.removeItem("token");
        });
    }
  }, [token]);
  
  const login = async (email, password) => {
    const data = new URLSearchParams();
    data.append("username", email);
    data.append("password", password);
    data.append("grant_type", "password");

    const res = await axios.post("/login", data, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const accessToken = res.data.access_token;
    setToken(accessToken);
    localStorage.setItem("token", accessToken);
  };

  const register = async (email, password) => {
    await axios.post("/register", { email, password });
    await login(email, password); 
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export { AuthContext };
