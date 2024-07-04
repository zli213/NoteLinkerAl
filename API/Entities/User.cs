#nullable enable

namespace API.Entities
{
    public class User
    {
        public int UserId { get; set; }
        public required string UserName { get; set; }
        public ICollection<Card> Cards { get; set; } = new List<Card>(); // 初始化为一个空列表，避免空引用异常

        // email, password(optional), third-party auth give a account type, etc.
        public required string Email { get; set; }
        public string? Password { get; set; } // 可选属性
        public required string AccountType { get; set; }
        // Avatar
        public required string AvatarUrl { get; set; }
    }
}