
import React, { useState } from 'react';
import { Post, Visibility } from '../types';
import { generateCaption } from '../services/geminiService';
import { Icons } from '../constants';
import { CURRENT_USER } from '../services/mockData';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (post: Post) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [caption, setCaption] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [visibility, setVisibility] = useState<Visibility>('friends');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMagicCaption = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    const suggested = await generateCaption(prompt);
    setCaption(suggested);
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview) return;

    const newPost: Post = {
      id: Math.random().toString(36).substr(2, 9),
      userId: CURRENT_USER.id,
      user: CURRENT_USER,
      type: 'image',
      contentUrl: imagePreview,
      caption,
      likes: [],
      likesCount: 0,
      comments: [],
      visibility,
      createdAt: new Date().toISOString(),
    };

    onSubmit(newPost);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white rounded-3xl w-full max-w-md relative shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-lg">New Post</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Content</label>
            {!imagePreview ? (
              <div className="border-2 border-dashed border-slate-200 rounded-2xl h-48 flex flex-col items-center justify-center gap-2 hover:border-emerald-400 transition-colors cursor-pointer group">
                <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*,video/*" />
                <Icons.Plus className="w-10 h-10 text-slate-300 group-hover:text-emerald-500" />
                <p className="text-sm text-slate-400">Click to upload image or video</p>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden group">
                <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                <button
                  onClick={() => setImagePreview(null)}
                  className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full hover:bg-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Caption</label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write something authentic..."
                className="w-full border-slate-200 border rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent min-h-[80px] outline-none transition-all"
              />
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-emerald-700">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.394a.75.75 0 0 1 0 1.424l-1.183.394a1.5 1.5 0 0 0-.948.948l-.394 1.183a.75.75 0 0 1-1.424 0l-.394-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.394a.75.75 0 0 1 0-1.424l1.183-.394a1.5 1.5 0 0 0 .948-.948l.394-1.183A.75.75 0 0 1 16.5 15Z" clipRule="evenodd" />
                </svg>
                <span className="text-xs font-bold uppercase tracking-wide">Gemini Assist</span>
              </div>
              <p className="text-xs text-emerald-600/80">Describe your photo and I'll write a caption for you.</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="E.g. Coffee in a rainy garden"
                  className="flex-1 bg-white border-none text-xs p-2 rounded-lg outline-none ring-1 ring-emerald-200"
                />
                <button
                  type="button"
                  onClick={handleMagicCaption}
                  disabled={isGenerating || !prompt}
                  className="bg-emerald-500 text-white text-xs px-3 py-2 rounded-lg font-bold disabled:opacity-50"
                >
                  {isGenerating ? '...' : 'Magic'}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700">Visibility</span>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setVisibility('friends')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${visibility === 'friends' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500'}`}
              >
                Friends
              </button>
              <button
                type="button"
                onClick={() => setVisibility('public')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${visibility === 'public' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500'}`}
              >
                Public
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={!imagePreview}
            className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-colors disabled:opacity-50"
          >
            Post Moment
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
