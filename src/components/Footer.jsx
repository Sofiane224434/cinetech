function Footer() {
    return (
        <footer className="bg-white mt-auto">
            <div className="h-6 mx-auto border2-separator"></div>
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* MovieDB Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <h3 className="text-3xl font-display uppercase tracking-widest text-gray-700">
                                <span className="text-4xl">M</span>ovie<span className="text-4xl">D</span><span className="text-4xl">B</span>
                            </h3>
                        </div>
                        <p className="text-sm text-gray-600 font-serif leading-relaxed">
                            Votre destination pour découvrir et explorer l'univers du cinéma et des séries.
                        </p>
                    </div>

                    {/* Navigation Section */}
                    <div>
                        <h4 className="font-display uppercase tracking-widest text-gray-700 mb-6 text-sm border-b border-gray-300 pb-2 inline-block">Navigation</h4>
                        <ul className="space-y-3 text-sm text-gray-600 font-serif">
                            <li><a href="#films" className="hover:text-gray-900 uppercase tracking-wider transition-colors">Films</a></li>
                            <li><a href="#series" className="hover:text-gray-900 uppercase tracking-wider transition-colors">Séries</a></li>
                            <li><a href="#genres" className="hover:text-gray-900 uppercase tracking-wider transition-colors">Genres</a></li>
                            <li><a href="#top-rated" className="hover:text-gray-900 uppercase tracking-wider transition-colors">Top Rated</a></li>
                        </ul>
                    </div>

                    {/* Communauté Section */}
                    <div>
                        <h4 className="font-display uppercase tracking-widest text-gray-700 mb-6 text-sm border-b border-gray-300 pb-2 inline-block">Communauté</h4>
                        <ul className="space-y-3 text-sm text-gray-600 font-serif">
                            <li><a href="#forums" className="hover:text-gray-900 uppercase tracking-wider transition-colors">Forums</a></li>
                            <li><a href="#critiques" className="hover:text-gray-900 uppercase tracking-wider transition-colors">Critiques</a></li>
                            <li><a href="#listes" className="hover:text-gray-900 uppercase tracking-wider transition-colors">Listes</a></li>
                            <li><a href="#evenements" className="hover:text-gray-900 uppercase tracking-wider transition-colors">Événements</a></li>
                        </ul>
                    </div>

                    {/* Support Section */}
                    <div>
                        <h4 className="font-display uppercase tracking-widest text-gray-700 mb-6 text-sm border-b border-gray-300 pb-2 inline-block">Support</h4>
                        <ul className="space-y-3 text-sm text-gray-600 font-serif">
                            <li><a href="#aide" className="hover:text-gray-900 uppercase tracking-wider transition-colors">Aide</a></li>
                            <li><a href="#contact" className="hover:text-gray-900 uppercase tracking-wider transition-colors">Contact</a></li>
                            <li><a href="#api" className="hover:text-gray-900 uppercase tracking-wider transition-colors">API</a></li>
                            <li><a href="#conditions" className="hover:text-gray-900 uppercase tracking-wider transition-colors">Conditions</a></li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-12 pt-8 border-t border-gray-300 text-center">
                    <p className="text-xs tracking-[0.2em] uppercase text-gray-600 font-serif">© 2026 MovieDB. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer;