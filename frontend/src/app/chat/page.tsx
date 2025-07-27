"use client";
import { useAppData } from '@/context/AppContext'
import React, { useEffect } from 'react'
import Loading from "@/components/loading";
import { useRouter } from 'next/navigation';

const ChatApp = () => {
  const {loading, isAuth } = useAppData();

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