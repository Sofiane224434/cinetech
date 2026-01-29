function LateralNav() {
    const mainLinks = ['Home', 'About', 'Services', 'Contact'];
    const secondaryLinks = ['Films', 'Séries', 'Genres', 'Tendances'];
    
    return (
        <nav className="w-2/12 border-l-2 border-black bg-black min-h-screen">
            <div className="sticky top-0 flex flex-col max-h-screen overflow-hidden">
                <div className="p-4 flex flex-col items-center gap-2">
                    <svg className="w-8 h-8 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 4H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm-7 10H7v-2h5v2zm5-4H7V8h10v2z"/>
                    </svg>
                    <h3 className="text-3xl font-bold text-gray-400 uppercase tracking-widest font-display underline decoration-gray-600 decoration-2 underline-offset-4">
                        <span className="text-4xl">M</span>enu <span className="text-4xl">M</span>ovie<span className="text-4xl">D</span><span className="text-4xl">b</span>
                    </h3>
                </div>
                
                <ul className="flex flex-col flex-1 p-3 gap-1">
                    <li className="h-4 mb-2 border2-separator"></li>
                    
                    {mainLinks.map((item) => (
                        <li key={item}>
                            <a href={`#${item.toLowerCase()}`} className="block py-2 px-3 text-base font-display uppercase tracking-widest text-gray-500 hover:text-gray-300 hover:bg-gray-900 transition-all border-l-2 border-transparent hover:border-gray-500">
                                {item}
                            </a>
                        </li>
                    ))}
                    
                    <li className="h-4 my-2 border2-separator"></li>
                    
                    {secondaryLinks.map((item) => (
                        <li key={item}>
                            <a href={`#${item.toLowerCase()}`} className="block py-1.5 px-3 text-sm font-display uppercase tracking-wider text-gray-600 hover:text-gray-400 transition-colors">
                                {item}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
}   

export default LateralNav;