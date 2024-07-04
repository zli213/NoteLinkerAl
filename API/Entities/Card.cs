namespace API.Entities
{
    public class Card
    {
        public int CardId { get; set; }
        public string Content { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public int? InboxId { get; set; }
        public Inbox Inbox { get; set; }
        public int? CardBoxId { get; set; }
        public CardBox CardBox { get; set; }
        public ICollection<CardNoteBookLink> CardBookLinks { get; set; }
        public ICollection<CardTag> CardTags { get; set; }
    }
}