
import React, { useState } from 'react';
import { Icons, LOGO, COLORS } from '../constants';
import { Theme, SettingsSubView } from '../types';

interface SettingsViewProps {
  theme: Theme;
  onToggleTheme: () => void;
  onLogout: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ theme, onToggleTheme, onLogout }) => {
  const [subView, setSubView] = useState<SettingsSubView>('main');

  const renderHeader = (title: string) => (
    <header className="flex items-center gap-4 mb-8 sticky top-0 bg-inherit py-4 z-10">
      <button 
        onClick={() => setSubView('main')}
        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
      </button>
      <h1 className="text-2xl font-black tracking-tight">{title}</h1>
    </header>
  );

  // Fix: Made children optional to prevent 'property missing' errors in JSX when using Section.
  const Section = ({ title, children }: { title: string, children?: React.ReactNode }) => (
    <div className="space-y-4 mb-8">
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{title}</h3>
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-50 dark:border-slate-800 shadow-sm overflow-hidden">
        {children}
      </div>
    </div>
  );

  const SettingRow = ({ icon, label, onClick, colorClass, value }: { icon: React.ReactNode, label: string, onClick?: () => void, colorClass: string, value?: string }) => (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all border-b border-slate-50 dark:border-slate-800 last:border-none group"
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-2xl ${colorClass}`}>{icon}</div>
        <div className="text-left">
          <p className="font-bold text-sm">{label}</p>
          {value && <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{value}</p>}
        </div>
      </div>
      <Icons.Plus className="w-5 h-5 text-slate-200 group-hover:text-slate-400 rotate-45 transition-all" />
    </button>
  );

  const ToggleRow = ({ icon, label, sublabel, checked, onChange, colorClass }: { icon: React.ReactNode, label: string, sublabel: string, checked: boolean, onChange: () => void, colorClass: string }) => (
    <div className="w-full flex items-center justify-between p-5 border-b border-slate-50 dark:border-slate-800 last:border-none">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-2xl ${colorClass}`}>{icon}</div>
        <div>
           <p className="font-bold text-sm">{label}</p>
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{sublabel}</p>
        </div>
      </div>
      <button 
        onClick={onChange}
        className={`w-12 h-6 rounded-full transition-all relative ${checked ? 'bg-violet-600' : 'bg-slate-200 dark:bg-slate-700'}`}
      >
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${checked ? 'left-7' : 'left-1'}`} />
      </button>
    </div>
  );

  if (subView === 'account') {
    return (
      <div className="flex flex-col h-full max-w-lg mx-auto w-full px-6 pb-32 animate-in slide-in-from-right-4 duration-300">
        {renderHeader('Account Settings')}
        <Section title="Profile Info">
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Username</label>
              <input type="text" placeholder="@alex_j" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 text-sm outline-none ring-2 ring-transparent focus:ring-violet-200 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
              <input type="email" placeholder="alex@lordgram.com" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 text-sm outline-none ring-2 ring-transparent focus:ring-violet-200 transition-all" />
            </div>
          </div>
        </Section>
        <Section title="Security">
          <SettingRow icon={<Icons.Settings className="w-5 h-5"/>} label="Change Password" colorClass="bg-blue-100 text-blue-600" value="Last changed 3mo ago" />
          <ToggleRow icon={<Icons.Sparkles className="w-5 h-5"/>} label="Two-Factor Auth" sublabel="Secure your account" checked={true} onChange={() => {}} colorClass="bg-emerald-100 text-emerald-600" />
        </Section>
        <Section title="Linked Accounts">
          <SettingRow icon={<Icons.Discovery className="w-5 h-5"/>} label="Google" colorClass="bg-slate-100 text-slate-600" value="Connected as alex.j@gmail.com" />
          <SettingRow icon={<Icons.Discovery className="w-5 h-5"/>} label="Facebook" colorClass="bg-blue-50 text-blue-700" value="Not connected" />
        </Section>
        <button className="w-full p-6 text-red-500 font-black text-xs uppercase tracking-[0.2em] bg-red-50 dark:bg-red-950/20 rounded-[2rem] hover:bg-red-100 transition-all">
          Delete Account Permanently
        </button>
      </div>
    );
  }

  if (subView === 'privacy') {
    return (
      <div className="flex flex-col h-full max-w-lg mx-auto w-full px-6 pb-32 animate-in slide-in-from-right-4 duration-300">
        {renderHeader('Privacy & Security')}
        <Section title="Visibility">
          <ToggleRow icon={<Icons.User className="w-5 h-5"/>} label="Private Profile" sublabel="Only believers see posts" checked={false} onChange={() => {}} colorClass="bg-indigo-100 text-indigo-600" />
          <ToggleRow icon={<Icons.Heart className="w-5 h-5"/>} label="Activity Status" sublabel="Show when you're online" checked={true} onChange={() => {}} colorClass="bg-pink-100 text-pink-600" />
        </Section>
        <Section title="Permissions">
          <SettingRow icon={<Icons.ChatBubble className="w-5 h-5"/>} label="Comment Controls" colorClass="bg-violet-100 text-violet-600" value="Everyone" />
          <SettingRow icon={<Icons.PaperPlane className="w-5 h-5"/>} label="Mention Permissions" colorClass="bg-blue-100 text-blue-600" value="Following Only" />
        </Section>
        <Section title="Safety">
          <SettingRow icon={<Icons.Bell className="w-5 h-5"/>} label="Blocked Users" colorClass="bg-slate-100 text-slate-600" value="12 accounts" />
          <SettingRow icon={<Icons.Calendar className="w-5 h-5"/>} label="Login Activity" colorClass="bg-amber-100 text-amber-600" value="Check suspicious logins" />
        </Section>
      </div>
    );
  }

  if (subView === 'notifications') {
    return (
      <div className="flex flex-col h-full max-w-lg mx-auto w-full px-6 pb-32 animate-in slide-in-from-right-4 duration-300">
        {renderHeader('Notification Settings')}
        <Section title="Push Notifications">
          <ToggleRow icon={<Icons.Heart className="w-5 h-5" filled/>} label="Likes" sublabel="New post reactions" checked={true} onChange={() => {}} colorClass="bg-pink-100 text-pink-600" />
          <ToggleRow icon={<Icons.ChatBubble className="w-5 h-5"/>} label="Comments" sublabel="Replies on your moments" checked={true} onChange={() => {}} colorClass="bg-violet-100 text-violet-600" />
          <ToggleRow icon={<Icons.User className="w-5 h-5"/>} label="New Followers" sublabel="When someone follows you" checked={false} onChange={() => {}} colorClass="bg-blue-100 text-blue-600" />
          <ToggleRow icon={<Icons.Sparkles className="w-5 h-5"/>} label="Meetup Invites" sublabel="Vibe requests from friends" checked={true} onChange={() => {}} colorClass="bg-amber-100 text-amber-600" />
        </Section>
        <Section title="Email Digests">
          <ToggleRow icon={<Icons.PaperPlane className="w-5 h-5"/>} label="Weekly Roundup" sublabel="Best of your circle" checked={false} onChange={() => {}} colorClass="bg-slate-100 text-slate-600" />
          <ToggleRow icon={<Icons.Bell className="w-5 h-5"/>} label="Security Alerts" sublabel="Essential account news" checked={true} onChange={() => {}} colorClass="bg-emerald-100 text-emerald-600" />
        </Section>
      </div>
    );
  }

  if (subView === 'display') {
    return (
      <div className="flex flex-col h-full max-w-lg mx-auto w-full px-6 pb-32 animate-in slide-in-from-right-4 duration-300">
        {renderHeader('Display & Appearance')}
        <Section title="Theme Selection">
          <ToggleRow 
            icon={theme === 'light' ? <Icons.Sun className="w-5 h-5"/> : <Icons.Moon className="w-5 h-5"/>} 
            label="Dark Mode" 
            sublabel="Easy on the eyes" 
            checked={theme === 'dark'} 
            onChange={onToggleTheme} 
            colorClass="bg-slate-900 text-white dark:bg-white dark:text-slate-900" 
          />
        </Section>
        <Section title="Personalization">
          <div className="p-6 space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accent Color</label>
              <div className="flex gap-4">
                 <button className="w-8 h-8 rounded-full bg-violet-500 ring-2 ring-offset-2 ring-violet-500"></button>
                 <button className="w-8 h-8 rounded-full bg-pink-500"></button>
                 <button className="w-8 h-8 rounded-full bg-emerald-500"></button>
                 <button className="w-8 h-8 rounded-full bg-blue-500"></button>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Font Size</label>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                 <button className="flex-1 py-2 text-xs font-bold">Small</button>
                 <button className="flex-1 py-2 text-xs font-black bg-white dark:bg-slate-700 rounded-lg shadow-sm">Standard</button>
                 <button className="flex-1 py-2 text-xs font-bold">Large</button>
              </div>
            </div>
          </div>
        </Section>
        <Section title="Feed Layout">
          <SettingRow icon={<Icons.Discovery className="w-5 h-5"/>} label="Default View" colorClass="bg-indigo-100 text-indigo-600" value="Immersive Cards" />
        </Section>
      </div>
    );
  }

  if (subView === 'sessions') {
    return (
      <div className="flex flex-col h-full max-w-lg mx-auto w-full px-6 pb-32 animate-in slide-in-from-right-4 duration-300">
        {renderHeader('Connected Devices')}
        <Section title="Active Sessions">
          <div className="p-5 border-b border-slate-50 dark:border-slate-800 last:border-none flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              </div>
              <div>
                 <p className="font-black text-sm">iPhone 15 Pro</p>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">This Device • London, UK</p>
              </div>
            </div>
            <span className="text-[9px] font-black bg-emerald-500 text-white px-2 py-1 rounded-full uppercase tracking-widest">Active</span>
          </div>
          <div className="p-5 border-b border-slate-50 dark:border-slate-800 last:border-none flex items-center justify-between opacity-70">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-100 text-slate-600 rounded-2xl">
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l2-1h2l2 1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <div>
                 <p className="font-bold text-sm">MacBook Pro M3</p>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Chrome • Berlin, DE</p>
              </div>
            </div>
            <button className="text-[9px] font-black text-red-500 uppercase tracking-widest hover:underline">Log out</button>
          </div>
        </Section>
        <button className="w-full py-4 text-red-500 font-black text-[10px] uppercase tracking-[0.2em] border-2 border-red-50 dark:border-red-900/20 rounded-[2rem] hover:bg-red-50 transition-all">
          Logout from all devices
        </button>
      </div>
    );
  }

  if (subView === 'advanced') {
    return (
      <div className="flex flex-col h-full max-w-lg mx-auto w-full px-6 pb-32 animate-in slide-in-from-right-4 duration-300">
        {renderHeader('Advanced Settings')}
        <Section title="Data & Content">
          <SettingRow icon={<Icons.Calendar className="w-5 h-5"/>} label="Language" colorClass="bg-blue-100 text-blue-600" value="English (US)" />
          <SettingRow icon={<Icons.Bookmark className="w-5 h-5" filled/>} label="Manage Saved Posts" colorClass="bg-amber-100 text-amber-600" value="248 items" />
          <SettingRow icon={<Icons.PaperPlane className="w-5 h-5"/>} label="Download Your Data" colorClass="bg-slate-100 text-slate-600" value="Export profile, posts & messages" />
        </Section>
        <Section title="Developer">
          <ToggleRow icon={<Icons.Settings className="w-5 h-5"/>} label="Debug Overlay" sublabel="Show performance metrics" checked={false} onChange={() => {}} colorClass="bg-slate-900 text-white" />
        </Section>
        <div className="p-6 text-center opacity-30">
           <p className="text-[9px] font-black uppercase tracking-[0.3em]">Built with Love & Sparkles</p>
           <p className="text-[8px] font-bold uppercase tracking-widest mt-1">© 2024 LordGram Labs</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-lg mx-auto w-full px-6 pt-10 pb-32 animate-in fade-in duration-500">
      <header className="mb-10">
        <h1 className="text-4xl font-black tracking-tighter mb-2">Settings</h1>
        <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">Customize your LordGram life</p>
      </header>

      <div className="space-y-8">
        <section className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Profile Control</h3>
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-50 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden">
            <SettingRow 
              onClick={() => setSubView('account')}
              icon={<Icons.User className="w-5 h-5" />} 
              label="Account Settings" 
              colorClass="bg-violet-100 text-violet-600" 
              value="Identity, Email, Password"
            />
            <SettingRow 
              onClick={() => setSubView('privacy')}
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>} 
              label="Privacy & Security" 
              colorClass="bg-blue-100 text-blue-600" 
              value="Visibility, Safety, Login History"
            />
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">App Vibes</h3>
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-50 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden">
            <SettingRow 
              onClick={() => setSubView('notifications')}
              icon={<Icons.Bell className="w-5 h-5" />} 
              label="Notifications" 
              colorClass="bg-emerald-100 text-emerald-600" 
              value="Push, Email, Meetups"
            />
            <SettingRow 
              onClick={() => setSubView('display')}
              icon={theme === 'light' ? <Icons.Sun className="w-5 h-5" /> : <Icons.Moon className="w-5 h-5" />} 
              label="Display & Appearance" 
              colorClass="bg-amber-100 text-amber-600" 
              value="Dark Mode, Colors, Layout"
            />
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">System</h3>
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-50 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden">
            <SettingRow 
              onClick={() => setSubView('sessions')}
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>} 
              label="Connected Devices" 
              colorClass="bg-indigo-100 text-indigo-600" 
              value="Check where you're logged in"
            />
            <SettingRow 
              onClick={() => setSubView('advanced')}
              icon={<Icons.Settings className="w-5 h-5" />} 
              label="Advanced" 
              colorClass="bg-slate-100 text-slate-600" 
              value="Language, Data, About"
            />
          </div>
        </section>

        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-4 p-6 bg-red-50 dark:bg-red-950/20 text-red-600 rounded-[2.5rem] hover:bg-red-100 transition-all font-black text-xs uppercase tracking-[0.2em]"
        >
          <div className="p-3 bg-red-100 dark:bg-red-900 rounded-2xl">
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </div>
          Logout from LordGram
        </button>
      </div>
      
      <div className="mt-16 text-center space-y-3 opacity-20">
        <div className="flex justify-center">{LOGO}</div>
        <p className="text-[9px] font-black uppercase tracking-[0.4em]">v2.1.0-emerald-city</p>
      </div>
    </div>
  );
};

export default SettingsView;
