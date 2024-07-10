using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class NotesAppContext: IdentityDbContext<User>
    {
        public NotesAppContext(DbContextOptions<NotesAppContext> options) : base(options)
        {
        }
        public DbSet<Card> Cards { get; set; }
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
            modelBuilder.Entity<Card>()
                .Property(c => c.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<IdentityRole>().HasData(
                new IdentityRole { Name = "Admin", NormalizedName = "ADMIN" },
                new IdentityRole { Name = "Member", NormalizedName = "MEMBER" }
            ); 
        }
    }
}