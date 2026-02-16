namespace PkoFinTracker.Server.DTOs;

public class TransactionPaginatedDto
{
    public List<TransactionDisplayDto> Items { get; set; }
    public int TotalCount { get; set; }
    public int PageNumber { get; set; }
    public int TotalPages { get; set; }
}