import Image from "next/image";
import React from "react";
import TabSwitching from "./TabSwitching";


const PartnerRegistration = () => {
  return (
    <div className="container mx-auto">
      <div className="max-w-6xl mx-auto py-8 flex items-center">
        <Image
          src={"/assets/logo/Group 87.png"}
          alt="Logo"
          width={120}
          height={40}
          className="object-contain"
        />
      </div>
      <hr className="border-gray-300 " />

      <TabSwitching />
      
    </div>
  );
};

export default PartnerRegistration;
