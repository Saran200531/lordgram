import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LOGO, COLORS } from '../constants';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/');
        } catch (err: any) {
            console.error('Login error:', err);
            // Simplify error messages for the user
            if (err.code === 'auth/invalid-credential') {
                setError('Invalid email or password.');
            } else {
                setError('Failed to log in. Please check your connection.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center p-6 bg-slate-50`}>
            <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl shadow-violet-200/50 p-10 space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="flex flex-col items-center gap-2">
                    {LOGO}
                    <p className="text-slate-400 text-sm font-medium">Welcome back.</p>
                </div>

                <div className="space-y-4">
                    {/* Tab Switcher - Visual only since we are on login page */}
                    <div className="flex bg-slate-100 p-1 rounded-2xl">
                        <button
                            className={`flex-1 py-3 rounded-xl text-sm font-black transition-all bg-white shadow-sm text-violet-600`}
                        >
                            Login
                        </button>
                        <Link to="/signup"
                            className={`flex-1 py-3 rounded-xl text-sm font-black transition-all text-slate-400 text-center flex items-center justify-center`}
                        >
                            Sign Up
                        </Link>
                    </div>

                    {error && <div className="p-3 bg-red-50 text-red-500 text-xs font-bold rounded-xl text-center">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="alex@lordgram.com"
                                required
                                className="w-full bg-slate-50 border-2 border-transparent focus:border-violet-200 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full bg-slate-50 border-2 border-transparent focus:border-violet-200 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button type="button" className="text-xs font-bold text-violet-500 hover:text-violet-600 transition-colors">Forgot Password?</button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-[2rem] text-white font-black shadow-xl shadow-violet-200 hover:scale-[1.02] active:scale-[0.98] transition-all mt-4 ${COLORS.gradient} disabled:opacity-70 disabled:cursor-not-allowed`}
                        >
                            {loading ? 'Logging in...' : 'Welcome Back'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
