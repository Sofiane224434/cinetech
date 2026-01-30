import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MediaCard from '../components/MediaCard';
import { tmdbService } from '../services/tmdb';

function PersonDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [person, setPerson] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPerson = async () => {
            try {
                const data = await tmdbService.getPersonDetails(id);
                setPerson(data);
            } catch (error) {
                console.error('Erreur:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPerson();
    }, [id]);

    if (loading) {
        return (
            <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-800 border-t-transparent"></div>
            </div>
        );
    }

    if (!person) return null;

    const profileUrl = tmdbService.getImageUrl(person.profile_path, 'h632');
    const movieCredits = person.combined_credits?.cast?.filter(c => c.media_type === 'movie') || [];
    const tvCredits = person.combined_credits?.cast?.filter(c => c.media_type === 'tv') || [];
    const directorCredits = person.combined_credits?.crew?.filter(c => c.job === 'Director') || [];

    return (
        <div className="vintage-frame">
            <div className="vintage-frame-top"></div>
            
            <div className="max-w-7xl mx-auto px-6 py-12">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-8 px-6 py-3 font-display uppercase tracking-wider bg-gray-800 text-gray-400 hover:text-white transition-colors border-2 border-gray-900 inline-flex items-center gap-2"
                >
                    <span>←</span> Retour
                </button>

                <div className="grid md:grid-cols-4 gap-12 mb-16">
                    <div>
                        {profileUrl && (
                            <img 
                                src={profileUrl} 
                                alt={person.name} 
                                className="w-full border-4 border-gray-800 mb-4" 
                            />
                        )}
                        
                        <div className="bg-gray-800 border-2 border-gray-900 p-4">
                            <h3 className="font-display text-sm uppercase tracking-wider text-gray-400 mb-3">Informations</h3>
                            
                            {person.birthday && (
                                <div className="mb-3">
                                    <p className="text-xs font-display uppercase tracking-wider text-gray-500 mb-1">Naissance</p>
                                    <p className="font-serif text-sm text-gray-300">
                                        {new Date(person.birthday).toLocaleDateString('fr-FR', { 
                                            day: 'numeric', 
                                            month: 'long', 
                                            year: 'numeric' 
                                        })}
                                    </p>
                                    {person.place_of_birth && (
                                        <p className="font-serif text-xs text-gray-400">{person.place_of_birth}</p>
                                    )}
                                </div>
                            )}
                            
                            {person.deathday && (
                                <div className="mb-3">
                                    <p className="text-xs font-display uppercase tracking-wider text-gray-500 mb-1">Décès</p>
                                    <p className="font-serif text-sm text-gray-300">
                                        {new Date(person.deathday).toLocaleDateString('fr-FR', { 
                                            day: 'numeric', 
                                            month: 'long', 
                                            year: 'numeric' 
                                        })}
                                    </p>
                                </div>
                            )}
                            
                            {person.known_for_department && (
                                <div className="mb-3">
                                    <p className="text-xs font-display uppercase tracking-wider text-gray-500 mb-1">Métier</p>
                                    <p className="font-serif text-sm text-gray-300">{person.known_for_department}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="md:col-span-3">
                        <h1 className="text-6xl font-display uppercase tracking-wider text-gray-600 mb-6">
                            {person.name}
                        </h1>

                        {person.biography && (
                            <div className="mb-8">
                                <h2 className="text-2xl font-display uppercase tracking-wider text-gray-600 mb-4">Biographie</h2>
                                <p className="font-serif text-gray-700 leading-relaxed whitespace-pre-line">
                                    {person.biography}
                                </p>
                            </div>
                        )}

                        {directorCredits.length > 0 && (
                            <section className="mb-12">
                                <h2 className="text-3xl font-display uppercase tracking-wider text-gray-600 mb-6">
                                    <span className="text-4xl text-gray-800">R</span>éalisations
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                                    {directorCredits
                                        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
                                        .slice(0, 10)
                                        .map((credit) => (
                                            <MediaCard 
                                                key={`${credit.media_type}-${credit.id}`} 
                                                item={credit} 
                                                type={credit.media_type} 
                                            />
                                        ))}
                                </div>
                            </section>
                        )}

                        {movieCredits.length > 0 && (
                            <section className="mb-12">
                                <h2 className="text-3xl font-display uppercase tracking-wider text-gray-600 mb-6">
                                    <span className="text-4xl text-gray-800">F</span>ilms ({movieCredits.length})
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                                    {movieCredits
                                        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
                                        .slice(0, 10)
                                        .map((credit) => (
                                            <MediaCard 
                                                key={credit.id} 
                                                item={credit} 
                                                type="movie" 
                                            />
                                        ))}
                                </div>
                                {movieCredits.length > 10 && (
                                    <p className="mt-4 text-center font-serif text-gray-600">
                                        Et {movieCredits.length - 10} autres films...
                                    </p>
                                )}
                            </section>
                        )}

                        {tvCredits.length > 0 && (
                            <section className="mb-12">
                                <h2 className="text-3xl font-display uppercase tracking-wider text-gray-600 mb-6">
                                    <span className="text-4xl text-gray-800">S</span>éries ({tvCredits.length})
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                                    {tvCredits
                                        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
                                        .slice(0, 10)
                                        .map((credit) => (
                                            <MediaCard 
                                                key={credit.id} 
                                                item={credit} 
                                                type="series" 
                                            />
                                        ))}
                                </div>
                                {tvCredits.length > 10 && (
                                    <p className="mt-4 text-center font-serif text-gray-600">
                                        Et {tvCredits.length - 10} autres séries...
                                    </p>
                                )}
                            </section>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="vintage-frame-bottom"></div>
        </div>
    );
}

export default PersonDetail;
