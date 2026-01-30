import MovieGrid from './MovieGrid';

function Main() {
    return (
        <main className="flex-1 p-12 w-10/12 bg-white">
                    <div className="vintage-frame p-8 min-h-full">
                        <div className="vintage-frame-top"></div>
                        <div className="vintage-frame-bottom"></div>
                        <header className="mb-12 text-center">
                            <h5 className="text-sm tracking-[0.5em] uppercase text-gray-600 mb-2">Welcome to</h5>
                            <h1 className="text-8xl font-display uppercase tracking-wider text-gray-500 mb-6 drop-shadow-xl">
                                <span className="text-9xl">M</span>ovie<span className="text-9xl">D</span><span className="text-9xl">B</span>
                            </h1>
                            <div className="h-1 w-32 bg-gray-400 mx-auto"></div>
                        </header>
                        
                        <div className="max-w-4xl mx-auto space-y-6 text-lg leading-relaxed text-justify mb-16">
                            <p className="first-letter:text-5xl first-letter:font-display first-letter:mr-3 first-letter:float-left first-letter:text-gray-400">
                                Découvrez les films les plus populaires du moment. Notre collection est mise à jour quotidiennement pour vous offrir le meilleur du cinéma mondial.
                            </p>
                            <p>Explorez des milliers de films, séries et documentaires. Consultez les notes, lisez les critiques et trouvez votre prochaine obsession cinématographique.</p>
                        </div>

                        <MovieGrid title="Films Populaires" />

                        <div className="my-16 grid grid-cols-2 gap-8">
                            <section className="border-2 border-gray-800 p-6 bg-black">
                                <h2 className="text-4xl font-display uppercase text-gray-400 mb-4 border-b border-gray-700 pb-2">Archives</h2>
                                <p className="text-sm text-gray-400">Plongez dans notre vaste collection de classiques du cinéma et redécouvrez les chefs-d'œuvre intemporels.</p>
                            </section>
                            <section className="border-2 border-gray-300 p-6 bg-white">
                                <h2 className="text-4xl font-display uppercase text-gray-600 mb-4 border-b border-gray-300 pb-2">Collection</h2>
                                <p className="text-sm text-gray-600">Créez vos propres listes personnalisées et partagez vos découvertes avec la communauté.</p>
                            </section>
                        </div>
                    </div>
                </main>
    );
}

export default Main;