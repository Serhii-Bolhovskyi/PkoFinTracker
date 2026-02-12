namespace PkoFinTracker.Server.DTOs;

public class AccountDisplayDto
{
    public Guid Id { get; set; }
    public string Iban { get; set; }
    public string Name { get; set; }
    public string Currency { get; set; }
    public decimal Balance { get; set; }
}