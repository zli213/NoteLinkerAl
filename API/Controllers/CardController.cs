using API.Data;
using API.Entities;
using Azure.AI.OpenAI;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Shared.Models;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CardsController : ControllerBase
    {
        private readonly NotesAppContext _context;
        private readonly ILogger<AccountController> _logger;
        private readonly OpenAIClient _client;
        private readonly IConfiguration _config;

        public CardsController(NotesAppContext context, ILogger<AccountController> logger, OpenAIClient client, IConfiguration config)
        {
            _context = context;
            _logger = logger;
            _client = client;
            _config = config;
        }

        // GET: api/Cards
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Card>>> GetCards()
        {
            return await _context.Cards.Include(c => c.User).ToListAsync();
        }

        // GET: api/Cards/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Card>> GetCard(int id)
        {
            var card = await _context.Cards.Include(c => c.User)
                                           .FirstOrDefaultAsync(c => c.CardId == id);

            if (card == null)
            {
                return NotFound();
            }

            return card;
        }

        // PUT: api/Cards/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCard(int id, Card card)
        {
            if (id != card.CardId)
            {
                return BadRequest();
            }

            _context.Entry(card).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CardExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Cards
        [HttpPost]
        public async Task<ActionResult<Card>> PostCard(Card card)
        {
        if (card == null)
        {
            _logger.LogWarning("Card data is null.");
            return BadRequest("Card data is null.");
        }

        // Get user ID from token
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            _logger.LogWarning("User ID is not found in token.");
            return Unauthorized();
        }

        // Ensure the provided userId matches the token's userId
        if (userId != card.UserId)
        {
            _logger.LogWarning("User ID mismatch.");
            return BadRequest("User ID mismatch.");
        }

        // Retrieve the user from the database
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            _logger.LogWarning("User not found.");
            return NotFound("User not found.");
        }
        // If CardBoxId is null, assign a default value (e.g., 0 for inbox)
        CardBox cardBox = null;
        if (card.CardBoxId.HasValue && card.CardBoxId.Value != 0)
        {
            // Retrieve the card box from the database
            cardBox = await _context.CardBoxes.FindAsync(card.CardBoxId.Value);
            if (cardBox == null)
            {
                _logger.LogWarning("Card box not found.");
                return NotFound("Card box not found.");
            }
        }
        else
        {
            card.CardBoxId = null; // Set to null if it's 0 or not provided
        }
        card.User = user;
        card.CardBox = cardBox;

        _logger.LogInformation($"Received card: {JsonConvert.SerializeObject(card)}");
        try
        {
            _context.Cards.Add(card);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Card created successfully.");
        }
        catch (Exception ex)
        {
            _logger.LogError($"An error occurred: {ex.Message}");
            return StatusCode(500, "Internal server error");
        }

        return CreatedAtAction(nameof(GetCard), new { id = card.CardId }, card);
        }

        // DELETE: api/Cards/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCard(int id)
        {
            var card = await _context.Cards.FindAsync(id);
            if (card == null)
            {
                return NotFound();
            }

            _context.Cards.Remove(card);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        // Add a new route to the ChatController that will help using the openAI API to rewrite the note card.
        // POST api/Cards/openai/rewrite
        [HttpPost("openai/rewrite")]
        public async Task<IActionResult> PostRewritePromptAsync([FromBody] PromptRequest prompt, CancellationToken cancellationToken)
        {
            var deploymentId = _config["AzureOpenAI:ChatGPTDeploymentId"];
            var response = await _client.GetChatCompletionsAsync(
                new ChatCompletionsOptions
                {
                    DeploymentName = deploymentId,
                    Messages =
                    {
                        new ChatRequestSystemMessage("You're an AI assistant for learner, helping them rewrite notes more efficiently."),
                        new ChatRequestUserMessage("Can you rewrite this note card?"),
                        new ChatRequestUserMessage(prompt.Prompt),
                    },
                }, cancellationToken);

            return Ok(response);
        }

        private bool CardExists(int id)
        {
            return _context.Cards.Any(e => e.CardId == id);
        }
    }
}