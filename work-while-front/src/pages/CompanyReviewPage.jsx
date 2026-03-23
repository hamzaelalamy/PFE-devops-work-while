import { useState, useEffect } from 'react';
import { companies, reviewsData } from '../components/CompanyReviewPage/data.js';
import Header from '../components/CompanyReviewPage/Header';
import SearchBar from '../components/CompanyReviewPage/SearchBar';
import CompanyList from '../components/CompanyReviewPage/CompanyList';
import ReviewCarousel from '../components/CompanyReviewPage/ReviewCarousel';
import CallToAction from '../components/CompanyReviewPage/CallToAction';
import IndustryCategories from '../components/CompanyReviewPage/IndustryCategories';

const CompanyReviewPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCompanies, setFilteredCompanies] = useState(companies);
  const [carouselPosition, setCarouselPosition] = useState(0);

  // Pour l'effet de défilement infini
  const [reviews, _setReviews] = useState([...reviewsData, ...reviewsData, ...reviewsData]);
  const [autoScroll, setAutoScroll] = useState(true);

  // Gérer la saisie de recherche
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCompanies(companies);
    } else {
      const filtered = companies.filter(company =>
          company.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCompanies(filtered);
    }
  }, [searchQuery]);

  // Effet de défilement automatique du carrousel
  useEffect(() => {
    let interval;

    if (autoScroll) {
      interval = setInterval(() => {
        setCarouselPosition(prev => {
          const newPosition = prev + 1;
          // Remettre la position à zéro pour créer un effet infini quand on atteint la fin
          if (newPosition > reviewsData.length * 3 - 1) {
            return 0;
          }
          return newPosition;
        });
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
   
  }, [autoScroll]);

  // Mettre en pause le défilement automatique au survol
  const handleMouseEnter = () => setAutoScroll(false);
  const handleMouseLeave = () => setAutoScroll(true);

  // Navigation manuelle du carrousel
  const handlePrevReview = () => {
    setCarouselPosition(prev => {
      const newPosition = prev - 1;
      if (newPosition < 0) {
        return reviews.length - 1;
      }
      return newPosition;
    });
  };

  const handleNextReview = () => {
    setCarouselPosition(prev => {
      const newPosition = prev + 1;
      if (newPosition > reviews.length - 1) {
        return 0;
      }
      return newPosition;
    });
  };

  return (
      <div className="min-h-screen bg-gray-50 p-6">
        <Header />
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <CompanyList companies={filteredCompanies} />
        <ReviewCarousel
            reviews={reviews}
            companies={companies}
            carouselPosition={carouselPosition}
            handlePrevReview={handlePrevReview}
            handleNextReview={handleNextReview}
            handleMouseEnter={handleMouseEnter}
            handleMouseLeave={handleMouseLeave}
        />
        <CallToAction />
        <IndustryCategories />
      </div>
  );
};

export default CompanyReviewPage;