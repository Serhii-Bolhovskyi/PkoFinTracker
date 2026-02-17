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

    private int GetCategoryId(string mcc)
    {
        if (string.IsNullOrEmpty(mcc)) return 10;

        return mcc switch
        {
            var m when m.StartsWith("54") => 1, // Groceries
            var m when m.StartsWith("41") || m.StartsWith("554") => 2, // Transport
            var m when m.StartsWith("58") && m != "5815" => 3, // Restaurants
            var m when m.StartsWith("49") || m == "4814" => 4, // Housing
            var m when m.StartsWith("80") || m == "5912" || m == "7230" => 5, // Health
            var m when m.StartsWith("78") || m.StartsWith("79") || m == "5815" => 6, // Entertainment
            var m when m.StartsWith("56") || m.StartsWith("53") || m == "5732" => 7, // Shopping
            "6010" or "6011" => 8, // Cash
            var m when m.StartsWith("60") || m == "6300" => 9, // Finance
            _ => 10 // Other
        };
    }

    public async Task SyncTransactionsAsync(List<TransactionsDto> transactionsDto, string iban)
    {
        var account = await _context.BankAccounts.FirstOrDefaultAsync(a => a.Iban == iban);
        if (account == null) throw new Exception("Account not found");
        
        var existingIds = await _context.Transactions
            .Where(t => t.BankAccountId == account.Id)
            .Select(t => t.ExternalId)
            .ToListAsync();
        
        var existingIdsSet = new HashSet<string>(existingIds);
        Console.WriteLine($"balance before: {account.Balance}");
        foreach (var dto in transactionsDto)
        {
            var targetId = dto.TransactionId ?? dto.EntryReference;

            if (!existingIdsSet.Contains(targetId))
            {
                var transaction = new Transaction
                {
                    Id = Guid.NewGuid(),
                    ExternalId = targetId,
                    BankAccountId = account.Id,
                    Indicator = dto.CreditDebitIndicator,
                    Currency = dto.TransactionAmount.Currency,
                    Amount = dto.TransactionAmount.Amount,
                    Description = string.Join(", ", dto.RemittanceInformation),
                    Status = dto.Status,
                    Mcc = dto.MerchantCategoryCode,
                    BookingDate = DateTime.SpecifyKind(dto.BookingDate, DateTimeKind.Utc),

                    CategoryId = GetCategoryId(dto.MerchantCategoryCode), 
                };
                
                await _context.Transactions.AddAsync(transaction);
                
                existingIdsSet.Add(targetId);
                
                if (dto.CreditDebitIndicator == "CRDT")
                {
                    account.Balance += dto.TransactionAmount.Amount;
                }
                else if (dto.CreditDebitIndicator == "DBIT")
                {
                    account.Balance -= Math.Abs(dto.TransactionAmount.Amount);
                }
            }
        }
        Console.WriteLine($"balance after: {account.Balance}");
        await _context.SaveChangesAsync();
    }

    public async Task<TransactionPaginatedDto> GetAllTransactionAsync(
        int? limit = null, 
        int? pageNumber = null, int? pageSize = null, 
        DateTime? from = null,  DateTime? to = null)
    {
        var query = _context.Transactions
            .OrderByDescending(t => t.BookingDate)
            .AsQueryable();

        if (from.HasValue)
        {
            from = DateTime.SpecifyKind(from.Value, DateTimeKind.Utc);
            query = query.Where(t => t.BookingDate >= from.Value);
        }

        if (to.HasValue)
        {
            to = DateTime.SpecifyKind(to.Value, DateTimeKind.Utc);
            query = query.Where(t => t.BookingDate <= to.Value);
        }
        
        var totalCount = await query.CountAsync(); 

        int page = pageNumber ?? 1;
        int size = pageSize ?? 10;
        
        if (limit.HasValue)
        {
            query = query.Take(limit.Value);
        }
        else
        {
            query = query.Skip((page - 1) * size).Take(size);
        }
        
        var items =  await query
            .Select(t => new TransactionDisplayDto
            {
                Id = t.Id,
                Currency = t.Currency,
                Amount = t.Amount,
                Description = t.Description,
                BookingDate = t.BookingDate,
                CategoryName = t.Category != null ? t.Category.Name : "Other",
                Indicator = t.Indicator,
            }).ToListAsync();

        return new TransactionPaginatedDto
        {
            Items = items,
            TotalCount = totalCount,
            PageNumber = page,
            TotalPages = (int)Math.Ceiling((double)totalCount / size)
        };
    }
}