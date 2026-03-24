import Image from "next/image";
import React from "react";
import TabSwitching from "./TabSwitching";
// import { Link } from "lucide-react";
import Link from "next/link";

const PartnerRegistration = () => {
  return (
    <div className="container mx-auto">
      <div className="max-w-6xl mx-auto py-8 flex items-center">
        <Link href="/">
          <Image
            src={"/assets/logo/Group 87.png"}
            alt="Logo"
            width={120}
            height={40}
            className="object-contain"
          />
        </Link>
      </div>
      <hr className="border-gray-300 " />

      <TabSwitching />
    </div>
  );
};

export default PartnerRegistration;
