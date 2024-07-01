using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController(StoreContext context) : ControllerBase
    {
        private readonly StoreContext _context = context;

        [HttpGet]
        public async Task<ActionResult<List<Product>>> GetProducts()
        {
            // Add your logic here
            return await _context.Products.ToListAsync();
        }
        [HttpGet("{id}")] // api/products/{id}
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
             return await _context.Products.FindAsync(id);
        }
    }
}