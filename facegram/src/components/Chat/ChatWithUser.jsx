import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Send, Smile, ArrowLeft } from "lucide-react";
import EmojiPicker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { TimeAgo } from "../../Utils/TimeAgo";
import { getAllMessages } from "../../Utils/ChatUtils";
import { Link } from "react-router-dom";

const ChatWithUser = ({
  setCurrentChat,
  currentChat,
  loggedInUserId,
  socket,
}) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (loggedInUserId && currentChat?.otherUser?.userid) {
      const fetchMessages = async () => {
        try {
          setLoading(true);
          const messages = await getAllMessages(currentChat.chatid);
          setMessages(messages);
          setLoading(false);
        } catch (error) {
          toast.error(error.response.data.message);
        }
      };
      fetchMessages();
    }
  }, [loggedInUserId, currentChat?.otherUser?.userid]);

  useEffect(() => {
    if (loggedInUserId && currentChat?.otherUser?.userid) {
      if (socket) {
        socket.on("message-received", (newMessageReceived) => {
          if (newMessageReceived.chatid === currentChat.chatid) {
            setMessages((prevMessages) => [
              ...prevMessages,
              newMessageReceived,
            ]);
          }
        });

        return () => {
          socket.off("message-received");
        };
      }
    }
  }, [loggedInUserId, currentChat?.otherUser?.userid]);

  const handleSendMessage = async () => {
    try {
      const newMessage = {
        senderid: loggedInUserId,
        content: message,
        createdat: new Date().toISOString(),
        messageid: Math.random(),
        participants: currentChat.participants,
        chatid: currentChat.chatid,
      };

      setMessage("");
      setShowEmojiPicker(false);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      socket.emit("new-message", newMessage);

      if (loggedInUserId && currentChat?.otherUser?.userid) {
        const serverMessage = {
          chatid: currentChat.chatid,
          senderid: loggedInUserId,
          content: message,
        };

        axios
          .post(
            `${import.meta.env.VITE_API_URL}/api/send/message`,
            serverMessage,
            {
              withCredentials: true,
            },
          )
          .catch((error) => {
            console.error("Error sending message to the server:", error);
            toast.error("Failed to send message.");
          });
      }
      socket.emit("typing", {
        userId: loggedInUserId,
        recipientId: currentChat.otherUser.userid,
        isTyping: false,
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message.");
    }
  };

  const handleEmojiSelect = (emojiObject) => {
    setMessage(message + emojiObject.native);
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);

    // Clear any existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Emit typing status
    socket.emit("typing", {
      userId: loggedInUserId,
      recipientId: currentChat.otherUser.userid,
      isTyping: true,
    });

    // Set a new timeout
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing", {
        userId: loggedInUserId,
        recipientId: currentChat.otherUser.userid,
        isTyping: false,
      });
    }, 3000);
  };

  // Scroll to bottom of chat
  const messageEndRef = useRef(null);
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="h-full flex flex-col">
      {currentChat ? (
        <>
          <div className="flex flex-col h-[85vh] bg-gray-100">
            <div className="bg-gray-100 mb-2 flex flex-row justify-center items-center w-full p-4 gap-2 shadow">
              <button
                onClick={() => setCurrentChat(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft size={24} />
              </button>
              <Link to={`/user/profile/${currentChat?.otherUser?.userid}`}>
                <img
                  alt="User Avatar"
                  src={currentChat?.otherUser?.profilepic}
                  className="w-12 h-12 rounded-full mr-2"
                />
              </Link>
              <div>
                <div className="text-lg font-semibold">
                  {currentChat?.otherUser?.name}
                </div>
                <div className="text-sm text-gray-600">
                  {currentChat?.isTyping ? "Typing..." : ""}
                </div>
                <div
                  className={`text-sm ${
                    currentChat?.isOnline ? "text-green-500" : "text-gray-400"
                  }`}
                >
                  {currentChat?.isOnline ? "Online" : "Offline"}
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto w-full flex flex-col px-4">
              {loading ? (
                <div className="flex justify-center items-center">
                  <div className="loader"></div>
                </div>
              ) : messages.length > 0 ? (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-2 max-w-[80%] ${
                      message?.senderid === loggedInUserId
                        ? "self-end"
                        : "self-start"
                    } flex flex-col`}
                  >
                    <div className="p-3 bg-white rounded-xl shadow-md">
                      {message.content}
                    </div>
                    <div
                      className={`text-xs text-gray-500 mt-1 ${
                        message?.senderid === loggedInUserId
                          ? "self-end"
                          : "self-start"
                      }`}
                    >
                      {TimeAgo(message.createdat)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col h-full justify-center items-center">
                  <div className="text-gray-500 font-bold text-2xl mt-5 text-center">
                    No messages yet
                  </div>
                </div>
              )}
              <div ref={messageEndRef} />
            </div>
            <div className="flex items-center mt-2 w-full p-4 relative">
              <input
                value={message}
                onChange={handleTyping}
                placeholder="Type your message..."
                required={true}
                className="flex-grow p-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
              />
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="text-gray-500 hover:text-gray-700 ml-2"
              >
                <Smile size={24} />
              </button>
              <button
                onClick={handleSendMessage}
                className="text-blue-500 hover:text-blue-700 ml-2"
                disabled={message.length === 0}
              >
                <Send size={24} />
              </button>
              {showEmojiPicker && (
                <div className="absolute bottom-full right-0 z-50">
                  <EmojiPicker data={data} onEmojiSelect={handleEmojiSelect} />
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col h-[calc(100vh-130px)] justify-center items-center bg-gray-100">
          <img src="/chat.gif" alt="Chat" className="" />
          <div className="text-lg font-semibold">
            Select a user to chat with
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWithUser;
