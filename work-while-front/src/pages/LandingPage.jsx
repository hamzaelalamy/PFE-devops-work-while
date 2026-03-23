import { useState, useEffect, useRef } from 'react';

// Changement du nom de la fonction pour correspondre à l'import dans routes.jsx
export default function LandingPage() {
  const [isVisible, setIsVisible] = useState({});
  const sectionRefs = {
    hero: useRef(null),
    features: useRef(null),
    statistics: useRef(null),
    pathways: useRef(null),
    testimonials: useRef(null),
    cta: useRef(null)
  };

  // Intersection observer for animation triggers
  useEffect(() => {
    const observers = [];

    Object.entries(sectionRefs).forEach(([key, ref]) => {
      if (ref.current) {
        const observer = new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) {
                setIsVisible(prev => ({ ...prev, [key]: true }));
              }
            },
            { threshold: 0.1 }
        );

        observer.observe(ref.current);
        observers.push({ observer, element: ref.current });
      }
    });

    return () => {
      observers.forEach(({ observer, element }) => {
        observer.unobserve(element);
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
      <div className="relative overflow-hidden">
        <div className="min-h-screen">
          <HeroSection ref={sectionRefs.hero} />
          <FeaturesSection ref={sectionRefs.features} isVisible={isVisible.features} />
          <StatisticsSection ref={sectionRefs.statistics} isVisible={isVisible.statistics} />
          <CareerPathwaysSection ref={sectionRefs.pathways} isVisible={isVisible.pathways} />
          <TestimonialsSection ref={sectionRefs.testimonials} isVisible={isVisible.testimonials} />
          <CTASection ref={sectionRefs.cta} isVisible={isVisible.cta} />
        </div>
      </div>
  );
}