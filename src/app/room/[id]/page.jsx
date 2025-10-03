"use client";
import { useRef, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import styles from "@/app/page.module.css";

let socket;
export default function RoomPage({ params }) {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isloading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("");
  useEffect(() => {
    const getUsername = async () => {
      const res = await axios.get("/api/users/userInfo");
      setUsername(res.data.user);
    };
    getUsername();
  }, []);
  const bottom = useRef(null);

  useEffect(() => {
    socket = io("https://socketio-5zyq.onrender.com", {
      transports: ["websocket"],
      withCredentials: true,
    });
    socket.emit("joinRoom", { roomID: id, username });

    socket.on("userJoined", ({ roomID, username }) => {
      toast(`${username} joined the chat`, {
        icon: "👋",
        style: {
          borderRadius: "8px",
          background: "#333",
          color: "#fff",
        },
      });
    });
    socket.on("userLeft", ({ roomID, username }) => {
      toast(`${username} left the chat`, {
        icon: "👋",
        style: {
          borderRadius: "8px",
          background: "#333",
          color: "#fff",
        },
      });
    });

    socket.on("receiveMessage", ({ sender, message }) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender, content: message },
      ]);
    });

    socket.on("messageDeleted", ({ messageId }) => {
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg._id !== messageId)
      );
      toast("Message deleted", {
        icon: "🗑️",
        style: {
          borderRadius: "8px",
          background: "#333",
          color: "#fff",
        },
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [id, username]);

  const sendMessageHandler = async () => {
    if (input.trim() === "") {
      return;
    }
    socket.emit("sendMessage", {
      roomID: id,
      message: input,
      sender: username,
    });
    await axios.post("/api/users/room", {
      roomID: id,
      message: input,
    });

    setInput("");
  };

  const deleteMessageHandler = async (messageId) => {
    try {
      await axios.delete(`/api/users/room?roomID=${id}&messageId=${messageId}`);
      
      // Emit delete event to other users
      socket.emit("deleteMessage", {
        roomID: id,
        messageId,
      });
      
      // Remove message locally
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg._id !== messageId)
      );
      
      toast.success("Message deleted", {
        style: {
          borderRadius: "8px",
          background: "#333",
          color: "#fff",
        },
      });
    } catch (error) {
      toast.error("Failed to delete message", {
        style: {
          borderRadius: "8px",
          background: "#ff4444",
          color: "#fff",
        },
      });
      console.error("Error deleting message:", error);
    }
  };

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(`/api/users/room?roomID=${id}`);
        setMessages(res.data.messages || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getMessages();
  }, [id]);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <h1 className={styles.roomTitle}>Room ID: {id}</h1>
        <div className={styles.onlineIndicator}>
          <span className={styles.onlineDot}></span>
          <span>Online</span>
        </div>
      </div>

      <div className={styles.messagesContainer}>
        {isloading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <span>Loading messages...</span>
          </div>
        ) : Array.isArray(messages) && messages.length > 0 ? (
          messages.map((message, index) => (
            <div
              key={message._id || index}
              className={`${styles.messageBubble} ${
                message.sender === username
                  ? styles.sentMessage
                  : styles.receivedMessage
              }`}
            >
              {message.sender !== username && (
                <span className={styles.senderName}>{message.sender}</span>
              )}
              <div className={styles.messageContent}>{message.content}</div>
              <div className={styles.messageActions}>
                <div className={styles.messageTime}>
                  {message.timestamp
                    ? new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                </div>
                {message.sender === username && message._id && (
                  <button
                    onClick={() => deleteMessageHandler(message._id)}
                    className={styles.deleteButton}
                    title="Delete message"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noMessages}>
            No messages yet. Start the conversation!
          </div>
        )}
        <div ref={bottom} />
      </div>

      <div className={styles.inputContainer}>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={styles.messageInput}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === "Enter" && sendMessageHandler()}
          />
          <button
            onClick={sendMessageHandler}
            className={styles.sendButton}
            disabled={!input.trim()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={styles.sendIcon}
            >
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
