// Controllers/UsersController.cs
using ChatWithMe.Models.DTO_s;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly Context _context;
    private readonly IWebHostEnvironment _env;

    public UsersController(UserManager<User> userManager,Context context,IWebHostEnvironment env)
    {
        _userManager = userManager;
        _context = context;
        _env = env;
    }

    // GET: api/Users/{username}
    [HttpGet("{username}")]
    public async Task<ActionResult<ProfileDto>> GetProfile(string username)
    {
        var user = await _userManager.FindByNameAsync(username);
        if (user == null) return NotFound();

        var stats = new
        {
            RoomsCreated = await _context.ChatRoom
                .CountAsync(r => r.CreatedByID == user.Id),
            MessagesSent = await _context.Message
                .CountAsync(m => m.SenderID == user.Id)
        };

        return new ProfileDto
        {
            UserName = user.UserName,
            Email = user.Email,
            Bio = user.Bio,
            ProfilePicture = user.ProfilePicture,
            CreatedAt = user.CreatedAt,
            RoomsCreated = stats.RoomsCreated,
            MessagesSent = stats.MessagesSent
        };
    }

    // PUT: api/Users/{username}
    [HttpPut("{username}")]
    public async Task<ActionResult<ProfileDto>> UpdateProfile(string username,[FromForm] UpdateProfileDto dto)
    {
        var user = await _userManager.FindByNameAsync(username);
        if (user == null) return NotFound();

        // Update bio
        if(dto.UserName!= null)
        {
            user.UserName = dto.UserName;
        }
        if (!string.IsNullOrEmpty(dto.Bio))
        {
            user.Bio = dto.Bio;
        }

        // Handle profile picture upload
        if (dto.ProfilePicture != null)
        {
            // Validate file size
            if (dto.ProfilePicture.Length > 2 * 1024 * 1024)
            {
                return BadRequest("File size exceeds 2MB");
            }

            // Validate file extension
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
            var extension = Path.GetExtension(dto.ProfilePicture.FileName).ToLower();
            if (!allowedExtensions.Contains(extension))
            {
                return BadRequest("Invalid file type. Allowed types: JPG, JPEG, PNG, GIF");
            }

            // Create uploads directory
            var uploadsFolder = Path.Combine(_env.ContentRootPath, "uploads");
            Directory.CreateDirectory(uploadsFolder); 

            // Save file
            var uniqueFileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await dto.ProfilePicture.CopyToAsync(stream);
            }

            user.ProfilePicture = $"/uploads/{uniqueFileName}";
        }
        Console.WriteLine(user);
        await _userManager.UpdateAsync(user);

        // Return updated profile
        var stats = new
        {
            RoomsCreated = await _context.ChatRoom.CountAsync(r => r.CreatedByID == user.Id),
            MessagesSent = await _context.Message.CountAsync(m => m.SenderID == user.Id)
        };

        return new ProfileDto
        {
            UserName = user.UserName,
            Email = user.Email,
            Bio = user.Bio,
            ProfilePicture = user.ProfilePicture,
            CreatedAt = user.CreatedAt,
            RoomsCreated = stats.RoomsCreated,
            MessagesSent = stats.MessagesSent
        };
    }
}