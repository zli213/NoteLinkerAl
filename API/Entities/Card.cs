using System.Text.Json.Serialization;
using API.Entities;

public class Card
{
    public int CardId { get; set; }
    public required string Content { get; set; }
    public required string UserId { get; set; }
    public int CardBoxId { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navigation properties
    [JsonIgnore]
    public  User? User { get; set; } = null!;
    [JsonIgnore]
    public  CardBox? CardBox { get; set; } = null!;
    public ICollection<CardNoteBookLink> CardNoteBookLinks { get; set; } = new List<CardNoteBookLink>();
    public ICollection<CardTag> CardTags { get; set; } = new List<CardTag>();
}
