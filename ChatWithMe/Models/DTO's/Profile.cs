namespace ChatWithMe.Models.DTO_s
{
    public class ProfileDto
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Bio { get; set; }
        public string ProfilePicture { get; set; }
        public DateTime CreatedAt { get; set; }
        public int RoomsCreated { get; set; }
        public int MessagesSent { get; set; }
    }

    public class UpdateProfileDto
    {
        public string Bio { get; set; }
        public IFormFile ProfilePicture { get; set; }
    }
}
