using PkoFinTracker.Server.Auth;

namespace PkoFinTracker.Server.Models;

public class AccountRequest
{
    public string? AccountId {get; set; }
    public string? SessionId {get; set; }
}