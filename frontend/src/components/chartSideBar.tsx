import { User } from '@/context/AppContext';
import React, { useState } from 'react'

interface ChartSideBarProps{
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  showAllUsers: boolean;
  setShowAllUsers: (show:boolean |( (prev: boolean) => boolean)) => void;
  users: User[] | null;
  loggedInUser: User | null;
  chats: any[] | null;
  selectedUser:string | null;
  setSelectedUser:(userId: string | null) => void;
  handleLogout: () => void;
}

const ChartSideBar = ({sidebarOpen, setShowAllUsers, setSidebarOpen, showAllUsers,
  users, loggedInUser, chats, selectedUser, setSelectedUser,
  handleLogout
}: ChartSideBarProps) => {
   
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div></div>
    // <aside className=`fixed z-20 sm:static top=0 left-0 h-screen w-80 bg-gray-900 border-r border-gray-700`></aside>
  )
}

export default ChartSideBar