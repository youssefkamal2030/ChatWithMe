using ChatWithMe.Models;
using Microsoft.AspNetCore.Identity;

public class User : IdentityUser
{
    public string Password { get; set; }
    public string? ProfilePicture { get; set; }
    public string? Bio { get; set; }
    public DateTime CreatedAt { get; set; }

    public ICollection<Message> Messages { get; set; } = new List<Message>();
    public ICollection<UserChatRoom> UserChatRooms { get; set; } = new List<UserChatRoom>();
    public ICollection<Reaction> Reactions { get; set; } = new List<Reaction>();
}