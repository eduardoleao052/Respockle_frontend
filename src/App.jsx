import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"
import Header from "./components/Header"
import Sidebar from "./components/Sidebar"
import "./styles/index.css"
import CreatePost from "./pages/CreatePost"
import DetailPost from "./pages/DetailPost"
import Community from "./pages/Community"
import SavedPosts from "./pages/SavedPosts"
import Profile from "./pages/Profile"
import { useState, useEffect } from "react"

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />;
}

function App() {
  const [trigger, setTrigger] = useState(false);
  const [feed, setFeed] = useState('created_at')

  return (
    <>
      <BrowserRouter>
        <Header />
        <div className="app">

          <Routes>
            <Route path="/" element={<ProtectedRoute><><Sidebar /><div className="vertical-line"></div><Home  feed={feed} setFeed={setFeed}/></></ProtectedRoute>}/>
            <Route path="/create_post" element={<ProtectedRoute><><Sidebar /><div className="vertical-line"></div><CreatePost /></></ProtectedRoute>}/>
            <Route path="/login" element={<Login />} />
            <Route path='/detail/:id' element={<ProtectedRoute><><Sidebar /><div className="vertical-line"></div><DetailPost /></></ProtectedRoute>} />
            <Route path='/community/:id' element={<ProtectedRoute><><Sidebar trigger={trigger} /><div className="vertical-line"></div><Community setTrigger={setTrigger} feed={feed} setFeed={setFeed}/></></ProtectedRoute>} />
            <Route path='/saved_posts/' element={<ProtectedRoute><><Sidebar /><div className="vertical-line"></div><SavedPosts feed={feed} setFeed={setFeed}/></></ProtectedRoute>} />
            <Route path='/profile/:id' element={<ProtectedRoute><><Sidebar /><div className="vertical-line"></div><Profile feed={feed} setFeed={setFeed}/></></ProtectedRoute>} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/register" element={<RegisterAndLogout />} />
            <Route path="*" element={<NotFound />}/>
          </Routes>
        </div>
      </BrowserRouter>
    </>
  )
}

export default App
