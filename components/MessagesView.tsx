
import React, { useState } from 'react';
import { Conversation, Message } from '../types';
import { MOCK_CONVERSATIONS, MOCK_MESSAGES, CURRENT_USER } from '../services/mockData';
import { Icons, COLORS } from '../constants';
import { generateMagicReply } from '../services/geminiService';

const MessagesView: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [magicReplies, setMagicReplies] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: CURRENT_USER.id,
      text,
      timestamp: new Date().toISOString()
    };
    setMessages([...messages, newMsg]);
    setInputText('');
    setMagicReplies([]);
  };

  const loadMagicReplies = async () => {
    if (!messages.length) return;
    setIsGenerating(true);
    const lastMsg = messages[messages.length - 1];
    const replies = await generateMagicReply(lastMsg.text, "A friendly chat about weekend plans.");
    setMagicReplies(replies);
    setIsGenerating(false);
  };

  if (selectedChat) {
    return (
      <div className="flex flex-col h-screen bg-white animate-in slide-in-from-right-4 duration-300">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setSelectedChat(null)} className="p-2 -ml-2 text-slate-400 hover:text-slate-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <div className="relative">
              <img src={selectedChat.participant.avatar} className="w-10 h-10 rounded-full border border-slate-100 shadow-sm" />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex-1">
              <h3 className="font-black text-sm text-slate-900">{selectedChat.participant.name}</h3>
              <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Active Now</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-2xl transition-all">
              <Icons.UserPlus className="w-6 h-6" />
            </button>
            <button className="p-2.5 text-slate-400 hover:text-pink-600 hover:bg-pink-50 rounded-2xl transition-all">
              <Icons.VideoCall className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="text-center py-10 opacity-30">
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">Conversation Started</p>
            <p className="text-[9px] font-bold uppercase tracking-widest mt-1">Today, 10:24 AM</p>
          </div>
          {messages.map((m) => {
            const isMe = m.senderId === CURRENT_USER.id;
            return (
              <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[75%] px-5 py-3 rounded-[1.5rem] text-sm font-medium ${isMe ? 'bg-violet-600 text-white rounded-tr-none shadow-lg shadow-violet-100' : 'bg-slate-100 text-slate-800 rounded-tl-none'}`}>
                  {m.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-slate-100 bg-white/50 backdrop-blur-sm pb-safe">
          {magicReplies.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide animate-in slide-in-from-bottom-4 duration-300">
              {magicReplies.map((reply, i) => (
                <button 
                  key={i} 
                  onClick={() => handleSend(reply)}
                  className="whitespace-nowrap px-4 py-2 bg-violet-50 text-violet-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-violet-100 hover:bg-violet-100 transition-all shadow-sm"
                >
                  {reply}
                </button>
              ))}
            </div>
          )}
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-[1.5rem] border border-slate-100 group-within:border-violet-200 group-within:bg-white transition-all">
            <button 
              onClick={loadMagicReplies} 
              disabled={isGenerating}
              className="p-3 text-violet-500 hover:bg-violet-100 rounded-2xl transition-all active:scale-90"
            >
              <Icons.Sparkles className={`w-6 h-6 ${isGenerating ? 'animate-spin' : ''}`} />
            </button>
            <input 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Message..."
              className="flex-1 bg-transparent text-sm font-medium outline-none px-2 py-2"
              onKeyPress={(e) => e.key === 'Enter' && handleSend(inputText)}
            />
            <button 
              onClick={() => handleSend(inputText)}
              className={`p-3 rounded-2xl transition-all shadow-md active:scale-95 ${inputText.trim() ? COLORS.gradient + ' text-white' : 'bg-slate-200 text-slate-400'}`}
            >
              <Icons.PaperPlane className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-lg mx-auto w-full px-4 pt-10 pb-32 animate-in fade-in duration-500">
      <header className="mb-8 px-2">
        <h1 className="text-4xl font-black tracking-tighter mb-1">Messages</h1>
        <p className="text-slate-400 text-sm font-medium">Connect with your circle</p>
      </header>
      
      <div className="space-y-3">
        {MOCK_CONVERSATIONS.map(chat => (
          <div 
            key={chat.id} 
            className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-50 dark:border-slate-800 rounded-[2rem] hover:shadow-xl hover:shadow-slate-200/40 transition-all cursor-pointer group"
          >
            <div 
              className="flex items-center gap-4 flex-1 overflow-hidden"
              onClick={() => setSelectedChat(chat)}
            >
              <div className="relative shrink-0">
                <div className={`p-0.5 rounded-full ${chat.unreadCount > 0 ? COLORS.gradient : 'bg-slate-100'} shadow-sm`}>
                   <img src={chat.participant.avatar} className="w-14 h-14 rounded-full border-2 border-white object-cover" />
                </div>
                {chat.unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[10px] text-white font-black">
                    {chat.unreadCount}
                  </div>
                )}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <h3 className="font-black text-slate-900 dark:text-white truncate">{chat.participant.name}</h3>
                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest ml-2 shrink-0">{chat.timestamp}</span>
                </div>
                <p className={`text-sm truncate ${chat.unreadCount > 0 ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-400 font-medium'}`}>
                  {chat.lastMessage}
                </p>
              </div>
            </div>

            {/* Quick Actions (User Request) */}
            <div className="flex items-center gap-1 ml-4 border-l border-slate-50 pl-3">
              <button className="p-2.5 text-slate-200 hover:text-violet-500 hover:bg-violet-50 rounded-2xl transition-all">
                <Icons.UserPlus className="w-5 h-5" />
              </button>
              <button className="p-2.5 text-slate-200 hover:text-pink-500 hover:bg-pink-50 rounded-2xl transition-all">
                <Icons.VideoCall className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center opacity-10 flex flex-col items-center gap-4">
         <div className="w-12 h-1 bg-slate-400 rounded-full"></div>
         <p className="text-[10px] font-black uppercase tracking-[0.5em]">End of Inbox</p>
      </div>
    </div>
  );
};

export default MessagesView;
