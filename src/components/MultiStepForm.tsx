import { useState } from "react";

interface Question {
  section: string;
  questions: string[];
}

const questions: Question[] = [
  {
    section: "Chief Complaint",
    questions: [
      "What is the main reason you are seeking homeopathic treatment?",
      "When did this issue start?",
      "How does it affect your daily life?",
    ],
  },
  {
    section: "Medical History",
    questions: [
      "Do you have any chronic illnesses or conditions?",
      "List any surgeries or hospitalizations you've had.",
      "Are you currently taking any medications?",
    ],
  },
  {
    section: "Mental and Emotional State",
    questions: [
      "Describe your overall mood and emotions.",
      "Do you have any stressors or emotional challenges?",
      "How do you cope with stress?",
    ],
  },
  {
    section: "Diet and Digestion",
    questions: [
      "Describe your typical diet and eating habits.",
      "Do you have any digestive issues or food intolerances?",
      "Are there any foods that you crave or dislike?",
    ],
  },
  {
    section: "Sleep Patterns",
    questions: [
      "Describe your sleep patterns and any sleep disturbances.",
      "Do you have trouble falling asleep or staying asleep?",
      "How refreshed do you feel upon waking up?",
    ],
  },
  {
    section: "Allergies and Sensitivities",
    questions: [
      "Do you have any known allergies or sensitivities?",
      "List any substances that trigger allergic reactions.",
      "How do these allergies/sensitivities affect you?",
    ],
  },
];

interface MultiStepFormProps {
  onSubmit: (answers: Record<string, string>) => void;
}

const MultiStepForm: React.FC<MultiStepFormProps> = ({ onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleInputChange = (index: number, value: string) => {
    setAnswers({
      ...answers,
      [`${currentStep}-${index}`]: value,
    });
  };

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(answers);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-4">
        <nav className="grid grid-cols-4 gap-[12px] ">
          {questions.map((section, index) => (
            <button
              key={index}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                currentStep === index
                  ? "bg-teal-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setCurrentStep(index)}
            >
              {section.section}
            </button>
          ))}
        </nav>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-semibold">
          {questions[currentStep].section}
        </h2>
        {questions[currentStep].questions.map((q, index) => (
          <div key={index}>
            <label className="block text-sm font-medium text-gray-700">
              {q}
            </label>
            <textarea
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-[12px] border h-[80px]"
              value={answers[`${currentStep}-${index}`] || ""}
              placeholder="Enter your answer ..."
              onChange={(e) => handleInputChange(index, e.target.value)}
              rows={4}
            />
          </div>
        ))}
        <div className="flex justify-between">
          {currentStep > 0 ? (
            <button
              type="button"
              onClick={handlePrevious}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
            >
              Previous
            </button>
          ) : (
            <div></div>
          )}
          {currentStep < questions.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 bg-teal-500 text-white rounded-md"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-md"
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default MultiStepForm;
