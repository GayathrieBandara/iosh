using IOSH_BE.Models;
using BCrypt.Net;

namespace IOSH_BE.Data
{
    public static class DbSeeder
    {
        public static void SeedAdminUser(AppDbContext context)
        {
            context.Database.EnsureCreated();

            if (!context.Users.Any(u => u.Email == "admin"))
            {
                context.Users.Add(new User
                {
                    Email = "admin",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("123"),
                    FullName = "Administrator",
                    Role = "admin"
                });
                context.SaveChanges();
            }
        }
    }
}
