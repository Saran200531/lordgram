
import React, { useState, useEffect } from 'react';
import { Post } from '../types';
import { suggestMeetupIdeas } from '../services/geminiService';
import { Icons } from '../constants';

interface MeetupModalProps {
  post: Post;
  onClose: () => void;
}

interface MeetupIdea {
  title: string;
  description: string;
  suggestedLocation: string;
}

const MeetupModal: React.FC<MeetupModalProps> = ({ post, onClose }) => {
  const [ideas, setIdeas] = useState<MeetupIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIdea, setSelectedIdea] = useState<number | null>(null);
  const [time, setTime] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    async function fetchIdeas() {
      const suggested = await suggestMeetupIdeas(post.caption, post.type);
      setIdeas(suggested);
      setLoading(false);
    }
    fetchIdeas();
  }, [post]);

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  if (confirmed) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
        <div className="bg-white rounded-3xl w-full max-w-md p-8 text-center space-y-4 animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-10 h-10 text-emerald-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold">Invite Sent!</h2>
          <p className="text-slate-500">Your friends have been notified. Get ready to hang out!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white rounded-3xl w-full max-w-md relative shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="font-bold text-lg">Plan a Meetup</h2>
            <p className="text-xs text-slate-400">Turn this moment into a memory</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="flex gap-4 items-start p-3 bg-slate-50 rounded-2xl">
            <img src={post.contentUrl} alt="" className="w-16 h-16 rounded-lg object-cover" />
            <div>
              <p className="text-xs font-bold text-slate-400">ORIGINAL POST</p>
              <p className="text-sm line-clamp-2 italic">"{post.caption}"</p>
            </div>
          </div>

          <section className="space-y-3">
             <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-emerald-600 uppercase tracking-widest">AI SUGGESTIONS</span>
                <div className="h-px flex-1 bg-emerald-100"></div>
             </div>
             
             {loading ? (
               <div className="space-y-3 animate-pulse">
                 {[1,2,3].map(i => <div key={i} className="h-20 bg-slate-100 rounded-2xl"></div>)}
               </div>
             ) : (
               <div className="grid gap-3">
                 {ideas.map((idea, idx) => (
                   <button 
                    key={idx}
                    onClick={() => setSelectedIdea(idx)}
                    className={`text-left p-4 rounded-2xl border-2 transition-all ${selectedIdea === idx ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                   >
                     <h4 className="font-bold text-sm mb-1">{idea.title}</h4>
                     <p className="text-xs text-slate-500 mb-2">{idea.description}</p>
                     <div className="flex items-center gap-1 text-slate-400">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                          <path fillRule="evenodd" d="m9.69 18.933.003.001C11.89 17.73 15.5 14.833 15.5 10.25a3.5 3.5 0 1 0-7 0c0 4.583 3.61 7.48 5.69 8.683.004 0 .009-.001.013-.001.004 0 .008.001.013.001l.003-.002ZM12 12.75a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" clipRule="evenodd" />
                        </svg>
                        <span className="text-[10px]">{idea.suggestedLocation}</span>
                     </div>
                   </button>
                 ))}
               </div>
             )}
          </section>

          {selectedIdea !== null && (
            <div className="space-y-4 animate-in slide-in-from-bottom-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">When are we going?</label>
                <input 
                  type="datetime-local" 
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full border-slate-200 border rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <button 
                onClick={handleConfirm}
                disabled={!time}
                className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-colors disabled:opacity-50"
              >
                Send Invites
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeetupModal;
