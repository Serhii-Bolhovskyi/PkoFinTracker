namespace PkoFinTracker.Server.Models;

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; }

    public static List<Category> Categories { get; } =
    [
        new Category { Id = 1, Name = "Groceries" },
        new Category { Id = 2, Name = "Transport and Cars" },
        new Category { Id = 3, Name = "Restaurants and Cafes" },
        new Category { Id = 4, Name = "Housing and Utilities" },
        new Category { Id = 5, Name = "Health and Beauty" },
        new Category { Id = 6, Name = "Entertainment and Subscriptions" },
        new Category { Id = 7, Name = "Shopping and Clothing" },
        new Category { Id = 8, Name = "Cash" },
        new Category { Id = 9, Name = "Finance" },
        new Category { Id = 10, Name = "Other" },
    ];
}

