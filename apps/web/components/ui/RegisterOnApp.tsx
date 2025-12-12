import React from "react";
import Image from "next/image";

// import MockupImage from '/public/images/mockup-phone.png';

const RegisterOnApp: React.FC = () => {
  return (
    <section className=" relative container mx-auto  bg-linear-to-r from-orange-600 to-orange-300  rounded-2xl mt-20  w-full ">
      
      <div className="absolute inset-0 z-0 ">
        <div className="absolute opacity-5 inset-0 left-[30%] -top-[15%] h-[650] transform bg-[url('/assets/register_on_app/e4eed2a3a2c9a2ea3fec21ad0e3ce66d0ca86b12.png')] bg-contain bg-no-repeat "></div>
      </div>


<div className="grid grid-cols-2">

</div>
      <div className="  relative z-20 mx-auto flex  flex-col items-center justify-between lg:flex-row p-10">
        <div className="mb-10 text-center lg:mb-0  lg:text-left">
          <h1 className="text-4xl font-bold text-black md:text-5xl lg:text-7xl leading-tight mb-6">
            Be the First to <span className="text-white">Experience </span>
            <br />
            Flavor at Your <span className="text-white">Fingertips.</span>
          </h1>

          <p className="mb-8  w-[75%] font-medium text-white md:text-base ">
            Sign up now and be the first to unlock our spice-powered app. Once
            live, you’ll get instant email access to download from the App Store
            and Google Play.
          </p>

          <div className="flex items-center justify-center space-x-4 lg:justify-start mb-8">
            <a
              href="https://play.google.com/store"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Image
                src="/assets/register_on_app/Group (1).png" // Replace with your actual badge image
                alt="Get it on Google Play"
                width={135}
                height={40}
                className="h-10 w-auto"
              />
            </a>
            <a
              href="https://www.apple.com/app-store/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Image
                src="/assets/register_on_app/Group (2).png"
                alt="Available on the App Store"
                width={135}
                height={40}
                className="h-10 w-auto"
              />
            </a>
          </div>

          <button className="rounded-lg bg-white px-8 py-5 text-sm font-semibold text-black shadow-xl hover:bg-gray-100 transition duration-300">
            Registered Your Self
          </button>
        </div>

        {/* */}

        <div className=" justify-center  2xl:justify-end hidden 2xl:flex ">
        <div className="absolute   2xl:top-[-30%] 2xl:right-[0%] md:visible lg:-top-[20%] lg:right-[-30%] ">
          <Image
            src={`/assets/register_on_app/88fdffcdc0c5b90c8535fa35bc3156993880fd35.png`}
            alt="Mr. Nana Mobile App Screenshot"
            height={900}
            width={900}
            objectFit="contain"
            priority
            className="drop-shadow-2xl "
          />
        </div>
      </div>

        {/* </div> */}
      </div>
    </section>
  );
};

export default RegisterOnApp;
