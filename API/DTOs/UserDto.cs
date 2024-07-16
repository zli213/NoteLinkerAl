namespace API.DTOs
{
    public class UserDto
    {
        public required string Id { get; set; }
        public required string UserName { get; set; }
        public required string Email { get; set; }
        public required string AccountType { get; set; }
        public required string AvatarUrl { get; set; }
        public required List<string> Roles { get; set; }
        public required string Token { get; set; }
    }
}