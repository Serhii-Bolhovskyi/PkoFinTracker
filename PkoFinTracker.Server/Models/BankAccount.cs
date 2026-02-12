namespace PkoFinTracker.Server.Models;

public class BankAccount
{
    public Guid Id { get; set; } // our id in db
    public string Iban { get; set; }
    public string BankUid { get; set; } // id from api
    public string Name { get; set; }
    public string Currency { get; set; }
    public decimal Balance { get; set; }
    public DateTime LastUpdated { get; set; }
    
    public List<Transaction> Transactions { get; set; }
}