import { useRef } from 'react';

const ReviewCarousel = ({
                            reviews,
                            companies,
                            carouselPosition,
                            handlePrevReview,
                            handleNextReview,
                            handleMouseEnter,
                            handleMouseLeave
                        }) => {
    const carouselRef = useRef(null);

    return (
        <div className="mb-16" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Latest Reviews</h2>
                <div className="flex space-x-2">
                    <button
                        onClick={handlePrevReview}
                        className="bg-white border border-gray-200 p-2 rounded-full hover:bg-gray-50 transition-colors"
                    >
                        <ChevronLeft size={20} className="text-[#3c78e6]" />
                    </button>
                    <button
                        onClick={handleNextReview}
                        className="bg-white border border-gray-200 p-2 rounded-full hover:bg-gray-50 transition-colors"
                    >
                        <ChevronRight size={20} className="text-[#3c78e6]" />
                    </button>
                </div>
            </div>

            <div className="relative overflow-hidden" ref={carouselRef}>
                <div
                    className="flex transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${carouselPosition * 100 / 3}%)` }}
                >
                    {reviews.map((review, index) => {
                        // Find the company data for this review
                        const companyData = companies.find(c => c.name === review.company);

                        return (
                            <div
                                key={`${review.id}-${index}`}
                                className="min-w-full sm:min-w-[50%] md:min-w-[33.333%] p-4"
                            >
                                <ReviewCard review={review} companyData={companyData} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ReviewCarousel;