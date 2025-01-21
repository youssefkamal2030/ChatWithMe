using Microsoft.AspNetCore.SignalR;
using ChatWithMe.Models;
using System.Threading.Tasks;

namespace ChatWithMe.Hubs
{
    public class ChatHub : Hub
    {
        private readonly Context _context;

        public ChatHub(Context context)
        {
            _context = context;
        }

        // Method to join a chat room
        public async Task JoinRoom(string roomName, string userName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, roomName);
            await Clients.Group(roomName).SendAsync("Notify", $"{userName} has joined the room {roomName}.");
        }

        // Method to send a message to a specific room
        public async Task SendMessage(string roomName, string userName, string messageContent)
        {
            var room = _context.ChatRoom.FirstOrDefault(r => r.RoomName == roomName);
            var user = _context.User.FirstOrDefault(r => r.UserName == userName);

            if (room != null && user != null)
            {
                // Save the message to the database
                var message = new Message
                {
                    RoomID = room.RoomID,
                    SenderID = user.Id,
                    Content = messageContent,
                    SentAt = DateTime.UtcNow
                };

                _context.Message.Add(message);
                await _context.SaveChangesAsync();

                // Broadcast the message to all users in the room
                await Clients.Group(roomName).SendAsync("ReceiveMessage", userName, messageContent);
            }
        }
    }
}