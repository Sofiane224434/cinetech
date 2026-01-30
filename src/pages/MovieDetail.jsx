import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MediaCard from '../components/MediaCard';
import { tmdbService } from '../services/tmdb';
import { useFavorites, useComments, useRatings, useWatchlist } from '../hooks/useLocalStorage';

function MovieDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [replyTo, setReplyTo] = useState(null);
    const [trailer, setTrailer] = useState(null);
    
    const { isFavorite, addFavorite, removeFavorite } = useFavorites();
    const { getComments, addComment, deleteComment } = useComments();
    const { getRating, setRating } = useRatings();
    const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
    
    const [isFav, setIsFav] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [isInWatch, setIsInWatch] = useState(false);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const [movieData, videosData] = await Promise.all([
                    tmdbService.getMovieDetails(id),
                    tmdbService.getMovieVideos(id)
                ]);
                setMovie(movieData);
                setIsFav(isFavorite(parseInt(id)));
                setUserRating(getRating(id));
                setIsInWatch(isInWatchlist(parseInt(id)));
                setComments(getComments(id));
                
                // Trouver la bande-annonce (français ou anglais)
                const trailerVideo = videosData.results?.find(
                    v => v.type === 'Trailer' && v.site === 'YouTube'
                ) || videosData.results?.find(
                    v => v.site === 'YouTube'
                );
                setTrailer(trailerVideo);
            } catch (error) {
                console.error('Erreur:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovie();
    }, [id]);

    const handleFavoriteToggle = () => {
        if (isFav) {
            removeFavorite(parseInt(id));
        } else {
            addFavorite({ id: movie.id, title: movie.title, poster_path: movie.poster_path }, 'movie');
        }
        setIsFav(!isFav);
    };

    const handleSubmitComment = (e) => {
        e.preventDefault();
        if (commentText.trim()) {
            const updated = addComment(id, commentText, replyTo);
            setComments(updated);
            setCommentText('');
            setReplyTo(null);
        }
    };

    const handleDeleteComment = (commentId) => {
        const updated = deleteComment(id, commentId);
        setComments(updated);
    };

    const handleRating = (rating) => {
        setRating(id, rating);
        setUserRating(rating);
    };

    const handleWatchlistToggle = () => {
        if (isInWatch) {
            removeFromWatchlist(parseInt(id));
        } else {
            addToWatchlist({ id: movie.id, title: movie.title, poster_path: movie.poster_path }, 'movie');
        }
        setIsInWatch(!isInWatch);
    };

    if (loading) {
        return (
            <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-800 border-t-transparent"></div>
            </div>
        );
    }

    const posterUrl = tmdbService.getImageUrl(movie.poster_path, 'w500');
    const backdropUrl = tmdbService.getImageUrl(movie.backdrop_path, 'w1280');

    return (
        <div className="vintage-frame">
            <div className="vintage-frame-top"></div>
            
            <div>
            {backdropUrl && (
                <div className="relative h-96 mb-12">
                    <img src={backdropUrl} alt={movie.title} className="w-full h-full object-cover grayscale opacity-40" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#f5f5f0] to-transparent"></div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-6 py-12">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-8 px-6 py-3 font-display uppercase tracking-wider bg-gray-800 text-gray-400 hover:text-white transition-colors border-2 border-gray-900 inline-flex items-center gap-2"
                >
                    <span>←</span> Retour
                </button>
                <div className="grid md:grid-cols-3 gap-12 mb-16">
                    <div>
                        {posterUrl && (
                            <img src={posterUrl} alt={movie.title} className="w-full border-4 border-gray-800" />
                        )}
                        
                        {/* Note personnelle verticale */}
                        <div className="mt-4 bg-gray-800 border-2 border-gray-900 p-4 text-center">
                            <p className="text-xs font-display uppercase tracking-wider text-gray-400 mb-2">Ma Note</p>
                            <div className="text-6xl font-display text-yellow-500 mb-2">
                                {userRating > 0 ? userRating : '-'}
                                <span className="text-3xl text-gray-600">/5</span>
                            </div>
                            <div className="flex justify-center gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => handleRating(star)}
                                        className={`text-2xl transition-colors ${
                                            star <= userRating ? 'text-yellow-500' : 'text-gray-600 hover:text-yellow-400'
                                        }`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                            {userRating > 0 && (
                                <button
                                    onClick={() => handleRating(0)}
                                    className="text-xs text-gray-500 hover:text-gray-300 font-serif"
                                >
                                    Effacer ma note
                                </button>
                            )}
                        </div>
                        
                        <button
                            onClick={handleFavoriteToggle}
                            className="w-full mt-4 px-6 py-3 font-display uppercase tracking-wider bg-black text-gray-400 hover:text-white transition-colors border-2 border-gray-800"
                        >
                            {isFav ? '★ Retirer des favoris' : '☆ Ajouter aux favoris'}
                        </button>
                        
                        <button
                            onClick={handleWatchlistToggle}
                            className="w-full mt-2 px-6 py-3 font-display uppercase tracking-wider bg-gray-700 text-gray-400 hover:text-white transition-colors border-2 border-gray-800"
                        >
                            {isInWatch ? '✓ Dans ma watchlist' : '+ Ajouter à ma watchlist'}
                        </button>
                        
                        {/* Note IMDB verticale */}
                        <div className="mt-4 bg-yellow-500 border-4 border-gray-800 p-6 text-center flex flex-col justify-center" style={{ minHeight: '240px' }}>
                            <p className="text-xs font-display uppercase tracking-wider text-gray-800 mb-2">Note IMDB</p>
                            <div className="flex-1 flex flex-col justify-center">
                                <div className="text-8xl font-display text-gray-900 leading-none">
                                    {movie.vote_average.toFixed(1)}
                                </div>
                                <div className="text-3xl font-display text-gray-700 mt-2">/10</div>
                            </div>
                            <p className="text-xs font-serif text-gray-700 mt-4">{movie.vote_count.toLocaleString()} votes</p>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <h1 className="text-6xl font-display uppercase tracking-wider text-gray-600 mb-4">
                            {movie.title}
                        </h1>
                        
                        {trailer && (
                            <div className="mb-6">
                                <div className="aspect-video border-4 border-gray-800">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={`https://www.youtube.com/embed/${trailer.key}`}
                                        title="Bande-annonce"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>
                        )}
                        <div className="flex items-center gap-4 mb-6 font-serif text-gray-600">
                            <span>{new Date(movie.release_date).getFullYear()}</span>
                            <span>•</span>
                            <span>{movie.runtime} min</span>
                        </div>

                        <p className="text-lg font-serif text-gray-700 mb-8 leading-relaxed">
                            {movie.overview}
                        </p>

                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div>
                                <h3 className="font-display text-xl uppercase tracking-wider text-gray-600 mb-2">Genres</h3>
                                <p className="font-serif text-gray-600">
                                    {movie.genres.map(g => g.name).join(', ')}
                                </p>
                            </div>
                            <div>
                                <h3 className="font-display text-xl uppercase tracking-wider text-gray-600 mb-2">Pays</h3>
                                <p className="font-serif text-gray-600">
                                    {movie.production_countries.map(c => c.name).join(', ')}
                                </p>
                            </div>
                        </div>

                        {movie.credits && movie.credits.cast && (
                            <div className="mb-8">
                                <h3 className="font-display text-2xl uppercase tracking-wider text-gray-600 mb-4">Casting</h3>
                                <div className="flex gap-4 overflow-x-auto pb-4">
                                    {movie.credits.cast.slice(0, 10).map(actor => (
                                        <div key={actor.id} className="flex-shrink-0 w-32">
                                            {actor.profile_path && (
                                                <img 
                                                    src={tmdbService.getImageUrl(actor.profile_path, 'w185')}
                                                    alt={actor.name}
                                                    className="w-full h-40 object-cover border-2 border-gray-800 mb-2"
                                                />
                                            )}
                                            <p className="font-display text-sm text-gray-700">{actor.name}</p>
                                            <p className="font-serif text-xs text-gray-500">{actor.character}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {movie.similar && movie.similar.results.length > 0 && (
                    <section className="mb-16">
                        <h2 className="text-4xl font-display uppercase tracking-wider text-gray-600 mb-8">
                            <span className="text-5xl text-gray-800">F</span>ilms similaires
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                            {movie.similar.results.slice(0, 5).map(similar => (
                                <MediaCard key={similar.id} item={similar} type="movie" />
                            ))}
                        </div>
                    </section>
                )}

                <section className="border-t-2 border-gray-800 pt-12">
                    <h2 className="text-4xl font-display uppercase tracking-wider text-gray-600 mb-8">
                        <span className="text-5xl text-gray-800">C</span>ommentaires
                    </h2>

                    <form onSubmit={handleSubmitComment} className="mb-8">
                        {replyTo && (
                            <div className="mb-2 text-sm font-serif text-gray-600">
                                Réponse à un commentaire - <button onClick={() => setReplyTo(null)} className="underline">Annuler</button>
                            </div>
                        )}
                        <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Votre commentaire..."
                            className="w-full p-4 border-2 border-gray-800 font-serif text-gray-700 focus:outline-none focus:border-gray-600 mb-4"
                            rows="4"
                        />
                        <button
                            type="submit"
                            className="px-8 py-3 font-display uppercase tracking-wider bg-black text-gray-400 hover:text-white transition-colors border-2 border-gray-800"
                        >
                            Publier
                        </button>
                    </form>

                    <div className="space-y-6">
                        {comments.filter(c => !c.parentId).map(comment => (
                            <div key={comment.id} className="border-2 border-gray-300 p-6">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <p className="font-display text-sm uppercase tracking-wider text-gray-700">{comment.author}</p>
                                        <p className="font-serif text-xs text-gray-500">
                                            {new Date(comment.createdAt).toLocaleDateString('fr-FR')}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteComment(comment.id)}
                                        className="text-gray-500 hover:text-red-600 text-sm"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                                <p className="font-serif text-gray-700 mb-3">{comment.text}</p>
                                <button
                                    onClick={() => setReplyTo(comment.id)}
                                    className="text-sm font-display uppercase tracking-wider text-gray-600 hover:text-gray-800"
                                >
                                    Répondre
                                </button>

                                {comments.filter(r => r.parentId === comment.id).map(reply => (
                                    <div key={reply.id} className="ml-8 mt-4 border-l-2 border-gray-300 pl-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="font-display text-sm uppercase tracking-wider text-gray-700">{reply.author}</p>
                                                <p className="font-serif text-xs text-gray-500">
                                                    {new Date(reply.createdAt).toLocaleDateString('fr-FR')}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteComment(reply.id)}
                                                className="text-gray-500 hover:text-red-600 text-sm"
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                        <p className="font-serif text-gray-700">{reply.text}</p>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </section>
            </div>
            </div>
            
            <div className="vintage-frame-bottom"></div>
        </div>
    );
}

export default MovieDetail;
