namespace API.Entities
{
    public class Resource
    {
        public int ResourceId { get; set; }
        public string ResourceName { get; set; }
        public ICollection<CardNoteBookLink> CardBookLinks { get; set; }
        // A resource content
        public string Content { get; set; }
        public string Summary { get; set; }
    }
}