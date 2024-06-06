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
import Matches from './pages/Matches'
import MatchesDetail from './pages/MatchesDetail'
import OTP from './pages/otpPage'
import ResetPassword from './pages/ResetPassword'
import EmailVerification from './pages/EmailVerification'

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp-page" element={<OTP />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="/matches" element={<PrivateRoute />}>
          <Route path="/matches" element={<Matches />} />
        </Route>
        <Route path="/matches/:id" element={<PrivateRoute />}>
          <Route path="/matches/:id" element={<MatchesDetail />} />
        </Route>
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
