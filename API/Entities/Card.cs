namespace API.Entities
{
    public class Card
    {
        public int CardId { get; set; }
        public required string Content { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        public int? CardBoxId { get; set; }
        public CardBox? CardBox { get; set; }
        public ICollection<CardNoteBookLink>? CardBookLinks { get; set; }
        public ICollection<CardTag>? CardTags { get; set; }
        // Add timestamp properties
        public DateTime CreatedAt { get; set; }
    }
}