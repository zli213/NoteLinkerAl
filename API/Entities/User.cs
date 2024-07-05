#nullable enable

using System.Text.Json.Serialization;

namespace API.Entities
{
    public class User
    {
        public int UserId { get; set; }
        public required string UserName { get; set; }
        // email, password(optional), third-party auth give a account type, etc.
        public required string Email { get; set; }
        public string? Password { get; set; } 
        public required string AccountType { get; set; }
        // Avatar
        public required string AvatarUrl { get; set; }
        [JsonIgnore]
        public ICollection<Card> Cards { get; set; } = new List<Card>(); // Initialize as an empty list to avoid null reference exception

    }
}