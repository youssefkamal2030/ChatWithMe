using Microsoft.AspNetCore.Mvc;
using ChatWithMe.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
                .Include(m => m.Sender) // Include the sender details
                .ToListAsync();

            return Ok(messages);
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