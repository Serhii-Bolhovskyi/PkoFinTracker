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
    public async Task<IActionResult> GetTransactions(
        [FromQuery] int? limit, 
        [FromQuery] int? pageNumber, [FromQuery] int? pageSize,
        [FromQuery]  DateTime? from, [FromQuery] DateTime? to,
        [FromQuery]  string? description,
        [FromQuery]  List<int>? categoryIds,
        [FromQuery]  string? indicator,
        [FromQuery]  decimal? minAmount,
        [FromQuery]  decimal? maxAmount,
        [FromQuery] string? status)
    {
        var res = await _transactionService.GetAllTransactionAsync(
            limit,
            pageNumber, pageSize,
            from, to,
            description,
            categoryIds, 
            indicator,
            minAmount, maxAmount,
            status);
        return Ok(res);
    }

    [HttpGet("categories")]
    public async Task<IActionResult> GetTransaction()
    {
        var res = await _transactionService.GetCategoriesAsync();
        return Ok(res);
    }
}