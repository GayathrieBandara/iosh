using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using IOSH_BE.Data;
using IOSH_BE.Models;

namespace IOSH_BE.Controllers
{
    [Route("stats")]
    [ApiController]
    public class StatsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StatsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<object>> GetStats()
        {
            var totalUsers = await _context.Users.CountAsync();
            var totalCerts = await _context.Certificates.CountAsync();
            var activeCerts = await _context.Certificates.CountAsync(c => c.Status == "active" && c.ExpiryDate > DateTime.Now);
            
            // Placeholder revenue calculation: Rs. 5000 per certificate
            var revenue = totalCerts * 5000;

            return Ok(new
            {
                total_users = totalUsers,
                total_certs = totalCerts,
                active_certs = activeCerts,
                revenue = revenue
            });
        }
    }
}
