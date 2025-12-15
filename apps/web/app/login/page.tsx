import React from "react";
import Image from "next/image";
import SignupForm from "@/components/layout/signup/SignupForm";


export default function LogInPage() {
  return (
    <div className="bg-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 container mx-auto p-10 bg-gray-100">
        <SignupForm/>

        <div className="w-full h-100 md:h-full relative">
          <Image
            src={`/assets/signup_form/bfd700b0e493c1d48adf286de20d6404d2059543.jpg`}
            alt="sign up "
            fill
            className="rounded-2xl object-cover"
          />
        </div>
      </div>
    </div>
  );
}
