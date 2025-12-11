import React from "react";
import Image from "next/image";

const Story = () => {
  return (
    <div className="container mx-auto">
      <div className="py-12 flex justify-center ">
        <div className="bg-orange-50/90 px-10 py-3 rounded-full text-lg font-semibold text-orange-500 shadow-sm">
          Our Story
        </div>
      </div>

      <section className=" px-4 sm:px-6 lg:px-8 grid xl:grid-cols-2 gap-12 ">
        <div className="space-y-6">
          <div className="relative  rounded-xl h-90 ">
            <img
              src="/assets/home/our_story/d10f2c08d6ed5db2264f1e5628f7f832a2959af1 (1).png"
              alt="A farmer proudly standing in a field"
              className="absolute inset-0 w-full h-full object-cover z-50 rounded-xl"
            />
            <div className="absolute inset-0 bg-green-600 z-45"></div>
            <div className="relative p-8 flex items-center justify-center h-full">
              <h2 className="text-white text-5xl sm:text-7xl lg:text-8xl font-bold  absolute top-7 left-0 z-100">
                100%
                <br />
                Organic
              </h2>
              <div
                className="absolute left-[55%] bottom-[-100] z-100"
                style={{
                  clipPath: "inset(0 0 100px 0)",
                }}
              >
                <Image
                  src={`/assets/home/our_story/59373efab59c6414e276ddc24d0285cf62ee6194.png`}
                  alt="our story"
                  height={300}
                  width={300}
                  className="object-cover w-200 h-250 "
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="overflow-hidden rounded-xl">
              <img
                src="/assets/home/our_story/80f41a02c14b60f52f9d87428cd6ef6dde6cead5.jpg"
                alt="Farmer harvesting crops"
                // fill
                className="w-300 h-50 object-cover"
              />
            </div>
            <div className=" rounded-xl">
              <img
                src="/assets/home/our_story/17870f44ff1cbbbecb2ba957fe078f85d76a5f57.jpg"
                alt="Bowl of lentils, spices, and fresh vegetables"
                // fill
                className="w-300 h-50 object-cover rounded-xl"
              />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">
              From Farm to Your Kitchen
            </h2>
            <p className="text-gray-600">
              Since 2010, Spice Vault has been on a mission to bring the finest
              Asian spices directly to your kitchen. We work closely with over
              500 trusted farmers across Asia, ensuring sustainable practices
              and fair trade.
            </p>
            <p className="text-gray-600">
              Every spice in our collection is hand-selected, quality tested,
              and packaged with care to preserve its authentic flavor and aroma.
              We believe that great cooking starts with great ingredients.
            </p>
            <p className="text-gray-600">
              Our commitment to quality has earned us the trust of home cooks
              and professional chefs alike. Join our community and experience
              the difference that authentic, premium spices can make in your
              cooking.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-4">
            <div className="flex items-center space-x-4">
              <div className="bg-orange-50 p-3 rounded-lg shadow-sm">
                <span className="text-xl text-orange-600">
                  <Image
                    src={`/assets/home/our_story/fluent_leaf-two-32-filled.png`}
                    alt="Aprtner farms"
                    height={200}
                    width={200}
                    className="object-contain w-15 h-10"
                  />
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">500+</p>
                <p className="text-sm text-orange-500">Partner Farms</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-orange-50 p-3 rounded-lg shadow-sm">
                <span className="text-xl text-orange-600">
                  <Image
                    src={`/assets/home/our_story/ix_customer-filled.png`}
                    alt="Aprtner farms"
                    height={200}
                    width={200}
                    className="object-contain w-15 h-10"
                  />
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">50K+</p>
                <p className="text-sm text-orange-500">Happy Customer</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-orange-50 p-3 rounded-lg shadow-sm">
                <span className="text-xl text-orange-600">
                  <Image
                    src={`/assets/home/our_story/Group.png`}
                    alt="Aprtner farms"
                    height={200}
                    width={200}
                    className="object-contain w-15 h-10"
                  />
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">15+</p>
                <p className="text-sm text-orange-500">Years Experience</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-orange-50 p-3 rounded-lg shadow-sm">
                <span className="text-xl text-orange-600">
                  <Image
                    src={`/assets/home/our_story/Vector.png`}
                    alt="Aprtner farms"
                    height={200}
                    width={200}
                    className="object-contain w-15 h-10"
                  />
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">200+</p>
                <p className="text-sm text-orange-500">Spice Verities</p>
              </div>
            </div>
          </div>

          <a
            href="#"
            className="inline-flex items-center justify-center px-8 py-3 mt-4 text-base font-medium text-white bg-orange-500 border border-transparent rounded-lg shadow-lg hover:bg-orange-600 transition-colors"
          >
            Learn More →
          </a>
        </div>
      </section>
    </div>
  );
};

export default Story;
