const socketManager = (io) => {
  const userSockets = new Map();
  const onlineUsers = new Set();

  io.on("connection", (socket) => {
    let userId;

    socket.on("setup", (userData) => {
      try {
        userId = userData.userid;
        socket.join(userId);
        userSockets.set(userId, socket);
      } catch (error) {
        socket.emit("error", "Error setting up the connection");
      }
    });

    socket.on("join-chat", (room) => {
      try {
        socket.join(room);
      } catch (error) {
        socket.emit("error", "Error joining the chat room");
      }
    });

    socket.on("new-message", (messageData) => {
      try {
        const { senderid, participants } = messageData;
        const recipientId = participants.find(
          (participant) => participant !== senderid,
        );

        socket.to(recipientId).emit("message-received", messageData);
      } catch (error) {
        socket.emit("error", "Error sending the message");
      }
    });

    socket.on("typing", (data) => {
      const { userId, recipientId, isTyping } = data;

      socket.to(recipientId).emit("typing_status", { userId, isTyping });
    });

    socket.on("user_online", (userId) => {
      onlineUsers.add(userId);
      io.emit("user_online", userId);
    });

    socket.on("user_offline", (userId) => {
      onlineUsers.delete(userId);
      io.emit("user_offline", userId);
    });

    socket.on("get_initial_online_users", () => {
      socket.emit("initial_online_users", Array.from(onlineUsers));
    });

    socket.on("disconnect", () => {
      if (userId) {
        userSockets.delete(userId);
        onlineUsers.delete(userId);
        io.emit("user_offline", userId);
      }
    });
  });
};

module.exports = socketManager;
