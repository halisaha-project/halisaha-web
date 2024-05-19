import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Profile from './pages/Profile'
import PrivateRoute from './components/PrivateRoute'
import Header from './components/Header'
import ForgotPassword from './pages/ForgotPassword'
import Groups from './pages/Groups'
import Register from './pages/Register'
import GroupsDetail from './pages/GroupsDetail'

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/teams" element={<PrivateRoute />}>
          <Route path="/teams" element={<Groups />} />
        </Route>
        <Route path="/teams/:id" element={<PrivateRoute />}>
          <Route path="/teams/:id" element={<GroupsDetail />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
