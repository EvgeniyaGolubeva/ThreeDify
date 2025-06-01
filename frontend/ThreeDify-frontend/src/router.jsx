/*
Използва react-router-dom и дефинира всички маршрути /login, /register, /start, и др.
Използва ProtectedRoute, за да не допуска неавторизирани потребители до вътрешните страници
*/

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Start from "./pages/Start"; 
import Exercise from "./pages/Exercise"; 
import Result from "./pages/Result";
import Account from "./pages/Account";
import Admin from "./pages/Admin";

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
}

export default function AppRouter() {
  const { user } = useAuth();
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/start" element={<ProtectedRoute><Start /></ProtectedRoute>} />
        <Route path="/exercise" element={<ProtectedRoute><Exercise /></ProtectedRoute>} />
        <Route path="/result" element={<ProtectedRoute><Result /></ProtectedRoute>} />
        <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute>{user?.is_admin ? <Admin /> : <Navigate to="/start" />}</ProtectedRoute> }/>
        <Route path="*" element={<Navigate to="/start" />} />
      </Routes>
    </Router>
  );
}
