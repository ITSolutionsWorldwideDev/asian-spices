"use client";

import { useState } from "react";
import Stars from "./Stars";
// import { reviewsData } from "./reviews";

const INITIAL_COUNT = 4;
const LOAD_MORE_COUNT = 5;

export default function ReviewsSection() {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const reviewsData = {
    averageRating: 4.9,
    totalReviews: 234,
    ratingBreakdown: {
      5: 75,
      4: 20,
      3: 5,
      2: 5,
      1: 5,
    },
    reviews: [
      {
        id: 1,
        name: "Sarah M.",
        rating: 5,
        verified: true,
        time: "2 weeks ago",
        title: "Best saffron I've ever used!",
        comment:
          "The quality is outstanding. The aroma is incredible and the color it gives to dishes is perfect. Worth every penny!",
        helpful: 45,
      },
      {
        id: 2,
        name: "Raj K.",
        rating: 5,
        verified: true,
        time: "1 month ago",
        title: "Authentic Kashmiri saffron",
        comment:
          "As someone from Kashmir, I can confirm this is genuine. The threads are long, deep red, and have the characteristic aroma.",
        helpful: 32,
      },
      {
        id: 3,
        name: "Emily R.",
        rating: 4,
        verified: true,
        time: "1 month ago",
        title: "Great quality, slightly pricey",
        comment:
          "The saffron is excellent quality and a little goes a long way. Price is on the higher side but justified by the quality.",
        helpful: 18,
      },
      {
        id: 4,
        name: "Michael T.",
        rating: 5,
        verified: true,
        time: "2 months ago",
        title: "Perfect for special occasions",
        comment:
          "I use this for making traditional biryani. The flavor and color are unmatched. Highly recommend!",
        helpful: 27,
      },

      {
        id: 5,
        name: "Michael T.",
        rating: 5,
        verified: true,
        time: "2 months ago",
        title: "Perfect for special occasions",
        comment:
          "I use this for making traditional biryani. The flavor and color are unmatched. Highly recommend!",
        helpful: 27,
      },

      {
        id: 6,
        name: "Michael T.",
        rating: 5,
        verified: true,
        time: "2 months ago",
        title: "Perfect for special occasions",
        comment:
          "I use this for making traditional biryani. The flavor and color are unmatched. Highly recommend!",
        helpful: 27,
      },

      {
        id: 7,
        name: "Michael T.",
        rating: 5,
        verified: true,
        time: "2 months ago",
        title: "Perfect for special occasions",
        comment:
          "I use this for making traditional biryani. The flavor and color are unmatched. Highly recommend!",
        helpful: 27,
      },

      {
        id: 8,
        name: "Michael T.",
        rating: 5,
        verified: true,
        time: "2 months ago",
        title: "Perfect for special occasions",
        comment:
          "I use this for making traditional biryani. The flavor and color are unmatched. Highly recommend!",
        helpful: 27,
      },
    ],
  };

  const totalReviews = reviewsData.reviews.length;
  const visibleReviews = reviewsData.reviews.slice(0, visibleCount);

  const hasMore = visibleCount < totalReviews;
  const canShowLess = visibleCount > INITIAL_COUNT;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + LOAD_MORE_COUNT, totalReviews));
  };

  const handleShowLess = () => {
    setVisibleCount(INITIAL_COUNT);
  };

  return (
    <section className="max-w-5xl mx-auto px-4 py-10">
      {/* Summary */}
      <div className="flex flex-col md:flex-row gap-10 border-b pb-8">
        <div className="w-full md:w-1/3">
          <h2 className="text-5xl font-semibold">
            {reviewsData.averageRating}
          </h2>
          <Stars rating={5} />
          <p className="text-sm text-gray-500 mt-1">
            {reviewsData.totalReviews} reviews
          </p>
        </div>

        <div className="w-full md:w-2/3 space-y-2">
          {Object.entries(reviewsData.ratingBreakdown)
            .reverse()
            .map(([star, percent]) => (
              <div key={star} className="flex items-center gap-3">
                <span className="text-sm w-10">{star} star</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#FF6900]"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="text-sm w-10 text-right">{percent}%</span>
              </div>
            ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="divide-y">
        {visibleReviews.map((review) => (
          <div key={review.id} className="py-6">
            <div className="flex items-center gap-2">
              <span className="font-medium">{review.name}</span>
              {review.verified && (
                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                  Verified Purchase
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-1">
              <Stars rating={review.rating} />
              <span className="text-sm text-gray-400">{review.time}</span>
            </div>

            <h3 className="font-medium mt-2">{review.title}</h3>
            <p className="text-gray-600 text-sm mt-1">{review.comment}</p>

            <button className="text-sm text-gray-500 mt-2 hover:underline">
              Helpful ({review.helpful})
            </button>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4 mt-6">
        {hasMore && (
          <button
            onClick={handleLoadMore}
            className="text-black cursor-pointer border-2 border-gray-200 px-6 py-2 rounded-lg text-sm hover:bg-gray-100 transition"
          >
            Load More Reviews
          </button>
        )}

        {canShowLess && (
          <button
            onClick={handleShowLess}
            className="text-black cursor-pointer border-2 border-gray-200 px-6 py-2 rounded-lg text-sm hover:bg-gray-100 transition"
          >
            Show Less
          </button>
        )}
      </div>
    </section>
  );
}
