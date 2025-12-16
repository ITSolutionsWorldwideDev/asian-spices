import React from "react";
import Image from "next/image";


import FormSideImage from "@/components/ui/FormSideImage";
import LoginForm from "@/components/layout/login/LoginForm";

export default function LogInPage() {
  return (
    <div className="bg-gray-100">
      <div>
        
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 container mx-auto p-10 bg-gray-100">
        
        <LoginForm />

        <FormSideImage />
      </div>
    </div>
  );
}
