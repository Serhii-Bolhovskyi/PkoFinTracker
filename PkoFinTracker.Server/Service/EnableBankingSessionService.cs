using PkoFinTracker.Server.Auth;
using PkoFinTracker.Server.DTOs;

namespace PkoFinTracker.Server.Service;

public class EnableBankingSessionService
{
    private readonly HttpClient _http;
    private readonly IAuthStrategy _auth;
    private readonly IConfiguration _conf;
    
    public EnableBankingSessionService(HttpClient http, IAuthStrategy auth, IConfiguration conf)
    {
        _http = http;
        _auth = auth;
        _conf = conf;
    }

    public async Task<HttpRequestMessage> BuildRequestAsync(HttpMethod method, string url, AuthContext? context = null)
    {
        var request = new HttpRequestMessage(method, url);
        await _auth.ApplyAuthAsync(request, context);
        
        return request;
    }
    
    public async Task<string> GetProvidersAsync()
    {
        var url = "https://api.enablebanking.com/aspsps?country=PL";
        
        using var request = await BuildRequestAsync(HttpMethod.Get, url);

        using var response = await _http.SendAsync(request);

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
        
        using var request = await BuildRequestAsync(HttpMethod.Post, "https://api.enablebanking.com/auth");

        request.Content = JsonContent.Create(requestBody);
        
        using var response = await _http.SendAsync(request);
        
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
        using var request = await BuildRequestAsync(HttpMethod.Post, "https://api.enablebanking.com/sessions");
        
        request.Content = JsonContent.Create(requestBody);
        
        var response = await _http.SendAsync(request);

        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync();
            throw new HttpRequestException($"APIs session error ({response.StatusCode}): {error}");
        }
        
        return await response.Content.ReadFromJsonAsync<SessionResponseDto>();
    }
}