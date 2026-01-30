import { useState, useEffect } from 'react';
import MovieCard from './MovieCard';
import { tmdbService } from '../services/tmdb';

function MovieGrid({ title = "Films Populaires" }) {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true);
                const data = await tmdbService.getPopularMovies();
                setMovies(data.results.slice(0, 12));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    if (loading) {
        return (
            <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-800 border-t-transparent"></div>
                <p className="mt-4 font-display text-2xl text-gray-500 uppercase tracking-widest">Chargement...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20">
                <p className="font-display text-2xl text-red-500 uppercase tracking-widest">Erreur: {error}</p>
            </div>
        );
    }

    return (
        <section className="my-16">
            <div className="mb-8">
                <h2 className="text-5xl font-display uppercase tracking-wider text-gray-600 mb-4 text-center">
                    <span className="text-6xl text-gray-800">{title.charAt(0)}</span>{title.slice(1)}
                </h2>
                <div className="h-1 w-48 bg-gray-400 mx-auto"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        </section>
    );
}

export default MovieGrid;
