namespace API.Entities
{
    public class Inbox
    {
        public int InboxId { get; set; }
        public ICollection<Card> Cards { get; set; } = [];
    }
}