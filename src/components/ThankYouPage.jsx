import React, { useEffect } from 'react';

const ThankYouPage = () => {
  useEffect(() => {
    // Clear the entire history stack
    window.history.pushState(null, '', window.location.pathname);
    window.history.pushState(null, '', window.location.pathname);
    window.history.pushState(null, '', window.location.pathname);
    window.history.go(-2);

    // Handle any attempts to navigate back
    const preventNavigation = (e) => {
      e.preventDefault();
      // Push another state to prevent going back
      window.history.pushState(null, '', window.location.pathname);
    };

    // Block all attempts to navigate away
    const handleBeforeUnload = (e) => {
      const confirmationMessage = 'The auction process is complete. Are you sure you want to leave?';
      e.returnValue = confirmationMessage;
      return confirmationMessage;
    };

    // Disable right click
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    // Disable keyboard shortcuts
    const handleKeyDown = (e) => {
      // Prevent F12
      if (e.keyCode === 123) {
        e.preventDefault();
      }

      // Prevent Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 85)) {
        e.preventDefault();
      }

      // Prevent Ctrl+S
      if (e.ctrlKey && e.keyCode === 83) {
        e.preventDefault();
      }
    };

    // Disable copy paste
    const handleCopy = (e) => {
      e.preventDefault();
    };

    // Add all event listeners
    window.addEventListener('popstate', preventNavigation);
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCopy);
    document.addEventListener('paste', handleCopy);

    // Cleanup
    return () => {
      window.removeEventListener('popstate', preventNavigation);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCopy);
      document.removeEventListener('paste', handleCopy);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6 select-none">
      <div className="text-center animate-fade-in">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white flex items-center justify-center mx-auto mb-6 shadow-lg animate-scale-in">
          <span className="text-4xl md:text-5xl text-green-600">✓</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">
          Thank You!
        </h1>
        <p className="text-gray-500 text-base md:text-lg">
          You can close the tab
        </p>
      </div>
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scale-in {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ThankYouPage;