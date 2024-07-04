using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class NotesAppContext: DbContext
    {
        public NotesAppContext(DbContextOptions<NotesAppContext> options) : base(options)
        {
        }
        public DbSet<User> Users { get; set; }
        public DbSet<Card> Cards { get; set; }
        public DbSet<Inbox> Inboxes { get; set; }
        public DbSet<CardBox> CardBoxes { get; set; }
        public DbSet<NoteBook> NoteBooks { get; set; }
        public DbSet<CardNoteBookLink> CardNoteBookLinks { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<CardTag> CardTags { get; set; }
        public DbSet<Resource> Resources { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<CardNoteBookLink>()
                .HasKey(cn => new { cn.CardId, cn.NoteBookId });

            modelBuilder.Entity<CardTag>()
                .HasKey(ct => new { ct.CardId, ct.TagId });

            base.OnModelCreating(modelBuilder);
        }
    }
}