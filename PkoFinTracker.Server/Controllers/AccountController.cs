using Microsoft.AspNetCore.Mvc;
using PkoFinTracker.Server.Service;

namespace PkoFinTracker.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{
    private readonly AccountService _accountService;
    public AccountController(AccountService accountService)
    {
        _accountService = accountService;
    }
    
    [HttpGet]
    public async Task<IActionResult> GetAllAccounts()
    {
        var res = await _accountService.GetAllAccountsAsync();
        return Ok(res);
    }
}