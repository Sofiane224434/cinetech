import { tmdbService } from '../services/tmdb';

function MovieCard({ movie }) {
    const posterUrl = tmdbService.getImageUrl(movie.poster_path, 'w342');
    const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
    
    return (
        <article className="group cursor-pointer">
            <div className="relative overflow-hidden border-2 border-gray-800 bg-black">
                {posterUrl ? (
                    <img 
                        src={posterUrl} 
                        alt={movie.title}
                        className="w-full aspect-[2/3] object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                ) : (
                    <div className="w-full aspect-[2/3] bg-gray-900 flex items-center justify-center">
                        <span className="text-gray-600 text-4xl font-display">?</span>
                    </div>
                )}
                
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex items-end p-4 opacity-0 group-hover:opacity-100">
                    <div className="text-white">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-yellow-500 text-xl">★</span>
                            <span className="font-display text-lg">{movie.vote_average.toFixed(1)}</span>
                        </div>
                        <p className="text-sm text-gray-300 line-clamp-3">{movie.overview || 'Aucun résumé disponible.'}</p>
                    </div>
                </div>
            </div>
            
            <div className="mt-3 px-2">
                <h3 className="font-display text-xl uppercase tracking-wider text-gray-700 mb-1 line-clamp-1">
                    {movie.title}
                </h3>
                <p className="font-serif text-sm text-gray-500">{releaseYear}</p>
            </div>
        </article>
    );
}

export default MovieCard;
