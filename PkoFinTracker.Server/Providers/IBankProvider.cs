using PkoFinTracker.Server.Models;

namespace PkoFinTracker.Server.Providers;

public interface IBankProvider<TResponse>
{
    Task<TResponse?> GetClientInfoAsync(AccountRequest requestParams);
}