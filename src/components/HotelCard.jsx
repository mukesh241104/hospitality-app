import { MapPin, Star, Building } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function HotelCard({ hotel, onCompare, isCompared }) {
    const navigate = useNavigate();
    const name = hotel.name?.content || hotel.name || 'Unknown Hotel';
    const address = hotel.address?.content || 'Central Location';
    const rating = hotel.categoryCode ? parseInt(hotel.categoryCode[0], 10) : 4;
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

    const price = hotel.minRate || Math.floor(Math.random() * 200) + 50;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full group"
        >
            <div className="h-56 bg-slate-200 relative overflow-hidden">
                <img
                    src={imageUrl}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-bold text-slate-900 shadow-sm flex items-center">
                    ${price} <span className="text-xs font-medium text-slate-500 ml-1">/night</span>
                </div>
            </div>
            <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-slate-900 line-clamp-2 leading-tight">{name}</h3>
                </div>

                <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < rating ? 'fill-current' : 'text-slate-200'}`} />
                    ))}
                </div>

                <div className="flex items-center text-slate-500 text-sm mb-5">
                    <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0 text-slate-400" />
                    <span className="truncate">{address}</span>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100 flex gap-2">
                    <button
                        onClick={() => navigate(`/hotel/${hotel.code}`, { state: { hotel } })}
                        className="flex-1 py-2 rounded-xl text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm"
                    >
                        View Details
                    </button>
                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onCompare(hotel)}
                        className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all duration-200 border ${isCompared
                            ? 'bg-brand-50 text-brand-700 border-brand-200 hover:bg-brand-100 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                    >
                        {isCompared ? 'Added' : 'Compare'}
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}
