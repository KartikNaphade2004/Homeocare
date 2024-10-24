import { useState } from "react";
import MultiStepForm from "../components/MultiStepForm";
import Header from "@/components/Header";

const Home: React.FC = () => {
  const [suggestion, setSuggestion] = useState<string>("");

  const handleFormSubmit = async (answers: Record<string, string>) => {
    const response = await fetch("/api/suggest-medicine", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ answers }),
    });

    const data = await response.json();
    setSuggestion(data.suggestion);
  };

  return (
    <div>
      <Header />
      <MultiStepForm onSubmit={handleFormSubmit} />
      {suggestion && (
        <div>
          <h2>Suggested Medicine</h2>
          <p>{suggestion}</p>
        </div>
      )}
    </div>
  );
};

export default Home;
