
import React, { useState } from 'react';
import { Post } from '../types';
import { Icons, COLORS } from '../constants';
import { likePost, unlikePost } from '../services/postService';
import { useAuth } from '../context/AuthContext';

interface FeedItemProps {
  post: Post;
  onPlanMeetup: () => void;
}

const FeedItem: React.FC<FeedItemProps> = ({ post, onPlanMeetup }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(post.likes?.includes(user?.uid || '') || false);
  const [likeCount, setLikeCount] = useState(post.likesCount ?? post.likes?.length ?? 0);
  const [bookmarked, setBookmarked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [reaction, setReaction] = useState<string | null>(null);
  const [showReactions, setShowReactions] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const emojis = ['🔥', '🙌', '😍', '✨', '💯', '🌈'];

  // Handle like/unlike with Firestore integration
  const handleLike = async () => {
    if (!user?.uid || !post.id || isLiking) return;

    setIsLiking(true);
    const wasLiked = liked;

    // Optimistic UI update
    setLiked(!wasLiked);
    setLikeCount(prev => wasLiked ? prev - 1 : prev + 1);

    try {
      if (wasLiked) {
        await unlikePost(post.id, user.uid);
      } else {
        await likePost(post.id, user.uid);
      }
    } catch (error) {
      // Revert on error
      console.error('Like error:', error);
      setLiked(wasLiked);
      setLikeCount(prev => wasLiked ? prev + 1 : prev - 1);
    } finally {
      setIsLiking(false);
    }
  };

  // Handle double-click like on image
  const handleDoubleTapLike = async () => {
    if (!liked) {
      setReaction('❤️');
      await handleLike();
    }
  };

  return (
    <article className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-50 overflow-hidden group hover:shadow-violet-100 transition-all duration-500">
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-0.5 rounded-full ${COLORS.gradient} shadow-sm`}>
            <div className="p-0.5 bg-white rounded-full">
              <img src={post.user.avatar} alt={post.user.name} className="w-10 h-10 rounded-full object-cover" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h3 className="font-black text-sm text-slate-800">{post.user.name}</h3>
              {post.user.isVerified && <div className="text-blue-500"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg></div>}
            </div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">@{post.user.username}</p>
          </div>
        </div>
        <button className="text-slate-200 hover:text-violet-500 transition-colors p-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
          </svg>
        </button>
      </div>

      <div className="relative aspect-square md:aspect-[4/5] w-full bg-slate-50 overflow-hidden">
        <img
          src={post.contentUrl}
          alt=""
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          onDoubleClick={handleDoubleTapLike}
        />

        {liked && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-ping opacity-20">
            <Icons.Heart className="w-32 h-32 text-white" filled />
          </div>
        )}

        {reaction && (
          <div className="absolute top-4 left-4 bg-white/80 backdrop-blur px-3 py-1.5 rounded-full shadow-lg font-black text-sm animate-bounce">
            {reaction}
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="p-7">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <button
                onMouseEnter={() => setShowReactions(true)}
                onMouseLeave={() => setShowReactions(false)}
                onClick={handleLike}
                disabled={isLiking}
                className={`flex items-center gap-1.5 transition-all ${liked ? 'text-pink-500 scale-110' : 'text-slate-300 hover:text-pink-500 hover:scale-110'} ${isLiking ? 'opacity-50' : ''}`}
              >
                <Icons.Heart className="w-7 h-7" filled={liked} />
                <span className="text-xs font-black">{likeCount}</span>
              </button>

              {showReactions && (
                <div
                  onMouseEnter={() => setShowReactions(true)}
                  onMouseLeave={() => setShowReactions(false)}
                  className="absolute bottom-10 left-0 bg-white/90 backdrop-blur-xl border border-slate-50 rounded-full p-2 flex gap-3 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300 z-30"
                >
                  {emojis.map(e => (
                    <button key={e} onClick={() => { setReaction(e); if (!liked) handleLike(); setShowReactions(false); }} className="hover:scale-150 transition-transform text-xl">{e}</button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-1.5 text-slate-300 hover:text-violet-500 hover:scale-110 transition-all"
            >
              <Icons.ChatBubble className="w-7 h-7" />
              <span className="text-xs font-black">{post.comments.length}</span>
            </button>
            <button className="flex items-center gap-1.5 text-slate-300 hover:text-blue-500 hover:scale-110 transition-all">
              <Icons.PaperPlane className="w-7 h-7" />
            </button>
          </div>

          <button
            onClick={() => setBookmarked(!bookmarked)}
            className={`transition-all ${bookmarked ? 'text-amber-400 scale-110' : 'text-slate-200 hover:text-amber-400 hover:scale-110'}`}
          >
            <Icons.Bookmark className="w-7 h-7" filled={bookmarked} />
          </button>
        </div>

        <div className="space-y-3">
          <div className="text-sm leading-relaxed text-slate-700">
            <span className="font-black text-slate-900 mr-2">@{post.user.username}</span>
            <span className="opacity-90">{post.caption}</span>
            {post.hashtags && (
              <div className="flex flex-wrap gap-2 mt-2">
                {post.hashtags.map(tag => (
                  <span key={tag} className="text-violet-600 font-bold hover:underline cursor-pointer">#{tag}</span>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center justify-between pt-1">
            <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.2em]">Active 2h ago</p>
            <button
              onClick={onPlanMeetup}
              className="text-[10px] font-black text-violet-600 uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all px-4 py-2 bg-violet-50 rounded-full"
            >
              Vibe Together <Icons.Sparkles className="w-3 h-3" />
            </button>
          </div>
        </div>

        {showComments && post.comments.length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-50 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
            {post.comments.map(comment => (
              <div key={comment.id} className="text-sm flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-slate-100 shrink-0"></div>
                <div className="space-y-0.5">
                  <p className="font-black text-slate-900 text-xs">@{comment.username}</p>
                  <p className="text-slate-500">{comment.text}</p>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-3 mt-4 bg-slate-50 p-3 rounded-[1.5rem] border border-slate-100 group-focus-within:border-violet-100 transition-all">
              <input
                type="text"
                placeholder="Share your thoughts..."
                className="flex-1 text-xs bg-transparent border-none outline-none font-medium"
              />
              <button className="text-violet-600 font-black text-[10px] uppercase tracking-widest px-2">Post</button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default FeedItem;
