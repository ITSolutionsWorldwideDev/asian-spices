import React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";

interface RecipesDetailProps {
  // params: { slug: string };
  searchParams: { title: string; description: string; image: string };
}

const RecipesDetail = async ({ searchParams }: RecipesDetailProps) => {
  const { title, description, image } = await searchParams;
  if (!searchParams.title) {
    notFound();
  }
  return (
    <div className="container mx-auto bg-black rounded-4xl px-5 py-10">
      <div className=" flex  justify-center ">
        <Image
          src={`/assets/recipes/${image}`}
          alt="loading"
          // fill
          height={500}
          width={800}
          className="object-contain rounded-xl"
        />
      </div>
      <div className=" w-full flex flex-wrap justify-center items-center text-white mt-10">
        <h1 className="font-bold text-3xl">{title}</h1>
      </div>
      <div className="mx-auto w-full lg:w-[40vw] flex  justify-center items-center text-center text-white py-5">
        <p>{description}</p>
      </div>
    </div>
  );
};

export default RecipesDetail;
