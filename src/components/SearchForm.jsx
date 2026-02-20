import { useState } from 'react';
import { Search, MapPin, Building } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SearchForm({ onSearch, loading }) {
    const [location, setLocation] = useState('');
    const [hotelName, setHotelName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch({ location, hotelName });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white p-6 md:p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 mb-10"
        >
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">

                {/* Location */}
                <div className="col-span-1 md:col-span-5 relative">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Location</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <MapPin className="h-5 w-5 text-brand-500" />
                        </div>
                        <input
                            type="text"
                            className="w-full border border-slate-200 bg-slate-50/50 rounded-xl pl-11 pr-4 py-3 text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all placeholder:text-slate-400"
                            placeholder="e.g. London, New York..."
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>
                </div>

                {/* Hotel Name */}
                <div className="col-span-1 md:col-span-5 relative">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Hotel Name</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <Building className="h-5 w-5 text-brand-500" />
                        </div>
                        <input
                            type="text"
                            className="w-full border border-slate-200 bg-slate-50/50 rounded-xl pl-11 pr-4 py-3 text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all placeholder:text-slate-400"
                            placeholder="e.g. Hilton, Marriott..."
                            value={hotelName}
                            onChange={(e) => setHotelName(e.target.value)}
                        />
                    </div>
                </div>

                {/* Search Button */}
                <div className="col-span-1 md:col-span-2 h-[46px]">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="w-full h-full bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl shadow-lg shadow-brand-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Search className="h-5 w-5" />
                                <span>Search</span>
                            </>
                        )}
                    </motion.button>
                </div>
            </form>
        </motion.div>
    );
}
