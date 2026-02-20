import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Hotel, LogOut, Search, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2.5 group">
                            <div className="h-10 w-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform">
                                <Hotel className="h-6 w-6 text-white" />
                            </div>
                            <span className="font-extrabold text-2xl text-slate-900 tracking-tight">Stay<span className="text-brand-600">Sync</span></span>
                        </Link>
                        <div className="hidden sm:ml-10 sm:flex sm:space-x-2">
                            <Link
                                to="/"
                                className={`relative px-4 py-2 text-sm font-bold flex items-center rounded-xl transition-all ${location.pathname === '/' ? 'text-brand-700 bg-brand-50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                                    }`}
                            >
                                <Search className="h-4 w-4 mr-2" />
                                Find Hotels
                            </Link>
                            <Link
                                to="/compare"
                                className={`relative px-4 py-2 text-sm font-bold flex items-center rounded-xl transition-all ${location.pathname === '/compare' ? 'text-brand-700 bg-brand-50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                                    }`}
                            >
                                <BarChart2 className="h-4 w-4 mr-2" />
                                Compare
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center gap-5">
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Logged in as</span>
                            <span className="text-sm font-bold text-slate-700">{user.email}</span>
                        </div>
                        <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleLogout}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                        >
                            <LogOut className="h-4 w-4" />
                            Sign out
                        </motion.button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
