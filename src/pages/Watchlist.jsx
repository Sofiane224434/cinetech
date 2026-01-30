import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWatchlist } from '../hooks/useLocalStorage';
import { tmdbService } from '../services/tmdb';

function Watchlist() {
    const { getWatchlist, removeFromWatchlist, updateWatchlistStatus } = useWatchlist();
    const [watchlist, setWatchlist] = useState([]);
    const [filter, setFilter] = useState('all'); // all, to_watch, watching, watched

    useEffect(() => {
        setWatchlist(getWatchlist());
    }, []);

    const handleRemove = (id) => {
        const updated = removeFromWatchlist(id);
        setWatchlist(updated);
    };

    const handleStatusChange = (id, status) => {
        const updated = updateWatchlistStatus(id, status);
        setWatchlist(updated);
    };

    const filteredList = filter === 'all' 
        ? watchlist 
        : watchlist.filter(item => item.status === filter);

    const getStatusLabel = (status) => {
        switch(status) {
            case 'to_watch': return 'À regarder';
            case 'watching': return 'En cours';
            case 'watched': return 'Vu';
            default: return 'À regarder';
        }
    };

    return (
        <div className="vintage-frame">
            <div className="vintage-frame-top"></div>
            
            <div className="max-w-7xl mx-auto px-6 py-12">
                <h1 className="text-6xl font-display uppercase tracking-wider text-gray-600 mb-8">
                    <span className="text-7xl text-gray-800">M</span>a Watchlist
                </h1>

                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-6 py-2 font-display uppercase tracking-wider border-2 border-gray-800 transition-colors ${
                            filter === 'all' ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600 hover:bg-gray-800 hover:text-gray-300'
                        }`}
                    >
                        Tous ({watchlist.length})
                    </button>
                    <button
                        onClick={() => setFilter('to_watch')}
                        className={`px-6 py-2 font-display uppercase tracking-wider border-2 border-gray-800 transition-colors ${
                            filter === 'to_watch' ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600 hover:bg-gray-800 hover:text-gray-300'
                        }`}
                    >
                        À regarder ({watchlist.filter(i => i.status === 'to_watch').length})
                    </button>
                    <button
                        onClick={() => setFilter('watching')}
                        className={`px-6 py-2 font-display uppercase tracking-wider border-2 border-gray-800 transition-colors ${
                            filter === 'watching' ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600 hover:bg-gray-800 hover:text-gray-300'
                        }`}
                    >
                        En cours ({watchlist.filter(i => i.status === 'watching').length})
                    </button>
                    <button
                        onClick={() => setFilter('watched')}
                        className={`px-6 py-2 font-display uppercase tracking-wider border-2 border-gray-800 transition-colors ${
                            filter === 'watched' ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600 hover:bg-gray-800 hover:text-gray-300'
                        }`}
                    >
                        Vus ({watchlist.filter(i => i.status === 'watched').length})
                    </button>
                </div>

                {filteredList.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-2xl font-display uppercase tracking-wider text-gray-600 mb-4">
                            Aucun élément dans cette catégorie
                        </p>
                        <p className="font-serif text-gray-600">
                            Commencez à ajouter des films et séries à votre watchlist
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                        {filteredList.map((item) => {
                            const posterUrl = item.poster_path ? tmdbService.getImageUrl(item.poster_path, 'w500') : null;
                            const detailPath = `/${item.type}/${item.id}`;
                            const title = item.title || item.name || 'Sans titre';

                            return (
                                <div key={item.id} className="group">
                                    <Link to={detailPath} className="block mb-3">
                                        {posterUrl ? (
                                            <div className="relative overflow-hidden border-4 border-gray-800 transition-transform hover:scale-105">
                                                <img 
                                                    src={posterUrl} 
                                                    alt={title} 
                                                    className="w-full aspect-[2/3] object-cover grayscale hover:grayscale-0 transition-all"
                                                />
                                            </div>
                                        ) : (
                                            <div className="border-4 border-gray-800">
                                                <div className="w-full aspect-[2/3] bg-gray-300 flex items-center justify-center">
                                                    <span className="text-gray-500 text-4xl">?</span>
                                                </div>
                                            </div>
                                        )}
                                    </Link>
                                    
                                    <h3 className="font-display text-sm uppercase tracking-wider text-gray-700 mb-2">
                                        {title}
                                    </h3>

                                    <select
                                        value={item.status || 'to_watch'}
                                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                                        className="w-full mb-2 px-2 py-1 text-xs font-serif border border-gray-800 bg-white text-gray-700 focus:outline-none focus:border-gray-600"
                                    >
                                        <option value="to_watch">À regarder</option>
                                        <option value="watching">En cours</option>
                                        <option value="watched">Vu</option>
                                    </select>

                                    <button
                                        onClick={() => handleRemove(item.id)}
                                        className="w-full px-2 py-1 text-xs font-display uppercase tracking-wider bg-red-600 text-white hover:bg-red-700 transition-colors"
                                    >
                                        Retirer
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            
            <div className="vintage-frame-bottom"></div>
        </div>
    );
}

export default Watchlist;
