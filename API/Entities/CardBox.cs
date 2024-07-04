namespace API.Entities
{
    public class CardBox
    {
        public int CardBoxId { get; set; }
        public string CardBoxName { get; set; }
        public ICollection<Card> Cards { get; set; } = [];
    }
}