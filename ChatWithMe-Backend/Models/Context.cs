using ChatWithMe.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

public class Context : IdentityDbContext<User>
{
    public Context(DbContextOptions<Context> options) : base(options)
    { 
       
    }
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.Entity<User>().Ignore(u => u.AccessFailedCount);
        builder.Entity<User>().Ignore(u => u.LockoutEnabled);
        builder.Entity<User>().Ignore(u => u.LockoutEnd);
        builder.Entity<User>().Ignore(u => u.PhoneNumberConfirmed);
        builder.Entity<User>().Ignore(u => u.TwoFactorEnabled);
    }
public DbSet<User> User { get; set; }
    public DbSet<ChatRoom> ChatRoom { get; set; }
    public DbSet<Message> Message { get; set; }
    public DbSet<Reaction> Reaction { get; set; }
    public DbSet<UserChatRoom> UserChatRoom { get; set; }
}
