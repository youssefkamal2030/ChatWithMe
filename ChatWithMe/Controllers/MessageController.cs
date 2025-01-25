using Microsoft.AspNetCore.Mvc;
using ChatWithMe.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ChatWithMe.Models.DTO_s;

namespace ChatWithMe.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MessageController : ControllerBase
    {
        private readonly Context _context;

        public MessageController(Context context)
        {
            _context = context;
        }

        // GET: https://localhost:44346/Message/room/{roomId}
        [HttpGet("room/{roomId}")]
        public async Task<ActionResult<IEnumerable<Message>>> GetMessagesByRoom(int roomId)
        {
            var messages = await _context.Message
        .Where(m => m.RoomID == roomId)
        .Include(m => m.Sender) // Load the Sender navigation property
        .Select(m => new RoomMessagesDto
        {
            Username = m.Sender.UserName,
            Content = m.Content,
            SentAt = m.SentAt
        })
        .ToListAsync();

            return Ok(new { messages }); 
        }

        // POST: api/Message
        [HttpPost]
        public async Task<ActionResult<Message>> CreateMessage([FromBody] Message message)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Message.Add(message);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Message sent successfully",
                message.MessageID,
                message.Content,
                message.SentAt
            });
        }
    }
}