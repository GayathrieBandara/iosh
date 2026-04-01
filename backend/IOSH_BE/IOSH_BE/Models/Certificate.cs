using System;

namespace IOSH_BE.Models
{
    public class Certificate
    {
        public int Id { get; set; }
        public required string CertId { get; set; }
        public required string Type { get; set; }
        public required DateTime ExpiryDate { get; set; }
        public required string OwnerEmail { get; set; }
        public string Status { get; set; } = "active";
        public DateTime IssueDate { get; set; } = DateTime.Now;
    }
}
