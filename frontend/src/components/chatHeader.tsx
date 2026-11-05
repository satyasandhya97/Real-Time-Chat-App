import { User } from '@/context/AppContext';
import { ArrowLeft, MoreVertical, Phone, Search, User as UserIcon } from 'lucide-react';
import React from 'react';

interface ChatHeaderProps {
  user: User | null;
  setSidebarOpen: (open: boolean) => void;
  isTyping: boolean;
  onlineUsers: string[];
  onBack?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  user,
  setSidebarOpen,
  isTyping,
  onlineUsers,
  onBack,
}) => {
  const isOnlineUser = Boolean(user && onlineUsers.includes(user._id));

  const displayName =
    user?.name && user.name !== 'Unknown User'
      ? user.name
      : user?.email
      ? user.email.split('@')[0]
      : 'Contact';

  return (
    <div className="h-16 px-4 bg-[#202c33] border-b border-[#2a3942] flex items-center justify-between shrink-0 z-10 shadow-xs">
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile back button */}
        <button
          onClick={() => {
            if (onBack) onBack();
            setSidebarOpen(true);
          }}
          className="md:hidden p-2 -ml-1 text-[#aebac1] hover:text-[#e9edef] hover:bg-[#2a3942] rounded-full transition-colors cursor-pointer"
          title="Back to chats"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {user ? (
          <>
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-full bg-[#2a3942] text-[#e9edef] flex items-center justify-center font-semibold text-base border border-[#374248]">
                {displayName ? displayName.charAt(0).toUpperCase() : <UserIcon className="w-5 h-5 text-[#8696a0]" />}
              </div>
              {isOnlineUser && (
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#202c33]" />
              )}
            </div>

            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-semibold text-[#e9edef] truncate max-w-[170px] sm:max-w-xs md:max-w-md">
                {displayName}
              </h2>
              <div className="flex items-center gap-1.5 h-4">
                {isTyping ? (
                  <div className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                    <span className="flex gap-0.5">
                      <span className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce" />
                      <span
                        className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.15s' }}
                      />
                      <span
                        className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.3s' }}
                      />
                    </span>
                    <span>typing...</span>
                  </div>
                ) : (
                  <span
                    className={`text-xs font-medium ${
                      isOnlineUser ? 'text-emerald-400' : 'text-[#8696a0]'
                    }`}
                  >
                    {isOnlineUser ? 'online' : 'offline'}
                  </span>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2a3942] flex items-center justify-center text-[#8696a0]">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#8696a0]">Select a chat</h2>
              <p className="text-xs text-[#8696a0]/70">No conversation active</p>
            </div>
          </div>
        )}
      </div>

      {/* Action Icons */}
      {user && (
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            title="Search in chat"
            className="p-2 text-[#aebac1] hover:text-[#e9edef] hover:bg-[#2a3942] rounded-full transition-colors cursor-pointer"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            title="Call"
            className="p-2 text-[#aebac1] hover:text-[#e9edef] hover:bg-[#2a3942] rounded-full transition-colors cursor-pointer"
          >
            <Phone className="w-5 h-5" />
          </button>
          <button
            title="More options"
            className="p-2 text-[#aebac1] hover:text-[#e9edef] hover:bg-[#2a3942] rounded-full transition-colors cursor-pointer"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatHeader;