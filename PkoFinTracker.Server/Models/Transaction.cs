namespace PkoFinTracker.Server.Models;

public class Transaction
{
    public Guid Id { get; set; } // our id
    public string ExternalId { get; set; } // transaction's id from api
    public Guid BankAccountId { get; set; } // our id from BankAccount
    public string Indicator { get; set; }
    public string Currency { get; set; }
    public decimal Amount { get; set; }
    public string Description { get; set; }
    public string Status { get; set; }
    public string? Mcc { get; set; } // merchant code
    public DateTime BookingDate{ get; set; }
    
    public int? CategoryId { get; set; }
    public Category? Category { get; set; }
    
    public BankAccount? BankAccount { get; set; }
}