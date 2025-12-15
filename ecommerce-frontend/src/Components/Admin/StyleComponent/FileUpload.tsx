import React, { useState, useEffect } from "react";

interface FileUploadProps {
  onFileSelect: (file: File | null, index?: number) => void;
  accept?: string;
  currentFile?: string | null;
  index?: number;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept,
  currentFile,
  index = 0,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const selectedFile = e.dataTransfer.files[0];
      handleFile(selectedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      handleFile(selectedFile);
    }
  };

  const handleFile = (selectedFile: File) => {
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    onFileSelect(selectedFile, index);
  };

  const removeFile = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setFile(null);
    setPreview(null);
    onFileSelect(null, index);
  };

  useEffect(() => {
    if (currentFile) {
      setPreview(currentFile);
    } else {
      setPreview(null);
      setFile(null);
    }
  }, [currentFile]);

  useEffect(() => {
    return () => {
      if (preview && !currentFile) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview, currentFile]);

  return (
    <div className="font-gilroyRegular tracking-wider relative">
      {preview ? (
        <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden group">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
            width="auto"
            height="auto"
          />
          <button
            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md"
            onClick={removeFile}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-x-icon lucide-x h-4"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-4 w-full h-32 flex flex-col items-center justify-center transition ${
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-image-icon lucide-image"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
          <p className="text-gray-600 text-xs text-center">
            Drag & drop or{" "}
            <label
              htmlFor={`fileInput-${index}`}
              className="text-blue-600 font-medium cursor-pointer"
            >
              browse
            </label>
          </p>
          <input
            id={`fileInput-${index}`}
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}
    </div>
  );
};
