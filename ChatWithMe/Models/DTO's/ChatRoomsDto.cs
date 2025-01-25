namespace ChatWithMe.Models.DTO_s
{
    public class ChatRoomsDto
    {
        public int RoomID { get; set; } // Add this
        public string RoomName { get; set; }
        public User CreatedBy { get; set; } // Change from string to UserDto
        public DateTime CreatedAt { get; set; }
    }
}
