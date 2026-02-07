using System.Text.Json.Serialization;

namespace PkoFinTracker.Server.DTOs;

public class AuthRequestDto
{
    [JsonPropertyName("access")]
    public AccessDto Access { get; set; }
    
    [JsonPropertyName("aspsp")]
    public AspspDto Aspsp { get; set; }
    
    [JsonPropertyName("state")]
    public Guid State { get; set; }
    
    [JsonPropertyName(("redirect_url"))]
    public string RedirectUrl { get; set; }
    
    [JsonPropertyName(("psu_type"))]
    public string PsuType { get; set; }
}

public class AccessDto
{
    [JsonPropertyName("valid_until")]
    public DateTime ValidUntil { get; set; }
}

public class AspspDto
{
    [JsonPropertyName("name")]
    public string Name { get; set; }
    
    [JsonPropertyName("country")]
    public string Country { get; set; }
}