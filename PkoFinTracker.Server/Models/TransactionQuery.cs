namespace PkoFinTracker.Server.Models;

public class TransactionQuery
{
    public int? PageNumber { get; set; } = 1;
    public int? PageSize { get; set; } = 10;
    public DateTime? From { get; set; }
    public DateTime? To { get; set; }
    public string? Description { get; set; }
    public List<int>? CategoryIds { get; set; }
    public string? Indicator { get; set; }
    public decimal? MinAmount { get; set; }
    public decimal? MaxAmount { get; set; }
    public string? Status { get; set; }
}