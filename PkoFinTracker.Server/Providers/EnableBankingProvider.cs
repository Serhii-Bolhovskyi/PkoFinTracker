using PkoFinTracker.Server.Auth;
using PkoFinTracker.Server.DTOs;
using PkoFinTracker.Server.Models;
using PkoFinTracker.Server.Service;

namespace PkoFinTracker.Server.Providers;

public class EnableBankingProvider : BaseBankingProvider, IBankProvider<AccountDetailsResponseDto, TransactionsResponseDto>
{
    public EnableBankingProvider(HttpClient httpClient, EnableBankingAuthStrategy auth) : base(httpClient, auth){}
    
    public async Task<AccountDetailsResponseDto?> GetClientInfoAsync(AccountRequest requestParams) 
        => await GetAsync<AccountDetailsResponseDto>($"https://api.enablebanking.com/accounts/{requestParams.AccountId}/details", requestParams.SessionId);
    
    public async Task<TransactionsResponseDto?> GetTransactionAsync(AccountRequest accountRequest, TransactionRequest transactionRequest)
        => await GetAsync<TransactionsResponseDto>($"https://api.enablebanking.com/accounts/{accountRequest.AccountId}/transactions?date_from={transactionRequest.From}", accountRequest.SessionId); 
}