using System;
using System.Collections.Generic;
using System.Linq;
using Azure.AI.OpenAI;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Threading;
using API.Services;
using Shared.Models;
using System.Runtime.CompilerServices;
using Azure.Storage.Blobs;
using Shared;
namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly OpenAIClient _client;
        private readonly IConfiguration _config;
        private readonly ReadRetrieveReadChatService _chatService;

        public ChatController(OpenAIClient client, IConfiguration config, ReadRetrieveReadChatService chatService)
        {
            _client = client;
            _config = config;
            _chatService = chatService;
        }

        // POST api/chat/openai/chat
        [HttpPost("openai/chat")]
        public async IAsyncEnumerable<ChatChunkResponse> PostChatPromptAsync([FromBody] PromptRequest prompt, [EnumeratorCancellation] CancellationToken cancellationToken)
        {
            var deploymentId = _config["AzureOpenAI:ChatGPTDeploymentId"];
            var response = await _client.GetChatCompletionsStreamingAsync(
                new ChatCompletionsOptions
                {
                    DeploymentName = deploymentId,
                    Messages =
                    {
                        new ChatRequestSystemMessage("You're an AI assistant for developers, helping them write code more efficiently."),
                        new ChatRequestUserMessage("What's your name?"),
                        new ChatRequestAssistantMessage("Hi, my name is **Blazor 📎 Clippy**! Nice to meet you."),
                        new ChatRequestUserMessage(prompt.Prompt)
                    }
                }, cancellationToken);

            await foreach (var choice in response.WithCancellation(cancellationToken))
            {
                if (choice.ContentUpdate is { Length: > 0 })
                {
                    yield return new ChatChunkResponse(choice.ContentUpdate.Length, choice.ContentUpdate);
                }
            }
        }
        // POST api/chat/chat
        [HttpPost("chat")]
        public async Task<IActionResult> PostChatAsync([FromBody] ChatRequest request, CancellationToken cancellationToken)
        {
            if (request is { History.Length: > 0 })
            {
                var response = await _chatService.ReplyAsync(request.History, request.Overrides, cancellationToken);
                return Ok(response);
            }
            return BadRequest();
        }
        // POST api/chat/upload
        [HttpPost("upload")]
        public async Task<IActionResult> PostDocumentAsync([FromForm] IFormFileCollection files, [FromServices] AzureBlobStorageService service, [FromServices] ILogger<AzureBlobStorageService> logger, CancellationToken cancellationToken)
        {
            logger.LogInformation("Upload documents");
            var response = await service.UploadFilesAsync(files, cancellationToken);
            logger.LogInformation("Upload documents: {x}", response);
            return Ok(response);
        }
        // GET api/chat/documents
        [HttpGet("documents")]
        public async IAsyncEnumerable<DocumentResponse> GetDocumentsAsync([FromServices] BlobContainerClient client, [EnumeratorCancellation] CancellationToken cancellationToken)
        {
            await foreach (var blob in client.GetBlobsAsync(cancellationToken: cancellationToken))
            {
                if (blob is not null and { Deleted: false })
                {
                    var props = blob.Properties;
                    var baseUri = client.Uri;
                    var builder = new UriBuilder(baseUri);
                    builder.Path = $"{builder.Path}/{blob.Name}";

                    var metadata = blob.Metadata;
                    var documentProcessingStatus = GetMetadataEnumOrDefault(metadata, nameof(DocumentProcessingStatus), DocumentProcessingStatus.NotProcessed);
                    var embeddingType = GetMetadataEnumOrDefault(metadata, nameof(EmbeddingType), EmbeddingType.AzureSearch);

                    yield return new DocumentResponse(
                        blob.Name,
                        props.ContentType,
                        props.ContentLength ?? 0,
                        props.LastModified,
                        builder.Uri,
                        documentProcessingStatus,
                        embeddingType);

                    static TEnum GetMetadataEnumOrDefault<TEnum>(IDictionary<string, string> metadata, string key, TEnum @default) where TEnum : struct =>
                        metadata.TryGetValue(key, out var value) && Enum.TryParse(value, out TEnum status) ? status : @default;
                }
            }
        }
        // POST api/chat/images
        [HttpPost("images")]
        public async Task<IActionResult> PostImagePromptAsync([FromBody] PromptRequest prompt, CancellationToken cancellationToken)
        {
            var result = await _client.GetImageGenerationsAsync(new ImageGenerationOptions
            {
                Prompt = prompt.Prompt,
            }, cancellationToken);

            var imageUrls = result.Value.Data.Select(i => i.Url).ToList();
            var response = new ImageResponse(result.Value.Created, imageUrls);
            return Ok(response);
        }

    }
}