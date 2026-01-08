// export const getMediaType = (url: string) => {
//     if (!url) return "unknown";
  
//     const cleanUrl = url.split("?")[0].toLowerCase();
  
//     if (/\.(mp4|webm|mov)$/i.test(cleanUrl)) return "video";
//     if (/\.(gif|png|jpg|jpeg|webp)$/i.test(cleanUrl)) return "image";
  
//     return "unknown";
//   };
  


// Handle both string (legacy) and object (new format) animation types
export const getMediaType = (animation: string | { url: string; type?: string } | undefined) => {
    if (!animation) return "unknown";
  
    // If it's an object with type field, use that
    if (typeof animation === "object" && animation !== null) {
      if (animation.type === "LOTTIE") return "lottie";
      if (animation.type === "GIF") return "image";
      if (animation.type === "VIDEO") return "video";
      
      // Fallback to URL-based detection if type not available
      if (animation.url && typeof animation.url === "string") {
        const cleanUrl = animation.url.split("?")[0].toLowerCase();
        if (/\.(mp4|webm|mov)$/i.test(cleanUrl)) return "video";
        if (/\.(json|lottie)$/i.test(cleanUrl)) return "lottie";
        if (/\.(gif|png|jpg|jpeg|webp)$/i.test(cleanUrl)) return "image";
      }
      return "unknown";
    }
  
    // Legacy string format
    if (typeof animation === "string") {
      const cleanUrl = animation.split("?")[0].toLowerCase();
      if (/\.(mp4|webm|mov)$/i.test(cleanUrl)) return "video";
      if (/\.(json|lottie)$/i.test(cleanUrl)) return "lottie";
      if (/\.(gif|png|jpg|jpeg|webp)$/i.test(cleanUrl)) return "image";
    }
  
    return "unknown";
  };
  
  export default getMediaType;