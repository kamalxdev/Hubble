import { v2 as cloudinary } from "cloudinary";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function getFile(publicID: string) {
  // Optimize delivery by resizing and applying auto-format and auto-quality
  const optimizeUrl = await cloudinary.url(publicID, {
    transformation: [
      {
        fetch_format: "auto",
        quality: "auto",
      },
      {
        width: 1200,
        height: 1200,
        crop: "fill",
        gravity: "auto:faces",
      },
    ],
  });
  return optimizeUrl;
}

export async function upload(path: string) {
  // Upload an image
  const uploadResult = await cloudinary.uploader
    .upload(path, { folder: "avatar" })
    .catch((error) => {
      console.log(error);
    });

  const fileURL = await getFile(uploadResult?.public_id as string);
  return { fileURL, uploadResult };
}

export async function deleteFile(url: string) {
  let trimmedURL = url.slice(
    url.indexOf("avatar"),
    url.indexOf("?_a=BAMAH2a40")
  );
  const result = await cloudinary.uploader.destroy(trimmedURL);
  if (result?.result == "ok") {
    return { success: true };
  }
  return { success: false };
}
