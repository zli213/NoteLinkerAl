namespace API.Entities
{
    public class Tag
    {
        public int TagId { get; set; }
        public required string TagName { get; set; }
        public ICollection<CardTag>? CardTags { get; set; }
    }
}