
import React, { useState } from 'react';
import { LOGO, COLORS } from '../constants';

interface AuthViewProps {
  onLogin: () => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 bg-slate-50`}>
      <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl shadow-violet-200/50 p-10 space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center gap-2">
          {LOGO}
          <p className="text-slate-400 text-sm font-medium">Share your world, connect deeply.</p>
        </div>

        <div className="space-y-4">
          <div className="flex bg-slate-100 p-1 rounded-2xl">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${isLogin ? 'bg-white shadow-sm text-violet-600' : 'text-slate-400'}`}
            >
              Login
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${!isLogin ? 'bg-white shadow-sm text-violet-600' : 'text-slate-400'}`}
            >
              Sign Up
            </button>
          </div>

          <div className="space-y-4 pt-4">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                <input type="text" placeholder="John Doe" className="w-full bg-slate-50 border-2 border-transparent focus:border-violet-200 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all" />
              </div>
            )}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
              <input type="email" placeholder="alex@lordgram.com" className="w-full bg-slate-50 border-2 border-transparent focus:border-violet-200 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
              <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border-2 border-transparent focus:border-violet-200 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all" />
            </div>
            {isLogin && (
              <div className="flex justify-end">
                <button className="text-xs font-bold text-violet-500 hover:text-violet-600 transition-colors">Forgot Password?</button>
              </div>
            )}
          </div>

          <button 
            onClick={onLogin}
            className={`w-full py-4 rounded-[2rem] text-white font-black shadow-xl shadow-violet-200 hover:scale-[1.02] active:scale-[0.98] transition-all mt-4 ${COLORS.gradient}`}
          >
            {isLogin ? 'Welcome Back' : 'Join LordGram'}
          </button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <div className="relative flex justify-center text-xs"><span className="px-2 bg-white text-slate-400 font-bold uppercase tracking-widest">Or continue with</span></div>
          </div>

          <div className="flex gap-4">
            <button className="flex-1 flex items-center justify-center gap-2 py-4 border-2 border-slate-50 rounded-2xl hover:bg-slate-50 transition-all font-bold text-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-4 border-2 border-slate-50 rounded-2xl hover:bg-slate-50 transition-all font-bold text-sm">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
