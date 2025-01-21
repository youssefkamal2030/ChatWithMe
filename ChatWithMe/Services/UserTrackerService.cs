using System.Collections.Concurrent;

namespace ChatWithMe.Services
{
    public class UserTrackerService
    {
        public ConcurrentDictionary<string, (string UserId, string UserName, string RoomName)>
        ConnectedUsers
        { get; } = new();
    }
}
