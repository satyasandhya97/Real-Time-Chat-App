import { User } from '@/context/AppContext';
import React, { useEffect, useMemo, useRef } from 'react';
import { message } from '@/app/chat/page';
import moment from 'moment';
import { Check, CheckCheck, Lock } from 'lucide-react';

interface ChatMessagesProps {
  selectedUser: string | null;
  messages: message[] | null;
  loggedInUser: User | null;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  selectedUser,
  messages,
  loggedInUser,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const prevSelectedUserRef = useRef<string | null>(null);
  const prevMessagesLengthRef = useRef<number>(0);

  const uniqueMessages = useMemo(() => {
    if (!messages) return [];
    const seen = new Set();
    return messages.filter((msg) => {
      if (!msg?._id) return false;
      if (seen.has(msg._id)) return false;
      seen.add(msg._id);
      return true;
    });
  }, [messages]);

  // Smooth scroll ONLY on new messages, instant jump on chat switch to eliminate swinging/bouncing
  useEffect(() => {
    if (!bottomRef.current) return;

    if (prevSelectedUserRef.current !== selectedUser) {
      prevSelectedUserRef.current = selectedUser;
      prevMessagesLengthRef.current = uniqueMessages.length;
      bottomRef.current.scrollIntoView({ behavior: 'auto' });
      return;
    }

    if (uniqueMessages.length > prevMessagesLengthRef.current) {
      prevMessagesLengthRef.current = uniqueMessages.length;
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedUser, uniqueMessages]);

  if (!selectedUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center chat-wallpaper select-none">
        <div className="w-16 h-16 rounded-full bg-[#202c33] flex items-center justify-center text-emerald-500 mb-4 shadow-md border border-[#2a3942]">
          <Lock className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-semibold text-[#e9edef] mb-2 tracking-tight">
          WhatsApp Web for Desktop
        </h3>
        <p className="text-xs sm:text-sm text-[#8696a0] max-w-md leading-relaxed mb-6">
          Send and receive messages seamlessly without keeping your phone online. Select any conversation from the sidebar to start messaging.
        </p>
        <div className="flex items-center gap-1.5 text-xs text-[#8696a0] bg-[#182229] px-4 py-2 rounded-full border border-[#2a3942] shadow-sm">
          <Lock className="w-3.5 h-3.5 text-emerald-500" />
          <span>End-to-end encrypted</span>
        </div>
      </div>
    );
  }

  // Format date grouping helper
  const getDateLabel = (dateStr: string) => {
    const messageDate = moment(dateStr);
    const today = moment().startOf('day');
    const yesterday = moment().subtract(1, 'days').startOf('day');

    if (messageDate.isSame(today, 'd')) return 'Today';
    if (messageDate.isSame(yesterday, 'd')) return 'Yesterday';
    return messageDate.format('MMMM D, YYYY');
  };

  return (
    <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-10 py-4 space-y-2 chat-wallpaper custom-scrollbar">
      {/* End-to-end encryption notice pill */}
      <div className="flex justify-center mb-4">
        <div className="flex items-center gap-1.5 text-[11px] text-[#ffeecd] bg-[#182229]/95 border border-[#ffeecd]/15 px-3 py-1.5 rounded-lg shadow-sm text-center max-w-md">
          <Lock className="w-3 h-3 text-[#ffeecd] shrink-0" />
          <span>Messages are end-to-end encrypted. No one outside of this chat can read them.</span>
        </div>
      </div>

      {uniqueMessages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-xs text-[#8696a0] bg-[#182229] px-4 py-1.5 rounded-full border border-[#2a3942]">
            No messages yet. Say hello! 👋
          </p>
        </div>
      ) : (
        uniqueMessages.map((msg, index) => {
          const isSentByMe = msg.sender === loggedInUser?._id;
          const previousMsg = index > 0 ? uniqueMessages[index - 1] : null;

          const showDateDivider =
            !previousMsg ||
            !moment(msg.createdAt).isSame(moment(previousMsg.createdAt), 'day');

          return (
            <React.Fragment key={`${msg._id}-${index}`}>
              {showDateDivider && (
                <div className="flex justify-center my-3">
                  <span className="bg-[#182229] text-[#8696a0] text-[11px] font-semibold px-3 py-1 rounded-md border border-[#2a3942] uppercase tracking-wider shadow-sm">
                    {getDateLabel(msg.createdAt)}
                  </span>
                </div>
              )}

              <div
                className={`flex w-full mb-1 ${
                  isSentByMe ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`relative max-w-[85%] sm:max-w-[70%] md:max-w-[60%] rounded-lg px-3 py-1.5 shadow-sm text-sm ${
                    isSentByMe
                      ? 'bg-[#005c4b] text-[#e9edef] rounded-tr-none'
                      : 'bg-[#202c33] text-[#e9edef] rounded-tl-none border border-[#2a3942]/60'
                  }`}
                >
                  {/* Image attachment */}
                  {msg.messageType === 'image' && msg.image && (
                    <div className="rounded-md overflow-hidden my-1 bg-black/20">
                      <img
                        src={msg.image.url}
                        alt="attachment"
                        className="max-h-72 w-auto object-cover rounded-md cursor-pointer hover:opacity-95 transition-opacity"
                        onClick={() => window.open(msg.image?.url, '_blank')}
                      />
                    </div>
                  )}

                  {/* Message text */}
                  {msg.text && (
                    <p className="leading-relaxed break-words whitespace-pre-wrap select-text pr-14 text-sm">
                      {msg.text}
                    </p>
                  )}

                  {/* Timestamp and delivery receipts positioned in-bubble */}
                  <div className="flex items-center justify-end gap-1 float-right -mt-2 -mr-1 pl-2 pt-2 text-[10px] text-[#8696a0] select-none">
                    <span>{moment(msg.createdAt).format('h:mm A')}</span>
                    {isSentByMe && (
                      <span
                        className="inline-flex items-center"
                        title={
                          msg.seen
                            ? msg.seenAt
                              ? `Read at ${moment(msg.seenAt).format('h:mm A')}`
                              : 'Read'
                            : 'Delivered'
                        }
                      >
                        {msg.seen ? (
                          <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                        ) : (
                          <Check className="w-3.5 h-3.5 text-[#8696a0]" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })
      )}
      <div ref={bottomRef} className="h-2" />
    </div>
  );
};

export default ChatMessages;
