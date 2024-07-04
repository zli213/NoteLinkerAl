namespace API.Entities
{
    public class Tag
    {
        public int TagId { get; set; }
        public string TagName { get; set; }
        public ICollection<CardTag> CardTags { get; set; }
    }
}