import { User } from '@/context/AppContext';
import {
  CornerDownLeft,
  CornerUpLeft,
  LogOut,
  MessageSquare,
  MessageSquarePlus,
  Search,
  User as UserIcon,
  X
} from 'lucide-react';
import React, { useState } from 'react';
import moment from 'moment';

interface ChartSideBarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  showAllUsers: boolean;
  setShowAllUsers: (show: boolean | ((prev: boolean) => boolean)) => void;
  users: User[] | null;
  loggedInUser: User | null;
  chats: any[] | null;
  selectedUser: string | null;
  setSelectedUser: (userId: string | null) => void;
  handleLogout: () => void;
  createChat: (user: User) => void;
  onlineUsers: string[];
}

const ChartSideBar: React.FC<ChartSideBarProps> = ({
  sidebarOpen,
  setShowAllUsers,
  setSidebarOpen,
  showAllUsers,
  users,
  loggedInUser,
  chats,
  selectedUser,
  setSelectedUser,
  handleLogout,
  createChat,
  onlineUsers,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Helper to resolve contact name from users list if backend returns "Unknown User"
  const getContactInfo = (chatUser: any, chatUsersArray?: string[]) => {
    let resolved = chatUser;
    if (!resolved || resolved.name === "Unknown User") {
      const otherId = chatUsersArray?.find((id) => id !== loggedInUser?._id) || chatUser?._id;
      const matched = users?.find((u) => u._id === otherId);
      if (matched) {
        resolved = matched;
      }
    }
    const name =
      resolved?.name && resolved.name !== "Unknown User"
        ? resolved.name
        : resolved?.email
        ? resolved.email.split('@')[0]
        : "Contact";

    return {
      name,
      _id: resolved?._id || chatUser?._id,
      email: resolved?.email || "",
    };
  };

  const filteredChats = chats?.filter((chat) => {
    const contact = getContactInfo(chat?.user, chat?.chat?.users);
    if (!searchQuery.trim()) return true;
    const nameMatch = contact.name.toLowerCase().includes(searchQuery.toLowerCase());
    const latestText = chat?.chat?.latestMessage?.text || chat?.chat?.letestMessage?.text;
    const msgMatch = latestText?.toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || msgMatch;
  });

  const filteredUsers = users?.filter((u) => {
    if (u._id === loggedInUser?._id) return false;
    if (!searchQuery.trim()) return true;
    return (
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 w-full md:w-[360px] lg:w-[400px] xl:w-[420px] bg-[#111b21] border-r border-[#2a3942] flex flex-col shrink-0 transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Sidebar Header */}
      <div className="h-16 px-4 bg-[#202c33] border-b border-[#2a3942] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-500/30">
            {loggedInUser?.name ? loggedInUser.name.charAt(0).toUpperCase() : <UserIcon className="w-5 h-5" />}
          </div>
          <div>
            <h1 className="text-base font-semibold text-[#e9edef] tracking-tight">
              {showAllUsers ? "New Chat" : "Chats"}
            </h1>
            <p className="text-xs text-[#8696a0] truncate max-w-[150px]">
              {loggedInUser?.name || "Connected"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setShowAllUsers((prev) => !prev);
              setSearchQuery("");
            }}
            title={showAllUsers ? "Back to chats" : "Start new chat"}
            className={`p-2.5 rounded-full transition-colors flex items-center justify-center cursor-pointer ${
              showAllUsers
                ? "bg-[#2a3942] text-emerald-400 hover:bg-[#32424b]"
                : "text-[#aebac1] hover:text-[#e9edef] hover:bg-[#2a3942]"
            }`}
          >
            {showAllUsers ? <X className="w-5 h-5" /> : <MessageSquarePlus className="w-5 h-5" />}
          </button>

          {/* Mobile close sidebar button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-2.5 rounded-full text-[#aebac1] hover:text-[#e9edef] hover:bg-[#2a3942] transition-colors cursor-pointer"
            title="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-2.5 bg-[#111b21] border-b border-[#2a3942]/70 shrink-0">
        <div className="relative flex items-center bg-[#202c33] rounded-lg px-3 py-1.5 focus-within:ring-1 focus-within:ring-emerald-500/60 transition-all border border-transparent focus-within:border-emerald-500/50">
          <Search className="w-4 h-4 text-[#8696a0] shrink-0 mr-3" />
          <input
            type="text"
            placeholder={showAllUsers ? "Search contacts to chat..." : "Search or start new chat"}
            className="w-full bg-transparent text-sm text-[#e9edef] placeholder-[#8696a0] focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="p-0.5 text-[#8696a0] hover:text-[#e9edef] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Conversation / Contact List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-[#2a3942]/40">
        {showAllUsers ? (
          // Users list for starting new chat
          filteredUsers && filteredUsers.length > 0 ? (
            <div className="py-1">
              <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#8696a0]">
                All Contacts ({filteredUsers.length})
              </div>
              {filteredUsers.map((u) => {
                const isOnline = onlineUsers.includes(u._id);
                return (
                  <button
                    key={u._id}
                    onClick={() => {
                      createChat(u);
                      setSidebarOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-[#202c33] transition-colors group cursor-pointer"
                  >
                    <div className="relative shrink-0">
                      <div className="w-11 h-11 rounded-full bg-[#2a3942] text-[#d1d7db] flex items-center justify-center font-semibold text-base border border-[#374248]">
                        {u.name ? u.name.charAt(0).toUpperCase() : <UserIcon className="w-5 h-5" />}
                      </div>
                      {isOnline && (
                        <span
                          title="Online"
                          className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#111b21]"
                        />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-[#e9edef] text-sm truncate group-hover:text-emerald-400 transition-colors">
                          {u.name}
                        </span>
                        <span className="text-[11px] text-emerald-500/80 font-medium ml-2 shrink-0">
                          {isOnline ? "Online" : "Offline"}
                        </span>
                      </div>
                      <p className="text-xs text-[#8696a0] truncate mt-0.5">{u.email}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-14 h-14 rounded-full bg-[#202c33] flex items-center justify-center mb-3 text-[#8696a0] border border-[#2a3942]">
                <Search className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-[#e9edef]">No contacts found</p>
              <p className="text-xs text-[#8696a0] mt-1 max-w-[200px]">
                {searchQuery ? "Try searching with a different name or email" : "No other users registered yet"}
              </p>
            </div>
          )
        ) : filteredChats && filteredChats.length > 0 ? (
          // Active conversations list
          <div>
            {filteredChats.map((chat) => {
              const contact = getContactInfo(chat?.user, chat?.chat?.users);
              const latestMessage = chat?.chat?.latestMessage || chat?.chat?.letestMessage;
              const isSelected = selectedUser === chat?.chat?._id;
              const isSentByMe = latestMessage?.sender === loggedInUser?._id;
              const unseenCount = isSelected ? 0 : (chat?.chat?.unseenCount || 0);
              const isOnline = onlineUsers.includes(contact._id);

              const formattedTime = latestMessage?.createdAt
                ? moment(latestMessage.createdAt).format("h:mm A")
                : chat?.chat?.updatedAt
                ? moment(chat.chat.updatedAt).format("h:mm A")
                : "";

              return (
                <button
                  key={chat?.chat?._id}
                  onClick={() => {
                    setSelectedUser(chat.chat._id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors relative cursor-pointer border-b border-[#2a3942]/30 ${
                    isSelected
                      ? "bg-[#2a3942]"
                      : "hover:bg-[#202c33]/70"
                  }`}
                >
                  {/* Active bar indicator */}
                  {isSelected && (
                    <span className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-r" />
                  )}

                  {/* Avatar with status indicator */}
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full bg-[#2a3942] text-[#e9edef] flex items-center justify-center font-medium text-lg border border-[#374248]">
                      {contact.name ? (
                        contact.name.charAt(0).toUpperCase()
                      ) : (
                        <UserIcon className="w-6 h-6 text-[#8696a0]" />
                      )}
                    </div>
                    {isOnline && (
                      <span
                        title="Online"
                        className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#111b21]"
                      />
                    )}
                  </div>

                  {/* Chat Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span
                        className={`text-sm font-semibold truncate ${
                          isSelected ? "text-white" : "text-[#e9edef]"
                        }`}
                      >
                        {contact.name}
                      </span>
                      {formattedTime && (
                        <span
                          className={`text-[11px] shrink-0 font-medium ${
                            unseenCount > 0 ? "text-emerald-400" : "text-[#8696a0]"
                          }`}
                        >
                          {formattedTime}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0 flex-1">
                        {latestMessage && (
                          isSentByMe ? (
                            <CornerUpLeft className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          ) : (
                            <CornerDownLeft className="w-3.5 h-3.5 text-[#8696a0] shrink-0" />
                          )
                        )}
                        <span
                          className={`text-xs truncate ${
                            unseenCount > 0
                              ? "text-[#e9edef] font-medium"
                              : "text-[#8696a0]"
                          }`}
                        >
                          {latestMessage?.text
                            ? latestMessage.text
                            : latestMessage?.image
                            ? "📷 Photo"
                            : "Click to start chatting"}
                        </span>
                      </div>

                      {unseenCount > 0 && (
                        <span className="shrink-0 bg-emerald-500 text-gray-950 text-[11px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 shadow-sm">
                          {unseenCount > 99 ? "99+" : unseenCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-[#202c33] flex items-center justify-center mb-3 text-emerald-500 border border-[#2a3942]">
              <MessageSquare className="w-7 h-7" />
            </div>
            <p className="text-sm font-semibold text-[#e9edef]">
              {searchQuery ? "No chats found" : "No conversations yet"}
            </p>
            <p className="text-xs text-[#8696a0] mt-1 max-w-[220px]">
              {searchQuery
                ? `No conversation matching "${searchQuery}"`
                : "Click the + icon above to start your first conversation"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowAllUsers(true)}
                className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold tracking-wide transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <MessageSquarePlus className="w-4 h-4" />
                Start a New Chat
              </button>
            )}
          </div>
        )}
      </div>

      {/* Sidebar Footer with Logged In User Profile & Logout */}
      <div className="h-16 px-4 bg-[#202c33] border-t border-[#2a3942] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-[#2a3942] text-[#e9edef] flex items-center justify-center font-bold text-xs border border-[#374248] shrink-0">
            {loggedInUser?.name ? loggedInUser.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[#e9edef] truncate">
              {loggedInUser?.name || "My Account"}
            </p>
            <p className="text-[11px] text-[#8696a0] truncate">
              {loggedInUser?.email || ""}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          title="Log out of ChatApp"
          className="p-2 rounded-lg text-[#8696a0] hover:text-red-400 hover:bg-[#2a3942] transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default ChartSideBar;