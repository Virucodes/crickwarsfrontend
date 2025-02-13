import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ThankYouPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect back to home after 5 seconds (Optional)
    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-100">
      <h1 className="text-4xl font-bold text-green-800 mb-4">Thank You!</h1>
      <p className="text-lg text-gray-700">All the best for the further process!</p>
      <p className="text-gray-500 mt-2">Redirecting to home in 5 seconds...</p>
    </div>
  );
};

export default ThankYouPage;
