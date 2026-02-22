using PkoFinTracker.Server.Models;

namespace PkoFinTracker.Server;

public static class TransactionExtensions
{
    public static IQueryable<Transaction> FilterByDate(this IQueryable<Transaction> query, DateTime? from, DateTime? to)
    {
        if (from.HasValue)
        {
            from = DateTime.SpecifyKind(from.Value, DateTimeKind.Utc);
            query = query.Where(t => t.BookingDate >= from.Value.Date);
        }

        if (to.HasValue)
        {
            to = DateTime.SpecifyKind(to.Value, DateTimeKind.Utc);
            query = query.Where(t => t.BookingDate <= to.Value.Date);
        }
        return query;
    }

    public static IQueryable<Transaction> FilterByDescription(this IQueryable<Transaction> query, string? description)
    {
        if (description != null)
        {
            query = query.Where(t => t.Description.ToLower().Contains(description.ToLower()));
        }
        return query;
    }
    
    public static IQueryable<Transaction> FilterByCategoryIds(this IQueryable<Transaction> query, List<int>? categoryIds)
    {
        if (categoryIds != null && categoryIds.Any())
        {
            query = query.Where(t => categoryIds.Contains(t.CategoryId ?? 0));
        }
        return query;
    }
    
    public static IQueryable<Transaction> FilterByIndicator(this IQueryable<Transaction> query, string? indicator)
    {
        if (!string.IsNullOrEmpty(indicator))
        {
            query = query.Where(t => t.Indicator.ToLower().Contains(indicator.ToLower()));
        }
        return query;
    }
    
    public static IQueryable<Transaction> FilterByAmount(this IQueryable<Transaction> query, decimal? minAmount, decimal? maxAmount)
    {
        if(minAmount.HasValue)
            query = query.Where(t => t.Amount >= minAmount.Value);
        if(maxAmount.HasValue)
            query = query.Where(t => t.Amount <= maxAmount.Value);
        return query;
    }
    
    public static IQueryable<Transaction> FilterByStatus(this IQueryable<Transaction> query, string? status)
    {
        if (!string.IsNullOrEmpty(status))
        {
            query = query.Where(t => t.Status.ToLower().Contains(status.ToLower()));
        }
        return query;
    }
}