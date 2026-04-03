import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";

let socket;

export default function Chat() {
  const { user } = useAuth();
  const { roomId: paramRoomId } = useParams();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(paramRoomId || null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [otherUser, setOtherUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState(false);
  const messagesEnd = useRef(null);
  const typingTimer = useRef(null);

  useEffect(() => {
    socket = io("/", { auth: { userId: user?.id } });
    socket.on("new_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
      loadRooms();
    });
    socket.on("user_typing", () => { setTyping(true); setTimeout(() => setTyping(false), 2000); });
    loadRooms();
    return () => socket.disconnect();
  }, []);

  useEffect(() => { messagesEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  useEffect(() => {
    if (activeRoom) { socket.emit("join_room", { roomId: activeRoom }); loadMessages(activeRoom); }
  }, [activeRoom]);

  const loadRooms = async () => {
    try { const { data } = await axios.get("/api/chat/rooms"); setRooms(data); }
    catch {} finally { setLoading(false); }
  };

  const loadMessages = async (roomId) => {
    try { const { data } = await axios.get(`/api/chat/rooms/${roomId}/messages`); setMessages(data); }
    catch { setMessages([]); }
  };

  const selectRoom = (room) => {
    setActiveRoom(room.roomId);
    setOtherUser(room.otherUser);
    navigate(`/chat/${room.roomId}`, { replace: true });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !activeRoom) return;
    const receiverId = activeRoom.split("_").find((id) => id !== user.id);
    socket.emit("send_message", { roomId: activeRoom, senderId: user.id, receiverId, content: input.trim() });
    setInput("");
  };

  const handleTyping = (e) => {
    setInput(e.target.value);
    socket.emit("typing", { roomId: activeRoom, userId: user.id });
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => socket.emit("stop_typing", { roomId: activeRoom }), 1500);
  };

  const timeStr = (ts) => new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="chat-layout">
      <div className="chat-sidebar">
        <div className="chat-sidebar-header">💬 Messages</div>
        {loading ? <div className="loading" style={{ minHeight: 100 }}>Loading...</div> :
         rooms.length === 0 ? <div style={{ padding: "1.5rem", color: "#64748b", fontSize: "0.9rem", textAlign: "center" }}>No conversations yet.<br /><br />Connect with someone from the Roommate Match page to start chatting.</div> :
         rooms.map((room) => (
           <div key={room.roomId} className={`room-item${activeRoom === room.roomId ? " active" : ""}`} onClick={() => selectRoom(room)}>
             <div className="avatar" style={{ width: 40, height: 40, fontSize: "0.9rem" }}>{room.otherUser?.name?.[0]}</div>
             <div className="info">
               <div className="name">{room.otherUser?.name}</div>
               <div className="last-msg">{room.lastMessage?.content || "Say hello!"}</div>
             </div>
             {room.unread > 0 && <span style={{ background: "#2563eb", color: "#fff", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, flexShrink: 0 }}>{room.unread}</span>}
           </div>
         ))
        }
      </div>

      {activeRoom ? (
        <div className="chat-main">
          <div className="chat-header">
            <div className="avatar" style={{ width: 36, height: 36, fontSize: "0.85rem" }}>{otherUser?.name?.[0] || "?"}</div>
            <div>
              <div style={{ fontWeight: 700 }}>{otherUser?.name || "Chat"}</div>
              <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{typing ? "✍️ typing..." : otherUser?.isVerified ? "✅ Verified" : ""}</div>
            </div>
          </div>
          <div className="chat-messages">
            {messages.length === 0 && <div style={{ textAlign: "center", color: "#94a3b8", fontSize: "0.85rem", padding: "2rem" }}>No messages yet. Say hello! 👋</div>}
            {messages.map((msg) => {
              const sent = msg.senderId === user?.id;
              return (
                <div key={msg.id} className={`msg-bubble ${sent ? "sent" : "received"}`}>
                  {msg.content}
                  <div className="time">{timeStr(msg.timestamp)}</div>
                </div>
              );
            })}
            <div ref={messagesEnd} />
          </div>
          <form className="chat-input-bar" onSubmit={sendMessage}>
            <input value={input} onChange={handleTyping} placeholder="Type a message..." autoFocus />
            <button type="submit">➤</button>
          </form>
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, flexDirection: "column", color: "#64748b", gap: "1rem" }}>
          <div style={{ fontSize: "3rem" }}>💬</div>
          <p>Select a conversation to start chatting</p>
        </div>
      )}
    </div>
  );
}
