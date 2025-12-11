import React from "react";
interface HeadingDescription {
  heading: string;
  text: string;
  description: string;
}
const HeadingDescription = ({
  heading,
  text,
  description,
}: HeadingDescription) => {
  return (
    <div className="text-center max-w-lg mx-auto mb-16 ">
      <h3 className=" py-5 font-bold text-4xl rounded-full bg-linear-to-r from-orange-100 to-orange-200 text-red-800  ">
        {heading}
      </h3>

      <p className="mt-4  text-gray-500 text-lg tracking-wide">{text}</p>

      <p className="text-lg mt-4 text-gray-500 w-xl">{description}</p>
    </div>
  );
};

export default HeadingDescription;
