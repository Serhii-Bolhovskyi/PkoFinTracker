namespace PkoFinTracker.Server.Auth;

public interface IAuthStrategy
{
    Task ApplyAuthAsync(HttpRequestMessage request, string? sessionId = null);
}
