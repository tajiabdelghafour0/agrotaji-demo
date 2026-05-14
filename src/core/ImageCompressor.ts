import imageCompression from "browser-image-compression";

export async function compressPlantImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 0.09, // ~90KB
    maxWidthOrHeight: 800,
    useWebWorker: true,
    fileType: 'image/jpeg'
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error("Compression failed:", error);
    throw new Error("فشل ضغط الصورة، يرجى المحاولة مرة أخرى.");
  }
}
