using Microsoft.AspNetCore.Mvc;
using PkoFinTracker.Server.Models;
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
    public async Task<IActionResult> GetTransactions([FromQuery] TransactionQuery request)
    {
        var res = await _transactionService.GetAllTransactionAsync(request);
        return Ok(res);
    }

    [HttpGet("categories")]
    public async Task<IActionResult> GetTransaction()
    {
        var res = await _transactionService.GetCategoriesAsync();
        return Ok(res);
    }
}