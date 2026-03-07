using PkoFinTracker.Server.Auth;
using PkoFinTracker.Server.DTOs.MonoBankDTOs;
using PkoFinTracker.Server.Models;

namespace PkoFinTracker.Server.Providers;

public class MonoBankProvider : BaseBankingProvider, IBankProvider<MonoBankClientInfoDto>
{
    public MonoBankProvider(HttpClient httpClient, MonoBankAuthStrategy auth) : base(httpClient, auth){}

    public async Task<MonoBankClientInfoDto?> GetClientInfoAsync(AccountRequest requestParams)
        => await GetAsync<MonoBankClientInfoDto>("https://api.monobank.ua/personal/client-info");
}