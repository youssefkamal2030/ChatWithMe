using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ChatWithMe.Models;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using ChatWithMe.Models.DTO_s;
using static System.Net.Mime.MediaTypeNames;

[ApiController]
[Route("[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly RoleManager<User> _roleManager;
    private readonly IConfiguration _configuration;
    private readonly IWebHostEnvironment _env;
    public AuthController(UserManager<User> userManager, SignInManager<User> signInManager, IConfiguration configuration, IWebHostEnvironment env)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
        _env = env;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromForm] RegisterDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var password = dto.Password; //this to store the password as plain-text for testing reasons 
        var ExistingUser = await _userManager.FindByEmailAsync(dto.Email);
        if (ExistingUser != null)
        {
            return BadRequest(new { message = "This user Already Exists" });
        }
        string profilePicturePath = null;
        string filePath = null;

        try
        {
            // Handle profile picture upload
            if (dto.ProfilePicture != null)
            {
               
                if (dto.ProfilePicture.Length > 2 * 1024 * 1024)
                {
                    return BadRequest("Profile picture must be less than 2MB");
                }

                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
                var extension = Path.GetExtension(dto.ProfilePicture.FileName).ToLower();
                if (!allowedExtensions.Contains(extension))
                {
                    return BadRequest("Invalid file type. Allowed types: JPG, PNG, GIF");
                }
                // Generate unique filename
                var fileName = $"{Guid.NewGuid()}{extension}";
                var uploadsFolder = Path.Combine(_env.ContentRootPath, "uploads");
                Directory.CreateDirectory(uploadsFolder); // Ensure directory exists

                filePath = Path.Combine(uploadsFolder, fileName);

                // Save file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.ProfilePicture.CopyToAsync(stream);
                }

                profilePicturePath = $"/uploads/{fileName}";
            }

            var user = new User
            {
                UserName = dto.UserName,
                Email = dto.Email,
                Password = password,
                Bio = dto.Bio,
                ProfilePicture = profilePicturePath

            };
            var result = await _userManager.CreateAsync(user, password);

            if (result.Succeeded)
            {

                user.Password = password;
                await _userManager.UpdateAsync(user);

                return Ok(new { message = "Register success" });
            }
            else
            {
                return BadRequest(result.Errors);
            }
        }
        catch(Exception ex)
        {
            Console.WriteLine($"CRITICAL ERROR: {ex}");
            return StatusCode(500, "Internal server error during registration");
        }
    }
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new { Error = "Username or password is invalid" });
        }
            var existingUser = await _userManager.FindByEmailAsync(dto.Email);
            if (existingUser != null)
            {
                
                if (existingUser.Password == dto.Password)
                {
                    var token = GenerateJwtToken(existingUser);
                  
                    await _signInManager.SignInAsync(existingUser, isPersistent: false);

                    return Ok(new
                    {
                        message = "Login success",
                        UserID = existingUser?.Id,
                        UserName = existingUser?.UserName,
                        Email = existingUser?.Email,
                        Token = token
                    });
                }
                else
                {
                    return BadRequest(new { message = "Invalid password" });
                }
            }
            else
            {
                return BadRequest(new { message = "User not found" });
            }
        
    }
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await _signInManager.SignOutAsync();
        return Ok("Logged out successfully!");
    }
    [HttpPost("assign-role")]
    public async Task<IActionResult> AssignRole(string email, string role)
    {
        // Validate input
        if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(role))
        {
            return BadRequest("Email and role are required.");
        }

        // Find the user by email
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
        {
            return NotFound("User not found.");
        }

        // Assign the role to the user
        var result = await _userManager.AddToRoleAsync(user, role);
        if (result.Succeeded)
        {
            return Ok($"Role '{role}' assigned to user '{email}'.");
        }

        // If role assignment fails, return errors
        return BadRequest(result.Errors);
    }
    private string GenerateJwtToken(User user)
    {
       
        var jwtKey = _configuration["Jwt:Key"];
        var jwtIssuer = _configuration["Jwt:Issuer"];
        var jwtAudience = _configuration["Jwt:Audience"];

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.Id)
        };

        var token = new JwtSecurityToken(
            issuer: jwtIssuer,
            audience: jwtAudience,
            claims: claims,
            expires: DateTime.Now.AddMinutes(30), 
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}