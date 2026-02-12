using Microsoft.AspNetCore.Mvc;
using PkoFinTracker.Server.DTOs;
using PkoFinTracker.Server.Service;

namespace PkoFinTracker.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BankController : ControllerBase
{
    private readonly EnableBankingService _enableBankingService;
    private readonly TransactionService _transactionService;
    private readonly AccountService _accountService;

    public BankController(EnableBankingService enableBankingService, TransactionService transactionService, AccountService accountService)
    {
        _enableBankingService = enableBankingService;
        _transactionService = transactionService;
        _accountService = accountService;
    }
    
    [HttpGet]
    public async Task<IActionResult> GetProviders()
    {
        var res = await _enableBankingService.GetProvidersAsync();
        return Ok(res);
    }
    
    [HttpGet("accounts/{accountId}/details")]
    public async Task<IActionResult> GetAccountDetails(string accountId, [FromQuery] string sessionId)
    {
        var res = await _enableBankingService.GetBalancesAsync(accountId, sessionId);
        return Ok(res);
    }
    
    [HttpGet("accounts/{accountId}/balances")]
    public async Task<IActionResult> GetBalances(string accountId, [FromQuery] string sessionId)
    {
        var res = await _enableBankingService.GetBalancesAsync(accountId, sessionId);
        return Ok(res);
    }

    [HttpGet("accounts/{accountId}/transactions")]
    public async Task<IActionResult> GetTransactions(string accountId, [FromQuery] string sessionId)
    {
        var res = await _enableBankingService.GetTransactionsAsync(accountId, sessionId);

        if (res?.Transactions != null && res.Transactions.Any())
        {
            await _transactionService.SyncTransactionsAsync(res.Transactions, accountId);
        }
        
        return Ok(res);
    }
    
    [HttpPost("auth")]
    public async Task<IActionResult> Authenticate([FromBody] AuthRequestDto? request = null)
    {
        var res = await _enableBankingService.AuthenticateAsync(request);
        return Ok(res);
    }

    [HttpPost("sessions")]
    public async Task<IActionResult> CreateSession([FromBody] SessionRequestDto request)
    {
        var session = await _enableBankingService.CreateSessionAsync(request);
        
        foreach (var account in session.Accounts)
        {
            // get account details based on Account Uid
            var accountDetails = await _enableBankingService.GetAccountDetailsAsync(account.Uid, session.SessionId);
            
            // get info about balances based on Account Uid
            var balances = await _enableBankingService.GetBalancesAsync(account.Uid, session.SessionId);
            
            // get Account from API and save into Db
            await _accountService.SyncAccountAsync(accountDetails, balances);
            
            var res = await _enableBankingService.GetTransactionsAsync(account.Uid,
                session.SessionId);
            if (res?.Transactions != null)
            {
                await _transactionService.SyncTransactionsAsync(res.Transactions, account.Uid);
            }
        }
        return Ok(session);
    }
}