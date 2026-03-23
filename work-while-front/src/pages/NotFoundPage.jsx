import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    const titleRef = useRef(null);
    
    useEffect(() => {
        const title = titleRef.current;
        const letters = title.textContent.split('');
        title.textContent = '';
        
        letters.forEach((letter, i) => {
            const span = document.createElement('span');
            span.textContent = letter;
            span.style.animationDelay = `${i * 0.1}s`;
            span.className = 'inline-block animate-bounce opacity-0';
            title.appendChild(span);
        });
        
        // Mouse parallax effect
        const handleMouseMove = (e) => {
            const x = (window.innerWidth / 2 - e.pageX) / 30;
            const y = (window.innerHeight / 2 - e.pageY) / 30;
            
            document.querySelector('.error-container').style.transform = 
                `perspective(1000px) rotateY(${x}deg) rotateX(${y}deg)`;
        };
        
        window.addEventListener('mousemove', handleMouseMove);
        
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 overflow-hidden relative">
            {/* Noise overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2ZyP')] opacity-50"></div>
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/50 to-blue-900/30"></div>
            
            {/* Main content */}
            <div className="error-container relative z-10 bg-gray-800/50 p-8 rounded-xl backdrop-blur-sm border border-gray-700 shadow-xl transition-all duration-300 max-w-md text-center">
                <h1 ref={titleRef} className="text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-2">404</h1>
                
                <div className="text-xl font-semibold text-gray-100 mb-4">Page Not Found</div>
                
                <p className="text-gray-300 mb-8">
                    The page you are looking for might have been removed, had its name changed, 
                    or is temporarily unavailable.
                </p>
                
                <Link to="/" className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25">
                    <span>Return Home</span>
                    <span className="transform transition-transform group-hover:translate-x-1">→</span>
                </Link>
            </div>
            
            {/* Decorative shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-blob"></div>
                <div className="absolute top-3/4 left-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
                <div className="absolute bottom-1/4 right-1/3 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl animate-blob animation-delay-6000"></div>
            </div>
            
            {/* Custom cursor effect - would need additional JS to work properly */}
            <div className="hidden md:block absolute w-6 h-6 bg-white/30 rounded-full transform -translate-x-1/2 -translate-y-1/2 pointer-events-none mix-blend-difference"></div>
        </div>
    );
};

export default NotFoundPage;