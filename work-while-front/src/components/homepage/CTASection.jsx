import { forwardRef } from 'react';

const CTASection = forwardRef(({ isVisible }, ref) => {
  return (
    <section
      ref={ref}
      className="py-20 px-4 relative overflow-hidden"
      style={{ backgroundColor: '#EDC418' }}
    >
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 rounded-full opacity-20 top-0 right-0 transform translate-x-1/3 -translate-y-1/3" style={{ backgroundColor: '#3c78e6' }}></div>
        <div className="absolute w-64 h-64 rounded-full opacity-10 bottom-0 left-0 transform -translate-x-1/4 translate-y-1/4" style={{ backgroundColor: '#3c78e6' }}></div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">Ready to Launch Your Career?</h2>
          <p className="text-xl text-yellow-800 mb-8 max-w-2xl mx-auto">Join thousands of young professionals who found their path with WorkWhile. Your journey starts now.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-8 py-3 rounded-full text-white font-medium shadow-lg transition transform hover:scale-105" style={{ backgroundColor: '#3c78e6' }}>
              Get Started Today
            </button>
            <button className="px-8 py-3 rounded-full bg-white text-yellow-800 font-medium shadow-lg transition transform hover:scale-105 border border-yellow-400">
              Watch Success Stories
            </button>
          </div>
        </div>
      </div>
    </section>
  );
});
export default CTASection;