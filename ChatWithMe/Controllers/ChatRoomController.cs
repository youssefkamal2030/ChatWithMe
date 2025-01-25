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
    public class ChatRoomController : ControllerBase
    {
        private readonly Context _context;

        public ChatRoomController(Context context)
        {
            _context = context;
        }

        // GET: api/ChatRoom
        [HttpGet]

        public async Task<ActionResult<IEnumerable<ChatRoomsDto>>> GetChatRooms()
        {
            var chatRooms = await _context.ChatRoom
                .Include(c => c.CreatedBy) 
                .ToListAsync();

            var result = chatRooms.Select(c => new ChatRoomsDto
            {
                RoomID = c.RoomID,
                RoomName = c.RoomName,
                CreatedAt = c.CreatedAt,
                CreatedBy = new User
                {
                    UserName = c.CreatedBy.UserName,
                    Email = c.CreatedBy.Email
                }
            });

            return Ok(result);
        }

        // GET: api/ChatRoom/{id}
        [HttpGet("{id}")]

        public async Task<ActionResult<ChatRoom>> GetChatRoom(int id)
        {
            var chatRoom = await _context.ChatRoom
                .Include(c => c.Messages)
                .Include(c => c.UserChatRooms)
                .FirstOrDefaultAsync(c => c.RoomID == id);

            if (chatRoom == null)
            {
                return NotFound();
            }
            return Ok(new
            {
                chatRoom.RoomName
            }
                );
        }

        // POST: api/ChatRoom
        [HttpPost]
        public async Task<ActionResult<ChatRoom>> CreateChatRoom(ChatRoom chatRoom)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var Admin = await _context.User.FindAsync(chatRoom.CreatedByID);
            var roomExists = await _context.ChatRoom.AnyAsync(r => r.RoomName == chatRoom.RoomName);
            if (roomExists)
            {
                return BadRequest(new { message = $"Room '{chatRoom.RoomName}' already exists." });
            }
            _context.ChatRoom.Add(chatRoom);
            await _context.SaveChangesAsync();
            return Ok(new
            {
                message = "Room Created Successfully",
                chatRoom.RoomName,
                chatRoom.RoomID,
                User = new
                {
                    Admin.UserName,
                    Admin.Email,
                }


            });
        }


        // DELETE: api/ChatRoom/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteChatRoom(int id)
        {
            var chatRoom = await _context.ChatRoom.FindAsync(id);
            if (chatRoom == null)
            {
                return NotFound();
            }

            _context.ChatRoom.Remove(chatRoom);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        //Update: api/ChatRoom/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRoom(int id, ChatRoom chatRoom)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check for duplicate room name (excluding current room)
            var roomExists = await _context.ChatRoom
                .AnyAsync(r => r.RoomName == chatRoom.RoomName && r.RoomID != id);
            if (roomExists)
            {
                return BadRequest(new { message = $"Room '{chatRoom.RoomName}' already exists." });
            }

            var existingRoom = await _context.ChatRoom.FindAsync(id);
            if (existingRoom == null)
            {
                return NotFound();
            }

            // Update only allowed fields
            existingRoom.RoomName = chatRoom.RoomName;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Room updated successfully",
                existingRoom.RoomID,
                existingRoom.RoomName
            });
        }
    }
}