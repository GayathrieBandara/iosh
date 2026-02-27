using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using IOSH_BE.Data;
using IOSH_BE.Models;
using System.Text.Json.Serialization;

namespace IOSH_BE.Controllers
{
    [Route("admin/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: admin/users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetUsers()
        {
            var users = await _context.Users
                .Select(u => new
                {
                    u.Id,
                    full_name = u.FullName,
                    u.Email,
                    u.Role,
                    certificate_count = 0 // Placeholder
                })
                .ToListAsync();

            return Ok(users);
        }

        // GET: admin/users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(new
            {
                user = new
                {
                    user.Id,
                    full_name = user.FullName,
                    user.Email,
                    user.Role
                },
                certificates = new List<object>() // Placeholder
            });
        }

        // POST: admin/users
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(UserCreateDto model)
        {
            var user = new User
            {
                Email = model.Email,
                FullName = model.FullName,
                Role = model.Role,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }

        // PUT: admin/users/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, UserUpdateDto model)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            user.FullName = model.FullName;
            user.Email = model.Email;
            user.Role = model.Role;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: admin/users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }

    public class UserCreateDto
    {
        [JsonPropertyName("full_name")]
        public string FullName { get; set; }
        
        [JsonPropertyName("email")]
        public string Email { get; set; }
        
        [JsonPropertyName("role")]
        public string Role { get; set; }
        
        [JsonPropertyName("password")]
        public string Password { get; set; }
    }

    public class UserUpdateDto
    {
        [JsonPropertyName("full_name")]
        public string FullName { get; set; }
        
        [JsonPropertyName("email")]
        public string Email { get; set; }
        
        [JsonPropertyName("role")]
        public string Role { get; set; }
    }
}
