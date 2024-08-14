import React, { useState, useEffect, useCallback, useContext } from "react";
import ChatWithUser from "./ChatWithUser";
import SearchUser from "./SearchUser";
import axios from "axios";
import { io } from "socket.io-client";
import { Context } from "../../Context/Context";

const Chat = () => {
  const { user } = useContext(Context);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [users, setUsers] = useState([]);
  const [onlineStatuses, setOnlineStatuses] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentChat, setCurrentChat] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getAllExistingChats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/get/chatlist`,
        {
          withCredentials: true,
        },
      );
      if (response.status === 200) {
        const updatedChatList = response.data.chatList.map((chat) => ({
          ...chat,
          isTyping: false,
        }));
        setUsers(updatedChatList);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getAllExistingChats();
  }, [getAllExistingChats]);

  const updateCurrentChatStatus = useCallback((userId, isOnline) => {
    setCurrentChat((prevChat) => {
      if (prevChat && prevChat.otherUser.userid === userId) {
        return { ...prevChat, isOnline };
      }
      return prevChat;
    });
  }, []);

  useEffect(() => {
    if (user.userid) {
      const newSocket = io(import.meta.env.VITE_API_URL, {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      newSocket.on("connect", () => {
        console.log("Connected to server");
        newSocket.emit("setup", {
          userid: user.userid,
          name: user.name,
        });
        newSocket.emit("user_online", user.userid);
        console.log("Emitted user_online for", user.userid);
        newSocket.emit("get_initial_online_users");
        console.log("Emitted get_initial_online_users");
      });

      newSocket.on("typing_status", ({ userId, isTyping }) => {
        console.log("Received typing_status:", userId, isTyping);
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.otherUser.userid === userId ? { ...user, isTyping } : user,
          ),
        );
        setCurrentChat((prevChat) =>
          prevChat && prevChat.otherUser.userid === userId
            ? { ...prevChat, isTyping }
            : prevChat,
        );
      });

      newSocket.on("user_online", (userId) => {
        console.log("User came online:", userId);
        setOnlineStatuses((prev) => ({ ...prev, [userId]: true }));
        updateCurrentChatStatus(userId, true);
      });

      newSocket.on("user_offline", (userId) => {
        console.log("User went offline:", userId);
        setOnlineStatuses((prev) => ({ ...prev, [userId]: false }));
        updateCurrentChatStatus(userId, false);
      });

      newSocket.on("initial_online_users", (onlineUserIds) => {
        console.log("Received initial_online_users:", onlineUserIds);
        const statuses = {};
        onlineUserIds.forEach((id) => {
          statuses[id] = true;
        });
        setOnlineStatuses(statuses);
        if (currentChat) {
          updateCurrentChatStatus(
            currentChat.otherUser.userid,
            statuses[currentChat.otherUser.userid] || false,
          );
        }
      });

      setSocket(newSocket);

      const handleVisibilityChange = () => {
        if (!document.hidden) {
          console.log("Page became visible, requesting online users");
          newSocket.emit("get_initial_online_users");
        }
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
        console.log("Cleaning up socket connection");
        newSocket.off("message-received");
        newSocket.off("typing_status");
        newSocket.off("user_online");
        newSocket.off("user_offline");
        newSocket.off("initial_online_users");
        newSocket.emit("user_offline", user.userid);
        console.log("Emitted user_offline for", user.userid);
        newSocket.disconnect();

        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange,
        );
      };
    }
  }, [user.userid, updateCurrentChatStatus]);

  const usersWithStatus = users.map((user) => ({
    ...user,
    isOnline: onlineStatuses[user.otherUser.userid] || false,
  }));

  if (isMobile) {
    return (
      <div className="relative">
        {currentChat ? (
          <ChatWithUser
            setCurrentChat={setCurrentChat}
            currentChat={currentChat}
            loggedInUserId={user?.userid}
            socket={socket}
          />
        ) : (
          <SearchUser
            users={usersWithStatus}
            setCurrentChat={setCurrentChat}
            setUsers={setUsers}
            setLoading={setLoading}
            loading={loading}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex justify-center h-[90vh] p-5">
      <div className="w-1/3">
        <SearchUser
          setUsers={setUsers}
          users={usersWithStatus}
          setLoading={setLoading}
          loading={loading}
          setCurrentChat={setCurrentChat}
          getAllExistingChats={getAllExistingChats}
        />
      </div>
      <div className="w-1/2">
        <ChatWithUser
          setCurrentChat={setCurrentChat}
          currentChat={currentChat}
          loggedInUserId={user?.userid}
          socket={socket}
        />
      </div>
    </div>
  );
};

export default Chat;
