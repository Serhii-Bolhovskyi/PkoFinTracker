using Microsoft.AspNetCore.Mvc;
using PkoFinTracker.Server.DTOs;
using PkoFinTracker.Server.Service;

namespace PkoFinTracker.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BankController : ControllerBase
{
    private readonly EnableBankingService _enableBankingService;

    public BankController(EnableBankingService enableBankingService)
    {
        _enableBankingService = enableBankingService;
    }
    
    [HttpGet]
    public async Task<IActionResult> GetProviders()
    {
        var res = await _enableBankingService.GetProvidersAsync();
        return Ok(res);
    }

    [HttpPost("auth")]
    public async Task<IActionResult> Authenticate()
    {
        var res = await _enableBankingService.AuthenticateAsync();
        return Ok(res);
    }

    [HttpPost("sessions")]
    public async Task<IActionResult> CreateSession([FromBody] SessionRequestDto request)
    {
        var res = await _enableBankingService.CreateSessionAsync(request);
        return Ok(res);
    }
}