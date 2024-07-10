using API.Entities;
using Microsoft.AspNetCore.Identity;
using System.Linq;
using System.Collections.Generic;
using System;
using System.Threading.Tasks;

namespace API.Data
{
    public static class DbInitializer
    {
        public static async Task Initialize(NotesAppContext context, UserManager<User> userManager, RoleManager<IdentityRole> roleManager)
        {
            context.Database.EnsureCreated();

            // Ensure roles are created
            if (!await roleManager.RoleExistsAsync("Admin"))
            {
                await roleManager.CreateAsync(new IdentityRole("Admin"));
            }
            if (!await roleManager.RoleExistsAsync("Member"))
            {
                await roleManager.CreateAsync(new IdentityRole("Member"));
            }

            // Check if any users exist
            if (!userManager.Users.Any())
            {
                var user = new User
                {
                    UserName = "john_doe",
                    Email = "john@test.com",
                    AccountType = "standard",
                    AvatarUrl = "/images/avatars/john_doe.png"
                };
                await userManager.CreateAsync(user, "password123");
                await userManager.AddToRoleAsync(user, "Member");

                var admin = new User
                {
                    UserName = "jane_doe",
                    Email = "jane@test.com",
                    AccountType = "premium",
                    AvatarUrl = "/images/avatars/jane_doe.png"
                };
                await userManager.CreateAsync(admin, "password456");
                await userManager.AddToRolesAsync(admin, new[] { "Member", "Admin" });
            }

            if (context.CardBoxes.Any() || context.NoteBooks.Any() || context.Tags.Any() || context.Cards.Any() || context.Resources.Any())
            {
                return; // DB has been seeded
            }

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
                new Tag { TagName = "Review" },
                new Tag { TagName = "Inbox" }
            };
            context.Tags.AddRange(tags);
            context.SaveChanges();

            // Retrieve user IDs and handle possible null references
            var johnDoe = await userManager.FindByNameAsync("john_doe");
            var janeDoe = await userManager.FindByNameAsync("jane_doe");

            if (johnDoe == null || janeDoe == null)
            {
                throw new Exception("Seeding error: Required users not found.");
            }

            var cards = new List<Card>
            {
                new Card 
                { 
                    Content = "What is 2+2?", 
                    UserId = johnDoe.Id, 
                    CardBoxId = cardBoxes[0].CardBoxId, 
                    CreatedAt = DateTime.UtcNow, 
                    User = johnDoe, 
                    CardBox = cardBoxes[0]
                },
                new Card 
                { 
                    Content = "What is the formula for force?", 
                    UserId = janeDoe.Id, 
                    CardBoxId = cardBoxes[1].CardBoxId, 
                    CreatedAt = DateTime.UtcNow, 
                    User = janeDoe, 
                    CardBox = cardBoxes[1]
                }
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
                new CardTag { CardId = cards[0].CardId, TagId = tags[2].TagId }, // Inbox tag
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
