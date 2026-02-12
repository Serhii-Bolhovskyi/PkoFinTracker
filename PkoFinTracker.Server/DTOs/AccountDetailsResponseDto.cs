using System.Text.Json.Serialization;

namespace PkoFinTracker.Server.DTOs;

public class AccountDetailsResponseDto
{
    [JsonPropertyName("account_id")] public AccountIdDto AccountId { get; set; } = new();
    
    [JsonPropertyName("name")] 
    public string Name { get; set; }
    
    [JsonPropertyName("currency")]
    public string Currency { get; set; }
    
    [JsonPropertyName("uid")]
    public string Uid { get; set; }
}

public class AccountIdDto
{
    [JsonPropertyName("iban")]
    public string Iban { get; set; }
}