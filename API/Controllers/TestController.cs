using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
[ApiController]
[Route("api/[controller]")]
public class TestController : ControllerBase
{
    private readonly UserManager<User> _userManager;

    public TestController(UserManager<User> userManager)
    {
        _userManager = userManager;
    }

    [HttpGet("verifyPassword")]
    public async Task<IActionResult> VerifyPassword(string email, string password)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
        {
            return NotFound("User not found.");
        }

        var isPasswordValid = await _userManager.CheckPasswordAsync(user, password);
        if (isPasswordValid)
        {
            return Ok("Password is valid.");
        }
        else
        {
            return Unauthorized("Password is invalid.");
        }
    }
}

}