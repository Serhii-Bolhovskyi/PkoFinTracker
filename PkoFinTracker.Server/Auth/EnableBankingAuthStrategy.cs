using System.Net.Http.Headers;
using PkoFinTracker.Server.Service;

namespace PkoFinTracker.Server.Auth;

public class EnableBankingAuthStrategy : IAuthStrategy
{
    private readonly EnableBankingJwtGenerator _jwtGenerator;
    
    public EnableBankingAuthStrategy(EnableBankingJwtGenerator jwtGenerator) => _jwtGenerator = jwtGenerator;

    public Task ApplyAuthAsync(HttpRequestMessage request, AuthContext? context = null)
    {
        var token = _jwtGenerator.GenerateJwtToken();
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

        if (context?.SessionId != null)
        {
            request.Headers.Add("X-Session-Id", context.SessionId);
        }
        
        return Task.CompletedTask;
    }
}