import { useState } from 'react'
import LateralNav from './components/LateralNav'
import Footer from './components/Footer'
import Main from './components/main'


function App() {
    return (
        <div className="min-h-screen bg-[#f5f5f0] text-gray-900 font-serif">
            <div className="flex">
                <Main/>
                <LateralNav/>
            </div>
            <Footer/>
        </div>
    )
}

export default App
