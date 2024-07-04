﻿// <auto-generated />
using System;
using API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace API.Migrations
{
    [DbContext(typeof(NotesAppContext))]
    [Migration("20240704054725_InitialCreate")]
    partial class InitialCreate
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "8.0.6");

            modelBuilder.Entity("API.Entities.Card", b =>
                {
                    b.Property<int>("CardId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int?>("CardBoxId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Content")
                        .HasColumnType("TEXT");

                    b.Property<int?>("InboxId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("UserId")
                        .HasColumnType("INTEGER");

                    b.HasKey("CardId");

                    b.HasIndex("CardBoxId");

                    b.HasIndex("InboxId");

                    b.HasIndex("UserId");

                    b.ToTable("Cards");
                });

            modelBuilder.Entity("API.Entities.CardBox", b =>
                {
                    b.Property<int>("CardBoxId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("CardBoxName")
                        .HasColumnType("TEXT");

                    b.HasKey("CardBoxId");

                    b.ToTable("CardBoxes");
                });

            modelBuilder.Entity("API.Entities.CardNoteBookLink", b =>
                {
                    b.Property<int>("CardId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("NoteBookId")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("ResourceId")
                        .HasColumnType("INTEGER");

                    b.HasKey("CardId", "NoteBookId");

                    b.HasIndex("NoteBookId");

                    b.HasIndex("ResourceId");

                    b.ToTable("CardNoteBookLinks");
                });

            modelBuilder.Entity("API.Entities.CardTag", b =>
                {
                    b.Property<int>("CardId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("TagId")
                        .HasColumnType("INTEGER");

                    b.HasKey("CardId", "TagId");

                    b.HasIndex("TagId");

                    b.ToTable("CardTags");
                });

            modelBuilder.Entity("API.Entities.Inbox", b =>
                {
                    b.Property<int>("InboxId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.HasKey("InboxId");

                    b.ToTable("Inboxes");
                });

            modelBuilder.Entity("API.Entities.NoteBook", b =>
                {
                    b.Property<int>("NoteBookId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("NoteBookName")
                        .HasColumnType("TEXT");

                    b.HasKey("NoteBookId");

                    b.ToTable("NoteBooks");
                });

            modelBuilder.Entity("API.Entities.Resource", b =>
                {
                    b.Property<int>("ResourceId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Content")
                        .HasColumnType("TEXT");

                    b.Property<int?>("NoteBookId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("ResourceName")
                        .HasColumnType("TEXT");

                    b.Property<string>("Summary")
                        .HasColumnType("TEXT");

                    b.HasKey("ResourceId");

                    b.HasIndex("NoteBookId");

                    b.ToTable("Resources");
                });

            modelBuilder.Entity("API.Entities.Tag", b =>
                {
                    b.Property<int>("TagId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("TagName")
                        .HasColumnType("TEXT");

                    b.HasKey("TagId");

                    b.ToTable("Tags");
                });

            modelBuilder.Entity("API.Entities.User", b =>
                {
                    b.Property<int>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("AccountType")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("AvatarUrl")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Password")
                        .HasColumnType("TEXT");

                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("UserId");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("API.Entities.Card", b =>
                {
                    b.HasOne("API.Entities.CardBox", "CardBox")
                        .WithMany("Cards")
                        .HasForeignKey("CardBoxId");

                    b.HasOne("API.Entities.Inbox", "Inbox")
                        .WithMany("Cards")
                        .HasForeignKey("InboxId");

                    b.HasOne("API.Entities.User", "User")
                        .WithMany("Cards")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("CardBox");

                    b.Navigation("Inbox");

                    b.Navigation("User");
                });

            modelBuilder.Entity("API.Entities.CardNoteBookLink", b =>
                {
                    b.HasOne("API.Entities.Card", "Card")
                        .WithMany("CardBookLinks")
                        .HasForeignKey("CardId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("API.Entities.NoteBook", "NoteBook")
                        .WithMany("CardBookLinks")
                        .HasForeignKey("NoteBookId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("API.Entities.Resource", null)
                        .WithMany("CardBookLinks")
                        .HasForeignKey("ResourceId");

                    b.Navigation("Card");

                    b.Navigation("NoteBook");
                });

            modelBuilder.Entity("API.Entities.CardTag", b =>
                {
                    b.HasOne("API.Entities.Card", "Card")
                        .WithMany("CardTags")
                        .HasForeignKey("CardId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("API.Entities.Tag", "Tag")
                        .WithMany("CardTags")
                        .HasForeignKey("TagId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Card");

                    b.Navigation("Tag");
                });

            modelBuilder.Entity("API.Entities.Resource", b =>
                {
                    b.HasOne("API.Entities.NoteBook", null)
                        .WithMany("Resources")
                        .HasForeignKey("NoteBookId");
                });

            modelBuilder.Entity("API.Entities.Card", b =>
                {
                    b.Navigation("CardBookLinks");

                    b.Navigation("CardTags");
                });

            modelBuilder.Entity("API.Entities.CardBox", b =>
                {
                    b.Navigation("Cards");
                });

            modelBuilder.Entity("API.Entities.Inbox", b =>
                {
                    b.Navigation("Cards");
                });

            modelBuilder.Entity("API.Entities.NoteBook", b =>
                {
                    b.Navigation("CardBookLinks");

                    b.Navigation("Resources");
                });

            modelBuilder.Entity("API.Entities.Resource", b =>
                {
                    b.Navigation("CardBookLinks");
                });

            modelBuilder.Entity("API.Entities.Tag", b =>
                {
                    b.Navigation("CardTags");
                });

            modelBuilder.Entity("API.Entities.User", b =>
                {
                    b.Navigation("Cards");
                });
#pragma warning restore 612, 618
        }
    }
}
