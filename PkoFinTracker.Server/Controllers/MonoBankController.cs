using Microsoft.AspNetCore.Mvc;
using PkoFinTracker.Server.DTOs.MonoBankDTOs;
using PkoFinTracker.Server.Models;
using PkoFinTracker.Server.Providers;

namespace PkoFinTracker.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MonoBankController : ControllerBase
{
    private readonly IBankProvider<MonoBankClientInfoDto, MonoBankTransactionResponseDto> _provider;
    
    public MonoBankController(IBankProvider<MonoBankClientInfoDto, MonoBankTransactionResponseDto> provider)
    {
        _provider = provider;
    }


    [HttpGet("client-info")]
    public async Task<IActionResult> GetClientInfo([FromQuery] AccountRequest request)
    {
        var res = await _provider.GetClientInfoAsync(request);
        return Ok(res);
    }

    [HttpGet("personal/statement")]
    public async Task<IActionResult> GetTransactions([FromQuery] AccountRequest accReq,
        [FromQuery] TransactionRequest trReq)
    {
        var res = await _provider.GetTransactionAsync(accReq, trReq);
        return Ok(res);
    }
}