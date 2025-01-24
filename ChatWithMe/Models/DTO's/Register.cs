using System.ComponentModel.DataAnnotations;

namespace ChatWithMe.Models.DTO_s
{
    public class Register
    {
        [Required]
        public string UserName { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 6)]
        public string Password { get; set; }

        public string Bio { get; set; }

        public IFormFile ProfilePicture { get; set; }
    }
}
