using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace API.Entities
{
    public class User : IdentityUser
    {
        public string AccountType { get; set; } = string.Empty;
        public string AvatarUrl { get; set; } = string.Empty;
        public ICollection<Card> Cards { get; set; } = new List<Card>(); // Initialize as an empty list to avoid null reference exception
        public List<string>? Roles { get; internal set; }
    }
}
