using System.Text.Json.Serialization;

namespace PkoFinTracker.Server.DTOs;

public class BalancesResponseDto
{
    [JsonPropertyName("balances")] public List<BalanceDto> Balances { get; set; } = new();
}

public class BalanceDto
{
    [JsonPropertyName("name")]
    public string Name { get; set; }
    
    [JsonPropertyName("balance_amount")]
    public BalanceAmountDto BalanceAmount { get; set; }
    
    [JsonPropertyName("balance_type")]
    public string BalanceType { get; set; }
    
    [JsonPropertyName("last_change_date_time")]
    public DateTime LastChangeDateTime { get; set; }
    
    [JsonPropertyName("reference_date")]
    public DateOnly ReferenceDate { get; set; }
    
    [JsonPropertyName("last_committed_transaction")]
    public string LastCommittedTransaction { get; set; }
}

public class BalanceAmountDto : TransactionsAmountDto { }