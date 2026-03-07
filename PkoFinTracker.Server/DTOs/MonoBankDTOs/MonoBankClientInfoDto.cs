using System.Text.Json.Serialization;

namespace PkoFinTracker.Server.DTOs.MonoBankDTOs;

public class MonoBankClientInfoDto
{
    [JsonPropertyName("clientId")]
    public string ClientId { get; set; }
    
    [JsonPropertyName("name")]
    public string Name { get; set; }
    
    [JsonPropertyName("webHookUrl")]
    public string WebHookUrl { get; set; }
    
    [JsonPropertyName("permissions")]
    public string Permissions { get; set; }
    
    [JsonPropertyName("accounts")]
    public List<MonoBankAccountDto> Accounts { get; set; }
}