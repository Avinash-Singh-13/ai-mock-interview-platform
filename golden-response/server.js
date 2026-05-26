const { createServer } = require("http");
const { randomUUID } = require("crypto");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = "0.0.0.0";
const port = Number(process.env.PORT || 3000);
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();
const roomState = new Map();

app.prepare().then(() => {
  const httpServer = createServer(handle);
  const io = new Server(httpServer, {
    cors: { origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000" }
  });

  io.on("connection", (socket) => {
    socket.on("room:join", ({ roomId, user }) => {
      if (!roomId) return;
      socket.join(roomId);
      socket.data.roomId = roomId;
      socket.data.user = user;
      if (!roomState.has(roomId)) {
        roomState.set(roomId, { code: "", language: "javascript", notes: [], peers: [] });
      }
      const state = roomState.get(roomId);
      state.peers = [...state.peers.filter((peer) => peer.id !== socket.id), { id: socket.id, user }];
      socket.emit("room:state", state);
      socket.to(roomId).emit("room:presence", state.peers);
    });

    socket.on("code:update", ({ roomId, code, language }) => {
      const state = roomState.get(roomId);
      if (!state) return;
      state.code = code;
      state.language = language || state.language;
      socket.to(roomId).emit("code:update", { code: state.code, language: state.language });
    });

    socket.on("notes:add", ({ roomId, note }) => {
      const state = roomState.get(roomId);
      if (!state || !note?.trim()) return;
      const item = { id: randomUUID(), text: note.trim(), createdAt: new Date().toISOString() };
      state.notes.unshift(item);
      io.to(roomId).emit("notes:update", state.notes);
    });

    socket.on("webrtc:offer", (payload) => socket.to(payload.roomId).emit("webrtc:offer", payload));
    socket.on("webrtc:answer", (payload) => socket.to(payload.roomId).emit("webrtc:answer", payload));
    socket.on("webrtc:ice", (payload) => socket.to(payload.roomId).emit("webrtc:ice", payload));

    socket.on("disconnect", () => {
      const roomId = socket.data.roomId;
      if (!roomId || !roomState.has(roomId)) return;
      const state = roomState.get(roomId);
      state.peers = state.peers.filter((peer) => peer.id !== socket.id);
      socket.to(roomId).emit("room:presence", state.peers);
    });
  });

  httpServer.listen(port, hostname, () => {
    console.log(`AI Mock Interview Platform ready on http://localhost:${port}`);
  });
});
