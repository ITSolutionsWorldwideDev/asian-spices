"use client";

import { useState } from "react";
import { ChartBar, FileChartColumn } from "lucide-react";
import { useReadAloud } from "@/hooks/SpeakLoud";
import ReadAloudBtn from "./ReadAloudBtn";
export default function DocumentUploadPage({
  formData,
  setFormData,
  activeStep,
  setActiveStep,
}: any) {
  const [chamberFiles, setChamberFiles] = useState<
    { name: string; size: number; type: string }[]
  >([]);
  const [poaFiles, setPoaFiles] = useState<
    { name: string; size: number; type: string }[]
  >([]);
  // const { isSpeaking, handleReadAloud } = useReadAloud();
  console.log(chamberFiles);
  console.log(poaFiles);
  // console.log("dfa", formData);
  // console.log(formData.chamberFiles);
  // console.log(formData.power_of_attorney_document);
  // Format file size

  const formatSize = (size: number) => {
    if (size < 1024) return size + " B";
    if (size < 1024 * 1024) return (size / 1024).toFixed(1) + " KB";
    return (size / (1024 * 1024)).toFixed(1) + " MB";
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // const handleChange = (field: string, value: string) => {
  //   setFormData((prev: any) => ({
  //     ...prev,
  //     [field]: value,
  //   }));
  // };
  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "chamber" | "poa",
  ) => {
    if (!e.target.files) return;

    const fileObjects = Array.from(e.target.files).map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
    }));
    const base64s = await Promise.all(
      Array.from(e.target.files).map((file) => fileToBase64(file)),
    );

    if (type === "chamber") {
      const updatedFiles = [...chamberFiles, ...fileObjects];

      if (updatedFiles.length > 5) {
        alert("You can only upload a maximum of 5 files.");
        setChamberFiles(chamberFiles);
        setFormData((prevForm: any) => ({
          ...prevForm,
          chamber_of_commerce_extract_document: [...chamberFiles],
        }));
      } else {
        setChamberFiles(updatedFiles);
        setFormData((prevForm: any) => ({
          ...prevForm,
          chamberFiles: [...(prevForm.chamberFiles || []), ...base64s],
        }));
      }
    } else {
      const totalfiles = [...poaFiles, ...fileObjects];
      if (totalfiles.length > 5) {
        alert("You can only upload a maximum of 5 files.");
        return poaFiles;
      }

      setPoaFiles(totalfiles);
      setFormData((prevForm: any) => ({
        ...prevForm,
        power_of_attorney_document: [
          ...(prevForm.power_of_attorney_document || []),
          ...base64s,
        ],
      }));
    }
  };

  const removeFile = (index: number, type: "chamber" | "poa") => {
    if (type === "chamber") {
      setChamberFiles(chamberFiles.filter((_, i) => i !== index));
    } else {
      setPoaFiles(poaFiles.filter((_, i) => i !== index));
    }
  };

  const UploadBox = ({
    title,
    description,
    files,
    type,
    required,
  }: {
    title: string;
    description: string;
    files: { name: string; size: number; type: string }[];
    type: "chamber" | "poa";
    required?: boolean;
  }) => (
    <div className="space-y-3">
      <div>
        <label className="font-semibold text-gray-800">
          {title} {required && <span className="text-red-500">*</span>}
        </label>
        <p className="text-sm text-gray-500">{description}</p>
      </div>

      <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-40 cursor-pointer hover:bg-gray-50 transition text-center px-4">
        <input
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFileChange(e, type)}
        />
        <p className="text-gray-600">Click to upload or drag and drop</p>
        <p className="text-xs text-gray-400 mt-1">
          JPG, PNG, HEIC, or PDF (max. 10MB each)
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {files.length} / 5 files uploaded
        </p>
      </label>

      {/* File List */}
      {files.map((file, index) => (
        <div
          key={index}
          className="flex justify-between items-center border rounded-lg px-4 py-2 bg-gray-50"
        >
          <div>
            <div className="flex items-center gap-2">
              <div>
                <FileChartColumn className="text-[#FF6900]" />
              </div>
              <div>
                <p className="text-sm text-gray-700">{file.name}</p>
                <p className="text-xs text-gray-400">{formatSize(file.size)}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => removeFile(index, type)}
            className="text-[#FF6900] text-lg font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-gray-100 flex justify-center p-6" id="document-upload">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-md p-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Document Upload</h1>
          <p className="text-gray-500 mt-2">
            Upload the required business documents to verify your company and
            authority.
          </p>
          <div className="mt-3">
            <ReadAloudBtn ID={"document-upload"} />
          </div>
        </div>

        {/* Alert */}
        <div className="bg-orange-50 border border-orange-200 text-orange-700 p-4 rounded-lg text-sm">
          <p className="font-semibold">Privacy & GDPR Compliance</p>
          <p className="mt-1">
            Do NOT upload photos of personal IDs or passports. Only upload
            business-related documents such as Chamber of Commerce extracts and
            Power of Attorney documents.
          </p>
        </div>

        {/* Upload Sections */}
        <UploadBox
          title="Chamber of Commerce Extract"
          description="Please ensure your KvK extract is not older than 6 months."
          files={chamberFiles}
          type="chamber"
          required
        />

        <UploadBox
          title="Power of Attorney (Optional)"
          description="Only required if you are not the legal owner or director of the company."
          files={poaFiles}
          type="poa"
        />

        {/* File Requirements */}
        <div className="bg-gray-50 border rounded-lg p-4 text-sm text-gray-600 space-y-1">
          <p className="font-semibold text-gray-700">File Requirements:</p>
          <p>✔ Accepted formats: JPG, JPEG, PNG, HEIC, PDF</p>
          <p>✔ Maximum file size: 10MB per file</p>
          <p>✔ Maximum files: 5 documents</p>
          <p>✔ KvK extract must be less than 6 months old</p>
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            className="px-5 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setActiveStep(activeStep - 1)}
          >
            ← Back
          </button>

          <button
            disabled={chamberFiles.length === 0 || poaFiles.length === 0}
            className={`px-6 py-2 rounded-lg text-white transition ${
              chamberFiles.length === 0 || poaFiles.length === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600"
            }`}
            onClick={() => setActiveStep(activeStep + 1)}
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}
