using System.Net.Http.Headers;
using PkoFinTracker.Server.Service;

namespace PkoFinTracker.Server.Auth;

public class EnableBankingAuthStrategy : IAuthStrategy
{
    private readonly EnableBankingJwtGenerator _jwtGenerator;
    
    public EnableBankingAuthStrategy(EnableBankingJwtGenerator jwtGenerator) => _jwtGenerator = jwtGenerator;

    public Task ApplyAuthAsync(HttpRequestMessage request,  string? sessionId = null)
    {
        var token = _jwtGenerator.GenerateJwtToken();
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

        if (sessionId != null)
        {
            request.Headers.Add("X-Session-Id", sessionId);
        }
        
        return Task.CompletedTask;
    }
}