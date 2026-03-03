namespace PkoFinTracker.Server.Auth;

public interface IAuthStrategy
{
    Task ApplyAuthAsync(HttpRequestMessage request, AuthContext? context = null);
}

public class AuthContext()
{
    public string? SessionId  { get; set; }
}