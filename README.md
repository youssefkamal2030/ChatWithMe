# ChatWithMe Backend 🎉

The backend component of **ChatWithMe**, a real-time chat application built with **ASP.NET Core**, **SignalR**, and **JWT authentication**. This service provides RESTful APIs and real-time communication for user management, chat rooms, and messaging.

---

## 🚀 Features

- **JWT Authentication**  
  Secure user registration/login with token-based authentication.
- **Real-Time Chat**  
  SignalR integration for instant messaging and notifications.
- **Chat Room Management**  
  - Create and join chat rooms.  
  - Edit/delete rooms.  
  - Track message history.  
- **User Profiles**  
  - Update bio and profile picture.  
  - Track user chat history.  
- **Active Presence System**  
  Real-time tracking of online users.  
- **REST API**  
  Full CRUD operations for users, chat rooms, and messages.

---

## 🛠️ Technologies

- **Framework**: ASP.NET Core 8.0  
- **Real-Time Communication**: SignalR  
- **Database**: SQL Server + Entity Framework Core  
- **Authentication**: JWT Bearer Tokens  
- **File Storage**: Local file system  
- **Validation**: FluentValidation  
- **CORS**: Cross-Origin Resource Sharing  

---

## 📦 Installation & Setup

### 1. **Clone the Repository**
```bash
git clone https://github.com/yourusername/chatwithme-backend.git
cd chatwithme-backend
```

### 2. **Restore Dependencies**
```bash
dotnet restore
```

### 3. **Configuration**
Create or update the `appsettings.json` file with the following structure:
```json
{
  "Jwt": {
    "Key": "your-256-bit-secret-key",
    "Issuer": "ChatWithMe",
    "Audience": "ChatWithMe-Users",
    "ExpiryDays": 7
  },
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=ChatWithMeDB;"
  },
  "FileStorage": {
    "ProfilePicturesPath": "/uploads/profiles",
    "MaxFileSizeMB": 2
  },
  "Cors": {
    "AllowedOrigins": ["http://localhost:3000"]
  }
}
```

### 4. **Database Setup**
Run EF Core migrations to create the database:
```bash
dotnet ef database update
```

### 5. **Run the Application**
Start the application:
```bash
dotnet run
```

---

## 🌐 API Endpoints

### **Authentication**
| Endpoint          | Method | Description          |
|-------------------|--------|----------------------|
| `/Auth/login`     | POST   | User login           |
| `/Auth/register`  | POST   | User registration    |

### **Users**
| Endpoint                 | Method | Description                |
|--------------------------|--------|----------------------------|
| `/api/Users/{username}`  | GET    | Get user profile           |
| `/api/Users/rooms`       | GET    | Get user's chat rooms      |

### **Chat Rooms**
| Endpoint                 | Method | Description           |
|--------------------------|--------|-----------------------|
| `/api/ChatRoom`          | POST   | Create new room       |
| `/api/ChatRoom/{id}`     | GET    | Get room details      |

### **Messages**
| Endpoint                         | Method | Description              |
|----------------------------------|--------|--------------------------|
| `/api/Message/room/{roomId}`     | GET    | Get room messages        |
| `/api/Message/{id}`              | PUT    | Edit a message           |

### **SignalR Hub**  
`/chatHub`

#### **Methods**  
- `JoinRoom(roomName, username)`  
- `SendMessage(roomName, user, message)`

#### **Events**  
- `ReceiveMessage`  
- `MessageEdited`  
- `MessageDeleted`  
- `ActiveUsersUpdated`

---

## 🗄️ Database Schema

### **Main Entities**
- **Users**  
  - ID, Username, Email, PasswordHash, Bio, ProfilePicturePath
- **ChatRooms**  
  - RoomID, RoomName, CreatedByID, CreatedAt
- **Messages**  
  - MessageID, Content, SentAt, UserID, RoomID
- **UserRooms (Many-to-Many)**  
  - UserID, RoomID

---

## 🧪 Testing

### **Unit Tests**
Run all unit tests:
```bash
dotnet test
```

### **API Testing**
Access the Swagger UI for API testing at `/swagger` when the application is running locally.

---

## 🚚 Deployment

### **Production Build**
Generate a production-ready build:
```bash
dotnet publish -c Release -o ./publish
```

---

## ❤️ Contributions

Contributions, issues, and feature requests are welcome! Feel free to check out the [issues page](https://github.com/youssefkamal2030/chatwithme-backend/issues) or submit a pull request.

---
### ⭐ Don't forget to star this repo if you found it useful!
```

