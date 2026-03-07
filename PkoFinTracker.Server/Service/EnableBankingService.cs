using System.Net.Http.Headers;
using PkoFinTracker.Server.DTOs;

namespace PkoFinTracker.Server.Service;

public class EnableBankingService
{
    private readonly HttpClient _httpClient;
    private readonly EnableBankingJwtGenerator _enableBankingJwtGenerator;
    private readonly IConfiguration _conf;

    public EnableBankingService(HttpClient httpClient, EnableBankingJwtGenerator enableBankingJwtGenerator,  IConfiguration conf)
    {
        _httpClient = httpClient;
        _enableBankingJwtGenerator = enableBankingJwtGenerator; 
        _conf = conf;
    }

    // delete
    private async Task<HttpRequestMessage> CreateRequestAsync(HttpMethod method, string url, string? sessionId = null)
    {
        var token = _enableBankingJwtGenerator.GenerateJwtToken();
        var request = new HttpRequestMessage(method, url);
        
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        request.Headers.Add("X-Session-Id", sessionId);

        return request;
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