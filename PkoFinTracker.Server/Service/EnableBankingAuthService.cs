using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using Microsoft.IdentityModel.Tokens;

namespace PkoFinTracker.Server.Service;

public class EnableBankingAuthService
{
    private readonly string _applicationId; // id
    private readonly string _keyPath; // pem
    
    public EnableBankingAuthService(IConfiguration conf, IWebHostEnvironment env)
    {
        _applicationId = conf.GetValue<string>("EnableBanking:ApplicationId");
        var keyFileName = conf.GetValue<string>("EnableBanking:KeyPath");
        
        _keyPath = Path.Combine(env.ContentRootPath, keyFileName);
    }

    public string GenerateJwtToken()
    {
        using RSA rsa = RSA.Create();
        rsa.ImportFromPem(File.ReadAllText(_keyPath));

        var signingCredentials = new SigningCredentials(new RsaSecurityKey(rsa), SecurityAlgorithms.RsaSha256)
        {
            CryptoProviderFactory = new CryptoProviderFactory { CacheSignatureProviders = false }
        };
        
        var now = DateTime.UtcNow;
        var unixTimeSeconds = new  DateTimeOffset(now).ToUnixTimeSeconds();

        var jwt = new JwtSecurityToken(
            audience: "api.enablebanking.com",
            issuer: "enablebanking.com",
            claims: new Claim[]
            {
                new Claim(JwtRegisteredClaimNames.Iat, unixTimeSeconds.ToString(), ClaimValueTypes.Integer64),
                new Claim("app", _applicationId)
            },
            expires: now.AddMinutes(30),
            signingCredentials: signingCredentials
        );
        jwt.Header.Add("kid", _applicationId);
        return new JwtSecurityTokenHandler().WriteToken(jwt);
    }
}