// apps/web/app/partner-registration/page.tsx

import React from "react";
import PartnerRegistration from "@/components/layout/partner_registration/PartnerRegistration";
/* import HeroSection from "@/components/layout/contact_us/HeroSection";

import Nav from "@/components/ui/Nav";
import Footer from "@/components/ui/Footer";

import Image from "next/image"; */

const page = () => {
  return <PartnerRegistration />;
  // return (
  //   <div className="relative">
  //     <div>
  //       <Nav />
  //     </div>
  //     <div className="absolute inset-0 h-screen -z-10">
  //       <Image
  //         src={`/assets/home/homeheaderimages/a8de5a3724f7239b78cdee795f978b5faba485b4 (1).webp`}
  //         alt="Asain Spices"
  //         fill
  //         className="object-cover w-full h-full"
  //       />
  //     </div>

  //     <div>
  //       <PartnerRegistration />
  //     </div>
  //     <HeroSection />
  //     <Footer />
  //   </div>)
};

export default page;
