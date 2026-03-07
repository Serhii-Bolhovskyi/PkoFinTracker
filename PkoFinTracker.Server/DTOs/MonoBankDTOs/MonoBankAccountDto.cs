using System.Text.Json.Serialization;

namespace PkoFinTracker.Server.DTOs.MonoBankDTOs;

public class MonoBankAccountDto
{
    [JsonPropertyName("id")]
    public string Id { get; set; }
    
    [JsonPropertyName("sendId")]
    public string SendId { get; set; }
    
    [JsonPropertyName("balance")]
    public decimal Balance { get; set; }
    
    [JsonPropertyName("creditLimit")]
    public decimal CreditLimit { get; set; }
    
    [JsonPropertyName("type")]
    public string Type { get; set; }
    
    [JsonPropertyName("currencyCode")]
    public int CurrencyCode { get; set; }
    
    [JsonPropertyName("cashbackType")]
    public string CashbackType { get; set; }
    
    [JsonPropertyName("maskedPan")]
    public List<string> MaskedPan { get; set; }
    
    [JsonPropertyName("iban")]
    public string Iban { get; set; }
}