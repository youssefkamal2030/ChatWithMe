namespace ChatWithMe.Models.DTO_s
{
    public class ChatRoomsDto
    {
        public int RoomID { get; set; }
        public string RoomName { get; set; }
        public DateTime CreatedAt { get; set; }
        public string CreatedByUserName { get; set; } 
        public string CreatedByEmail { get; set; }   
    }
}