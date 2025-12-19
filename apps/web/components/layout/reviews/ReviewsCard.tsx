"use client";

import React, { useEffect, useState } from "react";

interface Testimonial {
  name: string;
  role: string;
  image: string;
  stars: number;
  text: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Sarah Chen",
    role: "Home Chef",
    image: "966bdcc20de9d1146da18068833210d399cd593e.jpg",
    stars: 5,
    text: `The quality of spices from Asian Spices is exceptional! 
    The turmeric has such a vibrant color and the aroma is incredible. 
    My curries have never tasted better.`,
  },
  {
    name: "Chef Michael Rodriguez",
    role: "Restaurant Owner",
    image: "966bdcc20de9d1146da18068833210d399cd593e.jpg",
    stars: 5,
    text: `As a professional chef, I demand the best ingredients. 
    Asian Spices consistently delivers authentic, high-quality spices 
    that elevate every dish we serve.`,
  },
  {
    name: "Priya Patel",
    role: "Food Blogger",
    image: "966bdcc20de9d1146da18068833210d399cd593e.jpg",
    stars: 5,
    text: `I've tried many spice brands, but Asian Spices stands out. 
    The freshness is unmatched and knowing they support sustainable farming 
    makes me feel good about every purchase.`,
  },
  {
    name: "dsadas",
    role: "Home Chef",
    image: "966bdcc20de9d1146da18068833210d399cd593e.jpg",
    stars: 5,
    text: `The quality of spices from Asian Spices is exceptional! 
    The turmeric has such a vibrant color and the aroma is incredible. 
    My curries have never tasted better.`,
  },
  {
    name: "dsda",
    role: "Restaurant Owner",
    image: "966bdcc20de9d1146da18068833210d399cd593e.jpg",
    stars: 5,
    text: `As a professional chef, I demand the best ingredients. 
    Asian Spices consistently delivers authentic, high-quality spices 
    that elevate every dish we serve.`,
  },
  {
    name: "czxcxzc",
    role: "Food Blogger",
    image: "966bdcc20de9d1146da18068833210d399cd593e.jpg",
    stars: 5,
    text: `I've tried many spice brands, but Asian Spices stands out. 
    The freshness is unmatched and knowing they support sustainable farming 
    makes me feel good about every purchase.`,
  },

  {
    name: "ds",
    role: "Food Blogger",
    image: "966bdcc20de9d1146da18068833210d399cd593e.jpg",
    stars: 5,
    text: `I've tried many spice brands, but Asian Spices stands out. 
    The freshness is unmatched and knowing they support sustainable farming 
    makes me feel good about every purchase.`,
  },

  {
    name: "veveo",
    role: "Food Blogger",
    image: "966bdcc20de9d1146da18068833210d399cd593e.jpg",
    stars: 5,
    text: `I've tried many spice brands, but Asian Spices stands out. 
    The freshness is unmatched and knowing they support sustainable farming 
    makes me feel good about every purchase.`,
  },

  {
    name: "veveo",
    role: "Food Blogger",
    image: "966bdcc20de9d1146da18068833210d399cd593e.jpg",
    stars: 5,
    text: `I've tried many spice brands, but Asian Spices stands out. 
    The freshness is unmatched and knowing they support sustainable farming 
    makes me feel good about every purchase.`,
  },
];

const ReviewsCard: React.FC = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1); // 1 = right, -1 = left

  const getVisibleCount = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 768) return 2;
      return 1;
    }
    return 3;
  };

  const visibleCount = getVisibleCount();

  useEffect(() => {
    const interval = setInterval(() => {
      setStartIndex((prev) => {
        let next = prev + 3 * direction;

        // Reverse direction at bounds
        if (next + visibleCount > testimonials.length) {
          setDirection(-1);
          next = prev - 3;
        } else if (next < 0) {
          setDirection(1);
          next = prev + 3;
        }

        return (next + testimonials.length) % testimonials.length;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [direction, visibleCount]);

  return (
    <div className="relative overflow-hidden ">
      <div
        className="flex "
        style={{
          transform: `translateX(-${(startIndex * 100) / visibleCount}%)`,
        }}
      >
        {testimonials.map((item, idx) => (
          <div
            key={idx}
            className={`relative overflow-hidden shrink-0 p-4 m-2 bg-cover rounded-2xl shadow-lg bg-[url('/assets/reviews/Subtract.png')]
             hover:shadow-2xl ${visibleCount === 1 ? "w-full" : visibleCount === 2 ? "w-1/2" : "w-1/3"}
            `}
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                src={`/assets/reviews/${item.image}`}
                alt={item.name}
                className="w-25 h-25 rounded-full object-cover border-8 border-white"
              />
              <div className="ml-10">
                <div className="flex justify-start space-x-1  text-yellow-500">
                  {Array.from({ length: item.stars }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.role}</p>
              </div>
            </div>
            <div className="absolute right-0  top-20 h-full opacity-5">
              <img src="/assets/reviews/Group95.png" alt="" className="" />
            </div>

            <p className="text-gray-700 mt-10">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsCard;

//             className="   hover:shadow-2xl   rounded-3xl  relative  bg-[url('/assets/reviews/Subtract.png')] bg-cover overflow-hidden"
//             key={idx}
//           >
//             <div
//               key={idx}
//               className=" grid grid-cols-2 relative overflow-hidden "
//             >
//               {/* Avatar */}

//               {/* Stars */}

//               <div className="flex flex-col items-start space-y-1 mt-6">

//                 <div className="">
//                   <h3 className=" text-lg font-semibold">{item.name}</h3>
//                   <p className=" text-sm text-gray-500">{item.role}</p>
//                 </div>
//               </div>
//               {/* Name */}

//               {/* Text */}
//             </div>

//             <div className="absolute right-0  opacity-5 overflow-hidden">
//               <img
//                 src="/assets/reviews/Group95.png"
//                 className="max-w-full h-auto"
//               />
//             </div>
//             <div className="  bg-center   ">
//               <p className="mt-5 text-gray-600 w-full leading-relaxed   xl:p-10 ">
//                 "{item.text}"
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ReviewsCard;
