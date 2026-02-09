using Microsoft.EntityFrameworkCore;
using PkoFinTracker.Server.Models;

namespace PkoFinTracker.Server.Data;

public class TransactionContext : DbContext
{
    public TransactionContext(DbContextOptions<TransactionContext> options) : base(options){}
    
    public DbSet<Transaction> Transactions { get; set; }
    public DbSet<Category> Categories { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        var transaction =  modelBuilder.Entity<Transaction>();
        
        transaction.Property(t => t.Amount).HasPrecision(18, 2);
        transaction.HasIndex(t => t.ExternalId).IsUnique();
        
        var category = modelBuilder.Entity<Category>();
        
        category.Property(c => c.Name).IsRequired();
        category.HasIndex(c => c.Name).IsUnique();

        category.HasData(Category.Categories);
    }
}