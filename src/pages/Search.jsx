import { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { searchHotels } from '../api/hotelbeds';
import SearchForm from '../components/SearchForm';
import HotelCard from '../components/HotelCard';
import { motion, AnimatePresence } from 'framer-motion';

export default function Search() {
    const { hotels, setHotels, compareList, addToCompare, removeFromCompare } = useApp();
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [currentFilters, setCurrentFilters] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    // Load actual API data on initial mount
    useEffect(() => {
        if (hotels.length === 0) {
            // trigger an empty search to fetch from real API
            handleSearch({ location: '', hotelName: '' });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadMockData = (filters, pageNum) => {
        const locationStr = filters?.location ? filters.location : 'Coastal City';
        const nameStr = filters?.hotelName ? filters.hotelName : 'Luxury Retreat';

        const mocks = Array.from({ length: 8 }).map((_, i) => ({
            code: `mock-${pageNum}-${i}`,
            name: `${nameStr} ${pageNum}-${i + 1}`,
            categoryCode: '5EST',
            address: { content: `123 Ocean Drive, ${locationStr}` },
            minRate: 250 + (i * 40),
        }));

        if (pageNum === 1) {
            setHotels(mocks);
        } else {
            setHotels(prev => [...prev, ...mocks]);
        }
        setHasMore(pageNum < 3); // stop after 3 pages of mock data
    };

    const applyClientSideFilters = (fetchedHotels, filters) => {
        let filtered = [...fetchedHotels];
        if (filters?.location) {
            const loc = filters.location.toLowerCase();
            filtered = filtered.filter(h =>
                h.address?.content?.toLowerCase().includes(loc) ||
                h.city?.content?.toLowerCase().includes(loc) ||
                h.destinationCode?.toLowerCase().includes(loc)
            );
        }
        if (filters?.hotelName) {
            const nameFrag = filters.hotelName.toLowerCase();
            filtered = filtered.filter(h =>
                (h.name?.content || h.name || '').toLowerCase().includes(nameFrag)
            );
        }
        return filtered;
    };

    const handleSearch = async (filters) => {
        setLoading(true);
        setCurrentFilters(filters);
        setPage(1);

        // If no filter values given at all, alert user or just fetch
        // Proceed silently

        try {
            const response = await searchHotels(filters, 1);
            let fetchedHotels = response.hotels || [];

            // Client side filtering since Hotelbeds Content API mock doesn't filter naturally via GET
            fetchedHotels = applyClientSideFilters(fetchedHotels, filters);

            if (fetchedHotels.length > 0) {
                setHotels(fetchedHotels);
                setHasMore(response.hotels?.length === 20); // Check if the raw fetch had a full page
            } else {
                loadMockData(filters, 1);
            }
        } catch (error) {
            console.error(error);
            loadMockData(filters, 1);
        } finally {
            setLoading(false);
        }
    };

    const handleLoadMore = async () => {
        setLoading(true);
        const nextPage = page + 1;
        setPage(nextPage);

        if (!currentFilters) {
            // Simulate loading more mock data if no search was performed
            setTimeout(() => {
                loadMockData(null, nextPage);
                setLoading(false);
            }, 500);
            return;
        }

        try {
            const response = await searchHotels(currentFilters, nextPage);
            let fetchedHotels = response.hotels || [];

            fetchedHotels = applyClientSideFilters(fetchedHotels, currentFilters);

            setHotels(prev => [...prev, ...fetchedHotels]);
            setHasMore(response.hotels?.length === 20);
        } catch (error) {
            loadMockData(currentFilters, nextPage);
        } finally {
            setLoading(false);
        }
    };

    const toggleCompare = (hotel) => {
        const isCompared = compareList.some(h => h.code === hotel.code);
        if (isCompared) {
            removeFromCompare(hotel.code);
        } else {
            if (compareList.length >= 4) {
                return;
            }
            addToCompare(hotel);
        }
    };

    // Stagger children animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="pb-16 relative">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10 text-center max-w-2xl mx-auto pt-4"
            >
                <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
                    Find your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">perfect stay</span>
                </h1>
                <p className="text-lg text-slate-500 font-medium">Search for hotels by specific name or location worldwide.</p>
            </motion.div>

            <SearchForm onSearch={handleSearch} loading={loading && page === 1} />

            {/* Compare Badge floating banner */}
            <AnimatePresence>
                {compareList.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-brand-50/80 backdrop-blur-md border border-brand-200/50 rounded-2xl p-4 mb-10 flex flex-col sm:flex-row justify-between items-center shadow-lg shadow-brand-500/5 sticky top-20 z-10"
                    >
                        <div className="flex items-center gap-3 mb-3 sm:mb-0">
                            <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold">
                                {compareList.length}
                            </div>
                            <p className="text-brand-900 font-medium">
                                Hotels selected for comparison
                            </p>
                        </div>

                        <a href="/compare" className="btn-primary shadow-md w-full sm:w-auto text-center">
                            Compare Now
                        </a>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Results Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10"
            >
                {hotels.map((hotel, index) => (
                    <HotelCard
                        key={`${hotel.code}-${index}`}
                        hotel={hotel}
                        onCompare={toggleCompare}
                        isCompared={compareList.some(h => h.code === hotel.code)}
                    />
                ))}
            </motion.div>

            {/* Empty State */}
            {!loading && hotels.length === 0 && (
                <div className="text-center py-20">
                    <div className="h-24 w-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">🧳</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">No hotels found</h3>
                    <p className="text-slate-500">Try adjusting your filters or searching a different term.</p>
                </div>
            )}

            {/* Load More */}
            {hotels.length > 0 && hasMore && (
                <div className="flex justify-center mt-14">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleLoadMore}
                        disabled={loading}
                        className="bg-white border-2 border-slate-200 text-slate-700 font-semibold px-8 py-3 rounded-full hover:border-brand-300 hover:text-brand-600 transition-colors disabled:opacity-50 shadow-sm"
                    >
                        {loading ? 'Loading...' : 'Load More Results'}
                    </motion.button>
                </div>
            )}
        </div>
    );
}
