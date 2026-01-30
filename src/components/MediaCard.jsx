import { Link } from 'react-router-dom';
import { tmdbService } from '../services/tmdb';

function MediaCard({ item, type }) {
    const posterUrl = tmdbService.getImageUrl(item.poster_path, 'w342');
    const title = type === 'movie' ? item.title : item.name;
    const releaseDate = type === 'movie' ? item.release_date : item.first_air_date;
    const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
    const detailUrl = `/${type}/${item.id}`;
    
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
                </div>
                
                <div className="mt-3 px-2">
                    <h3 className="font-display text-xl uppercase tracking-wider text-gray-700 mb-1 line-clamp-1">
                        {title}
                    </h3>
                    <p className="font-serif text-sm text-gray-500">{releaseYear}</p>
                </div>
            </article>
        </Link>
    );
}

export default MediaCard;
