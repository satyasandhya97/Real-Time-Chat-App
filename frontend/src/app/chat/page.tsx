"use client";
import { chat_service, useAppData, User } from '@/context/AppContext';
import React, { useEffect, useState } from 'react';
import Loading from "@/components/loading";
import { useRouter } from 'next/navigation';
import ChartSideBar from '@/components/chatSideBar';
import toast from 'react-hot-toast';
import ChatMessages from '@/components/chatMessages';
import Cookies from 'js-cookie';
import axios from 'axios';
import ChatHeader from '@/components/chatHeader';
import MessageInput from '@/components/messageInput';
import { SocketData } from '@/context/SocketContext';

export interface message {
  _id: string;
  chatId: string;
  sender: string;
  text?: string;
  image?: {
    url: string;
    publicId: string;
  };
  messageType: "text" | "image";
  seen: boolean;
  seenAt?: string;
  createdAt: string;
}

const ChatApp = () => {
  const {
    loading,
    isAuth,
    logOutUser,
    chats,
    user: loggedInUser,
    users,
    fetchChats,
    setChats,
  } = useAppData();

  const { socket, onlineUsers } = SocketData();

  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [siderbarOpen, setSiderbarOpen] = useState(false);
  const [messages, setMessages] = useState<message[] | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [showAllUser, setShowAllUser] = useState(false);
  const [isTyping, setTyping] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!isAuth && !loading) {
      router.push("/login");
    }
  }, [isAuth, router, loading]);

  const handleLogout = () => logOutUser();

  // Helper to resolve contact name from users list if backend returns "Unknown User"
  const resolveContact = (rawUser: any, chatUsers?: string[]) => {
    if (!rawUser || rawUser.name === "Unknown User") {
      const otherId = chatUsers?.find((id) => id !== loggedInUser?._id) || rawUser?._id;
      const matched = users?.find((u) => u._id === otherId);
      if (matched) return matched;
    }
    return rawUser;
  };

  // Synchronize active chat user and fetch messages when selectedUser changes without re-render loop
  useEffect(() => {
    if (!selectedUser) {
      setUser(null);
      setMessages(null);
      return;
    }

    let isMounted = true;

    // Immediately resolve and set user from chats/users list for instant feedback
    if (chats) {
      const currentChat = chats.find((c) => c.chat._id === selectedUser);
      if (currentChat) {
        const resolved = resolveContact(currentChat.user, currentChat.chat?.users);
        if (resolved) {
          setUser(resolved);
        }
      }
    }

    // Immediately clear unread count badge in UI for this chat
    setChats((prev) =>
      prev
        ? prev.map((c) =>
            c.chat._id === selectedUser
              ? { ...c, chat: { ...c.chat, unseenCount: 0 } }
              : c
          )
        : prev
    );

    // Fetch messages for the selected chat
    const loadMessages = async () => {
      try {
        const token = Cookies.get("token");
        const { data } = await axios.get(`${chat_service}/api/v1/message/${selectedUser}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (isMounted) {
          if (data?.message) {
            setMessages(data.message);
          }
          if (data?.user) {
            const resolved = resolveContact(data.user);
            setUser(resolved);
          }
        }
      } catch (error) {
        console.log("Error loading messages:", error);
      }
    };

    loadMessages();

    return () => {
      isMounted = false;
    };
  }, [selectedUser]); // Intentionally dependent only on selectedUser to prevent loop

  // Real-time message listener via WebSockets
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMsg: message) => {
      // If the message is for the currently opened chat, append it immediately to state!
      if (selectedUser && newMsg.chatId === selectedUser) {
        setMessages((prev) => {
          const current = prev || [];
          if (current.some((m) => m._id === newMsg._id)) return current;
          return [...current, newMsg];
        });
      }
      // Always refresh sidebar previews & unread counts
      fetchChats();
    };

    const handleMessagesSeen = ({ chatId }: { chatId: string }) => {
      if (selectedUser && selectedUser === chatId) {
        setMessages((prev) =>
          prev
            ? prev.map((m) => (m.sender === loggedInUser?._id ? { ...m, seen: true } : m))
            : prev
        );
      }
      fetchChats();
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messagesSeen", handleMessagesSeen);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messagesSeen", handleMessagesSeen);
    };
  }, [socket, selectedUser, loggedInUser?._id, fetchChats]);

  async function createChat(u: User) {
    try {
      const token = Cookies.get("token");
      const { data } = await axios.post(
        `${chat_service}/api/v1/chat/new`,
        {
          userId: loggedInUser?._id,
          otherUserId: u._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSelectedUser(data.chatId);
      setShowAllUser(false);
      setUser(u);
      await fetchChats();
    } catch (error) {
      toast.error("Failed to start chat");
    }
  }

  const handleMessageSend = async (e: any, imageFile?: File | null) => {
    e.preventDefault();

    if (!message.trim() && !imageFile) return;
    if (!selectedUser) return;

    const token = Cookies.get("token");

    try {
      const formData = new FormData();
      formData.append("chatId", selectedUser);

      if (message.trim()) {
        formData.append("text", message);
      }

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const { data } = await axios.post(
        `${chat_service}/api/v1/message`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessages((prev) => {
        const currentMessages = prev || [];
        const messageExists = currentMessages.some(
          (msg: { _id: any }) => msg._id === data.message._id
        );

        if (!messageExists) {
          return [...currentMessages, data.message];
        }
        return currentMessages;
      });

      setMessage("");
      await fetchChats();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  };

  const handleTyping = (value: string) => {
    setMessage(value);
  };

  if (loading) return <Loading />;

  return (
    <div className="h-screen h-[100dvh] w-full flex bg-[#0b141a] text-[#e9edef] overflow-hidden select-none">
      {/* Conversation Sidebar - Always visible on desktop/tablet (md:), toggled on mobile */}
      <ChartSideBar
        sidebarOpen={siderbarOpen || !selectedUser}
        setSidebarOpen={setSiderbarOpen}
        showAllUsers={showAllUser}
        setShowAllUsers={setShowAllUser}
        users={users}
        loggedInUser={loggedInUser}
        chats={chats}
        selectedUser={selectedUser}
        handleLogout={handleLogout}
        setSelectedUser={(id) => {
          setSelectedUser(id);
          setSiderbarOpen(false);
        }}
        createChat={createChat}
        onlineUsers={onlineUsers}
      />

      {/* Backdrop overlay for mobile drawer when opened explicitly over chat */}
      {siderbarOpen && selectedUser && (
        <div
          onClick={() => setSiderbarOpen(false)}
          className="fixed inset-0 bg-black/60 z-20 md:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Active Chat Area - Always visible on desktop/tablet (md:), toggled on mobile */}
      <main
        className={`flex-1 flex flex-col h-full min-w-0 bg-[#0b141a] relative overflow-hidden ${
          !selectedUser ? "hidden md:flex" : "flex"
        }`}
      >
        <ChatHeader
          user={user}
          setSidebarOpen={setSiderbarOpen}
          isTyping={isTyping}
          onlineUsers={onlineUsers}
          onBack={() => {
            setSelectedUser(null);
            setSiderbarOpen(false);
          }}
        />

        <ChatMessages
          selectedUser={selectedUser}
          messages={messages}
          loggedInUser={loggedInUser}
        />

        <MessageInput
          selectedUser={selectedUser}
          message={message}
          setMessage={handleTyping}
          handleMessageSend={handleMessageSend}
        />
      </main>
    </div>
  );
};

export default ChatApp;