namespace API.Entities
{
    public class CardNoteBookLink
    {
        public int CardId { get; set; }
        public Card Card { get; set; }
        public int NoteBookId { get; set; }
        public NoteBook NoteBook { get; set; }
    }
}