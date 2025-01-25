using Microsoft.AspNetCore.SignalR;
using ChatWithMe.Models;
using ChatWithMe.Services; // Add this
using System.Collections.Concurrent;
using Microsoft.EntityFrameworkCore;

namespace ChatWithMe.Hubs
{
    public class ChatHub : Hub
    {
        private readonly Context _context;
        private readonly UserTrackerService _userTracker; // Injected service

        public ChatHub(Context context, UserTrackerService userTracker)
        {
            _context = context;
            _userTracker = userTracker; // Dependency injection
        }

        // Method to join a chat room
        public async Task JoinRoom(string roomName, string userName)
        {
            // Get user from database
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == userName);
            if (user == null) return;

            // Track user connection
            _userTracker.ConnectedUsers.TryAdd(
                Context.ConnectionId,
                (user.Id, user.UserName, roomName)
            );

            await Groups.AddToGroupAsync(Context.ConnectionId, roomName);
            await Clients.Group(roomName).SendAsync("Notify", $"{userName} joined {roomName}");

            // Broadcast updated user list
            await BroadcastActiveUsers(roomName);
        }

        // Method to leave a chat room
        public async Task LeaveRoom(string roomName, string userName)
        {
            // Remove from tracker
            _userTracker.ConnectedUsers.TryRemove(Context.ConnectionId, out _);

            await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomName);
            await Clients.Group(roomName).SendAsync("Notify", $"{userName} left {roomName}");

            // Broadcast updated user list
            await BroadcastActiveUsers(roomName);
        }

        // Method to send messages
        public async Task SendMessage(string roomName, string userName, string messageContent)
        {
            var room = await _context.ChatRoom.FirstOrDefaultAsync(r => r.RoomName == roomName);
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == userName);

            if (room != null && user != null)
            {
                var message = new Message
                {
                    RoomID = room.RoomID,
                    SenderID = user.Id,
                    Content = messageContent,
                    SentAt = DateTime.UtcNow
                };

                _context.Message.Add(message);
                await _context.SaveChangesAsync();

                await Clients.Group(roomName).SendAsync("ReceiveMessage",
                    userName,
                    messageContent,
                    message.SentAt);
            }
        }

        // Cleanup on disconnect
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            if (_userTracker.ConnectedUsers.TryGetValue(Context.ConnectionId, out var user))
            {
                await Clients.Group(user.RoomName).SendAsync("Notify", $"{user.UserName} disconnected");
                await BroadcastActiveUsers(user.RoomName);
            }

            _userTracker.ConnectedUsers.TryRemove(Context.ConnectionId, out _);
            await base.OnDisconnectedAsync(exception);
        }

        // Helper to broadcast active users
        private async Task BroadcastActiveUsers(string roomName)
        {
            var activeUsers = _userTracker.ConnectedUsers
                .Where(u => u.Value.RoomName == roomName)
                .Select(u => u.Value.UserName)
                .Distinct()
                .ToList()
                .Select(async username => await _context.Users
                    .FirstOrDefaultAsync(u => u.UserName == username))
                .Select(t => t.Result)
                .Select(u => new {
                    Username = u.UserName,
                    Photo = u.ProfilePicture,  
                    Bio = u.Bio
                })
                .ToList();

            await Clients.Group(roomName).SendAsync("ActiveUsers", activeUsers);
        }
    }
}