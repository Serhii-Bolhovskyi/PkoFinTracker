namespace PkoFinTracker.Server.DTOs;

public class TransactionDisplayDto
{
    public Guid Id { get; set; }
    public string Currency { get; set; }
    public decimal Amount { get; set; }
    public string Description { get; set; }
    public DateTime BookingDate{ get; set; }
    public string CategoryName { get; set; }
    public string Indicator { get; set; }
    public string Status { get; set; }
}