namespace API.Entities
{
    public class CardBox
    {
        public int CardBoxId { get; set; }
        public required string CardBoxName { get; set; }
        public ICollection<Card> Cards { get; set; } = [];
    }
}