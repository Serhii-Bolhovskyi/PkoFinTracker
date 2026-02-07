using System.Text.Json.Serialization;

namespace PkoFinTracker.Server.DTOs;

public class AuthResponseDto
{
    [JsonPropertyName("url")]
    public string Url { get; set; }
    
    [JsonPropertyName("authorization_id")]
    public string AuthorizationId { get; set; }
    
    [JsonPropertyName("psu_id_hash")]
    public string PsuIdHash { get; set; }
}