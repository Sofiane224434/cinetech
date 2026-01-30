import { useEffect } from 'react';

function Modal({ isOpen, onClose, title, children }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div 
                className="absolute inset-0 bg-black/70"
                onClick={onClose}
            ></div>
            
            {/* Modal */}
            <div className="relative bg-[#f5f5f0] border-4 border-gray-800 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="sticky top-0 bg-gray-800 border-b-4 border-gray-900 px-6 py-4 flex justify-between items-center z-10">
                    <h2 className="text-2xl font-display uppercase tracking-wider text-gray-400">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white text-3xl font-display leading-none"
                    >
                        ×
                    </button>
                </div>
                
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;
