import { useEffect, useState } from "react";
import Lottie from "lottie-react";

interface EntryEffectRendererProps {
  animation: {
    url: string;
    type: "LOTTIE" | "GIF" | "VIDEO";
  };
  onComplete?: () => void;
  className?: string;
  duration?: number; // Duration in seconds before auto-removing (default: 3)
}

/**
 * EntryEffectRenderer Component
 * 
 * Renders Entry Effect animations based on type:
 * - LOTTIE: Uses lottie-react library
 * - VIDEO: Uses HTML5 video element
 * - GIF: Uses img element
 * 
 * Features:
 * - Plays once (no loop)
 * - Auto-removes after duration
 * - Centered on screen
 */
export const EntryEffectRenderer = ({
  animation,
  onComplete,
  className = "",
  duration = 3,
}: EntryEffectRendererProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lottieData, setLottieData] = useState<any>(null);
  const [lottieError, setLottieError] = useState(false);

  // Fetch Lottie JSON data if type is LOTTIE
  useEffect(() => {
    if (animation.type === "LOTTIE" && animation.url) {
      fetch(animation.url)
        .then((res) => res.json())
        .then((data) => {
          setLottieData(data);
        })
        .catch((error) => {
          console.error("Failed to load Lottie animation:", error);
          setLottieError(true);
        });
    }
  }, [animation.url, animation.type]);

  // Auto-remove after duration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) {
        onComplete();
      }
    }, duration * 1000);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  if (!isVisible) {
    return null;
  }

  const baseStyles = "fixed inset-0 z-50 flex items-center justify-center pointer-events-none";

  switch (animation.type) {
    case "LOTTIE":
      if (lottieError) {
        return (
          <div className={`${baseStyles} ${className}`}>
            <div className="text-white text-sm">Failed to load animation</div>
          </div>
        );
      }

      if (!lottieData) {
        return (
          <div className={`${baseStyles} ${className}`}>
            <div className="text-white text-sm">Loading animation...</div>
          </div>
        );
      }

      return (
        <div className={`${baseStyles} ${className}`}>
          <Lottie
            animationData={lottieData}
            loop={false}
            autoplay={true}
            style={{ width: "100%", height: "100%", maxWidth: "800px", maxHeight: "800px" }}
          />
        </div>
      );

    case "VIDEO":
      return (
        <div className={`${baseStyles} ${className}`}>
          <video
            src={animation.url}
            autoPlay
            muted
            playsInline
            loop={false}
            onEnded={() => {
              setIsVisible(false);
              if (onComplete) {
                onComplete();
              }
            }}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      );

    case "GIF":
      return (
        <div className={`${baseStyles} ${className}`}>
          <img
            src={animation.url}
            alt="Entry Effect"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      );

    default:
      return null;
  }
};

export default EntryEffectRenderer;

