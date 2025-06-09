import React from 'react'
import NavBar from './components/NavBar'
import { Routes } from 'react-router-dom'
import { Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Browse from './pages/Browse'
import Profile from './pages/Profile'
import CreateCourse from './pages/CreateCourse'
import ChatPage from './pages/ChatPage'
function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/create-course" element={<CreateCourse/>} />
        <Route path="/chat/:chatId" element={<ChatPage />} />
      </Routes>
    </>
  )
}

export default App
