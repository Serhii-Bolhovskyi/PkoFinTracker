using PkoFinTracker.Server.Auth;
using PkoFinTracker.Server.DTOs.MonoBankDTOs;
using PkoFinTracker.Server.Models;

namespace PkoFinTracker.Server.Providers;

public class MonoBankProvider : BaseBankingProvider, IBankProvider<MonoBankClientInfoDto, MonoBankTransactionResponseDto>
{
    public MonoBankProvider(HttpClient httpClient, MonoBankAuthStrategy auth) : base(httpClient, auth){}

    // receive personal bank's data 
    public async Task<MonoBankClientInfoDto?> GetClientInfoAsync(AccountRequest requestParams)
        => await GetAsync<MonoBankClientInfoDto>("https://api.monobank.ua/personal/client-info");

    // receive transaction within concrete dates
    public async Task<MonoBankTransactionResponseDto?> GetTransactionAsync(AccountRequest accReq,
        TransactionRequest trReq)
    {
        var transactionsList = await GetAsync<List<TransactionResponseDto>>(
            $"https://api.monobank.ua/personal/statement/{accReq.AccountId}/{trReq.From}/{trReq.To}");
        
        if (transactionsList == null) 
        {
            return null;
        }
        
        return new MonoBankTransactionResponseDto
        {
            Transactions = transactionsList
        };
    }
}