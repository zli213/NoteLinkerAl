using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public static class DbInitializer
    {
        public static void Initialize(NotesAppContext context)
        {
            context.Database.EnsureCreated();

            // Check if there is already data
            if (context.Users.Any() || context.Cards.Any() || context.Inboxes.Any() || context.CardBoxes.Any() || context.NoteBooks.Any() || context.Tags.Any())
            {
                return;
            }

            var users = new List<User>
            {
                new User
                {
                    UserName = "john_doe",
                    Email = "john@example.com",
                    Password = "password123",
                    AccountType = "standard",
                    AvatarUrl = "https://api.dicebear.com/9.x/shapes/svg"
                },
                new User
                {
                    UserName = "jane_doe",
                    Email = "jane@example.com",
                    Password = "password456",
                    AccountType = "premium",
                    AvatarUrl = "https://api.dicebear.com/9.x/shapes/svg"
                }
            };
            context.Users.AddRange(users);
            context.SaveChanges();

            var inboxes = new List<Inbox>
            {
                new Inbox(),
                new Inbox()
            };
            context.Inboxes.AddRange(inboxes);
            context.SaveChanges();

            var cardBoxes = new List<CardBox>
            {
                new CardBox { CardBoxName = "Math" },
                new CardBox { CardBoxName = "Science" }
            };
            context.CardBoxes.AddRange(cardBoxes);
            context.SaveChanges();

            var notebooks = new List<NoteBook>
            {
                new NoteBook { NoteBookName = "Algebra" },
                new NoteBook { NoteBookName = "Physics" }
            };
            context.NoteBooks.AddRange(notebooks);
            context.SaveChanges();

            var tags = new List<Tag>
            {
                new Tag { TagName = "Important" },
                new Tag { TagName = "Review" }
            };
            context.Tags.AddRange(tags);
            context.SaveChanges();

            var cards = new List<Card>
            {
                new Card { Content = "What is 2+2?", UserId = users[0].UserId, InboxId = inboxes[0].InboxId, CardBoxId = cardBoxes[0].CardBoxId },
                new Card { Content = "What is the formula for force?", UserId = users[1].UserId, InboxId = inboxes[1].InboxId, CardBoxId = cardBoxes[1].CardBoxId }
            };
            context.Cards.AddRange(cards);
            context.SaveChanges();

            var cardNoteBookLinks = new List<CardNoteBookLink>
            {
                new CardNoteBookLink { CardId = cards[0].CardId, NoteBookId = notebooks[0].NoteBookId },
                new CardNoteBookLink { CardId = cards[1].CardId, NoteBookId = notebooks[1].NoteBookId }
            };
            context.CardNoteBookLinks.AddRange(cardNoteBookLinks);
            context.SaveChanges();

            var cardTags = new List<CardTag>
            {
                new CardTag { CardId = cards[0].CardId, TagId = tags[0].TagId },
                new CardTag { CardId = cards[1].CardId, TagId = tags[1].TagId }
            };
            context.CardTags.AddRange(cardTags);
            context.SaveChanges();

            var resources = new List<Resource>
            {
                new Resource
                {
                    ResourceName = "Algebra Basics",
                    Content = "Content for Algebra Basics",
                    Summary = "Summary for Algebra Basics",
                    CardBookLinks = new List<CardNoteBookLink> { cardNoteBookLinks[0] }
                },
                new Resource
                {
                    ResourceName = "Physics Introduction",
                    Content = "Content for Physics Introduction",
                    Summary = "Summary for Physics Introduction",
                    CardBookLinks = new List<CardNoteBookLink> { cardNoteBookLinks[1] }
                }
            };
            context.Resources.AddRange(resources);
            context.SaveChanges();
        }
    }
}