using System.Text.Json.Serialization;

namespace PkoFinTracker.Server.DTOs;

public class SessionRequestDto
{
    [JsonPropertyName("code")]
    public string Code { get; set; }
}