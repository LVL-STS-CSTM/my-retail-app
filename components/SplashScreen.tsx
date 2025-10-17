import React from 'react';

interface SplashScreenProps {
  isFadingOut: boolean;
}

/**
 * @description A full-screen splash/loading component that displays the company logo.
 * It fades out smoothly when loading is complete.
 */
const SplashScreen: React.FC<SplashScreenProps> = ({ isFadingOut }) => {
  return (
    <div
      // The background fades out based on the isFadingOut prop.
      // The duration is 1500ms to match the logo's fade-out phase (from 0.5s to 2s).
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-white transition-opacity duration-[1500ms] ease-in-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-hidden={isFadingOut}
    >
      {/* 
        The logo animation class is now applied unconditionally.
        It will run for its full 2-second duration because the component's
        lifecycle is now controlled by a separate state in App.tsx.
      */}
      <div className="relative w-32 h-32 md:w-48 md:h-48 animate-splash-fade-spin-out">
        <img
          src="https://i.imgur.com/9FhbGuI.png"
          alt="LEVEL CUSTOMS Logo"
          className="relative w-full h-full object-contain"
        />
      </div>
    </div>
  );
};

export default SplashScreen;