# ChatWithMe 💬
*A Full-Stack Real-Time Chat Application*

**Frontend**: React/Next.js • **Backend**: ASP.NET Core + SignalR  
*Real-time messaging, JWT authentication, chat room management, and message history.*

---

## 🚀 Quick Start

1. **Clone both repositories**:
   ```bash
   git clone https://github.com/youssefkamal2030/ChatWithMe.git
   ```
   
2. **Follow the setup guides**:
   - [Backend Setup (API & Database)](ChatWithMe-Backend/README.md)
   - [Frontend Setup (React Client)](frontend/README.md)

---

## 🌟 Key Features

### Frontend (React)
- **Real-time chat interface**: Instant messaging with SignalR WebSocket.
- **User profile management**: Users can create and update profiles.
- **Chat room navigation**: Easy room creation, joining, and management.
- **Message history viewer**: View past messages in a chat room.
- **Responsive design**: Optimized for mobile and desktop devices.

### Backend (ASP.NET Core)
- **SignalR WebSocket messaging**: Real-time communication.
- **JWT authentication**: Secure login and registration.
- **RESTful API endpoints**: For CRUD operations (users, messages, rooms).
- **SQL Server database**: Stores users, rooms, and messages.
- **Online user presence**: Tracks active users in real-time.

---

## 🛠️ Technologies

### Frontend:
- **React/Next.js** - A fast and modern JavaScript framework.
- **Axios** - For making API requests to the backend.
- **SignalR Client** - Real-time messaging with SignalR.
- **Bootstrap** - Utility-first CSS for styling.

### Backend:
- **ASP.NET Core 8** - Powerful and scalable backend framework.
- **SignalR** - Real-time communication over WebSockets.
- **JWT Authentication** - Secure user authentication.
- **Entity Framework Core** - ORM for database interactions.
- **SQL Server** - Database to store user, room, and message data.

---

## 📂 Project Structure

```
ChatWithMe/
├── frontend/                   # React client (ChatWithMe-Front)
│   ├── src/                    # Components, pages, styles
│   └── README.md               # Frontend setup guide
│
├── backend/                    # ASP.NET Core API (ChatWithMe)
│   ├── Controllers/            # API endpoints
│   ├── Migrations/             # Database schema
│   └── README.md               # Backend docs
│
└── README.md                   # You are here (root guide)
```

---

## 🔌 How It Works

The frontend connects to the backend via:

- **REST API**: `http://localhost:44346/api` for CRUD operations (users, messages, chat rooms).
- **SignalR**: `http://localhost:44346/chatHub` for real-time messaging and user presence.
- **Authentication**: JWT tokens are passed in HTTP headers for secure access.
- **Database**: SQL Server is used to store users, chat rooms, and messages.

---

## 🚨 Prerequisites

Before running the application, make sure you have the following installed:

- **Node.js** (≥18) for the frontend.
- **.NET 8 SDK** for the backend.
- **SQL Server** (or Docker for a local SQL Server instance).

---

## 🤝 Contributing

I welcome contributions! Here's how you can contribute:

1. **Fork the repository**
2. **Follow the backend and frontend guidelines** for setup.
3. **Submit a pull request** with your changes.

---

Feel free to open an issue if you encounter any bugs or have suggestions for improvements. Let's make **ChatWithMe** even better together! 🎉

---
