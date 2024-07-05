using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NoteBookController : ControllerBase
    {
        private readonly NotesAppContext _context;
        public NoteBookController(NotesAppContext context)
        {
            _context = context;
        }

        // GET: api/NoteBooks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<NoteBook>>> GetNoteBooks()
        {
            return await _context.NoteBooks.ToListAsync();
        }

        // GET: api/NoteBooks/5
        [HttpGet("{id}")]
        public async Task<ActionResult<NoteBook>> GetNoteBook(int id)
        {
            var noteBook = await _context.NoteBooks.FindAsync(id);

            if (noteBook == null)
            {
                return NotFound();
            }

            return noteBook;
        }

        // PUT: api/NoteBooks/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutNoteBook(int id, NoteBook noteBook)
        {
            if (id != noteBook.NoteBookId)
            {
                return BadRequest();
            }

            _context.Entry(noteBook).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NoteBookExists(id))
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

        // POST: api/NoteBooks
        [HttpPost]
        public async Task<ActionResult<NoteBook>> PostNoteBook(NoteBook noteBook)
        {
            _context.NoteBooks.Add(noteBook);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetNoteBook", new { id = noteBook.NoteBookId }, noteBook);
        }

        // DELETE: api/NoteBooks/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNoteBook(int id)
        {
            var noteBook = await _context.NoteBooks.FindAsync(id);
            if (noteBook == null)
            {
                return NotFound();
            }

            _context.NoteBooks.Remove(noteBook);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool NoteBookExists(int id)
        {
            return _context.NoteBooks.Any(e => e.NoteBookId == id);
        }
    }
}