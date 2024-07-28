using System.Text;
using API.Data;
using API.Entities;
using API.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Azure;
using Azure.AI.OpenAI;
using Azure.Search.Documents;
using Azure.Core;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Configure logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();
builder.Logging.AddFilter((category, level) => level >= LogLevel.Information);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please insert JWT with Bearer into field",
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        BearerFormat = "JWT",
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] { }
        }
    });
});

builder.Services.AddDbContext<NotesAppContext>(opt => 
{
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddCors();
builder.Services.AddIdentityCore<User>(options => 
{
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = true;
    options.User.RequireUniqueEmail = true;
})
    .AddRoles<IdentityRole>()
    .AddSignInManager<SignInManager<User>>()
    .AddEntityFrameworkStores<NotesAppContext>()
    .AddDefaultTokenProviders();

var tokenKey = builder.Configuration["JWTSettings:TokenKey"];

if (string.IsNullOrEmpty(tokenKey))
{
    throw new ArgumentNullException(nameof(tokenKey), "TokenKey configuration is missing or empty.");
}
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultSignInScheme = IdentityConstants.ExternalScheme;  
})
.AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.RequireHttpsMetadata = false;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey)),
        ValidateIssuer = false,
        ValidateAudience = false
    };
})
.AddGoogle(options =>
{
    options.ClientId = builder.Configuration["Authentication:Google:ClientId"]!;
    options.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"]!;
    options.Scope.Add("profile");
    options.SignInScheme = IdentityConstants.ExternalScheme;
})
.AddMicrosoftAccount(microsoftOptions =>
{
    microsoftOptions.ClientId = builder.Configuration["Authentication:Microsoft:ClientId"]!;
    microsoftOptions.ClientSecret = builder.Configuration["Authentication:Microsoft:ClientSecret"]!;
    microsoftOptions.SignInScheme = IdentityConstants.ExternalScheme;
})
.AddCookie(IdentityConstants.ApplicationScheme, options =>
{
    options.LoginPath = "/Account/Login";
})
.AddCookie(IdentityConstants.ExternalScheme, options =>
{
    options.LoginPath = "/Account/ExternalLogin";
});

// Configure cookie policy
builder.Services.AddAntiforgery(options => options.Cookie.SameSite = SameSiteMode.None);

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("RequireAuthenticatedUser", policy => policy.RequireAuthenticatedUser());
});

// Read configuration file
var configuration = builder.Configuration;
string endpoint = configuration["AzureOpenAI:Endpoint"] ?? throw new ArgumentNullException(nameof(endpoint), "AzureOpenAI:Endpoint configuration is missing or empty.");
string key = configuration["AzureOpenAI:Key"] ?? throw new ArgumentNullException(nameof(key), "AzureOpenAI:Key configuration is missing or empty.");
string visionEndpoint = configuration["AzureComputerVision:Endpoint"] ?? throw new ArgumentNullException(nameof(visionEndpoint), "AzureComputerVision:Endpoint configuration is missing or empty.");
string visionApiKey = configuration["AzureComputerVision:ApiKey"] ?? throw new ArgumentNullException(nameof(visionApiKey), "AzureComputerVision:ApiKey configuration is missing or empty.");

// Inject OpenAI services
builder.Services.AddSingleton<IConfiguration>(configuration);
builder.Services.AddSingleton<ISearchService, AzureSearchService>();
builder.Services.AddSingleton<IComputerVisionService>(sp =>
{
    var httpClient = sp.GetRequiredService<HttpClient>();
    return new AzureComputerVisionService(httpClient, visionEndpoint, visionApiKey);
});
builder.Services.AddHttpClient(); // 添加 HttpClient 配置
builder.Services.AddSingleton<SearchClient>(sp =>
{
    var config = sp.GetRequiredService<IConfiguration>();
    var searchEndpoint = new Uri(config["AzureSearch:Endpoint"]);
    var searchApiKey = new AzureKeyCredential(config["AzureSearch:ApiKey"]);
    return new SearchClient(searchEndpoint, "indexName", searchApiKey); // 请替换 "indexName" 为实际的索引名称
});
builder.Services.AddSingleton<OpenAIClient>(sp =>
{
    return new OpenAIClient(new Uri(endpoint), new AzureKeyCredential(key));
});
builder.Services.AddTransient<ReadRetrieveReadChatService>();
builder.Services.AddScoped<TokenService>();
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors(opt => 
{
    opt.AllowAnyHeader()
       .AllowAnyMethod()
       .AllowCredentials()  
       .WithOrigins("http://localhost:3000");
});
app.UseAuthentication();
app.UseAuthorization();

app.UseAntiforgery();
app.MapControllers();

var scope = app.Services.CreateScope();
var context = scope.ServiceProvider.GetRequiredService<NotesAppContext>();
var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
try
{
    await context.Database.MigrateAsync();
    await DbInitializer.Initialize(context, userManager, roleManager);
}
catch (Exception ex)
{
    logger.LogError(ex, "An error occurred during migration");
}

app.Run();
