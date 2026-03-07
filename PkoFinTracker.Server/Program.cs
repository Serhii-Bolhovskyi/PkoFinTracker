using Microsoft.EntityFrameworkCore;
using PkoFinTracker.Server.Auth;
using PkoFinTracker.Server.Data;
using PkoFinTracker.Server.DTOs;
using PkoFinTracker.Server.DTOs.MonoBankDTOs;
using PkoFinTracker.Server.Providers;
using PkoFinTracker.Server.Service;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<TransactionContext>(opt => opt.UseNpgsql(connectionString));

// EnableBanking
builder.Services.AddScoped<EnableBankingAuthStrategy>();
builder.Services.AddScoped<EnableBankingJwtGenerator>();
builder.Services.AddScoped<EnableBankingSessionService>();
builder.Services.AddScoped<IBankProvider<AccountDetailsResponseDto>, EnableBankingProvider>();
builder.Services.AddHttpClient<EnableBankingProvider>();

builder.Services.AddHttpClient<EnableBankingService>();

// MonoBank
builder.Services.AddScoped<MonoBankAuthStrategy>();
builder.Services.AddScoped<IBankProvider<MonoBankClientInfoDto>, MonoBankProvider>();
builder.Services.AddHttpClient<MonoBankProvider>();

builder.Services.AddScoped<TransactionService>();
builder.Services.AddScoped<AccountService>();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        // Отримуємо наш контекст із системи Dependency Injection
        var context = services.GetRequiredService<TransactionContext>();
        
        // Викликаємо наш статичний метод
        DbInitialize.Initialize(context);
        
        Console.WriteLine("Database initialization check completed.");
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while seeding the database.");
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();