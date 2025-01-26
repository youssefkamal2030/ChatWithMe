using System.ComponentModel.DataAnnotations.Schema;

namespace ChatWithMe.Models
{
    public class UserChatRoom
    {
        public int UserChatRoomID { get; set; }

        public string UserID { get; set; } 
        [ForeignKey("UserID")]
        public User User { get; set; }

        public int RoomID { get; set; } 
        [ForeignKey("RoomID")]
        public ChatRoom Room { get; set; }
    }
}
