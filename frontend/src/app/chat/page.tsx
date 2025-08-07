"use client";
import { chat_service, useAppData, User } from '@/context/AppContext'
import React, { useEffect, useState } from 'react'
import Loading from "@/components/loading";
import { useRouter } from 'next/navigation';
import ChartSideBar from '@/components/chartSideBar';import toast from 'react-hot-toast';
;
import Cookies from 'js-cookie';
import axios from 'axios';
import ChatHeader from '@/components/chatHeader';

export interface message {
  _id: string;
  chatId: string;
  sender: string;
  text?: string;
  image?: {
    url: string;
    publicId: string;
  };
  messageType: "text" | "image"
  seen: boolean;
  seenAt?: string;
  createdAt: string;
}

const ChatApp = () => {
  const { loading, isAuth, logOutUser, chats, user: loggedInUser,
    users,
    fetchChats,
    setChats,
  } = useAppData();

  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [message, setMessage] = useState("");
  const [siderbarOpen, setSiderbarOpen] = useState(false)
  const [messages, setMessages] = useState<message[] | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [showAllUser, setShowAllUser] = useState(false)
  const [isTyping, setTyping] = useState(false);
  const [typingTimeOut, settypingTimeOut] = useState<NodeJS.Timeout | null>(null)

  const router = useRouter();

  useEffect(() => {
    if (!isAuth && !loading) {
      router.push("/login");
    }
  }, [isAuth, router, loading]);

  const handleLogout = () => logOutUser();

  async function createChat(u : User) {
    try {
      const token = Cookies.get("token");
      const {data} = await axios.post(`${chat_service}/api/v1/chat/new`,{
        userId: loggedInUser?._id,
        otherUserId: u._id,
      },{
        headers:{
          Authorization: `Bearer ${token}`
        },
      });

      setSelectedUser(data.chatId);
      setShowAllUser(false);
      await fetchChats();
    } catch (error) {
      toast.error("Failed to start chat");
    }
  }

  useEffect(()=>{
    if(selectedUser){
      fetchChats();
    }
  }, [selectedUser]);

  if (loading) return <Loading />

  return (
    <div className='min-h-screen flex bg-gray-900 text-white relative overflow-hidden'>
      <ChartSideBar 
        sidebarOpen={siderbarOpen}
        setSidebarOpen={setSiderbarOpen}
        showAllUsers={showAllUser}
        setShowAllUsers={setShowAllUser}
        users={users}
        loggedInUser={loggedInUser}
        chats={chats}
        selectedUser={selectedUser}
        handleLogout={handleLogout}
        setSelectedUser={setSelectedUser}  
        createChat= {createChat}
      />

      <div className="flex-1 flex flex-col justify-between p-4 backdrop-blur-xl
         bg-white/5 border-white/10">
          <ChatHeader />
         </div>
    </div>
  )
}

export default ChatApp