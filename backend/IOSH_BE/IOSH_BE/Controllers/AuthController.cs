using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using IOSH_BE.Data;
using IOSH_BE.Models;
using BCrypt.Net;

namespace IOSH_BE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegistrationDto model)
        {
            if (await _context.Users.AnyAsync(u => u.Email == model.Email))
            {
                return BadRequest("User already exists.");
            }

            var user = new User
            {
                Email = model.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password),
                FullName = model.FullName
            };

            _context.Users.Add(user);
            await _context.Set<User>().AddAsync(user); // Explicitly use Set to avoid ambiguity if any
            await _context.SaveChangesAsync();

            return Ok("User registered successfully.");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto model)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(model.Password, user.PasswordHash))
            {
                return Unauthorized("Invalid email or password.");
            }

            // For now, return a simple success message. 
            // In a real app, you'd return a JWT token here.
            return Ok(new { 
                Message = "Login successful", 
                User = new { user.Id, user.Email, user.FullName } 
            });
        }
    }

    public class UserRegistrationDto
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
        public string? FullName { get; set; }
    }

    public class UserLoginDto
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
    }
}
