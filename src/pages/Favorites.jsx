import { useState, useEffect } from 'react';
import MediaCard from '../components/MediaCard';
import { useFavorites } from '../hooks/useLocalStorage';

function Favorites() {
    const [favorites, setFavorites] = useState([]);
    const { getFavorites, removeFavorite } = useFavorites();

    useEffect(() => {
        setFavorites(getFavorites());
    }, []);

    const handleRemove = (id) => {
        const updated = removeFavorite(id);
        setFavorites(updated);
    };

    if (favorites.length === 0) {
        return (
            <div className="vintage-frame">
                <div className="vintage-frame-top"></div>
                <div className="max-w-7xl mx-auto px-6 py-20 text-center">
                    <h1 className="text-6xl font-display uppercase tracking-wider text-gray-600 mb-8">
                        <span className="text-7xl text-gray-800">M</span>es <span className="text-7xl text-gray-800">F</span>avoris
                    </h1>
                    <div className="border-2 border-gray-300 p-12 bg-white">
                        <p className="font-serif text-xl text-gray-600 mb-4">
                            Vous n'avez pas encore de favoris.
                        </p>
                        <p className="font-serif text-gray-500">
                            Explorez nos films et séries pour en ajouter !
                        </p>
                    </div>
                </div>
                <div className="vintage-frame-bottom"></div>
            </div>
        );
    }

    return (
        <div className="vintage-frame">
            <div className="vintage-frame-top"></div>
            
            <div className="max-w-7xl mx-auto px-6 py-12">
            <header className="mb-12">
                <h1 className="text-6xl font-display uppercase tracking-wider text-gray-600 mb-4">
                    <span className="text-7xl text-gray-800">M</span>es <span className="text-7xl text-gray-800">F</span>avoris
                </h1>
                <div className="h-1 w-32 bg-gray-400 mb-4"></div>
                <p className="font-serif text-gray-600">{favorites.length} élément{favorites.length > 1 ? 's' : ''}</p>
            </header>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                {favorites.map((item) => (
                    <div key={item.id} className="relative group">
                        <MediaCard item={item} type={item.type} />
                        <button
                            onClick={() => handleRemove(item.id)}
                            className="absolute top-2 right-2 bg-black text-white px-3 py-1 text-sm font-display uppercase opacity-0 group-hover:opacity-100 transition-opacity border border-white"
                        >
                            Retirer
                        </button>
                    </div>
                ))}
            </div>
            </div>
            
            <div className="vintage-frame-bottom"></div>
        </div>
    );
}

export default Favorites;
