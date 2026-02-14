using System.Net.Http.Headers;
using PkoFinTracker.Server.DTOs;

namespace PkoFinTracker.Server.Service;

public class EnableBankingService
{
    private readonly HttpClient _httpClient;
    private readonly EnableBankingAuthService _enableBankingAuthService;
    private readonly IConfiguration _conf;

    public EnableBankingService(HttpClient httpClient, EnableBankingAuthService enableBankingAuthService,  IConfiguration conf)
    {
        _httpClient = httpClient;
        _enableBankingAuthService = enableBankingAuthService; 
        _conf = conf;
    }

    private async Task<HttpRequestMessage> CreateRequestAsync(HttpMethod method, string url, string? sessionId = null)
    {
        var token = _enableBankingAuthService.GenerateJwtToken();
        var request = new HttpRequestMessage(method, url);
        
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        request.Headers.Add("X-Session-Id", sessionId);

        return request;
    }

    public async Task<string> GetProvidersAsync()
    {
        var url = "https://api.enablebanking.com/aspsps?country=PL";
        
        using var request = await CreateRequestAsync(HttpMethod.Get, url);

        using var response = await _httpClient.SendAsync(request);

        if (!response.IsSuccessStatusCode)
        {
            var error =  await response.Content.ReadAsStringAsync();
            throw new HttpRequestException($"APIs error ({response.StatusCode}): {error}");
        }
        
        return await response.Content.ReadAsStringAsync();
    }

    public async Task<AuthResponseDto?> AuthenticateAsync(AuthRequestDto? requestBody = null)
    {
        if (requestBody == null)
        {
            requestBody = new AuthRequestDto()
            {
                Access = new AccessDto()
                {
                    ValidUntil = DateTime.UtcNow.AddDays(_conf.GetValue<int>("EnableBanking:ConsentDays", 30)).ToString("yyyy-MM-ddTHH:mm:ssZ")
                },
                Aspsp = new AspspDto()
                {
                    Name = _conf.GetValue<string>("EnableBanking:DefaultAspspName"),
                    Country = _conf.GetValue<string>("EnableBanking:DefaultCountry"),
                },
                State = Guid.NewGuid().ToString(),
                RedirectUrl = _conf.GetValue<string>("EnableBanking:DefaultRedirectUrl"),
                PsuType = "personal"
            };
        }
        
        using var request = await CreateRequestAsync(HttpMethod.Post, "https://api.enablebanking.com/auth");

        request.Content = JsonContent.Create(requestBody);
        
        using var response = await _httpClient.SendAsync(request);
        
        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync();
            throw new HttpRequestException($"APIs auth error ({response.StatusCode}): {error}");
        }
        
        Console.WriteLine($"DEBUG: Bank Name from config: {requestBody.Aspsp.Name}");
        return await response.Content.ReadFromJsonAsync<AuthResponseDto>();
    }

    public async Task<SessionResponseDto?> CreateSessionAsync(SessionRequestDto requestBody)
    {
        using var request = await CreateRequestAsync(HttpMethod.Post, "https://api.enablebanking.com/sessions");
        
        request.Content = JsonContent.Create(requestBody);
        
        var response = await _httpClient.SendAsync(request);

        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync();
            throw new HttpRequestException($"APIs session error ({response.StatusCode}): {error}");
        }
        
        return await response.Content.ReadFromJsonAsync<SessionResponseDto>();
    }
    
    public async Task<AccountDetailsResponseDto?> GetAccountDetailsAsync(string accountId, string sessionId)
    {
        using var request = await CreateRequestAsync(HttpMethod.Get,
            $"https://api.enablebanking.com/accounts/{accountId}/details", sessionId);

        var response = await _httpClient.SendAsync(request);

        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync();
            throw new HttpRequestException($"APIs AccountDetails error ({response.StatusCode}): {error}");
        }
        return await response.Content.ReadFromJsonAsync<AccountDetailsResponseDto>();
    }
    
    public async Task<BalancesResponseDto?> GetBalancesAsync(string accountId, string sessionId)
    {
        using var request = await CreateRequestAsync(HttpMethod.Get,
            $"https://api.enablebanking.com/accounts/{accountId}/balances", sessionId);

        var response = await _httpClient.SendAsync(request);

        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync();
            throw new HttpRequestException($"APIs GetBalances error ({response.StatusCode}): {error}");
        }
        return await response.Content.ReadFromJsonAsync<BalancesResponseDto>();
    }

    public async Task<TransactionsResponseDto?> GetTransactionsAsync(string accountId, string sessionId)
    {
        using var request = await CreateRequestAsync(HttpMethod.Get,
            $"https://api.enablebanking.com/accounts/{accountId}/transactions?date_from=2026-01-01", sessionId);

        var response = await _httpClient.SendAsync(request);

        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync();
            throw new HttpRequestException($"APIs GetTransaction error ({response.StatusCode}): {error}");
        }
        
        return await response.Content.ReadFromJsonAsync<TransactionsResponseDto>();
    }
    
}