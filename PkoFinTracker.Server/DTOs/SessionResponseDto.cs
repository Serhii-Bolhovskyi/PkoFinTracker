using System.Text.Json.Serialization;

namespace PkoFinTracker.Server.DTOs;

public class SessionResponseDto
{
    [JsonPropertyName("session_id")]
    public string SessionId { get; set; }
    
    [JsonPropertyName("accounts")]
    public List<AccountDto> Accounts { get; set; }
    
    [JsonPropertyName("aspsp")]
    public AspspDto Aspsp { get; set; }
}

public class AccountDto
{
    [JsonPropertyName("name")]
    public string Name { get; set; }
    
    [JsonPropertyName("uid")]
    public string Uid { get; set; }
}