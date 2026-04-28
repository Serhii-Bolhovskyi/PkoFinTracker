using PkoFinTracker.Server.Auth;

namespace PkoFinTracker.Server.Providers;

public abstract class BaseBankingProvider
{
    // send req and receive res from resourse
    protected readonly HttpClient _httpClient;
    protected readonly IAuthStrategy _authStrategy;

    protected BaseBankingProvider(HttpClient httpClient, IAuthStrategy authStrategy)
    {
        _httpClient = httpClient;
        _authStrategy = authStrategy;
    }

    protected async Task<T?> GetAsync<T>(string url, string? sessionId = null)
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, url);
        await _authStrategy.ApplyAuthAsync(request, sessionId);

        var response = await _httpClient.SendAsync(request);
        
        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync();
            throw new HttpRequestException($"API error ({response.StatusCode}): {error}");
        }
        return await response.Content.ReadFromJsonAsync<T>();
    }
}