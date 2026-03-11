using PkoFinTracker.Server.Models;

namespace PkoFinTracker.Server.Providers;

public interface IBankProvider<AccountResponse, TransactionResponse>
{
    Task<AccountResponse?> GetClientInfoAsync(AccountRequest requestParams);
    Task<TransactionResponse?> GetTransactionAsync(AccountRequest requestParams, TransactionRequest request);
}