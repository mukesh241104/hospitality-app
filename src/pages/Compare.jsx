import { useApp } from '../contexts/AppContext';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { Trash2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Compare() {
    const { compareList, removeFromCompare, clearCompareList } = useApp();
    const navigate = useNavigate();

    if (compareList.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="h-32 w-32 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-200"
                >
                    <span className="text-5xl">📊</span>
                </motion.div>
                <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Nothing to Compare</h2>
                <p className="text-slate-500 mb-8 max-w-md text-lg">You haven't added any hotels to compare yet. Head back to search and select up to 4 hotels.</p>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg shadow-brand-500/30 transition-all flex items-center gap-2"
                    onClick={() => navigate('/')}
                >
                    <ArrowLeft className="h-5 w-5" />
                    Back to Search
                </motion.button>
            </div>
        );
    }

    // Format data for Recharts
    const chartData = compareList.map(hotel => ({
        name: (hotel.name?.content || hotel.name || 'Unknown').substring(0, 15) + '...', // truncate for chart fit
        fullName: hotel.name?.content || hotel.name || 'Unknown',
        price: hotel.minRate || Math.floor(Math.random() * 200) + 50, // mock fallback
        rating: hotel.categoryCode ? parseInt(hotel.categoryCode[0], 10) : 4,
    }));

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl border border-slate-700 text-sm">
                    <p className="font-bold mb-1">{payload[0].payload.fullName}</p>
                    <p className="flex items-center gap-1 text-slate-300">
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: payload[0].fill }} />
                        {payload[0].name}: <span className="text-white font-semibold">{payload[0].name === 'Price ($)' ? '$' : ''}{payload[0].value}</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="pb-16">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 mt-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-1.5 text-brand-600 hover:text-brand-700 font-medium mb-4 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back to Search
                    </button>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Compare Stays</h1>
                    <p className="mt-2 text-lg text-slate-500">Analyze prices and ratings side-by-side</p>
                </motion.div>
                <motion.button
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    onClick={clearCompareList}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg font-medium transition-all"
                >
                    Clear All Selections
                </motion.button>
            </div>

            {/* Hotel Visual Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                <AnimatePresence>
                    {compareList.map((hotel) => {
                        const generateSeed = (str) => {
                            let hash = 0;
                            for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
                            return Math.abs(hash % 1000);
                        };
                        const imageSeed = hotel.code ? generateSeed(hotel.code.toString()) : Math.floor(Math.random() * 1000);
                        const hasRealImage = hotel.images && hotel.images.length > 0;
                        const imageUrl = hasRealImage
                            ? `https://photos.hotelbeds.com/giata/original/${hotel.images[0].path}`
                            : `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop&auto=format&q=80&sig=${imageSeed}`;

                        return (
                            <motion.div
                                key={hotel.code}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col items-center text-center relative group"
                            >
                                <div className="w-full h-40 bg-slate-100 rounded-xl mb-5 overflow-hidden shadow-inner">
                                    <img
                                        src={imageUrl}
                                        alt="Hotel"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <h3 className="font-bold text-slate-900 mb-2 leading-snug line-clamp-2">{hotel.name?.content || hotel.name || 'Unknown'}</h3>
                                <p className="text-3xl font-black text-brand-600 mb-6">${hotel.minRate || '150'}</p>

                                <button
                                    onClick={() => removeFromCompare(hotel.code)}
                                    className="mt-auto w-full flex justify-center items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" /> Remove
                                </button>
                            </motion.div>
                        )
                    })}
                </AnimatePresence>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Price Comparison Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8"
                >
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2.5 bg-brand-50 rounded-lg text-brand-600">
                            <span className="text-2xl leading-none">💵</span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800">Rate Comparison</h3>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 20, right: 10, left: 0, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    tick={{ fill: '#94a3b8', fontSize: 13 }}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `$${value}`}
                                    dx={-10}
                                />
                                <Tooltip cursor={{ fill: '#f8fafc' }} content={<CustomTooltip />} />
                                <Bar
                                    dataKey="price"
                                    fill="url(#colorBrand)"
                                    radius={[6, 6, 0, 0]}
                                    name="Price ($)"
                                    maxBarSize={80}
                                    animationDuration={1500}
                                />
                                <defs>
                                    <linearGradient id="colorBrand" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={1} />
                                        <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.8} />
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Rating Comparison Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8"
                >
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2.5 bg-amber-50 rounded-lg text-amber-500">
                            <span className="text-2xl leading-none">⭐</span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800">Star Rating</h3>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 20, right: 10, left: 0, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    domain={[0, 5]}
                                    tick={{ fill: '#94a3b8', fontSize: 13 }}
                                    tickLine={false}
                                    axisLine={false}
                                    dx={-10}
                                />
                                <Tooltip cursor={{ fill: '#f8fafc' }} content={<CustomTooltip />} />
                                <Bar
                                    dataKey="rating"
                                    fill="url(#colorAmber)"
                                    radius={[6, 6, 0, 0]}
                                    name="Stars"
                                    maxBarSize={80}
                                    animationDuration={1500}
                                />
                                <defs>
                                    <linearGradient id="colorAmber" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={1} />
                                        <stop offset="95%" stopColor="#fbbf24" stopOpacity={0.8} />
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
