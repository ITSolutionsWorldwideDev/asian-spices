import React from "react";
import HeadingDescription from "./HeadingDescription";

import ReviewsCard from "../layout/reviews/ReviewsCard";

const Reviews = () => {
 
  return (
    <section className=" container mx-auto bg-gray-100  mt-20">
      <HeadingDescription
        heading="Customer Reviews"
        text="Love by Food Enthisiasts"
        description="Join thousand of satisfied customers who trust Asian Spice for authentic flavors"
      />

      <ReviewsCard/>
    </section>
  );
};

export default Reviews;
