using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ChatWithMe.Models
{
    public class ChatRoom  
    {
        [Key]
        public int RoomID { get; set; }
        public string RoomName { get; set; }

        public string CreatedByID { get; set; }
        [ForeignKey("CreatedByID")]
        public User? CreatedBy { get; set; }

        public DateTime CreatedAt { get; set; }

        public ICollection<Message> Messages { get; set; } = new List<Message>();
        public ICollection<UserChatRoom> UserChatRooms { get; set; } = new List<UserChatRoom>();
    }

}
