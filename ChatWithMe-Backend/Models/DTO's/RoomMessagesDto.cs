namespace ChatWithMe.Models.DTO_s
{
    public class RoomMessagesDto
    {
        public int MessageID { get; set; }
        public string Username { get; set; }
        public string Content { get; set; }
        public DateTime SentAt { get; set; }
        public string SenderID { get; set; }
    }
    public class MessageUpdateDto
    {
        public string Content { get; set; }
    }
}
