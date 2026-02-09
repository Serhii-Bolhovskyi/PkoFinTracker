using Microsoft.EntityFrameworkCore;
using PkoFinTracker.Server.Data;
using PkoFinTracker.Server.DTOs;
using PkoFinTracker.Server.Models;

namespace PkoFinTracker.Server.Service;

public class TransactionService
{
    private readonly TransactionContext _context;
    private readonly EnableBankingService _service;

    public TransactionService(TransactionContext context, EnableBankingService service)
    {
        _context = context;
        _service = service;
    }

    public async Task SyncTransactionsAsync(List<TransactionsDto> transactionsDto, string accountId)
    {
        foreach (var dto in transactionsDto)
        {
            var targetId = dto.TransactionId ?? dto.EntryReference;
            var isTransactionExists = await _context.Transactions.AnyAsync(t => t.ExternalId == targetId);
            if (!isTransactionExists)
            {
                var transaction = new Transaction
                {
                    Id = Guid.NewGuid(),
                    ExternalId = targetId,
                    AccountId = accountId,
                    Indicator = dto.CreditDebitIndicator,
                    Currency = dto.TransactionAmount.Currency,
                    Amount = dto.TransactionAmount.Amount,
                    Description = string.Join(", ", dto.RemittanceInformation),
                    Status = dto.Status,
                    Mcc = dto.MerchantCategoryCode,
                    BookingDate = DateTime.SpecifyKind(dto.BookingDate,  DateTimeKind.Utc),

                    CategoryId = null,
                };
                await _context.Transactions.AddAsync(transaction);
            }
        }
        await _context.SaveChangesAsync();
    }
}