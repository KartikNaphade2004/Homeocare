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
            <p className="text-red-700 mb-3">{error}</p>
            {error.includes('quota') || error.includes('billing') ? (
              <div className="mt-3 pt-3 border-t border-red-200">
                <p className="text-sm text-red-600 mb-2 font-medium">How to fix this:</p>
                <ol className="list-decimal list-inside text-sm text-red-700 space-y-1">
                  <li>Visit <a href="https://platform.openai.com/account/billing" target="_blank" rel="noopener noreferrer" className="underline font-medium">OpenAI Billing</a></li>
                  <li>Add a payment method or add credits to your account</li>
                  <li>Check your usage limits and remaining quota</li>
                  <li>Wait a few minutes if you've hit rate limits</li>
                </ol>
              </div>
            ) : error.includes('API key') || error.includes('Invalid') ? (
              <div className="mt-3 pt-3 border-t border-red-200">
                <p className="text-sm text-red-600 mb-2 font-medium">How to fix this:</p>
                <ol className="list-decimal list-inside text-sm text-red-700 space-y-1">
                  <li>Go to your Vercel project settings</li>
                  <li>Navigate to Settings → Environment Variables</li>
                  <li>Add or update <code className="bg-red-100 px-1 rounded">OPENAI_API_KEY</code></li>
                  <li>Redeploy your application</li>
                </ol>
              </div>
            ) : null}
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
