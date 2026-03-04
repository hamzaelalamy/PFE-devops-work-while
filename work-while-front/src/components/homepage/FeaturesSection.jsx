import { forwardRef } from 'react';
import { Award, Calendar, Users } from 'lucide-react';

const FeaturesSection = forwardRef(({ isVisible }, ref) => {
  return (
      <section
          ref={ref}
          className="py-24 px-4 bg-white"
      >
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#EDC418' }}>Our Approach</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2" style={{ color: '#3c78e6' }}>Guiding Youth to Career Success</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mt-4">We combine cutting-edge technology with personalized guidance to help young professionals discover and achieve their career aspirations.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className={`bg-white rounded-xl shadow-lg p-4 transform transition-all duration-1000 delay-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(60, 120, 230, 0.1)' }}>
                <Award size={24} style={{ color: '#3c78e6' }} />
              </div>
              <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" alt="Skills Assessment" className="w-full h-40 object-cover mb-4 rounded-lg" />
              <h3 className="text-xl font-semibold mb-2">Skills Assessment</h3>
              <p className="text-gray-600">Discover your unique strengths and talents through our comprehensive skills assessment tools and personality insights.</p>
            </div>

            <div className={`bg-white rounded-xl shadow-lg p-4 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(237, 196, 24, 0.1)' }}>
                <Calendar size={24} style={{ color: '#EDC418' }} />
              </div>
              <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" alt="Personalized Roadmap" className="w-full h-40 object-cover mb-4 rounded-lg" />
              <h3 className="text-xl font-semibold mb-2">Personalized Roadmap</h3>
              <p className="text-gray-600">Get a custom career development plan with timelines, milestones, and actionable steps to achieve your professional goals.</p>
            </div>

            <div className={`bg-white rounded-xl shadow-lg p-4 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(60, 120, 230, 0.1)' }}>
                <Users size={24} style={{ color: '#3c78e6' }} />
              </div>
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" alt="Mentorship Network" className="w-full h-40 object-cover mb-4 rounded-lg" />
              <h3 className="text-xl font-semibold mb-2">Mentorship Network</h3>
              <p className="text-gray-600">Connect with industry professionals who provide guidance, feedback, and real-world insights to accelerate your career growth.</p>
            </div>
          </div>
        </div>
      </section>
  );
});

export default FeaturesSection;