
import React, { useState } from 'react';
import { User, Post } from '../types';
import { Icons, COLORS } from '../constants';

interface ProfileViewProps {
  user: User;
  posts: Post[];
  onEdit: (updates: Partial<User>) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, posts, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editBio, setEditBio] = useState(user.bio || '');
  const [isFollowing, setIsFollowing] = useState(user.isFollowing || false);

  const handleSave = () => {
    onEdit({ name: editName, bio: editBio });
    setIsEditing(false);
  };

  const isCurrentUser = user.id === 'u1'; // Hardcoded for demo

  return (
    <div className="pb-24 w-full">
      {/* Background Header */}
      <div className="relative h-56 md:h-80 bg-slate-200">
        <img src={user.backgroundImage || 'https://picsum.photos/seed/defaultbg/1200/600'} alt="Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-slate-50/10" />
        {isCurrentUser && (
           <button className="absolute top-4 right-4 p-3 bg-white/80 backdrop-blur rounded-full hover:bg-white transition-all shadow-lg group">
              <Icons.Plus className="w-5 h-5 text-violet-600 group-hover:rotate-90 transition-transform" />
           </button>
        )}
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-20 relative">
        <div className="flex flex-col items-center">
          <div className="relative group">
            <div className={`p-1 rounded-full ${COLORS.gradient} shadow-2xl`}>
              <img src={user.avatar} alt={user.name} className="w-36 h-36 rounded-full border-4 border-white shadow-xl object-cover" />
            </div>
            {isCurrentUser && (
              <button className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg border border-slate-100 hover:scale-110 transition-transform">
                 <Icons.Plus className="w-4 h-4 text-violet-500" />
              </button>
            )}
          </div>

          <div className="mt-6 text-center w-full">
            {isEditing ? (
              <div className="space-y-4 w-full max-w-sm mx-auto bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-50">
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Display Name</label>
                   <input 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full p-3 text-center text-xl font-black rounded-2xl bg-slate-50 focus:bg-white border-2 border-transparent focus:border-violet-200 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Your Bio</label>
                   <textarea 
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="w-full p-3 text-center text-sm rounded-2xl bg-slate-50 focus:bg-white border-2 border-transparent focus:border-violet-200 outline-none transition-all min-h-[100px]"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={handleSave} className="flex-1 bg-violet-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-violet-100 hover:scale-[1.02] active:scale-[0.98] transition-all">Save Changes</button>
                  <button onClick={() => setIsEditing(false)} className="px-6 bg-slate-100 py-4 rounded-2xl font-black text-slate-500 hover:bg-slate-200 transition-all">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <h1 className="text-3xl font-black tracking-tight">{user.name}</h1>
                  {user.isVerified && (
                    <div className="bg-blue-500 p-0.5 rounded-full text-white">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
                    </div>
                  )}
                </div>
                <p className="text-violet-500 text-sm font-black uppercase tracking-[0.2em]">@{user.username}</p>
                <p className="mt-3 text-sm text-slate-500 max-w-sm mx-auto leading-relaxed font-medium">{user.bio}</p>
                
                <div className="mt-8 grid grid-cols-3 gap-8 justify-center border-y border-slate-100 py-6 w-full">
                  <div className="text-center group cursor-pointer">
                    <p className="font-black text-2xl group-hover:text-violet-600 transition-colors">{posts.length}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] mt-1">Moments</p>
                  </div>
                  <div className="text-center group cursor-pointer">
                    <p className="font-black text-2xl group-hover:text-violet-600 transition-colors">{user.followersCount}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] mt-1">Followers</p>
                  </div>
                  <div className="text-center group cursor-pointer">
                    <p className="font-black text-2xl group-hover:text-violet-600 transition-colors">{user.followingCount}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] mt-1">Following</p>
                  </div>
                </div>

                <div className="flex gap-4 mt-8 px-4">
                  {isCurrentUser ? (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="flex-1 bg-white border-2 border-slate-100 py-4 rounded-[2rem] text-sm font-black hover:border-violet-200 hover:text-violet-600 shadow-sm transition-all flex items-center justify-center gap-2"
                    >
                      Customize Profile
                    </button>
                  ) : (
                    <>
                      <button 
                        onClick={() => setIsFollowing(!isFollowing)}
                        className={`flex-[2] py-4 rounded-[2rem] text-sm font-black transition-all shadow-lg ${isFollowing ? 'bg-slate-100 text-slate-600' : `${COLORS.gradient} text-white shadow-violet-200`}`}
                      >
                        {isFollowing ? 'Unfollow' : 'Follow'}
                      </button>
                      <button className="flex-1 bg-white border-2 border-slate-100 py-4 rounded-[2rem] text-sm font-black flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                        Message
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="mt-12 flex justify-center gap-8 border-b border-slate-100 pb-4">
           <button className="text-xs font-black uppercase tracking-widest text-violet-600 border-b-2 border-violet-600 pb-4 -mb-4.5">Moments</button>
           <button className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Tagged</button>
           <button className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Saved</button>
        </div>

        {/* Post Grid */}
        <div className="mt-1 grid grid-cols-3 gap-1 md:gap-2">
          {posts.map(post => (
            <div key={post.id} className="aspect-square relative group cursor-pointer overflow-hidden rounded-xl md:rounded-2xl shadow-sm">
              <img src={post.contentUrl} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white">
                <div className="flex items-center gap-1 font-black text-sm">
                  <Icons.Heart className="w-5 h-5" filled />
                  <span>{post.likes > 999 ? (post.likes/1000).toFixed(1)+'k' : post.likes}</span>
                </div>
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <div className="col-span-3 py-24 text-center space-y-4">
              <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-slate-200">
                <Icons.Plus className="w-10 h-10" />
              </div>
              <div>
                 <p className="text-slate-900 font-black">No Moments Yet</p>
                 <p className="text-slate-400 text-xs font-medium">Be the first to share a vibe!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
