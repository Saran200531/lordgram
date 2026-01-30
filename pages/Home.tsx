import React, { useState } from 'react';
import { View, Post, Notification, User, Theme } from '../types';
import { Icons, LOGO, COLORS } from '../constants';
import { MOCK_POSTS, CURRENT_USER, MOCK_NOTIFICATIONS, MOCK_STORIES, MOCK_USERS } from '../services/mockData';
import FeedItem from '../components/FeedItem';
import CreatePostModal from '../components/CreatePostModal';
import MeetupModal from '../components/MeetupModal';
import ProfileView from '../components/ProfileView';
import NotificationList from '../components/NotificationList';
import ReelsView from '../components/ReelsView';
import MessagesView from '../components/MessagesView';
import StoriesBar from '../components/StoriesBar';
import SettingsView from '../components/SettingsView';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
    const { logout, user: authUser } = useAuth();
    const [activeView, setActiveView] = useState<View>('feed');
    const [theme, setTheme] = useState<Theme>('light');
    // Use MOCK data for now, but in real app we'd fetch from Firestore
    const [user, setUser] = useState<User>(CURRENT_USER);
    const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
    const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedPostForMeetup, setSelectedPostForMeetup] = useState<Post | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

    const handleCreatePost = (newPost: Post) => {
        setPosts([newPost, ...posts]);
        setIsCreateModalOpen(false);
        setActiveView('feed');
    };

    const handlePlanMeetup = (post: Post) => {
        setSelectedPostForMeetup(post);
    };

    const handleEditProfile = (updates: Partial<User>) => {
        setUser(prev => ({ ...prev, ...updates }));
    };

    const reels = posts.filter(p => p.type === 'reel');
    const suggestedPosts = [...posts, ...posts].map((p, i) => ({ ...p, id: `suggested-${i}` }));

    // Consistent Header for Feed, Discovery, and Notifications
    const renderTopBar = () => {
        if (activeView === 'reels' || activeView === 'messages' || activeView === 'profile' || activeView === 'settings') return null;

        return (
            <header className={`fixed top-0 left-0 right-0 z-[50] flex justify-center w-full px-4 pt-safe transition-all ${theme === 'dark' ? 'bg-slate-950/80' : 'bg-white/80'} backdrop-blur-md border-b ${theme === 'dark' ? 'border-slate-900' : 'border-slate-100'}`}>
                <div className="flex justify-between items-center h-16 w-full max-w-lg">
                    {LOGO}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveView('messages')}
                            className={`p-2.5 text-white rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all relative ${COLORS.gradient}`}
                        >
                            <Icons.ChatBubble className="w-6 h-6" />
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[10px] font-black">2</div>
                        </button>
                    </div>
                </div>
            </header>
        );
    };

    const renderContent = () => {
        switch (activeView) {
            case 'feed':
                return (
                    <div className="flex flex-col gap-4 pb-32 max-w-lg mx-auto w-full px-4 pt-20">
                        <StoriesBar stories={MOCK_STORIES} currentUser={user} />
                        <div className="space-y-6">
                            {posts.filter(p => p.visibility === 'friends').map(post => (
                                <FeedItem key={post.id} post={post} onPlanMeetup={() => handlePlanMeetup(post)} />
                            ))}
                        </div>
                    </div>
                );
            case 'reels':
                return <ReelsView reels={[...reels, ...reels, ...reels]} onPlanMeetup={handlePlanMeetup} />;
            case 'discovery':
                return (
                    <div className="flex flex-col gap-4 pb-32 max-w-lg mx-auto w-full px-4 pt-20">
                        <header className="py-4">
                            <h1 className="text-3xl font-black tracking-tight">Discover</h1>
                            <div className="mt-4 relative group">
                                <Icons.Search className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Find magic, people, vibes..."
                                    className="w-full bg-white border-2 border-slate-50 py-4 pl-12 pr-4 rounded-[1.5rem] outline-none focus:border-violet-100 focus:ring-4 focus:ring-violet-500/5 transition-all shadow-sm"
                                />
                            </div>
                        </header>

                        <section className="animate-in fade-in duration-700">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Creators to Follow</h2>
                                <button className="text-[10px] font-black text-violet-500 uppercase tracking-widest">See All</button>
                            </div>
                            <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide px-1">
                                {MOCK_USERS.map(u => (
                                    <div key={u.id} className="flex flex-col items-center bg-white p-5 rounded-[2rem] border border-slate-50 shadow-sm min-w-[150px] hover:shadow-md transition-shadow cursor-pointer">
                                        <div className={`p-0.5 rounded-full ${COLORS.gradient} mb-3`}>
                                            <img src={u.avatar} className="w-14 h-14 rounded-full border-2 border-white" />
                                        </div>
                                        <p className="font-black text-xs text-center truncate w-full">@{u.username}</p>
                                        <p className="text-[9px] text-slate-400 mb-4 font-bold uppercase tracking-tight">Based on your vibes</p>
                                        <button className="w-full py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase rounded-xl hover:opacity-90 transition-opacity">Follow</button>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Trending Globally</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {suggestedPosts.map((post, idx) => (
                                    <div
                                        key={post.id + idx}
                                        className={`relative rounded-3xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all ${idx % 3 === 0 ? 'row-span-2' : 'aspect-square'}`}
                                        onClick={() => setActiveView('reels')}
                                    >
                                        <img
                                            src={`https://picsum.photos/seed/${post.id}-${idx}/800/1200`}
                                            alt=""
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <img src={post.user.avatar} className="w-6 h-6 rounded-full border border-white/40" />
                                                <p className="text-white text-[10px] font-black truncate">@{post.user.username}</p>
                                            </div>
                                            <p className="text-[9px] text-white/70 font-bold uppercase tracking-widest">Trending</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                );
            case 'messages':
                return <MessagesView />;
            case 'notifications':
                return (
                    <div className="flex flex-col gap-4 pb-32 max-w-lg mx-auto w-full px-4 pt-20">
                        <header className="py-4">
                            <h1 className="text-3xl font-black tracking-tight">Activity</h1>
                        </header>
                        <NotificationList notifications={notifications} />
                    </div>
                );
            case 'profile':
                return (
                    <div className="max-w-2xl mx-auto w-full pt-safe">
                        <header className="flex justify-end p-4 fixed top-0 right-0 z-50 pt-safe">
                            <button
                                onClick={() => setActiveView('settings')}
                                className="p-3 bg-white/20 backdrop-blur rounded-2xl shadow-sm text-white"
                            >
                                <Icons.Settings className="w-6 h-6" />
                            </button>
                        </header>
                        <ProfileView user={user} posts={posts.filter(p => p.userId === user.id)} onEdit={handleEditProfile} />
                    </div>
                );
            case 'settings':
                return <SettingsView theme={theme} onToggleTheme={toggleTheme} onLogout={logout} />;
            default:
                return null;
        }
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 font-sans ${activeView === 'reels' ? 'bg-black' : (theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-950')}`}>
            {renderTopBar()}

            <main className="mx-auto">
                {renderContent()}
            </main>

            {/* Navigation */}
            <nav className={`fixed bottom-0 left-0 right-0 border-t px-6 py-4 pb-safe z-50 transition-all ${activeView === 'reels' ? 'bg-black/80 backdrop-blur-xl border-white/5' : (theme === 'dark' ? 'bg-slate-950/90 border-slate-900' : 'bg-white/90 backdrop-blur-xl border-slate-100 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]')}`}>
                <div className="max-w-xl mx-auto flex justify-between items-center">
                    <button
                        onClick={() => setActiveView('feed')}
                        className={`flex flex-col items-center gap-1 transition-all group ${activeView === 'feed' ? 'text-violet-600 scale-110' : 'text-slate-400'}`}
                    >
                        <Icons.Home className={`w-6 h-6 ${activeView === 'feed' ? 'fill-current' : ''}`} />
                        <span className="text-[9px] font-black uppercase tracking-widest hidden xs:block">Home</span>
                    </button>

                    <button
                        onClick={() => setActiveView('discovery')}
                        className={`flex flex-col items-center gap-1 transition-all group ${activeView === 'discovery' ? 'text-violet-600 scale-110' : 'text-slate-400'}`}
                    >
                        <Icons.Discovery className={`w-6 h-6 ${activeView === 'discovery' ? 'fill-current' : ''}`} />
                        <span className="text-[9px] font-black uppercase tracking-widest hidden xs:block">Explore</span>
                    </button>

                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className={`flex items-center justify-center w-14 h-14 text-white rounded-[1.5rem] shadow-2xl -mt-10 hover:scale-110 active:scale-90 transition-all ${COLORS.gradient} shadow-violet-500/40`}
                    >
                        <Icons.Plus className="w-8 h-8 stroke-[3]" />
                    </button>

                    <button
                        onClick={() => setActiveView('reels')}
                        className={`flex flex-col items-center gap-1 transition-all group ${activeView === 'reels' ? 'text-violet-400 scale-110' : 'text-slate-400'}`}
                    >
                        <Icons.Reels className={`w-6 h-6 ${activeView === 'reels' ? 'fill-current' : ''}`} />
                        <span className="text-[9px] font-black uppercase tracking-widest hidden xs:block">Reels</span>
                    </button>

                    <button
                        onClick={() => setActiveView('profile')}
                        className={`flex flex-col items-center gap-1 transition-all group ${activeView === 'profile' ? 'text-violet-600 scale-110' : 'text-slate-400'}`}
                    >
                        <div className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-all ${activeView === 'profile' ? 'border-violet-600 shadow-md' : 'border-transparent opacity-80'}`}>
                            <img src={user.avatar} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest hidden xs:block">You</span>
                    </button>
                </div>
            </nav>

            {/* Modals */}
            {isCreateModalOpen && (
                <CreatePostModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSubmit={handleCreatePost} />
            )}
            {selectedPostForMeetup && (
                <MeetupModal post={selectedPostForMeetup} onClose={() => setSelectedPostForMeetup(null)} />
            )}
        </div>
    );
};

export default Home;
