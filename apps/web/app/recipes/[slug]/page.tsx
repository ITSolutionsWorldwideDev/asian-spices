import React from "react";
import Image from "next/image";

const page = () => {
  return (
    <div className="container mx-auto bg-black ">
      <div className=" flex  justify-center bg-black">
        <Image
          src={`/assets/recipes/511d75edd299a537dadb2933ba8ea0178e2c3185.png`}
          alt="loading"
            // fill
          height={500}
          width={800}
          className="object-contain rounded-xl"
        />
      </div>
      <div className=" w-full flex flex-wrap justify-center items-center text-white mt-10">
        <h1 className="font-bold text-3xl">A timeless desi classic layered with spice, aroma, and flavor.</h1>
      </div>
      <div className="mx-auto w-[40vw] flex  justify-center items-center text-center text-white py-5">
        <p>
          Chicken Biryani is the crown jewel of desi cuisine fragrant basmati
          rice layered with spiced chicken, herbs, and saffron. A dish that
          brings families together and turns every meal into a celebration.
        </p>
      </div>
    </div>
  );
};

export default page;
