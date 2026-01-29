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
                        
                        <div className="max-w-4xl mx-auto space-y-6 text-lg leading-relaxed text-justify">
                            <p className="first-letter:text-5xl first-letter:font-display first-letter:mr-3 first-letter:float-left first-letter:text-gray-400">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </p>
                            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                        </div>

                        <div className="my-16 grid grid-cols-2 gap-8">
                            <section className="border-2 border-gray-800 p-6 bg-black">
                                <h2 className="text-4xl font-display uppercase text-gray-400 mb-4 border-b border-gray-700 pb-2">Archives</h2>
                                <p className="text-sm text-gray-400">Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor.</p>
                            </section>
                            <section className="border-2 border-gray-300 p-6 bg-white">
                                <h2 className="text-4xl font-display uppercase text-gray-600 mb-4 border-b border-gray-300 pb-2">Collection</h2>
                                <p className="text-sm text-gray-600">Sed adipiscing ornare risus. Morbi est est, blandit sit amet, sagittis vel.</p>
                            </section>
                        </div>
                    </div>
                </main>
    );
}

export default Main;