using System.Text.Json.Serialization;

namespace PkoFinTracker.Server.DTOs;

public class TransactionsResponseDto
{
    [JsonPropertyName("transactions")]
    public List<TransactionsDto> Transactions { get; set; }
}

public class TransactionsDto
{
    [JsonPropertyName("transaction_id")]
    public string TransactionId { get; set; }
    
    [JsonPropertyName("entry_reference")]
    public string EntryReference { get; set; }
    
    [JsonPropertyName("merchant_category_code")]
    public string MerchantCategoryCode { get; set; }
    
    [JsonPropertyName("transaction_amount")]
    public TransactionsAmountDto  TransactionAmount { get; set; }
    
    [JsonPropertyName("status")]
    public string Status { get; set; }
    
    [JsonPropertyName("booking_date")]
    public DateTime BookingDate { get; set; }
    
    [JsonPropertyName("credit_debit_indicator")]
    public string CreditDebitIndicator { get; set; }
    
    [JsonPropertyName("remittance_information")]
    public List<string> RemittanceInformation { get; set; }
}

public class TransactionsAmountDto
{
    [JsonPropertyName("currency")]
    public string Currency { get; set; }
    
    [JsonPropertyName("amount")]
    [JsonNumberHandling(JsonNumberHandling.AllowReadingFromString)]
    public decimal Amount { get; set; }
}