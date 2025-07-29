"use client";
import { useAppData, User } from '@/context/AppContext'
import React, { useEffect, useState } from 'react'
import Loading from "@/components/loading";
import { useRouter } from 'next/navigation';

export interface message{
  _id: string;
  chatId: string;
  sender: string;
  text?: string;
  image?: {
    url: string;
    publicId: string;
  };
  messageType: "text" | "image"
  seen : boolean;
  seenAt?: string;
  createdAt: string;
}

const ChatApp = () => {
  const {loading, isAuth , logOutUser, chats, user:loggedInUser,
    users,
    fetchChats,
    setChats,
  } = useAppData();
  
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [message, setMessage] = useState("");
  const[siderbarOpen, setSiderbarOpen] = useState(false)
  const[messages, setMessages] = useState<message[] | null>(null)
  const[user, setUser] = useState<User | null>(null)
  const[ showAllUser, setShowAllUser ] = useState(false)

  const router = useRouter();
  
  useEffect(() => {
    if(!isAuth && !loading){
      router.push("/login");
    }
  }, [isAuth, router, loading]);
 
  if(loading) return <Loading />
  return (
    <div>chatapp</div>
  )
}

export default ChatApp