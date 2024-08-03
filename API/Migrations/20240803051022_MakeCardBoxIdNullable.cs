using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class MakeCardBoxIdNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cards_CardBoxes_CardBoxId",
                table: "Cards");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "77ee2934-7205-4a0b-a1b0-51e240499367");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "d11dadc1-5dda-45f4-baeb-8e8685094001");

            migrationBuilder.AlterColumn<int>(
                name: "CardBoxId",
                table: "Cards",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "3f12b10b-916f-4947-86ee-1e01ee1440bf", null, "Admin", "ADMIN" },
                    { "d514be1c-629b-4437-8375-9d3a889f3978", null, "Member", "MEMBER" }
                });

            migrationBuilder.AddForeignKey(
                name: "FK_Cards_CardBoxes_CardBoxId",
                table: "Cards",
                column: "CardBoxId",
                principalTable: "CardBoxes",
                principalColumn: "CardBoxId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cards_CardBoxes_CardBoxId",
                table: "Cards");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "3f12b10b-916f-4947-86ee-1e01ee1440bf");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "d514be1c-629b-4437-8375-9d3a889f3978");

            migrationBuilder.AlterColumn<int>(
                name: "CardBoxId",
                table: "Cards",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldNullable: true);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "77ee2934-7205-4a0b-a1b0-51e240499367", null, "Member", "MEMBER" },
                    { "d11dadc1-5dda-45f4-baeb-8e8685094001", null, "Admin", "ADMIN" }
                });

            migrationBuilder.AddForeignKey(
                name: "FK_Cards_CardBoxes_CardBoxId",
                table: "Cards",
                column: "CardBoxId",
                principalTable: "CardBoxes",
                principalColumn: "CardBoxId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
