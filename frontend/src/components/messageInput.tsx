import React, { useState } from 'react';
import { Loader2, Paperclip, Send, Smile, X } from 'lucide-react';

interface MessageInputProps {
  selectedUser: string | null;
  message: string;
  setMessage: (message: string) => void;
  handleMessageSend: (e: any, imageFile?: File | null) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  selectedUser,
  message,
  setMessage,
  handleMessageSend,
}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !imageFile) return;

    try {
      setIsUploading(true);
      await handleMessageSend(e, imageFile);
      setImageFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!selectedUser) return null;

  const canSend = Boolean(message.trim() || imageFile) && !isUploading;

  return (
    <div className="bg-[#202c33] border-t border-[#222e35] shrink-0 z-10 flex flex-col">
      {/* Attached image preview banner */}
      {imageFile && (
        <div className="px-4 py-2.5 bg-[#182229] border-b border-[#222e35] flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-[#222e35] bg-black/40 shrink-0">
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Upload preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-[#e9edef] truncate max-w-xs">
                {imageFile.name}
              </p>
              <p className="text-[11px] text-[#8696a0]">
                {(imageFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setImageFile(null)}
            className="p-1.5 rounded-full text-[#8696a0] hover:text-[#e9edef] hover:bg-[#202c33] transition-colors"
            title="Remove attachment"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Composer Controls */}
      <form onSubmit={handleSubmit} className="h-16 px-3 sm:px-4 flex items-center gap-2">
        {/* Emoji Button */}
        <button
          type="button"
          title="Emoji"
          className="p-2 text-[#8696a0] hover:text-[#e9edef] hover:bg-[#2a3942] rounded-full transition-colors shrink-0"
        >
          <Smile className="w-5 h-5" />
        </button>

        {/* Attachment Button */}
        <label
          title="Attach image"
          className="p-2 text-[#8696a0] hover:text-[#e9edef] hover:bg-[#2a3942] rounded-full transition-colors cursor-pointer shrink-0"
        >
          <Paperclip className="w-5 h-5" />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && file.type.startsWith('image/')) {
                setImageFile(file);
              }
            }}
          />
        </label>

        {/* Text Input */}
        <div className="flex-1 min-w-0">
          <input
            type="text"
            className="w-full bg-[#2a3942] text-[#e9edef] placeholder-[#8696a0] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
            placeholder={imageFile ? 'Add a caption...' : 'Type a message'}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!canSend}
          title="Send message"
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 ${
            canSend
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md active:scale-95 cursor-pointer'
              : 'bg-[#2a3942] text-[#8696a0] cursor-not-allowed opacity-50'
          }`}
        >
          {isUploading ? (
            <Loader2 className="w-5 h-5 animate-spin text-white" />
          ) : (
            <Send className="w-4 h-4 ml-0.5" />
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;