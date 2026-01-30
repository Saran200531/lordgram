import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LOGO, COLORS } from '../constants';

const SignUp = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        username: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }
        if (formData.password.length < 6) {
            return setError('Password must be at least 6 characters');
        }

        setLoading(true);
        try {
            const { email, password, ...additionalData } = formData;
            // Remove confirmPassword from data sent to firestore
            const { confirmPassword, ...dataToSave } = additionalData;

            await signup(email, password, {
                displayName: dataToSave.name,
                ...dataToSave
            });
            navigate('/');
        } catch (err: any) {
            console.error('Signup error:', err);
            if (err.code === 'auth/email-already-in-use') {
                setError('Email is already registered.');
            } else {
                setError('Failed to create account.');
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
                    <p className="text-slate-400 text-sm font-medium">Join the community.</p>
                </div>

                <div className="space-y-4">
                    {/* Tab Switcher */}
                    <div className="flex bg-slate-100 p-1 rounded-2xl">
                        <Link to="/login"
                            className={`flex-1 py-3 rounded-xl text-sm font-black transition-all text-slate-400 text-center flex items-center justify-center`}
                        >
                            Login
                        </Link>
                        <button
                            className={`flex-1 py-3 rounded-xl text-sm font-black transition-all bg-white shadow-sm text-violet-600`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {error && <div className="p-3 bg-red-50 text-red-500 text-xs font-bold rounded-xl text-center">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                required
                                className="w-full bg-slate-50 border-2 border-transparent focus:border-violet-200 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="johndoe123"
                                required
                                className="w-full bg-slate-50 border-2 border-transparent focus:border-violet-200 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="alex@lordgram.com"
                                required
                                className="w-full bg-slate-50 border-2 border-transparent focus:border-violet-200 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                minLength={6}
                                className="w-full bg-slate-50 border-2 border-transparent focus:border-violet-200 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                className="w-full bg-slate-50 border-2 border-transparent focus:border-violet-200 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-[2rem] text-white font-black shadow-xl shadow-violet-200 hover:scale-[1.02] active:scale-[0.98] transition-all mt-4 ${COLORS.gradient} disabled:opacity-70 disabled:cursor-not-allowed`}
                        >
                            {loading ? 'Creating Account...' : 'Join LordGram'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
