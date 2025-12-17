// export const getMediaType = (url: string) => {
//     if (!url) return "unknown";
  
//     const cleanUrl = url.split("?")[0].toLowerCase();
  
//     if (/\.(mp4|webm|mov)$/i.test(cleanUrl)) return "video";
//     if (/\.(gif|png|jpg|jpeg|webp)$/i.test(cleanUrl)) return "image";
  
//     return "unknown";
//   };
  


export const getMediaType = (url: string) => {
    if (!url) return "unknown";
  
    const cleanUrl = url.split("?")[0].toLowerCase();
  
    if (/\.(mp4|webm|mov)$/i.test(cleanUrl)) return "video";
    if (/\.(gif|png|jpg|jpeg|webp)$/i.test(cleanUrl)) return "image";
  
    return "unknown";
  };
  
  export default getMediaType;