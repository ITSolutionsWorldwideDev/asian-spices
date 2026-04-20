// apps/web/components/layout/partner_registration/TabSwitching.tsx

"use client";
import { useState } from "react";
import { Check, Form } from "lucide-react";
import Prerequisites from "./Prerequisites";
import BusinessVerification from "./BusinessVerification";
import DocumentUpload from "./DocumentUpload";
import ContactDetails from "./ContactDetails";
import IdentityVerification from "./IdentityVerification";
import Confirmation from "./Confirmation";
// import { useState } from "react";
export default function TabSwitching() {
  const steps = [
    { id: 1, label: "Prerequisites" },
    { id: 2, label: "Business Verification" },
    { id: 3, label: "Document Upload" },
    { id: 4, label: "Contact Details" },
    { id: 5, label: "Identity Verification" },
    { id: 6, label: "Confirmation" },
  ];

  // const [formData, setFormData] = useState([]);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [activeStep, setActiveStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const stepComponents = (
    formData: any,
    setFormData: any,
    activeStep: number,
    setActiveStep: React.Dispatch<React.SetStateAction<number>>,
  ) => ({
    1: (
      <Prerequisites
        setActiveStep={setActiveStep}
        activeStep={activeStep}
        setCompletedSteps={setCompletedSteps}
      />
    ),
    2: (
      <BusinessVerification
        formData={formData}
        setFormData={setFormData}
        setActiveStep={setActiveStep}
        activeStep={activeStep}
        setCompletedSteps={setCompletedSteps}
      />
    ),
    3: (
      <DocumentUpload
        formData={formData}
        setFormData={setFormData}
        setActiveStep={setActiveStep}
        activeStep={activeStep}
        setCompletedSteps={setCompletedSteps}
      />
    ),
    4: (
      <ContactDetails
        formData={formData}
        setFormData={setFormData}
        setActiveStep={setActiveStep}
        activeStep={activeStep}
        setCompletedSteps={setCompletedSteps}
      />
    ),
    5: (
      <IdentityVerification
        setActiveStep={setActiveStep}
        activeStep={activeStep}
        formData={formData}
        setCompletedSteps={setCompletedSteps}
        setFormData={setFormData}
      />
    ),
    6: (
      <Confirmation
        formData={formData}
        setActiveStep={setActiveStep}
        activeStep={activeStep}
      />
    ),
  });
  // const [activeStep, setActiveStep] = useState(1);

  return (
    <div className="w-full p-4 sm:p-8">
      {/* Stepper - scrollable on mobile */}
      <div className="w-full overflow-x-auto pb-2">
        <div className="flex items-center justify-between relative min-w-140 max-w-6xl mx-auto px-2">
          {/* Background Line */}
          <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-300 -z-10" />

          {steps.map((step) => {
            const isActive = activeStep === step.id;
            // const isCompleted = activeStep > step.id;
            const isCompleted = completedSteps.includes(step.id);
            const isClickable =
              step.id < activeStep || completedSteps.includes(step.id - 1);
            return (
              <div
                key={step.id}
                className={`flex flex-col items-center ${
                  isClickable
                    ? "cursor-pointer"
                    : "cursor-not-allowed opacity-50"
                }`}
                // className="flex flex-col items-center cursor-pointer"
                onClick={() => {
                  if (!isClickable) return;
                  setActiveStep(step.id);
                }}
                // onClick={() => setActiveStep(step.id)}
              >
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-xs sm:text-sm font-semibold transition-all duration-300
                    ${isActive ? "bg-orange-500 text-white" : isCompleted ? "bg-[#FF6900] text-white" : "bg-gray-300 text-gray-600"}
                  `}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : step.id}
                </div>
                <p
                  className={`mt-2 text-[10px] sm:text-sm text-center whitespace-nowrap
                    ${isActive ? "text-[#FF6900] font-semibold" : "text-gray-500"}
                  `}
                >
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <form className="mt-8 sm:mt-12 max-w-4xl mx-auto bg-white p-5 sm:p-8 rounded-lg shadow">
        {
          stepComponents(formData, setFormData, activeStep, setActiveStep)[
            activeStep as keyof ReturnType<typeof stepComponents>
          ]
        }
      </form>
    </div>
  );
}
