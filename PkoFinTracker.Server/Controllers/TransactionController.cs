using Microsoft.AspNetCore.Mvc;
using PkoFinTracker.Server.Service;

namespace PkoFinTracker.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransactionController : ControllerBase
{
    private readonly TransactionService _transactionService;
    public TransactionController(TransactionService transactionService)
    {
        _transactionService = transactionService;
    }

    [HttpGet]
    public async Task<IActionResult> GetTransactions([FromQuery] int? limit)
    {
        var res = await _transactionService.GetAllTransactionAsync(limit);
        return Ok(res);
    }
}