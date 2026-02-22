using Microsoft.EntityFrameworkCore;
using PkoFinTracker.Server.Models;

namespace PkoFinTracker.Server.Data;

public class DbInitialize
{
    public static void Initialize(TransactionContext context)
    {
        context.Database.Migrate();

        if (context.Transactions.Any() || context.BankAccounts.Any()) return;
        
        var demoAccountId = Guid.Parse("f3bfdf13-cc01-4053-bb61-cfd5b254be19");
        var demoAccount = new BankAccount
        {
            Id = demoAccountId,
            Iban = "FI2112345600000789",
            BankUid = "a3d630f4-b4ed-44c6-b92d-59bad2e882de",
            Name = "Aino Virtanen",
            Currency = "EUR",
            Balance = 950.75m,
            LastUpdated = DateTime.SpecifyKind(new DateTime(2026, 02, 18, 20, 13, 59), DateTimeKind.Utc)
        };
        
        context.BankAccounts.Add(demoAccount);
        var transactions = new List<Transaction>();
        
        // January 2026
        transactions.Add(CreateTx(demoAccountId, "REF-JAN-01", 3200.00m, "CRDT", "Salary", "BOOK", "0000", 2026, 01, 01, 10));
        transactions.Add(CreateTx(demoAccountId, "REF-201", 64.20m, "DBIT", "Lidl", "BOOK", "5411", 2026, 01, 02, 1));
        transactions.Add(CreateTx(demoAccountId, "REF-JAN-03", 1100.00m, "DBIT", "Rent", "BOOK", "4900", 2026, 01, 02, 4));
        transactions.Add(CreateTx(demoAccountId, "REF-JAN-04", 15.50m, "DBIT", "Zabka", "BOOK", "5499", 2026, 01, 03, 1));
        transactions.Add(CreateTx(demoAccountId, "REF-JAN-05", 25.00m, "DBIT", "Bolt", "BOOK", "4121", 2026, 01, 04, 2));
        transactions.Add(CreateTx(demoAccountId, "REF-JAN-06", 45.00m, "DBIT", "McDonalds", "BOOK", "5814", 2026, 01, 05, 3));
        transactions.Add(CreateTx(demoAccountId, "REF-JAN-07", 200.00m, "DBIT", "ATM", "BOOK", "6011", 2026, 01, 06, 8));
        transactions.Add(CreateTx(demoAccountId, "REF-JAN-08", 89.99m, "DBIT", "Zara", "BOOK", "5621", 2026, 01, 07, 7));
        transactions.Add(CreateTx(demoAccountId, "REF-JAN-09", 120.00m, "DBIT", "Super-Pharm", "BOOK", "5912", 2026, 01, 08, 5));
        transactions.Add(CreateTx(demoAccountId, "REF-JAN-10", 34.00m, "DBIT", "Uber", "BOOK", "4121", 2026, 01, 09, 2));
        transactions.Add(CreateTx(demoAccountId, "REF-JAN-11", 40.00m, "DBIT", "Cinema", "BOOK", "7832", 2026, 01, 10, 6));
        transactions.Add(CreateTx(demoAccountId, "REF-JAN-12", 15.00m, "DBIT", "Netflix", "BOOK", "5815", 2026, 01, 11, 6));
        transactions.Add(CreateTx(demoAccountId, "REF-JAN-13", 55.30m, "DBIT", "Lidl", "BOOK", "5411", 2026, 01, 12, 1));
        transactions.Add(CreateTx(demoAccountId, "REF-JAN-14", 10.00m, "DBIT", "Parking", "BOOK", "7523", 2026, 01, 13, 2));
        transactions.Add(CreateTx(demoAccountId, "REF-JAN-15", 450.00m, "CRDT", "Amazon Refund", "BOOK", "0000", 2026, 01, 14, 10));
        transactions.Add(CreateTx(demoAccountId, "REF-JAN-16", 22.00m, "DBIT", "Starbucks", "BOOK", "5812", 2026, 01, 15, 3));
        transactions.Add(CreateTx(demoAccountId, "REF-JAN-17", 130.00m, "DBIT", "Electricity", "BOOK", "4900", 2026, 01, 16, 4));
        transactions.Add(CreateTx(demoAccountId, "REF-JAN-18", 48.00m, "DBIT", "Hebe", "BOOK", "5912", 2026, 01, 17, 5));
        transactions.Add(CreateTx(demoAccountId, "REF-JAN-19", 210.00m, "DBIT", "Biedronka", "BOOK", "5411", 2026, 01, 18, 1));
        transactions.Add(CreateTx(demoAccountId, "REF-JAN-20", 35.00m, "DBIT", "Uber Eats", "BOOK", "5812", 2026, 01, 19, 3));
        transactions.Add(CreateTx(demoAccountId, "REF-JAN-21", 90.00m, "DBIT", "Orlen", "BOOK", "5541", 2026, 01, 20, 2));
        transactions.Add(CreateTx(demoAccountId, "REF-JAN-22", 12.00m, "DBIT", "iCloud", "BOOK", "5815", 2026, 01, 21, 6));
        transactions.Add(CreateTx(demoAccountId, "REF-JAN-23", 300.00m, "DBIT", "Allegro", "BOOK", "5311", 2026, 01, 22, 7));
        transactions.Add(CreateTx(demoAccountId, "REF-JAN-24", 50.00m, "DBIT", "Pharmacy", "BOOK", "5912", 2026, 01, 23, 5));
        transactions.Add(CreateTx(demoAccountId, "REF-JAN-25", 18.50m, "DBIT", "Zabka", "BOOK", "5499", 2026, 01, 24, 1));
        transactions.Add(CreateTx(demoAccountId, "REF-JAN-26", 45.00m, "DBIT", "KFC", "BOOK", "5814", 2026, 01, 25, 3));
        transactions.Add(CreateTx(demoAccountId, "REF-JAN-27", 100.00m, "DBIT", "H&M", "BOOK", "5651", 2026, 01, 26, 7));
        transactions.Add(CreateTx(demoAccountId, "REF-JAN-28", 25.00m, "DBIT", "Taxi", "BOOK", "4121", 2026, 01, 27, 2));
        transactions.Add(CreateTx(demoAccountId, "REF-JAN-29", 70.00m, "DBIT", "Auchan", "BOOK", "5411", 2026, 01, 28, 1));
        transactions.Add(CreateTx(demoAccountId, "REF-JAN-30", 50.00m, "DBIT", "Internet", "BOOK", "4814", 2026, 01, 29, 4));
        
        // February 2026
        transactions.Add(CreateTx(demoAccountId, "REF-FEB-01", 3200.00m, "CRDT", "Salary", "BOOK", "0000", 2026, 02, 01, 10));
        transactions.Add(CreateTx(demoAccountId, "REF-FEB-02", 1100.00m, "DBIT", "Rent", "BOOK", "4900", 2026, 02, 02, 4));
        transactions.Add(CreateTx(demoAccountId, "REF-FEB-03", 55.40m, "DBIT", "Biedronka", "BOOK", "5411", 2026, 02, 03, 1));
        transactions.Add(CreateTx(demoAccountId, "REF-FEB-04", 15.00m, "DBIT", "Uber", "BOOK", "4121", 2026, 02, 04, 2));
        transactions.Add(CreateTx(demoAccountId, "REF-FEB-05", 42.00m, "DBIT", "Pizza Hut", "BOOK", "5812", 2026, 02, 05, 3));
        transactions.Add(CreateTx(demoAccountId, "REF-FEB-06", 15.50m, "DBIT", "Zabka", "PDNG", "5499", 2026, 02, 06, 1)); // PDNG
        transactions.Add(CreateTx(demoAccountId, "REF-FEB-07", 300.00m, "DBIT", "H&M", "BOOK", "5651", 2026, 02, 07, 7));
        transactions.Add(CreateTx(demoAccountId, "REF-FEB-08", 60.00m, "DBIT", "Rossmann", "BOOK", "5912", 2026, 02, 08, 5));
        transactions.Add(CreateTx(demoAccountId, "REF-FEB-09", 12.50m, "DBIT", "iCloud", "BOOK", "5815", 2026, 02, 09, 6));
        transactions.Add(CreateTx(demoAccountId, "REF-FEB-10", 25.00m, "DBIT", "Spotify", "BOOK", "5815", 2026, 02, 10, 6));
        transactions.Add(CreateTx(demoAccountId, "REF-FEB-11", 105.00m, "DBIT", "Lidl", "BOOK", "5411", 2026, 02, 11, 1));
        transactions.Add(CreateTx(demoAccountId, "REF-FEB-12", 40.00m, "DBIT", "Gas Station", "RJCT", "5541", 2026, 02, 12, 2)); // RJCT
        transactions.Add(CreateTx(demoAccountId, "REF-FEB-13", 22.00m, "DBIT", "Cafe Nero", "BOOK", "5812", 2026, 02, 13, 3));
        transactions.Add(CreateTx(demoAccountId, "REF-FEB-14", 500.00m, "CRDT", "Gift", "BOOK", "0000", 2026, 02, 14, 10));
        transactions.Add(CreateTx(demoAccountId, "REF-FEB-15", 85.00m, "DBIT", "Pharmacy", "BOOK", "5912", 2026, 02, 15, 5));
        transactions.Add(CreateTx(demoAccountId, "REF-FEB-16", 120.00m, "DBIT", "Electricity", "BOOK", "4900", 2026, 02, 16, 4));
        transactions.Add(CreateTx(demoAccountId, "REF-FEB-17", 44.20m, "DBIT", "Biedronka", "BOOK", "5411", 2026, 02, 17, 1));
        transactions.Add(CreateTx(demoAccountId, "REF-FEB-18", 30.00m, "DBIT", "Taxi", "BOOK", "4121", 2026, 02, 18, 2));
        transactions.Add(CreateTx(demoAccountId, "REF-FEB-19", 15.00m, "DBIT", "Netflix", "BOOK", "5815", 2026, 02, 19, 6));
        transactions.Add(CreateTx(demoAccountId, "REF-FEB-20", 50.00m, "DBIT", "Dinner Out", "BOOK", "5812", 2026, 02, 20, 3));
        
        context.Transactions.AddRange(transactions);
        context.SaveChanges();
    }
    
    private static Transaction CreateTx(Guid accId, string extId, decimal amount, string ind, string desc, string status, string mcc, int y, int m, int d, int? catId)
    {
        return new Transaction
        {
            Id = Guid.NewGuid(),
            ExternalId = extId,
            BankAccountId = accId,
            Indicator = ind,
            Currency = "EUR",
            Amount = amount,
            Description = desc,
            Status = status, 
            Mcc = mcc,
            BookingDate = DateTime.SpecifyKind(new DateTime(y, m, d, 0, 0, 0), DateTimeKind.Utc),
            CategoryId = catId
        };
    }
}