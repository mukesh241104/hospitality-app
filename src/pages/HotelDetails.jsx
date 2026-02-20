import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Star, Wifi, Coffee, Car, Dumbbell, Waves } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export default function HotelDetails() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { compareList, addToCompare, removeFromCompare } = useApp();

    const hotel = state?.hotel;

    if (!hotel) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Hotel Not Found</h2>
                <p className="text-slate-500 mb-8 max-w-md text-lg">We couldn't find the details for this hotel. It might have been removed or you navigated here directly without selecting a hotel.</p>
                <button
                    onClick={() => navigate('/')}
                    className="btn-primary flex items-center gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Search
                </button>
            </div>
        );
    }

    const name = hotel.name?.content || hotel.name || 'Unknown Hotel';
    const rating = hotel.categoryCode ? parseInt(hotel.categoryCode[0], 10) : 4;
    const address = hotel.address?.content || 'Central Location';
    const city = hotel.city?.content || 'Unknown City';
    const price = hotel.minRate || Math.floor(Math.random() * 200) + 50;

    let description = "Experience unparalleled comfort and exceptional service at our stunning property. Whether you're traveling for business or leisure, we offer top-tier amenities, elegantly appointed rooms, and a prime location to explore everything the city has to offer.";
    if (typeof hotel.description === 'string') {
        description = hotel.description;
    } else if (hotel.description?.content) {
        description = hotel.description.content;
    } else if (hotel.desc) {
        description = hotel.desc;
    }

    const generateSeed = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
        return Math.abs(hash % 1000);
    };
    const imageSeed = hotel.code ? generateSeed(hotel.code.toString()) : Math.floor(Math.random() * 1000);

    const hasRealImage = hotel.images && hotel.images.length > 0;
    const imageUrl = hasRealImage
        ? `https://photos.hotelbeds.com/giata/original/${hotel.images[0].path}`
        : `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=800&fit=crop&auto=format&q=80&sig=${imageSeed}`;

    const isCompared = compareList.some(h => h.code === hotel.code);

    const toggleCompare = () => {
        if (isCompared) {
            removeFromCompare(hotel.code);
        } else {
            addToCompare(hotel);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="pb-16 max-w-5xl mx-auto"
        >
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 text-brand-600 hover:text-brand-700 font-medium mb-6 transition-colors"
            >
                <ArrowLeft className="h-4 w-4" /> Back
            </button>

            {/* Hero Image Container */}
            <div className="relative h-[400px] sm:h-[500px] w-full rounded-3xl overflow-hidden mb-8 shadow-lg">
                <img
                    src={imageUrl}
                    alt={name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 text-white">
                    <div className="flex items-center gap-1 text-amber-400 mb-3">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-5 w-5 ${i < rating ? 'fill-current' : 'text-slate-400'}`} />
                        ))}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 leading-tight">{name}</h1>
                    <div className="flex items-center text-slate-200 text-lg">
                        <MapPin className="h-5 w-5 mr-2 flex-shrink-0" />
                        <span>{address}, {city}</span>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">About the Property</h2>
                        <p className="text-slate-600 leading-relaxed text-lg">{description}</p>
                    </section>

                    <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Popular Amenities</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                            <div className="flex items-center gap-3 text-slate-700">
                                <div className="p-2.5 bg-brand-50 text-brand-600 rounded-xl"><Wifi className="h-5 w-5" /></div>
                                <span className="font-medium">Free WiFi</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-700">
                                <div className="p-2.5 bg-brand-50 text-brand-600 rounded-xl"><Coffee className="h-5 w-5" /></div>
                                <span className="font-medium">Breakfast</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-700">
                                <div className="p-2.5 bg-brand-50 text-brand-600 rounded-xl"><Waves className="h-5 w-5" /></div>
                                <span className="font-medium">Pool</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-700">
                                <div className="p-2.5 bg-brand-50 text-brand-600 rounded-xl"><Dumbbell className="h-5 w-5" /></div>
                                <span className="font-medium">Fitness Center</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-700">
                                <div className="p-2.5 bg-brand-50 text-brand-600 rounded-xl"><Car className="h-5 w-5" /></div>
                                <span className="font-medium">Parking</span>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column: Reservation / Actions */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 sticky top-28">
                        <div className="mb-6 pb-6 border-b border-slate-100">
                            <div className="flex items-end gap-1 mb-1">
                                <span className="text-4xl font-black text-brand-600">${price}</span>
                                <span className="text-slate-500 font-medium pb-1">/ night</span>
                            </div>
                            <p className="text-sm text-slate-400 mt-1">Includes taxes and fees</p>
                        </div>

                        <button className="w-full btn-primary py-4 text-lg mb-4 shadow-xl shadow-brand-500/30">
                            Book Now
                        </button>

                        <button
                            onClick={toggleCompare}
                            className={`w-full py-4 rounded-xl font-bold transition-all duration-200 border-2 ${isCompared
                                ? 'bg-brand-50 text-brand-700 border-brand-200 hover:bg-brand-100 shadow-sm'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                                }`}
                        >
                            {isCompared ? 'Remove from Compare' : 'Add to Compare'}
                        </button>
                    </div>
                </div>

            </div>
        </motion.div>
    );
}
