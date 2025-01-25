using Microsoft.AspNetCore.Identity;
using ChatWithMe.Models;
using Microsoft.EntityFrameworkCore;
using ChatWithMe.Hubs;
using System.Text.Json.Serialization;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using ChatWithMe.Services;
using Microsoft.Extensions.FileProviders;
using Microsoft.AspNetCore.Http.Features;

namespace ChatWithMe
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowLocalhost3000", builder =>
                {
                    // Add HTTPS origins
                    builder.WithOrigins("http://localhost:3000", "https://localhost:3000",
                                        "http://localhost:3001", "https://localhost:3001")
                           .AllowAnyHeader()
                           .AllowAnyMethod()
                           .AllowCredentials();
                });
            });
            builder.Services.Configure<FormOptions>(options => {
                options.MultipartBodyLengthLimit = 150_000_000; // 150 MB
            });
            builder.WebHost.ConfigureKestrel(options => {
                options.Limits.MaxRequestBodySize = 150_000_000; // 150 MB
            });
            builder.Services.AddSingleton<UserTrackerService>();
            builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
    });// this handles the references cycle and prevent  cycles during serialization.
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddSignalR();

            // Configure Identity Core with custom password constraints
            builder.Services.AddIdentityCore<User>(options =>
            {
                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequiredLength = 6;
                options.Password.RequiredUniqueChars = 0;
            })
            .AddRoles<IdentityRole>() // Add support for roles
            .AddEntityFrameworkStores<Context>()
            .AddApiEndpoints();

            // Configure authentication
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultScheme = IdentityConstants.ApplicationScheme;
            })
            .AddCookie(IdentityConstants.ApplicationScheme, options =>
            {
                options.LoginPath = "/Auth/login";
                options.AccessDeniedPath = "/Auth/accessdenied";
            }).AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = builder.Configuration["Jwt:Issuer"],
                    ValidAudience = builder.Configuration["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
                };
            });

            // Configure database context
            builder.Services.AddDbContext<Context>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("ChatWithMe")));

            var app = builder.Build();
            //creates the uploads dir if not exits u
            var uploadsPath = Path.Combine(app.Environment.ContentRootPath, "uploads");
            if (!Directory.Exists(uploadsPath))
            {
                Directory.CreateDirectory(uploadsPath);
            }

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
              app.UseSwagger();
                app.UseSwaggerUI();
            }
            app.UseStaticFiles(); 
            
            // Serve files from the "uploads" directory in project root
            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(
                    Path.Combine(app.Environment.ContentRootPath, "uploads")),
                RequestPath = "/uploads"
            });

            app.UseRouting();
            app.UseCors("AllowLocalhost3000");
            app.UseAuthentication(); 
            app.UseAuthorization();
            app.MapControllers();
            app.MapHub<ChatHub>("/chatHub");

            // Seed roles
            using (var scope = app.Services.CreateScope())
            {
                var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
                var roles = new[] { "Admin", "User" }; // Define your roles here

                foreach (var role in roles)
                {
                    if (!await roleManager.RoleExistsAsync(role))
                    {
                        await roleManager.CreateAsync(new IdentityRole(role));
                    }
                }
            }

            app.Run();
        }
    }
}