// import { useEffect, useState } from "react";
// import Lottie from "lottie-react";

// interface LottieThumbnailProps {
//   url: string;
//   className?: string;
// }

// /**
//  * LottieThumbnail Component
//  * 
//  * Renders a Lottie animation as a thumbnail preview.
//  * Used in card grids and preview areas.
//  * 
//  * Requires explicit height (default: h-40) for proper rendering.
//  */
// export const LottieThumbnail = ({ url, className = "" }: LottieThumbnailProps) => {
//   const [lottieData, setLottieData] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
  
//   // Ensure className has a height - default to h-40 if not provided
//   const hasHeight = className.includes('h-') || className.includes('height');
//   const containerClassName = hasHeight ? className : `h-40 ${className}`;

//   useEffect(() => {
//     if (!url) {
//       setError("No URL provided");
//       setLoading(false);
//       return;
//     }

//     // Reset state
//     setLoading(true);
//     setError(null);
//     setLottieData(null);

//     console.log("LottieThumbnail: Fetching from URL:", url);

//     // Fetch with better error handling
//     fetch(url, {
//       method: 'GET',
//       headers: {
//         'Accept': 'application/json',
//       },
//       mode: 'cors', // Explicitly set CORS mode
//     })
//       .then((res) => {
//         console.log("LottieThumbnail: Response status:", res.status, res.statusText);
//         if (!res.ok) {
//           throw new Error(`HTTP ${res.status}: ${res.statusText}`);
//         }
//         // Check content type - but don't fail if it's wrong (workaround for existing files)
//         const contentType = res.headers.get('content-type');
//         if (!contentType || (!contentType.includes('application/json') && !contentType.includes('application/octet-stream'))) {
//           console.warn("LottieThumbnail: Unexpected content-type:", contentType);
//         }
//         // Try to parse as JSON regardless of content-type (handles octet-stream case)
//         return res.text().then(text => {
//           try {
//             return JSON.parse(text);
//           } catch (parseError) {
//             throw new Error(`Failed to parse JSON: ${parseError}`);
//           }
//         });
//       })
//       .then((data) => {
//         console.log("LottieThumbnail: Successfully loaded JSON data");
//         // Validate that it's actually JSON data (Lottie format)
//         if (!data || typeof data !== 'object') {
//           throw new Error('Invalid Lottie JSON format: data is not an object');
//         }
//         // Validate Lottie format - must have layers array
//         if (!Array.isArray(data.layers)) {
//           throw new Error('Invalid Lottie JSON format: missing layers array');
//         }
//         setLottieData(data);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("LottieThumbnail: Failed to load Lottie animation", {
//           url,
//           error: error.message,
//           errorType: error.name,
//           stack: error.stack
//         });
//         setError(error.message || "Failed to load animation");
//         setLoading(false);
//       });
//   }, [url]);

//   if (error) {
//     return (
//       <div className={`${containerClassName} bg-gray-100 flex flex-col items-center justify-center p-2`}>
//         <span className="text-gray-400 text-xs text-center">Failed to load</span>
//         <span className="text-gray-300 text-[10px] mt-1 text-center break-all px-1 max-h-20 overflow-auto">
//           {error}
//         </span>
//         <a 
//           href={url} 
//           target="_blank" 
//           rel="noopener noreferrer"
//           className="text-blue-500 text-[10px] mt-1 underline"
//           onClick={(e) => e.stopPropagation()}
//         >
//           Open URL
//         </a>
//       </div>
//     );
//   }

//   if (loading || !lottieData) {
//     return (
//       <div className={`${containerClassName} bg-gray-100 flex items-center justify-center`}>
//         <span className="text-gray-400 text-xs">Loading animation…</span>
//       </div>
//     );
//   }

//   return (
//     <div className={`${containerClassName} w-full overflow-hidden`}>
//       <Lottie
//         animationData={lottieData}
//         loop={true}
//         autoplay={true}
//         style={{ width: "100%", height: "100%" }}
//       />
//     </div>
//   );
// };

