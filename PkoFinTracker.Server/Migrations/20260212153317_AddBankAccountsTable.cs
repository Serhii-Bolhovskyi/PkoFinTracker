using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PkoFinTracker.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddBankAccountsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AccountId",
                table: "Transactions");

            migrationBuilder.AddColumn<Guid>(
                name: "BankAccountId",
                table: "Transactions",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "BankAccounts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Iban = table.Column<string>(type: "text", nullable: false),
                    BankUid = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Currency = table.Column<string>(type: "text", nullable: false),
                    Balance = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    LastUpdated = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BankAccounts", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_BankAccountId",
                table: "Transactions",
                column: "BankAccountId");

            migrationBuilder.CreateIndex(
                name: "IX_BankAccounts_Iban",
                table: "BankAccounts",
                column: "Iban",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Transactions_BankAccounts_BankAccountId",
                table: "Transactions",
                column: "BankAccountId",
                principalTable: "BankAccounts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Transactions_BankAccounts_BankAccountId",
                table: "Transactions");

            migrationBuilder.DropTable(
                name: "BankAccounts");

            migrationBuilder.DropIndex(
                name: "IX_Transactions_BankAccountId",
                table: "Transactions");

            migrationBuilder.DropColumn(
                name: "BankAccountId",
                table: "Transactions");

            migrationBuilder.AddColumn<string>(
                name: "AccountId",
                table: "Transactions",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
