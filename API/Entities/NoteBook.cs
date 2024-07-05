namespace API.Entities
{
    public class NoteBook
    {
        public int NoteBookId { get; set; }
        public required string NoteBookName { get; set; }
        public ICollection<CardNoteBookLink>? CardBookLinks { get; set; }
        
        // A notebook can have many reousrces
        public ICollection<Resource>? Resources { get; set; }

    }
}