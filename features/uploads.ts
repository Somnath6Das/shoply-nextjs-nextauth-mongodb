import axios from "axios";

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await axios.post("/api/products/uploads", formData);
    return res.data.imageUrl;
  } catch (err) {
    console.log("Upload error:", err);
    throw new Error("Image upload failed");
  }
}
