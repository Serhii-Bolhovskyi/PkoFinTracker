using System.Net.Http.Headers;
using PkoFinTracker.Server.DTOs;

namespace PkoFinTracker.Server.Service;

public class EnableBankingService
{
    private readonly HttpClient _httpClient;
    private readonly EnableBankingAuthService _enableBankingAuthService;

    public EnableBankingService(HttpClient httpClient, EnableBankingAuthService enableBankingAuthService)
    {
        _httpClient = httpClient;
        _enableBankingAuthService = enableBankingAuthService; 
    }

    public async Task<string> GetProvidersAsync()
    {
        var token = _enableBankingAuthService.GenerateJwtToken();
        
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var response = await _httpClient.GetAsync("https://api.enablebanking.com/aspsps?country=PL");
        response.EnsureSuccessStatusCode();
        
        return await response.Content.ReadAsStringAsync();
    }

    public async Task<AuthResponseDto> AuthenticateAsync()
    {
        var token = _enableBankingAuthService.GenerateJwtToken();
        
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var url = "https://api.enablebanking.com/auth";
        
        var requestBody = new AuthRequestDto()
        {
            Access = new AccessDto()
            {
                ValidUntil = DateTime.UtcNow.AddMinutes(30)
            },
            Aspsp = new AspspDto()
            {
                Name = "Mock ASPSP",
                Country = "PL"
            },
            State = new Guid(),
            RedirectUrl = "http://localhost:5173/",
            PsuType = "personal"
        };

        var response = await _httpClient.PostAsJsonAsync(url, requestBody);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<AuthResponseDto>();
    }

    public async Task<SessionResponseDto> CreateSessionAsync(SessionRequestDto request)
    {
        var token = _enableBankingAuthService.GenerateJwtToken();
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var url = "https://api.enablebanking.com/sessions";
        
        var response = await _httpClient.PostAsJsonAsync(url, request);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<SessionResponseDto>();
    }
}