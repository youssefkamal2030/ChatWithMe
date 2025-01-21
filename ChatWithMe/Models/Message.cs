using System.ComponentModel.DataAnnotations.Schema;

namespace ChatWithMe.Models
{ 
       public class Message
        {
            public int MessageID { get; set; }

            public int RoomID { get; set; } 
            [ForeignKey("RoomID")]
            public ChatRoom? Room { get; set; }

            public string SenderID { get; set; }
            [ForeignKey("SenderID")]
            public User? Sender { get; set; }

            public string Content { get; set; }
            public DateTime SentAt { get; set; }

            public ICollection<Reaction> Reactions { get; set; } = new List<Reaction>();
        }

    }
