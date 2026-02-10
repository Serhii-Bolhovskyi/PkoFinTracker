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

    public BankController(EnableBankingService enableBankingService, TransactionService transactionService)
    {
        _enableBankingService = enableBankingService;
        _transactionService = transactionService;
    }
    
    [HttpGet]
    public async Task<IActionResult> GetProviders()
    {
        var res = await _enableBankingService.GetProvidersAsync();
        return Ok(res);
    }

    [HttpGet("accounts/{account_id}/transactions")]
    public async Task<IActionResult> GetTransactions(string account_id, [FromQuery] string sessionId)
    {
        var res = await _enableBankingService.GetTransactionsAsync(account_id, sessionId);

        if (res?.Transactions != null && res.Transactions.Any())
        {
            await _transactionService.SyncTransactionsAsync(res.Transactions, account_id);
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
            var res = await _enableBankingService.GetTransactionsAsync(account.Uid,
                session.SessionId);
            if (res?.Transactions != null)
            {
                await _transactionService.SyncTransactionsAsync(res.Transactions, account.Uid);
            }
        }
        
        return Ok();
    }
}