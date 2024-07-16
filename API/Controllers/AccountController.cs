using API.DTOs;
using API.Entities;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly TokenService _tokenService;
    private readonly ILogger<AccountController> _logger;

    public AccountController(UserManager<User> userManager, SignInManager<User> signInManager, TokenService tokenService, ILogger<AccountController> logger)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _tokenService = tokenService;
        _logger = logger;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
    {
        if (string.IsNullOrEmpty(registerDto.Password)) return BadRequest("Password is required.");
        var user = new User { UserName = registerDto.Email, Email = registerDto.Email, AccountType = "email" };
        var result = await _userManager.CreateAsync(user, registerDto.Password);

        if (!result.Succeeded) return BadRequest(result.Errors);
        await _userManager.AddToRoleAsync(user, "Member");

        return Ok(new { result = "Registration successful" });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        // var result = await _signInManager.PasswordSignInAsync(loginDto.Email, loginDto.Password, loginDto.RememberMe, false);

        // if (!result.Succeeded) {
        //     _logger.LogWarning("Invalid login attempt for user {email}.", loginDto.Email);
        //     return Unauthorized();
        // }

        var user = await _userManager.FindByEmailAsync(loginDto.Email);

        if (user == null)
        {
            return Unauthorized("Invalid login attempt.");
        }
        return Ok(new UserDto
        {
            Id = user.Id,
            UserName = user.UserName ?? string.Empty,
            Email = user.Email ?? string.Empty,
            AccountType = user.AccountType,
            AvatarUrl = user.AvatarUrl,
            Roles = (List<string>)await _userManager.GetRolesAsync(user),
            Token = await _tokenService.GenerateToken(user)
        });
    }

    [HttpGet("external-login")]
    public IActionResult ExternalLogin(string provider, string? returnUrl = "")
    {
        var redirectUrl = Url.Action(nameof(ExternalLoginCallback), "Account", new { Return = returnUrl });
        var properties = _signInManager.ConfigureExternalAuthenticationProperties(provider, redirectUrl);
        properties.AllowRefresh = true;
        return Challenge(properties, provider);
    }

    [HttpGet("external-login-callback")]
    public async Task<IActionResult> ExternalLoginCallback(string returnUrl = "", string remoteError = "")
    {
       if (!string.IsNullOrEmpty(remoteError))
    {
        _logger.LogWarning($"Error from external provider: {remoteError}");
        return BadRequest(new ErrorResponse { Error = "External authentication error", Details = remoteError });
    }

    var info = await _signInManager.GetExternalLoginInfoAsync();
    _logger.LogInformation($"External login info: {info}");
    if (info == null)
    {
        _logger.LogWarning("External login info is null");
        return BadRequest(new ErrorResponse { Error = "External login info not available" });
    }

    var signInResult = await _signInManager.ExternalLoginSignInAsync(info.LoginProvider, info.ProviderKey, isPersistent: false, bypassTwoFactor: true);
    _logger.LogInformation($"Sign in result: {signInResult}");
    if (signInResult.Succeeded)
    { 
        _logger.LogInformation($"User logged in with {info.LoginProvider} provider.");
        return await GenerateAuthenticationResponse(info, returnUrl);
    }

    var userEmail = info.Principal.FindFirstValue(ClaimTypes.Email);
    _logger.LogInformation($"User email: {userEmail}");
    if(string.IsNullOrEmpty(userEmail))
    {
        _logger.LogWarning("Unable to retrieve email from external login provider");
        return BadRequest(new ErrorResponse { Error = "Email not found from external login provider" });
    }

    var user = await _userManager.FindByEmailAsync(userEmail);
    _logger.LogInformation($"User存在吗?: {user}");
    if(user == null)
    {
        user = new User
        {
            UserName = userEmail,
            Email = userEmail,
            AccountType = info.LoginProvider
        };
        var result = await _userManager.CreateAsync(user);
        if (result.Succeeded)
        {
            await _userManager.AddToRoleAsync(user, "Member");
            var addLoginResult = await _userManager.AddLoginAsync(user, info); // Associate external login info with the user
            if (!addLoginResult.Succeeded)
            {
                _logger.LogError($"Error adding external login info: {string.Join(", ", addLoginResult.Errors.Select(e => e.Description))}");
                return BadRequest(new ErrorResponse { Error = "Error adding external login info", Details = string.Join(", ", addLoginResult.Errors.Select(e => e.Description)) });
            }
            _logger.LogInformation($"Created new user account with {info.LoginProvider} provider.");
        }
        else
        {
            _logger.LogError($"Error creating user: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            return BadRequest(new ErrorResponse { Error = "Error creating user", Details = string.Join(", ", result.Errors.Select(e => e.Description)) });
        }
    }
    else
    {
        // Ensure that external login info is associated with the existing user if not already done
        var addLoginResult = await _userManager.AddLoginAsync(user, info);
        if (!addLoginResult.Succeeded)
        {
            _logger.LogError($"Error adding external login info: {string.Join(", ", addLoginResult.Errors.Select(e => e.Description))}");
            return BadRequest(new ErrorResponse { Error = "Error adding external login info", Details = string.Join(", ", addLoginResult.Errors.Select(e => e.Description)) });
        }
    }
    await _signInManager.SignInAsync(user, isPersistent: false);
    return await GenerateAuthenticationResponse(info, returnUrl);
    }

    [Authorize]
    [HttpGet("currentUser")]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
        if (User.Identity?.Name == null) return Unauthorized();
        var user = await _userManager.FindByNameAsync(User.Identity.Name);

        if(user == null) return Unauthorized("Invalid login attempt.");

        return new UserDto
        {
            Id = user.Id,
            UserName = user.UserName ?? string.Empty,
            Email = user.Email ?? string.Empty,
            AccountType = user.AccountType,
            AvatarUrl = user.AvatarUrl,
            Roles = (List<string>)await _userManager.GetRolesAsync(user),
            Token = await _tokenService.GenerateToken(user)
        };
    }
private async Task<IActionResult> GenerateAuthenticationResponse(ExternalLoginInfo info, string returnUrl)
{
    _logger.LogInformation("Generating authentication response.");
    _logger.LogInformation($"Login Provider: {info.LoginProvider}");
    _logger.LogInformation($"Provider Key: {info.ProviderKey}");
    var user = await _userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey);
    _logger.LogInformation($"User in GenerateAuthenticationResponse: {user}");
    if (user == null)
    {
        return Redirect($"http://localhost:3000/login-callback?error=User not found");
    }

    var token = await _tokenService.GenerateToken(user);
    var roles = await _userManager.GetRolesAsync(user);

    // Assuming the frontend handles URL parameters to receive user data and token
    var redirectUrl = $"http://localhost:3000/inbox?token={token}";

    return Redirect(redirectUrl);
}
}
public class ErrorResponse
{
    public required string Error { get; set; }
    public string? Details { get; set; }
}