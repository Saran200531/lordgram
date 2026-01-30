
import React from 'react';
import { Story, User } from '../types';
import { COLORS, Icons } from '../constants';

interface StoriesBarProps {
  stories: Story[];
  currentUser: User;
}

const StoriesBar: React.FC<StoriesBarProps> = ({ stories, currentUser }) => {
  return (
    <div className="flex gap-4 overflow-x-auto pb-6 pt-2 px-2 scrollbar-hide">
      {/* Current User Story */}
      <div className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
        <div className="relative">
          <div className="w-16 h-16 rounded-full p-0.5 border-2 border-dashed border-slate-200 group-hover:border-violet-400 transition-colors">
            <img src={currentUser.avatar} alt="You" className="w-full h-full rounded-full object-cover grayscale-[0.2]" />
          </div>
          <div className="absolute bottom-0 right-0 bg-violet-500 text-white rounded-full p-1 border-2 border-white">
            <Icons.Plus className="w-3 h-3" />
          </div>
        </div>
        <span className="text-[10px] font-bold text-slate-500">Your Story</span>
      </div>

      {stories.map(story => (
        <div key={story.id} className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer">
          <div className={`w-16 h-16 rounded-full p-1 ${story.isViewed ? 'border-2 border-slate-200' : `${COLORS.gradient}`}`}>
            <div className="w-full h-full rounded-full border-2 border-white overflow-hidden">
              <img src={story.user.avatar} alt={story.user.name} className="w-full h-full object-cover" />
            </div>
          </div>
          <span className="text-[10px] font-bold text-slate-600 truncate w-16 text-center">{story.user.username}</span>
        </div>
      ))}
    </div>
  );
};

export default StoriesBar;
