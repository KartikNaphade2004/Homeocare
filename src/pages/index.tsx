import { useState } from "react";
import MultiStepForm from "../components/MultiStepForm";
import Header from "@/components/Header";

const Home: React.FC = () => {
  const [suggestion, setSuggestion] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleFormSubmit = async (answers: Record<string, string>) => {
    setLoading(true);
    setError("");
    setSuggestion("");

    try {
      const response = await fetch("/api/suggest-medicine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get suggestion");
      }

      if (data.error) {
        setError(data.error);
      } else {
        setSuggestion(data.suggestion || "No suggestion available.");
      }
    } catch (err: any) {
      console.error("Error submitting form:", err);
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <MultiStepForm onSubmit={handleFormSubmit} />
      
      {loading && (
        <div className="max-w-2xl mx-auto p-4 mt-8">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <p className="text-blue-800">Processing your request... Please wait.</p>
          </div>
        </div>
      )}

      {error && (
        <div className="max-w-2xl mx-auto p-4 mt-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <h3 className="text-red-800 font-semibold mb-2">Error</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {suggestion && !loading && (
        <div className="max-w-2xl mx-auto p-4 mt-8">
          <div className="bg-green-50 border border-green-200 rounded-md p-6">
            <h2 className="text-2xl font-bold text-green-800 mb-4">Suggested Medicine</h2>
            <p className="text-gray-800 whitespace-pre-wrap">{suggestion}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
