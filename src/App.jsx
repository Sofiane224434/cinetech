import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LateralNav from './components/LateralNav';
import Footer from './components/Footer';
import Home from './pages/Home';
import Movies from './pages/Movies';
import Series from './pages/Series';
import Anime from './pages/Anime';
import MovieDetail from './pages/MovieDetail';
import SeriesDetail from './pages/SeriesDetail';
import Favorites from './pages/Favorites';
import Watchlist from './pages/Watchlist';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-[#f5f5f0] text-gray-900 font-serif">
                <div className="flex">
                    <main className="flex-1">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/movies" element={<Movies />} />
                            <Route path="/series" element={<Series />} />
                            <Route path="/anime" element={<Anime />} />
                            <Route path="/movie/:id" element={<MovieDetail />} />
                            <Route path="/series/:id" element={<SeriesDetail />} />
                            <Route path="/favorites" element={<Favorites />} />
                            <Route path="/watchlist" element={<Watchlist />} />
                        </Routes>
                    </main>
                    <LateralNav />
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
