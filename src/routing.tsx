import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login/Login';
import Signup from './pages/signup.jsx/SignUp';
import Todo from './pages/todo/Todo';
import AdminSignup from './pages/signup.jsx/AdminSignUp';
import AdminPanel from './components/admin-dashboard/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';


const Routing = () => {
  return (
    <Router>
      <Routes>
        
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup-admin" element={<AdminSignup />} />

        <Route path="/" element={<PrivateRoute element={Todo} />} />
        <Route path="/admin" element={<PrivateRoute element={AdminPanel} />} />
      </Routes>
    </Router>
  )
}

export default Routing