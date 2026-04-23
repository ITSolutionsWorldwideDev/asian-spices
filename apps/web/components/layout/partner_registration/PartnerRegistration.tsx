// apps/web/components/layout/partner_registration/PartnerRegistration.tsx

import Image from "next/image";
import React from "react";
import TabSwitching from "./TabSwitching";
import Link from "next/link";
import Nav from "@/components/ui/Nav";
import Footer from "@/components/ui/Footer";

const PartnerRegistration = () => {
  return (
    <div>
      <div className="bg-black mb-4">
        <Nav />
      </div>
      <TabSwitching />
      <Footer />
    </div>
  );
};

export default PartnerRegistration;

// return (
//   <div className="container mx-auto">
//     <div className="max-w-6xl mx-auto py-8 flex items-center">
//       <Link href="/">
//         <Image
//           src={"/assets/logo/Group 87.png"}
//           alt="Logo"
//           width={120}
//           height={40}
//           className="object-contain"
//         />
//       </Link>
//     </div>
//     <hr className="border-gray-300 " />

//     <TabSwitching />
//   </div>
// );
