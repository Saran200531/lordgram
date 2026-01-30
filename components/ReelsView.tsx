
import React, { useState } from 'react';
import { Post } from '../types';
import { Icons } from '../constants';

interface ReelsViewProps {
  reels: Post[];
  onPlanMeetup: (post: Post) => void;
}

const ReelsView: React.FC<ReelsViewProps> = ({ reels, onPlanMeetup }) => {
  return (
    <div className="h-[100dvh] w-full bg-black overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
      {reels.map((reel, idx) => (
        <div key={`${reel.id}-${idx}`} className="h-[100dvh] w-full relative snap-start overflow-hidden">
          <img 
            src={reel.contentUrl} 
            alt={reel.caption} 
            className="w-full h-full object-cover"
          />
          
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70 pointer-events-none" />

          {/* Right Actions - Vertically Centered relative to view */}
          <div className="absolute right-4 bottom-[20%] flex flex-col gap-6 items-center z-20">
            <button className="flex flex-col items-center gap-1 group">
              <div className="p-4 bg-white/10 backdrop-blur-lg rounded-full text-white active:scale-90 transition-transform">
                <Icons.Heart className="w-7 h-7" />
              </div>
              <span className="text-white text-[10px] font-black shadow-sm uppercase">{reel.likes > 999 ? (reel.likes/1000).toFixed(1)+'k' : reel.likes}</span>
            </button>
            
            <button className="flex flex-col items-center gap-1 group">
              <div className="p-4 bg-white/10 backdrop-blur-lg rounded-full text-white active:scale-90 transition-transform">
                <Icons.ChatBubble className="w-7 h-7" />
              </div>
              <span className="text-white text-[10px] font-black uppercase">{reel.comments.length}</span>
            </button>

            <button 
              onClick={() => onPlanMeetup(reel)}
              className="flex flex-col items-center gap-1 group"
            >
              <div className="p-4 bg-violet-600 rounded-full text-white shadow-2xl shadow-violet-600/50 active:scale-95 transition-transform">
                <Icons.Sparkles className="w-7 h-7" />
              </div>
              <span className="text-violet-300 text-[9px] font-black uppercase tracking-[0.2em] mt-1">Vibe</span>
            </button>
          </div>

          {/* Bottom Info */}
          <div className="absolute bottom-[12%] left-4 right-20 z-10 text-white animate-in slide-in-from-left-4 duration-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-0.5 rounded-full bg-gradient-to-tr from-violet-500 to-pink-500 shadow-xl">
                <img src={reel.user.avatar} className="w-11 h-11 rounded-full border-2 border-white/20 object-cover" />
              </div>
              <div className="flex flex-col">
                 <div className="flex items-center gap-1">
                    <span className="font-black text-sm tracking-tight">@{reel.user.username}</span>
                    {reel.user.isVerified && <div className="text-blue-400 bg-white rounded-full p-0.5"><svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg></div>}
                 </div>
                 <button className="text-[10px] font-black uppercase text-violet-400 tracking-widest text-left">Follow</button>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-4 opacity-90 line-clamp-2 pr-6">{reel.caption}</p>
            <div className="flex items-center gap-2">
               <Icons.Sparkles className="w-3 h-3 text-violet-400" />
               <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Original Audio • Trend Music</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReelsView;
