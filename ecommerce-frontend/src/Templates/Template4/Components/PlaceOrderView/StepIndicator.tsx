import React from "react";

interface Step {
  id: number;
  title: string;
  completed: boolean;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
}) => (
  <div className="hidden md:block bg-vintageBg rounded-lg shadow-sm border-2 border-vintageBorder p-6 mb-6">
    <div className="flex justify-between items-center">
      {steps.map((step) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-semibold
                ${
                  step.completed
                    ? "bg-green-500 text-white border-green-500"
                    : currentStep === step.id
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-200 text-gray-600 border-gray-300"
                }`}
            >
              {step.completed ? "✓" : step.id + 1}
            </div>
            <span className="text-sm mt-2 text-center text-vintageText font-medium">
              {step.title}
            </span>
          </div>
          {step.id < steps.length - 1 && (
            <div
              className={`flex-1 h-1 mx-4 ${
                step.completed ? "bg-green-500" : "bg-gray-300"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  </div>
);

export default StepIndicator;
