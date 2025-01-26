using static ChatWithMe.Models.Message;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChatWithMe.Models
{
    public class Reaction
    {
        public int ReactionID { get; set; }

        public int MessageID { get; set; }
        [ForeignKey("MessageID")]
        public Message Message { get; set; }

        public string UserID { get; set; } 
        [ForeignKey("UserID")]
        public User User { get; set; }

        public string ReactionType { get; set; }
    }
}
