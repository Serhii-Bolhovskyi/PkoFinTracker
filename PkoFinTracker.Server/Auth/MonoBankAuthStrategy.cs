using System.Net.Http.Headers;

namespace PkoFinTracker.Server.Auth;

public class MonoBankAuthStrategy : IAuthStrategy
{
    private readonly IConfiguration _conf;
    
    public MonoBankAuthStrategy(IConfiguration conf) => _conf = conf;

    public Task ApplyAuthAsync(HttpRequestMessage request,  string? sessionId = null)
    {
        var token = _conf.GetValue<string>("MonoBank:X-Token");

        if (string.IsNullOrEmpty(token))
            throw new InvalidOperationException("MonoBank X-Token is missing from configuration");

        request.Headers.Add("X-Token", token);
        
        return Task.CompletedTask;
    }
}