// export default LottieThumbnail;



import { useEffect, useState } from "react";
import Lottie from "lottie-react";

interface LottieThumbnailProps {
  url: string;
  className?: string;
  height?: number; // height in px (optional, default: 160)
}

/**
 * LottieThumbnail Component
 *
 * Renders a Lottie animation as a thumbnail preview.
 * Used in card grids, modals, and preview areas.
 *
 * IMPORTANT:
 * Lottie has no intrinsic height.
 * This component ALWAYS enforces a guaranteed pixel height.
 */
export const LottieThumbnail = ({
  url,
  className = "",
  height = 160,
}: LottieThumbnailProps) => {
  const [lottieData, setLottieData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url || typeof url !== "string" || url.trim() === "") {
      setError("No URL provided");
      setLoading(false);
      return;
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      setError("Invalid URL format");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setLottieData(null);

    console.log("[LottieThumbnail] Fetching Lottie from URL:", url);

    fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      mode: "cors",
      credentials: "omit", // Don't send credentials to avoid CORS issues
    })
      .then((res) => {
        console.log("[LottieThumbnail] Response status:", res.status, res.statusText);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        const contentType = res.headers.get("content-type");
        console.log("[LottieThumbnail] Content-Type:", contentType);
        return res.text();
      })
      .then((text) => {
        console.log("[LottieThumbnail] Received text length:", text.length);
        let data;
        try {
          data = JSON.parse(text);
        } catch (parseErr) {
          console.error("[LottieThumbnail] JSON parse error:", parseErr);
          throw new Error("Failed to parse Lottie JSON");
        }

        if (!data || typeof data !== "object") {
          throw new Error("Invalid Lottie JSON format");
        }

        if (!Array.isArray(data.layers)) {
          console.warn("[LottieThumbnail] Missing layers array in Lottie JSON, but continuing anyway");
          // Don't throw - some valid Lottie files might not have layers at root
        }

        console.log("[LottieThumbnail] Successfully loaded Lottie data");
        setLottieData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("[LottieThumbnail] Load error:", {
          url,
          error: err.message,
          name: err.name,
          stack: err.stack,
        });
        // Provide more specific error messages
        let errorMessage = "Failed to load animation";
        if (err.name === "TypeError" && err.message.includes("fetch")) {
          errorMessage = "CORS error: S3 bucket must allow cross-origin requests for JSON files. Please configure S3 CORS policy to allow GET requests from your domain.";
        } else if (err.message) {
          errorMessage = err.message;
        }
        setError(errorMessage);
        setLoading(false);
      });
  }, [url]);

  if (loading) {
    return (
      <div
        className={`w-full flex items-center justify-center bg-gray-100 ${className}`}
        style={{ height, minHeight: height }}
      >
        <span className="text-gray-400 text-xs">Loading animation…</span>
      </div>
    );
  }

  if (error || !lottieData) {
    return (
      <div
        className={`w-full flex flex-col items-center justify-center bg-gray-100 p-2 ${className}`}
        style={{ height, minHeight: height }}
      >
        <span className="text-gray-400 text-xs text-center font-semibold">Failed to load</span>
        {error && (
          <span className="text-gray-300 text-[10px] mt-1 text-center break-words max-h-20 overflow-auto px-2">
            {error.includes("CORS") ? (
              <>
                <div className="font-semibold mb-1">CORS Configuration Required</div>
                <div className="text-[9px]">S3 bucket needs CORS policy allowing JSON files</div>
              </>
            ) : (
              error
            )}
          </span>
        )}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 text-[10px] mt-2 underline hover:text-blue-700"
          onClick={(e) => e.stopPropagation()}
        >
          Open JSON URL
        </a>
      </div>
    );
  }

  return (
    <div
      className={`w-full overflow-hidden ${className}`}
      style={{ height, minHeight: height }}
    >
      <Lottie
        animationData={lottieData}
        autoplay
        loop
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default LottieThumbnail;
