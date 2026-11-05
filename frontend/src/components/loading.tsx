import React from 'react';

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0b141a]">
      <div className="relative flex items-center justify-center mb-4">
        <div className="w-12 h-12 rounded-full border-3 border-emerald-500/20 border-t-emerald-500 animate-spin" />
      </div>
      <p className="text-xs uppercase tracking-widest text-gray-400 font-medium">Loading WhatsApp...</p>
    </div>
  );
};

export default Loading;