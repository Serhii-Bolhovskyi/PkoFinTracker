using Microsoft.AspNetCore.Mvc;
using PkoFinTracker.Server.DTOs;
using PkoFinTracker.Server.Models;
using PkoFinTracker.Server.Providers;
using PkoFinTracker.Server.Service;

namespace PkoFinTracker.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EnableBankingController : ControllerBase
{
    private readonly EnableBankingSessionService _sessionService;
    private readonly IBankProvider<AccountDetailsResponseDto> _provider;
    private readonly TransactionService _transactionService;
    private readonly AccountService _accountService;

    public EnableBankingController(EnableBankingSessionService sessionService, IBankProvider<AccountDetailsResponseDto> provider,TransactionService transactionService, AccountService accountService)
    {
        _sessionService = sessionService;
        _provider = provider;
        _transactionService = transactionService;
        _accountService = accountService;
    }
    
    [HttpGet]
    public async Task<IActionResult> GetProviders()
    {
        var res = await _sessionService.GetProvidersAsync();
        return Ok(res);
    }
    
    [HttpGet("accounts/{accountId}/details")]
    public async Task<IActionResult> GetClientInfoAsync([FromQuery] AccountRequest request)
    {
        var res = await _provider.GetClientInfoAsync(request);
        return Ok(res);
    }
    
    // [HttpGet("accounts/{accountId}/balances")]
    // public async Task<IActionResult> GetBalances(string accountId, [FromQuery] string sessionId)
    // {
    //     var res = await _enableBankingService.GetBalancesAsync(accountId, sessionId);
    //     return Ok(res);
    // }

    // [HttpGet("accounts/{accountId}/transactions")]
    // public async Task<IActionResult> GetTransactions(string accountId, [FromQuery] string sessionId)
    // {
    //     var res = await _enableBankingService.GetTransactionsAsync(accountId, sessionId);
    //
    //     if (res?.Transactions != null && res.Transactions.Any())
    //     {
    //         await _transactionService.SyncTransactionsAsync(res.Transactions, accountId);
    //     }
    //     
    //     return Ok(res);
    // }
    
    [HttpPost("auth")]
    public async Task<IActionResult> Authenticate([FromBody] AuthRequestDto? request = null)
    {
        var res = await _sessionService.AuthenticateAsync(request);
        return Ok(res);
    }

    [HttpPost("sessions")]
    public async Task<IActionResult> CreateSession([FromBody] SessionRequestDto request)
    {
        var session = await _sessionService.CreateSessionAsync(request);
        
        // foreach (var account in session.Accounts)
        // {
        //     // get details(contains iban)
        //     var accountDetails = await _sessionService.GetAccountDetailsAsync(account.Uid, session.SessionId);
        //     
        //     // get balance
        //     var balances = await _enableBankingService.GetBalancesAsync(account.Uid, session.SessionId);
        //     
        //     // save/upd account in db
        //     await _accountService.SyncAccountAsync(accountDetails, balances);
        //     
        //     // get transactions
        //     var res = await _enableBankingService.GetTransactionsAsync(account.Uid,
        //         session.SessionId);
        //     
        //     if (res?.Transactions != null)
        //     {
        //         await _transactionService.SyncTransactionsAsync(res.Transactions, accountDetails.AccountId.Iban);
        //     }
        // }
        return Ok(session);
    }
}