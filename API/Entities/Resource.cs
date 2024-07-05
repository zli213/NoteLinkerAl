namespace API.Entities
{
    public class Resource
    {
        public int ResourceId { get; set; }
        public required string ResourceName { get; set; }
        public ICollection<CardNoteBookLink>? CardBookLinks { get; set; }
        // A resource content
        public required string Content { get; set; }
        public required string Summary { get; set; }
    }
}