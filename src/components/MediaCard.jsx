import { Link } from 'react-router-dom';
import { tmdbService } from '../services/tmdb';

// Mapping des genres
const GENRES = {
    28: 'Action', 12: 'Aventure', 16: 'Animation', 35: 'Comédie', 80: 'Crime',
    99: 'Documentaire', 18: 'Drame', 10751: 'Familial', 14: 'Fantasy', 36: 'Histoire',
    27: 'Horreur', 10402: 'Musique', 9648: 'Mystère', 10749: 'Romance', 878: 'Science-Fiction',
    10770: 'Téléfilm', 53: 'Thriller', 10752: 'Guerre', 37: 'Western',
    10759: 'Action & Adventure', 10762: 'Kids', 10763: 'News', 10764: 'Reality',
    10765: 'Sci-Fi & Fantasy', 10766: 'Soap', 10767: 'Talk', 10768: 'War & Politics'
};

function MediaCard({ item, type }) {
    const posterUrl = tmdbService.getImageUrl(item.poster_path, 'w342');
    const title = type === 'movie' ? item.title : item.name;
    const releaseDate = type === 'movie' ? item.release_date : item.first_air_date;
    const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
    const detailUrl = `/${type}/${item.id}`;
    
    // Récupérer les 2 premiers genres
    const genres = item.genre_ids?.slice(0, 2).map(id => GENRES[id]).filter(Boolean) || [];
    
    return (
        <Link to={detailUrl}>
            <article className="group cursor-pointer">
                <div className="relative overflow-hidden border-2 border-gray-800 bg-black">
                    {posterUrl ? (
                        <img 
                            src={posterUrl} 
                            alt={title}
                            className="w-full aspect-[2/3] object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        />
                    ) : (
                        <div className="w-full aspect-[2/3] bg-gray-900 flex items-center justify-center">
                            <span className="text-gray-600 text-4xl font-display">?</span>
                        </div>
                    )}
                    
                    {/* Badge de note TMDB */}
                    {item.vote_average > 0 && (
                        <div className="absolute top-2 right-2 bg-black/80 border border-gray-700 px-2 py-1">
                            <span className="text-yellow-500 font-display text-sm">★ {item.vote_average.toFixed(1)}</span>
                        </div>
                    )}
                </div>
                
                <div className="mt-3 px-2">
                    <h3 className="font-display text-xl uppercase tracking-wider text-gray-700 mb-1 line-clamp-1">
                        {title}
                    </h3>
                    <p className="font-serif text-sm text-gray-500 mb-1">{releaseYear}</p>
                    {genres.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                            {genres.map((genre, idx) => (
                                <span key={idx} className="text-xs font-display uppercase tracking-wider text-gray-400 bg-gray-200 px-2 py-0.5">
                                    {genre}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </article>
        </Link>
    );
}

export default MediaCard;
