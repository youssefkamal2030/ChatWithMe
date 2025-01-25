using Microsoft.AspNetCore.Mvc;
using ChatWithMe.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ChatWithMe.Models.DTO_s;
using ChatWithMe.Hubs;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace ChatWithMe.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MessageController : ControllerBase
    {
        private readonly Context _context;
        
        private readonly IHubContext<ChatHub> _hubContext;

        public MessageController(Context context, IHubContext<ChatHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        // GET: https://localhost:44346/Message/room/{roomId}
        [HttpGet("room/{roomId}")]
        public async Task<ActionResult> GetMessagesByRoom(int roomId)
        {
            var messages = await _context.Message
                .Where(m => m.RoomID == roomId)
                .Include(m => m.Sender)
                .Include(m => m.Room)
                .Select(m => new RoomMessagesDto
                {
                    MessageID = m.MessageID,
                    Username = m.Sender.UserName,
                    Content = m.Content,
                    SentAt = m.SentAt,
                    SenderID = m.SenderID
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
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMessage(int id, [FromBody] MessageUpdateDto dto)
        {
            var message = await _context.Message
                .Include(m => m.Room)
                .FirstOrDefaultAsync(m => m.MessageID == id);

            if (message == null) return NotFound();

            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (message.SenderID != currentUserId) return Forbid();

            message.Content = dto.Content;
            await _context.SaveChangesAsync();

            await _hubContext.Clients.Group(message.Room.RoomName)
                .SendAsync("MessageEdited", message.MessageID, message.Content);

            return Ok(new { message = "Message updated" });
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMessage(int id)
        {
            var message = await _context.Message
                .Include(m => m.Room)
                .FirstOrDefaultAsync(m => m.MessageID == id);

            if (message == null) return NotFound();

            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (message.SenderID != currentUserId) return Forbid();

            _context.Message.Remove(message);
            await _context.SaveChangesAsync();

            await _hubContext.Clients.Group(message.Room.RoomName)
                .SendAsync("MessageDeleted", message.MessageID);

            return NoContent();
        }
    }
}