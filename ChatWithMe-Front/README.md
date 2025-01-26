# ChatWithMe - Real-Time Chat Application (Frontend)

**ChatWithMe** is a modern, real-time chat application built with React, featuring secure authentication, room management, and real-time messaging powered by SignalR. It serves as the frontend for a full-stack project that uses an ASP.NET Core backend. Whether you're messaging friends, joining chat rooms, or updating your profile, **ChatWithMe** is designed to be a seamless and intuitive experience. 🚀

## Features ✨

- **Real-Time Chat**: Instant message delivery and active user tracking powered by SignalR. 📨
- **User Authentication**: Secure login and registration system using JWT, with customizable profiles and avatars. 🔒
- **Room Management**: Create and join chat rooms with history tracking. 📅
- **Responsive Design**: Mobile-friendly interface with smooth animations and transitions. 📱
- **User Profiles**: Personalized profiles with the ability to add avatars, bios, and more. 🧑‍💻
- **Active User Tracking**: See who's online in real-time with user cards. 🟢
- **Message Management**: Edit or delete messages with persistence for a clean chat experience. ✏️

## Tech Stack ⚙️

### Frontend

- **React 18** - Modern React framework for building fast UIs.
- **React Router 6** - Dynamic routing for navigating between different pages in the app.
- **SignalR Client** - Real-time messaging powered by SignalR.
- **Axios** - HTTP client for making requests to the backend.
- **Bootstrap 5** - Responsive design framework for quick styling.
- **CSS Modules** - Scoped CSS for better styling management.

## Installation 🔧

### 1. Clone the Repository

```bash
git clone https://github.com/youssefkamal2030/chatwithme.git
cd chatwithme-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configuration

- Ensure that the backend is running at `https://localhost:44346`.
- If needed, update API endpoints in components to match the backend configuration.

### 4. Run the Application

```bash
npm start
```

This will start the app in development mode. Open `http://localhost:3000` to view it in your browser.

## Project Structure 🗂️

```
/src
├── components
│   ├── ChatRoom.jsx         # Main chat interface
│   ├── CreateRoom.jsx       # Room creation form
│   ├── Header.jsx           # Navigation header
│   ├── History.jsx          # Chat history view
│   ├── Home.jsx             # Landing page
│   ├── Login.jsx            # Authentication
│   ├── ProfilePage.jsx      # User profiles
│   ├── Register.jsx         # Registration
│   ├── RoomList.jsx         # Available rooms
│   ├── SideList.jsx         # Side navigation
│   └── SideListData.jsx     # Navigation items
├── styles
│   └── *.css                # Component-specific styles
└── App.js                   # Main application router
```

## Key Dependencies 🛠️

- **react**: 18.2.0
- **react-router-dom**: 6.14.2
- **@microsoft/signalr**: 8.0.0
- **axios**: 1.4.0
- **bootstrap**: 5.3.0

## Development Notes 📝

### Backend Requirements

For the frontend to work, you need a running instance of the backend server, which should provide:

- **SignalR Hub** endpoint at `/chatHub`
- REST API endpoints for authentication and data (e.g., login, register, user profiles)

### Environment Variables

Create a `.env` file in the root of your project and configure the following variables:

```env
REACT_APP_API_URL=https://localhost:44346/api
REACT_APP_HUB_URL=https://localhost:44346/chatHub
```

### Styling

- Custom CSS with a **Bootstrap** base.
- **Responsive grid layouts**, **CSS animations**, and **modern gradient backgrounds** for a sleek look.
- **Mobile-first** approach to ensure the app looks great on any device.

## Contributing 🤝

I welcome contributions! Here’s how you can contribute:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/AmazingFeature`
3. **Commit changes**: `git commit -m 'Add some AmazingFeature'`
4. **Push to branch**: `git push origin feature/AmazingFeature`
5. **Open a Pull Request** with a description of your changes.

---

Feel free to open an issue if you encounter any bugs or have suggestions for improvements. Let's build something amazing together! 😄

---

