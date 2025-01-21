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

[ApiController]
[Route("[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly RoleManager<User> _roleManager;
    private readonly IConfiguration _configuration; 
    public AuthController(UserManager<User> userManager, SignInManager<User> signInManager, IConfiguration configuration)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] User user)
    {
        if (ModelState.IsValid)
        {
       
            var password = user.Password; //this to store the password as plain-text for testing reasons 
            var ExistingUser = await _userManager.FindByEmailAsync(user.Email);
            if(ExistingUser != null)
            {
                return BadRequest(new { message = "This user Already Exists" });
            }
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
        else
        {
            return BadRequest(new { message = "Invalid model state." });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] User user)
    {
        if (ModelState.IsValid)
        {
            var existingUser = await _userManager.FindByEmailAsync(user.Email);
            if (existingUser != null)
            {
                // Manually compare the plain-text passwords
                if (existingUser.Password == user.Password)
                {
                    var token = GenerateJwtToken(existingUser);
                    // Sign in the user
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
        else
        {
            return BadRequest(new {message = "Invalid model state." });
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