using Microsoft.EntityFrameworkCore;
using PkoFinTracker.Server.Data;
using PkoFinTracker.Server.DTOs;
using PkoFinTracker.Server.Models;

namespace PkoFinTracker.Server.Service;

public class AccountService
{
    private readonly TransactionContext _context;

    public AccountService(TransactionContext context)
    {
        _context = context;
    }

    public async Task SyncAccountAsync(AccountDetailsResponseDto detail, BalancesResponseDto balances)
    {
        var existingAccount = await _context.BankAccounts.FirstOrDefaultAsync(a => a.Iban == detail.AccountId.Iban);
        var amount = balances.Balances.FirstOrDefault(b => b.BalanceType == "CLAV")?.BalanceAmount.Amount ?? 0;
        if (existingAccount != null)
        {
            existingAccount.BankUid = detail.Uid;
            existingAccount.Balance = amount;
            existingAccount.LastUpdated = DateTime.UtcNow;
        }
        else
        {
            var newAccount = new BankAccount
            {
                Id = Guid.NewGuid(),
                Iban = detail.AccountId.Iban,
                BankUid = detail.Uid,
                Name = detail.Name,
                Currency = detail.Currency,
                Balance = amount,
                LastUpdated = DateTime.UtcNow
            };
            await _context.BankAccounts.AddAsync(newAccount);
        }
        await _context.SaveChangesAsync();
    }
}