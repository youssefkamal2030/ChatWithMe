import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import CreateRoom from './components/CreateRoom';
import ChatRoom from './components/ChatRoom';
import RoomList from './components/RoomList';
import SideList from './components/SideList';
import ProfilePage from './components/ProfilePage';
import History from './components/History';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Header />
      <SideList />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/CreatRoom" element={<CreateRoom />} />
        <Route path="/ChatRoom/:roomId" element={<ChatRoom />} />
        <Route path="/Rooms" element={<RoomList />} /> 
        <Route path="/profile/:username" element={<ProfilePage />} />       
        <Route path="/History" element={<History />} />    
         </Routes>
    </Router>
  );
}

export default App;