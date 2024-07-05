using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class UpdateCardModelV2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
                migrationBuilder.AlterColumn<DateTime>(
                    name: "CreatedAt",
                    table: "Cards",
                    type: "TEXT",
                    nullable: false,
                    defaultValueSql: "CURRENT_TIMESTAMP",
                    oldClrType: typeof(DateTime),
                    oldType: "TEXT");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
