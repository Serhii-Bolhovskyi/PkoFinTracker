namespace PkoFinTracker.Server.Models;

public class Transaction
{
    public Guid Id { get; set; }
    public string ExternalId { get; set; }
    public string AccountId { get; set; }
    public string Indicator { get; set; }
    public string Currency { get; set; }
    public decimal Amount { get; set; }
    public string Description { get; set; }
    public string Status { get; set; }
    public string? Mcc { get; set; } // merchant code
    public DateTime BookingDate{ get; set; }
    
    public int? CategoryId { get; set; }
    public Category? Category { get; set; }
}