import React from "react";

interface Testimonial {
  name: string;
  role: string;
  image: string;
  stars: number;
  text: string;
}

const ReviewsCard = () => {
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
  ];
  return (
    <div className="container mx-auto px-4">
      {/* // animate-reviewsslider */}
      <div className="grid grid-col-1 sm:grid-cols-2  lg:grid-cols-3 gap-8 overflow-hidden">
        {testimonials.map((item, idx) => (
          <div
            className="  shadow-md hover:shadow-2xl   rounded-3xl  relative  bg-[url('/assets/reviews/Subtract.png')] bg-cover overflow-hidden"
            key={idx}
          >
            <div
              key={idx}
              className=" grid grid-cols-2 relative overflow-hidden "
            >
              {/* Avatar */}
              <div className="  ">
                <img
                  src={`/assets/reviews/${item.image}`}
                  alt=""
                  className="h-[130px] w-[130px] rounded-full border-4 border-white shadow-md object-cover hover:shadow-2xl"
                />
              </div>

              {/* Stars */}

              <div className="flex flex-col items-start space-y-1 mt-6">
                <div className="flex justify-start space-x-1 mb-3 text-yellow-500">
                  {Array.from({ length: item.stars }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <div className="">
                  <h3 className=" text-lg font-semibold">{item.name}</h3>
                  <p className=" text-sm text-gray-500">{item.role}</p>
                </div>
              </div>
              {/* Name */}

              {/* Text */}
            </div>

            <div className="absolute right-0  opacity-5 overflow-hidden">
              <img
                src="/assets/reviews/Group95.png"
                className="max-w-full h-auto"
              />
            </div>
            <div className="  bg-center   ">
              <p className="mt-5 text-gray-600 w-full leading-relaxed   xl:p-10 ">
                "{item.text}"
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsCard;
