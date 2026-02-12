using Microsoft.EntityFrameworkCore;
using PkoFinTracker.Server.Data;
using PkoFinTracker.Server.Service;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<TransactionContext>(opt => opt.UseNpgsql(connectionString));

builder.Services.AddScoped<EnableBankingAuthService>();
builder.Services.AddHttpClient<EnableBankingService>();
builder.Services.AddScoped<TransactionService>();
builder.Services.AddScoped<AccountService>();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapControllers();

app.Run();