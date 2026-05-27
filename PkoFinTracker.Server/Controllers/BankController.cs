using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PkoFinTracker.Server.Data;
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
    private readonly TransactionContext _context;

    public BankController(EnableBankingService enableBankingService, TransactionService transactionService, AccountService accountService, TransactionContext context)
    {
        _enableBankingService = enableBankingService;
        _transactionService = transactionService;
        _accountService = accountService;
        _context = context;
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
        var res = await _enableBankingService.GetAccountDetailsAsync(accountId, sessionId);
        return Ok(res);
    }
    
    [HttpGet("accounts/{accountId}/balances")]
    public async Task<IActionResult> GetBalances(string accountId, [FromQuery] string sessionId)
    {
        var res = await _enableBankingService.GetBalancesAsync(accountId, sessionId);
        return Ok(res);
    }

    [HttpGet("accounts/{iban}/transactions")]
    public async Task<IActionResult> GetTransactions(string iban, [FromQuery] string sessionId)
    {
        var account = await _context.BankAccounts.FirstOrDefaultAsync(a => a.Iban == iban);
        if(account == null) return NotFound("Account not found");
        
        var res = await _enableBankingService.GetTransactionsAsync(account.BankUid, sessionId);

        if (res?.Transactions != null && res.Transactions.Any())
        {
            await _transactionService.SyncTransactionsAsync(res.Transactions, iban);
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
            // get details(contains iban)
            var accountDetails = await _enableBankingService.GetAccountDetailsAsync(account.Uid, session.SessionId);
            
            // get balance
            var balances = await _enableBankingService.GetBalancesAsync(account.Uid, session.SessionId);
            
            // save/upd account in db
            await _accountService.SyncAccountAsync(accountDetails, balances);
            
            // get transactions
            var res = await _enableBankingService.GetTransactionsAsync(account.Uid,
                session.SessionId);
            
            if (res?.Transactions != null)
            {
                await _transactionService.SyncTransactionsAsync(res.Transactions, accountDetails.AccountId.Iban);
            }
        }
        return Ok(session);
    }
}