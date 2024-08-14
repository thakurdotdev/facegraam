import React, { useEffect, useState } from "react";

const LoadingScreen = ({ isLoading }) => {
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    let timer;

    if (isLoading) {
      setShowLoading(true);
    } else {
      timer = setTimeout(() => {
        setShowLoading(false);
      }, 500);
    }

    return () => clearTimeout(timer);
  }, [isLoading]);

  if (!showLoading) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm flex justify-center items-center">
      <div className="relative w-28 h-28 flex justify-center items-center">
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-white animate-spin" />
        <img
          src={"/facegram.png"}
          alt="Logo"
          className="w-24 h-24 object-contain animate-pulse"
        />
      </div>
    </div>
  );
};

export default LoadingScreen;
